# Load Balancing — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [Load Balancing — Interview](./0_sd_load_balancing_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Load Balancing](https://devinterview.io/questions/software-architecture-and-system-design/load-balancing-interview-questions/).

### Load Balancing Fundamentals

<details>
<summary>Define load balancing in the context of modern web services.</summary>

### Define load balancing in the context of modern web services.

**Definition:**

Load balancing spreads incoming work across a pool of servers so no single machine has to carry the whole demand, and so a dead machine can be skipped.

**How it works:**

- Clients use one address. The balancer picks a healthy backend and forwards the connection or the request.
- The usual aims are availability (survive a lost server), scale (add servers instead of a bigger one), and steadier latency.
- Simple policies: round-robin, weighted round-robin, least connections, least response time.
- Stickier or smarter policies: hash the client address, route by URL or header, and take a server out when health checks fail.
- Adaptive policies watch live load. Static ones follow a fixed order and do not care that one server is slower.
- The balancer is now part of the request path. It needs its own redundancy, or it becomes the outage.

**Examples:**

Four API processes sit behind one DNS name. Each request goes to the next healthy process. Pull one process out and the other three keep answering. Clients do not store the four addresses.
</details>

<details>
<summary>What are the primary objectives of implementing load balancing?</summary>

### What are the primary objectives of implementing load balancing?

**Definition:**

The point of a load balancer is to use a pool well: share capacity, drop failed members, and keep latency acceptable as traffic grows.

**How it works:**

- Spread work so one hot server is not saturated while others idle.
- Raise reliability: a health check removes a bad member, and the rest keep serving.
- Cut tail latency by avoiding the overloaded or slow instance.
- Give you a single place to add capacity. Horizontal scale is “add a backend,” not “resize the only machine.”
- Hardware appliances, software proxies, and CDN edges are different places to do that job. The objective is the same.
- A balancer does not fix a slow database behind every server. It only helps when the bottleneck is the pool you are spreading.

**Examples:**

Checkout p95 climbs because one of three app servers is at 100% CPU and the other two are at 30%. Least-connections stops sending new work to the hot one. If all three are hot, you add a fourth. The balancer’s job was the uneven spread, not the query.
</details>

<details>
<summary>Explain the difference between hardware and software load balancers.</summary>

### Explain the difference between hardware and software load balancers.

**Definition:**

A hardware load balancer is a dedicated appliance. A software load balancer is a program you run on ordinary servers or as a managed cloud service.

**How it works:**

- Appliances are built around packet processing, often with a fixed setup and a vendor support path. They can push high throughput with predictable latency.
- They cost more up front, scale by buying another box or a license, and are slow to change when you need a new routing rule.
- Software (NGINX, HAProxy, Envoy, a cloud balancer) runs on commodity machines. You add instances, change config in git, and pay for capacity you use.
- The limits are the host: CPU for TLS, a learning curve, and the need to operate the proxy yourself unless the cloud runs it.
- Cloud load balancers are software you do not rack. You still choose algorithms, health checks, and TLS behavior.
- Many systems use both: an appliance or cloud balancer at the edge, and a software proxy closer to the services.

**Examples:**

A data-center pair of appliances terminates TLS for a legacy VLAN. A Kubernetes cluster uses a software ingress controller for per-service routes. Replacing a route in the second case is a config change. Replacing it on the appliance is a change window.
</details>

<details>
<summary>Can you list some common load balancing algorithms and briefly describe how they work?</summary>

### Can you list some common load balancing algorithms and briefly describe how they work?

**Definition:**

An algorithm is the rule that picks the next backend. Simpler rules ignore live load. Heavier ones look at connections, latency, or a key from the request.

**How it works:**

