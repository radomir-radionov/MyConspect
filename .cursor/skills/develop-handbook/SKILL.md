---
name: develop-handbook
description: >
  Develop or extend the MyConspect Next.js study handbook: parse resources/*.md at build
  time, App Router SSG, track/topic card routes, native details accordion pages,
  generateStaticParams, generateMetadata, sitemap, and Tailwind cards. Use when changing
  the handbook app, catalog, markdown parser, SEO, or routes.
disable-model-invocation: false
---

# Develop handbook

## When to use

The user is changing this app (routes, parser, catalog, UI, SEO), not Core conspect notes in another repo.

## Layout

- Content: `resources/*_*.md` only (`process.cwd()/resources`)
- Catalog: `lib/content/catalog.ts` (tracks + public topics)
- Parser: `lib/content/parse.ts` (top-level `<details>`, plus `##`/`###` blocks with **Definition:**)
- Load: `lib/content/load.ts`
- Routes: `app/page.tsx`, `app/[track]/page.tsx`, `app/[track]/[topic]/page.tsx`
- SEO: `generateMetadata`, `app/sitemap.ts`, `app/robots.ts`

## Product rules

- Browse-only. No progress, quiz, auth, localStorage, SRS
- Topic page is **one** accordion. Nested `<details>` in the body stay nested
- Do not fetch concept HTML on click
- Do not invent per-concept routes
- Do not rewrite `resources/` notes unless asked

## Parser

1. Rewrite `./3_js_core.md#hash` links to handbook hrefs via `hrefForFile`
2. Extract top-level `<details>` (track nesting so inner Code details stay in the body)
3. Keep a block if it has **Definition:** / **How it works:** / **Key idea:** (skip link-dump summaries)
4. Also parse leftover `##`/`###` headings with those markers (some HTML notes are not wrapped)
5. Render with `marked` + `sanitize-html` (allow `details`, `summary`, tables, `id` on anchors)
6. `id` on each outer accordion from `slugify(title)`

## Adding a topic

1. Copy the `*_*.md` file into `resources/`
2. Add a `Topic` row in `catalog.ts` (`slug`, `file`, `title`, `blurb`, `track`)
3. Run `npm run build` — `generateStaticParams` picks it up

## UI

- Card grids for tracks and topics (`components/CardGrid.tsx`)
- Simple typography; readable `pre`/`code` in `app/globals.css`
- English copy

## Verify

```bash
npm run dev
npm run build
```
