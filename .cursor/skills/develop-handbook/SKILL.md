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

The user is changing this app (routes, parser, catalog, UI, SEO), not the conspect notes in `resources/` (unless they also asked to edit notes).

## Layout

- Content: `resources/*_*.md` only (`process.cwd()/resources`)
- Catalog: `lib/catalog` + `components/catalog` (tracks, topics, card grids)
- Parse: `lib/parse` (load files, split concepts, slots, highlight)
- Nav: `lib/nav` + `components/nav` (chrome copy, sidebar, handbook shell)
- Search: `components/search` (query context and hit highlighting)
- Topic: `components/topic` (accordion list, slot labels)
- Audit: `lib/audit` + `scripts/audit.ts` (`**Source:**` URL checks)
- Routes: `/` tracks → `/[track]` topic cards → `/[track]/[topic]` (subject hubs share `[topic]`)
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

Split only when a new **study unit** is needed (see `/instructions` and `.cursor/rules/study-notes-structure.mdc`). One file = one sidebar topic = one accordion page. Do not add per-concept routes.

1. Copy the `*_*.md` file into `resources/`
2. Add a `Topic` row in `lib/catalog` (`slug`, `file`, `title`, `blurb`, `track`). For grouped subjects (HTML, CSS, JavaScript, React, …), set `grouping: { subject, cluster }`
3. Run `npm run build` — `generateStaticParams` picks it up

## UI

- Docs shell: sticky header + track-grouped topic sidebar (`components/nav`). Subjects (HTML, CSS, JavaScript, React, …) nest Core / other clusters
- Topic search lists only matching topics in the sidebar. Tracks and topic concept lists stay collapsed until opened. Search opens the found accordion in the main pane and restores the previous page when cleared
- Card grids for tracks and topics (`components/catalog`)
- Topic accordion UI (`components/topic`)
- Simple typography; fenced code uses Shiki (VS Code `light-plus`) in `lib/parse/highlight.ts`
- English UI chrome and sidebar search in `lib/nav`; study notes stay in `resources/`

## Verify

```bash
npm run dev
npm run build
```
