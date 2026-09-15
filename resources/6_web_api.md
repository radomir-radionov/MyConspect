# Web API — HTTP, REST & Browser APIs

HTTP, REST, browser APIs, authentication, and real-time communication for frontend and full-stack interviews.

### Related docs

* [HTML browser pipeline](./1_html.md) · [HTML vs XML](./1_html.md#html-vs-xml) · [HTML links](./1_html.md#links-anchor-element) · [JS Browser](./3_js_browser.md) · [Browser storage](./3_js_browser.md#browser-storage) · [URL / URLSearchParams](./3_js_browser.md#url--urlsearchparams) · [CORS (SOP)](./3_js_browser.md#cors-same-origin) · [JSON](./3_js_core.md#json) · [Node.js URL](./8_nodejs.md#url--uri) · [Next.js rendering](./4_nextjs.md) · [React SSR/RSC](./4_react.md) · [System design — client–server](./0_system_design.md#clientserver-architecture-why-a-backend) · [Load balancing (L4/L7)](./0_system_design.md#load-balancing) · [Reverse proxy](./0_system_design.md#reverse-proxy) · [Nginx](./10_build.md#nginx) · [Special — web attacks](./7_special.md#14-common-web-attacks) · [Encryption](./7_special.md#encryption) · [CSRF](./7_special.md#csrf-cross-site-request-forgery) · [MITM](./7_special.md#man-in-the-middle-mitm)
* [HTML — Core Web Vitals](./1_html.md#core-web-vitals--html-developer-impact) · [CLS](./1_html.md#cls-cumulative-layout-shift) · [LCP](#lcp-largest-contentful-paint) · [FCP](#first-contentful-paint-fcp) · [TTFB](#ttfb-time-to-first-byte) · [INP](#inp-interaction-to-next-paint) · [Next.js CWV](./4_nextjs.md#core-web-vitals-on-vercel) · [DevTools](./11_vsc_browser.md#devtools--core-web-vitals) · [Performance testing](./7_special.md#performance-testing) · [HTML — resource hints](./1_html.md#link-rel-types--resource-hints) · [TCP vs UDP](#tcp-vs-udp) · [How the Internet works](#how-the-internet-works)
* [Interview hub](./0_interview.md) · [Interview Practice](./6_web_api.md#interview-practice) · [SSH](./15_devops.md#ssh) · [Firewall / packet filter](./15_devops.md#firewall--packet-filter) · [OS files & paths](./8_nodejs.md#files--file-systems)

[← Back to Interview hub](./0_interview.md)

### Main concepts

| Area | Topics |
|------|--------|
| **HTTP** | Protocol overview, web server, methods, status codes, headers, compression, caching, CORS, [URI / URL anatomy](#uri-url--urn), [How the Internet works](#how-the-internet-works), [OSI & TCP/IP](#osi--tcpip-models), [TCP vs UDP](#tcp-vs-udp), [ports & sockets](#ports-sockets--network-services), [IPv4 & IPv6](#ipv4--ipv6) |
| **API styles** | REST, XML, SOAP, RPC, tRPC, and how they differ |
| **REST** | Resources, CRUD, idempotency, versioning, pagination |
| **Auth** | Identification vs authentication vs authorization, Basic, sessions, JWT, OAuth2/OIDC, CSRF |
| **Real-time** | WebSockets, SSE, polling |
| **App types** | Client–server, AJAX→JSON evolution, MPA, SPA, CSR, SSR, SSG, PWA |
| **Security** | CSP, XSS, CSRF, clickjacking, HTTPS/MITM, TLS certificates (X.509), rate limiting (429) |
| **Storage** | Cookies, localStorage, IndexedDB |
| **Integrations** | Payments, analytics, third-party SDKs |
| **Performance** | Core Web Vitals (LCP, INP, CLS), TTFB, FCP, INP phases & fixes, lab vs field, RUM / `web-vitals` |

### Sections

Each `<details>` topic follows: **Definition** → **How it works** → **When to use** → **Pluses and minuses** → **Examples** → **Thoughts** → **Sources**

- [Resources](#resources)
- [1. Core](#1-core) · [How the Internet works](#how-the-internet-works)
- [2. REST](#2-rest)
- [XML](#xml)
- [3. SOAP](#3-soap)
- [4. RPC](#4-rpc)
- [5. REST vs SOAP vs RPC](#5-rest-vs-soap-vs-rpc)
- [6. tRPC](#6-trpc)
- [7. HTTP](#7-http) · [URI, URL & URN](#uri-url--urn) · [HTTP protocol](#http-protocol) · [HTTPS](#https) · [TLS handshake](#ssltls--https-handshake) · [TLS certificates](#tls-certificates-x509--pki)
- [8. Auth](#8-auth)
- [9. Storage](#9-storage)
- [10. Protocols](#10-protocols) · [TCP vs UDP](#tcp-vs-udp) ([OSI & TCP/IP](#osi--tcpip-models) · [IPv4 & IPv6](#ipv4--ipv6) · [Ports, sockets & services](#ports-sockets--network-services))
- [11. Real-time & rendering](#11-real-time--rendering)
- [12. Types of web apps](#12-types-of-web-apps)
- [13. Security](#13-security) · [CORS](#cors)
- [14. Advanced topics](#14-advanced-topics)
- [Core Web Vitals](#core-web-vitals)
- [LCP (Largest Contentful Paint)](#lcp-largest-contentful-paint)
- [First Contentful Paint (FCP)](#first-contentful-paint-fcp)
- [TTFB (Time to First Byte)](#ttfb-time-to-first-byte)
- [INP (Interaction to Next Paint)](#inp-interaction-to-next-paint)
- [15. Integrations](#15-integrations)
- [Interview Practice](#interview-practice)

### Topic template

Every major topic follows:

**Definition** → **How it works** → **Cases** → **Pros / Cons** → **Example** → **Notes** → **Source**

### HTTP (Hypertext Transfer Protocol)

Application-layer request/response protocol for the Web. Full notes: [HTTP protocol](#http-protocol).

### REST (Representational State Transfer)

**Definition:** REST is an architectural style for distributed systems where resources are identified by URLs and manipulated via standard HTTP verbs and representations (usually JSON).

**When to use:**

CRUD APIs, public HTTP services, mobile/web clients sharing one backend.

Complex nested queries with many round-trips — consider GraphQL; high-performance internal RPC — consider gRPC.

**Pluses and minuses:**

| +                                 | −                                |
| ------------------------------------ | ----------------------------------- |
| Simple, cache-friendly, tooling-rich | Over/under-fetching without GraphQL |
| Language-agnostic clients            | Strict REST is rare in practice     |

**Examples:**

```http
GET    /books      → list
POST   /books      → create
GET    /books/3    → read
PUT    /books/3    → replace
DELETE /books/3    → remove
```

**Sources:** [ByteByteGo — REST API cheatsheet](https://blog.bytebytego.com/p/ep94-rest-api-cheatsheet)

### CORS (Cross-Origin Resource Sharing)

**Definition:**

CORS is a browser opt-in that lets a server allow cross-origin JavaScript to **read** a response. Full theory → [CORS](#cors).

---

<a name="resources"></a>

## Resources

<details>
  <summary>Practice APIs & references</summary>

### Practice APIs & references

| Resource                | URL                                                                                                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public APIs list        | [https://github.com/public-apis/public-apis](https://github.com/public-apis/public-apis)                                                                                                 |
| Fake Store API          | [https://fakestoreapi.com/docs](https://fakestoreapi.com/docs)                                                                                                                           |
| API design guidelines   | [https://www.freecodecamp.org/news/how-to-design-and-develop-web-apis-essential-guidelines/](https://www.freecodecamp.org/news/how-to-design-and-develop-web-apis-essential-guidelines/) |
| How search engines work | [https://blog.bytebytego.com/p/ep104-how-do-search-engines-work](https://blog.bytebytego.com/p/ep104-how-do-search-engines-work)                                                         |
| Integration styles      | [https://www.linkedin.com/posts/godnolytika_integration-styles](https://www.linkedin.com/posts/godnolytika_integration-styles)                                                           |

---

</details>

---

<a name="1-core"></a>

## 1. Core

<details>
  <summary>Browser page rendering pipeline</summary>

### Browser page rendering pipeline

**Definition:** Rendering is the multi-stage process by which a browser turns downloaded HTML, CSS, and JavaScript into pixels on screen.

**How it works:**

| Stage     | What happens                |
| --------- | --------------------------- |
| Load      | Fetch HTML, CSS, JS, images |
| Parse     | Build DOM and CSSOM         |
| Style     | Compute used styles         |
| Layout    | Calculate geometry (reflow) |
| Paint     | Rasterize pixels            |
| Composite | Layer and display on GPU    |

**When to use:** JS that reads layout (`offsetWidth`) then writes style forces **layout thrashing** — batch reads/writes. `defer` scripts run after HTML parse; `async` runs when downloaded.

**Pluses and minuses:**

| + (understanding pipeline)  | −                               |
| ------------------------------ | ---------------------------------- |
| Targeted perf fixes (LCP, CLS) | Many engine-specific optimizations |

**Examples:**

```html
<!-- Critical CSS in <head> speeds first paint -->
<link rel="stylesheet" href="critical.css">
<script src="app.js" defer></script>
```

**Thoughts:** Canonical pipeline (fetch, dirty layout, paint order, rAF, progressive rendering) → [1_html.md — Browser & rendering](./1_html.md#browser--rendering). CSS triggers → [2_css.md](./2_css.md).

**Sources:**

[web.dev — How browsers work](https://web.dev/articles/howbrowserswork)

---

</details>

<details>
  <summary>Internet, Web & DNS</summary>

### Internet, Web & DNS

**Definition:**

The Internet is a global network of computers; the Web is an HTTP-based system of linked documents accessed via browsers; DNS maps human-readable domain names to IP addresses.

| Term     | Role                                       |
| -------- | ------------------------------------------ |
| Internet | Global packet-routed network (TCP/IP)      |
| Web      | Hyperlinked documents over HTTP            |
| DNS      | Domain → IP phonebook (`A` = IPv4, `AAAA` = IPv6) |
| Browser  | User agent that requests and renders pages |

**How it works:** Dual-stack clients query **AAAA** and **A**. **Happy Eyeballs** (RFC 8305) races connections and prefers working IPv6, falling back to IPv4 if IPv6 is slow or broken. Full addressing: [IPv4 & IPv6](#ipv4--ipv6). LAN vs public Internet, packets, and the page-load path: [How the Internet works](#how-the-internet-works). DNS is a **lookup** (cache → resolver → nameservers → IP); the browser then opens TCP/TLS to that IP — packets are not “sent to DNS as the destination.”

**Examples:**

```
User types https://example.com
  → DNS: AAAA + A (e.g. 2001:db8::1 and 93.184.216.34)
  → Happy Eyeballs picks a working address
  → Browser opens TCP, sends HTTP GET
  → Server returns HTML; browser renders
```

**Sources:**

[Cloudflare — What is HTTP?](https://www.cloudflare.com/learning/ddos/glossary/hypertext-transfer-protocol-http/) · [MDN — HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) · [RFC 8305](https://www.rfc-editor.org/rfc/rfc8305.html)

---

</details>

<details>
  <summary>How the Internet works</summary>

### How the Internet works

**Definition:** Hosts exchange **packets** under shared **protocols**. The same TCP/IP stack runs on a **LAN** and on the public **Internet**; the difference is addressing, routing scope, and who can reach whom — not a different “kind” of packet.

**How it works:**

- A **protocol** is the rule set every hop agrees on (size, headers, who ACKs). Devices: hosts, switches, routers, gateways, firewalls, APs.
- Each host has an **IP**. Packets are forwarded toward the destination IP (routers pick a next hop). The OS **network stack** (often in the kernel) applies addresses, ports, and local filter rules.
- **LAN vs Internet:** same Ethernet/Wi-Fi + IP + TCP/UDP. A LAN is usually one site with **private** IPv4 (`10/8`, `172.16/12`, `192.168/16`) or IPv6 ULA/link-local; a home/office **NAT gateway** hides many hosts behind one public address. The Internet is many independently routed networks (public unicast, BGP). A LAN peer (`192.168.1.20`) is not reachable from the public Internet unless you publish a public IP, port-forward, or use a tunnel/VPN.
- **Page load (MDN):** type a URL → **DNS** maps the host to IP (local cache, then a resolver) → **TCP** handshake → **TLS** if `https:` → **HTTP** request → server sends files as packets → browser **reassembles** HTML and repeats for CSS/JS/images. DNS does **not** rewrite in-flight packets; the client learns the IP first, then talks to the origin (or CDN).
- **HTTP** is application-layer (OSI 7 / TCP/IP application). **TCP** is reliable ordered streams; **UDP** is datagrams (checksum, no handshake, no retransmission). **TLS** is **not** a third transport like TCP: HTTPS is HTTP **over TLS over TCP** (HTTP/3: HTTP over **QUIC over UDP**). Plain HTTP on a hop you control is readable; TLS encrypts the bytes on the wire. Details: [HTTPS](#https) · [TCP vs UDP](#tcp-vs-udp).
- **Ports** (1–65535) select which **socket**/process gets the packet. OS **network service** binds a socket to an IP:port; a **network service** (daemon) is the app that speaks HTTP, SMTP, etc. Defaults: HTTP **80**, HTTPS **443**. Full table and `ss`/`netstat`: [Ports, sockets & network services](#ports-sockets--network-services).

**When to use:**

Explain “what happens when I open a URL”; why `localhost:8080` works on your machine but not from a phone on another network; why café Wi-Fi + HTTP is a MITM risk.

#### Common pitfalls

Treating DNS as the HTTP destination. Calling TLS a replacement for TCP. Assuming LAN IPs are globally routable. Copying Linux `netstat -p` as “protocol” (`-p` is PID on Linux; protocol filter is BSD/macOS).

**Pluses and minuses:**

| + | − |
| - | - |
| One mental model (packets + IP + port) | NAT and firewalls hide “just ping the LAN IP” |
| Same tools on LAN and WAN (`ping`, `ss`) | “TLS/IP stack” as a peer of TCP/IP is a myth |

**Examples:**

```
https://example.com/index.html
  1. DNS A/AAAA → 93.184.216.34 (example)
  2. TCP 3-way handshake to that IP:443
  3. TLS handshake (cert + session keys)
  4. Encrypted HTTP GET /index.html
  5. Packets routed hop-by-hop; server stack demuxes port 443 → web server
  6. HTML packets return; browser parses and fetches /style.css the same way
```

**Thoughts:**

*DNS finds the IP; TCP/TLS opens the pipe; HTTP is the conversation; IP+port is how packets find the right process.*

Layers: [OSI & TCP/IP models](#osi--tcpip-models). Addresses: [IP address](#ip-address) · [IPv4 & IPv6](#ipv4--ipv6). Packet capture: Wireshark/`tcpdump` in the OSI block. Host firewall: [15_devops.md — Firewall](./15_devops.md#firewall--packet-filter).

**Sources:**

[MDN — How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works) · [MDN — How the Internet works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work) · [MDN — Domain names](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name) · [Doka — Working with the network](https://doka.guide/tools/network/)

---

</details>

<details>
  <summary>Client–server architecture</summary>

### Client–server architecture

**Definition:** The usual web split: a **client** (browser) requests work; a **server** applies business rules and talks to a **database**. Why a backend exists: the UI is HTML/CSS/JS; durable, shared, authorized data is not.

**How it works:**

- Client → “read / filter / save this.” For the user: present data and collect edits.
- Server → persist, authorize, transform; optional background jobs (index, email).
- DB → storage, replicas, backups — often more than one technology.

**When to use:** Feeds, docs, auth. Full picture: [0_system_design.md — Client–server](./0_system_design.md#clientserver-architecture-why-a-backend). Messages, methods, proxies: [HTTP protocol](#http-protocol). The HTTP process on the server is the [web server](#web-server).

**Thoughts:** Architecture describes contracts between parts, not every module’s internals.

**Sources:**

[Doka — How web apps work](https://doka.guide/tools/web-app-works/)

---

</details>

<details>
  <summary>Evolution of web apps (reload → AJAX HTML → JSON)</summary>

### Evolution of web apps (reload → AJAX HTML → JSON)

**Definition:** Same client–server idea; the **payload** changed: full HTML pages → HTML fragments without reload → **JSON** (or similar) that the client renders.

**How it works:**

1. **Classic MPA** — every click (even “sort this table”) is a new document. All business logic on the server; the browser only shows HTML.
2. **AJAX (Web 2.0)** — background HTTP (`XMLHttpRequest` / later `fetch`). Early pattern: server still returns a **chunk of HTML**; JS inserts it. Better UX, still couples markup to the API.
3. **Data APIs** — first response is HTML (SSR) or a shell + embedded JSON; later actions send JSON. The client **re-renders** from data (React and similar), not by swapping HTML strings.

**When to use:**

Interview: name the three eras. Prefer JSON when multiple clients share one API; SSR HTML is still valid for first paint.

| Data-only APIs                   | HTML fragments / full pages                |
| -------------------------------- | ------------------------------------------ |
| Server can ignore page structure | Faster to ship a snippet for a tiny widget |
| Smaller payloads                 | Markup and API version together            |
| SSR optional for first HTML      | Harder to reuse on mobile / another UI     |

**Thoughts:** Modern apps exchange **state as data**; the client owns most of the View.

**Sources:**

[Doka — How web apps work](https://doka.guide/tools/web-app-works/) · Types: [MPA vs SPA](#12-types-of-web-apps) · AJAX: [3_js_async.md](./3_js_async.md)

---

</details>

<details>
  <summary>IP address</summary>

### IP address

**Definition:**

An IP address is a numeric identifier for a device on a network, used to route packets to the correct destination.

| Version | Size                         | Notes              |
| ------- | ---------------------------- | ------------------ |
| IPv4    | 32-bit (~4.3B addresses)     | e.g. `192.168.0.1` |
| IPv6    | 128-bit (vast address space) | e.g. `2001:db8::1` |

**How it works:** Public unicast is globally routed. **Private** IPv4 (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) stays on the LAN unless NAT or a tunnel publishes it. Loopback: `127.0.0.1` / `::1`. Packets + LAN vs Internet: [How the Internet works](#how-the-internet-works). Formats, prefixes, URL literals, DNS `AAAA`, and Happy Eyeballs: [IPv4 & IPv6](#ipv4--ipv6).

**Examples:**

```
IPv4: 192.168.1.10
IPv6: 2001:db8:85a3::8a2e:370:7334
```

**Sources:**

[MDN — IP address glossary](https://developer.mozilla.org/en-US/docs/Glossary/IP_Address)

---

</details>

<details>
  <summary>URI, URL & URN</summary>

### URI, URL & URN

**Definition:**

A **URI** identifies a resource. A **URL** is a URI that also says *how* to reach it (scheme + location). A **URN** names a resource without locating it (`urn:isbn:…`).

| Type | Identifies         | Includes access method |
| ---- | ------------------ | ---------------------- |
| URI  | Resource (general) | Optional               |
| URL  | Resource location  | Yes (`https://…`)      |
| URN  | Resource name      | No (`urn:isbn:…`)      |

**How it works:**

An absolute HTTP(S) URL is `scheme ":" "//" authority path [ "?" query ] [ "#" fragment ]`. Authority is `[ userinfo "@" ] host [ ":" port ]` (RFC 3986). The browser resolves the host via [DNS](#internet-web--dns) to an IP, then opens TCP to the port.

| Part | Example | Role |
| ---- | ------- | ---- |
| Scheme | `https` | Protocol; `:` is the separator. `http` is unencrypted. Also `mailto:`, `ftp:`, `ws:` / `wss:`. |
| Authority | `user:pass@host:443` | Starts after `://`. Usually just the host. |
| Userinfo | `admin:secret@` | Login + password before `@`. RFC 3986 **deprecates** `user:password` in URLs (leaks in history, logs, Referer). Browsers may ignore or block it. |
| Host | `doka.guide` | Domain or IP. People type names; DNS is the phonebook to IPv4/`A` and IPv6/`AAAA`. |
| Port | `:443` | Process on the host. WHATWG defaults: **http/ws → 80**, **https/wss → 443**, **ftp → 21**. Default port is omitted from the URL and from `origin`. |
| Path | `/tools/url` | Resource on the origin. |
| Query | `?query=hi&category=js` | Starts at `?`; pairs `key=value` joined by `&`. Same key may repeat. Not the resource identity — filters, search, pagination. REST split: [query vs path params](#query-parameters--path-params). |
| Fragment | `#kratko` | Starts at `#`. Client-only; **not sent to the server**. Scrolls to `id` / named anchor. |

No host — the browser fills scheme/host from the current document (or `<base href>`). Path without `/` is relative to the current path; `/…` is from the origin root; `../` goes up one path segment; `//host/path` is scheme-relative (keep `https`/`http`). The address bar resembles a file path; SSR may hide `index.html`, and client routing can show a virtual path via History API — [Files & file systems](./8_nodejs.md#files--file-systems).

One registered domain can front several services (`mail.google.com` vs `www.google.com`). `www` is just a common third-level name; most sites redirect `www` ↔ apex.

**When to use:**

Paste a full URL in the address bar; `<a href>` / `location`; REST resource IDs; `mailto:` contact links.

#### Common pitfalls

Putting secrets in query or userinfo; treating `#` as a server param; omitting encoding (`привет` must be percent-encoded on the wire); assuming extra ports are a security control (obscurity only — use auth). `www` vs apex are different hosts until DNS/redirects say otherwise.

**Pluses and minuses:**

| + | − |
| - | - |
| Human-readable vs raw IPs | Userinfo in URLs is a credential leak |
| Relative links survive domain moves | Fragment never reaches the API |
| `URL` / `URLSearchParams` parse safely | Hand-splitting `?` / `&` breaks encoding |

**Examples:**

```
https://doka.guide/tools/url
https://doka.guide/search/?query=привет&category=html#results
mailto:hi@doka.guide
urn:isbn:978-0-393-04002-9
```

```js
const url = new URL('https://doka.guide');
const page = new URL('/tools/url', url);
page.searchParams.set('q', 'url');
page.hash = 'kratko';
page.href;
// https://doka.guide/tools/url?q=url#kratko
```

**Thoughts:** URL = *how to fetch* + *where*; DNS turns the host into an IP; query is extra input; hash stays in the browser.

**Sources:**

[MDN — URI](https://developer.mozilla.org/en-US/docs/Glossary/URI) · [MDN — URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) · [WHATWG URL](https://url.spec.whatwg.org/) · [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) · [Doka — URL](https://doka.guide/tools/url/)

---

</details>

<details>
  <summary>Host vs domain</summary>

### Host vs domain

**Definition:**

A host is a machine (server) on the network with an IP address; a domain is a human-readable name that DNS maps to one or more hosts. In a URL the host sits in the authority; anatomy: [URI, URL & URN](#uri-url--urn).

| Term        | Meaning                                                       |
| ----------- | ------------------------------------------------------------- |
| Host        | Physical/virtual server (`api.example.com` resolves to an IP) |
| Domain      | Registered name (`example.com`)                               |
| Web hosting | Service that stores and serves site files                     |

**Examples:**

```
Domain: google.com
Host:   www.google.com → 142.250.185.78
```

**Sources:**

[MDN — Host glossary](https://developer.mozilla.org/en-US/docs/Glossary/Host)

---

</details>

<details>
  <summary>Query parameters & path params</summary>

### Query parameters & path params

**Definition:**

Path parameters identify a resource in the URL path; query parameters filter, sort, or paginate without changing the resource identity. Full URL parts (scheme, host, fragment, relative links): [URI, URL & URN](#uri-url--urn). JS helpers: [URL / URLSearchParams](./3_js_browser.md#url--urlsearchparams).

| Style       | Example                       | Use case                 |
| ----------- | ----------------------------- | ------------------------ |
| Path param  | `/books/3`                    | Resource identity        |
| Query param | `/books?sort=title&page=2`    | Filtering, pagination    |
| Both        | `/users/1/orders?status=open` | Nested resource + filter |

**Examples:**

```js
const params = new URLSearchParams({ page: '2', limit: '20' });
fetch(`/api/books?${params}`);
```

**Sources:**

[MDN — URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

---

</details>

<details>
  <summary>API (Application Programming Interface)</summary>

### API (Application Programming Interface)

**Definition:** *API (Application Programming Interface)* is the set of features one program exposes to others: “talk to me this way — ask here, change things there.” It exists so modules, systems, and languages can communicate (JS client ↔ Python/Java server, exported functions, Gulp, Arduino SDK).

**How it works:**

A JS client cannot pass a native object to a Python/Java server. Both sides agree on a surface (URLs + HTTP methods, exported functions, SDK methods) and usually a wire format (JSON). That surface is the API.

| API type             | Where it runs             | Example                                         |
| -------------------- | ------------------------- | ----------------------------------------------- |
| Browser / Web API    | In the browser (`window`) | `fetch`, `console.log`, `localStorage`          |
| Library / module API | Same process              | Exported `CreditCalculator` functions, Gulp API |
| Device / SDK API     | Native / firmware         | Arduino SDK                                     |
| Web/HTTP API         | Over HTTP                 | REST, GraphQL, RPC endpoints                    |
| Third-party API      | External platform         | X (Twitter), Stripe, Maps                       |

**Ideal API** (Doka: бесшовность, быстродействие, понятность, полнота) — all four are the goal; a perfect API does not exist.

| Quality  | RU             | One-liner                       |
| -------- | -------------- | ------------------------------- |
| Seamless | Бесшовность    | Reuse with glue, not a rewrite  |
| Fast     | Быстродействие | Cheap serialize + round-trip    |
| Clear    | Понятность     | Names that don’t mislead        |
| Complete | Полнота        | Right amount of data per action |

- **Бесшовность (seamless)** — **Definition:** reuse once-written behavior in another project with only a thin adapter, not a rewrite. No universal module exists; the most seamless API is the one where that glue hurts least.
- **Быстродействие (fast)** — **Definition:** time spent translating (usually to JSON), talking to the DB, and returning data. Less time on that path = better API.
- **Понятность (clear)** — **Definition:** names of functions, methods, and URLs that match intent so callers make fewer mistakes.
- **Полнота (complete)** — **Definition:** each action returns the right amount of data — not missing fields, not a dump of everything.

**When to use:**

Browser talking to a backend; one module used by the rest of an app; plugins consuming a host API (Gulp); hardware SDKs.

#### Common pitfalls

Treating “API” as only REST URLs; over/under-fetching from a poorly shaped contract; copying JSON-RPC 1.0 response shapes (`result` + `error: null`) into JSON-RPC 2.0.

**Examples:**

```http
POST /api/v1.0/users   → create user
GET  /api/v1.0/users   → list users
```

```js
localStorage.setItem('key', 'value');
console.log('debug');
```

**Thoughts:** API is any published contract between programs — HTTP routes are one kind, not the only kind.

**Sources:**

[Doka — What is an API](https://doka.guide/tools/api/) · [AWS — What is an API?](https://aws.amazon.com/what-is/api/) · [MDN — Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

---

</details>

<details>
  <summary>CDN (Content Delivery Network)</summary>

### CDN (Content Delivery Network)

**Definition:** A CDN is a geographically distributed network of edge servers that cache and serve static content closer to users.

**Pluses and minuses:**

| +                             | −                          |
| -------------------------------- | ----------------------------- |
| Lower latency, less origin load  | Cache invalidation complexity |
| DDoS mitigation, TLS termination | Extra cost and configuration  |

**Examples:**

```html
<script src="https://cdn.example.com/lib/react.min.js"></script>
```

**Thoughts:** Edge HTML + HTTP/2/3/TLS 1.3 is the usual network fix for high TTFB. Full metric: [TTFB](#ttfb-time-to-first-byte).

**Sources:**

[Cloudflare — What is a CDN?](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)

---

</details>

<a name="2-rest"></a>

## 2. REST

See also: [SOAP](#3-soap) · [RPC](#4-rpc) · [REST vs SOAP vs RPC](#5-rest-vs-soap-vs-rpc) · [tRPC](#6-trpc)

<details>
  <summary>REST</summary>

### REST

**Definition:** REST (Representational State Transfer) is a **style of communication** between components: all needed data is specified in the request (path, HTTP method, query, or body). It is one of the most common API styles on the internet.

**How it works:**

The URL stays a **noun**; CRUD lives in the HTTP method. Same address, different verb. Fielding also requires client–server, stateless, uniform interface, cacheable, layered (HATEOAS / code-on-demand optional and rare).

| CRUD       | HTTP                                               |
| ---------- | -------------------------------------------------- |
| Create (C) | `POST`                                             |
| Read (R)   | `GET`                                              |
| Update (U) | `PUT` (whole object) / `PATCH` (named fields only) |
| Delete (D) | `DELETE`                                           |

**When to use:** Public web/CRUD APIs. Fix over/under-fetch with a **BFF**. Deeper mapping: [CRUD & REST mapping](#crud--rest-mapping).

**Pluses and minuses:**

| +                         | −                              |
| ---------------------------- | --------------------------------- |
| Most common style            | Bad design over- or under-fetches |
| Built on HTTP                | Strict REST (HATEOAS) is rare     |
| Easy to read (verbs + paths) | Many endpoints for nested data    |

**Examples:**

```http
GET /api/users/42 HTTP/1.1
Accept: application/json

→ 200 OK
{ "id": 42, "name": "Ada" }
```

**Thoughts:** Same address, different method — details in verb + params/body.

**Sources:**

[ByteByteGo — REST cheatsheet](https://blog.bytebytego.com/p/ep94-rest-api-cheatsheet) · [Doka — What is an API](https://doka.guide/tools/api/)

---

</details>

<details>
  <summary>REST & Fielding constraints</summary>

### REST & Fielding constraints

**Definition:** Fielding’s REST is six architectural constraints for distributed hypermedia — not “JSON over HTTP” by itself.

**How it works:**

| Principle                 | Meaning                             |
| ------------------------- | ----------------------------------- |
| Client–server             | UI and storage separated            |
| Stateless                 | Each request carries all context    |
| Uniform interface         | URIs + HTTP verbs + representations |
| Cacheable                 | Responses may be cached             |
| Layered system            | Proxies, CDN, gateway are OK        |
| Code on demand (optional) | Server may send executable code     |

**When to use:** Interview: name the six constraints. Practice is usually client–server + stateless + verbs. HATEOAS is rare.

**Sources:**

[Roy Fielding — REST dissertation](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)

---

</details>

<details>
  <summary>REST alternatives</summary>

### REST alternatives

**Definition:**

Other styles trade REST’s resource + HTTP-verb model for queries, streams, or remote procedures. Full notes: [SOAP](#3-soap) · [RPC](#4-rpc) · [REST vs SOAP vs RPC](#5-rest-vs-soap-vs-rpc) · [tRPC](#6-trpc).

| Style     | Strength                         | Typical use                    |
| --------- | -------------------------------- | ------------------------------ |
| GraphQL   | Client-shaped queries            | Mobile, complex UIs            |
| gRPC      | Binary, HTTP/2, streaming        | Microservices                  |
| WebSocket | Full-duplex real-time            | Chat, games                    |
| JSON-RPC  | Simple remote procedures         | Lightweight RPC                |
| tRPC      | TS end-to-end types, no codegen  | TS fullstack / monorepo        |
| SOAP      | XML envelopes, WS-*              | Legacy enterprise              |

**Examples:**

```graphql
query {
  user(id: 42) { name posts { title } }
}
```

**Sources:**

[GraphQL](https://graphql.org/) · [gRPC](https://grpc.io/)

---

</details>

<details>
  <summary>CRUD & REST mapping</summary>

### CRUD & REST mapping

**Definition:** CRUD maps Create, Read, Update, and Delete operations to HTTP methods against resource URLs. In REST-style APIs the path stays a noun; the verb lives in the method.

**How it works:**

Same collection URL, different methods. `PUT` replaces the whole resource; `PATCH` applies a partial update and may not be idempotent (e.g. increment). Successful updates/deletes often return **204 No Content**.

| Operation        | HTTP method | Example                                             |
| ---------------- | ----------- | --------------------------------------------------- |
| Create           | POST        | `POST /api/orders/` → often **201** + new id (`42`) |
| Read (list)      | GET         | `GET /api/orders`                                   |
| Read (one)       | GET         | `GET /api/orders/42` → JSON (typical)               |
| Update (full)    | PUT         | `PUT /api/orders/42`                                |
| Update (partial) | PATCH       | `PATCH /api/orders/42`                              |
| Delete           | DELETE      | `DELETE /api/orders/42` → often **204**             |

**When to use:** Shop/order APIs and any CRUD HTTP surface. Prefer REST when caching and HTTP semantics matter.

**Examples:**

```http
POST   /api/orders/      → create; response often new id (42)
GET    /api/orders/42    → JSON (typical; XML/HTML possible)
PUT    /api/orders/42    → full replace; often 204 or id
PATCH  /api/orders/42    → only sent fields
DELETE /api/orders/42    → often 204 or deleted id
```

**Thoughts:** Address names the resource; HTTP method names the CRUD action.

**Sources:**

[MDN — HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods) · [Doka — What is an API](https://doka.guide/tools/api/)

---

</details>

<details>
  <summary>REST vs RESTful</summary>

### REST vs RESTful

**Definition:**

REST describes the architectural constraints; RESTful describes an API that follows those constraints in practice (often partially).

| REST (theory)         | RESTful (practice)                        |
| --------------------- | ----------------------------------------- |
| All six constraints   | Usually client–server + stateless + verbs |
| HATEOAS hypermedia    | Rarely implemented fully                  |
| Strict resource nouns | Sometimes RPC-style paths                 |

**Examples:**

```
RESTful:  GET /users/1/orders
Less REST: POST /users/1/getOrders   ← verb in URL
```

**Sources:**

[Roy Fielding — REST dissertation](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)

---

</details>

<details>
  <summary>REST versioning & pagination</summary>

### REST versioning & pagination

**Definition:** **Versioning** lets you evolve APIs without breaking existing clients. **Pagination** splits large collections into pages so responses stay bounded.

**How it works:**

- **Versioning** — clients pin a version via URL path (`/v2/users`), query (`?version=2`), or header (`Accept: application/vnd.api+json;version=2`). Server routes to the matching handler/schema.
- **Offset pagination** — `?page=2&limit=20` → `OFFSET 20 LIMIT 20`. Simple but slow at high offsets (DB scans skipped rows).
- **Cursor/keyset pagination** — `?cursor=eyJpZCI6MTIzfQ&limit=20` encodes last-seen sort key (`id` or `created_at`). Stable under inserts; no deep-offset penalty.
- **Link headers** — `Link: <...?page=3>; rel="next"` (RFC 8288) or JSON `{ data, meta: { nextCursor, hasMore } }`.

**When to use:**

- Ship **v2** when removing fields or changing semantics; keep **v1** for a deprecation window.
- Use **cursor** for infinite scroll and feeds; **offset** for admin tables with page numbers.
- Always return **total count** only when cheap — counting millions of rows is expensive.

**Pluses and minuses:**

| Strategy                  | +                     | −                                                  |
| ------------------------- | ------------------------ | ----------------------------------------------------- |
| URL path version (`/v1/`) | Obvious in logs and docs | URL churn; multiple code paths                        |
| Header version            | Clean URLs               | Harder to test in browser                             |
| Offset pagination         | Easy to implement        | Slow `OFFSET` at scale; duplicates/skips on live data |
| Cursor pagination         | Efficient, stable sort   | Cannot jump to arbitrary page number                  |

**Examples:**

```http
GET /api/v2/books?limit=20&cursor=eyJpZCI6MTAwfQ HTTP/1.1
Accept: application/json

→ 200 OK
{
  "data": [ { "id": 101, "title": "Dune" } ],
  "meta": { "limit": 20, "nextCursor": "eyJpZCI6MTIwfQ", "hasMore": true }
}
```

**Thoughts:** Version in URL is the most common interview answer. Never break clients silently — announce sunset dates and return `410 Gone` or deprecation headers (`Sunset`, `Deprecation`).

**Sources:**

[MDN — HTTP pagination patterns](https://developer.mozilla.org/en-US/docs/Web/HTTP) · [RFC 8288 — Web Linking](https://datatracker.ietf.org/doc/html/rfc8288)

---

</details>

<a name="xml"></a>

## XML

See also: [SOAP](#3-soap) · [REST](#2-rest) · [HTML vs XML](./1_html.md#html-vs-xml) · [canvas vs SVG](./1_html.md#canvas-vs-svg)

<details>
  <summary>XML</summary>

### XML

**Definition:** XML (Extensible Markup Language) is a markup language like HTML, but **you define the tags**. It is a standardized *syntax* for storing and exchanging data (enterprise APIs, SOAP, RSS, SVG, config) — not a UI language.

**How it works:**

- Markup vs data: tags/attributes are structure; text between tags is payload.
- **One root** element wraps the rest. Extra roots → not well-formed.
- **XML declaration** (`<?xml version="1.0" encoding="UTF-8"?>`) is optional meta, **not a tag**. If present, it must be the first thing in the file (before comments).
- **Well-formed:** every start tag has an end tag; empty nodes are `<cat></cat>` or `<cat />`; attributes are quoted (`"` or `'`); names are case-sensitive; unescaped `<` `&` in text are illegal (`&lt;` `&amp;`).
- **Valid** is stricter: well-formed *and* matching a DTD/XSD. Browsers often only check well-formedness.
- Built-in entities: `&lt;` `&gt;` `&amp;` `&quot;` `&apos;`. More via DTD.
- **Attributes** = metadata (ids, categories). **Child elements** = the data you would put in JSON fields.
- **Namespaces (`xmlns`):** same local name (`table`) in two vocabularies. Prefix: `xmlns:classic="URI"` then `classic:table`. Default: `xmlns="URI"` on an element and descendants. The URI is an **identifier**, not a document the parser must fetch. Declaring a namespace does **not** by itself restrict tags to a schema — that is validation. `xmlns=""` undeclares the default namespace (Namespaces in XML 1.0). You can hoist prefix declarations onto the root.
- Standalone **SVG as XML** needs `xmlns="http://www.w3.org/2000/svg"` on the outer `<svg>` or the UA will not treat it as SVG. Inline SVG in HTML serialization does **not** require `xmlns` (namespace is implied).

| | XML | HTML | JSON |
|---|-----|------|------|
| Tags | You invent them | Fixed vocabulary | No tags — objects/arrays |
| Purpose | Data / documents | Display in a browser | Data interchange |
| Errors | Strict well-formedness | Browsers recover | `JSON.parse` throws |
| Types | Text (+ optional schema) | N/A | Number, bool, null, string, object, array |
| In JS | Parse to DOM / tree | Browser already parsed | Native after `JSON.parse` |

**When to use:**

SOAP / XML-RPC; RSS/Atom; SVG/MathML files; legacy enterprise interchange; when a schema (XSD) is the contract. Prefer JSON for new public HTTP APIs.

#### Common pitfalls

- Unclosed tags — the whole document is rejected.
- Treating `xmlns` URIs as files you must host, or assuming `xmlns` validates elements.
- Missing SVG `xmlns` on a `.svg` file opened as XML.
- Assuming JSON “needs no parsing” in JS — the wire is still a string.
- Confusing XML (syntax) with SOAP (envelope protocol on top of XML).

**Pluses and minuses:**

| + | − |
|------|------|
| Same syntax everywhere; easy to round-trip between systems | Verbose (open + close tags) |
| Human-readable tree; attributes + nested elements | All values are text unless a schema adds types |
| Namespaces disambiguate mixed vocabularies | Namespaces are easy to get wrong |
| Separates data from HTML (store XML, render HTML) | Must parse (`DOMParser`, backend XML libs) — unlike a JS object after `JSON.parse` |

**Examples:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<petstore>
  <pet category="cat">
    <name>Boris</name>
    <year>2021</year>
    <price>485.00</price>
  </pet>
  <pet category='dog "corgi"' />
</petstore>
```

Namespace clash (`table` as HTML vs `table` as “cat furniture”) — prefixes on the root:

```xml
<root
  xmlns:html="http://www.w3.org/1999/xhtml"
  xmlns:cat="https://example.com/cat-table">
  <html:table>
    <html:tr><html:th>Col</html:th></html:tr>
  </html:table>
  <cat:table>
    <cat:name>Boris</cat:name>
  </cat:table>
</root>
```

Film record (typical payload):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<film>
  <name>Shrek</name>
  <description>animation, fantasy, comedy</description>
  <creationYear>2001</creationYear>
  <budget>60000000</budget>
</film>
```

**Thoughts:** XML is a strict, self-describing tree for data; HTML is for pages; JSON is the usual API wire format today.

**Sources:**

[MDN — XML introduction](https://developer.mozilla.org/en-US/docs/Web/XML/Guides/XML_introduction) · [MDN — SVG namespaces](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/Namespaces_crash_course) · [Doka — XML](https://doka.guide/tools/xml/)

---

</details>

<a name="3-soap"></a>

## 3. SOAP

See also: [XML](#xml) · [REST](#2-rest) · [RPC](#4-rpc) · [REST vs SOAP vs RPC](#5-rest-vs-soap-vs-rpc) · [tRPC](#6-trpc)

<details>
  <summary>SOAP</summary>

### SOAP

**Definition:** SOAP (Simple Object Access Protocol) is a **data-exchange format**: every message follows a fixed structure, almost always XML (Envelope / Header / Body / Fault). REST is an architectural *style*; SOAP is a *format* — they are not the same kind of thing. XML syntax itself: [XML](#xml).

**How it works:**

Unlike REST, **which HTTP method you use does not matter** for the SOAP contract. The packet is nested XML:

```text
┌─ SOAP-ENV:Envelope ─────────────────────────────────┐
│  root element — this XML *is* the message           │
│  ┌─ SOAP-ENV:Header ──────────────────────────────┐ │
│  │ attributes of the message, e.g. security       │ │
│  └────────────────────────────────────────────────┘ │
│  ┌─ SOAP-ENV:Body ────────────────────────────────┐ │
│  │ payload the applications exchange              │ │
│  └────────────────────────────────────────────────┘ │
│                              (Fault — optional)  ○  │
└─────────────────────────────────────────────────────┘
```

| Part         | RU (Doka)                                                       | Definition                                |
| ------------ | --------------------------------------------------------------- | ----------------------------------------- |
| **Envelope** | корневой элемент, который определяет само сообщение             | Root element — the SOAP message itself    |
| **Header**   | содержит атрибуты сообщения, например информацию о безопасности | Message attributes (security, routing, …) |
| **Body**     | содержит сообщение, которым обмениваются приложения             | Payload exchanged between apps            |
| **Fault**    | необязательный элемент с ошибками обработки, если они были      | Optional processing errors (if any)       |

**When to use:** Legacy enterprise SOAP. New public APIs almost always REST/JSON or RPC/gRPC.

**Pluses and minuses:**

| +                           | −                                      |
| ------------------------------ | ----------------------------------------- |
| Independent of transfer method | Verbose                                   |
| Strict message structure       | Harder on the client than REST            |
| WSDL / WS-* (enterprise)       | XML loses to JSON; SOAP-over-JSON is rare |

**Examples:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getOrderDetails xmlns="https://example-store.com/orders">
      <orderID>42</orderID>
    </getOrderDetails>
  </soap:Body>
</soap:Envelope>
```

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getOrderDetailsResponse xmlns="https://example-store.com/orders">
      <getOrderDetailsResult>
        <orderID>42</orderID>
        <userID>43</userID>
        <dateTime>2020-10-10T12:00:00</dateTime>
        <products>
          <productID>1</productID>
          <productID>23</productID>
          <productID>45</productID>
        </products>
      </getOrderDetailsResult>
    </getOrderDetailsResponse>
  </soap:Body>
</soap:Envelope>
```

**Thoughts:** SOAP wraps an operation in XML; REST maps CRUD to HTTP on a resource URL.

**Sources:**

[MDN — SOAP glossary](https://developer.mozilla.org/en-US/docs/Glossary/SOAP) · [Doka — What is an API](https://doka.guide/tools/api/)

---

</details>

<a name="4-rpc"></a>

## 4. RPC

See also: [REST](#2-rest) · [SOAP](#3-soap) · [XML](#xml) · [REST vs SOAP vs RPC](#5-rest-vs-soap-vs-rpc) · [tRPC](#6-trpc)

<details>
  <summary>RPC</summary>

### RPC

**Definition:** RPC (Remote Procedure Call) is a style where the request message stores **both the action to execute and the data that action needs**. On the web that is roughly “call server functionality from the browser.” XML-RPC and JSON-RPC are common; JSON-RPC is easier to read. gRPC is typed RPC over Protobuf + HTTP/2. **tRPC** is TypeScript RPC: you call procedures as functions; types come from the server router, not from OpenAPI/GraphQL codegen.

**How it works:**

| Field    | Request                                       | Response                                 |
| -------- | --------------------------------------------- | ---------------------------------------- |
| `method` | Name of the procedure                         | —                                        |
| `params` | Array of arguments                            | —                                        |
| `id`     | Correlate request ↔ response (parallel calls) | Same `id`                                |
| `result` | —                                             | Return value, or `null` on error         |
| `error`  | —                                             | Error code/message, or `null` on success |

`"jsonrpc": "2.0"`; `params` optional; omit `id` for a notification. Success has **only** `result`. Error has **only** `error` (`code`, `message`). Never both.

|            | JSON-RPC                            | gRPC                      |
| ---------- | ----------------------------------- | ------------------------- |
| Format     | JSON                                | Protocol Buffers          |
| Transport  | HTTP, WebSocket, etc.               | HTTP/2                    |
| Codegen    | Manual                              | Auto from `.proto`        |
| Streaming  | Limited                             | Bidirectional             |
| HTTP cache | Usually unused (POST + method name) | Not REST-cacheable either |

**When to use:**

Internal “call this procedure” APIs, batching. Prefer REST when intermediaries should cache GET. Prefer gRPC for typed internal services. Prefer tRPC when client and server share TypeScript.

#### Common pitfalls

Doka’s sample `"jsonrpc": "2.0"` with both `result` and `"error": null` is **1.0-shaped**. Spec 2.0 uses *either* `result` *or* `error`.

**Pluses and minuses:**

| +                                  | −                          |
| ------------------------------------- | ----------------------------- |
| Structured messages                   | Too much logic on the client  |
| JSON is easy to read/write            | HTTP caching is unavailable   |
| Fast when you need **batch** requests | URLs don’t describe resources |

**Examples:**

```json
{
  "jsonrpc": "2.0",
  "method": "orders.get",
  "params": [42],
  "id": 1
}
```

**Example (2.0 success — no** `error` **key):**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "orderId": 42,
    "userId": 43,
    "dateTime": "2020-10-10T12:00:00",
    "products": [{ "productID": 1 }, { "productID": 23 }, { "productID": 45 }]
  },
  "id": 1
}
```

**Example (2.0 error — no** `result` **key):**

```json
{
  "jsonrpc": "2.0",
  "error": { "code": -32000, "message": "Order not found" },
  "id": 1
}
```

**Thoughts:** RPC names the procedure; REST names the resource.

**Sources:**

[JSON-RPC spec](https://www.jsonrpc.org/specification) · [gRPC](https://grpc.io/docs/what-is-grpc/introduction/) · [Doka — What is an API](https://doka.guide/tools/api/)

---

</details>

<a name="5-rest-vs-soap-vs-rpc"></a>

## 5. REST vs SOAP vs RPC

See also: [REST](#2-rest) · [SOAP](#3-soap) · [XML](#xml) · [RPC](#4-rpc) · [tRPC](#6-trpc)

<details>
  <summary>REST vs SOAP vs RPC</summary>

### REST vs SOAP vs RPC

**Definition:** In web work, “API” usually means HTTP to a server. REST, SOAP, and RPC are three different *ways* to shape that conversation — not three equal protocols. REST is a style; SOAP is a message format; RPC is “call this function remotely.” tRPC is one TypeScript implementation of RPC.

**How it works:**

|                             | REST                                              | SOAP                                      | RPC (JSON-RPC)                              | tRPC                                              |
| --------------------------- | ------------------------------------------------- | ----------------------------------------- | ------------------------------------------- | ------------------------------------------------- |
| **Kind**                    | Architectural style                               | Data-exchange format                      | Remote procedure style                      | TS RPC library                                    |
| **Definition**              | Needed data is in the request (URL + verb + body) | Structured XML envelope                   | Request holds action *and* data             | Call a typed server procedure as a function       |
| **How you name the action** | HTTP method + resource path                       | Operation XML in Body (`getOrderDetails`) | `method` string (`orders.get`)              | Router path (`orders.get`)                        |
| **Typical wire**            | JSON                                              | XML                                       | JSON (or Protobuf for gRPC)                 | JSON over HTTP (JSON-RPC-shaped envelope)         |
| **Do HTTP verbs matter?**   | Yes (CRUD)                                        | No — transport is not the contract        | Usually one POST                            | Mapped: query → GET, mutation → POST              |
| **HTTP cache**              | GET can be cached                                 | Weak                                      | Weak / unavailable                          | Query GET *can* be cached; often batched POST     |
| **Types**                   | Hand-written / OpenAPI                            | WSDL                                      | Manual or `.proto` (gRPC)                   | Infer from `AppRouter` — no codegen               |
| **Pros**                    | Common, HTTP-native, readable                     | Transport-agnostic, structured            | Structure, JSON, good batches               | End-to-end TS, autocomplete, batching             |
| **Cons**                    | Over/under-fetch (BFF helps)                      | Verbose, awkward on the client            | Logic on the client; no HTTP cache          | TS-to-TS; not a public resource API by default    |
| **When to use**             | Public CRUD, web/mobile                           | Legacy enterprise / WSDL                  | Internal procedures, batches, gRPC services | TS fullstack / monorepo                           |

```http
GET /api/orders/42
```

```xml
<soap:Body><getOrderDetails><orderID>42</orderID></getOrderDetails></soap:Body>
```

```json
{ "jsonrpc": "2.0", "method": "orders.get", "params": [42], "id": 1 }
```

```http
GET /api/trpc/orders.get?input=%7B%22id%22%3A42%7D
```

```ts
const order = await client.orders.get.query({ id: 42 });
```

**When to use:** Interview: “REST is not SOAP’s opposite.” Pick REST for public HTTP; SOAP when the partner already speaks SOAP; RPC/gRPC for internal typed calls; tRPC when both sides are TypeScript.

**Thoughts:** REST = resource + verb. SOAP = envelope. RPC = method + params. tRPC = typed RPC functions over HTTP.

**Sources:**

[Doka — What is an API](https://doka.guide/tools/api/) · [tRPC — concepts](https://trpc.io/docs/concepts) · [tRPC HTTP RPC spec](https://trpc.io/docs/rpc)

---

</details>

<a name="6-trpc"></a>

## 6. tRPC

See also: [RPC](#4-rpc) · [REST vs SOAP vs RPC](#5-rest-vs-soap-vs-rpc)

<details>
  <summary>tRPC</summary>

### tRPC

**Definition:** tRPC (TypeScript Remote Procedure Call) is RPC for TypeScript: you define server procedures and call them from the client with inferred input/output types — no OpenAPI or GraphQL schema and no codegen. Docs mindset: “it’s just functions,” not `GET /users/:id`.

**How it works:**

- Server: `initTRPC` → `router` → procedures: `.query()`, `.mutation()`, `.subscription()`. Export `type AppRouter = typeof appRouter`.
- Client: `createTRPCClient<AppRouter>` (often `httpBatchLink`). TypeScript infers the tree; a renamed procedure breaks the client at compile time.
- One HTTP endpoint (e.g. `/api/trpc`); tRPC routes internally. Nested procedures use dots: `post.byId` → `/api/trpc/post.byId`.
- HTTP mapping (default): **query → GET** with JSON input in `?input=`; **mutation → POST** with JSON body. Subscriptions: SSE (`httpSubscriptionLink`) or WebSocket (`wsLink`).
- Envelopes follow **JSON-RPC 2.0** where possible (`result.data` vs `error` with JSON-RPC-style codes).
- **Batching** (`httpBatchLink`): same-method parallel calls become one request — path `postById,relatedPosts`, `?batch=1&input={...}`; mixed success/error can return `207 Multi-Status`.
- Can sit next to REST: REST keeps resource URLs; tRPC owns one RPC endpoint.

**When to use:**

Next.js / Node fullstack in a TS monorepo. Prefer REST/OpenAPI when unknown clients, CDNs keyed on resource URLs, or non-TS consumers matter. Prefer gRPC when you need binary + HTTP/2 streaming across languages.

#### Common pitfalls

Calling `fetch('/api/trpc/users/123')` like REST — use `client.user.byId.query({ id: '123' })` (wire: `GET /api/trpc/user.byId?input=...`). Sharing only runtime code without the `AppRouter` type. Treating GET/POST as REST CRUD — verbs are transport; intent is in the procedure name (`getUser` vs `GET /users/:id`). Huge query inputs on GET (use `methodOverride: 'POST'` if the server allows it).

**Pluses and minuses:**

| + | − |
| ---- | ---- |
| End-to-end types, no codegen | Client and server must share TypeScript (`AppRouter`) |
| Autocomplete; breaking API changes show up in the client | Poor default for public polyglot APIs (need REST/OpenAPI) |
| Query GET + mutation POST; optional batching | Query input in the URL — size limits; cache is not REST-by-resource |
| Adapters: fetch, Next.js `/api/trpc/*`, standalone | Inspecting the wire still looks like RPC, not REST resources |

**Examples:**

```ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

const appRouter = t.router({
  post: t.router({
    byId: t.procedure.input(z.string()).query((opts) => {
      return { id: opts.input, title: 'tRPC is the best!' };
    }),
    create: t.procedure
      .input(z.object({ title: z.string() }))
      .mutation((opts) => ({ id: '1', ...opts.input })),
  }),
});

export type AppRouter = typeof appRouter;
```

```ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server';

const client = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: 'http://localhost:3000/api/trpc' })],
});

const post = await client.post.byId.query('1');
await client.post.create.mutate({ title: 'Hello' });
```

**Thoughts:** tRPC is typed TypeScript RPC over HTTP, not REST with extra types.

**Sources:**

[tRPC introduction](https://trpc.io/docs) · [tRPC — concepts](https://trpc.io/docs/concepts) · [tRPC HTTP RPC spec](https://trpc.io/docs/rpc)

---

</details>

<a name="7-http"></a>

## 7. HTTP

<details>
  <summary>HTTP protocol</summary>

### HTTP protocol

**Definition:** HTTP is an application-layer request/response protocol: a **client** (user-agent, usually a browser) sends messages; a **server** answers. It carries HTML, CSS, JS, JSON APIs, images, media, form data, and more.

**How it works:**

- Three HTTP-layer roles: **client** (sends requests, processes responses), **origin server** (handles them), **proxy** (relay that may cache, filter, load-balance, authenticate, or log). Routers and TCP sit below HTTP.
- The client **always initiates**. The server does not push classic HTTP responses until a request arrives (SSE / WebSocket are extra mechanisms).
- Flow: open or reuse a **TCP** connection (HTTP/3 uses **QUIC/UDP**) → send a request → read the response → keep or close the connection. HTTP/1.1 persistent connections; HTTP/2 multiplexes streams on one connection.
- **Stateless, not sessionless:** each request is independent. Cookies (and other tokens) recreate a **session** so login/cart state can span requests.
- HTTP/1.x messages are text. HTTP/2/3 keep the same **semantics** (methods, status, headers) inside binary frames. Current specs: [RFC 9110](https://httpwg.org/specs/rfc9110.html) (semantics), RFC 9112 (HTTP/1.1), RFC 9113 (HTTP/2), RFC 9114 (HTTP/3) — not the obsolete RFC 2616.

start-line → headers → blank line → optional **body**. A body is signaled by `Content-Length` or `Transfer-Encoding` (e.g. `chunked`). HEAD responses have no body; many GET requests have none.

| Start-line | Format | Example |
| ---------- | ------ | ------- |
| Request-line | `METHOD target HTTP/version` | `GET / HTTP/1.1` |
| Status-line | `HTTP/version code reason` | `HTTP/1.1 200 OK` |

| Method | Intent |
| ------ | ------ |
| `GET` | Fetch a representation (safe; should not have a request body) |
| `HEAD` | Same as GET, **no response body** |
| `POST` | Submit data / trigger processing |
| `PUT` | Replace the resource at the URI |
| `PATCH` | Partial update |
| `DELETE` | Remove the resource |
| `OPTIONS` | Communication options for the target (`*` = whole server); CORS preflight |
| `TRACE` | Loop-back of the request along the path (often disabled) |
| `CONNECT` | Open a TCP tunnel (HTTPS through a proxy) |

| Class | Meaning | Common codes |
| ----- | ------- | ------------ |
| 1xx | Informational, request continues | `100 Continue`, `103 Early Hints` |
| 2xx | Success | `200 OK` |
| 3xx | Redirect / cache revalidate | `301 Moved Permanently`, `307 Temporary Redirect` (method preserved), `304 Not Modified` |
| 4xx | Client error | `400 Bad Request`, `403 Forbidden` (identity known, no access), `404 Not Found` |
| 5xx | Server error | `500 Internal Server Error` |

Headers are metadata (`Name: value`). Informal groups: **general** (either side), **request**, **response**, **representation/entity** (`Content-Type`, `Content-Length`). Custom headers are allowed. Compression: client `Accept-Encoding: gzip, br, deflate`; server `Content-Encoding: gzip` — [HTTP compression](#http-compression-content-encoding).

Typical body media types: `text/html`, `application/json`, `multipart/form-data` (forms/files).

**Proxies** (application-layer hops): cache; filter (antivirus, parental control); load-balance; authenticate; log; sometimes detect abusive traffic. Reverse-proxy / LB detail: [0_system_design.md — Reverse proxy](./0_system_design.md#reverse-proxy).

**When to use:**

Every page load and `fetch`; REST APIs; static assets. Not for long bidirectional streams — [WebSocket](#websocket). Inspect with DevTools Network or `curl -v`.

#### Common pitfalls

Treating HTTP as “stateful” without cookies. Calling OPTIONS “data transformation.” Using `302` when you need `307` (keep POST). Enabling `TRACE` in production (cross-site tracing). Assuming HTTP/2 has a textual `GET / HTTP/2.0` on the wire.

**Pluses and minuses:**

| + | − |
| - | - |
| Universal, cacheable, human-readable (HTTP/1.1) | Plain HTTP is unencrypted — use [HTTPS](#https) |
| Extensible via headers | No built-in session — cookies/tokens |
| Same verbs/status across HTTP/1.1, 2, 3 | HTTP/2+ framing is binary; DevTools still shows 1.1-style lines |

**Examples:**

```http
GET / HTTP/1.1
Host: example.com
User-Agent: curl/8.0
Accept: */*

HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 1256

<!doctype html>…
```

```bash
curl -v http://example.com
# *  TCP / connection
# >  request (client)
# <  response (server)
```

**Thoughts:**

*The browser starts every HTTP exchange; methods and status codes are the contract; cookies add sessions on a stateless protocol.*

Structure: [HTTP request structure](#http-request-structure) · Headers: [HTTP headers](#http-headers) · Methods/status: [HTTP methods & status codes](#http-methods--status-codes) · Cookies: [HTTP cookies](#http-cookies) · JS: [HTTP in JavaScript](#http-in-javascript) · Server process: [Web server](#web-server) · Packets / DNS / LAN: [How the Internet works](#how-the-internet-works).

**Sources:**

[MDN — HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) · [MDN — HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages) · [MDN — Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods) · [MDN — Status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status) · [Doka — HTTP](https://doka.guide/tools/http-protocol/)

---

</details>

<details>
  <summary>Web server</summary>

### Web server

**Definition:** A program that accepts HTTP requests from clients (usually browsers), handles them (file, cache, proxy, or app), and sends HTTP responses.

**How it works:**

- Client–server: one server, many clients. The web server is the HTTP process on that machine (or behind a load balancer). First such programs appeared around 1991.
- Typical path: TCP (or QUIC for HTTP/3) → optional TLS → HTTP message. The server reads the start-line + headers, then the body if any, then writes a response.
- **Static:** map the request path to a file (HTML/CSS/JS/images) and return it with `Content-Type`.
- **Dynamic:** **proxy** the request to an app (Node, PHP-FPM, Python, …). The app builds the body; the web server still owns the HTTP connection to the client.
- Extra work is usually **modules**: compression, TLS certificates, auth, cache, reverse proxy. Nginx, Apache httpd, Caddy, and Node `http` are all web servers; production stacks often put Nginx/Caddy in front of the app.

Message shape (HTTP/1.1 text; HTTP/2+ uses the same semantics in binary frames / pseudo-headers):

| Part | Request | Response |
| ---- | ------- | -------- |
| Start-line | `METHOD target HTTP/1.1` | `HTTP/1.1 code reason` |
| Headers | `Name: value` per line | same |
| Blank line | end of head | end of head |
| Body | optional (POST/PUT/PATCH) | optional (not for 204 / some 1xx) |

**When to use:**

Local preview of a built site; SPA `dist/` + `/api/` proxy; TLS termination; gzip/brotli for HTML/CSS/JS.

#### Common pitfalls

Treating `GET /path HTTP/2.0` as on-the-wire HTTP/2 — HTTP/2 has no textual request-line; DevTools still *shows* method + path. Using public-key crypto for the whole payload — TLS uses asymmetric crypto in the handshake, then **symmetric** session keys ([SSL/TLS handshake](#ssltls--https-handshake)). Compressing JPEGs/ZIP again ([HTTP compression](#http-compression-content-encoding)).

**Pluses and minuses:**

| + | − |
| - | - |
| One place for TLS, compression, static files | Misconfigured proxy hides the real app error |
| Modules cover cache, auth, reverse proxy | Dev `http-server` is not a production server |

**Examples:**

```js
import { createServer } from 'node:http';

createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
}).listen(8080);
```

Local static preview (not for production load): `npx serve` or `npx http-server` in the site folder → `http://127.0.0.1:8080` (loopback). LAN URL uses the machine’s LAN IP (e.g. `http://192.168.1.56:8080`). `browser-sync` can mirror scroll/navigation across devices on the same network.

**Thoughts:**

*The web server speaks HTTP; apps, caches, and TLS are features of that process or of a reverse proxy in front of it.*

Protocol (client, proxy, messages): [HTTP protocol](#http-protocol). Listen port / `8080`: [Ports, sockets & network services](#ports-sockets--network-services).

**Sources:**

[MDN — HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages) · [Doka — Web server](https://doka.guide/tools/web-server/) · [Node.js http](https://nodejs.org/api/http.html) · Proxy: [Reverse proxy](./0_system_design.md#reverse-proxy) · [Nginx](./10_build.md#nginx) · [Node `http`](./8_nodejs.md#http)

---

</details>

<details>
  <summary>HTTP & TCP/IP</summary>

### HTTP & TCP/IP

**Definition:**

TCP/IP is the network stack; HTTP is an application protocol that runs on top of TCP, using its reliable byte stream for request/response messages.

Layer names and why OSI still shows up in interviews: [OSI & TCP/IP models](#osi--tcpip-models).

| Protocol | Layer       | Role                       |
| -------- | ----------- | -------------------------- |
| IP       | Internet    | Addressing and routing ([IPv4 & IPv6](#ipv4--ipv6)) |
| TCP      | Transport   | Reliable ordered delivery  |
| TLS      | Above TCP   | Encryption + server auth — not a TCP replacement ([HTTPS](#https)) |
| HTTP     | Application | Request/response semantics |

Ports and listening sockets: [Ports, sockets & network services](#ports-sockets--network-services). End-to-end path: [How the Internet works](#how-the-internet-works).

**Examples:**

```
Client                    Server
  |---- TCP SYN ----------->|
  |<--- SYN-ACK ------------|
  |---- ACK --------------->|
  |---- HTTP GET / -------->|
  |<--- HTTP 200 OK --------|
```

**Thoughts:** Handshake, UDP, TFO vs `initcwnd`, STUN/TURN → [TCP vs UDP](#tcp-vs-udp). HTTP/3 skips TCP and uses QUIC on UDP.

**Sources:**

[MDN — HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)

---

</details>

<details>
  <summary>HTTPS</summary>

### HTTPS

**Definition:**

HTTPS is HTTP encrypted with TLS, providing confidentiality, integrity, and server authentication via certificates.

| HTTP              | HTTPS                    |
| ----------------- | ------------------------ |
| Port 80 (default) | Port 443 (default)       |
| Plaintext         | Encrypted                |
| No certificate    | TLS certificate required |

**How it works:**

- HTTPS is **HTTP over TLS** on port **443** (HTTP is plaintext on **80**).
- Extra work vs HTTP: **TLS handshake** (authenticate the server with a certificate, agree session keys) then **encrypt** request/response bytes on the wire.
- Confidentiality (eavesdroppers cannot read), integrity (tamper detection), authenticity (certificate chain to a trusted CA). Modern browsers treat many APIs as **secure-context** only (HTTPS).
- After TCP connects, TLS runs **before** any HTTP headers/body. HTTP/2 and HTTP/3 still sit on this encrypted channel (HTTP/3 uses QUIC/UDP, not TCP).

**When to use:** All production websites; cookies with `Secure`; mixed content blocked if page is HTTPS and subresource is HTTP.

**Pluses and minuses:**

| +                                 | −                                               |
| ------------------------------------ | -------------------------------------------------- |
| Stops MiTM reading/changing traffic  | First visit pays TLS handshake latency             |
| Required for modern browser features | Certificate misconfig / expiry takes the site down |

**Examples:**

```
https://example.com
  → TCP handshake
  → TLS handshake (cert + session keys)
  → Encrypted HTTP GET / HTTP response
```

**Thoughts:**

*HTTPS = HTTP + TLS handshake + encryption; the HTTP verbs and headers are the same, the wire is not.*

On public Wi-Fi, HTTP is a **MITM** (read/alter) risk. TLS certificates from a trusted CA stop a café attacker from swapping keys. Users who click through cert warnings undo that. HSTS reduces HTTP downgrade. Symmetric vs public-key vs hashes: [Special — Encryption](./7_special.md#encryption). What a cert contains and who signs it: [TLS certificates](#tls-certificates-x509--pki). See [Special — MITM](./7_special.md#man-in-the-middle-mitm).

**Sources:**

[howhttps.works](https://howhttps.works/) · [MDN — TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS)

---

</details>

<details>
  <summary>HTTP method characteristics</summary>

### HTTP method characteristics

**Definition:**

HTTP methods have semantic properties — safe (read-only), idempotent (repeatable without side effects), and cacheable.

| Property   | Meaning                   | Methods                                      |
| ---------- | ------------------------- | -------------------------------------------- |
| Safe       | No server state change    | GET, HEAD, OPTIONS, TRACE                    |
| Idempotent | Same effect when repeated | GET, HEAD, OPTIONS, TRACE, PUT, DELETE       |
| Cacheable  | Response may be stored    | GET, HEAD (typically); POST/PATCH if freshness + `Content-Location` |
| Neither    | Tunnel / side effects     | CONNECT (not safe, not idempotent, not cacheable) |

**Examples:**

```http
GET /api/counter HTTP/1.1     ← safe, idempotent
POST /api/counter/increment   ← not safe, not idempotent
PUT /api/settings/theme       ← idempotent replace
```

**Thoughts:** CONNECT/TRACE and status classes: [HTTP protocol](#http-protocol). Full method table: [HTTP methods & status codes](#http-methods--status-codes).

**Sources:**

[MDN — HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)

---

</details>

<details>
  <summary>SSL/TLS & HTTPS handshake</summary>

### SSL/TLS & HTTPS handshake

**Definition:**

TLS negotiates encryption keys and authenticates the server before HTTP data flows over a secure channel.

| Key type                       | Purpose                              |
| ------------------------------ | ------------------------------------ |
| Asymmetric (public/private)    | Key exchange during handshake        |
| Symmetric (shared session key) | Fast bulk encryption after handshake |

**How it works:**

1. **TCP first** — SYN / SYN-ACK / ACK (no HTTP yet).
2. **ClientHello** — TLS version, cipher suites, key share (TLS 1.3 often 1-RTT).
3. **ServerHello + certificate** — server authenticates; browser verifies the cert chain against trusted CAs (hostname match, expiry). See [TLS certificates](#tls-certificates-x509--pki).
4. **Finished** — both sides derive **symmetric** session keys (asymmetric crypto only for the handshake). Modern TLS uses **ephemeral key agreement** (e.g. ECDHE), not “encrypt the session key with RSA” (that old RSA key-exchange is deprecated).
5. **Application data** — HTTP request/response encrypted with those keys. Session tickets / 0-RTT can skip work on later visits.

HSTS (`Strict-Transport-Security`) tells the browser to use HTTPS on future visits without an HTTP hop.

1. TCP connection
2. ClientHello / ServerHello + cert
3. Browser validates with CA
4. Symmetric session keys
5. Encrypted HTTP begins

**When to use:** Every `https://` navigation; `preconnect` to warm TCP+TLS; TLS termination at Nginx or a load balancer.

**Pluses and minuses:**

| +                                             | −                                                  |
| ------------------------------------------------ | ----------------------------------------------------- |
| Fast bulk encryption after handshake             | Extra RTT(s) on cold connect                          |
| Certificate proves you talk to the intended host | Wrong clock / missing intermediate CA fails handshake |

**Examples:**

```js
// Node.js — enforce HTTPS in production
if (process.env.NODE_ENV === 'production' && !req.secure) {
  return res.redirect(301, `https://${req.headers.host}${req.url}`);
}
```

**Thoughts:** *TLS authenticates the server and sets keys; HTTP then runs inside that tunnel.*

**Sources:**

[howhttps.works — TLS explained](https://howhttps.works/the-handshake/) · [MDN — TLS handshake](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Transport_Layer_Security)

---

</details>

<details>
  <summary>TLS certificates (X.509 / PKI)</summary>

### TLS certificates (X.509 / PKI)

**Definition:** A TLS (historically “SSL”) certificate is an **X.509** document that binds a **public key** to a **subject** (domain, sometimes org) and is **signed** by a **certificate authority (CA)** the browser already trusts.

**How it works:**

- On the wire the protocol is **TLS** (SSL is the old name). HTTPS = HTTP inside a TLS tunnel. The server keeps the **private key**; the certificate is public.
- Contents (web PKI, RFC 5280 / X.509 v3): public key, subject (SAN hostnames), issuer, validity window, key usage / EKU, CA signature. Browsers ship a **root store**; the leaf must **chain** through intermediates to a trusted root.
- Trust model: site A proves identity to visitor B because both trust CA T. T signs A’s cert with T’s private key. B hashes the cert fields and checks them against T’s signature using T’s **public** key from the root/intermediate. Match → the public key in the cert belongs to that subject (as far as T checked).
- After the handshake, bulk traffic uses a **symmetric** session key. Asymmetric crypto authenticates the server and helps agree that key — it does not encrypt every HTTP byte.
- Getting a cert: (1) public CA (Let’s Encrypt ACME / paid CA) after proving **domain control**; (2) **self-signed** (issuer = subject) for local/dev/intranet — browsers warn unless you install the issuer; (3) throwaway/fake names for lab only.
- Chrome (2014+) pushed HTTPS; **July 2018** Chrome 68 labeled HTTP **Not secure**. Browsers did not generally *block* all HTTP sites. The padlock is a UI hint, not extra crypto.

Organizations that sign certs after checks. Trust is the product: a discredited CA is dropped from root stores. Pick by inclusion in browser/OS stores, ACME automation, jurisdiction, price. **Let’s Encrypt** issues free **DV** certs via ACME (hosting often does this; otherwise Certbot or another ACME client).

| Kind | What the CA actually checked | Typical use |
| ---- | ---------------------------- | ----------- |
| **DV** | Control of the domain (DNS/HTTP challenge) | Almost all public sites, Let’s Encrypt |
| **OV** | Domain + organization identity | Some enterprises |
| **EV** | Stricter org checks (CA/Browser Forum) | Banks historically; **no extra encryption**, browsers dropped the green-bar UI |
| **Wildcard** | `*.example.com` (usually not the apex `example.com` unless also listed) | Many subdomains, one cert |
| **SAN / multi-domain** | Several hostnames on one cert | `www` + apex + extras |

DV/OV/EV differ in **identity vetting**, not cipher strength. Historical “Class 1–5” (VeriSign) and RU “физлицо / бизнес / EV” catalogs are vendor packaging; interview answer is **DV / OV / EV + wildcard/SAN**.

**When to use:**

Production HTTPS (CA-signed); local HTTPS (`mkcert` / self-signed); internal PKI with a company root on managed devices.

#### Common pitfalls

Treating `openssl req -new` output as a cert (it is a **CSR**). RSA key-exchange handshake story (“browser encrypts session key with the site’s public key”) — obsolete; TLS 1.3 uses (EC)DHE. Assuming EV is “stronger HTTPS.” Clicking through cert warnings. Wildcard does not automatically cover the registrable domain unless SAN includes it.

**Pluses and minuses:**

| + | − |
| - | - |
| Stops casual MITM; unlocks secure-context APIs | Expiry / missing intermediate takes the site down |
| Let’s Encrypt + ACME is free and automated | Self-signed is untrusted on the public web |
| Same TLS crypto for cheap DV as for EV | Compromised CA is an industry-level failure |

**Examples:**

```bash
# Private key (add -aes256 to passphrase-protect it)
openssl genrsa -out example.com.key 2048

# CSR for a public CA — not a certificate; do not install this as the server cert
openssl req -new -key example.com.key -out example.com.csr
openssl req -noout -text -in example.com.csr

# Self-signed leaf for localhost / labs (issuer = subject)
openssl req -newkey rsa:2048 -x509 -sha256 -days 365 -nodes \
  -out cert.pem -keyout key.pem
```

**Thoughts:**

*A CA signature on an X.509 cert lets the browser trust a public key for a hostname; TLS then uses that to authenticate the server and set symmetric keys.*

Handshake steps → [SSL/TLS handshake](#ssltls--https-handshake). MITM → [7_special.md](./7_special.md#man-in-the-middle-mitm). TLS termination at Nginx → [10_build.md — Nginx](./10_build.md#nginx).

**Sources:**

[MDN — Certificate authority](https://developer.mozilla.org/en-US/docs/Glossary/Certificate_authority) · [MDN — TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS) · [Let’s Encrypt — Getting Started](https://letsencrypt.org/getting-started/) · [OpenSSL HOWTO certificates](https://github.com/openssl/openssl/blob/master/doc/HOWTO/certificates.txt) · [Doka — SSL-сертификаты](https://doka.guide/tools/ssl/) (trust model; handshake/CSR details above supersede the 2022 article)

---

</details>

<details>
  <summary>HTTP request structure</summary>

### HTTP request structure

**Definition:** HTTP/1.x messages are a **start-line**, optional **headers**, a blank line, then an optional **body**. Requests use a request-line; responses use a status-line.

**How it works:**

- Request-line: `<method> <request-target> <protocol>` — e.g. `GET / HTTP/1.1`. Order is fixed. Target is usually origin-form (path + query); `Host` holds the authority. Other forms: absolute URL (proxy GET), `host:port` (`CONNECT`), `*` (`OPTIONS`).
- Status-line: `<protocol> <status-code> <reason-phrase>` — e.g. `HTTP/1.1 200 OK`. Reason phrase is for humans. Classes: [HTTP protocol](#http-protocol).
- Headers: `Name: value` (name case-insensitive). Presence of a body is indicated by `Content-Length` or `Transfer-Encoding` (often `chunked`). `Content-Type` names the media type (`text/html`, `application/json`, `multipart/form-data`).
- HTTP/2+ keeps the same fields as **pseudo-headers** (`:method`, `:path`, `:authority`, `:scheme`, `:status`) inside binary frames; version is not repeated on each message.

**When to use:**

Debug with DevTools / `curl -v`. GET should not send a request body; HEAD has no **response** body; POST/PUT/PATCH usually have a request body.

#### Common pitfalls

Forgetting `Host` on HTTP/1.1. Assuming HTTP/2 looks like `HTTP/2.0` on the wire. Confusing hop-by-hop `Transfer-Encoding` with end-to-end `Content-Encoding`.

**Examples:**

```http
POST /api/login HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbG…

{"email":"user@example.com","password":"***"}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /users/123

{"id":123}
```

```bash
curl -v http://example.com
# * connection  > request  < response
```

**Thoughts:** *Learn HTTP/1.1 text; HTTP/2/3 change framing, not methods, status codes, or header meaning.*

**Sources:**

[MDN — HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages)

---

</details>

<details>
  <summary>HTTP headers</summary>

### HTTP headers

**Definition:** HTTP headers are key–value metadata lines that describe the request, response, or representation (body). New features are often just new headers both sides agree on.

**How it works:**

Send **general** headers first, then request- or response-only, then **representation/entity** headers (`Content-Type`, `Content-Length`, `Content-Encoding`). Names are case-insensitive. Custom headers are allowed. Typical jobs: `Host`, `Authorization`, cache (`Cache-Control`, `ETag`), language (`Accept-Language`), last modification.

| Category | Role | Examples |
| -------- | ---- | -------- |
| General | Either side | `Cache-Control`, `Date`, `Connection` |
| Request | Client only | `Authorization`, `Accept`, `Origin`, `Host`, `User-Agent` |
| Response | Server only | `Set-Cookie`, `ETag`, `Location`, `WWW-Authenticate` |
| Representation (entity) | Body metadata | `Content-Type`, `Content-Length`, `Content-Encoding` |

**When to use:** Negotiate encoding (`Accept-Encoding` / `Content-Encoding`) — [HTTP compression](#http-compression-content-encoding). Auth, cookies, CORS all live in headers.

**Examples:**

```http
GET /api/data HTTP/1.1
Accept: application/json
Accept-Language: en-US
Accept-Encoding: gzip, deflate, br
User-Agent: MyApp/1.0
Origin: https://app.example.com
```

**Thoughts:** *Start-line is the verb/status; headers are the control plane.*

**Sources:**

[MDN — HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers)

---

</details>

<details>
  <summary>HTTP compression (Content-Encoding)</summary>

### HTTP compression (Content-Encoding)

**Definition:** The server may compress the **message body**; `Content-Encoding` names the algorithm so the client can decode back to the `Content-Type` resource.

**How it works:**

1. Client advertises `Accept-Encoding: gzip, deflate, br` (and often `zstd`).
2. Server picks one, compresses the body, responds with `Content-Encoding: br` (or `gzip`) and should send `Vary: Accept-Encoding` so caches store separate variants.
3. `Content-Length` refers to the **encoded** bytes.

| Token | Algorithm |
| ----- | --------- |
| `gzip` | LZ77 + CRC — universal |
| `deflate` | zlib wrapper around deflate |
| `br` | Brotli — usually smaller than gzip for text |
| `zstd` | Zstandard — growing support |

**When to use:**

HTML, CSS, JS, JSON, SVG. Skip already-compressed types (JPEG, PNG, WebP, ZIP, most video). Images need format/size/quality work, not gzip-on-pixels.

#### Common pitfalls

Double-compressing (app + proxy both gzip). Treating Zopfli as a separate HTTP encoding — Zopfli emits **gzip-compatible** bytes. Hop-by-hop `Transfer-Encoding` (e.g. `chunked`) is not the same as end-to-end `Content-Encoding`.

**Pluses and minuses:**

| + | − |
| - | - |
| Smaller text payloads, faster load | CPU on server; tiny bodies may grow |
| Brotli often beats gzip on HTML/CSS/JS | Missing `Vary` poisons shared caches |

**Examples:**

```http
GET /app.js HTTP/1.1
Host: example.com
Accept-Encoding: gzip, deflate, br

HTTP/1.1 200 OK
Content-Type: text/javascript; charset=utf-8
Content-Encoding: br
Vary: Accept-Encoding
```

**Thoughts:** *Negotiate with `Accept-Encoding`; label the body with `Content-Encoding`; do not gzip JPEGs.*

**Sources:**

[MDN — Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) · [MDN — Compression in HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Compression)

---

</details>

<details>
  <summary>HTTP methods & status codes</summary>

### HTTP methods & status codes

**Definition:**

Methods express intent on a resource; status codes tell the client whether the request succeeded and how to proceed.

| Method | Purpose |
| ------ | ------- |
| GET | Retrieve a representation |
| HEAD | Like GET, no response body |
| POST | Submit data / trigger action |
| PUT | Replace the resource at this URI |
| PATCH | Partial update |
| DELETE | Remove the resource |
| OPTIONS | Communication options / CORS preflight |
| TRACE | Loop-back of the request (often disabled) |
| CONNECT | TCP tunnel (typically HTTPS via proxy) |

| Code range | Meaning | Interview examples |
| ---------- | ------- | ------------------ |
| 1xx | Informational | `100 Continue` |
| 2xx | Success | `200 OK`, `201 Created`, `204 No Content` |
| 3xx | Redirect / revalidate | `301`, `307` (keep method), `304` |
| 4xx | Client error | `400`, `403` vs `401`, `404` |
| 5xx | Server error | `500`, `502`, `503`, `504` |

Safe / idempotent / PUT vs POST: [HTTP method characteristics](#http-method-characteristics) · [PUT vs POST](#put-vs-post) · [PUT vs PATCH](#put-vs-patch). Overview: [HTTP protocol](#http-protocol).

**Examples:**

```http
PUT /users/1 HTTP/1.1       → 200 OK or 404 Not Found
PATCH /users/1 HTTP/1.1     → partial field update
OPTIONS /users HTTP/1.1     → Allow: GET, POST, OPTIONS
```

**Sources:**

[MDN — HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods) · [MDN — HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)

---

</details>

<details>
  <summary>PUT vs POST</summary>

### PUT vs POST

**Definition:**

POST creates a new resource or triggers processing; PUT replaces a resource at a known URI and is idempotent.

|             | POST                  | PUT                   |
| ----------- | --------------------- | --------------------- |
| Idempotent  | No                    | Yes                   |
| Typical use | Create, actions       | Full replace / upsert |
| URI         | Collection (`/books`) | Specific (`/books/3`) |

**Examples:**

```http
POST /books        → creates new book, returns 201 + Location
PUT  /books/3      → replaces book 3 entirely (same result if repeated)
```

**Sources:**

[MDN — PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT) · [MDN — POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)

---

</details>

<details>
  <summary>PUT vs PATCH</summary>

### PUT vs PATCH

**Definition:**

PUT replaces the entire resource; PATCH applies a partial modification.

|                | PUT                     | PATCH               |
| -------------- | ----------------------- | ------------------- |
| Payload        | Full representation     | Changed fields only |
| Idempotent     | Yes                     | Depends on server   |
| Missing fields | Often cleared/nullified | Unchanged           |

**Examples:**

```http
PATCH /users/1 HTTP/1.1
Content-Type: application/json

{ "email": "new@example.com" }
```

Only `email` changes; other fields remain.

**Sources:**

[MDN — PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH)

---

</details>

<details>
  <summary>Idempotent requests</summary>

### Idempotent requests

**Definition:**

An idempotent request produces the same server state no matter how many times it is repeated.

| Method                    | Idempotent?     |
| ------------------------- | --------------- |
| GET, HEAD, OPTIONS, TRACE | Yes             |
| PUT, DELETE               | Yes (by design) |
| POST, PATCH               | No (by default) |

**Examples:**

```http
DELETE /files/report.pdf   ← deleting twice: 204 then 404 (state unchanged)
POST   /files              ← each call may create another file
```

**Sources:**

[MDN — Idempotent glossary](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)

---

</details>

<details>
  <summary>HTTP cookies</summary>

### HTTP cookies

**Definition:**

Cookies are small name–value pairs the server sets via `Set-Cookie` and the browser sends back on subsequent requests to the same domain. A session cookie often holds an opaque token so the [web server](#web-server) / app can recognize an authorized user.

| Use case    | Example cookie     |
| ----------- | ------------------ |
| Session ID  | `sessionId=abc123` |
| Preferences | `lang=en`          |
| Analytics   | `_ga=GA1.2.…`      |

**Examples:**

```http
Set-Cookie: sessionId=abc123; Path=/; HttpOnly; Secure; SameSite=Lax
```

```js
document.cookie; // readable unless HttpOnly
```

**Thoughts:** Client-only prefs belong in Web Storage / IndexedDB, not cookies (cookies ride on every request). Compare APIs: [JS Browser — storage](./3_js_browser.md#browser-storage).

**Sources:**

[MDN — HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)

---

</details>

<details>
  <summary>HttpOnly cookies</summary>

### HttpOnly cookies

**Definition:**

The `HttpOnly` flag prevents client-side JavaScript from reading a cookie, reducing XSS token theft risk.

| Flag     | Effect                               |
| -------- | ------------------------------------ |
| HttpOnly | Not accessible via `document.cookie` |
| Secure   | Sent only over HTTPS                 |
| SameSite | Limits cross-site sending            |

**Examples:**

```http
Set-Cookie: token=xyz; HttpOnly; Secure; SameSite=Strict
```

**Sources:**

[MDN — Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)

---

</details>

<details>
  <summary>HTTP caching</summary>

### HTTP caching

**Definition:** HTTP caching stores responses so repeat requests can be served from cache without contacting the origin.

**How it works:**

1. Server sends `Cache-Control: max-age=3600` and/or `ETag: "abc"`. Origin servers and reverse proxies may also cache identical requests and skip re-running the app (TTL/strategy is server config).
2. Browser (and optionally a CDN) stores the response until it is no longer **fresh**. `Cache-Control: public, max-age=31536000` tells the client a static asset can stay a year (`max-age` is seconds).
3. On expiry, the browser may send a **conditional** request: `If-None-Match: "abc"` (or `If-Modified-Since`).
4. Server returns **304 Not Modified** (no body) if unchanged — saves bandwidth.

| Directive      | Effect                                                 |
| -------------- | ------------------------------------------------------ |
| `max-age=3600` | Fresh for 3600 seconds                                 |
| `no-cache`     | Store, but **revalidate** with the origin before reuse |
| `no-store`     | Do not store (sensitive / user-specific)               |
| `private`      | Browser only, not shared CDN                           |
| `public`       | Shared caches / CDN may store                          |
| `immutable`    | Never revalidate (hashed filenames, long `max-age`)    |

| Layer        | Who                                   | Example                                                                                |
| ------------ | ------------------------------------- | -------------------------------------------------------------------------------------- |
| HTTP / CDN   | Browser disk cache, Nginx, Cloudflare | `Cache-Control`, `ETag`, `304`                                                         |
| App (client) | JS in memory / Redux                  | **RTK Query**, TanStack Query — keyed by endpoint + args, refetch, `keepUnusedDataFor` |

HTTP headers do **not** replace a client cache: two `fetch` calls in React still hit the network unless you use a library (or Cache Storage). RTK Query default: data stays while a hook is subscribed; after unmount it is garbage-collected after **60s** (`keepUnusedDataFor`), independent of `Cache-Control`.

Cached **images** skip the network. Cached **JS/CSS** still cost parse (and JS execution) — that is why code splitting exists ([10_build.md](./10_build.md#code-splitting)).

**When to use:** Hashed asset filenames → `public, max-age=31536000, immutable`. User API → `private, no-store`. Repeat UI reads of the same GET → RTK Query / TanStack Query.

**Pluses and minuses:**

| +                                  | −                                 |
| ------------------------------------- | ------------------------------------ |
| Faster repeat loads, less server load | Stale data if TTL too long           |
| 304 saves bandwidth                   | Invalidation is hard for dynamic API |

**Examples:**

```http
Cache-Control: public, max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

GET /style.css
If-None-Match: "33a64df…"
→ 304 Not Modified
```

**Thoughts:**

`Cache-Control` *is the HTTP/CDN layer; RTK Query is an in-memory client cache of JSON — they stack, they are not the same.*

| Strategy               | Behavior                           |
| ---------------------- | ---------------------------------- |
| Cache only             | Serve static assets from cache     |
| Network only           | Always fetch (analytics)           |
| Cache → network        | Offline-first fallback             |
| Network → cache        | Fresh data, cache on success       |
| Stale-while-revalidate | Serve stale, refresh in background |

**Sources:**

[MDN — HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)

---

</details>

<details>
  <summary>HTTP in JavaScript</summary>

### HTTP in JavaScript

**Definition:**

Browsers expose several APIs for asynchronous HTTP without full page reloads (AJAX pattern). `fetch` is the global method used at the application level.

| API              | Status               |
| ---------------- | -------------------- |
| `fetch`          | Modern standard      |
| `XMLHttpRequest` | Legacy               |
| HTML `<form>`    | Full page navigation |
| Axios / jQuery   | Third-party wrappers |

**How it works:** `fetch(url, init)` returns `Promise<Response>`. Set `method` to an HTTP verb (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, …). JSON bodies need `JSON.stringify` and usually `Content-Type: application/json`. Network failures reject; HTTP 4xx/5xx do **not** — check `res.ok`.

**Examples:**

```js
const res = await fetch('/api/save-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(state),
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
```

**Sources:**

[MDN — Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) · [MDN — HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)

---

</details>

<details>
  <summary>Fetch API — AbortController & FormData</summary>

### Fetch API — AbortController & FormData

**Definition:** `fetch` is the modern browser API for HTTP. `AbortController` cancels in-flight requests; `FormData` builds `multipart/form-data` bodies for file uploads and mixed fields.

**How it works:**

- `fetch(url, options)` returns a `Promise<Response>` — check `res.ok` (`status 200–299`); network errors reject, HTTP 4xx/5xx do not.
- `AbortController` — `const ac = new AbortController(); fetch(url, { signal: ac.signal })`; call `ac.abort()` to cancel (throws `AbortError`).
- `FormData` — `fd.append('file', fileInput.files[0])`; pass `body: fd` — browser sets `Content-Type` with boundary automatically (do not set manually).
- Timeouts — combine `AbortController` with `setTimeout(() => ac.abort(), 5000)`.

**When to use:**

- Debounced search — abort previous request when user types again.
- React `useEffect` cleanup — abort fetch on unmount.
- File upload — `FormData` + `POST`; for JSON use `JSON.stringify` + `Content-Type: application/json`.

**Pluses and minuses:**

| Feature           | +                                        | −                                        |
| ----------------- | ------------------------------------------- | ------------------------------------------- |
| `AbortController` | Cancels stale requests (search, navigation) | Must handle `AbortError` in catch           |
| `FormData`        | Native multipart uploads                    | Less control than manual boundary           |
| `fetch`           | Promise-based, streams via `res.body`       | No upload progress without `XMLHttpRequest` |

**Examples:**

```js
const ac = new AbortController();
const timeout = setTimeout(() => ac.abort(), 8000);

try {
  const res = await fetch('/api/upload', {
    method: 'POST',
    signal: ac.signal,
    body: (() => {
      const fd = new FormData();
      fd.append('title', 'Report');
      fd.append('file', file);
      return fd;
    })(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
} catch (e) {
  if (e.name === 'AbortError') return; // cancelled — ignore
  throw e;
} finally {
  clearTimeout(timeout);
}
```

**Thoughts:** `credentials: 'include'` sends cookies cross-origin only if CORS allows credentials. Prefer `res.json()` only after checking status.

**Sources:**

[MDN — AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) · [MDN — FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

---

</details>

<details>
  <summary>Rate limiting (429)</summary>

### Rate limiting (429)

**Definition:** Rate limiting caps how many requests a client can make in a time window. When exceeded, the server responds with **429 Too Many Requests**.

**How it works:**

- Server tracks counters per key — IP, API key, user ID, or combination.
- Algorithms: **fixed window** (100 req/min), **sliding window** (smoother), **token bucket** (burst + sustained rate).
- Response includes `**Retry-After**` header (seconds or HTTP-date) telling client when to retry.
- Edge/CDN (Cloudflare, API Gateway) or app middleware (Redis `INCR` + TTL) enforce limits.

**When to use:**

- Public APIs — tiered limits (free vs paid).
- Login endpoints — strict limits against brute force.
- Client — respect `429` + `Retry-After`; exponential backoff with jitter.

**Pluses and minuses:**

| Approach       | +                | −                  |
| -------------- | ------------------- | --------------------- |
| IP-based       | Simple              | Shared NAT unfairness |
| API key / user | Fair per tenant     | Requires auth         |
| Token bucket   | Allows short bursts | More complex          |
| Redis counter  | Distributed, fast   | Extra infrastructure  |

**Examples:**

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
Content-Type: application/json

{ "error": "rate_limit_exceeded", "limit": 100, "window": "1m" }
```

```js
// Client retry with backoff
async function fetchWithRetry(url, opts, retries = 3) {
  const res = await fetch(url, opts);
  if (res.status !== 429 || retries === 0) return res;
  const wait = Number(res.headers.get('Retry-After') ?? 1) * 1000;
  await new Promise((r) => setTimeout(r, wait));
  return fetchWithRetry(url, opts, retries - 1);
}
```

**Thoughts:** Return **429**, not **403** — 403 means forbidden regardless of rate. Document limits in API docs (`X-RateLimit-Limit`, `X-RateLimit-Remaining` are common conventions). IP limits help brute force and Slowloris-from-one-host; they do **not** stop a large DDoS — that needs edge capacity. Incomplete slow requests need **read timeouts** as well as 429. See [Special — DoS / Slowloris](./7_special.md#denial-of-service-dos--ddos).

**Sources:**

[MDN — 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) · [IETF — Retry-After](https://datatracker.ietf.org/doc/html/rfc7231#section-7.1.3)

---

</details>

<a name="8-auth"></a>

## 8. Auth

<details>
  <summary>Identification, authentication, authorization & HTTP Basic</summary>

### Identification, authentication, authorization & HTTP Basic

**Definition:** **Identification** assigns a name (username, `sub`). **Authentication** proves that claim. **Authorization** grants rights after a successful proof.

**How it works:**

- Ticket analogy: name on the ticket = identification; passport check = authentication; boarding pass / cabin class = authorization.
- HTTP **Basic**: server may send `401` + `WWW-Authenticate: Basic realm="…"`; client retries with `Authorization: Basic <base64(user:pass)>`. Base64 is **not** encryption — only use over HTTPS. Invalid creds → `401`; valid but not allowed → `403`.
- App auth: credentials → session cookie or token in later `Authorization` headers. “Sign in with Google” authenticates at the IdP; your server gets a token, then issues its own session ([OAuth2 & OIDC](#oauth2--oidc-overview), [Sessions & JWT](#sessions--jwt)).

**When to use:**

Basic for staging dashboards behind TLS. Sessions/JWT/OAuth for real products.

#### Common pitfalls

Calling Basic “encrypted.” Mixing Basic with session tokens as if they were the same scheme.

**Pluses and minuses:**

| + | − |
| - | - |
| Basic is simple and widely supported | Credentials on every request; CSRF-prone vs cookie `SameSite` |
| Clear 401 vs 403 | Password in Base64 is reversible |

**Examples:**

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic realm="staging"

GET /admin HTTP/1.1
Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l
```

(`aladdin:opensesame` in Base64 — MDN’s example, not a secret.)

**Thoughts:** *Identify → prove (authn) → grant (authz). Basic is `user:pass` in a header, not a session.*

**Sources:**

[MDN — HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) · Node: [identification vs auth](./8_nodejs.md#authentication-identification--authorization)

---

</details>

<details>
  <summary>OAuth2 & OIDC overview</summary>

### OAuth2 & OIDC overview

**Definition:** **OAuth 2.0** is an authorization framework — delegated access without sharing passwords. **OpenID Connect (OIDC)** is an identity layer on top of OAuth2 that adds authenticated user info (`id_token`).

**How it works:**

1. App redirects user to **Authorization Server** (`/authorize?client_id=…&redirect_uri=…&scope=openid profile&code_challenge=…`).
2. User authenticates and consents.
3. Server redirects back with **authorization code** (short-lived, one-time).
4. App exchanges code at **token endpoint** (`POST /token`) with `client_secret` or **PKCE** `code_verifier` — never expose secret in browser-only apps.
5. Response: **access_token** (call APIs), **refresh_token** (optional), **id_token** (OIDC — JWT with `sub`, `email`, `iss`).

| Token           | Purpose                                       |
| --------------- | --------------------------------------------- |
| Access token    | Bearer credential for resource server APIs    |
| Refresh token   | Obtain new access token without re-login      |
| ID token (OIDC) | Proof of authentication; JWT signed by issuer |

| Concept      | OAuth2                            | OIDC                             |
| ------------ | --------------------------------- | -------------------------------- |
| Primary goal | Authorization (scopes)            | Authentication (who is the user) |
| User info    | Via protected userinfo endpoint   | `id_token` claims + userinfo     |
| Typical use  | "App can read my Google Calendar" | "Sign in with Google"            |

**When to use:**

- **Sign in with Google/GitHub** — OIDC Authorization Code + PKCE.
- **Machine-to-machine** — Client Credentials flow (no user).
- **Mobile/native** — PKCE mandatory; use system browser, not embedded WebView.

**Pluses and minuses:**

| +                                        | −                                         |
| ------------------------------------------- | -------------------------------------------- |
| No password sharing with third parties      | Complex; easy to misconfigure                |
| Standard flows, libraries (Passport, Auth0) | Token theft if stored in localStorage        |
| Fine-grained scopes                         | Refresh token rotation required for security |

**Examples:**

```json
{
  "access_token": "eyJhbG…",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def502…",
  "id_token": "eyJhbG…"
}
```

**Thoughts:** OAuth2 is **not** authentication by itself — use OIDC for login. Store tokens in **HttpOnly cookies** or secure storage; validate `iss`, `aud`, `exp` on JWTs. Never put access tokens in URLs.

**Sources:**

[OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) · [OpenID Connect](https://openid.net/connect/) · [OAuth 2.0 for Browser-Based Apps (PKCE)](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps)

---

</details>

<details>
  <summary>Sessions & JWT</summary>

### Sessions & JWT

**Definition:** **Sessions** store server-side state; client holds only a session ID cookie. **JWT** encodes claims in a signed token — verification is stateless if you trust the signature and expiry.

**How it works:**

- **Session** — login → server creates session record (Redis/DB) → `Set-Cookie: sid=…; HttpOnly; Secure; SameSite=Lax` → each request sends cookie → server looks up session.
- **JWT** — login → server signs payload → client sends `Authorization: Bearer <token>` → server verifies HMAC/RSA signature + `exp` without DB lookup (unless blocklist needed).

**When to use:** Session for traditional web apps with server-rendered pages. JWT for microservices and mobile APIs. Hybrid: session for web + JWT for API.

**Pluses and minuses:**

| Approach       | +                            | −                                        |
| -------------- | ------------------------------- | ------------------------------------------- |
| Session cookie | Easy revoke (delete session)    | Server state, sticky sessions in cluster    |
| JWT            | Stateless, scales horizontally  | Hard to revoke; token size in every request |
| JWT + refresh  | Short access, revocable refresh | More moving parts                           |

**Examples:**

```http
Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Lax; Path=/
Authorization: Bearer eyJhbGciOiJIUzI1NiIs…
```

**Thoughts:**

JWT in `localStorage` is XSS-vulnerable — prefer HttpOnly cookie or memory + refresh. Always use `Secure`, `HttpOnly`, `SameSite` on session cookies.

Sessions are easy to revoke; JWTs scale without a lookup — pick revoke vs scale, not “JWT is more secure.”

**Sources:**

[jwt.io](https://jwt.io/) · [MDN — HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

---

</details>

<a name="9-storage"></a>

## 9. Storage

<details>
  <summary>Cookies, sessionStorage & localStorage</summary>

### Cookies, sessionStorage & localStorage

**Definition:** Same three client stores as in [JS Browser — storage](./3_js_browser.md#browser-storage) — cookies are also HTTP state; Web Storage is JS-only key/value.

**How it works:** Cookies are sent on matching requests (~4 KB). `sessionStorage` / `localStorage` are ~5 MiB each, sync strings, never auto-sent. HttpOnly cookies are still sent to the server.

**When to use:** Auth the server must see → cookie. Small client prefs → Web Storage. HTTP flags: [Secure & HttpOnly cookies](#secure--httponly-cookies).

**Thoughts:** Do not use cookies as a general client database.

**Sources:**

[MDN — Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

---

</details>

<details>
  <summary>IndexedDB</summary>

### IndexedDB

**Definition:** Async same-origin object database for large structured data (indexes, transactions, blobs) — full pick-the-right-store notes in [JS Browser — storage](./3_js_browser.md#browser-storage).

**How it works:** `indexedDB.open` → `onupgradeneeded` to create object stores → `transaction` + `objectStore`. Quotas are disk-based (not 5 MiB). Safari ITP can evict script-writable IDB after 7 days without interaction.

**When to use:** Offline app data, files, anything too big or too frequent for sync Web Storage.

**Examples:**

```js
const request = indexedDB.open('myApp', 1);
request.onupgradeneeded = (e) => {
  e.target.result.createObjectStore('books', { keyPath: 'id' });
};
```

**Sources:**

[MDN — IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

---

</details>

<details>
  <summary>Web Storage API</summary>

### Web Storage API

**Definition:** `window.localStorage` / `sessionStorage` — origin-scoped string KV; local persists across tabs/restarts, session is per tab. Theory + pitfalls: [JS Browser — storage](./3_js_browser.md#browser-storage).

**How it works:** Sync API; wrap writes in `try/catch`. Objects need `JSON.stringify`.

**When to use:** Theme, locale, non-secret UI state.

**Examples:**

```js
try {
  localStorage.setItem('user', JSON.stringify({ id: 1 }));
  const user = JSON.parse(localStorage.getItem('user') ?? 'null');
  sessionStorage.removeItem('tempFilter');
} catch {
  /* quota / disabled storage */
}
```

**Sources:**

[MDN — Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

</details>

<details>
  <summary>Secure & HttpOnly cookies</summary>

### Secure & HttpOnly cookies

**Definition:**

`Secure` limits cookie transmission to HTTPS; `HttpOnly` blocks JavaScript access — both harden session security.

| Flag     | Protects against                                 |
| -------- | ------------------------------------------------ |
| Secure   | Network sniffing on HTTP                         |
| HttpOnly | XSS reading session cookies                      |
| SameSite | CSRF (partial); some clickjacking/leak reduction |

**Examples:**

```http
Set-Cookie: sid=abc; Secure; HttpOnly; SameSite=Lax; Max-Age=86400
```

**Sources:**

[MDN — Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)

---

</details>

<a name="10-protocols"></a>

## 10. Protocols

<details>
  <summary>OSI & TCP/IP models</summary>

### OSI & TCP/IP models

**Definition:** A **network model** is a layered spec of how hosts exchange digital data. **OSI** (Open Systems Interconnection, ISO/IEC 7498-1 / ITU-T X.200) is a 7-layer *reference* model for teaching, standards talk, and troubleshooting. The Internet runs the **TCP/IP** (DoD / Internet protocol suite) stack described in RFC 1122 / RFC 1123 — four broad layers, not seven.

**How it works:**

Each OSI layer talks to the layer below and offers a service to the layer above. On send, data is **encapsulated** (header/footer added); on receive, headers are stripped. Layers 1–3 are **media** (bits → frames → packets across links and routers); 4–7 are **host** layers.

| OSI | PDU | Job | Typical examples |
| --- | --- | --- | --- |
| 7 Application | data | App protocols the user/program sees | HTTP, SMTP, FTP, DNS, SIP, [SSH](./15_devops.md#ssh) |
| 6 Presentation | data | Syntax: encoding, compression, encryption (textbook) | TLS/MIME/ASN.1; JPEG/TIFF as *formats*, not a wire protocol |
| 5 Session | data | Setup / checkpoint / teardown of a dialog | RPC-style sessions, PPTP tunnels; sockets in TCP/IP |
| 4 Transport | segment (TCP) / datagram (UDP) | End-to-end delivery, ports, optional reliability | TCP, UDP, QUIC |
| 3 Network | packet | Addressing and **routing** between networks | IP, ICMP, OSPF. IP does **not** guarantee order, delivery, or uniqueness |
| 2 Data link | frame | Neighbor delivery on one link; MAC; error detect | Ethernet, Wi-Fi (IEEE 802.11), PPP. IEEE 802 splits **MAC** + **LLC** |
| 1 Physical | bit / symbol | Signals on a medium | Copper, fiber, radio; 802.15 Bluetooth PHY, DSL, GSM radio |

interviews and ops still say **L4 load balancer** (IP+port) vs **L7** (HTTP path/headers). The names are OSI even when the stack is TCP/IP. It also maps “where did this break?” (cable vs switch vs routing vs TCP vs TLS vs HTTP).

| TCP/IP | Maps to OSI | Examples |
| ------ | ----------- | -------- |
| Application | 5 + 6 + 7 | HTTP, DNS, TLS, WebSocket |
| Transport | 4 (plus TCP’s graceful close, which OSI puts in session) | TCP, UDP |
| Internet | 3 | IP, routing |
| Link / Network Access | 1 + 2 | Ethernet, Wi-Fi |

RFC 3439 (“Layering considered harmful”) is why real stacks are leaky: TLS sits between HTTP and TCP; HTTP/3 uses **QUIC over UDP**. Do not force every protocol into one OSI box.

- **DoD / TCP/IP** — the one that won; designed for a distributed packet network that is hard to kill (each packet routed independently).
- **IPX/SPX** (Novell NetWare) — IPX routing + SPX transport; common on DOS LANs in the 1990s, weak on global WANs, almost gone.
- **AppleTalk** — another vendor suite; same idea (layers), different protocols.

- **Wireshark** — GUI: packet list, decoded tree, hex/bytes. **Capture filters** (libpcap, at sniff time) vs **display filters** (after capture). Start/stop capture on an interface.
- **tcpdump** — CLI; often needs root/admin. Stop with **SIGINT** (Ctrl+C). Write/read pcap:

```bash
tcpdump -n 'tcp port 80 or udp port 80'
tcpdump -w out.pcap
tcpdump -r out.pcap
tcpdump -n 'port 8080'
```

**When to use:**

Interview: “HTTP is application, TCP transport, IP internet.” Debugging: Wireshark/tcpdump. Design: L4 vs L7 LB ([load balancing](./0_system_design.md#load-balancing)).

#### Common pitfalls

Treating OSI as how browsers are implemented. Calling GraphQL/gRPC “session layer” — they are **application** protocols (RPC is only a *textbook* session example). Assuming IP is reliable. Equating UDP with “no integrity” — UDP still has a checksum; it just does not retransmit or reorder.

**Pluses and minuses:**

| + | − |
| - | - |
| Shared vocabulary (L2/L3/L4/L7) | OSI *protocols* never replaced TCP/IP |
| Clean mental model for encapsulation | Strict 7-layer mapping of TLS/QUIC/RPC is forced |
| Separates “medium” from “app” | Extra session/presentation layers are often just the app in TCP/IP |

**Examples:**

```
Browser GET https://example.com
  L7  HTTP request
  L4  TCP segments (ports; order + retransmission)  — or QUIC/UDP for HTTP/3
  L3  IP packets (src/dst addresses; routers pick a path per packet)
  L2  Ethernet/Wi-Fi frames (MAC; FCS/CRC on the frame)
  L1  bits on wire / radio
```

Ethernet payload **MTU** is typically **1500** bytes, not a fixed “1446-byte frame.” TCP MSS on IPv4 Ethernet is often **1460** (1500 − 20 IP − 20 TCP); PPPoE and other headers shrink it further.

**Thoughts:** *OSI is the 7-layer dictionary; TCP/IP is the 4-layer stack the web runs on — HTTP over TCP (or QUIC) over IP over a link.*

**Sources:**

[Doka — OSI](https://doka.guide/tools/osi/) · [ISO/IEC 7498-1](https://www.iso.org/standard/20269.html) · [RFC 1122](https://www.rfc-editor.org/rfc/rfc1122) · [MDN — How the Internet works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work) · [tcpdump(1)](https://www.tcpdump.org/manpages/tcpdump.1.html) · [Wireshark capture filters](https://www.wireshark.org/docs/wsug_html_chunked/ChCapCaptureFilterSection.html) · TCP/UDP: [TCP vs UDP](#tcp-vs-udp) · HTTP stack: [HTTP & TCP/IP](#http--tcpip) · Sockets: [Ports, sockets & network services](#ports-sockets--network-services)

---

</details>

<details>
  <summary>IPv4 & IPv6</summary>

### IPv4 & IPv6

**Definition:** IPv6 (Internet Protocol version 6) is the 128-bit successor to IPv4: it routes packets between hosts and aims at end-to-end connectivity (fewer NAT “grey” vs public addresses).

**How it works:**

- Address is **128 bits**, written as **eight hextets** (four hex digits). Example: `2001:0db8:4ac7:fddd:8da3:981f:fbda:1e43`.
- Typical split of a `/64`: first 64 bits = **network prefix** (ISP / site); last 64 bits = **interface identifier** (device on that subnet — think UUID-like, not a guarantee of a stable MAC).
- **Compression (RFC 5952):** omit leading zeros in a hextet; replace **one** longest run of zero hextets with `::`. `2001:0db8:0000:0000:0000:0000:0000:0000` → `2001:db8::`. You may keep extra zeros for teaching (`2001:db8:0:0:0:0:0:0`); canonical form is compressed + lowercase.
- **URL literals (RFC 3986):** colons clash with `host:port`, so wrap the address in `[]`. Tools like `telnet host port` take the bare address.
- **Prefixes** use CIDR (`address/length`), not dotted IPv4 masks. `/64` is the usual LAN subnet (SLAAC). Larger prefixes from an ISP are collections of `/64`s.
- **DNS:** `A` → IPv4, `AAAA` → IPv6. Dual-stack **Happy Eyeballs** (RFC 8305) queries both and races connects (IPv6 first, IPv4 fallback) so a broken AAAA does not stall the site.
- **Privacy:** OSes use **temporary / privacy addresses** (RFC 8981). Do not treat a full 128-bit client address as a stable person ID; correlate at **`/64` or wider** if you must group a network.

| Prefix | Size | Typical use |
| ------ | ---- | ----------- |
| `/64` | 1 subnet | Home/LAN subnet (rough IPv4 `/24` analog for “one LAN”) |
| `/60` | 16 × `/64` | Often ISP to a customer |
| `/56` | 256 × `/64` | Often ISP to a customer |
| `/48` | 65 536 × `/64` | Site / organization |
| `/32` | 65 536 × `/48` | ISP / LIR allocation |

| Prefix | Purpose |
| ------ | ------- |
| `::1/128` | Loopback (`127.0.0.1`) |
| `2001:db8::/32`, `3fff::/20` | Documentation only (RFC 3849, RFC 9637) — not for production |
| `fe80::/10` | Link-local (one link; not globally routed) |
| `::ffff:0:0/96` | IPv4-mapped IPv6 (often in DBs / dual-stack sockets) |
| `2000::/3` | Currently allocated **global unicast** (public Internet) |
| `fc00::/7` | Unique local (ULA, “private-ish”) |

**When to use:**

Dual-stack public sites (mobile / some regions are IPv6-heavy). WebRTC / VoIP: real public addresses reduce NAT/TURN. Local debug without ngrok when you have a global IPv6. Listen on `[::]` plus IPv4; publish a **static** AAAA.

#### Common pitfalls

Publishing an AAAA that does not answer (blackhole) — dual-stack users may still work via Happy Eyeballs; **IPv6-only** clients fail. Using `2001:db8::` or `3fff::` on real hosts. Treating `fe80::` as a public address. Putting IPv6 in a URL without `[]`. Identifying users by the full address instead of a `/64`. Assuming “nobody uses IPv6” — mobile share is large ([Google](https://www.google.com/intl/en/ipv6/statistics.html), [Cloudflare](https://www.cloudflare.com/ipv6/)).

**Pluses and minuses:**

| + | − |
| - | - |
| Huge space; one address per host is normal | URLs and logs look noisy; `:` vs port |
| Less CGNAT: P2P, WebRTC, inbound to a device | Broken AAAA without Happy Eyeballs = timeouts |
| Unique host vs shared IPv4 hosting/CGNAT blocks | Privacy: don’t log 128 bits as a durable user key |
| IPv6-only networks (some mobile / developing regions) | Need a global unicast address + working DNS |

**Examples:**

```
# URL (brackets required)
https://[2001:db8:4ac7:fddd:8da3:981f:fbda:1e43]:8080/

# CLI (no brackets)
telnet 2001:db8:4ac7:fddd:8da3:981f:fbda:1e43 8080

# Short forms
::1          # loopback
2001:db8::   # documentation prefix, compressed
```

Ship IPv6 on a site: (1) server address in **`2000::/3`**, (2) web server listens on IPv6, (3) stable (static) address, (4) **AAAA** in DNS. Nginx: `listen [::]:443 ssl;` plus an IPv4 `listen`.

**Thoughts:** IPv6 is 128-bit end-to-end addressing; for the web you need listen + static GUA + `AAAA`, and clients already prefer it via Happy Eyeballs.

**Sources:**

[Doka — IPv6 for webdevs](https://doka.guide/tools/ipv6-for-webdevs/) · [MDN — IPv6](https://developer.mozilla.org/en-US/docs/Glossary/IPv6) · [IANA special-purpose IPv6](https://www.iana.org/assignments/iana-ipv6-special-registry) · [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986.html) · [RFC 5952](https://www.rfc-editor.org/rfc/rfc5952.html) · [RFC 8305](https://www.rfc-editor.org/rfc/rfc8305.html) · [RFC 9637](https://www.rfc-editor.org/rfc/rfc9637.html)

---

</details>

<details>
  <summary>SSL/TLS</summary>

### SSL/TLS

**Definition:**

TLS (successor to SSL) encrypts network traffic and authenticates peers using certificates and negotiated cipher suites.

| Feature        | Role                               |
| -------------- | ---------------------------------- |
| Encryption     | Confidentiality on the wire        |
| Authentication | Certificate proves server identity |
| Integrity      | Detect tampering                   |

**Examples:**

```
Browser → supports TLS 1.3
Server  → presents cert signed by Let's Encrypt
Both    → agree cipher suite, exchange keys
```

**Thoughts:** Certificate format, CAs, DV/OV/EV, Let’s Encrypt, OpenSSL → [TLS certificates](#tls-certificates-x509--pki). Handshake → [SSL/TLS handshake](#ssltls--https-handshake).

**Sources:**

[MDN — TLS glossary](https://developer.mozilla.org/en-US/docs/Glossary/TLS)

---

</details>

<details>
  <summary>TCP vs UDP</summary>

### TCP vs UDP

**Definition:** TCP and UDP are **transport-layer** protocols (OSI layer 4 / TCP/IP transport). They move application bytes between a client (browser) and a server as packets; they differ in reliability, ordering, and connection setup.

**How it works:**

- Data on the wire is packets of bounded size. **TCP** builds a **byte stream** after a connection; **UDP** sends independent **datagrams** with no session.
- **TCP (Transmission Control Protocol)** — connection-oriented. Retransmits lost segments, drops duplicates, delivers in order, ACKs the sender, and runs **congestion control** (start small, grow with available bandwidth).
- **UDP (User Datagram Protocol)** — connectionless. No handshake, no delivery/order/duplicate guarantees. Header is **8 bytes** (source port, dest port, length, checksum). Checksum is optional in IPv4, required in IPv6. Apps that need reliability implement it themselves (or use TCP/QUIC).

SYN means **synchronize**. Each side picks a random **initial sequence number** (ISN).

1. Client → `SYN` with seq `x`.
2. Server → `SYN-ACK` with seq `y`, ack `x + 1`.
3. Client → `ACK` with ack `y + 1` (its seq is `x + 1`). Connection is **ESTABLISHED**.

Client may send data with/after the final ACK; the server waits until that ACK before treating the connection as open. Close is a **four-way** FIN/ACK exchange (each side closes independently). Handshake sits **after DNS** and **before TLS** on HTTPS.

Many origins on a page = many handshakes = extra RTTs. Mitigations: reuse connections (HTTP keep-alive, HTTP/2 multiplex), `<link rel="preconnect">` (DNS + TCP + TLS; not `dns-prefetch`, which is DNS only), fewer hosts.

- **TFO (RFC 7413)** — after a prior visit, a **Fast Open cookie** lets the client put **application data in the SYN**. Server data in SYN-ACK is optional. SYN payload is limited to about **one MSS** (not 10 segments). Needs OS + stack support on both ends; middleboxes sometimes break it. HTTP/3/QUIC is the web’s usual 0-RTT path today.
- **Initial congestion window (`initcwnd`, RFC 6928)** — after the handshake, sender may burst up to `min(10 * MSS, max(2 * MSS, 14600))` bytes in the first RTT (~10 × 1460 on Ethernet). That is **not** the TFO SYN limit.

Critical rendering path is a **general** browser pipeline (parse HTML/CSS, first paint before all assets), not a Chromium-only feature.

DNS (often), games, live A/V, **WebRTC**, **QUIC / HTTP/3**. Dropping a late frame is better than stalling for a retransmission. NAT (one public IP, many private hosts) plus firewalls make inbound UDP hard: **STUN** learns the public IP:port; **TURN** relays when symmetric NAT blocks peers; **ICE** tries STUN then TURN ([MDN WebRTC protocols](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols)). UDP datagrams can be dropped, duplicated, or reordered across networks; apps must handle that. Shared buffers / NAT bindings can interact badly with TCP on the same path — test real NAT, don’t assume LAN.

current kernel; `initcwnd` ≈ 10; window scaling on; avoid slow-start after idle when it hurts keep-alive; consider TFO only if you control both ends; compress and cut bytes; closer POPs (lower RTT); reuse connections; see [HPBN — TCP](https://hpbn.co/building-blocks-of-tcp/).

test behind NAT; cap send rate (often ≤ competing TCP); app-level congestion control; handle loss/dup/reorder/jitter; don’t blindly retransmit like TCP; keep UDP checksums; use ICE/STUN/TURN for peers.

**When to use:**

TCP — HTML/CSS/JS, files, HTTP/1.1 and HTTP/2, email, anything that must be complete and in order. UDP — DNS, streaming, WebRTC, HTTP/3 (QUIC adds reliability **on UDP**).

| | TCP | UDP |
| --- | --- | --- |
| Connection | Handshake, then stream | None |
| Delivery | Reliable, ordered, no dupes | Best-effort |
| Congestion control | Yes | No (app or QUIC) |
| Overhead | Higher (state, ACKs) | Low (8-byte header) |
| Web | HTTP/1.1, HTTP/2, TLS over TCP | DNS, WebRTC, HTTP/3/QUIC |

#### Common pitfalls

- Using `dns-prefetch` when you meant `preconnect`.
- Calling TFO “10 × 1460 bytes” — that is `initcwnd`, not SYN data.
- Assuming UDP “has no checksum” — enable it; required on IPv6.
- Treating HTTP/3 as “unreliable HTTP” — QUIC restores reliability on UDP.

**Pluses and minuses:**

| + (TCP) | − (TCP) |
| ---------- | ---------- |
| Integrity and order | Handshake + ACKs add RTT |
| Congestion control | Head-of-line blocking per connection (HTTP/2 still TCP HOL) |

| + (UDP) | − (UDP) |
| ---------- | ---------- |
| Low latency, small header | Loss, reorder, duplicates |
| Good for real-time / QUIC | NAT/firewall pain; no cwnd |

**Examples:**

```html
<!-- Warm DNS+TCP+TLS to a CDN you will actually use (limit count) -->
<link rel="preconnect" href="https://cdn.example.com" crossorigin>
<link rel="dns-prefetch" href="https://analytics.example.com">
```

```
HTTP/1.1 & HTTP/2  → TCP (+ TLS)
HTTP/3             → QUIC over UDP (crypto + 0-RTT in the transport)
WebRTC media       → UDP + ICE/STUN/TURN
```

**Thoughts:**

*TCP trades RTT and ACKs for a reliable ordered stream; UDP is a thin datagram — use it when latency beats completeness, or when QUIC implements reliability on top.*

Layers → [OSI & TCP/IP models](#osi--tcpip-models). TLS after TCP → [SSL/TLS handshake](#ssltls--https-handshake). Hints → [preload, prefetch, preconnect](#preload-prefetch-preconnect--prerender) · [HTML resource hints](./1_html.md#link-rel-types--resource-hints). Handshake-only recap → [TCP three-way handshake](#tcp-three-way-handshake). Sockets / `ss` → [Ports, sockets & network services](#ports-sockets--network-services). Path → [How the Internet works](#how-the-internet-works).

**Sources:**

[MDN — TCP](https://developer.mozilla.org/en-US/docs/Glossary/TCP) · [MDN — UDP](https://developer.mozilla.org/en-US/docs/Glossary/UDP) · [MDN — TCP handshake](https://developer.mozilla.org/en-US/docs/Glossary/TCP_handshake) · [MDN — preconnect](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preconnect) · [RFC 7413 TFO](https://datatracker.ietf.org/doc/html/rfc7413) · [RFC 6928 initcwnd](https://datatracker.ietf.org/doc/html/rfc6928) · [Doka — TCP и UDP](https://doka.guide/tools/tcp-udp/) (handshake/TFO numbers above supersede the 2022 article)

---

</details>

<details>
  <summary>Ports, sockets & network services</summary>

### Ports, sockets & network services

**Definition:** A **port** is a 16-bit number (1–65535) on a host that multiplexes connections so the kernel can hand packets to the right process. A **socket** is the OS endpoint (`IP + port + protocol`). The **network stack** (kernel) creates sockets; a **network service** is the application (nginx, `sshd`, Node) bound to one.

**How it works:**

- Browser default HTTPS is port **443** (`https://example.com` ≡ `https://example.com:443`). HTTP is **80**. IANA assigns well-known ports; local apps often use **8080** / **8000**.
- Other app protocols: mail **IMAP / POP3 / SMTP**; chat historically XMPP. The app protocol only defines the **message format**; TCP/UDP still carry the bytes.
- A 4-tuple (src IP, src port, dst IP, dst port) plus protocol identifies a connection. **Static routes** are configured; **dynamic** routes come from routing protocols. Hosts usually have a default gateway, not a full Internet map.
- **Inspect:** `ping` (ICMP echo — reachability, not “HTTP is up”). Addresses: `ip addr` (Linux) / `ifconfig` (BSD/macOS) / `ipconfig /all` (Windows). Connections: prefer **`ss`** on Linux (`net-tools` `netstat` is legacy). Packet bytes: [tcpdump / Wireshark](#osi--tcpip-models). Filter: [firewall](./15_devops.md#firewall--packet-filter).

**When to use:**

“Why is my Node on 3000 not opening in the browser?” (wrong bind / firewall). “Who is listening on 443?” Security review of listening sockets.

#### Common pitfalls

`netstat -L` / `-p tcp` from a macOS man page on Linux. `https://host:443` vs omitting the port. Treating `ping` success as “the website works.”

**Pluses and minuses:**

| + | − |
| - | - |
| One port → one listening service | Ephemeral client ports clutter `ss` output |
| IANA defaults hide `:80` / `:443` in the URL | Flag names differ (`netstat -p` PID vs protocol) |

**Examples:**

```bash
ping 8.8.8.8                 # ICMP; Google DNS — not HTTP
ip addr                      # Linux addresses (prefer over ifconfig)
ifconfig                     # macOS / older Unix
ipconfig /all                # Windows

ss -tulpn                    # Linux: TCP/UDP, listening, numeric, processes
ss -s                        # protocol stats
netstat -an                  # numeric sockets (most OS)
netstat -p tcp               # macOS/BSD: filter TCP — NOT Linux (-p = PID/program)
```

**Thoughts:** *IP finds the host; the port finds the process; `ss`/`netstat` show the sockets the stack currently has.*

**Sources:**

[IANA port registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml) · [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html) · [ip(8)](https://man7.org/linux/man-pages/man8/ip.8.html) · [Doka — Working with the network](https://doka.guide/tools/network/) · [How the Internet works](#how-the-internet-works)

---

</details>

<details>
  <summary>GraphQL</summary>

### GraphQL

**Definition:**

GraphQL is a query language and runtime where clients request exactly the fields they need from a typed schema.

| REST                 | GraphQL                    |
| -------------------- | -------------------------- |
| Multiple endpoints   | Single `/graphql` endpoint |
| Fixed response shape | Client selects fields      |
| Over-fetching common | Precise data fetching      |

**How it works:** Client sends a query document against a schema (`type Query { book(id: ID!): Book }`). The server resolves each field. Mutations change data; subscriptions push updates (often over WebSocket). Use persisted queries and complexity limits in production.

**When to use:** Many clients needing different shapes of the same graph (mobile vs web). Informal **middle-end**: trim REST over-fetch without cloning endpoints — same idea as a [BFF](./0_system_design.md#bff-backend-for-frontend). Avoid as a cache-unfriendly replacement for a simple CRUD REST API.

**Pluses and minuses:**

| +                                                | −                                            |
| --------------------------------------------------- | ----------------------------------------------- |
| Client picks fields; one round-trip for nested data | Caching and HTTP semantics are harder than REST |
| Strong schema / codegen (orval-like for GraphQL)    | N+1 resolvers without DataLoader                |
| Introspection and playground DX                     | Auth at field level is extra work               |

**Examples:**

```graphql
query GetBook($id: ID!) {
  book(id: $id) { title author { name } }
}
```

**Sources:**

[GraphQL — Introduction](https://graphql.org/learn/)

---

</details>

<a name="11-real-time--rendering"></a>

## 11. Real-time & rendering

<details>
  <summary>WebSocket</summary>

### WebSocket

**Definition:**

WebSocket upgrades an HTTP connection to a persistent full-duplex channel for real-time bidirectional messaging.

| HTTP polling      | WebSocket                      |
| ----------------- | ------------------------------ |
| Repeated requests | Single long-lived connection   |
| Higher latency    | Low latency push               |
| Simple            | Requires connection management |

**How it works:** Browser sends `Upgrade: websocket`. Server responds `101 Switching Protocols`. After that, frames go both ways. Heartbeats detect dead peers. Scale with sticky sessions or a pub/sub bus (Redis) behind multiple Node processes.

**When to use:** Chat, live dashboards, collaborative cursors. Prefer SSE when the server only needs to **push** (notifications). Prefer HTTP for request/response CRUD.

**Pluses and minuses:**

| +                       | −                                                                      |
| -------------------------- | ------------------------------------------------------------------------- |
| Low-latency bidirectional  | Proxies, load balancers, and serverless timeouts fight long-lived sockets |
| Less overhead than polling | Must handle reconnect, backpressure, auth on the socket                   |

**Examples:**

```js
const ws = new WebSocket('wss://chat.example.com');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
ws.send(JSON.stringify({ type: 'join', room: 'general' }));
```

**Thoughts:** Upgrade HTTP once, then speak frames — not a replacement for REST CRUD.

**Sources:**

[MDN — WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

</details>

<details>
  <summary>Polling, long polling, SSE & WebSocket</summary>

### Polling, long polling, SSE & WebSocket

**Definition:**

These patterns deliver server updates to clients with different trade-offs between simplicity, latency, and directionality.

| Technique         | Direction       | Connection           |
| ----------------- | --------------- | -------------------- |
| Short polling     | Client pulls    | Repeated HTTP        |
| Long polling      | Client pulls    | Held HTTP until data |
| SSE (EventSource) | Server → client | Persistent HTTP      |
| WebSocket         | Bidirectional   | Upgraded TCP         |

|           | WebSocket          | EventSource (SSE)    |
| --------- | ------------------ | -------------------- |
| Direction | Both ways          | Server → client only |
| Data      | Binary + text      | Text only            |
| Protocol  | `ws://` / `wss://` | HTTP                 |

**Examples:**

```js
// Server-Sent Events
const es = new EventSource('/api/events');
es.onmessage = (e) => console.log(e.data);
```

**Sources:**

[MDN — Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

---

</details>

<a name="12-types-of-web-apps"></a>

## 12. Types of web apps

Same stack (HTML, CSS, JS). Organization differs: **MPA** vs **SPA**, then where HTML is built. History of payloads (full page → AJAX HTML snippets → JSON): [Evolution of web apps](#evolution-of-web-apps). Next.js/React details: [4_nextjs.md](./4_nextjs.md) · [4_react.md](./4_react.md).

<details>
  <summary>Types of web apps (MPA vs SPA)</summary>

### Types of web apps (MPA vs SPA)

**Definition:** Two main ways to organize a web app: **multi-page** (full reload on each link) and **single-page** (one document; JS owns screens and data). Each has subtypes.

**How it works:**

| Family  | Idea                                              | Pain                                        |
| ------- | ------------------------------------------------- | ------------------------------------------- |
| **MPA** | Many HTML pages linked together                   | Full refresh; no “app-like” scroll/nav      |
| **SPA** | One page; JS creates content, routes, fetches API | Bundle size, where to render, SEO, needs JS |

**When to use:** Landing / docs → MPA static or SSG. Forum / shop with server templates → MPA dynamic HTML. Dashboard with instant screens → SPA (often + SSR/SSG).

**Thoughts:** Pick by UX goal, not by fashion. Instant in-app nav wants SPA; simplest cacheable pages want static MPA.

**Sources:**

[Doka — Types of web apps](https://doka.guide/tools/web-app-types/)

---

</details>

<details>
  <summary>MPA — static files</summary>

### MPA — static files

**Definition:** A set of ready HTML files (plus CSS/JS/images) served as-is by Nginx/Apache. Links cause a **full page reload**. Server config: [Nginx](./15_devops.md#nginx-configuration) · [Apache](./15_devops.md#apache-http-server).

**How it works:** Several `.html` files on disk. Optional: Pug (or similar) + Gulp/Rollup/Webpack to assemble, then upload static output. Browser, CDN, or Service Worker cache easily.

**When to use:** Company landing, product brochure, few mostly-static pages, little interaction.

**Pluses and minuses:**

| +                            | −                                                 |
| ------------------------------- | ---------------------------------------------------- |
| Simplest to build               | Hundreds/thousands of pages → unmaintainable by hand |
| Excellent cache/CDN performance | Changing data needs a rebuild or another approach    |
|                                 | Full reload on every click                           |

**Examples:**

```
/index.html
/about.html
/css/style.css
nginx → GET /about.html → file from disk
```

**Thoughts:** Ship HTML that already exists. No server script per request.

**Sources:**

[Doka — Types of web apps](https://doka.guide/tools/web-app-types/)

---

</details>

<details>
  <summary>MPA — dynamic HTML</summary>

### MPA — dynamic HTML

**Definition:** On each request the server runs a script (PHP, Python, Ruby, …), reads a DB, fills a template, and returns HTML.

**How it works:** User opens “friends”: (1) request hits server (2) query DB (3) assemble HTML from parts (4) send HTML. Next visit with new friends → different HTML. Static fragments can still be cached. Client JS stays small.

**When to use:** Classic forums and shops. Large products historically used this (server-generated pages) before SPA shells.

**Pluses and minuses:**

| +                                      | −                                                 |
| ----------------------------------------- | ---------------------------------------------------- |
| Logic stays on the server; smaller client | Full reload — no instant “app” UX                    |
| Fresh data from DB                        | Scroll position lost; uncached pages wait on network |

**Thoughts:** HTML is assembled **per request** on the server — not a pre-made file.

**Sources:**

[Doka — Types of web apps](https://doka.guide/tools/web-app-types/)

---

</details>

<details>
  <summary>SPA (Single Page Application)</summary>

### SPA (Single Page Application)

**Definition:** One HTML document. JavaScript creates content, switches screens, and loads data (usually via API). Navigation does not reload the whole page.

**How it works:** Instant screen changes; can show loaders while `fetch` runs. Rich ecosystem (UI libs, patterns). Split by **where the first paint is built**: browser (**CSR**) or server (**SSR**). Often needs frameworks.

**When to use:** Complex client logic, app-like UX. Cached SPA JS can still change screens on a bad network; MPA waits for the next HTML.

**Pluses and minuses:**

| +                             | −                                                                       |
| -------------------------------- | -------------------------------------------------------------------------- |
| Instant in-app transitions       | Harder: tools, bundles, performance                                        |
| Visual feedback while data loads | Needs JS — disabled JS = blank                                             |
|                                  | Crawlers prefer static HTML (they *can* run JS now, but static still wins) |

**Thoughts:** The page stays; JS paints the next screen.

**Sources:**

[Doka — Types of web apps](https://doka.guide/tools/web-app-types/) · [MDN — SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)

---

</details>

<details>
  <summary>CSR (Client-Side Rendering)</summary>

### CSR (Client-Side Rendering)

**Definition:** The **browser** builds every view, including the first. User waits for JS; until then the page is empty or a static loader.

**How it works:** Download JS → execute → render. Simplest SPA. Fine when the bundle is small. Weak devices / slow nets may bounce. Search engines execute JS today, but static HTML still indexes more reliably.

**When to use:** Small SPAs, auth dashboards with low SEO need.

**Pluses and minuses:**

| +                          | −                             |
| ----------------------------- | -------------------------------- |
| Simple SPA setup              | First paint blocked on JS        |
| Fast start if the app is tiny | No JS → nothing                  |
|                               | Large apps: slow TTI, weaker SEO |

**Thoughts:** First HTML is a shell; UI appears after JS.

**Sources:**

[Doka — Types of web apps](https://doka.guide/tools/web-app-types/) · [Next.js rendering](./4_nextjs.md#4-rendering-strategies)

---

</details>

<details>
  <summary>SSR (Server-Side Rendering)</summary>

### SSR (Server-Side Rendering)

**Definition:** The **server** sends already-rendered HTML for the first view so the user can read while the SPA JS downloads and hydrates.

**How it works:** Node (typical) runs the same UI on the server. Next.js (React) / Nuxt (Vue) are the usual starters. Custom SSR is hard (data loading, correct render, infra). Extra server = extra ops.

**When to use:** SEO + first paint that must not wait on the bundle. Personalized pages (session) — see Next.js `cookies()` / `force-dynamic`.

**Pluses and minuses:**

| +                                   | −                   |
| -------------------------------------- | ---------------------- |
| HTML immediately; better UX and search | Server + infra         |
| Same app can hydrate into SPA          | DIY SSR is error-prone |

**Examples:**

```ts
export const dynamic = 'force-dynamic';
```

**Thoughts:** First bytes are real content, not an empty shell.

**Sources:**

[Doka — Types of web apps](https://doka.guide/tools/web-app-types/) · [Next.js — rendering](https://nextjs.org/docs/app/getting-started/caching)

---

</details>

<details>
  <summary>SSG (Static Site Generation)</summary>

### SSG (Static Site Generation)

**Definition:** Build step turns data + templates into **static HTML files** (an MPA on disk). SSG tools often wrap an SPA framework so you get static files *and* client interactivity.

**How it works:** Blog posts → HTML pages at build. Doka itself is SSG. **Jamstack** = JavaScript + APIs + Markup (Doka: Markdown as the typical content source). React/etc. “wake up” the page; APIs fetch extra data.

**When to use:** Blogs, docs, marketing. Next.js: `generateStaticParams` prerenders dynamic routes at build.

**Pluses and minuses:**

| +                 | −                             |
| -------------------- | -------------------------------- |
| Static + SPA UX      | Frozen until next build (or ISR) |
| CDN cache, great SEO | Not for per-user dashboards      |

**Examples:**

```ts
export async function generateStaticParams() {
  const posts = await fetch('https://example.com/posts').then((r) => r.json());
  return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}
```

**Thoughts:** HTML exists **before** the request (build time), unlike classic PHP-per-request MPA.

**Sources:**

[Doka — Types of web apps](https://doka.guide/tools/web-app-types/) · [Next.js — generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)

---

</details>

<details>
  <summary>PWA (Progressive Web App)</summary>

### PWA (Progressive Web App)

**Definition (three angles):**

| Kind          | Meaning                                                                                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Everyday**  | A site you can pin as an icon; launched in **standalone** (no browser chrome), can work offline, get push, etc. — looks like a native app.                  |
| **Official**  | A web app that uses **progressive enhancement**: feature-detect Web APIs and, if present, use them for native-class UX. That is why they are *progressive*. |
| **Technical** | A site that meets **browser-specific install criteria** (they change). Not one global spec checklist.                                                       |

**How it works — Chromium install (Chrome/Edge/…):** HTTPS or `localhost` + a **web app manifest**. Chromium **used to** also require a Service Worker; that is **not** required for the install prompt anymore. SW is still how you get offline, push, background sync, and intercepting `fetch`. Safari/Firefox typically **do not** show Chromium’s “Install app” UI. Apple calls these **Home Screen Web Apps**, not “PWA.”

Chrome `beforeinstallprompt` ([web.dev](https://web.dev/articles/install-criteria)): not already installed; HTTPS; user engagement (~30s + a tap); manifest with `name` or `short_name`, `start_url`, `icons` (192 + 512), `display` in `fullscreen` / `standalone` / `minimal-ui` / `window-controls-overlay`; `prefer_related_applications` absent or `false`.

**History (short):** Term coined **2015** by Alex Russell and Frances Berriman (*Progressive Web Apps: Escaping Tabs Without Losing Our Soul*). Idea older: Palm webOS, Firefox OS, ChromeOS; Jobs (2007) described web-delivered apps before the App Store. Community PWA logo: Diego Gonzalez (2017 contest).

**When to use:** Layer on any MPA/SPA. Gradual: add manifest first, then SW for offline. Optional: wrap in a thin native shell for Play/App Store.

**Notes (Doka):** Install and offline are **not** required to “count as PWA.” A tab-only site with push/sensors is still progressive. Video-call apps need a network. PWA is an umbrella for practices + optional install rules — not a strict product type.

| Pros                                                                                | Cons                                                                   |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| One codebase; any form factor with a browser                                        | Same “decentralized” web: **no big PWA store** for ratings/screenshots |
| Native-ish: home-screen icon, OS handlers, offline, push, sensors (when APIs exist) | **Uneven Web API support** across browsers, versions, and OS           |
| Cache = offline + faster repeats; Background Sync when back online                  | iOS: all browsers use **WebKit**; APIs lag or missing until OS update  |
| Visit the URL — no store; cache can update in the background                        | “True cross-platform” is limited by the weakest browser                |
| Smaller than native: call **browser** APIs, load only what you need                 |                                                                        |
| Searchable URLs, share links, copy/translate/zoom/print/extensions                  |                                                                        |
| Browser sandbox + HTTPS; **permission prompts** (push, NFC, …)                      |                                                                        |
| HTML/CSS/JS — no proprietary SDK; debug in DevTools                                 |                                                                        |
| Web stays backward compatible                                                       |                                                                        |

**Examples:**

```html
<link rel="manifest" href="/manifest.json" />
```

```json
{
  "name": "My App",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

**Common pitfalls:** Treating SW as required for *install* (outdated). Expecting Chrome’s install banner in Safari. Caching forever without a versioned SW activate step.

**Thoughts:** PWA = website + optional native capabilities. Install ≠ offline.

**Sources:** [Doka — PWA](https://doka.guide/tools/pwa/) · [web.dev — install criteria](https://web.dev/articles/install-criteria) · [MDN — Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

</details>

<details>
  <summary>Compare: MPA, SPA, CSR, SSR, SSG, PWA</summary>

### Compare: MPA, SPA, CSR, SSR, SSG, PWA

**Definition:**

Choose by **reload vs JS routing** (MPA/SPA) and **when HTML is built** (CSR/SSR/SSG). PWA is an enhancement, not a fifth architecture.

|                 | First view           | Navigation             | SEO       | Offline        |
| --------------- | -------------------- | ---------------------- | --------- | -------------- |
| **MPA static**  | Files on disk        | Full reload            | Excellent | CDN / SW       |
| **MPA dynamic** | Server template + DB | Full reload            | Good      | Harder         |
| **SPA + CSR**   | After JS             | Instant                | Weaker    | Limited        |
| **SPA + SSR**   | HTML then hydrate    | Instant after boot     | Strong    | Limited        |
| **SSG**         | Build-time HTML      | Reload or hydrated SPA | Excellent | Static cache   |
| **PWA**         | Depends on base      | Depends on base        | Varies    | Service worker |

**When to use:** Bad network: SPA can still change screens from cached JS; MPA waits for the next HTML. SPA can still be slow if the bundle is huge.

**Thoughts:** MPA vs SPA is navigation. CSR/SSR/SSG is *when* HTML exists.

**Sources:**

[Doka — Types of web apps](https://doka.guide/tools/web-app-types/)

---

</details>

<a name="13-security"></a>

## 13. Security

<details>
  <summary>CORS</summary>

### CORS

**Definition:** CORS (Cross-Origin Resource Sharing) is a **browser** mechanism that lets a server opt in so page JavaScript can **read** a cross-origin HTTP response. Same-Origin Policy is the default deny; CORS is the explicit allow list.

**How it works:**

- **Origin** = scheme + host + port. `https://doka.guide` and `http://doka.guide` are different origins (protocol). Port differences also count.
- Same-origin `fetch` needs no CORS headers. Cross-origin (`app.com` → `api.example.com`) is a **cross-origin request**.
- The browser always sends `Origin`. You do not set CORS request headers in JS — `Origin`, `Access-Control-Request-Method`, and `Access-Control-Request-Headers` are added by the browser.
- **Simple requests** (safelisted method + headers, typical form `Content-Type`) go out immediately. If the response lacks a matching `Access-Control-Allow-Origin`, the **request still hit the server**; JS cannot read the body. CORS errors have no useful message in JS — use DevTools.
- **Preflight:** non-simple method (`PUT`, `DELETE`, …) or non-safelisted headers (`Authorization`, `Content-Type: application/json`, custom headers) → browser sends `OPTIONS` first. Cached via `Access-Control-Max-Age` (browser also has an internal cap; MDN default if omitted is 5s).
- `Access-Control-Allow-Origin` may be **one** origin or `*` (no credentials). Multiple sites: reflect the request `Origin` if it is on an allowlist, and send `Vary: Origin`.
- Preflight must **not** include credentials. Credentialed actual requests need `Access-Control-Allow-Credentials: true` and a **concrete** origin — never `*` (also no `*` on Allow-Methods / Allow-Headers / Expose-Headers with credentials).

| Response header | Role |
| --------------- | ---- |
| `Access-Control-Allow-Origin` | Which origin may read the response (`*` or one origin) |
| `Access-Control-Allow-Methods` | Methods allowed on the **actual** request (preflight) |
| `Access-Control-Allow-Headers` | Request headers the client may send (preflight) — **not** response headers |
| `Access-Control-Allow-Credentials` | `true` if cookies / HTTP auth may be used |
| `Access-Control-Max-Age` | Seconds to cache the preflight result |
| `Access-Control-Expose-Headers` | Response headers JS may read (`Response.headers`) |

| Request header (browser-set) | Role |
| ---------------------------- | ---- |
| `Origin` | Page origin |
| `Access-Control-Request-Method` | Method of the planned actual request |
| `Access-Control-Request-Headers` | Non-safelisted headers of the actual request |

**When to use:**

SPA on `https://app.example.com` calling `https://api.example.com`; public unauthenticated API with `*`; cookie/session API with an origin allowlist + credentials.

#### Common pitfalls

Treating CORS as a firewall (the simple request already ran). `Allow-Headers` vs `Expose-Headers`. `*` + cookies. Assuming `*` “causes CSRF” — form CSRF does not need CORS; CORS does not stop cookie-based CSRF. See [CSRF](./7_special.md#csrf-cross-site-request-forgery).

**Pluses and minuses:**

| + | − |
| ---- | ---- |
| Lets SPAs call a separate API origin with server consent | Easy to misconfigure (`*`, missing preflight, wrong header names) |
| Preflight can reject unsafe methods/headers before the real call | Browser-only — curl/Postman/server-to-server ignore CORS |
| Standard `Access-Control-*` headers | Does **not** replace CSRF protection |

**Examples:**

```http
OPTIONS / HTTP/1.1
Host: api.example.com
Origin: https://doka.guide
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: content-type, authorization
```

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://doka.guide
Access-Control-Allow-Methods: GET, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
Vary: Origin
```

```js
await fetch('https://api.example.com/data', {
  credentials: 'include', // needs Allow-Credentials: true and a concrete Allow-Origin
});
```

**Thoughts:** The server still receives many cross-origin requests; CORS only decides whether **page JS** may read the response.

**Sources:**

[MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) · [Doka — CORS](https://doka.guide/tools/cors/)

---

</details>

<details>
  <summary>Content Security Policy (CSP)</summary>

### Content Security Policy (CSP)

**Definition:** CSP is an HTTP header that lists trusted sources for scripts, styles, images, and other content — a backup defense if XSS encoding fails.

**How it works:**

Browser blocks loads and inline script that are not in the policy. Strict CSP uses **nonces or hashes** for allowed scripts and disables `eval` / inline handlers. `default-src` fills in missing fetch directives.

| Directive         | Controls                                                                    |
| ----------------- | --------------------------------------------------------------------------- |
| `script-src`      | JavaScript sources                                                          |
| `style-src`       | CSS sources                                                                 |
| `img-src`         | Images (also used to block tracking pixels)                                 |
| `connect-src`     | `fetch` / XHR / WebSocket                                                   |
| `default-src`     | Fallback for unspecified fetch types                                        |
| `frame-ancestors` | Who may embed this page (clickjacking) — **HTTP header only**, not `<meta>` |

**Examples:**

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; frame-ancestors 'self'
```

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

**Thoughts:** `'unsafe-inline'` largely defeats XSS protection. `<meta>` CSP cannot set `frame-ancestors` or some other document directives. See [HTML — CSP](./1_html.md) · [Special — CSP](./7_special.md#content-security-policy-csp) · [Special — XSS](./7_special.md#xss-cross-site-scripting).

**Sources:**

[MDN — CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)

---

</details>

<details>
  <summary>Cross-Site Scripting (XSS)</summary>

### Cross-Site Scripting (XSS)

**Definition:** XSS injects script that runs in **your origin** in another user's browser — session theft, actions as the user, or keylogging.

**How it works:**

Untrusted data is parsed as HTML/JS. **Reflected** — query/body echoed in that response. **Stored** — saved and replayed for later viewers (including XSS keyloggers). **DOM** — client JS writes untrusted strings into the DOM.

| Type      | Vector                                  |
| --------- | --------------------------------------- |
| Stored    | Malicious data saved in DB              |
| Reflected | URL/query echoed in response            |
| DOM-based | Client JS writes untrusted input to DOM |

**Examples:**

```js
element.innerHTML = userInput; // parses tags
element.textContent = userInput; // text only
```

Encode for the **output context** (HTML vs URL). `encodeURIComponent` is for URLs, not HTML. CSP + HttpOnly cookies are extra layers. Full catalog: [Special — XSS](./7_special.md#xss-cross-site-scripting).

**Sources:**

[OWASP — XSS](https://owasp.org/www-community/attacks/xss/)

---

</details>

<details>
  <summary>CSRF (Cross-Site Request Forgery)</summary>

### CSRF (Cross-Site Request Forgery)

**Definition:** CSRF tricks a logged-in user's browser into sending an authenticated request to a site where they already have a session — the server trusts the cookie and performs the action.

**How it works:**

1. User is logged into `bank.com` (session cookie set).
2. User visits `evil.com` which contains `<form action="https://bank.com/transfer" method="POST">` or `<img src="https://bank.com/transfer?to=attacker&amount=1000">`.
3. Browser automatically attaches `bank.com` cookies → server treats request as legitimate.

| Defense                       | How                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| **CSRF token**                | Server embeds unpredictable token in form/meta; validate on POST                         |
| **SameSite cookies**          | `SameSite=Lax` or `Strict` blocks cross-site cookie on POST                              |
| **Custom headers**            | Require `X-Requested-With` or `Content-Type: application/json` — simple forms cannot set |
| **Origin/Referer check**      | Reject if header missing or wrong                                                        |
| **Re-auth for sensitive ops** | Password/2FA for transfers                                                               |

**When to use:**

- Cookie-based session APIs — CSRF token or `SameSite=Strict` for mutations.
- JWT in `Authorization` header only — **not** vulnerable to classic CSRF (browser does not auto-send custom headers).
- `GET` must never change state — CSRF often exploits state-changing GET.

**Pluses and minuses:**

| + (SameSite + token)         | −                                                        |
| ------------------------------- | ----------------------------------------------------------- |
| Blocks most browser-driven CSRF | SameSite=None needed for some OAuth flows (requires Secure) |
| Token pattern well-understood   | SPA + cookie auth needs careful CORS/credentials setup      |

**Examples:**

```html
<meta name="csrf-token" content="random-token-from-server">
```

```js
fetch('/api/transfer', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': document.querySelector('meta[name=csrf-token]').content,
  },
  body: JSON.stringify({ to: 'alice', amount: 50 }),
});
```

**Thoughts:** CORS does **not** protect against CSRF — CSRF is a cookie auto-send problem. `SameSite=Lax` is a strong default for session cookies. Authentication (“session is valid”) is not the same as authorizing **this** mutation — use a CSRF token. Cookie `HttpOnly` does not stop CSRF. See [Special — CSRF](./7_special.md#csrf-cross-site-request-forgery).

**Sources:**

[OWASP — CSRF](https://owasp.org/www-community/attacks/csrf) · [MDN — SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value)

---

</details>

<details>
  <summary>Clickjacking</summary>

### Clickjacking

**Definition:** Attacker overlays a transparent iframe of your site so the user clicks **your** UI while looking at a decoy.

**How it works:**

Authenticated cookies apply inside the iframe. No XSS required.

| Defense                                  | Notes                                                        |
| ---------------------------------------- | ------------------------------------------------------------ |
| CSP `frame-ancestors 'none'` or `'self'` | Preferred; list extra hosts if you must embed                |
| `X-Frame-Options: DENY` or `SAMEORIGIN`  | Still widely sent; `ALLOW-FROM` is obsolete (header ignored) |

```http
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: frame-ancestors 'self'
```

**Thoughts:** Header-only for XFO (not `<meta>`). SameSite does not replace framing policy. See [Special — Clickjacking](./7_special.md#clickjacking).

**Sources:**

[MDN — X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)

---

</details>

<details>
  <summary>JSONP</summary>

### JSONP

**Definition:**

JSONP bypasses SOP by loading cross-origin data via a `<script>` tag that calls a callback function — legacy technique, largely replaced by CORS.

| JSONP                      | CORS                         |
| -------------------------- | ---------------------------- |
| GET only                   | All methods (with preflight) |
| No standard error handling | Standard HTTP semantics      |
| Trust-based                | Header-based permission      |

**Examples:**

```html
<script src="https://api.example.com/data?callback=handleData"></script>
<script>
  function handleData(json) { console.log(json); }
</script>
```

**Sources:**

[MDN — CORS (prefer over JSONP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

</details>

<a name="14-advanced-topics"></a>

## 14. Advanced topics

<details>
  <summary>Service Workers</summary>

### Service Workers

**Definition:**

A service worker is a background script that intercepts network requests and enables offline caching, push notifications, and background sync.

| Capability         | Use case           |
| ------------------ | ------------------ |
| Fetch interception | Offline-first apps |
| Cache API          | Asset precaching   |
| Push API           | Notifications      |

**Examples:**

```js
navigator.serviceWorker.register('/sw.js');

// sw.js
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then(r => r || fetch(event.request)));
});
```

**Sources:**

[MDN — Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

</details>

<details>
  <summary>Web Workers</summary>

### Web Workers

**Definition:**

Web Workers run JavaScript on a background thread so CPU-heavy work does not block the main UI thread.

| Type           | Scope                         |
| -------------- | ----------------------------- |
| Dedicated      | Single owning script          |
| Shared         | Multiple scripts/windows      |
| Service Worker | Proxy between app and network |

**Examples:**

```js
const worker = new Worker('hash-worker.js');
worker.postMessage(largeBuffer);
worker.onmessage = (e) => console.log('hash:', e.data);
```

**Sources:**

[MDN — Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

---

</details>

<details>
  <summary>Worklets</summary>

### Worklets

**Definition:**

Worklets are lightweight parallel execution contexts for specific tasks like audio processing (`AudioWorklet`) or painting (`PaintWorklet`).

| Worklet          | Purpose                   |
| ---------------- | ------------------------- |
| AudioWorklet     | Real-time audio DSP       |
| PaintWorklet     | Programmatic CSS painting |
| AnimationWorklet | Scroll-linked animations  |

**Examples:**

```js
await audioContext.audioWorklet.addModule('processor.js');
const node = new AudioWorkletNode(audioContext, 'gain-processor');
```

**Sources:**

[MDN — Worklet](https://developer.mozilla.org/en-US/docs/Web/API/Worklet)

---

</details>

<details>
  <summary>History API</summary>

### History API

**Definition:**

The History API lets SPAs manipulate the browser URL and history stack without full page reloads.

| Method           | Effect                      |
| ---------------- | --------------------------- |
| `pushState`      | Add history entry           |
| `replaceState`   | Replace current entry       |
| `popstate` event | User navigates back/forward |

**Examples:**

```js
history.pushState({ page: 'settings' }, '', '/settings');
window.addEventListener('popstate', (e) => {
  renderPage(e.state?.page ?? 'home');
});
```

**Sources:**

[MDN — History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

---

</details>

<details>
  <summary>TCP three-way handshake</summary>

### TCP three-way handshake

**Definition:**

TCP opens a connection with SYN → SYN-ACK → ACK so both sides agree on initial sequence numbers before the byte stream.

| Step | Packet  | Meaning                          |
| ---- | ------- | -------------------------------- |
| 1    | SYN     | Client ISN `x`                   |
| 2    | SYN-ACK | Server ISN `y`, ack `x + 1`      |
| 3    | ACK     | Client ack `y + 1`; connected    |

Full UDP comparison, TFO vs `initcwnd`, `preconnect`, STUN/TURN → [TCP vs UDP](#tcp-vs-udp).

**Examples:**

```
Client → SYN (seq=100)
Server → SYN-ACK (seq=300, ack=101)
Client → ACK (ack=301)
→ Data can flow both ways
```

**Sources:**

[MDN — TCP handshake](https://developer.mozilla.org/en-US/docs/Glossary/TCP_handshake)

---

</details>

<details>
  <summary>Throttling & debouncing</summary>

### Throttling & debouncing

**Definition:**

Throttling limits how often a function runs; debouncing waits until calls stop before executing once.

| Technique | Behavior                  | Use case                      |
| --------- | ------------------------- | ----------------------------- |
| Throttle  | At most once per interval | Scroll, resize handlers       |
| Debounce  | Run after pause in calls  | Search input, form validation |

**Examples:**

```js
function debounce(fn, delay = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, delay = 250) {
  let wait = false;
  return (...args) => {
    if (wait) return;
    fn(...args);
    wait = true;
    setTimeout(() => { wait = false; }, delay);
  };
}
```

**Sources:**

[MDN — setTimeout patterns](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)

---

</details>

<details>
  <summary>Axios interceptors</summary>

### Axios interceptors

**Definition:**

Axios interceptors are middleware hooks that transform or inspect requests and responses before they reach your application code.

| Interceptor | Typical use                      |
| ----------- | -------------------------------- |
| Request     | Attach auth token, log           |
| Response    | Unwrap data, handle 401 globally |

**Examples:**

```js
import axios from 'axios';

axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) logout();
    return Promise.reject(err);
  }
);
```

**Sources:**

[Axios — Interceptors](https://axios-http.com/docs/interceptors)

---

</details>

<details>
  <summary>Progressive rendering</summary>

### Progressive rendering

**Definition:**

Progressive rendering displays meaningful content before all assets finish loading, improving perceived performance.

| Technique                      | Effect                       |
| ------------------------------ | ---------------------------- |
| Lazy images (`loading="lazy"`) | Defer off-screen images      |
| Critical CSS                   | Inline above-the-fold styles |
| Code splitting                 | Load JS chunks on demand     |

**Examples:**

```html
<img src="hero.jpg" loading="lazy" alt="Hero">
<link rel="preload" href="font.woff2" as="font" crossorigin>
```

**Sources:**

[web.dev — Fast load times](https://web.dev/explore/fast)

---

</details>

<details>
  <summary>SPA, SSR, PWA & SSG</summary>

### SPA, SSR, PWA & SSG

**Definition:** Full taxonomy (MPA static/dynamic, SPA, CSR, SSR, SSG, PWA, compare) lives in [Types of web apps](#12-types-of-web-apps).

**How it works:** SPA = one page, JS routes. CSR = first paint in the browser. SSR = first HTML from the server. SSG = HTML at build. **PWA** = progressive enhancement (install + APIs). Chromium install = HTTPS + manifest; Service Worker is for offline/push, not required for the install prompt. Full notes: [PWA](#pwa-progressive-web-app).

**Examples:**

```json
{
  "name": "My App",
  "start_url": "/",
  "display": "standalone",
  "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
}
```

**Sources:**

[Doka — Types of web apps](https://doka.guide/tools/web-app-types/) · [MDN — Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

</details>

<details>
  <summary>Core Web Vitals</summary>

### Core Web Vitals

**Definition:**

Google’s page-experience metrics (2020+). **Core** set is **LCP** (main content painted), **INP** (click/tap/key → next paint), **CLS** (unexpected layout jump). A URL **passes** when **all three** are “good” at **p75**, **mobile and desktop scored separately**. **FCP** and **TTFB** are diagnostic, not Core, not ranking.

| Metric | Question | 🟢 Good | 🟡 Needs improvement | 🔴 Poor |
| ------ | -------- | ------- | -------------------- | ------- |
| **LCP** | When did I see the main content? | ≤ 2.5 s | 2.5–4.0 s | > 4.0 s |
| **INP** | After I pressed, did the UI update soon? | ≤ 200 ms | 200–500 ms | > 500 ms |
| **CLS** | Did things jump so I might tap the wrong control? | ≤ 0.1 | 0.1–0.25 | > 0.25 |
| **FCP** | When did *anything* appear? | ≤ 1.8 s | 1.8–3.0 s | > 3.0 s |
| **TTFB** | How soon did the server start the response? | ≤ 0.8 s | 0.8–1.8 s | > 1.8 s |

Thresholds are the same on phone and desktop; **samples are not**. Ranking uses **CrUX field** data (28-day window), not a lab Lighthouse run. **CLS** is unitless; others are time. **FID** was Core until **12 March 2024** — **INP** replaced it (all clicks/taps/keys, full path to paint). Lighthouse with no user reports **TBT**, not INP.

| | **Lab** | **Field** (RUM) |
| --- | --- | --- |
| Tools | Lighthouse, PSI lab, Performance | CrUX, PSI field, Search Console, `web-vitals` |
| Use | Reproduce *what to fix* | p75 of real visits — *what ranking uses* |

Lab ≠ field: INP needs real input; CLS in the field includes scroll/banners; LCP element and cache differ. Workflow: field first → lab slice (not “make LCP better”) → re-check all three. Slow hero → [LCP](#lcp-largest-contentful-paint); dead buttons → [INP](#inp-interaction-to-next-paint); jump → [1_html.md — CLS](./1_html.md#cls-cumulative-layout-shift); blank screen → [FCP](#first-contentful-paint-fcp) / [TTFB](#ttfb-time-to-first-byte). Start **mobile**, high-traffic URLs.

**When to use:**

SEO ranking, incident triage, Lighthouse CI budgets, tickets with a numeric p75 target.

**Example** — field (`web-vitals`). Flush on `visibilitychange` → `hidden` via `sendBeacon` (`unload` breaks **bfcache**). Report **p75**, not the average.

```js
import { onCLS, onINP, onLCP } from 'web-vitals';

function send(metric) {
  navigator.sendBeacon('/analytics', JSON.stringify(metric));
}

onCLS(send);
onINP(send);
onLCP(send);
```

```js
import { onLCP, onINP, onCLS } from 'web-vitals/attribution';
onLCP(({ attribution }) => console.log(attribution)); // TTFB, load delay/duration, render delay
onINP(({ attribution }) => console.log(attribution.inputDelay, attribution.processingDuration));
onCLS(({ attribution }) => console.log(attribution.largestShiftTarget));
```

Next.js: [4_nextjs.md — CWV](./4_nextjs.md#core-web-vitals-on-vercel). HTML levers: [1_html.md](./1_html.md#core-web-vitals--html-developer-impact). DevTools: [11_vsc_browser.md](./11_vsc_browser.md#devtools--core-web-vitals).

#### Common pitfalls

Trusting Lighthouse while Search Console is red. Expecting CrUX next day. Optimizing the **mean**. Calling **FID** Core. Treating **TBT** as INP. Preloading everything. Analytics on `unload`.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Shared language with SEO | Lab green ≠ Search Console green |
| Attribution names the element/script | 28-day CrUX lag; mean hides the tail |

**Thoughts:** Lab = how to reproduce; field p75 = whether users (and ranking) care.

**See also:**

[LCP](#lcp-largest-contentful-paint) · [FCP](#first-contentful-paint-fcp) · [TTFB](#ttfb-time-to-first-byte) · [INP](#inp-interaction-to-next-paint)

---

**Sources:** [web.dev — Vitals](https://web.dev/articles/vitals) · [web.dev — INP](https://web.dev/articles/inp) · [Search — CWV](https://developers.google.com/search/docs/appearance/core-web-vitals) · [web-vitals](https://github.com/GoogleChrome/web-vitals)

</details>

<details>
  <summary>LCP (Largest Contentful Paint)</summary>

### LCP (Largest Contentful Paint)

**Definition:**

LCP is the time from navigation start until the **largest content element in the viewport** is painted. The browser picks the element (hero image, article cover, large text block, video poster) — you cannot assign it by hand. Inspect it in PageSpeed Insights or the Performance panel.

Good: **≤ 2.5 s**. Poor: **> 4 s**. Field “pass” is p75 (see [Core Web Vitals](#core-web-vitals)). Until that paint, the user cannot tell they landed on the right page; slow LCP raises bounce risk.

**How it works:**

Google splits LCP into four consecutive sub-parts (no gaps). On a **well-optimized** page the *typical* share is ~40% TTFB, &lt;10% resource load delay, ~40% resource load duration, &lt;10% element render delay — real sites vary; fix the slice that is large in *your* attribution (`web-vitals/attribution`: `timeToFirstByte`, `resourceLoadDelay`, `resourceLoadDuration`, `elementRenderDelay`).

| Sub-part | What it is | Typical share (optimized) |
| -------- | ---------- | -------------------------- |
| **TTFB** | Navigation start → first byte of HTML | ~40% |
| **Resource load delay** | First HTML byte → start of the LCP resource request | &lt;10% |
| **Resource load duration** | LCP resource download | ~40% |
| **Element render delay** | Resource ready → paint on screen | &lt;10% |

Text-only LCP (no extra file) has **no** resource delay/duration — only TTFB + render delay.

Extra redirects, slow origin, no CDN/cache on HTML. Details: [TTFB](#ttfb-time-to-first-byte). Until the first byte, the browser cannot parse or discover the LCP URL.

Put the LCP image in HTML as `<img src>` so the preload scanner finds it — not JS-injected, not `data-src`. Do **not** use `loading="lazy"` on it. Set `fetchpriority="high"` on **1–2** resources (in-viewport images otherwise start Low until layout). Cross-origin: `<link rel="preconnect">`, or same origin. CSS `background-image` is discovered only after CSS — prefer `<img>`, or preload:

```html
<link rel="preload" as="image" href="hero.avif" fetchpriority="high" />
<link
  rel="preload"
  as="image"
  imagesrcset="hero-800.avif 800w, hero-1600.avif 1600w"
  imagesizes="100vw"
  fetchpriority="high"
/>
```

Next.js: `priority` on `next/image` disables lazy loading and raises fetch priority; in **Next.js 16** prefer `preload` (`priority` is deprecated). → [4_nextjs.md](./4_nextjs.md#core-web-vitals-on-vercel).

Photos → raster **AVIF → WebP → JPEG** via `<picture>`, not SVG. Serve `srcset`/`sizes`. Image CDNs can pick format/size from Client Hints / UA. Long `Cache-Control` on static files; sort/strip cache-busting query junk; avoid `Set-Cookie` on cacheable responses. Demote competing work: `fetchpriority="low"` on non-LCP carousel slides; `defer`/`async` third-party scripts. Tiny icons: `data:` URL or **inline `<svg>`** (SVGO); base64 is ~⅓ larger and shares the document cache — not for heroes. Field data often shows TTFB/delays dominate — check before encoding marathons.

Shrink render-blocking CSS (critical inline, Coverage for unused). Avoid sync JS in `<head>` (`defer`/`async` or end of `body`). SSR/SSG so the LCP node is in the first HTML. Long Tasks after the image arrives delay paint. Text LCP: `font-display: swap` + preload the critical font.

Async non-critical CSS (FOUC risk):

```html
<link
  rel="preload"
  href="non-critical.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript><link rel="stylesheet" href="non-critical.css" /></noscript>
```

[Speculation Rules](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/speculationrules) can prerender a likely next URL so LCP on that navigation is near-zero (similar to **bfcache** restore). Chromium-only at writing; Safari/Firefox lag. `eagerness`: `immediate` / `eager` / `moderate` / `conservative` — earlier speculation wastes more if the user never clicks.

```html
<script type="speculationrules">
  {
    "prerender": [
      { "where": { "href_matches": "/*" }, "eagerness": "moderate" }
    ]
  }
</script>
```

**When to use:**

Product hero, article cover, marketing landing. Confirm the weak slice with CrUX / attribution before shrinking files “just in case.”

#### Common pitfalls

- `loading="lazy"` or JS/`data-src` on the hero (preload scanner never sees a real `src`).
- `fetchpriority="high"` on many assets (the signal becomes noise).
- CSS-only hero with no `preload`.
- Preloading everything and starving the real LCP request.
- Optimizing file size when attribution shows TTFB or render delay.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Maps to a visible “main content” moment | LCP element changes with viewport / cache |
| Four named slices for tickets | Lab cold cache ≠ field warm cache |

**Examples:**

```html
<img
  src="hero.avif"
  alt="Cover"
  width="1200"
  height="630"
  fetchpriority="high"
/>

<picture>
  <source type="image/avif" srcset="hero-640.avif 640w, hero-1280.avif 1280w" sizes="100vw" />
  <source type="image/webp" srcset="hero-640.webp 640w, hero-1280.webp 1280w" sizes="100vw" />
  <img
    src="hero-1280.jpg"
    srcset="hero-640.jpg 640w, hero-1280.jpg 1280w"
    sizes="100vw"
    alt="Cover"
    width="1280"
    height="720"
    fetchpriority="high"
  />
</picture>
```

**Thoughts:** You do not pick the LCP node — you make whatever the browser chose appear fast by cutting TTFB, discovery delay, bytes, then main-thread/CSS/font wait.

**See also:** [Core Web Vitals](#core-web-vitals) · [TTFB](#ttfb-time-to-first-byte) · [FCP](#first-contentful-paint-fcp) · [INP](#inp-interaction-to-next-paint) · HTML → [1_html.md](./1_html.md#core-web-vitals--html-developer-impact) · [img](./1_html.md#img-element-and-responsive-images) · [DevTools](./11_vsc_browser.md#devtools--core-web-vitals)

**Sources:**

[web.dev — Optimize LCP](https://web.dev/articles/optimize-lcp) · [web.dev — LCP](https://web.dev/articles/lcp) · [web.dev — Fetch Priority](https://web.dev/articles/fetch-priority)

---

</details>

<details>
  <summary>First Contentful Paint (FCP)</summary>

### First Contentful Paint (FCP)

**Definition:** FCP is the time from navigation start until the browser paints the first **content**: text, an image, SVG, or a non-empty `<canvas>`. It means “the blank screen ended,” not “the page is ready.”

**How it works:**

- FCP is a **Web Vital** used to diagnose load. It is **not** a Core Web Vital (those are LCP, INP, CLS) and does **not** directly affect ranking.
- A slow FCP usually means a slow **LCP** as well: both wait on the same early path — [TTFB](#ttfb-time-to-first-byte) and **render-blocking** CSS/JS before first paint.
- Score at the **75th percentile**, mobile and desktop separately. **Good:** ≤ 1.8 s. **Needs improvement:** 1.8–3 s. **Poor:** > 3 s.
- A good FCP can still leave the user waiting: the main content (**LCP**) and input snappiness (**INP**) may arrive much later.

- Cut render-blocking CSS/JS; minify CSS; drop unused CSS.
- Lower TTFB; add `<link rel="preconnect">` (DNS + TCP + TLS); remove extra redirects.
- `<link rel="preload">` for files needed for first paint; optimize fonts (`font-display`, subset unused glyphs).
- Smaller page weight; HTTP caching.

**When to use:**

Long white screen. When LCP is bad, FCP tells you “nothing painted yet” vs “wrong largest element.” Same early levers as LCP/TTFB.

#### Common pitfalls

- Calling FCP a Core Web Vital or treating it as “page ready.”
- Optimizing a splash logo so FCP looks good while LCP stays late.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Earliest user-visible load signal | Not Core Web Vitals / not ranking |
| Shares the critical path with LCP | First logo or line of text ≠ usable page |

**Examples:**

```js
import { onFCP } from 'web-vitals';
onFCP(console.log);
```

Prefer `web-vitals` over a raw `PerformanceObserver` on `paint`: field FCP also handles background tabs, bfcache restores, iframes, and prerender (`activationStart`).

**Thoughts:** FCP = first content pixels. Fix TTFB and blocking resources; still measure LCP and INP.

**See also:** [Core Web Vitals](#core-web-vitals) · [LCP](#lcp-largest-contentful-paint) · [TTFB](#ttfb-time-to-first-byte) · [INP](#inp-interaction-to-next-paint) · [preload, prefetch, preconnect](#preload-prefetch-preconnect--prerender) · [HTML — first paint](./1_html.md#what-happens-on-first-page-render)

**Sources:**

[web.dev — FCP](https://web.dev/articles/fcp) · [web.dev — Vitals](https://web.dev/articles/vitals)

---

</details>

<details>
  <summary>TTFB (Time to First Byte)</summary>

### TTFB (Time to First Byte)

**Definition:** TTFB is the time from starting navigation until the browser receives the **first byte** of the response. It is a **diagnostic** metric (not a Core Web Vital) for connection setup and origin/CDN responsiveness.

**How it works:**

TTFB is the sum of:

- redirects (each 301/302 is another round trip);
- service worker startup, if one controls the page;
- DNS lookup;
- TCP connect + TLS handshake;
- server work until the first response byte.

Until that byte arrives, the browser has nothing to parse, so **FCP and LCP wait**. A high TTFB often drags other metrics down. A **low** TTFB does **not** guarantee good LCP/FCP — resources, JS, and paint still follow.

| Rating ([web.dev](https://web.dev/articles/optimize-ttfb)) | TTFB |
| ---------------------------------------------------------- | ---- |
| Good | ≤ 0.8 s |
| Needs improvement | 0.8–1.8 s |
| Poor | > 1.8 s |

Measure in PageSpeed Insights, DevTools **Network** (Waiting / TTFB), `web-vitals` `onTTFB`, or field data via **CrUX**. Typical causes: **network** (distance, no CDN) or **origin** (HTML render, DB, third-party APIs).

**Network**

- CDN for static assets and, when possible, HTML — usually also HTTP/2, HTTP/3, TLS 1.3. See [CDN](#cdn-content-delivery-network).
- Cache HTML with `Cache-Control`; invalidate on deploy; avoid unique query strings that bust CDN/shared caches. See [HTTP caching](#http-caching).
- Drop redirects (correct scheme and trailing slash). `Strict-Transport-Security` removes HTTP→HTTPS on **repeat** visits; first visit still redirects unless the host is on the **HSTS preload list**. See [SSL/TLS handshake](#ssltls--https-handshake).

**Server**

- Stream HTML (`renderToPipeableStream` + `<Suspense>` in React) so the browser can parse chunks while slow data is still loading. See [system design — streaming SSR](./0_system_design.md#rendering-strategies-when-html-is-built).
- Next.js: SSG / [ISR](./4_nextjs.md#incremental-static-regeneration-isr) for pages that do not need per-visitor HTML — then a CDN can serve it. Levers: [Core Web Vitals on Vercel](./4_nextjs.md#core-web-vitals-on-vercel).
- Service worker **stale-while-revalidate** can return an app shell from cache immediately; **do not** use it for per-request personalized HTML (it would serve a stale document). See [Service Workers](#service-workers).
- **103 Early Hints:** while the origin prepares the final response, send `Link` hints so the browser can start critical assets. Some CDNs (e.g. Cloudflare) emit 103 before origin HTML exists. Adoption is still uneven.
- Origin health (memory, runtime). Break down origin time with `Server-Timing`; those marks show up in the browser via **Navigation Timing** (`PerformanceNavigationTiming`).

**When to use:**

Slow LCP with a late document; users far from origin; SSR that waits on DB/API before sending any HTML.

#### Common pitfalls

Unique analytics query params bypassing CDN cache. Extra 301/302 hops. Edge SSR next to a distant database (worse TTFB than regional Node). Assuming cached personalized HTML is safe. Treating TTFB as a substitute for LCP.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Explains stalled FCP/LCP before parse | Not a Core Web Vital; chasing TTFB alone misses JS/images |
| Attribution splits DNS vs connect vs request | 103 Early Hints can make “first byte” the interim response, not final HTML |

**Examples:**

```js
import { onTTFB } from 'web-vitals';

onTTFB((metric) => {
  console.log('TTFB:', metric.value, 'ms', metric.rating);
  const nav = metric.entries[0];
  if (nav) {
    console.log('DNS:', nav.domainLookupEnd - nav.domainLookupStart);
    console.log('Connect:', nav.connectEnd - nav.connectStart);
    console.log('Request→first byte:', nav.responseStart - nav.requestStart);
  }
});
```

```http
Server-Timing: db;dur=53, app;dur=47.2;desc="render"
103 Early Hints
Link: </hero.webp>; rel=preload; as=image
```

**Thoughts:** First byte unblocks parse. Fix CDN, redirects, and origin work — then still optimize LCP after HTML starts.

**See also:** [Core Web Vitals](#core-web-vitals) · [LCP](#lcp-largest-contentful-paint) · [FCP](#first-contentful-paint-fcp) · [INP](#inp-interaction-to-next-paint) · [CDN](#cdn-content-delivery-network)

**Sources:**

[web.dev — TTFB](https://web.dev/articles/ttfb) · [web.dev — Optimize TTFB](https://web.dev/articles/optimize-ttfb) · [web-vitals `onTTFB`](https://github.com/GoogleChrome/web-vitals) · [MDN — Server-Timing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) · [MDN — 103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)

---

</details>

<details>
  <summary>INP (Interaction to Next Paint)</summary>

### INP (Interaction to Next Paint)

**Definition:**

Field metric for responsiveness: time from a click, tap, or key press until the browser paints the next frame that can show a visible response. **Good** ≤ 200 ms, **needs improvement** ≤ 500 ms, **poor** > 500 ms — at the **75th percentile** of page views, mobile and desktop separately.

INP does **not** wait for network or later async UI. It measures how long the **next paint is blocked**. Slow feedback looks like the action failed (double-add to cart, abandoned checkout).

**How it works:**

INP observes **all** qualifying interactions for the page lifetime. The value is usually the **worst** interaction, ignoring outliers (one highest dropped per 50 interactions). Hover, scroll, and zoom do **not** count unless they also include a click/tap/key. Iframe interactions count for users (CrUX) but JS RUM often cannot see cross-origin iframes.

An interaction is one gesture (`pointerdown` + `click`, or `keydown` + `keyup`). Latency is the longest event in that group, from start until the next paint is possible.

Three phases (sum = interaction latency):

| Phase | What | Typical cause |
| ----- | ---- | ------------- |
| **Input delay** | User action → first handler starts | Main thread busy (JS, Long Tasks) |
| **Processing duration** | Handlers + other sync work | Heavy click handlers, large React commit |
| **Presentation delay** | Handlers done → updated frame | Layout/paint, third-party JS, huge DOM |

FID (Core Vital until **March 2024**) measured only the **first** interaction and only **input delay**. INP replaced it: all clicks/taps/keys, full path to next paint. Lab Lighthouse with no user reports **TBT**, not INP.

What makes INP worse:

- **Long Tasks** (> 50 ms) on the main thread.
- Heavy handlers / large client DOM updates.
- **Layout thrashing** — write styles → read `offsetHeight` → write again (forced sync layout).
- Large / deep DOM (Lighthouse warns ~800 nodes, severe ~1400).
- Client `innerHTML` of big markup (one long parse/insert; preload scanner misses nested resources → also LCP).

`useTransition` / `useDeferredValue` mark heavy updates as non-urgent. Split hydration with `<Suspense>`; RSC skip hydration. React **19.2** `<Activity mode="hidden">` keeps state/DOM, tears down Effects, hides with `display: none`. Details — [4_react.md](./4_react.md#web-vitals-in-react-apps).

**Yield long work** after paint-critical UI. `scheduler.yield()` (Chrome 129+, Firefox 142+; **not Safari**) continues with Scheduler priority; `setTimeout(0)` goes to the end of the macrotask queue. Do **not** rely on `navigator.scheduling.isInputPending()` (can be `false` after a click).

```js
function yieldToMain() {
  if (globalThis.scheduler?.yield) return scheduler.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function saveSettings() {
  validateForm();
  showSpinner();
  updateUI();
  await yieldToMain();
  saveToLocalStorage();
  sendAnalytics();
}

async function runJobs(jobQueue, deadline = 50) {
  let lastYield = performance.now();
  for (const job of jobQueue) {
    job();
    if (performance.now() - lastYield > deadline) {
      await yieldToMain();
      lastYield = performance.now();
    }
  }
}
```

Web Workers for **pure** CPU (sort, parse) — no DOM. Comlink wraps `postMessage`; large payloads: transfer `ArrayBuffer`.

often dominate presentation delay. Workers cannot run GTM as-is (needs DOM). **Partytown** proxies DOM to the main thread; Next `next/script` `strategy="worker"` needs `experimental.nextScriptWorkers`. Prefer `lazyOnload`; drop unused tags. Tag cost: pixels (HTTP only) < custom templates < Custom HTML (layout). Keep the GTM container small (hard cap 300 KB). Facade for embeds (`lite-youtube-embed`); `loading="lazy"` + `width`/`height` on iframes (CLS).

**When to use:**

Search, cart, checkout, filters, autocomplete. Measure field first (`web-vitals` attribution: `inputDelay`, `processingDuration`, `presentationDelay`).

**Fix order — ship less JS first.** Parse + execute happens on the main thread. Big bundles hurt INP and can delay LCP.

1. **Measure** — `webpack-bundle-analyzer` / `@next/bundle-analyzer`.
2. **Code split** — per route; `import()` / `React.lazy` / `next/dynamic` for charts, editors, modals. See [10_build.md](./10_build.md#code-splitting).
3. **Tree-shake** — named ESM (`lodash-es`, `date-fns`), not `import _ from 'lodash'` / Moment. [10_build.md](./10_build.md#tree-shaking).
4. **Barrel files** — `export *` from `index.ts` can pull a whole UI kit. Next: [`optimizePackageImports`](./4_nextjs.md#optimizepackageimports) (Next docs still mark it experimental; Turbopack often analyzes imports itself).
5. **Server work** — RSC instead of client Markdown, etc. Best JS is JS never sent. Then lighter libs, Brotli, CI bundle budget.

Other techniques:

- Debounce `input`; throttle `scroll`/`resize`.
- Abort stale `fetch` with `AbortController` — [3_js_async.md](./3_js_async.md#abortcontroller).
- Prefer one-shot `setTimeout` over leftover `setInterval`; move heavy timer work to a Worker.
- Animate `transform`/`opacity` in CSS; JS on `width`/`top`/`box-shadow` forces layout — [2_css.md](./2_css.md).
- Batch DOM: **all reads, then all writes**.
- Smaller DOM: fragments, flatter trees, don’t render hidden tabs until needed; `content-visibility: auto` — [2_css.md](./2_css.md#contain--content-visibility).
- Cheaper selectors (long chains cost more style recalc on a big DOM).
- Smaller JS files (~100 KB as a rule of thumb); `type="module"` parses as separate chunks so input can run between them.
- `touch-action: manipulation` on buttons — skips the historical ~300 ms double-tap-zoom wait.

#### Common pitfalls

Yield/Workers before cutting unused JS. Treating FID or TBT as INP. Counting scroll/hover as INP. `isInputPending()` instead of yielding. GTM Custom HTML for above-the-fold UI. Duplicate tags in HTML **and** the tag manager.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Matches post-load UX (most of the session) | No INP if nobody clicked/tapped/typed |
| Attribution names control + phase | Lab INP depends on which clicks you perform |
| Shared language with SEO | Scroll/hover jank is out of scope |

**Examples:**

```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./heavy-chart'), { ssr: false });
```

```js
let controller;
input.addEventListener('input', async (e) => {
  const query = e.target.value.trim();
  controller?.abort();
  if (!query) return;
  controller = new AbortController();
  const res = await fetch(`/search?q=${encodeURIComponent(query)}`, {
    signal: controller.signal,
  });
});
```

```js
// bad — layout each iteration
boxes.forEach((box) => {
  const height = box.offsetHeight;
  box.style.height = `${height * 2}px`;
});
// good — one layout
const heights = boxes.map((box) => box.offsetHeight);
boxes.forEach((box, i) => {
  box.style.height = `${heights[i] * 2}px`;
});
```

**Thoughts:** Paint a response **now** (spinner, optimistic UI); keep the main thread free of long JS.

**See also:** [Core Web Vitals](#core-web-vitals) · [LCP](#lcp-largest-contentful-paint) · [4_react.md — Web Vitals](./4_react.md#web-vitals-in-react-apps) · [4_nextjs.md — CWV](./4_nextjs.md#core-web-vitals-on-vercel)

**Sources:**

[web.dev — INP](https://web.dev/articles/inp) · [web.dev — Optimize long tasks](https://web.dev/articles/optimize-long-tasks) · [MDN — Scheduler.yield](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield) · [React `<Activity>`](https://react.dev/reference/react/Activity)

---

</details>

<details>
  <summary>preload, prefetch, preconnect & prerender</summary>

### preload, prefetch, preconnect & prerender

**Definition:**

Resource hints tell the browser to fetch or connect early, speeding up current or future navigation.

| Hint         | When              | Purpose                          |
| ------------ | ----------------- | -------------------------------- |
| `preload`    | Current page      | Critical resource needed now     |
| `prefetch`   | Future navigation | Likely next page resource        |
| `preconnect` | Early             | DNS + TCP + TLS to origin        |
| `prerender`  | Future page       | Render entire page in background |

**Examples:**

```html
<link rel="preload" href="/app.js" as="script">
<link rel="prefetch" href="/next-page.js" as="script">
<link rel="preconnect" href="https://fonts.googleapis.com">
```

**Sources:**

[MDN — rel=preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload)

---

</details>

<details>
  <summary>PRPL pattern</summary>

### PRPL pattern

**Definition:**

PRPL (Push, Render, Pre-cache, Lazy-load) is a performance pattern for fast interactive web apps.

| Step      | Goal                           |
| --------- | ------------------------------ |
| Push      | Send critical resources early  |
| Render    | Show content ASAP              |
| Pre-cache | Cache likely-needed assets     |
| Lazy-load | Defer non-critical code/assets |

**Examples:**

```html
<!-- Push critical route -->
<link rel="preload" href="/route-home.js" as="script">
<!-- Lazy-load below-fold images -->
<img loading="lazy" src="/gallery/photo-9.jpg">
```

**Sources:**

[web.dev — PRPL pattern](https://web.dev/articles/apply-instant-loading-with-prpl)

---

---

</details>

<a name="15-integrations"></a>

## 15. Integrations

<details>
  <summary>Payments, analytics & third-party SDKs</summary>

### Payments, analytics & third-party SDKs

**Definition:** External providers you integrate over HTTPS + a client SDK: **payments** (Stripe/PayPal), **analytics** (GA4, Meta Pixel, product analytics), **maps/auth/CMS**. Your app owns the UX; the vendor owns PCI, tracking pixels, or identity.

**How it works:**

- **Payments:** never store raw card numbers. Stripe Checkout / Payment Element tokenize on their origin; your server confirms with a secret key (`checkout.session.completed` webhook). Idempotency keys on create-payment.
- **Analytics:** load the vendor script `async`; send events after consent (GDPR). Prefer server-side events for revenue so ad-blockers do not drop conversions.
- **SDKs:** wrap in an adapter (`lib/payments.ts`) so swapping vendors does not leak into UI. Lazy-load heavy SDKs (`next/dynamic`) so they do not hurt INP/LCP.

**When to use:**

SaaS checkout, marketing funnels, “Sign in with Google.” Skip loading analytics on the first paint of a landing hero if LCP is the goal.

#### Common pitfalls

Putting secret keys in the browser. Trusting client-reported `amount`. Blocking render on `gtag.js`. Skipping webhook signature checks.

**Pluses and minuses:**

| +                                          | −                                        |
| --------------------------------------------- | ------------------------------------------- |
| PCI / tracking compliance is the vendor's job | Script size, privacy, and CSP `script-src`  |
| Webhooks keep your DB in sync                 | Webhook signature verification is mandatory |
| Faster than building billing yourself         | Vendor lock-in and sandbox vs live keys     |

**Examples:**

```ts
// Server — confirm after webhook, never trust the client amount alone
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const event = stripe.webhooks.constructEvent(await req.text(), sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  if (event.type === 'checkout.session.completed') {
    await markPaid(event.data.object.id);
  }
  return new Response(null, { status: 200 });
}
```

**Thoughts:** Client SDK for UX; server + signed webhooks for truth.

**Sources:**

[Stripe webhooks](https://docs.stripe.com/webhooks) · [web.dev third-party](https://web.dev/articles/optimizing-content-efficiency-loading-third-party-javascript)

---

</details>

<a name="interview-practice"></a>

## Interview Practice

<details>
  <summary>Interview Practice</summary>

### Interview Practice

Questions from [0_interview.md](0_interview.md). Try answering before opening solutions.

### Question index

| Topic                                       | Answer |
| ------------------------------------------- | ------ |
| OSI vs TCP/IP layers                        | Q&A    |
| LAN vs Internet / packets / how to inspect  | Q&A    |
| TCP vs UDP                                  | Q&A    |
| IPv4 vs IPv6 / AAAA / Happy Eyeballs      | Q&A    |
| URL anatomy (scheme, query, hash)           | Q&A    |
| What is an API? REST vs SOAP vs RPC (tRPC)  | Q&A    |
| XML vs HTML vs JSON                         | Q&A    |
| HTTP methods + idempotency                  | Q&A    |
| Status codes                                | Q&A    |
| REST principles                             | Q&A    |
| REST versioning & pagination                | Q&A    |
| GET vs POST                                 | Q&A    |
| What happens on `fetch`                     | Q&A    |
| REST contract                               | Q&A    |
| Caching headers                             | Q&A    |
| CORS                                        | Q&A    |
| OAuth2 vs OIDC                              | Q&A    |
| JWT vs session                              | Q&A    |
| CSRF mitigation                             | Q&A    |
| Clickjacking / CSP                          | Q&A    |
| Rate limiting (429)                         | Q&A    |
| Fetch AbortController                       | Q&A    |
| WebSocket vs polling                        | Q&A    |
| Client–server / why a backend               | Q&A    |
| Types of web apps (MPA/SPA/CSR/SSR/SSG/PWA) | Q&A    |
| What is a PWA?                              | Q&A    |
| What is FCP?                                | Q&A    |
| What is LCP?                                | Q&A    |
| Payments / webhooks                         | Q&A    |
| What are Core Web Vitals?                   | Q&A    |
| INP vs FID                                  | Q&A    |
| TTFB                                        | Q&A    |
| Core Web Vitals (lab vs field)              | Q&A    |

---

</details>

## Questions & Answers

<details>
  <summary>OSI vs TCP/IP layers?</summary>

### OSI vs TCP/IP layers?

**Definition:** Both models describe how data moves across networks. **OSI** has 7 layers; the practical **TCP/IP** model has 4. Full notes: [OSI & TCP/IP models](#osi--tcpip-models).

**How it works:**

| OSI (7)                            | TCP/IP (4)      | Examples                  |
| ---------------------------------- | --------------- | ------------------------- |
| Application, Presentation, Session | **Application** | HTTP, DNS, WebSocket, TLS |
| Transport                          | **Transport**   | TCP, UDP                  |
| Network                            | **Internet**    | IP, routing               |
| Data Link, Physical                | **Link**        | Ethernet, Wi-Fi           |

HTTP sits at the **application layer** — it assumes TCP (reliable delivery) and IP (routing) below it.

**When to use:** Interview answer: "HTTP is application layer on top of TCP." TLS encrypts at presentation/session in OSI terms but is usually drawn between HTTP and TCP.

**Sources:** [OSI & TCP/IP models](#osi--tcpip-models) · [MDN — How the Internet works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work)

---

</details>

<details>
  <summary>LAN vs Internet — how do computers exchange data?</summary>

### LAN vs Internet — how do computers exchange data?

**Definition:** Same TCP/IP packets on a home LAN and on the public Internet. The LAN uses private addresses and a local gateway; the Internet is globally routed public IPs. DNS maps a name to an IP; TCP/TLS then HTTP talk to that IP.

**How it works:** File or page → split into packets → each packet is forwarded toward the dest IP → the dest kernel demuxes by **port** to a service → bytes are reassembled. Inspect with `ping`, `ip addr`/`ifconfig`, `ss`/`netstat`; capture with tcpdump/Wireshark. Full notes: [How the Internet works](#how-the-internet-works) · [Ports, sockets & network services](#ports-sockets--network-services).

**When to use:** Interview: “What happens when I type a URL?” Answer DNS → TCP → TLS → HTTP, not “packets go to DNS and DNS rewrites them.”

**Thoughts:** *Addressing and NAT differ; the packet model does not.*

**Sources:** [How the Internet works](#how-the-internet-works)

---

</details>

<details>
  <summary>TCP vs UDP?</summary>

### TCP vs UDP?

**Definition:** Transport-layer choice: TCP = reliable ordered stream after a 3-way handshake; UDP = connectionless datagrams.

**Interview answer:** HTTP/1.1 and HTTP/2 use TCP (integrity of HTML/CSS/JS). Streaming, DNS, WebRTC often use UDP (latency). HTTP/3 is QUIC **on UDP** but still reliable. Handshake cost → `preconnect` / reuse connections. Full block: [TCP vs UDP](#tcp-vs-udp).

---

</details>

<details>
  <summary>IPv4 vs IPv6 / AAAA / Happy Eyeballs?</summary>

### IPv4 vs IPv6 / AAAA / Happy Eyeballs?

**Definition:** IPv4 is 32-bit (`192.0.2.1`); IPv6 is 128-bit hextets (`2001:db8::1`). DNS `A` vs `AAAA`. Dual-stack browsers use Happy Eyeballs so IPv6 is tried without hanging if it is broken.

**How it works:** Compress zeros with `::` once. In URLs wrap literals: `https://[2001:db8::1]:443/`. Prefix `/64` is one LAN. Loopback `::1`. Docs: `2001:db8::/32`, `3fff::/20`. Public GUA is in `2000::/3`. Enable a site: listen on IPv6 + static address + AAAA.

**When to use:** “Why WebRTC needs TURN on IPv4” (NAT); “why mobile users hit IPv6”; “why a bad AAAA hurts IPv6-only networks.”

**Thoughts:** Dual-stack = A + AAAA + a server that actually answers on both.

**Sources:** [IPv4 & IPv6](#ipv4--ipv6)

---

</details>

<details>
  <summary>URL anatomy (scheme, query, hash)?</summary>

### URL anatomy (scheme, query, hash)?

**Definition:** A URL locates a resource and names the access method. Shape: `scheme://[userinfo@]host[:port]/path?query#fragment`.

**How it works:** Scheme selects the protocol (`https`, `mailto`). Host is looked up by DNS. Default ports (80 / 443) are omitted. `?` starts query pairs (`&`-separated). `#` is a client fragment — not on the HTTP request. Relative URLs inherit the current origin.

**When to use:** Address bar; `<a href>`; REST paths vs `?page=2`; in-page `#id`.

**Thoughts:** Query is extra input to the server; hash never leaves the browser.

**Sources:** [URI, URL & URN](#uri-url--urn)

---

</details>

<details>
  <summary>What is an API? REST vs SOAP vs RPC?</summary>

### What is an API? REST vs SOAP vs RPC?

**Definition:** An API is the set of features one program exposes to others. In web backends the usual styles are REST, SOAP, and RPC. tRPC is TypeScript RPC.

| Style | Definition                                                                  | Pros                           | Cons                                   |
| ----- | --------------------------------------------------------------------------- | ------------------------------ | -------------------------------------- |
| REST  | Communication style: needed data is in the request (URL + HTTP verb + body) | Common, HTTP-native, readable  | Over/under-fetch (BFF helps)           |
| SOAP  | Structured data-exchange format (XML envelope)                              | Transport-agnostic, structured | Verbose, worse on the client than REST |
| RPC   | Request holds the action *and* its data (`method` + `params` + `id`)        | Structure, JSON, good batches  | Logic on client; no HTTP cache         |
| tRPC  | TS procedures inferred from `AppRouter`; query GET / mutation POST          | End-to-end types, no codegen   | TS-to-TS; not a public resource API    |

**When to use:** REST for public CRUD and caching. SOAP for legacy enterprise. JSON-RPC when you want procedure calls / batches. tRPC when client and server share TypeScript.

**Thoughts:** Full compare: [REST vs SOAP vs RPC](#5-rest-vs-soap-vs-rpc) · [tRPC](#6-trpc) · [XML](#xml). Don’t treat SOAP as “the opposite of REST.” JSON-RPC 2.0 success/error are mutually exclusive. tRPC is RPC, not REST — procedure names carry intent.

**Sources:** [Doka — What is an API](https://doka.guide/tools/api/) · [JSON-RPC spec](https://www.jsonrpc.org/specification) · [tRPC — concepts](https://trpc.io/docs/concepts)

---

</details>

<details>
  <summary>XML vs HTML vs JSON?</summary>

### XML vs HTML vs JSON?

**Definition:** XML is a markup *syntax* you invent tags for; HTML is a fixed vocabulary for pages; JSON is a typed data format. SOAP *uses* XML; REST usually uses JSON.

**How it works:** XML needs one root, closed tags, quoted attributes, optional `<?xml …?>` at the top. Namespaces (`xmlns`) split the same local name into different vocabularies. HTML parsers forgive errors; XML and JSON do not.

**When to use:** XML for SOAP, RSS, SVG files, legacy enterprise. JSON for new APIs. HTML for documents in the browser.

**Thoughts:** Same tree-shaped markup as HTML, but for data — not for rendering.

**Sources:** [XML](#xml)

---

</details>

<details>
  <summary>HTTP methods and idempotency?</summary>

### HTTP methods and idempotency?

**Definition:** HTTP methods express intent. **Safe** methods do not change server state; **idempotent** methods produce the same effect when repeated.

| Method  | Idempotent | Safe | Typical use                  |
| ------- | ---------- | ---- | ---------------------------- |
| GET     | yes        | yes  | Read resource                |
| HEAD    | yes        | yes  | Headers only                 |
| OPTIONS | yes        | yes  | CORS preflight, capabilities |
| PUT     | yes        | no   | Full replace                 |
| DELETE  | yes        | no   | Remove (2nd call may 404)    |
| POST    | no         | no   | Create, actions              |
| PATCH   | no*        | no   | Partial update               |

PATCH idempotency depends on server implementation. `TRACE` is safe and idempotent (loop-back); `CONNECT` is neither (tunnel). Full list: [HTTP protocol](#http-protocol).

**How it works:** Repeating `PUT /users/1` with the same body leaves the same state. Repeating `POST /users` may create multiple users. Retries on network failure should use idempotent methods or **idempotency keys** on POST.

**When to use:** Use PUT for upsert-by-ID; POST for create; DELETE safe to retry if server treats missing resource as success (204/404).

**Sources:** [MDN — HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) · [MDN — Idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)

---

</details>

<details>
  <summary>What is a web server?</summary>

### What is a web server?

**Definition:** A program that accepts HTTP requests, handles them (file, cache, proxy, or app), and returns HTTP responses.

**How it works:** HTTP/1.1 messages = start-line + headers + blank line + optional body. Production servers add modules: TLS, gzip/brotli, reverse proxy, cache. Nginx/Apache/Caddy often sit in front of Node.

**When to use:** `npx serve` / `http-server` for local static files; Nginx for TLS + static + `/api/` proxy.

**Thoughts:** Full block: [Web server](#web-server) · Compression: [Content-Encoding](#http-compression-content-encoding) · TLS: [HTTPS handshake](#ssltls--https-handshake).

**Sources:** [MDN — HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages) · [Doka — Web server](https://doka.guide/tools/web-server/)

---

</details>

<details>
  <summary>Common HTTP status codes?</summary>

### Common HTTP status codes?

**Definition:** Three-digit codes tell the client outcome class and how to proceed.

| Code                                        | Meaning                       | When                                  |
| ------------------------------------------- | ----------------------------- | ------------------------------------- |
| **200** OK                                  | Success with body             | GET, PUT, PATCH success               |
| **201** Created                             | Resource created              | POST success + `Location` header      |
| **204** No Content                          | Success, empty body           | DELETE success                        |
| **301** Moved Permanently                   | URL changed forever           | SEO redirects                         |
| **302/307** Temporary redirect              | Temporary move                | Login redirect, POST→GET              |
| **304** Not Modified                        | Cached copy still valid       | `If-None-Match` / `If-Modified-Since` |
| **400** Bad Request                         | Malformed client input        | Invalid JSON                          |
| **401** Unauthorized                        | Auth required or failed       | Missing/invalid token                 |
| **403** Forbidden                           | Authenticated but not allowed | Role check failed                     |
| **404** Not Found                           | Resource does not exist       | Wrong ID                              |
| **409** Conflict                            | State conflict                | Duplicate email                       |
| **422** Unprocessable                       | Validation failed             | Schema errors                         |
| **429** Too Many Requests                   | Rate limited                  | See rate limiting section             |
| **500** Internal Server Error               | Server bug                    | Unhandled exception                   |
| **502/503/504** Gateway/Unavailable/Timeout | Upstream/down/overloaded      | Load balancer, deploy                 |

**When to use:** Return **401** when credentials missing/invalid; **403** when user is known but lacks permission. Use **201** + `Location` on create.

**Sources:** [MDN — HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

</details>

<details>
  <summary>REST principles?</summary>

### REST principles?

**Definition:** REST is an architectural style for distributed hypermedia systems with six constraints (Fielding).

**How it works:**

| Principle                 | Meaning                                                          |
| ------------------------- | ---------------------------------------------------------------- |
| Client–server             | UI and data storage separated                                    |
| Stateless                 | Each request carries all context (no server session in protocol) |
| Uniform interface         | URIs identify resources; HTTP verbs; representations (JSON)      |
| Cacheable                 | Responses may be cached when marked                              |
| Layered system            | Client may talk through proxies, CDN, gateway                    |
| Code on demand (optional) | Server may send executable code                                  |

**When to use:** Use **nouns** in paths (`/users/1/orders`), not verbs (`/getOrders`). Return appropriate status codes, not always 200 with `{ error: true }`.

**Thoughts:** HATEOAS (hypermedia links in responses) is rare in practice but is the "R" in REST theory.

**Sources:** [Roy Fielding — REST](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)

---

</details>

<details>
  <summary>REST versioning & pagination?</summary>

### REST versioning & pagination?

See **REST → REST versioning & pagination** for full notes.

**Short answer:** Version via URL path (`/v2/`) or `Accept` header. Paginate with **cursor** for feeds (efficient) or **offset** for page numbers (simple). Return `nextCursor` / `Link` headers and bound `limit` (max 100).

**Sources:** [RFC 8288 — Web Linking](https://datatracker.ietf.org/doc/html/rfc8288)

---

</details>

<details>
  <summary>Cache-Control headers?</summary>

### Cache-Control headers?

**Definition:** `Cache-Control` and validators (`ETag`, `Last-Modified`) control browser and CDN caching.

**How it works:**

| Directive      | Effect                                 |
| -------------- | -------------------------------------- |
| `max-age=3600` | Fresh for 3600 seconds                 |
| `no-cache`     | Must revalidate with server before use |
| `no-store`     | Do not store at all (sensitive data)   |
| `private`      | Browser only, not shared CDN           |
| `public`       | CDN may cache                          |
| `immutable`    | Never revalidate (hashed filenames)    |

Conditional request: client sends `If-None-Match: "etag"` → server returns **304** with empty body if unchanged.

**When to use:** Static assets with hash in filename → `max-age=31536000, immutable`. API user data → `private, no-store` or short `max-age`. App-level cache (RTK Query) is separate — see [HTTP caching](#7-http).

**Thoughts:** `max-age` *is freshness;* `no-cache` *means revalidate;* `no-store` *means do not write a cache.*

**Sources:** [MDN — HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)

---

</details>

<details>
  <summary>CORS — how does it work?</summary>

### CORS — how does it work?

**Definition:** Browsers enforce the **Same-Origin Policy** — JS cannot read cross-origin responses unless the server opts in via CORS headers.

**How it works:**

1. Same origin → no CORS check. Cross-origin → browser sends `Origin`.
2. Simple request goes to the server; JS reads the body only if `Access-Control-Allow-Origin` matches.
3. Non-simple → `OPTIONS` preflight (`Access-Control-Request-Method` / `Headers`); then the real request.
4. Credentials need `Allow-Credentials: true` and a **concrete** origin — not `*`.

**When to use:** SPA + API on another origin; curl/Postman have **no** CORS. Full headers and pitfalls → [CORS](#cors).

**Thoughts:** *The server often still receives the request; the browser hides the response from page JS without matching* `Access-Control-*` *headers.*

| Pros                                             | Cons                                    |
| ------------------------------------------------ | --------------------------------------- |
| Protects users from malicious sites reading data | Misconfiguration blocks legitimate SPAs |
| Explicit server consent                          | Easy to over-allow `*` in dev           |

**Sources:** [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

---

</details>

<details>
  <summary>OAuth2 vs OIDC?</summary>

### OAuth2 vs OIDC?

**Definition:** OAuth2 delegates **authorization** (access to resources). OIDC adds **authentication** (who logged in) via `id_token`.

**How it works:** Authorization Code + PKCE for SPAs → exchange code for `access_token` (API) + `id_token` (identity JWT with `sub`, `email`).

**When to use:** "Sign in with Google" = OIDC. "App reads my calendar" = OAuth2 scopes. Never use Implicit flow for new apps.

**Sources:** [OpenID Connect](https://openid.net/connect/)

---

</details>

<details>
  <summary>JWT vs session cookie?</summary>

### JWT vs session cookie?

**Definition:** Sessions keep state on the server; JWTs are self-contained signed tokens verified without a lookup.

|            | Session                    | JWT                              |
| ---------- | -------------------------- | -------------------------------- |
| Storage    | Server (Redis/DB)          | Client (cookie/header)           |
| Revocation | Delete session — instant   | Blocklist or short TTL + refresh |
| Scale      | Needs shared session store | Stateless verification           |
| XSS risk   | HttpOnly cookie safer      | localStorage is dangerous        |

**How it works:** Session — cookie holds opaque ID; server loads user. JWT — server verifies signature and `exp` on each request.

**When to use:** Session for monolith web apps. JWT for microservices and mobile. Prefer **HttpOnly cookie** for either when possible.

**Sources:** [jwt.io](https://jwt.io/) · [OWASP — Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

</details>

<details>
  <summary>CSRF — how to mitigate?</summary>

### CSRF — how to mitigate?

**Definition:** CSRF forges authenticated requests using the victim's cookies. AuthN (valid session) is not the same as authorizing this mutation.

**Mitigations:** CSRF token (synchronizer token), `SameSite=Lax/Strict` cookies, require custom headers for API mutations, never change state on GET. `HttpOnly` does not stop CSRF.

**When to use:** Cookie session + form POST → token required. JWT in `Authorization` header only → not CSRF-vulnerable.

**Sources:** [OWASP — CSRF](https://owasp.org/www-community/attacks/csrf)

---

</details>

<details>
  <summary>Clickjacking — how to mitigate?</summary>

### Clickjacking — how to mitigate?

**Definition:** User clicks a decoy while a framed copy of your site receives the click.

**Mitigations:** CSP `frame-ancestors 'none'` or `'self'`; `X-Frame-Options: DENY` or `SAMEORIGIN`. Do not use `ALLOW-FROM` (obsolete). XFO is HTTP-header only.

**Sources:** [MDN — X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)

---

</details>

<details>
  <summary>Rate limiting — what is 429?</summary>

### Rate limiting — what is 429?

**Definition:** **429 Too Many Requests** when client exceeds allowed rate. Server should send `**Retry-After`**.

**How it works:** Counter per IP/API key in Redis or edge proxy. Client backs off exponentially with jitter.

**Sources:** [MDN — 429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)

---

</details>

<details>
  <summary>AbortController with fetch?</summary>

### AbortController with fetch?

**Definition:** `AbortController` cancels in-flight `fetch` — useful for timeouts, debounced search, and React cleanup.

**Examples:**

```js
const ac = new AbortController();
fetch('/api/search?q=ab', { signal: ac.signal });
ac.abort(); // throws AbortError in catch
```

**Sources:** [MDN — AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

---

</details>

<details>
  <summary>GET vs POST?</summary>

### GET vs POST?

**Definition:** HTTP methods express intent — GET reads resources; POST creates or triggers actions.

|                | GET                            | POST                              |
| -------------- | ------------------------------ | --------------------------------- |
| **Purpose**    | Retrieve data                  | Create resource / submit action   |
| **Safe**       | Yes (no server state change)   | No                                |
| **Idempotent** | Yes                            | No (repeat may create duplicates) |
| **Body**       | Typically none (params in URL) | Often JSON/form body              |
| **Cacheable**  | Yes (by default)               | No                                |
| **Example**    | `GET /api/users/1`             | `POST /api/users`                 |

**Thoughts:** *GET = read (bookmarkable, cacheable); POST = write/action (not idempotent by default).*

**See also:** [CRUD & REST mapping](#2-rest) · [PUT vs POST](#put-vs-post)

**Sources:** [MDN — HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

---

</details>

<details>
  <summary>What happens when the frontend calls `fetch`?</summary>

### What happens when the frontend calls `fetch`?

**Definition:** `fetch(url, options)` initiates an HTTP request from the browser and returns a `Promise<Response>`.

**How it works:**

```
1. JS calls fetch('/api/users')
2. Browser resolves URL → DNS → TCP/TLS connection
3. HTTP request sent (method, headers, optional body)
4. Server processes → HTTP response (status, headers, body stream)
5. Promise resolves with Response (4xx/5xx do NOT reject — check res.ok)
6. res.json() parses body
7. Browser checks CORS — blocks JS reading cross-origin response without Access-Control-Allow-Origin
```

**Frontend ↔ API contract:** Client expects JSON shape; server must match status codes and `Content-Type`.

**Thoughts:** *Network errors reject; HTTP errors don't — always check* `res.ok` *and validate JSON shape.*

**See also:** [Fetch API](#fetch-api) · [CORS](#cors)

**Sources:** [MDN — Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

</details>

<details>
  <summary>What is a REST contract?</summary>

### What is a REST contract?

**Definition:** A **REST contract** is the agreed specification between client and server — URLs, HTTP methods, request/response shapes, status codes, and error formats.

**How it works:**

| Layer           | Tool                                                                     |
| --------------- | ------------------------------------------------------------------------ |
| Documentation   | OpenAPI (Swagger) spec                                                   |
| Shared types    | TypeScript interfaces generated from OpenAPI (orval, openapi-typescript) |
| Validation      | Zod schemas at runtime boundary                                          |
| Versioning      | `/v2/` path or `Accept` header                                           |
| Breaking change | Removing field, changing type, renaming endpoint                         |

**When to use:** Frontend and backend teams agree on `UserDto` before implementation. Codegen keeps types in sync.

**Thoughts:** *Contract = API is a product — version it, document it, validate at boundaries.*

**See also:** [REST & RESTful API principles](#2-rest)

---

</details>

<details>
  <summary>WebSocket vs polling?</summary>

### WebSocket vs polling?

**Definition:** Different patterns for server→client or bidirectional updates.

| Pattern       | Pros                     | Cons                           |
| ------------- | ------------------------ | ------------------------------ |
| Short polling | Simple                   | Wasteful, high latency         |
| Long polling  | Near real-time           | Connection overhead per wait   |
| SSE           | Server push over HTTP    | One-way only                   |
| WebSocket     | Full duplex, low latency | Connection management, proxies |

**When to use:** Chat/games → WebSocket. Live notifications read-only → SSE. Rare updates → polling is fine.

**Sources:** [MDN — WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) · [MDN — SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

---

</details>

<details>
  <summary>Client–server — why a backend?</summary>

### Client–server — why a backend?

**Definition:** Client (browser) requests; server applies business logic and uses a DB. The UI is HTML/CSS/JS; shared durable data needs a backend.

**How it works:** Classic MPA reloaded the whole page. AJAX first returned HTML fragments. Modern APIs return JSON; the client paints. HTTP verbs + resource URLs = REST. Payload bloat → BFF/GraphQL.

**See:** [Client–server architecture](#client-server-architecture) · [Evolution of web apps](#evolution-of-web-apps) · [0_system_design.md](./0_system_design.md#clientserver-architecture-why-a-backend)

**Sources:** [Doka — How web apps work](https://doka.guide/tools/web-app-works/)

---

</details>

<details>
  <summary>Types of web apps (MPA vs SPA vs CSR/SSR/SSG)?</summary>

### Types of web apps (MPA vs SPA vs CSR/SSR/SSG)?

**Definition:** MPA = many HTML pages, full reload on links. SPA = one page, JS owns screens. CSR/SSR/SSG = **when** the first HTML is built. PWA adds install/offline (manifest + service worker).

|             | When HTML exists            | Navigation             |
| ----------- | --------------------------- | ---------------------- |
| MPA static  | Files on disk               | Full reload            |
| MPA dynamic | Server template per request | Full reload            |
| CSR         | After JS in the browser     | Instant                |
| SSR         | Server HTML, then hydrate   | Instant after boot     |
| SSG         | Build time                  | Reload or hydrated SPA |

**Thoughts:** Do not treat PWA as a separate architecture. Install vs offline: [PWA](#pwa-progressive-web-app). Taxonomy: [Types of web apps](#12-types-of-web-apps).

**Sources:** [Doka — Types of web apps](https://doka.guide/tools/web-app-types/)

---

</details>

<details>
  <summary>What is a PWA?</summary>

### What is a PWA?

**Definition:** Three answers: (1) **Everyday** — installable site that runs standalone like a native app. (2) **Official** — progressive enhancement of Web APIs for native-class UX. (3) **Technical** — meets that browser’s install rules (they differ).

**How it works:** Chromium install prompt: HTTPS/`localhost` + web app manifest (`name`/`short_name`, icons, `start_url`, `display`). **Service Worker is not required to install** (it used to be). SW is still required for offline/push/background sync. Safari/Firefox usually skip the Chromium install UI; Apple says **Home Screen Web Apps**.

**Pros (interview):** one codebase; home-screen + offline + push; no store required; small (browser APIs); SEO/URLs; sandbox + HTTPS + permission prompts; HTML/CSS/JS.

**Cons:** no big PWA catalog; fragmented APIs; iOS WebKit in every browser.

**Thoughts:** Install/offline are not mandatory for the *official* definition. See [PWA](#pwa-progressive-web-app).

**Sources:** [Doka — PWA](https://doka.guide/tools/pwa/) · [web.dev — install criteria](https://web.dev/articles/install-criteria)

---

</details>

<details>
  <summary>What is FCP?</summary>

### What is FCP?

**Definition:** First Contentful Paint — time until the first text, image, SVG, or non-empty canvas appears. Blank screen ended, not “ready.”

**How it works:** Supporting Web Vital (not Core, not ranking). Good ≤ 1.8 s p75; poor > 3 s. Slow FCP usually implies slow LCP (shared TTFB + blocking CSS). INP can still be late.

**Thoughts:** Fix first paint with TTFB + render-blocking resources; still measure LCP and INP.

**See also:** [First Contentful Paint (FCP)](#first-contentful-paint-fcp)

---

</details>

<details>
  <summary>What is LCP?</summary>

### What is LCP?

**Definition:** Largest Contentful Paint — time until the largest viewport content (usually hero image or big text) is painted. Browser chooses the element.

**How it works:** Core Web Vital. Good ≤ 2.5 s p75; poor > 4 s. Four slices: TTFB, resource load delay, resource load duration, element render delay. Do not lazy-load the hero; use `fetchpriority="high"` on 1–2 resources.

**Thoughts:** Discover the LCP resource in HTML early; then cut TTFB, bytes, and render-blocking CSS/JS.

**See also:** [LCP (Largest Contentful Paint)](#lcp-largest-contentful-paint)

---

</details>

<details>
  <summary>INP vs FID?</summary>

### INP vs FID?

**Definition:** **INP** is the Core Web Vital for responsiveness (since **12 Mar 2024**). **FID** only measured the **first** interaction’s wait until the handler *started* (not handler work or next paint).

**How it works:** INP = click/tap/key → next paint for (almost) the worst interaction on the visit (one outlier dropped per 50). Phases: input delay + processing + presentation. Good ≤ 200 ms p75; poor > 500 ms. Lighthouse without a user reports **TBT**, not INP.

**Thoughts:** Cut main-thread JS; show UI first, then yield (`scheduler.yield()` + `setTimeout` fallback).

**See also:** [INP (Interaction to Next Paint)](#inp-interaction-to-next-paint)

---

</details>

<details>
  <summary>How do you take a payment without storing card numbers?</summary>

### How do you take a payment without storing card numbers?

**Definition:** The vendor (Stripe) tokenizes the card in their iframe. Your server never sees PAN. Truth is the **signed webhook**, not the browser callback.

**How it works:** Checkout Session → customer pays → `checkout.session.completed` webhook with `Stripe-Signature` → verify → mark order paid. Use idempotency keys on create.

**Thoughts:** Client SDK for UX; webhook for the ledger.

**See also:** [Payments, analytics & third-party SDKs](#15-integrations)

---

</details>

<details>
  <summary>Lab Lighthouse is green, Search Console is red — why?</summary>

### Lab Lighthouse is green, Search Console is red — why?

**Definition:** Lighthouse is **lab** (one synthetic run). Search Console Core Web Vitals is **field** CrUX at **p75** over **28 days**. Ranking uses field, not Lighthouse.

**How it works:** Default Lighthouse has no user → **INP** is missing; **TBT** is only a proxy. Field **CLS** includes scroll and late shifts. Field **LCP** uses real viewports and warm caches. After a fix, wait for the rolling window. Debug in DevTools; ship based on RUM/`web-vitals`.

**Thoughts:** Lab = reproduce. Field p75 = users and ranking.

**See also:** [Core Web Vitals](#core-web-vitals)

---

</details>

<details>
  <summary>What are Core Web Vitals?</summary>

### What are Core Web Vitals?

**Definition:** Field UX metrics at **p75** (mobile and desktop separately): **LCP** ≤ 2.5 s, **INP** ≤ 200 ms, **CLS** ≤ 0.1. Pass = all three good. **FCP** / **TTFB** diagnose load; they are not Core and not ranking.

**How it works:** Ranking uses **CrUX**, not Lighthouse. INP replaced **FID** on 12 Mar 2024 (full click→next paint, all interactions). Same thresholds on phone and desktop; look at both slices.

**Thoughts:** LCP = saw main content; INP = UI reacted; CLS = layout stayed put.

**See also:** [Core Web Vitals](#core-web-vitals)

---

</details>

<details>
  <summary>What is TTFB and why does it matter?</summary>

### What is TTFB and why does it matter?

**Definition:** Time from navigation start to the first response byte. Diagnostic, not a Core Web Vital. Good ≤ 0.8 s; poor > 1.8 s.

**How it works:** Redirects + SW start + DNS + TLS + origin until first byte. No first byte → nothing to parse → FCP/LCP wait. Low TTFB still does not guarantee a good LCP.

**Thoughts:** Fix network (CDN, fewer redirects) and origin (stream/SSG/ISR, `Server-Timing`). Then optimize paint.

**See also:** [TTFB](#ttfb-time-to-first-byte)

---

</details>

<details>
  <summary>Tasks</summary>

### Tasks

</details>

<details>
  <summary>Task 1 — Design REST API for books</summary>

### Task 1 — Design REST API for books

List endpoints for CRUD on `/books` with methods and status codes.

Outline

`GET /books` 200, `GET /books/:id` 200/404, `POST /books` 201, `PUT /books/:id` 200/404, `DELETE /books/:id` 204/404

---

</details>

<details>
  <summary>Task 2 — Read Cache-Control scenario</summary>

### Task 2 — Read Cache-Control scenario

Response has `Cache-Control: max-age=3600, public`. When will browser re-fetch?

Answer

May serve from cache without revalidation for 3600 seconds; shared caches (CDN) allowed.

---

</details>

<details>
  <summary>Coding tasks (legacy)</summary>

### Coding tasks (legacy)

// 12 What is REST? What request methods do we have? What are status codes?

---

</details>

<details>
  <summary>Junior — General (HTTP / REST)</summary>

### Junior — General (HTTP / REST)

1. Describe the testing pyramid.
2. What types of automated tests have you written? Which libraries and tools do you prefer?
3. What are unit tests? Where do they sit in the testing pyramid?
4. What is code coverage? Is 100% coverage required?
5. How do you prevent the browser from serving cached HTTP responses?
6. What is XSS (Cross-Site Scripting)?

---

</details>

<details>
  <summary>Middle — General</summary>

### Middle — General

1. Describe the testing pyramid.
2. What types of automated tests have you written? Which libraries and tools do you prefer?
3. What are unit tests? Where do they sit in the testing pyramid?
4. What is code coverage? Is 100% coverage required?
5. How do you prevent the browser from serving cached HTTP responses?
6. What is XSS (Cross-Site Scripting)?
7. Explain Observer vs Pub/Sub — differences and browser/framework examples.
8. What is the purpose of `self.addEventListener('fetch', …)` in a service worker?
9. What is the event loop? Explain microtasks vs macrotasks.

---

</details>

<details>
  <summary>General</summary>

### General

1. Explain functional programming concepts.
2. What is TDD / BDD?
3. Explain how HTTPS works in detail. What is in a TLS certificate, and how does the CA signature prove the server’s public key?
4. What tech stack would you choose to clone a well-known project and why?
5. How do you maintain a legacy codebase while shipping changes?
6. If you know several frameworks — which would you pick for the next project and why?
7. What is the V8 engine?

---

</details>
 frameworks — which would you pick for the next project and why?
7. What is the V8 engine?

---

</details>
