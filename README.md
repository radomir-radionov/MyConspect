# MyConspect

Browse-only study handbook. Conspect markdown lives in `resources/` and is turned into static pages at build time. Edit notes there; the Next.js app stays at the repo root.

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

## Content

Topic files are `resources/*_*.md`. The public catalog is `lib/catalog`. Files in `resources/` that are not listed there (personal notes, link hubs) are not published.

How to split: **track** → optional **subject** (HTML, CSS, JavaScript, React, …) → **cluster** (Core / Browser / Additional, or subject-specific names) → **topic** (one markdown file / one page) → **concept** (one `<details>` accordion). Rules and examples: `/instructions`.

Set `NEXT_PUBLIC_SITE_URL` (no trailing slash) for absolute sitemap and robots URLs in production. On Vercel, production URL is inferred when that env is unset.

## CI/CD

GitHub Actions:

- `.github/workflows/ci.yml` — `npm ci`, lint, and production build on push and pull requests to `main`
- `.github/workflows/deploy.yml` — preview deploys on pull requests, production deploys on push to `main`

Add these repository secrets before the deploy workflow can run:

| Secret | Value |
| --- | --- |
| `VERCEL_TOKEN` | [Vercel access token](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Team id from the Vercel project settings (or `.vercel/project.json` `orgId`) |
| `VERCEL_PROJECT_ID` | Project id from `.vercel/project.json` after `vercel link` |

Install the [Vercel GitHub App](https://github.com/apps/vercel) on `radomir-radionov/MyConspect` if you want dashboard Git-push deploys. Do not enable both Git integration production deploys and this Actions deploy on the same project, or every push will ship twice.
