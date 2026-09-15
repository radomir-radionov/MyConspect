# Build & Tooling — CI, Bundlers & Docker

Covers CI/CD, package management, bundlers, code quality, Docker, infrastructure components, and developer-experience tools for modern frontend and full-stack delivery.

### Related docs

* [Node.js](./8_nodejs.md) · [Files & file systems](./8_nodejs.md#files--file-systems) · [React](./4_react.md) · [Next.js](./4_nextjs.md) · [TypeScript](./5_ts.md) · [INP / bundle size](./6_web_api.md#inp-interaction-to-next-paint) · [JSON](./3_js_core.md#json) · [Web server](./6_web_api.md#web-server)
* [DevOps — Nginx / Apache](./15_devops.md#nginx--deployment) · [DevOps — CI systems](./15_devops.md#ci-systems) · [Git — CI/CD](./0_git.md#cicd-integration) · [GitHub Flow](./0_git.md#github-flow--trunk-based) · [GitHub Actions vs GitLab CI](./15_devops.md#github-actions-vs-gitlab-ci-vs-circleci)
* [Why write tests / AAA](./7_special.md#why-write-tests-aaa) · [Jest first tests (Node vs jsdom)](./7_special.md#jest--first-tests-node-vs-jsdom) · [Test doubles](./7_special.md#test-doubles-stubs-mocks-spies) · [Integration / E2E](./7_special.md#integration-testing)
* [SDLC & Agile](./7_special.md#11-sdlc--agile) · [Scrum](./7_special.md#scrum) · [Kanban](./7_special.md#kanban)
* [Databases](./9_database.md) · [Interview hub](./0_interview.md) · [Interview Practice](#interview-practice)

### Main concepts

| Area | Topics |
|------|--------|
| **Delivery** | What is CI/CD, principles, product loop, CI, CDelivery, CD, pipelines, GitHub Actions, YAML |
| **Packages** | npm, Yarn, pnpm, lockfiles, workspaces |
| **Build** | Transpilers, bundlers, code splitting, tree shaking, source maps |
| **Tooling** | Vite, Webpack, Rollup, esbuild, Turbopack |
| **Quality** | ESLint, Prettier, linter vs formatter · [Why tests](./7_special.md#why-write-tests-aaa) · [Jest](./7_special.md#jest--first-tests-node-vs-jsdom) · [Test doubles](./7_special.md#test-doubles-stubs-mocks-spies) |
| **Containers** | Docker Engine, images, containers, [volumes](#volumes) / [bind mounts](#bind-mounts) / [tmpfs](#tmpfs-and-named-pipes), networks, Hub, Dockerfile, Compose, [lifecycle](#container-lifecycle) |
| **Infra** | Nginx, Apache, Redis, message brokers (RabbitMQ, Kafka, BullMQ) |
| **DX** | Storybook, OpenAPI / Swagger |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [CI/CD](#ci-cd)
- [Package management](#packages)
- [Task runners](#task-runners)
- [Transpilers](#transpilers)
- [Bundling concepts](#bundling)
- [Bundlers](#bundlers)
- [Code quality](#code-quality)
- [Docker](#docker)
- [Architecture](#architecture)
- [Infrastructure](#infrastructure)
- [Developer experience](#developer-experience)
- [Interview Practice](#interview-practice)

### CI/CD (continuous integration)

**Definition:** Automated pipeline that builds, tests, and validates every code change merged into a shared repository — catching integration errors before production.

**When to use:** Every team with more than one developer; mandatory for production apps.

**Pluses and minuses:**

| + | − |
|------|------|
| Detects broken builds early | Initial pipeline setup cost |
| Enforces lint and test gates | Flaky tests block the team |
| Enables trunk-based development | Requires small, frequent PRs |

**Examples:**

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint && npm test && npm run build
```

**Sources:** [GitHub Actions docs](https://docs.github.com/en/actions) · [ByteByteGo — CI/CD](https://blog.bytebytego.com/p/a-crash-course-in-cicd)

### Vite & Webpack (bundlers)

**Definition:**

**Webpack** is a mature, highly configurable module bundler with loaders and plugins. **Vite** uses native ESM in dev (esbuild) and Rollup for production — default for modern React/Vue/Svelte apps.

| | Webpack | Vite |
|---|---------|------|
| Dev speed | Slower HMR | Instant cold start |
| Config | High | Low (sensible defaults) |
| Best for | Legacy apps, Module Federation | Greenfield SPAs, CRA migration |
| Ecosystem | Largest plugin set | Growing; covers most apps |

**When to use:** Vite for new projects; Webpack for legacy codebases or Module Federation micro-frontends.

**Examples:**

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: '0.0.0.0', port: 3000 },
  build: { sourcemap: 'hidden' },
});
```

**Sources:** [vite.dev](https://vite.dev/) · [webpack.js.org](https://webpack.js.org/)

### Docker (containers)

**Definition:** Platform for developing, shipping, and running applications in lightweight, isolated **containers** — packaging code, runtime, and dependencies into reproducible images.

**When to use:** Microservices, CI/CD pipelines, local dev parity, cloud deployment.

**Pluses and minuses:**

| + | − |
|------|------|
| Consistent dev/staging/prod | Learning curve (networking, volumes) |
| Fast startup vs VMs | Native modules must match container arch |
| Portable deployments | Image bloat without multi-stage builds |

**Examples:**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```

**Sources:**

[docs.docker.com](https://docs.docker.com/)

---

<a name="ci-cd"></a>

## CI/CD

<details>
  <summary>What is CI/CD</summary>

### What is CI/CD

**Definition:** **CI/CD** means **Continuous Integration / Continuous Delivery** — a way of working where build, test, and publish (and often deploy) are automated so every change can be integrated and shipped with a short feedback loop. **Continuous Deployment** is a stricter variant: passing CI ships to production with no human gate. See [CI vs CD](#ci-vs-cd--comparison).

**How it works:**

Agile iterations get faster when each slice of the cycle is automated (process: [7_special.md — Agile](./7_special.md#agile)). Tooling sits on **Git**, server/container infra, and team chat/PRs. Solo projects benefit too — not only large product teams.

Principles:

- **Split responsibility** — product, design, engineering, QA, and infra own different sides; pipelines hand work between them (built artifact → tests → release).
- **Reduce risk** — automate checks so broken builds and regressions surface before users.
- **Short feedback loop** — lint/test/build on every PR; users and owners see working software sooner.
- **Shared environment** — same Node/npm versions, lockfile (`npm ci`), and test runner locally and on CI so “works on my machine” is rare.

Product loop (stages can be skipped or merged):

| Stage | What happens |
|-------|----------------|
| **Code** | Git workflow (often [GitHub Flow](./0_git.md#github-flow--trunk-based): branch → PR → review → merge). Git Flow is heavier — better for versioned releases than for many-deploys-per-day. |
| **Build** | After local checks, CI builds on a runner — often in **Docker** for a repeatable image. Platforms: GitHub Actions, GitLab CI/CD, Jenkins, Bitbucket Pipelines, TeamCity; hosts like Netlify/Vercel run build+deploy. Comparison: [15_devops.md — CI systems](./15_devops.md#ci-systems). |
| **Test** | Automated unit/integration/E2E first; manual QA still used for UX and exploratory work. Pre-release builds may be versioned (`v.2.4.5-1`). Jest, Playwright/Puppeteer, Selenium — [7_special.md — tests](./7_special.md#why-write-tests-aaa). |
| **Release** | Cadence depends on the product. CI’s job is a **promotable artifact**, not Jira/analytics. Product metrics (GA, Metrika) and task trackers sit next to the loop. |
| **Deploy** | Deliver to users. Simple SPAs need little infra; shops/search/streaming compete on caching, CDNs, and server architecture. |
| **Operate** | Support and monitoring. Helpdesk/chatbots are not CI tools; they often expose APIs. Observability: [15_devops.md](./15_devops.md). |
| **Plan** | Feedback → backlog → next iteration. The loop closes. |

**When to use:**

Every production app; also useful for one-person repos (PR checks, preview deploys).

#### Common pitfalls

Treating CI/CD as a Swiss army knife for every process; skipping a shared lockfile/image so local and CI diverge; calling “CD” without saying **delivery** vs **deployment**.

**Pluses and minuses:**

| + | − |
|------|------|
| Faster ship and fix cycle | Over-engineering pipelines if the team is inexperienced |
| Less manual toil; fewer integration bugs | Tools do not fix team communication |
| Fast feedback (PR red/green) | Everyone must share the same toolchain and secrets model |
| Easy to re-prioritize when the plan is flexible | Flaky tests and slow jobs become a bottleneck |

**Examples:**

GitHub Actions is a CI/CD platform: an **event** (push, PR, schedule, `workflow_dispatch`) starts a **workflow** (YAML in `.github/workflows/`). **Jobs** run on **runners** (hosted Ubuntu/Windows/macOS or self-hosted); **steps** run scripts or reusable **actions**.

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v7
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npm run lint && npm test && npm run build
```

**Thoughts:** Automate the path from commit to a known-good artifact (and optionally to prod) so the Agile loop stays short and repeatable.

**Sources:** [GitHub Actions — Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions) · [Doka — CI/CD](https://doka.guide/tools/ci-cd/)

</details>

<details>
  <summary>Continuous Integration (CI)</summary>

### Continuous Integration (CI)

**Definition:** Automated process that builds, tests, and validates every code change merged into a shared repository — catching integration errors early. Full loop: [What is CI/CD](#what-is-cicd).

**When to use:** Every team with more than one developer; mandatory for production apps.

**Pluses and minuses:**

| + | − |
|------|------|
| Detects broken builds before merge | Initial pipeline setup cost |
| Enforces test coverage and lint gates | Flaky tests block the team |
| Enables trunk-based development | Requires discipline around small PRs |

**Examples:**

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build
```

**Thoughts:** CI scope = build + test + lint. It does **not** necessarily deploy. Keep pipelines fast (< 10 min); split slow E2E / visual / Lighthouse into a separate job — [system tests](./7_special.md#system-testing).

**Sources:** [ByteByteGo — CI/CD crash course](https://blog.bytebytego.com/p/a-crash-course-in-cicd)

</details>

<details>
  <summary>Continuous Delivery (CDelivery)</summary>

### Continuous Delivery (CDelivery)

**Definition:** Every change that passes CI produces a **deployable artifact**; production release is a manual (or approval-gated) step.

**When to use:** Regulated industries, staged rollouts, teams that want automation but retain release control.

**Pluses and minuses:**

| + | − |
|------|------|
| Always-ready release candidate | Still requires human gate for prod |
| Reduces release-day surprises | Artifact storage and versioning needed |

**Examples:**

```yaml
# Deploy to staging automatically; prod requires manual approval
jobs:
  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: npx vercel deploy --token=${{ secrets.VERCEL_TOKEN }}
```

**Thoughts:** CDelivery ≠ CDployment. The artifact (Docker image, static bundle, npm package) should be immutable — promote the same artifact through environments.

**Sources:** [ByteByteGo — CI/CD](https://blog.bytebytego.com/p/a-crash-course-in-cicd)

</details>

<details>
  <summary>Continuous Deployment (CD)</summary>

### Continuous Deployment (CD)

**Definition:** Every change that passes CI is **automatically deployed to production** without manual intervention.

**When to use:** Mature teams with strong test coverage, feature flags, and automated rollback (canary, blue-green).

**Pluses and minuses:**

| + | − |
|------|------|
| Fastest time-to-market | Requires high test confidence |
| Small, low-risk incremental changes | Rollback strategy must be automated |
| Eliminates release bottlenecks | Feature flags often required for incomplete work |

**Thoughts:** CD extends CI. Many teams say "CD" but mean CDelivery. Clarify in architecture docs which model you use.

**Sources:** [ByteByteGo — CI/CD](https://blog.bytebytego.com/p/a-crash-course-in-cicd)

</details>

<details>
  <summary>CI vs CD — comparison</summary>

### CI vs CD — comparison

| Aspect | CI | CDelivery | CD |
|--------|----|-----------|-----|
| **Scope** | Build + test | + deployable artifact | + auto prod deploy |
| **Goal** | Catch integration errors | Always releasable | Ship continuously |
| **Deployment** | None | Manual / gated | Automatic |
| **Risk** | Low | Medium | High without safeguards |

**Sources:** [ByteByteGo — CI/CD](https://blog.bytebytego.com/p/a-crash-course-in-cicd)

</details>

<details>
  <summary>CI/CD pipeline stages</summary>

### CI/CD pipeline stages

**Definition:**

The **machine** path from git event to artifact/deploy. The wider **product** loop (plan → code → operate) is in [What is CI/CD](#what-is-cicd).

```mermaid
flowchart LR
  commit[Git push] --> ci[CI: lint test build]
  ci --> artifact[Artifact registry]
  artifact --> staging[Deploy staging]
  staging --> approval{Approval?}
  approval -->|CDelivery| prod[Deploy prod]
  approval -->|CD| prod
```

**How it works:** Typical frontend pipeline: `install → lint → typecheck → unit tests → build → (E2E) → deploy`. Cache `node_modules` and build output between runs. Keep the PR job fast (`< 10 min`); park slow E2E/visual in a separate job.

**When to use:** PR checks on every change; staging on `main`; production on tag or after approval (CDelivery) vs auto (CD).

**Thoughts:** One immutable artifact promoted through environments — do not rebuild differently for prod.

**Sources:** [GitHub Actions — Workflows](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

</details>

<details>
  <summary>GitHub Actions</summary>

### GitHub Actions

**Definition:** GitHub’s CI/CD platform — YAML workflows in `.github/workflows/` that lint, test, build, and deploy on repository events. Concept: [What is CI/CD](#what-is-cicd). YAML: [YAML](#yaml). Competitors: [15_devops.md](./15_devops.md#github-actions-vs-gitlab-ci-vs-circleci).

**How it works:**

- Any `*.yml` / `*.yaml` in `.github/workflows/` is a **workflow**. Optional `name:` is the Actions-tab label. Results appear under **Actions**.
- `on:` lists **triggers** (`push`, `pull_request`, `schedule`, `workflow_dispatch`). Filter with `branches` / `tags` (or `*-ignore`). Do not mix `branches` and `branches-ignore` on the same event.
- `schedule` is **POSIX cron in UTC**, five fields. Scheduled workflows run from the **default branch**.
- `jobs:` is a map of IDs (letter/`_` first). `needs:` waits for listed jobs to **succeed**; failed/skipped deps skip downstream unless `if: always()`. `job3: needs: [job1, job2]` runs after both.
- `runs-on:` picks the runner (`ubuntu-latest` / `windows-latest` / `macos-latest` track current GA images — pin `ubuntu-24.04` for a fixed OS). Jobs run on hosted VMs (or **in** a container).
- **Matrix** (`strategy.matrix`) fans one job into combinations. Keep keys consistent with `${{ matrix.* }}`.
- `${{ }}` is **not** YAML — GitHub substitutes after parse. Contexts: `github`, `env`, `vars`, `secrets`, `matrix`, `needs` (outputs of **this** job’s `needs:`), `inputs`. Runner env (`$GITHUB_REF`) exists only after dispatch; use contexts in `if:` **before** the runner starts.
- `steps:` run in order. `uses:` calls an action (pin SHA for supply-chain safety). `run:` is a shell; `|` for multi-line.

**When to use:**

PR gates on `main`. Matrix Node versions. Cron. Checkout → `npm ci` → test → build → deploy.

#### Common pitfalls

- Retired runner labels (`ubuntu-18.04`, `windows-2016`, `macos-10.15`) and Node 10/12/14 — use current images and LTS Node.
- Matrix key mismatch (`matrix.node` vs `node-version` in `with:`).
- `needs` context is outputs of **prerequisite** jobs, not dependents.
- `npm install` in CI → `npm ci` with a lockfile.
- Cron treated as local time (it is UTC).

**Pluses and minuses:**

| + | − |
|------|------|
| Native GitHub PRs, secrets, environments | Minutes + YAML lock-in |
| Matrix + reusable actions | `-latest` OS labels move; pin when needed |
| Same repo as the code | Public actions are a supply-chain surface — pin versions/SHAs |

**Examples:**

Node CI on push/PR to `main`, matrix OS + Node:

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node: [20, 22]
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v7
        with:
          node-version: ${{ matrix.node }}
          cache: npm
      - run: npm ci
      - run: |
          npm run build
          npm test
```

Split deploy with `needs: [test]` on another job. Secrets: `${{ secrets.* }}`, never in the repo.

**Thoughts:** Event → jobs (`needs`, matrix, `runs-on`) → ordered `uses`/`run` steps; `${{ }}` reads contexts GitHub fills in.

**Sources:** [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) · [Events / cron](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows) · [Contexts](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts) · [Runner images](https://github.com/actions/runner-images)

</details>

<details>
  <summary>YAML</summary>

### YAML

**Definition:** YAML (YAML Ain’t Markup Language) is a human-readable serialization language for structured data — configs, CI, Compose, Kubernetes, OpenAPI, linters. File extension: `.yaml` or `.yml`.

**How it works:**

- Three primitives: **mappings** (key/value), **sequences** (lists), **scalars** (strings, numbers, booleans, `null`).
- Block style: indent with **spaces only** (tabs are invalid). Nested nodes must be more indented than the parent; siblings share the same indent. **2 spaces** is the usual convention — the spec does not require exactly two.
- `key: value` — colon + space. Comments: `# …` (not allowed inside scalars).
- Sequences: block (`- item`) or flow (`[a, b]`). Mappings can also use flow `{ k: v }`.
- Strings: unquoted, `'single'`, or `"double"`. Quote when the value looks like a type (`true`, `null`, `2.99`) or contains `:`, `#`, or leading `*`.
- Numbers: integers and floats with a **dot** (`9.99`). A comma is not a decimal separator — `2,99` is a string (or a flow-list fragment).
- Anchors `&name` mark a node; aliases `*name` reuse it (like a named copy / JS spread of a value). Merge key `<<: *name` copies mapping keys; later keys override. `<<` is a **YAML 1.1** feature (dropped in 1.2); GitHub Actions, Compose, and many parsers still support it.
- A document root may be a mapping, sequence, or scalar.

YAML allows comments; JSON does not. YAML strings may be unquoted; JSON strings must use double quotes. JSON (RFC 8259) also allows a scalar root; YAML is still preferred for human-edited configs. JSON is the interchange format for APIs (`JSON.parse` / `stringify`) — see [JSON](./3_js_async.md#json).

**When to use:**

GitHub Actions / GitLab CI; Docker Compose; ESLint/Prettier config; Kubernetes manifests; OpenAPI specs.

#### Common pitfalls

- Tabs for indent → parse error. Configure the editor / a YAML linter.
- Inconsistent indent between siblings.
- Unquoted `true` / `false` / `null` / numbers become typed values, not strings.
- YAML 1.1: `yes`, `no`, `on`, `off`, `NO` may parse as booleans.
- Forgetting the space after `-` or `:`.

**Pluses and minuses:**

| + | − |
|------|------|
| Comments; unquoted strings; readable nesting | Indent errors fail the whole file; tabs vs spaces |
| Anchors cut duplication | YAML 1.1 vs 1.2 type surprises (`yes`/`NO` as bools in 1.1) |
| Root can be any node type | Merge `<<` not in YAML 1.2 core — parser-dependent |

**Examples:**

```yaml
# pet config — mapping + sequence + scalars
bestCat:
  name: mittens          # unquoted string
  isFluffy: true
  sounds:
    - mur
    - pur
  paws: 4
  lunchTime: 9.99        # float — use a dot, not a comma

# anchors + merge (YAML 1.1 / many CI parsers)
base: &base
  name: cool cat
  age: 2

cat1:
  <<: *base              # name + age from base

cat2:
  <<: *base
  age: 7                 # overrides base.age
```

Equivalent after merge: `cat1` → `{ name: cool cat, age: 2 }`; `cat2` → `{ name: cool cat, age: 7 }`.

GitHub Actions (minimal workflow — `.github/workflows/*.yml` or `*.yaml`):

```yaml
name: CI
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo "event ${{ github.event_name }}"
      - run: echo "os ${{ runner.os }}"
```

`${{ }}` is **GitHub expression syntax**, not YAML — the runner substitutes it after the file is parsed.

**Thoughts:** YAML is indented JSON-with-comments for humans — spaces, not tabs; quote anything that looks like a type.

**Sources:** [YAML 1.2.2 spec](https://yaml.org/spec/1.2.2/) · [GitHub Actions — YAML syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#about-yaml-syntax-for-workflows) · [GitHub Actions — anchors](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows#yaml-anchors-and-aliases) · [eemeli/yaml — 1.1 vs 1.2](https://eemeli.org/yaml/#version-differences)

</details>

<a name="packages"></a>

## Package management

<details>
  <summary>npm</summary>

### npm

**Definition:** Default package manager for Node.js. Manages dependencies via `package.json` and `package-lock.json`.

**When to use:** Default choice; required when tooling only documents npm workflows.

**Pluses and minuses:**

| + | − |
|------|------|
| Universal, ships with Node | Slower installs than pnpm on large monorepos |
| Massive registry (npmjs.com) | Flat `node_modules` can cause phantom deps |
| `npm ci` for reproducible CI | Breaking changes in npm major versions |

**Examples:**

```json
{
  "dependencies": { "react": "^19.0.0" },
  "devDependencies": { "vite": "^6.0.0", "typescript": "^5.0.0" },
  "scripts": { "dev": "vite", "build": "tsc -b && vite build" }
}
```

```bash
npm install          # update lockfile (local dev)
npm ci               # clean install from lockfile (CI)
npm install -D eslint  # add devDependency (-D = --save-dev)
```

**Thoughts:**

| Field | Purpose |
|-------|---------|
| `dependencies` | Required at runtime; shipped in production bundle |
| `devDependencies` | Build, test, lint only; not in prod bundle |
| `peerDependencies` | Expected to be provided by the host app (libraries) |
| `optionalDependencies` | Installed if possible; failure is non-fatal |

Use `npm ci` in CI — never `npm install`. Never commit `node_modules`.

**Sources:** [npm docs](https://docs.npmjs.com/)

</details>

<details>
  <summary>Yarn (Classic & Berry)</summary>

### Yarn (Classic & Berry)

**Definition:** Alternative package manager by Meta. Yarn Classic (v1) uses `yarn.lock`; Yarn Berry (v2+) uses Plug'n'Play (PnP) optionally.

**When to use:** Existing Yarn monorepos; teams standardized on Yarn workspaces.

**Pluses and minuses:**

| + | − |
|------|------|
| Deterministic installs via lockfile | Berry PnP breaks some tools expecting `node_modules` |
| Workspaces for monorepos | Two major versions (Classic vs Berry) cause confusion |
| `yarn dlx` for one-off commands | Smaller default mindshare than npm |

**Examples:**

```json
// package.json — workspaces
{
  "private": true,
  "workspaces": ["packages/*", "apps/*"]
}
```

```bash
yarn install
yarn workspace @myapp/web build
```

**Thoughts:** Most new projects choose pnpm over Yarn Classic. If starting fresh with Yarn, use Berry (v4) with `nodeLinker: node-modules` unless you want PnP.

**Sources:** [yarnpkg.com](https://yarnpkg.com/)

</details>

<details>
  <summary>pnpm</summary>

### pnpm

**Definition:** Fast, disk-efficient package manager using a content-addressable global store and hard-linked `node_modules`.

**When to use:** New monorepos, large teams, when phantom dependency bugs are a concern.

**Pluses and minuses:**

| + | − |
|------|------|
| Fastest installs; saves disk space | Some tools assume npm flat layout |
| Strict dependency resolution (no phantom deps) | Occasional peer-dep resolution quirks |
| First-class monorepo workspaces | Less universal in legacy CI templates |

**Examples:**

```bash
pnpm install
pnpm add -D vitest
pnpm --filter @myapp/web dev   # run script in one workspace package
```

```yaml
# .npmrc
strict-peer-dependencies=true
auto-install-peers=true
```

**Thoughts:** pnpm's strictness catches bugs npm silently allows — e.g. importing a package you didn't declare. Prefer pnpm for Turborepo / Nx monorepos.

**Sources:** [pnpm.io](https://pnpm.io/)

</details>

<details>
  <summary>npm vs Yarn vs pnpm</summary>

### npm vs Yarn vs pnpm

| | npm | Yarn | pnpm |
|---|-----|------|------|
| **Lockfile** | `package-lock.json` | `yarn.lock` | `pnpm-lock.yaml` |
| **CI command** | `npm ci` | `yarn install --frozen-lockfile` | `pnpm install --frozen-lockfile` |
| **Monorepo** | workspaces | workspaces | workspaces (best DX) |
| **Disk usage** | High (per project) | High | Low (shared store) |
| **Strict deps** | No | No | Yes |

**When to use:** Pick one per org and enforce via `packageManager` field in `package.json` + Corepack.

```json
{ "packageManager": "pnpm@9.15.0" }
```

---

**Sources:** [pnpm — Feature comparison](https://pnpm.io/feature-comparison)

</details>

<a name="task-runners"></a>

## Task runners

<details>
  <summary>npm scripts</summary>

### npm scripts

**Definition:** Commands defined in `package.json` `scripts` field, executed via `npm run <name>`. The modern default for automating dev workflows.

**When to use:** Always — primary task runner for JS projects.

**Pluses and minuses:**

| + | − |
|------|------|
| Zero extra dependencies | Complex orchestration gets verbose |
| Cross-platform with `cross-env`, `rimraf` | No built-in streaming/file watching |
| `pre`/`post` hooks for lifecycle | `pre` hooks can surprise newcomers |

**Examples:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest",
    "prepare": "husky"
  }
}
```

```bash
npm run dev          # runs "dev" script
npm test             # "test" is special — no "run" needed
npm run lint -- --fix  # pass args after --
```

**Thoughts:** `prepare` runs after `npm install` — use for git hooks (husky), not heavy builds. Prefer dedicated tools (Vite, Turborepo) over chaining many shell commands.

**Sources:** [npm — scripts](https://docs.npmjs.com/cli/v10/using-npm/scripts)

</details>

<details>
  <summary>Gulp</summary>

### Gulp

**Definition:** Legacy streaming task runner that pipes files through plugins (SCSS → CSS, image optimization).

**When to use:** Maintaining legacy codebases only. New projects: use npm scripts + bundler plugins.

**Pluses and minuses:**

| + | − |
|------|------|
| Fine-grained file stream control | Largely superseded by bundler plugins |
| Large plugin ecosystem (legacy) | Imperative task files age poorly |

**Thoughts:**

If you see a `gulpfile.js`, plan migration to Vite/Webpack loaders rather than extending Gulp.

---

**Sources:** [gulpjs.com](https://gulpjs.com/)

</details>

<a name="transpilers"></a>

## Transpilers

<details>
  <summary>Compiler vs bundler</summary>

### Compiler vs bundler

**Definition:**

| Tool type | Input | Output | Role |
|-----------|-------|--------|------|
| **Compiler / transpiler** | Source code | Transformed source code | Syntax downleveling, type stripping |
| **Bundler** | Many modules | Few optimized files | Dependency graph, code splitting, minification |

**Thoughts:** Modern stacks combine both — TypeScript (type-check) + esbuild (emit) + Rollup (bundle). Don't conflate "Babel" with "Webpack."

**Sources:** [Webpack — Concepts](https://webpack.js.org/concepts/)

</details>

<details>
  <summary>Babel</summary>

### Babel

**Definition:** JavaScript compiler that transforms modern syntax (ES2024) into backward-compatible code for older browsers.

**When to use:** Legacy browser support; custom AST transforms; libraries publishing to both ESM and CJS.

**Pluses and minuses:**

| + | − |
|------|------|
| Massive plugin ecosystem | Slower than esbuild/swc |
| `@babel/preset-env` targets browserslist | Config complexity |
| JSX transform for non-ESBuild setups | Polyfill confusion (use `core-js` deliberately) |

**Examples:**

```js
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: 'defaults' }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
```

**Thoughts:** Vite uses esbuild for transpilation by default — Babel only needed for exotic plugins. `@babel/preset-env` with `useBuiltIns: 'usage'` adds polyfills automatically; prefer explicit `core-js` imports to avoid bundle bloat.

**Sources:** [babeljs.io](https://babeljs.io/)

</details>

<details>
  <summary>TypeScript compiler (tsc)</summary>

### TypeScript compiler (tsc)

**Definition:** Type-checks `.ts` files and optionally emits JavaScript. `tsc` is the type checker; emit is often delegated to esbuild/swc for speed.

**When to use:** Every non-trivial TS project. Run `tsc --noEmit` in CI even when Vite/esbuild handles emit.

**Pluses and minuses:**

| + | − |
|------|------|
| Static type safety at scale | Slower emit than esbuild |
| `.d.ts` generation for libraries | Config (`tsconfig.json`) has many options |
| Project references for monorepos | `tsc --noEmit` still needed even when Vite emits |

**Examples:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true
  }
}
```

```json
// package.json — separate type-check from build
{ "scripts": { "typecheck": "tsc -b", "build": "vite build" } }
```

**Thoughts:** `moduleResolution: "bundler"` (TS 5+) matches Vite/Webpack behavior. Libraries publishing to npm need `declaration: true` and separate `tsconfig.build.json`.

**Sources:**

[typescriptlang.org](https://www.typescriptlang.org/)

---

</details>

<a name="bundling"></a>

## Bundling concepts

<details>
  <summary>Bundling</summary>

### Bundling

**Definition:** Process of resolving a module dependency graph and combining (or chunking) files into optimized output for the browser or Node.

**When to use:** All non-trivial web apps. Even with HTTP/2, bundling enables transforms and optimization.

**Pluses and minuses:**

| + | − |
|------|------|
| Fewer HTTP requests | Initial bundle can grow large |
| Enables minification, tree shaking | Build step adds complexity |
| Transforms non-JS assets (CSS, images) | Cache invalidation on any change (without splitting) |

**Thoughts:** Native ESM in browsers reduces bundling need for dev (Vite), but production still bundles for optimization.

**Sources:** [Vite — Features](https://vite.dev/guide/features.html)

</details>

<details>
  <summary>Single-page application (SPA)</summary>

### Single-page application (SPA)

**Definition:** Web app that loads one HTML shell and handles routing client-side without full page reloads.

**When to use:** Dashboards, admin panels, apps behind auth. Prefer SSR/SSG (Next.js) for public SEO-critical pages. Types: [6_web_api.md — Types of web apps](./6_web_api.md#types-of-web-apps). PWA (install vs offline): [6_web_api.md — PWA](./6_web_api.md#pwa-progressive-web-app).

**Pluses and minuses:**

| + | − |
|------|------|
| Fast navigation after initial load | Large initial JS payload |
| Rich client interactivity | SEO requires extra work (SSR/SSG) |
| Simpler deployment (static files) | Time-to-interactive on slow devices |

**Sources:** [MDN — SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)

</details>

<details>
  <summary>Code splitting</summary>

### Code splitting

**Definition:**

Technique of splitting the bundle into smaller chunks loaded on demand — reducing initial payload.

HTTP **cache** already skips the network for repeat images (and often JS/CSS). Scripts still **parse and execute** even from cache; large JS is expensive. Code splitting ships only the code for the current route, then loads the rest when needed.

**When to use:** Any app with routes or heavy optional features (charts, editors, admin sections).

**Pluses and minuses:**

| + | − |
|------|------|
| Faster initial load | More HTTP requests (mitigated by HTTP/2) |
| Route-based lazy loading | Loading states / Suspense needed |
| Parallel chunk downloads | Complexity in cache strategy |

**Examples:**

```tsx
import { lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('./AdminPanel'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <AdminPanel />
    </Suspense>
  );
}
```

```js
// Webpack / Vite — dynamic import creates a separate chunk automatically
const module = await import('./heavy-lib');
```

**Thoughts:** Split at route boundaries first, then heavy libraries. Analyze with `rollup-plugin-visualizer` or Webpack Bundle Analyzer. Avoid splitting tiny modules — overhead exceeds savings. Smaller initial JS also improves **INP** — [6_web_api.md](./6_web_api.md#inp-interaction-to-next-paint).

**Sources:** [MDN — Code splitting](https://developer.mozilla.org/en-US/docs/Glossary/Code_splitting) · why payload grew: [Doka — How web apps work](https://doka.guide/tools/web-app-works/)

</details>

<details>
  <summary>Tree shaking</summary>

### Tree shaking

**Definition:** Dead-code elimination — removing unused exports from the final bundle. Requires ESM `import`/`export` static analysis.

**When to use:** Always in production builds. Audit with bundle analyzer.

**Pluses and minuses:**

| + | − |
|------|------|
| Smaller production bundles | Broken by side-effectful modules |
| No runtime cost | CommonJS modules shake poorly |
| Works automatically with modern bundlers | Barrel files (`index.ts` re-exports) can defeat it |

**Examples:**

```json
// package.json — mark side-effect-free for better shaking
{ "sideEffects": false }

// or list files with side effects
{ "sideEffects": ["*.css", "./src/polyfills.ts"] }
```

```js
// Bad — imports entire library
import _ from 'lodash';
_.debounce(fn, 300);

// Good — imports only debounce
import debounce from 'lodash/debounce';
```

**Thoughts:** `sideEffects: false` tells bundlers they can drop unused modules entirely. CSS imports are side effects — list them explicitly. Barrel `export *` files can defeat shaking and bloat the client bundle (hurts **INP**) — [6_web_api.md — INP](./6_web_api.md#inp-interaction-to-next-paint).

</details>

<details>
  <summary>Source maps</summary>

### Source maps

**Definition:** Files mapping minified/transpiled code back to original source for debugging.

**When to use:**

| Environment | Recommended |
|-------------|-------------|
| Development | `eval-source-map` or Vite default (fast) |
| Production (with monitoring) | `hidden-source-map` (not referenced in bundle) |
| Production (no monitoring) | `false` |

**Pluses and minuses:**

| + | − |
|------|------|
| Debug production issues with real line numbers | Increase build time and artifact size |
| Error monitoring (Sentry) uses them | Expose source code if published publicly |

**Examples:**

```ts
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: 'hidden', // generate but don't expose in JS
  },
});
```

**Thoughts:** Upload source maps to Sentry/Datadog in CI, then delete from public CDN. Never deploy `source-map` (inline reference) to production — exposes business logic.

</details>

<details>
  <summary>Build-time vs runtime environment variables</summary>

### Build-time vs runtime environment variables

**Definition:**

| Type | When resolved | Visible in browser? | Example |
|------|---------------|---------------------|---------|
| **Build-time** | At `vite build` / `webpack` | Yes, if prefixed (`VITE_`, `NEXT_PUBLIC_`) | `VITE_API_URL` |
| **Runtime** | At server/container start | Injected by server, not in JS bundle | Docker `ENV`, K8s ConfigMap |

**Thoughts:**

Never put secrets in `VITE_*` or `NEXT_PUBLIC_*` — they are embedded in the client bundle. Use server-side env for API keys.

---

**Sources:** [Vite — Env variables](https://vite.dev/guide/env-and-mode.html)

</details>

<a name="bundlers"></a>

## Bundlers

<details>
  <summary>Webpack</summary>

### Webpack

**Definition:** Mature, highly configurable module bundler. Uses loaders for file transforms and plugins for optimization.

**When to use:** Legacy apps, micro-frontends (Module Federation), complex custom loader chains.

**Pluses and minuses:**

| + | − |
|------|------|
| Largest plugin/loader ecosystem | Slow dev server vs Vite |
| Module Federation for micro-frontends | Complex configuration |
| Handles any asset type | Steep learning curve |

**Examples:**

```js
// webpack.config.js (minimal)
module.exports = {
  entry: './src/index.tsx',
  output: { filename: 'bundle.[contenthash].js', clean: true },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
  optimization: { splitChunks: { chunks: 'all' } },
};
```

**Thoughts:**

| Concept | Role |
|---------|------|
| **Loaders** | Transform files (TS → JS, SCSS → CSS) |
| **Plugins** | Bundle-level tasks (HTML generation, minification) |
| **Module Federation** | Runtime sharing of modules between independently deployed apps |

CRA used Webpack internally (deprecated). Prefer Vite for new React apps.

**Sources:** [webpack.js.org](https://webpack.js.org/)

</details>

<details>
  <summary>Rollup</summary>

### Rollup

**Definition:** ESM-first bundler optimized for libraries. Produces clean, tree-shakeable output.

**When to use:** Publishing npm libraries, design systems, utility packages.

**Pluses and minuses:**

| + | − |
|------|------|
| Best-in-class library output | Less suited for complex app dev servers |
| Native ESM support | Plugin ecosystem smaller than Webpack |
| Used internally by Vite for production | No HMR (used as build step, not dev server) |

**Examples:**

```js
// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.esm.js', format: 'esm' },
    { file: 'dist/index.cjs.js', format: 'cjs' },
  ],
  plugins: [typescript()],
  external: ['react', 'react-dom'],
};
```

**Thoughts:** Mark `react`, `react-dom` as `external` in libraries — don't bundle them. Ship both ESM and CJS for maximum compatibility, or ESM-only for modern consumers.

**Sources:** [rollupjs.org](https://rollupjs.org/)

</details>

<details>
  <summary>esbuild</summary>

### esbuild

**Definition:** Extremely fast JavaScript/CSS bundler and minifier written in Go. Used as the transpilation layer inside Vite and other tools.

**When to use:** Dev transpilation (via Vite), fast production minification, custom build scripts.

**Pluses and minuses:**

| + | − |
|------|------|
| 10–100× faster than Webpack/Babel | Limited plugin API |
| Built-in TS/JSX transform | No type checking (pair with `tsc`) |
| Built-in minification | Some edge-case incompatibilities |

**Examples:**

```js
// build.mjs
import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  sourcemap: true,
  target: 'es2020',
});
```

**Thoughts:** esbuild strips types but doesn't check them. Always run `tsc --noEmit` separately. For libraries, prefer Rollup for finer output control.

**Sources:** [esbuild.github.io](https://esbuild.github.io/)

</details>

<details>
  <summary>Vite</summary>

### Vite

**Definition:** Dev server using native ESM + esbuild pre-bundling; Rollup for production builds. Default toolchain for modern React/Vue/Svelte apps.

**When to use:** New SPAs, replacing CRA, library docs sites, any greenfield frontend.

**Pluses and minuses:**

| + | − |
|------|------|
| Instant cold start, fast HMR | Plugin ecosystem smaller than Webpack for exotic loaders |
| Sensible defaults | Legacy CJS-heavy deps may need `optimizeDeps` tuning |
| First-class TypeScript support | Different mental model from Webpack |

**Examples:**

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // required inside Docker
    port: 3000,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: { manualChunks: { vendor: ['react', 'react-dom'] } },
    },
  },
});
```

**Thoughts:**

- In Docker: `host: '0.0.0.0'` — binding `localhost` only listens inside the container.
- Path aliases: configure in both `vite.config.ts` (`resolve.alias`) and `tsconfig.json` (`paths`).
- CRA migration: remove `react-scripts`, add `vite`, `@vitejs/plugin-react`, move `index.html` to root.

**Sources:** [vite.dev](https://vite.dev/)

</details>

<details>
  <summary>Turbopack</summary>

### Turbopack

**Definition:** Rust-based incremental bundler built into Next.js (successor direction for Webpack in the Next ecosystem).

**When to use:** Next.js 15+ projects with `next dev --turbopack`. Not a Vite replacement for non-Next apps.

**Pluses and minuses:**

| + | − |
|------|------|
| Very fast dev builds in Next.js | Next.js-only (not a standalone app bundler) |
| Incremental computation | Still maturing vs Webpack feature parity |
| Integrated with Next dev server | Less relevant outside Next.js |

**Examples:**

```bash
next dev --turbopack
```

**Thoughts:** Turbopack ≠ Turborepo. Turborepo is a monorepo task orchestrator; Turbopack is a bundler. Use Turbopack for Next dev speed; use Turborepo for caching `build`/`test` across packages.

**Sources:** [nextjs.org — Turbopack](https://nextjs.org/docs/architecture/turbopack)

</details>

<details>
  <summary>Webpack vs Vite</summary>

### Webpack vs Vite

**Definition:**

Side-by-side comparison of the two most common frontend bundlers in production today.

| Aspect | Webpack | Vite |
|--------|---------|------|
| Dev server | Bundles entire app | Native ESM + on-demand |
| HMR speed | Slower on large apps | Near-instant |
| Production | Webpack | Rollup (via Vite) |
| Config | High | Low |
| Module Federation | Yes | Limited |

**How it works:** Legacy apps, Module Federation. **Vite:** New SPAs, CRA migration.

**Examples:**

```js
// Webpack
module.exports = {
  entry: './src/index.tsx',
  module: { rules: [{ test: /\.tsx?$/, use: 'ts-loader' }] },
};

// Vite
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()] });
```

**Sources:** [Vite — Why Vite](https://vite.dev/guide/why.html) · [Webpack concepts](https://webpack.js.org/concepts/)

</details>

<details>
  <summary>Bundler comparison</summary>

### Bundler comparison

| | Webpack | Rollup | esbuild | Vite | Turbopack |
|---|---------|--------|---------|------|-----------|
| **Best for** | Legacy apps, MF | Libraries | Scripts, speed | Modern SPAs | Next.js dev |
| **Dev HMR** | Slow | No | No | Fast | Fast |
| **Config** | High | Medium | Low | Low | None (Next) |
| **Ecosystem** | Largest | Medium | Growing | Large | Next-only |

---

**Sources:** [Vite — Why Vite](https://vite.dev/guide/why.html)

</details>

<details>
  <summary>Turborepo</summary>

### Turborepo

**Definition:** Build system for JavaScript monorepos — caches task outputs and runs `build`/`test`/`lint` in parallel across packages.

**When to use:** Monorepos with multiple apps/packages. Pair with pnpm workspaces.

**Pluses and minuses:**

| + | − |
|------|------|
| Remote caching speeds CI | Monorepo-specific |
| Simple `turbo.json` pipeline | Requires workspace setup |
| Works with Vite/Next per package | Not a bundler |

**Examples:**

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test": { "dependsOn": ["build"] }
  }
}
```

**Thoughts:** Turborepo ≠ Turbopack. Turborepo orchestrates tasks; Turbopack is Next.js's bundler.

**Sources:** [turbo.build](https://turbo.build/repo/docs)

</details>

<a name="code-quality"></a>

## Code quality

Why write tests and AAA: [7_special.md — Why write tests](./7_special.md#why-write-tests-aaa). Jest (`jest.config.js`, `npm test`, Node vs jsdom): [7_special.md — Jest](./7_special.md#jest--first-tests-node-vs-jsdom). Stubs/mocks/spies: [Test doubles](./7_special.md#test-doubles-stubs-mocks-spies). Wire `npm test` into CI: [GitHub Actions](#github-actions).

<details>
  <summary>Linter vs formatter</summary>

### Linter vs formatter

**Definition:**

| Tool | Purpose | Configurable? | Examples |
|------|---------|---------------|----------|
| **Formatter** | Visual layout (indent, quotes, line width) | Opinionated, minimal | Prettier, dprint |
| **Linter** | Logic errors, bad patterns, best practices | Highly configurable | ESLint, Biome |

**When to use:** Every project. Run formatter first, then linter. Disable ESLint formatting rules that conflict with Prettier via `eslint-config-prettier`.

**Pluses and minuses:**

| + (using both) | − |
|-------------------|------|
| Consistent style + fewer bugs | Rule overlap causes conflicts |
| Automatable in CI and pre-commit | Initial setup time |
| Onboarding — no style debates | False positives without tuning |

**Examples:**

```bash
# Typical pre-commit order
prettier --write .
eslint . --fix
```

**Thoughts:** Don't use ESLint for formatting — that's Prettier's job. Biome combines both but ecosystem is younger than ESLint + Prettier.

</details>

<details>
  <summary>ESLint</summary>

### ESLint

**Definition:** Pluggable static analysis tool for JavaScript/TypeScript. Enforces code quality rules and catches bugs before runtime.

**When to use:** All JS/TS projects. Extend framework presets (`eslint-config-next`, `@typescript-eslint`).

**Pluses and minuses:**

| + | − |
|------|------|
| Huge plugin ecosystem (React, import, a11y) | Configuration can be overwhelming |
| Autofix for many rules | False positives without rule tuning |
| Flat config (ESLint 9+) simplifies setup | Migration from `.eslintrc` ongoing |

**Examples:**

```js
// eslint.config.js (flat config, ESLint 9+)
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strict,
  reactHooks.configs['recommended-latest'],
  prettier,
  { rules: { 'no-console': 'warn' } },
);
```

**Thoughts:**

- Use `typescript-eslint` with `strict` or `recommended-type-checked` for maximum value.
- `eslint-plugin-import` catches wrong import paths; `eslint-plugin-jsx-a11y` for accessibility.
- Run in CI with `--max-warnings 0` once the codebase is clean.

**Sources:** [eslint.org](https://eslint.org/)

</details>

<details>
  <summary>Prettier</summary>

### Prettier

**Definition:** Opinionated code formatter. Enforces consistent style with zero configuration.

**When to use:** Every project. Pair with `eslint-config-prettier` to turn off conflicting ESLint style rules.

**Pluses and minuses:**

| + | − |
|------|------|
| Zero config, team-wide consistency | Cannot customize much (by design) |
| Supports JS, TS, CSS, HTML, JSON, MD | May format generated files (use `.prettierignore`) |
| Editor integration | Long lines in JSX can be ugly |

**Examples:**

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

```json
// package.json
{ "scripts": { "format": "prettier --write .", "format:check": "prettier --check ." } }
```

**Thoughts:** Add `format:check` to CI (don't write in CI). Use `.prettierignore` for `dist/`, `coverage/`, generated GraphQL types.

**Sources:**

[prettier.io](https://prettier.io/)

---

</details>

<a name="docker"></a>

## Docker

<details>
  <summary>Docker / containerization</summary>

### Docker / containerization

**Definition:** Platform that packages an app **with its environment** (OS bits, runtime, deps, config) into a **container** so it runs the same on any Docker host — “if it runs here, it runs anywhere.”

**How it works:**

- **Docker Engine** is a client–server stack: long-running daemon `dockerd` + **Engine API** + CLI `docker`. The machine running the daemon is the **Docker host**. CLI/Dashboard talk to the daemon via the API; the daemon creates images, containers, networks, volumes.
- **Docker Desktop** (Mac/Windows, optional on Linux) bundles Engine, CLI, Compose, Dashboard, Hub login. On Mac/Windows, Linux containers run inside a **Linux VM** — you do not run `dockerd` natively on the host kernel.
- `docker run` typically: pull image (if missing) → create container → attach a writable layer + network → start PID 1. Image ≈ class; container ≈ instance.
- Check install: `docker --version`. First tutorial image from current docs:

```bash
docker pull docker/welcome-to-docker
docker run --detach --name welcome --publish 8080:80 docker/welcome-to-docker
# then http://localhost:8080  —  docker rm --force welcome
```

**When to use:**

Server deploy; CI images; frontend — bundle/lint/test, asset pipelines, try a CMS/framework without installing Node/DB/nginx on the host, reproducible demos, editor + toolchains in a container.

#### Common pitfalls

Binding the app to `127.0.0.1` inside the container (host cannot reach it — listen on `0.0.0.0`). Treating `EXPOSE` as publish (`-p` still required). Letting stopped containers pile up (`docker ps -a`) until names collide.

**Pluses and minuses:**

| + | − |
|------|------|
| Same env on laptop, CI, prod | Networking, volumes, and Desktop VM have a learning curve |
| Seconds to start vs a full VM | Shared kernel — not a VM; native modules must match **container** arch |
| One process per container; Compose for stacks | Image bloat without multi-stage + `.dockerignore` |
| Recipe in git (Dockerfile) | Harder to debug than a local process |

**Examples:**

```bash
docker run --name some-wordpress -p 8080:80 -d wordpress
docker run --name some-drupal -p 8080:80 -d drupal
# bind-mount host folder, then run ImageMagick in the container:
docker run --rm -v "$PWD":/imgs dpokidov/imagemagick /imgs/in.png -resize 100x100 /imgs/out.png
```

**Thoughts:** Ship the **environment with the app**. Engine = daemon + API + CLI; image is the template, container is the running (or stopped) instance.

**Sources:** [Docker Engine](https://docs.docker.com/engine/) · [Overview](https://docs.docker.com/get-started/docker-overview/) · [Run an app](https://docs.docker.com/get-started/tutorials/run-an-app/)

</details>

<details>
  <summary>Container vs virtual machine</summary>

### Container vs virtual machine

| | Container | Virtual Machine |
|---|-----------|-----------------|
| **Isolation** | Process-level (shared kernel) | Full OS per VM |
| **Startup** | Seconds | Minutes |
| **Resource usage** | Lightweight | Heavy (full OS) |
| **Portability** | High (with arch match) | High |
| **Use case** | Microservices, CI | Legacy apps, diff OS |

**Sources:** [Docker — Containers](https://www.docker.com/resources/what-container/)

</details>

<details>
  <summary>Core concepts</summary>

### Core concepts

| Concept | Definition |
|---------|------------|
| **Image** | Read-only layered template (union of diffs). Built from Dockerfile or pulled from a registry. Layers are reused across images. |
| **Container** | Instance of an image: namespaces + cgroups + a **writable** top layer. Ephemeral by default. |
| **Volume** | Docker-managed persistent directory (not a [bind mount](#bind-mounts)). Survives `docker rm`. Details: [Volumes](#volumes). |
| **Network** | Virtual LAN between containers and/or the host. Compose creates a default user-defined bridge. |
| **Registry** | Remote image store. Default: **Docker Hub**. Also GHCR, ECR, GCR/Artifact Registry, ACR, Yandex CR, etc. Prefer **official** images (`node`, `python`, `nginx`). |
| **Dockerfile** | Recipe for an image (`FROM` then layers). |
| **Compose file** | YAML for a multi-container app. |

**Network drivers (Linux Engine):**

| Driver | Role |
|--------|------|
| **bridge** | Default. Isolated network; containers talk by IP (user-defined bridge: also by **name**). Typical app ↔ DB. |
| **host** | No network namespace — container shares the host’s network (Linux). |
| **none** | No networking. |
| **overlay** | Multi-host (Swarm). Also **ipvlan** / **macvlan** for physical-looking NICs. |

```mermaid
flowchart LR
  dockerfile[Dockerfile] -->|docker build| image[Image]
  registry[Registry] -->|docker pull| image
  image -->|docker run| container[Container]
  volume[Volume] <-->|mount| container
  net[Network] <--> container
```

**Thoughts:** Image layers stack (union FS); only the container’s top layer is writable. Persist data in volumes, wire services with a bridge network.

**Sources:** [Concepts](https://docs.docker.com/get-started/docker-concepts/) · [Networking](https://docs.docker.com/engine/network/)

</details>

<details>
  <summary>Dockerfile</summary>

### Dockerfile

**Definition:** A text file of sequential instructions that Docker Build uses as a recipe for an **image** — OS, runtime, files, env, and the process that starts when a container runs.

**How it works:**

- Format: `# comment` then `INSTRUCTION arguments` (instructions are case-insensitive; convention is UPPERCASE). Optional first line: `# syntax=docker/dockerfile:1` (BuildKit frontend).
- A Dockerfile must start with `FROM` (only global `ARG` / parser directives may precede it). Each `FROM` starts a **build stage**.
- The image is a **union of layers** (stacked diffs). `FROM`, `RUN`, `COPY`, and `ADD` create filesystem layers; other instructions mainly set metadata. Unchanged layers are reused from cache — put rarely changing steps first (`package*.json` + `npm ci` before `COPY . .`).
- Layers can be shared across images; Docker only pulls layers the host does not already have.
- **Context** is the set of files `COPY`/`ADD` can see (usually `.`). Exclude junk with `.dockerignore` so secrets and `node_modules` never enter the context.
- Build: `docker build [OPTIONS] PATH | URL | -`. Then `docker run` starts a **container** (writable layer + process) from the image.
- Official guidance: one concern per container, no unused packages, pin base tags, sort multi-line `RUN` args, use `.dockerignore`, multi-stage for prod, `--no-cache` / `--pull` when you need a clean rebuild (cache is for reuse, not for every layer forever).

`CMD ["node","app.js"]` (JSON array, double quotes) is PID 1 and gets `SIGTERM`. Shell form `CMD node app.js` runs via `/bin/sh -c`, so the shell is PID 1 and the app may miss stop signals.

Treat the image as a binary → `ENTRYPOINT` (exec) + `CMD` as default args. Treat it as a generic box with a default process → `CMD` only (easy to override). `docker run image sh` replaces `CMD`, not exec-form `ENTRYPOINT`.

```dockerfile
ENTRYPOINT ["yaspeller"]
CMD ["."]
# docker run --rm yaspeller README.md  → yaspeller README.md
```

#### Build, extra Dockerfiles, ignore file

```bash
docker build .                              # context = cwd, file = Dockerfile
docker build -t user/app:2.0 .              # name:tag (repo on Hub is user/app)
docker build -f containers/Dockerfile.dev .
docker build -t myapp --build-arg user=deploy .
docker build -f- . < Dockerfile             # Dockerfile from stdin; context still PATH
docker build - < Dockerfile                 # no context — COPY from context fails
# Git / tar URL as context (gzip, bzip2, xz archives):
docker build -f ctx/Dockerfile http://server/ctx.tar.gz
docker image inspect myapp --format '{{.Size}}'
docker history myapp                        # layers; ARG values may show here
```

`.dockerignore` lives at the **context root** (gitignore-like). Typical Node ignore: `node_modules/`, `dist/`, `.git`, `.env`. With `-f myapp.Dockerfile`, BuildKit also checks `myapp.Dockerfile.dockerignore` next to that file, then falls back to `.dockerignore`.

#### Multi-stage

Builder stage has compilers/`npm`; final stage copies only artifacts. Intermediate stages are not in the shipped image.

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**When to use:**

Reproducible Node/nginx images; CI artifacts; CLI tools packaged as `ENTRYPOINT`; multi-stage SPA (build in Node, serve with nginx).

#### Instructions

| Instruction | Role |
|-------------|------|
| `FROM` | Base image / new stage. Pin a tag (`node:20-alpine`), not bare `node` (`latest`). `AS name` for multi-stage. |
| `RUN` | Shell command **at build time** — install packages, compile. Chain with `&&` in one `RUN` to cut layers. |
| `COPY` | Copy from **build context** into the image. Prefer this. `COPY --from=stage` copies from another stage/image. |
| `ADD` | Like `COPY`, plus remote URLs and auto-extract of local archives — easy to misuse; avoid unless you need that. |
| `WORKDIR` | Working directory for later `RUN`/`COPY`/`CMD`/`ENTRYPOINT`. Created if missing. |
| `ENV` | Env vars in the **image** (available at runtime and later build steps). |
| `ARG` | **Build-time** vars (`docker build --build-arg KEY=val`). Not in the running container unless you copy into `ENV`. Visible in `docker history` — not for secrets. |
| `USER` | UID/GID for later `RUN`/`CMD`/`ENTRYPOINT`. Create the user first; official `node` image already has `USER node`. |
| `EXPOSE` | **Documents** the listen port. Does **not** publish to the host. Publish with `docker run -p host:container` or Compose `ports`. `-P` maps all `EXPOSE`d ports to random host ports. |
| `VOLUME` | Declares a mount point (anonymous volume unless you mount something at run). Host path is **not** set in the Dockerfile — [Volumes](#volumes). |
| `CMD` | Default command. Overridden by args after `docker run IMAGE …`. Only the last `CMD` counts. |
| `ENTRYPOINT` | Main executable. `docker run` args are **appended** (exec form). Use with `CMD` for default flags. |
| `HEALTHCHECK` | How the daemon probes liveness (`CMD` inside the container). |
| `LABEL` | Image metadata. `STOPSIGNAL` / `SHELL` — stop signal and default shell. |

#### Common pitfalls

- `EXPOSE 8080` ≠ `http://localhost:8080` — you still need `-p 8080:8080` (and the app must listen on `0.0.0.0`).
- `sudo` in `RUN` — official bases already run as root; `sudo` often is not installed.
- `USER alice` without creating `alice` → build/run fails.
- Baking passwords into `ENV`/`ARG`; use runtime env, Compose secrets, or BuildKit `--secret`, not `docker history`-visible args.
- `COPY . .` without `.dockerignore` (sends `.git`, `node_modules`, `.env`).
- Shell-form `ENTRYPOINT` ignoring `CMD` and `docker run` args; app not PID 1 → `docker stop` waits then `SIGKILL`.
- Unpinned `FROM node` and unnecessary packages (editors in a runtime image).

**Pluses and minuses:**

| + | − |
|------|------|
| Same runtime on laptop and server | Bad layer order → slow rebuilds |
| Cache + multi-stage keep images small | `latest` tags and huge context bloat CI |
| Recipe is versioned with the app | Secrets in `ARG`/`ENV` leak into image history |

**Examples:**

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "app.js"]
```

**Thoughts:** Dockerfile = layered recipe; keep containers **stateless** (data in volumes), one concern per image, slim final stage.

**Sources:** [Dockerfile reference](https://docs.docker.com/reference/dockerfile/) · [Best practices](https://docs.docker.com/build/building/best-practices/) · [Build context](https://docs.docker.com/build/concepts/context/)

</details>

<details>
  <summary>Container lifecycle</summary>

### Container lifecycle

**Definition:** A container is a **running or stopped instance** of an image: namespaces + cgroups + a writable layer. The image stays read-only; PID 1 is usually `ENTRYPOINT` + `CMD`.

**How it works:**

Interview sequence: create → start (running) → optional pause/unpause → stop or kill → restart or remove.

```mermaid
flowchart LR
  image[Image]
  created[Created]
  running[Running]
  paused[Paused]
  stopped[Stopped / Exited]
  gone[Removed]
  image -->|create| created
  image -->|run = create + start| running
  created -->|start| running
  running -->|pause| paused
  paused -->|unpause| running
  running -->|stop SIGTERM then SIGKILL| stopped
  running -->|kill SIGKILL| stopped
  stopped -->|start| running
  running -->|restart = stop + start| running
  stopped -->|rm| gone
  running -->|rm -f| gone
```

| Command | Effect |
|---------|--------|
| `docker create` | Allocate from an image; not running |
| `docker start` | Start a created or exited container |
| `docker run` | `create` + `start` (often `--rm` to delete on exit) |
| `docker pause` / `unpause` | Freeze / resume (cgroup freezer) |
| `docker stop` | `SIGTERM` (or `STOPSIGNAL`), then `SIGKILL` after timeout |
| `docker kill` | Immediate signal (`SIGKILL` by default) |
| `docker restart` | Stop then start |
| `docker rm` | Delete a **stopped** container (`-f` kills then removes) |

Restart policies (`--restart` / Compose `restart:`): `no` (default), `on-failure[:n]`, `always`, `unless-stopped`. Manual `stop` suppresses `always` until you start again. Exited containers stay in `docker ps -a` — a name conflict means an old stopped container still exists.

**When to use:**

Interview “describe the lifecycle”; K8s `SIGTERM` + Node graceful shutdown — [8_nodejs.md — SIGTERM](./8_nodejs.md#graceful-shutdown--sigterm).

#### Common pitfalls

`rm` on a running container without `-f` fails; `pause` ≠ `stop` (process still exists); `docker compose down` keeps named volumes unless `-v`.

**Thoughts:** Image is immutable; the writable layer and process are ephemeral — persist with volumes.

**Sources:** [Running containers](https://docs.docker.com/get-started/docker-concepts/running-containers/) · [docker container CLI](https://docs.docker.com/reference/cli/docker/container/) · [Restart policies](https://docs.docker.com/engine/containers/start-containers-automatically/)

</details>

<details>
  <summary>Docker storage mounts</summary>

### Docker storage mounts

**Definition:** Files written only on the **writable container layer** disappear when that container is removed. A **mount** still looks like a path inside the container, but the bytes live elsewhere.

**How it works:**

| Type | Where data lives | Survives `docker rm`? | Typical use |
|------|------------------|----------------------|-------------|
| **[Volume](#volumes)** | Docker-managed dir (or a volume driver) | Yes, until `volume rm` / `prune` | Databases, shared app data |
| **[Bind mount](#bind-mounts)** | Any host path you choose | Yes (host filesystem) | Dev source, host config |
| **[tmpfs](#tmpfs-and-named-pipes)** | Host RAM (Linux) | No | Secrets, scratch, hot cache |
| **Named pipe** | Windows npipe | IPC / session | Docker Engine API from a Windows container |
| **Image mount** | Another image, read-only (containerd image store) | N/A | Extra tools/assets without rebuilding |

From the app’s view every type is just a directory or file. Overlay rule: mounting onto a **non-empty** container path **hides** the image files there (USB into `/mnt`). Exception: an **empty named volume** is **pre-filled** from the image (unless `volume-nocopy`).

**When to use:**

Persist Postgres; live-reload `./src`; keep credentials off the writable layer.

#### Common pitfalls

Calling a bind mount a “volume”; storing prod data only in the writable layer; expecting macOS/Windows binds to be as fast as Linux volumes (Desktop uses a Linux VM).

**Pluses and minuses:**

| + | − |
| - | - |
| Same path API inside the container | Different overlay, security, and portability rules per type |
| Volumes do not bloat the image | Writable layer is slow and hard to extract |

**Thoughts:** Persist with **volumes**; edit host files with **bind mounts**; keep ephemeral/sensitive scratch in **tmpfs**.

**Sources:** [Docker — Storage](https://docs.docker.com/engine/storage/)

</details>

<details>
  <summary>Bind mounts</summary>

### Bind mounts

**Definition:** A **bind mount** maps a host file or directory into a container. Host processes and the container see the same files; Docker does **not** manage that path (`docker volume ls` will not list it).

**How it works:**

- Prefer `--mount type=bind,src=…,dst=…`. `-v host:container` is shorter.
- `-v`: missing host path is **created as a directory**. `--mount` **errors** unless `bind-create-src`.
- Bind onto a non-empty container path → image files at that path are **hidden** until you recreate without the mount.
- Bind propagation (Linux Engine, not Desktop): default `rprivate`; also `private` / `shared` / `slave` and recursive `r*`.
- SELinux `z` (shared among containers) and `Z` (private) exist only on `-v`. Never use `Z` on `/usr` or `/home`.
- The path is on the **daemon** host. Desktop proxies native paths into the Linux VM.

**When to use:**

Share source / build artifacts; Docker’s own DNS via host `/etc/resolv.conf`; write generated files onto the host.

#### Common pitfalls

Binding over `/usr` and breaking the image; `Z` on `/home`; Windows vs Unix paths; expecting `--mount` to auto-create the host dir.

**Pluses and minuses:**

| + | − |
| - | - |
| Instant host ↔ container edits | Host layout must exist; not portable |
| Simple local DX | Container can mutate host files (`ro` / `readonly` to prevent) |
| | Slow / missing FS events on Docker Desktop |

**Examples:**

```bash
docker run -d -it --name devtest \
  --mount type=bind,source="$(pwd)"/target,target=/app \
  node:lts

docker run -d -it --name devtest -v "$(pwd)"/target:/app node:lts

docker run --mount type=bind,src="$(pwd)"/target,dst=/app,readonly node:lts
```

```json
"Mounts": [{
  "Type": "bind",
  "Source": "/tmp/source/target",
  "Destination": "/app",
  "RW": true,
  "Propagation": "rprivate"
}]
```

```yaml
services:
  frontend:
    image: node:lts
    volumes:
      - type: bind
        source: ./static
        target: /opt/app/static
```

**Thoughts:** A bind mount is a **host path glued into the container** — right for local source, risky for prod data.

**Sources:** [Docker — Bind mounts](https://docs.docker.com/engine/storage/bind-mounts/)

</details>

<details>
  <summary>Volumes</summary>

### Volumes

**Definition:** **Volumes** are Docker-managed storage. Data lives under the daemon (Linux: `/var/lib/docker/volumes/<name>/_data`) or on a **volume driver**. Editing that host folder by hand is unsupported.

**How it works:**

- **Named** (`my-vol`) vs **anonymous** (Docker IDs them). Named volumes survive `docker run --rm`; anonymous volumes are removed with `--rm`.
- Independent of containers: `docker rm` does not delete a volume. Use `docker volume rm` / `prune`.
- Prefer `--mount type=volume`. `-v my-vol:/app` works. `:ro` / `readonly` for read-only. Propagation is always `rprivate`.
- **Empty** named volume on a path with image files → files are **copied into the volume** (`volume-nocopy` disables). **Non-empty** volume → **hides** image files.
- Dockerfile `VOLUME` only declares a mount point — you cannot set a host path there. Writes **after** `VOLUME` during build: discarded on the **legacy** builder; **kept with BuildKit**.
- Compose top-level `volumes:` creates/attaches named volumes; `external: true` = already exists.

Plugins or `local` + kernel mount options (NFS, CIFS). Driver options require `--mount`, not `-v`. Quote CSV-like `volume-opt` values.

```bash
docker service create -d --name nfs-service \
  --mount 'type=volume,source=nfsvolume,target=/app,volume-driver=local,volume-opt=type=nfs,volume-opt=device=:/var/docker-nfs,volume-opt=o=addr=10.0.0.10' \
  nginx:latest
```

**Backup / restore** (`--volumes-from` reuses another container’s volumes):

```bash
docker run -v /dbdata --name dbstore ubuntu /bin/bash
docker run --rm --volumes-from dbstore -v "$(pwd)":/backup ubuntu tar cvf /backup/backup.tar /dbdata

docker run -v /dbdata --name dbstore2 ubuntu /bin/bash
docker run --rm --volumes-from dbstore2 -v "$(pwd)":/backup ubuntu \
  bash -c "cd /dbdata && tar xvf /backup/backup.tar --strip 1"
```

**When to use:**

DB data; share one dataset across containers; backup/migrate; high I/O on Docker Desktop (volume on the Linux VM); native Linux FS semantics for databases.

#### Common pitfalls

`compose down -v` deletes named volumes; anonymous volumes from image `VOLUME`; expecting Finder/Explorer UX; `RUN` after `VOLUME` on the legacy builder.

**Pluses and minuses:**

| + | − |
| - | - |
| CLI/API; Linux + Windows containers | Awkward to browse from the host |
| Drivers: NFS, remote, extra processing | Unused volumes pile up until `prune` |
| Empty volume can be pre-filled from the image | Not for live-editing a host source tree |

**Examples:**

```bash
docker volume create my-vol
docker run -d --name devtest --mount source=my-vol,target=/app node:lts
# docker run -d --name devtest -v my-vol:/app node:lts

docker volume ls
docker volume inspect my-vol
docker container stop devtest && docker container rm devtest
docker volume rm my-vol

docker run --rm -v /foo -v awesome:/bar busybox top  # anonymous /foo dies; awesome stays
docker volume prune
```

Dockerfile (seed **before** `VOLUME` if you still use the legacy builder):

```dockerfile
FROM node:lts
RUN mkdir /data && echo seed > /data/x
VOLUME /data
```

Compose:

```yaml
services:
  frontend:
    image: node:lts
    volumes:
      - myapp:/home/node/app
volumes:
  myapp:
  # myapp:
  #   external: true
```

**Thoughts:** Volumes are the **default production persistence** — Docker owns the bytes; containers only mount a path.

**Sources:** [Docker — Volumes](https://docs.docker.com/engine/storage/volumes/) · [Dockerfile `VOLUME`](https://docs.docker.com/reference/dockerfile/#volume)

</details>

<details>
  <summary>tmpfs and named pipes</summary>

### tmpfs and named pipes

**Definition:** **tmpfs** is an in-memory filesystem on **Linux**. **Named pipes (npipe)** are a Windows IPC mount (often the Docker Engine API). Neither is durable disk storage.

**How it works:**

- tmpfs is **not** shared between containers. Data is gone when the container stops. The kernel may still **swap** tmpfs to disk.
- Usage counts toward the container **memory** limit. A large `tmpfs-size` does not add RAM.
- `--mount type=tmpfs,destination=/app` with `tmpfs-size` (bytes; default cap ~50% of host RAM) and `tmpfs-mode` (octal, default `1777`).
- `--tmpfs /app` is shorter (`size=64m`, `mode=1777`, `noexec`, …). Swarm services need `--mount`.
- Overlay: tmpfs on a non-empty container path **hides** image files.

**When to use:** Keys/certs in memory; lots of non-persistent writes without the writable layer.

**Pluses and minuses:**

| + | − |
| - | - |
| Fast; nothing left on disk by design | Linux only; one container; can OOM |
| Better than baking secrets into the image | Can still hit swap |

**Examples:**

```bash
docker run -d -it --name tmptest \
  --mount type=tmpfs,destination=/app \
  node:lts

docker run -d -it --name tmptest --tmpfs /app node:lts
```

**Thoughts:** tmpfs = **RAM scratch for one Linux container**, not a backup target.

**Sources:** [Docker — tmpfs](https://docs.docker.com/engine/storage/tmpfs/) · [Storage — named pipes](https://docs.docker.com/engine/storage/#named-pipes)

</details>

<details>
  <summary>Docker Compose</summary>

### Docker Compose

**Definition:** Tool for defining and running a **multi-container application** from one YAML file (`compose.yaml`) and the `docker compose` CLI — one service per container, started together as a project.

**How it works:**

- Docker’s recommended model: **one service = one container** (web, DB, cache, reverse proxy). Easier to debug, update, scale, and monitor than stuffing PHP + Nginx + MySQL into a single image.
- A **project** is one deployment of that file. Compose prefixes resources with the project name (`name:` or the directory name) so two stacks can share a machine.
- Compose creates a **default network** unless you declare `networks`. Service names are DNS hostnames (`db`, `api`).
- Prefer `compose.yaml` / `compose.yml` in the project root. `docker-compose.yaml` / `.yml` still work; if both exist, `compose.yaml` wins.
- Docker Desktop (Mac/Windows) ships Compose. Linux: install Compose v2 with Engine. Use **`docker compose`** (v2, Docker CLI plugin). Hyphenated `docker-compose` is the old v1 Python tool.
- Top-level **`version`** is **obsolete** (warning only). Compose always validates against the current Compose Specification schema.
- Other top-level keys: **`services`** (required), **`networks`**, **`volumes`**, **`configs`** (non-secret runtime files, no rebuild), **`secrets`** (sensitive files mounted into containers), **`name`**, **`include`**.

```yaml
services:
  frontend:
    image: example/webapp
    build: ./webapp          # context; Dockerfile in that folder

  backend:
    image: example/database
    build:
      context: backend
      dockerfile: ../backend.Dockerfile
      args:
        GIT_COMMIT: cdc3b19   # Dockerfile ARG
```

```bash
docker compose build --build-arg GIT_COMMIT=cdc3b19
```

**Keep a container alive** (debug / wait): override `command`, not the image build:

```yaml
services:
  debug:
    build: .
    env_file: ./.env
    command: /bin/sh -c "while sleep 1000; do :; done"
```

`mode` (`replicated` / `global` / jobs), `replicas`, `resources.limits` / `reservations`, placement, rolling `update_config`. These describe **platform** deployment (Swarm `docker stack deploy`). Compose on a single engine does **not** spawn six replicas just because `deploy.replicas: 6` is in the file. Scale locally with `docker compose up --scale frontend=6`.

**Resources** are a **hard cap** (`limits`) vs a **guarantee** (`reservations`) — they do **not** add up to a “peak”:

```yaml
deploy:
  resources:
    limits:
      cpus: "0.50"   # at most 0.5 CPU
      memory: 50M
    reservations:
      cpus: "0.25"   # scheduler should keep 0.25 CPU available
      memory: 20M
```

#### Networks

Isolate tiers: frontend on `front-tier` + `back-tier`; database only on `back-tier`. Empty `networks:` entries create project-scoped bridges. `external: true` attaches an existing Docker network.

```yaml
services:
  frontend:
    image: example/webapp
    networks: [front-tier, back-tier]
  backend:
    image: example/database
    networks: [back-tier]

networks:
  front-tier: {}
  back-tier: {}
```

#### Volumes

Named volumes (top-level `volumes:`) persist across `down` (until `down -v`). Bind mounts (`./frontend:/usr/src/app`) sync host code for dev. Anonymous volume e.g. `/usr/src/app/node_modules` hides the host’s `node_modules` so the image’s Linux modules win. Types and overlay rules: [Docker storage mounts](#docker-storage-mounts).

**MERN-style local stack** (bind mounts + two networks):

```yaml
services:
  frontend:
    build: frontend
    ports: ["3000:3000"]
    stdin_open: true
    volumes:
      - ./frontend:/usr/src/app
      - /usr/src/app/node_modules
    restart: always
    networks: [react-express]
    depends_on: [backend]

  backend:
    build: backend
    restart: always
    volumes:
      - ./backend:/usr/src/app
      - /usr/src/app/node_modules
    depends_on: [mongo]
    networks: [express-mongo, react-express]

  mongo:
    image: mongo:7
    restart: always
    volumes:
      - ./data:/data/db
    networks: [express-mongo]

networks:
  react-express:
  express-mongo:
```

**When to use:**

Local full stack (app + DB + Redis), integration tests, small VPS / staging. Production at scale → Kubernetes (or Swarm `docker stack deploy` for `deploy.*` replica/placement semantics). Samples: [Awesome Compose](https://github.com/docker/awesome-compose).

#### Common pitfalls

- `docker-compose` (v1) vs `docker compose` (v2).
- Putting `version: "3.9"` thinking it selects a schema — it is ignored.
- Assuming `deploy.replicas` scales `docker compose up`.
- `depends_on` without `healthcheck` / `condition: service_healthy` — app starts before MySQL accepts connections.
- Binding DB data as a host folder on Docker Desktop can be slower/permission-awkward vs a named volume.

**Pluses and minuses:**

| + | − |
|------|------|
| One command for the whole stack | Not a cluster scheduler; no auto-scale like K8s |
| Declarative, git-friendly YAML | `depends_on` waits for **start**, not “ready” (use healthchecks) |
| DNS by service name; named volumes persist | `deploy.replicas` is Swarm/stack; local Compose uses `--scale` |

**Examples:**

```yaml
# compose.yaml
services:
  db:
    image: mysql:8.0
    restart: always
    volumes:
      - db_data:/var/lib/mysql
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
      MYSQL_ROOT_PASSWORD: somewordpress

  wordpress:
    image: wordpress:latest
    restart: always
    ports:
      - "8000:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    depends_on:
      - db

volumes:
  db_data:
```

```bash
docker compose up -d          # pull/build, create nets/volumes, start
# site: http://localhost:8000
docker compose down            # stop + remove containers and networks
docker compose down -v         # also remove named volumes (DB data gone)
```

```yaml
services:
  api:
    build:
      context: ./services/api
      dockerfile: Dockerfile.local
    ports:
      - "${HOST_API_PORT:-4000}:4000"
    environment:
      DATABASE_URL: postgres://postgres:secret@database:5432/app
    env_file:
      - ./services/api/.env
    volumes:
      - ./services/api/src:/app/src
    depends_on:
      - database

  database:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app
    ports:
      - "${HOST_DB_PORT:-5555}:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
```

#### Services

Each key under `services` is an atomic unit: `image` and/or `build`, `ports`, `environment` / `env_file`, `volumes`, `networks`, `command` (overrides image `CMD` at **runtime**), `restart`, `depends_on`.

**Thoughts:** Compose is the YAML + CLI for a whole app: services on networks, data in volumes, one `up` / `down`.

**Sources:** [Compose application model](https://docs.docker.com/compose/intro/compose-application-model/) · [Compose file](https://docs.docker.com/reference/compose-file/) · [Deploy spec](https://docs.docker.com/reference/compose-file/deploy/)

</details>

<details>
  <summary>Docker troubleshooting</summary>

### Docker troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Can't reach app on `localhost:3000` | Dev server binds `127.0.0.1` inside container | Vite: `server.host: '0.0.0.0'` |
| File changes not detected (HMR) | FS events don't propagate through bind mounts | `CHOKIDAR_USEPOLLING=true` in environment |
| nodemon not restarting | Same FS event issue | `"dev": "nodemon -L index.js"` |
| `bcrypt_lib.node: Exec format error` | Native module built for host arch, not container | Rebuild inside container: `npm rebuild bcrypt` or `npm ci` in Dockerfile |
| Port conflict | Host port already in use | Use `HOST_DB_PORT` / `CONTAINER_DB_PORT` env vars |
| CRA not hot-reloading in Docker | Chokidar issue on Docker Desktop | `CHOKIDAR_USEPOLLING=true` |

**Example — Vite in Docker:**

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      CHOKIDAR_USEPOLLING: "true"
    volumes:
      - ./src:/app/src
```

```ts
// vite.config.ts
export default defineConfig({
  server: { host: '0.0.0.0', port: 3000, watch: { usePolling: true } },
});
```

**Thoughts:** On macOS/Windows Docker Desktop, bind-mount performance is slow — use delegated/consistent flags or sync tools (Mutagen). On Linux, native mounts are fast.

</details>
<details>
  <summary>Docker CLI reference</summary>

### Essential Docker commands

Names must be unique per object type; unnamed objects get a generated name. `ls` / `rm` / `prune` work the same idea across `image`, `container`, `volume`.

**Monitor:**

```bash
docker ps                         # running
docker ps -a                      # running + stopped
docker ps -s                      # size
docker ps -f name=hello           # filter
```

**Run:**

```bash
docker run --name test -it hello                  # stdin + TTY
docker run --rm -p 3000:3000 --name app myimage
docker run -it --mount type=bind,src=/data,dst=/data hello bash
docker stop <id> && docker rm <id>
docker logs -f <id>
docker exec -it <id> sh
docker container start|restart|stop|pause <id>
```

**Images:**

```bash
docker build -t myapp:latest .              # Dockerfile in cwd
docker build -f Dockerfile.dev -t myapp:dev .
docker build --no-cache --pull -t myapp .   # fresh base + no layer cache
docker image ls
docker image pull hello
docker image push user/hello
docker image inspect hello        # image JSON (not the container)
docker image rm hello
docker image prune                # unused
```

**Volumes:** (notes: [Volumes](#volumes))

```bash
docker volume ls
docker volume ls -f name=hello
docker volume create hello
docker volume inspect hello
docker volume rm hello
docker volume prune
```

**Compose:**

```bash
docker compose up -d
docker compose up -d --build
docker compose stop
docker compose down          # stop + remove containers/networks
docker compose down -v       # also remove volumes
docker compose logs -f <service>
docker compose exec <service> sh
```

**Cleanup:**

```bash
docker system prune -a       # remove unused containers, networks, images
```

**Useful patterns:**

```bash
# Rebuild and restart one service
docker compose stop api && docker compose up -d --build api

# Logs for service by name
docker compose logs -f api

# Port mapping
docker run -p HOST:CONTAINER myimage   # e.g. -p 5555:5432
```

**Sources:** [Docker CLI](https://docs.docker.com/reference/cli/docker/)

</details>

<details>
  <summary>Orchestration (brief)</summary>

### Orchestration (brief)

| Tool | Purpose |
|------|---------|
| **Docker Compose** | Local / small multi-container apps |
| **Docker Swarm** | Built-in Docker clustering (declining adoption) |
| **Kubernetes** | Production container orchestration at scale |

**Thoughts:** Kubernetes is not part of Docker. Use Compose for dev; K8s (or managed: EKS, GKE, ECS) for production scale, rolling deploys, and self-healing.

---

**Sources:** [Kubernetes docs](https://kubernetes.io/docs/concepts/overview/)

</details>

<a name="architecture"></a>

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

**Thoughts:** `try_files ... /index.html` is required for client-side routing SPAs. In production, terminate TLS at Nginx or a cloud load balancer, not in Node. What a web server is (HTTP, modules, gzip) → [6_web_api.md — Web server](./6_web_api.md#web-server). Full config / `reload` vs `restart` / FastCGI → [15_devops.md — Nginx configuration](./15_devops.md#nginx-configuration). Apache (`.htaccess`, `Require`) → [15_devops.md — Apache](./15_devops.md#apache-http-server).

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

## Questions & Answers

<details>
  <summary>What is CI/CD?</summary>

### What is CI/CD?

**Definition:** **Continuous Integration / Continuous Delivery** — automate build, test, and publish so each change can be integrated and shipped with a short feedback loop. **Continuous Deployment** auto-ships to production after CI. Full notes: [What is CI/CD](#what-is-cicd).

**How it works:** Git event → pipeline (lint/test/build) → artifact → staging → gated or automatic prod. Wider loop also includes operate and plan. Clarify “CD” as delivery vs deployment.

**Sources:** [GitHub Actions — Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)

</details>

<details>
  <summary>CI vs CD vs Continuous Delivery?</summary>

### CI vs CD vs Continuous Delivery?

**Definition:**

**CI** — automated build + test on each change. **Continuous Delivery** — deployable artifact, manual prod gate. **Continuous Deployment** — auto-deploy to prod.

| Model | Deployment |
|-------|------------|
| CI | None |
| Continuous Delivery | Manual / approval |
| Continuous Deployment | Automatic |

**Sources:** [ByteByteGo — CI/CD](https://blog.bytebytego.com/p/a-crash-course-in-cicd)

</details>

<details>
  <summary>YAML vs JSON?</summary>

### YAML vs JSON?

**Definition:** JSON is the wire/API format; YAML is the human-edited config format (CI, Compose, K8s). Full notes: [YAML](#yaml).

**How it works:** YAML adds comments, optional quotes, indentation instead of `{}`/`[]`, and anchors. Indent with spaces (never tabs). `<<: *anchor` merge is YAML 1.1 — still common in CI.

**Sources:** [YAML 1.2.2 spec](https://yaml.org/spec/1.2.2/)

</details>

<details>
  <summary>Webpack vs Vite?</summary>

### Webpack vs Vite?

**Definition:** Webpack bundles the entire app — flexible but slow HMR. Vite serves native ESM in dev and Rollup for prod — faster DX.

**Sources:** [vite.dev](https://vite.dev/) · [webpack.js.org](https://webpack.js.org/)

</details>

<details>
  <summary>dev vs prod build?</summary>

### dev vs prod build?

**Definition:**

Dev optimizes feedback speed; prod optimizes size, caching, and runtime.

| Dev | Prod |
|-----|------|
| HMR, fast rebuild | Minify, tree-shake |
| Inline source maps | Hashed filenames |
| No minification | Code splitting |

**Sources:** [Vite — Building for production](https://vite.dev/guide/build.html)

</details>

<details>
  <summary>What is tree shaking?</summary>

### What is tree shaking?

**Definition:** Dead-code elimination — bundler removes unused ES module exports.

**Sources:** [Webpack — Tree shaking](https://webpack.js.org/guides/tree-shaking/)

</details>

<details>
  <summary>Docker image layers?</summary>

### Docker image layers?

**Definition:** Filesystem layers come from `FROM`, `RUN`, `COPY`, and `ADD`. Copy `package*.json` before source for cache hits. Multi-stage builds produce slim runtime images. Full notes: [Dockerfile](#dockerfile).

**Sources:** [Dockerfile reference](https://docs.docker.com/reference/dockerfile/) · [Best practices](https://docs.docker.com/build/building/best-practices/)

</details>

<details>
  <summary>CMD vs ENTRYPOINT?</summary>

### CMD vs ENTRYPOINT?

**Definition:** `ENTRYPOINT` is the image’s main executable; `CMD` is the default args (or the default command if there is no `ENTRYPOINT`). Full notes: [Dockerfile](#dockerfile).

**How it works:** Exec form JSON arrays. `docker run image extra` **replaces** `CMD` and **appends** to exec-form `ENTRYPOINT`. Shell-form `ENTRYPOINT` ignores extra args and often is not PID 1.

**Thoughts:** CLI-tool image → `ENTRYPOINT` + overridable `CMD`. App with an easy override → `CMD` only.

</details>

<details>
  <summary>Docker container lifecycle?</summary>

### Docker container lifecycle?

**Definition:** Create → start (running) → optional pause → stop (`SIGTERM` then `SIGKILL`) → remove. `docker run` = create + start. Full notes: [Container lifecycle](#container-lifecycle).

**Thoughts:** Stopped containers still occupy a name until `docker rm` / `--rm`.

</details>

<details>
  <summary>Volumes vs bind mounts vs tmpfs?</summary>

### Volumes vs bind mounts vs tmpfs?

**Definition:** Three ways to keep data **off** the writable layer. **Volume** = Docker-managed, portable, best default. **Bind mount** = host path, for local source/config. **tmpfs** = RAM, Linux, dies with the container.

**How it works:** Empty named volume ← copy image files in; bind/tmpfs ← **hide** files at that path. Full notes: [Docker storage mounts](#docker-storage-mounts).

**Thoughts:** Prod data → volumes. Laptop source → bind. Secrets/scratch → tmpfs.

**Sources:** [Docker — Storage](https://docs.docker.com/engine/storage/)

</details>

<details>
  <summary>Docker Compose?</summary>

### Docker Compose?

**Definition:** YAML (`compose.yaml`) + `docker compose up` / `down` for a multi-container app. One service ≈ one container; default project network; named volumes persist. Full notes: [Docker Compose](#docker-compose).

**How it works:** `services` required; `version` obsolete. Service names are DNS. `depends_on` ≠ ready. Local scale: `--scale`, not Swarm `deploy.replicas`.

**Thoughts:** One file, one project — not Kubernetes.

</details>

<details>
  <summary>package-lock.json purpose?</summary>

### package-lock.json purpose?

**Definition:** Lockfile with exact dependency tree for reproducible installs. Use `npm ci` in CI, `npm install` in local dev.

**Sources:** [npm — package-lock.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json)

</details>

---

### Tasks

### Task 1 — Minimal GitHub Actions CI

<details><summary>Solution</summary>

```yaml
name: CI
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci && npm test && npm run build
```

</details>

### Task 2 — Multi-stage Dockerfile for Node app

<details><summary>Solution</summary>

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```

</details>

---

<details>
  <summary>Junior — Front-end (build)</summary>

### Junior — Front-end (build)

51. What is webpack?

52. How does a dev build differ from a production build?

133. What is `package-lock.json` for?

134. What is the difference between `npm install` and `npm ci`?

135. What are bundlers used for?

</details>

<details>
  <summary>Middle — Front-end (build)</summary>

### Middle — Front-end (build)

136. Describe modular script loading and bundler loaders.

See also (git, not build): [0_git.md — Interview Practice](0_git.md#interview-practice) — merge vs rebase, staging area, code review.

</details>

</details>
