# MyConspect

Browse-only study handbook. Notes are copied into `resources/` and turned into static pages at build time.

## Routes

- `/` — tracks (Frontend, Backend, Other)
- `/frontend` — topic cards
- `/frontend/html` — one accordion page (`<details>` / `<summary>`)

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

Topic files are `resources/*_*.md`. The public catalog is `lib/content/catalog.ts`. Files in `resources/` that are not listed there (personal notes, link hubs) are not published.

Set `NEXT_PUBLIC_SITE_URL` (no trailing slash) for absolute sitemap and robots URLs in production. On Vercel, production URL is inferred when that env is unset.