- Round-robin walks the list in order, then starts over. Every healthy server gets a turn.
- Least connections sends the request to the server with the fewest open connections. It favors servers that finish work faster.
- A hash of the client IP (or a header) always picks the same server for that key, until the pool changes.
- Weighted round-robin and weighted least connections give a larger machine more turns or a higher connection budget.
- Least response time prefers the server that has been answering quickly, sometimes combined with connection count.
- Dynamic policies add health and load samples so a slow member is chosen less often. Content-based rules pick a pool from the URL or a header before the algorithm runs inside that pool.

**Examples:**

```text
servers = [A, B, C]
next = servers[i % 3]; i += 1     # round-robin
```

With weights 5, 1, 1, A would be chosen five times for each turn of B and of C. Least connections would ignore that schedule and look at open sockets instead.
</details>

<details>
<summary>Describe the term “sticky session” in load balancing.</summary>

### Describe the term “sticky session” in load balancing.

**Definition:**

A sticky session sends later requests from the same client to the same backend, so a server can keep using state it stored locally for that client.

**How it works:**

- The balancer remembers a key: the client IP, or a cookie it sets on the first response.
- The next request with that key skips the normal rotation and returns to the same server while the entry lasts.
- That lets an in-memory session, a websocket, or an upload in progress stay on one process.
- The cost is uneven load. A busy user pins a server. A dead server drops everyone stuck to it unless you can rebuild the session.
- Prefer a shared session store or a stateless token. Then any server can take the next request and stickiness is unnecessary.
- If you keep it, set a timeout and a fallback when the chosen server fails its health check.

**Examples:**

```text
# first response sets a cookie the balancer understands
Set-Cookie: SERVERID=b
# later requests with that cookie go back to b
```

Without the cookie, round-robin would land the next call on A, which has never seen this user’s cart.
</details>

<details>
<summary>How does load balancing improve application reliability?</summary>

### How does load balancing improve application reliability?

**Definition:**

Reliability improves because a failed or overloaded instance stops being a single point of failure for the whole service. The pool answers while that instance is out.

**How it works:**

- More than one backend means the service survives a crash, a deploy, or a full disk on one machine.
- Health checks stop sending traffic to a member that is down or too slow, and put it back when it recovers.
- Spreading connections avoids a pile-up on one process that would otherwise time out everyone.
- TLS can end at the balancer so every backend is not a separate certificate problem. That is convenience. The reliability piece is still the pool.
- Session stickiness and a local cache cut against this: they make one server special. Shared state keeps any survivor able to serve.
- The balancer itself must be redundant (a pair, or an anycast cloud balancer). One proxy is a new single point of failure.

**Examples:**

Two app servers and a balancer. You restart one for a deploy. Health checks mark it down, the other takes the traffic, and the restarted one rejoins when `/ready` succeeds. Users see a blip only for requests that were already on the restarting process.
</details>

<details>
<summary>How do load balancers perform health checks on backend servers?</summary>

### How do load balancers perform health checks on backend servers?

**Definition:**

A health check decides whether a backend may receive traffic. Active checks probe on a timer. Passive checks watch the real requests you already sent.

**How it works:**

- An active check opens a TCP port or sends HTTP `GET /ready` every few seconds. A timeout, a refused connection, or a non-2xx marks the member down after a small number of failures.
- The path should mean “I can serve,” not merely “the process is listening.” A ready check that depends on the database fails when the database is gone.
- A passive check counts errors and timeouts on live traffic. Too many, and the member is removed without a separate probe.
- Passive checks spend nothing when traffic is quiet, and they see the failures users see. They are slow to notice a server that is down but not being hit.
- Use both: a probe for machines with no traffic, and error rates for machines that are up but failing requests.
- When the member passes again for N successes, it returns to the pool. Do not flap it on a single success.

**Examples:**

```text
GET /ready every 5s, timeout 1s
unhealthy after 3 failures, healthy after 2 successes
```

A process that accepts TCP but returns 500 from `/ready` is removed. A TCP-only check would have kept sending it users.
</details>

<details>
<summary>What are the advantages and disadvantages of round-robin load balancing?</summary>

### What are the advantages and disadvantages of round-robin load balancing?

**Definition:**

