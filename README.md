# MyConspect

Browse-only study handbook. Conspect markdown lives in `resources/en` and `resources/ru` (same basenames — see `.cursor/rules/locale-sync.mdc`) and is turned into static pages at build time. Edit notes there; the Next.js app stays at the repo root. On the **public** GitHub repo, `resources/` is gitignored; Vercel and CI clone it from a **private** notes repo at build time (`scripts/ensure-resources.ts`).

Live site: [https://myconspect.vercel.app](https://myconspect.vercel.app).

Useful study links: [roadmap.sh](https://roadmap.sh/), [StackBlitz](https://stackblitz.com/), [GitNation](https://portal.gitnation.org/). Extra intro notes from the old Core README are in `resources/en/0_intro.md`.

## Routes

- `/` → redirects to `/en`
- `/en`, `/ru` — tracks (Frontend, Backend, Other, System design, Algorithms, AI)
- `/en/frontend` — topic cards
- `/en/frontend/html` — HTML subject hub (Core / Browser / Additional cards)
- `/en/frontend/html-structure` — one accordion page (`<details>` / `<summary>`)
- Language switcher keeps the same path under the other locale

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

Topic files are `resources/en/*_*.md` and `resources/ru/*_*.md` (same basenames). The public catalog is `lib/catalog`. Files not listed there (personal notes, link hubs) are not published. Locale sync rules: `.cursor/rules/locale-sync.mdc`.

How to split: **track** → optional **subject** (HTML, CSS, JavaScript, React, …) → **cluster** (Core / Browser / Additional, or subject-specific names) → **topic** (one markdown file / one page) → **concept** (one `<details>` accordion). Rules and examples: `/instructions`.

Set `NEXT_PUBLIC_SITE_URL` (no trailing slash) for absolute sitemap and robots URLs in production. On Vercel, production URL is inferred when that env is unset.

## CI/CD

### Study notes on deploy (public app repo + private notes repo)

1. Create a **private** Git repository whose tree is either `en/` + `ru/` at the root, or `resources/en/` + `resources/ru/` (same layout as this project).
2. Push your local `resources/` content there (one-time mirror; update that repo when you change notes).
3. Set these **environment variables** on [Vercel](https://vercel.com/docs/projects/environment-variables) (Production + Preview) and as [GitHub Actions secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) on the public repo:

| Variable              | Required             | Purpose                                                             |
| --------------------- | -------------------- | ------------------------------------------------------------------- |
| `RESOURCES_GIT_URL`   | Yes                  | HTTPS clone URL, e.g. `https://github.com/you/myconspect-notes.git` |
| `RESOURCES_GIT_TOKEN` | Yes for private repo | PAT or fine-grained token with read access to the notes repo        |
| `RESOURCES_GIT_REF`   | No                   | Branch or tag (default `main`)                                      |

`prebuild` / `predev` run `tsx scripts/ensure-resources.ts`: if `resources/en/` already has markdown (your machine), nothing is downloaded; otherwise the script shallow-clones the notes repo.

GitHub Actions:

- `.github/workflows/ci.yml` — `npm ci`, lint, tests, `check-order`, production build, and Cypress sidebar E2E (Chrome) on push and PRs to `main` / `dev` (needs the secrets above)
- `.github/workflows/check-conspect.yml` — scheduled source URL audit (same secrets)

Production and preview deploys run automatically through the [Vercel GitHub integration](https://vercel.com/docs/git/vercel-for-github): push to `main` ships production; pull requests get preview URLs. Install the [Vercel GitHub App](https://github.com/apps/vercel) on `radomir-radionov/MyConspect` if the project is not already connected.
