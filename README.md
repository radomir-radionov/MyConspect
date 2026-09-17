# MyConspect

Browse-only study handbook. Conspect markdown lives in local `resources/` (not in this GitHub repo) and is turned into static pages at build time. Edit notes there; the Next.js app stays at the repo root. GitHub Actions / Vercel Git deploys need those files on the machine that builds.

Live site: [https://myconspect.vercel.app](https://myconspect.vercel.app).

Useful study links: [roadmap.sh](https://roadmap.sh/), [StackBlitz](https://stackblitz.com/), [GitNation](https://portal.gitnation.org/). Extra intro notes from the old Core README are in `resources/0_intro.md` (not published).

## Routes

- `/` — tracks (Frontend, Backend, Other, System design, Algorithms, AI)
- `/frontend` — topic cards
- `/frontend/html` — HTML subject hub (Core / Browser / Additional cards)
- `/frontend/html-structure` — one accordion page (`<details>` / `<summary>`)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## E2E (sidebar)

Cypress checks real sidebar clicks (cluster open/close, hash, scroll). Production server on port 3456:

```bash
npm run build
npm run test:e2e
```

Interactive:

```bash
npm run build
npm run start:e2e
npm run cypress:open
```

## Content

Topic files are `resources/*_*.md`. The public catalog is `lib/catalog`. Files in `resources/` that are not listed there (personal notes, link hubs) are not published.

How to split: **track** → optional **subject** (HTML, CSS, JavaScript, React, …) → **cluster** (Core / Browser / Additional, or subject-specific names) → **topic** (one markdown file / one page) → **concept** (one `<details>` accordion). Rules and examples: `/instructions`.

Set `NEXT_PUBLIC_SITE_URL` (no trailing slash) for absolute sitemap and robots URLs in production. On Vercel, production URL is inferred when that env is unset.

## CI/CD

GitHub Actions:

- `.github/workflows/ci.yml` — `npm ci`, lint, production build, and Cypress sidebar E2E (Chrome) on push and pull requests to `main`

Production and preview deploys run automatically through the [Vercel GitHub integration](https://vercel.com/docs/git/vercel-for-github): push to `main` ships production; pull requests get preview URLs. Install the [Vercel GitHub App](https://github.com/apps/vercel) on `radomir-radionov/MyConspect` if the project is not already connected.