Round-robin gives each healthy server the next request in turn. It is simple and fair only when every request costs about the same and every server is the same size.

**How it works:**

- Advantage: trivial to implement and explain. No per-server counters beyond the rotating index.
- Advantage: over many short, similar requests, each server receives about the same count.
- Disadvantage: a long request counts as one turn. One server can be busy with a heavy call while the next light call still lands on it.
- Disadvantage: a slower or smaller machine gets the same share as a fast one, so it queues.
- Disadvantage: it ignores response time. A server that is erroring but still “up” keeps its turn until a health check removes it.
- Use it for equal servers and cheap, similar work. Move to least connections or weights when request cost or machine size varies.

**Examples:**

Three identical stateless API servers and 1 ms handlers: round-robin is enough. The same rotation in front of image resizing, where one request takes 2 seconds, piles those jobs onto whoever’s turn it is. Least connections would skip the server already resizing.
</details>

<details>
<summary>In load balancing, what is the significance of the least connections method?</summary>

### In load balancing, what is the significance of the least connections method?

**Definition:**

Least connections sends the next request to the backend that currently has the fewest open connections. It tracks in-flight work, not just whose turn it is.

**How it works:**

- A long request holds a connection. Round-robin does not notice. Least connections does, and prefers a server that has already finished.
- That fits HTTP/1.1 keep-alive, websockets, and any mix of cheap and expensive calls.
- It assumes one connection is one unit of load. A server with few connections but a huge CPU job can still be the wrong pick. Pair it with response time or a weight if costs differ that much.
- The balancer must see the connections. If something else terminates them, the counts lie.
- New servers start at zero connections, so they can be flooded on join. A slow-start ramp avoids that.
- Weights scale the comparison: a machine twice as large can hold twice as many connections before it looks “busier.”

**Examples:**

Server A has 40 open downloads. Server B has 3. The next request goes to B even if round-robin would have chosen A. When a download on A finishes, A’s count drops and it becomes eligible again.
</details>

<details>
<summary>Explain how a load balancer might handle failure in one of the servers it manages.</summary>

### Explain how a load balancer might handle failure in one of the servers it manages.

**Definition:**

When a server fails, the balancer stops sending it new work and keeps serving from the members that are still healthy.

**How it works:**

- Active probes or a run of real errors mark the member down. In-flight requests on it fail. New requests go to the others.
- The algorithm (round-robin, least connections, weighted) then runs only on the remaining set.
- Sticky clients of the dead server must be reassigned or they keep failing. A shared session store makes that reassignment painless.
- If TLS ends at the balancer, backends can die without clients renegotiating with a new certificate.
- One balancer is not enough. A second balancer, or a cloud balancer with its own failover, has to take over the virtual address.
- Put the member back only after consecutive successful checks. Optionally drain it first on a planned stop so existing connections finish.
- A backup pool (a smaller standby group) can take overflow when the primary pool is too small after the loss.

**Examples:**

Three servers, one fails `/ready` three times. The balancer’s rotation becomes the other two. A user whose cookie pointed at the dead server is sent to a live one on the next request. Ten minutes later the server passes two checks and re-enters the rotation.
</details>

### Load Balancing Strategies

<details>
<summary>How does a load balancer distribute traffic in a stateless vs stateful scenario?</summary>

### How does a load balancer distribute traffic in a stateless vs stateful scenario?

**Definition:**

Stateless backends can take any request, so the balancer is free to use a pure spreading algorithm. Stateful backends remember the client, so the balancer has to keep sending that client to the same place or the state has to move.

**How it works:**

- Stateless: each request carries what the server needs (a token, an idempotency key). Round-robin or least connections is enough. Any survivor handles the next call.
- Stateful: the server holds a session, a websocket, or a partial upload in memory. The balancer uses a cookie or an IP hash (stickiness) so the next packet hits that memory.
- Stateful distribution is uneven and fragile when that server dies. The state is gone unless it was also written somewhere shared.
- The usual fix is to make the tier stateless from the balancer’s point of view: session in Redis, files in object storage. The algorithm goes back to pure spreading.
- Do not confuse “stateful balancer” with “stateful app.” The balancer can remember a sticky map even when you wish the app did not need it.

**Examples:**

`GET /products/1` with no session is stateless: any of four servers may answer. A websocket chat pinned by cookie is stateful: only the server that accepted the upgrade has the socket. Putting chat messages in a shared bus lets a reconnect land anywhere.
</details>

<details>
<summary>What is the concept of session persistence, and why is it important?</summary>

### What is the concept of session persistence, and why is it important?

**Definition:**

Session persistence means the balancer keeps choosing the same backend for a client so that client’s session remains valid. It matters when that session lives on one server.

**How it works:**

- Users stay logged in, multi-step forms keep their place, and a server-side cart does not vanish between requests.
- A write that must see the previous write on the same process also depends on it, until you move that sequence to a shared store.
- Mechanisms: a sticky cookie, source-IP affinity, or a consistent hash of a session id.
- The better long-term mechanism is not persistence at all: put the session in a store every server can read. Then persistence is optional.
- Avoid it when it pins too much traffic to one machine, when clients share one NAT address (IP affinity then sticks a whole office), or when you need to drain a server freely.
- If you use it, expire the map and reassign on health-check failure so a dead server does not trap the user.

**Examples:**

A checkout wizard stores step 2 only in process memory. Without persistence, step 3 hits another process and the wizard restarts. Moving the wizard state to the session store lets any server render step 3, and the balancer can round-robin again.
</details>

<details>
<summary>Discuss the role of DNS in load balancing.</summary>

### Discuss the role of DNS in load balancing.

**Definition:**

DNS load balancing hands different clients different IP addresses for one name, so they connect to different servers before any proxy sees the packet.

**How it works:**

- Round-robin DNS returns several A or AAAA records and rotates their order. Resolvers and clients pick one.
- It is simple and has no proxy hop. It also has weak control: caches ignore your TTL, and a dead IP keeps being handed out until caches expire.
- There is no per-request health check in plain DNS. A record can point at a server that is already down.
- Weighted or geo DNS (often a DNS service, not a static zone) returns an address based on region or a weight. That is how global traffic is steered.
- Clients that pin one answer stay there. You cannot rebalance an open connection by changing DNS.
- Use DNS to choose a site or a balancer. Use a real balancer behind that address to choose a live process.

**Examples:**

```text
shop.example.  30  IN  A  203.0.113.10
shop.example.  30  IN  A  203.0.113.11
```

Half the resolvers try the first address. If `.10` dies, those clients fail until the record ages out. A balancer at each address can still fail over inside the site without waiting on DNS.
</details>

<details>
<summary>In what scenarios would you use weighted load balancing?</summary>

### In what scenarios would you use weighted load balancing?

**Definition:**

Use weights when backends should not get equal shares: they differ in size, you are canarying a release, or you are draining a machine.

**How it works:**

- A weight is a relative share. Weights 5 and 1 send about five requests to the first server for each one to the second, in weighted round-robin.
- Weighted least connections scales how many connections count as “full” on a bigger box.
- A new version can take weight 1 while the old takes 9, so a canary sees a slice of traffic.
- A server you are about to remove gets weight 0, finishes what it has, and then leaves.
- Weights do not fix a server that is unhealthy. Health checks still remove it. A high weight on a sick server just fails more users until the check trips.
- Revisit weights when you resize a machine. A leftover “5” on a small VM recreates the overload you meant to avoid.

**Examples:**

```text
A weight 9   # current release, large instances
B weight 1   # canary
C weight 0   # draining
```

About 90% of new requests go to A, 10% to B, and none to C. Raise B’s weight only after its error rate looks like A’s.
</details>

<details>
<summary>How can load balancers help mitigate DDoS attacks?</summary>

### How can load balancers help mitigate DDoS attacks?

**Definition:**

A load balancer is one of the places that can absorb or shed abusive traffic before it reaches the application. It is not a complete defense by itself.

**How it works:**

- The pool has more capacity than one server, so a modest flood is spread instead of melting a single process.
- Rate limits and connection caps per client address shed traffic that exceeds a budget. Legitimate bursts need a budget that is not tiny.
- The edge can drop traffic that never completes a handshake, and can challenge obvious bots, so the origin only sees clients that finish the check.
- Anycast and a large edge network (a CDN or a cloud balancer) sink volumetric floods far from your origin. Your own two proxies cannot.
- Health checks must not mark every server down just because the flood made them slow, or the balancer will empty the pool and finish the outage.
- Application attacks (abusive but well-formed requests) need limits and a firewall at the edge. Spreading them evenly still does the damage, only on more servers.

**Examples:**

A spike of connection attempts hits the cloud balancer. Per-address limits and handshake checks drop most of them. The origin’s autoscaling adds two instances for the traffic that remains. The application still has its own limit on expensive search calls, because those look like normal HTTP.
</details>

<details>
<summary>Explain the difference between horizontal and vertical scaling, and how load balancing applies to each.</summary>

### Explain the difference between horizontal and vertical scaling, and how load balancing applies to each.

**Definition:**

</details>

<details>
<summary>What factors should you consider when choosing a load balancing method for a particular application?</summary>

### What factors should you consider when choosing a load balancing method for a particular application?

**Definition:**

</details>

<details>
<summary>Discuss how global server load balancing differs from local server load balancing.</summary>

### Discuss how global server load balancing differs from local server load balancing.

**Definition:**

</details>

### Load Balancer Configuration & Performance

<details>
<summary>What metrics would you monitor to assess the performance of a load balancer?</summary>

### What metrics would you monitor to assess the performance of a load balancer?

**Definition:**

</details>

<details>
<summary>Describe one method to handle SSL/TLS traffic in load balancing.</summary>

### Describe one method to handle SSL/TLS traffic in load balancing.

**Definition:**

</details>

<details>
<summary>Explain the concept of direct server return and its significance in load balancing.</summary>

### Explain the concept of direct server return and its significance in load balancing.

**Definition:**

</details>

<details>
<summary>How can caching be integrated with load balancing to improve performance?</summary>

### How can caching be integrated with load balancing to improve performance?

**Definition:**

</details>

<details>
<summary>Discuss the challenges of load balancing microservice architectures.</summary>

### Discuss the challenges of load balancing microservice architectures.

**Definition:**

</details>

<details>
<summary>How do you configure a health check on a load balancer?</summary>

### How do you configure a health check on a load balancer?

**Definition:**

</details>

<details>
<summary>What is connection draining, and why is it used in load balancing?</summary>

### What is connection draining, and why is it used in load balancing?

**Definition:**

</details>

### Load Balancing in Cloud and Hybrid Environments

<details>
<summary>How do cloud provider load balancers (e.g., AWS ELB, Azure Load Balancer) differ from on-premise solutions?</summary>

### How do cloud provider load balancers (e.g., AWS ELB, Azure Load Balancer) differ from on-premise solutions?

**Definition:**

</details>

<details>
<summary>Can you explain the role of load balancing in auto-scaling groups/clusters?</summary>

### Can you explain the role of load balancing in auto-scaling groups/clusters?

**Definition:**

</details>

<details>
<summary>Describe the process of load balancing in a multi-cloud environment.</summary>

### Describe the process of load balancing in a multi-cloud environment.

**Definition:**

</details>

<details>
<summary>Discuss how load balancing might work in a hybrid cloud scenario with both private and public resources.</summary>

### Discuss how load balancing might work in a hybrid cloud scenario with both private and public resources.

**Definition:**

</details>

### Advanced Load Balancing Topics

<details>
<summary>What is cross-region load balancing, and in what scenario would it be necessary?</summary>

### What is cross-region load balancing, and in what scenario would it be necessary?

**Definition:**

</details>

<details>
<summary>Explain how a load balancer can make routing decisions based on content type.</summary>

### Explain how a load balancer can make routing decisions based on content type.

**Definition:**

</details>

<details>
<summary>How would you enable graceful shutdown of servers in a load-balanced environment?</summary>

### How would you enable graceful shutdown of servers in a load-balanced environment?

**Definition:**

</details>

<details>
<summary>Discuss the role of API gateways in conjunction with load balancers.</summary>

### Discuss the role of API gateways in conjunction with load balancers.

**Definition:**

</details>

<details>
<summary>What is load balancer affinity, and when might you enforce it?</summary>

### What is load balancer affinity, and when might you enforce it?

**Definition:**

</details>

<details>
<summary>How does load balancing work in a containerized environment, such as with Docker and Kubernetes?</summary>

### How does load balancing work in a containerized environment, such as with Docker and Kubernetes?

**Definition:**

</details>

<details>
<summary>What is a reverse proxy, and how does it relate to load balancing?</summary>

### What is a reverse proxy, and how does it relate to load balancing?

**Definition:**

</details>

<details>
<summary>Can you explain how load balancing works with websockets or other persistent connection protocols?</summary>

### Can you explain how load balancing works with websockets or other persistent connection protocols?

**Definition:**

</details>

<details>
<summary>Discuss how machine learning can be applied to improve load balancing decisions.</summary>

### Discuss how machine learning can be applied to improve load balancing decisions.

**Definition:**

</details>

<details>
<summary>What strategies might you employ to handle sudden spikes in traffic using load balancing?</summary>

### What strategies might you employ to handle sudden spikes in traffic using load balancing?

**Definition:**

</details>

### Load Balancing and Security

<details>
<summary>How do load balancers contribute to a system’s security posture?</summary>

### How do load balancers contribute to a system’s security posture?

**Definition:**

</details>

<details>
<summary>Can load balancers protect against SQL injection or XSS attacks? If so, how?</summary>

### Can load balancers protect against SQL injection or XSS attacks? If so, how?

**Definition:**

</details>

<details>
<summary>How does a Web Application Firewall (WAF) integrate with load balancing solutions?</summary>

### How does a Web Application Firewall (WAF) integrate with load balancing solutions?

**Definition:**

</details>

<details>
<summary>Describe the importance of properly configuring HTTPS certificates on load balancers.</summary>

### Describe the importance of properly configuring HTTPS certificates on load balancers.

**Definition:**

</details>

<details>
<summary>Discuss the security implications of SSL termination at the load balancer.</summary>

### Discuss the security implications of SSL termination at the load balancer.

**Definition:**

</details>

<details>
<summary>Explain how rate limiting works in the context of load balancing.</summary>

### Explain how rate limiting works in the context of load balancing.

**Definition:**

</details>

### Load Balancing Troubleshooting and Problem Solving

<details>
<summary>How would you troubleshoot a situation where a load balancer is incorrectly routing traffic?</summary>

### How would you troubleshoot a situation where a load balancer is incorrectly routing traffic?

**Definition:**

</details>

<details>
<summary>What steps would you take if a backend server is reported down by the load balancer but is actually running?</summary>

### What steps would you take if a backend server is reported down by the load balancer but is actually running?

**Definition:**

</details>

<details>
<summary>Describe how you might identify and resolve performance bottlenecks in a load-balanced system.</summary>

### Describe how you might identify and resolve performance bottlenecks in a load-balanced system.

**Definition:**

</details>

<details>
<summary>How would you handle a situation where the load balancer becomes the performance bottleneck?</summary>

### How would you handle a situation where the load balancer becomes the performance bottleneck?

**Definition:**

</details>

<details>
<summary>Suppose a load balancer is causing increased latency—what potential root causes would you investigate?</summary>

### Suppose a load balancer is causing increased latency—what potential root causes would you investigate?

**Definition:**

</details>
