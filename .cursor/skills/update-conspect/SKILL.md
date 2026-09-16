---
name: update-conspect
description: >
  Apply from the user prompt only (not from an open file). Use when they ask to add, edit, sync,
  correct, or structure conspect/study notes, interview notes, a <details> block, Related docs,
  or a topic in HTML/CSS/JS/React/Web API markdown. Do not apply for Q&A with no request to change notes.
disable-model-invocation: false
---

# Update conspect

## When to use

- The **prompt** asks to add, edit, sync, or correct notes — even if no `.md` file is open.
- Do **not** attach because a file is open in the editor.
- Do **not** attach for a definition question with no edit.

Keep numbered topic files in `resources/` (`resources/[0-9]*_*.md`) accurate and cross-linked. Follow `.cursor/rules/study-notes-structure.mdc` for block shape. Skip `resources/0_me.md`. File lookup: [files.md](files.md). The handbook app at the repo root reads only `resources/*.md` — do not mix React into notes.

## Find files (required)

1. Open [files.md](files.md) — map the topic to 1–3 filenames from the table. Do not glob-list the repo.
2. Grep those files first (`<summary>`, concept, aliases). Widen to `resources/*_*.md` only if there are no hits.
3. Then follow **Read strategy**.

## Read strategy (required)

Topic files are huge. Never slurp a whole note.

1. Grep first (`<summary>`, concept name, aliases).
2. Read ~40 lines from the top (Related docs + Main concepts + Sections).
3. Read only the hit `<details>` block (use line offsets from grep).
4. Edit with smallest unique replacements.

## Workflow

1. **Verify facts** per `.cursor/rules/resources-official-docs.mdc`: Context7 (`resolve-library-id` then `query-docs`) for the concept **and related APIs**. Ref.tools for signatures. Web search only if those lack coverage. Put canonical URLs in **Sources:**.
2. **Choose the canonical file** from [files.md](files.md) and the ownership table below. Do not create a new topic file unless the split rules in `.cursor/rules/study-notes-structure.mdc` say so (one file = one topic; concepts stay `<details>`).
3. **Find siblings** — grep, then read headers + matching blocks only.
4. **Edit canonical** — one full `<details>` block matching the sample in `.cursor/rules/study-notes-structure.mdc` (same as `/instructions`): **Definition:** required; then optional **How it works:** → **When to use:** → **Pluses and minuses:** → **Examples:** → **Thoughts:** → **Sources:**. Align examples with fetched docs.
5. **Patch pointers** — in other hits, replace duplicated essays with 2–4 lines + a link to the canonical heading. Fix contradictions; do not copy the full block.
6. **Cross-links** — add or fix `### Related docs` in both files when overlap is real.
7. **Local TOC** — if you added/renamed/removed a heading, update that file’s Main concepts table and Sections list.
8. **Stop** — do not rewrite unrelated sections; edit `resources/*.md` notes only (not the Next.js app unless asked).

## Canonical ownership (defaults)

| Concept area | Canonical file |
|--------------|----------------|
| Document structure, semantics, elements | `resources/1_html_structure.md` |
| HTML forms | `resources/1_html_forms.md` |
| HTML media | `resources/1_html_media.md` |
| Browser rendering pipeline | `resources/1_html_rendering.md` |
| HTML performance / CLS | `resources/1_html_performance.md` |
| HTML accessibility | `resources/1_html_a11y.md` |
| HTML SEO | `resources/1_html_seo.md` |
| Web components / advanced HTML | `resources/1_html_advanced.md` |
| HTML hub / index only | `resources/1_html.md` |
| CSS cascade, selectors, box model | `resources/2_css_core.md` |
| Flexbox, grid, responsive | `resources/2_css_layout.md` |
| CSS visual / motion / modern | `resources/2_css_visual.md` / `_motion.md` / `_modern.md` |
| CSS architecture & performance | `resources/2_css_architecture.md` |
| CSS hub / index only | `resources/2_css.md` |
| JS language, types, runtime (not DOM) | `resources/3_js_core.md` |
| JS arrays, `map`/`filter`/`reduce` | `resources/3_js_array.md` |
| JS functions, `this`, HOF, bind | `resources/3_js_functions.md` |
| Prototypes, classes (JS) | `resources/3_js_oop.md` |
| DOM, BOM, document APIs | `resources/3_js_browser.md` |
| Browser events, delegation, CustomEvent | `resources/3_js_events.md` |
| Browser storage, CORS, observers, History, URL, files, rAF | `resources/3_js_browser_extra.md` |
| Promises, fetch, event loop | `resources/3_js_async.md` |
| JS hub / index only | `resources/3_js.md` (links, no duplicate essays) |
| React core (JSX, state, rendering) | `resources/4_react_core.md` |
| React hooks | `resources/4_react_hooks.md` |
| RSC / React 19 server | `resources/4_react_server.md` |
| React ecosystem | `resources/4_react_ecosystem.md` |
| React hub / index only | `resources/4_react.md` |
| Next.js App Router / rendering | `resources/4_nextjs_core.md` |
| Next.js data / cache / actions | `resources/4_nextjs_data.md` |
| TypeScript basics / narrowing / functions | `resources/5_ts_core.md` / `_narrowing.md` / `_functions.md` |
| HTTP | `resources/6_web_api_http.md` |
| REST / RPC | `resources/6_web_api_rest.md` |
| OOP/SOLID extras | `resources/7_special_engineering.md` |
| Web attacks | `resources/7_special_security.md` |
| Algorithms hub | `resources/7_special_algorithms.md` |
| Big O, complexity | `resources/7_special_algorithms_core.md` |
| Common algorithms | `resources/7_special_algorithms_common.md` |
| Algorithm interview patterns | `resources/7_special_algorithms_patterns.md` |
| Data structures (algorithms) | `resources/7_special_algorithms_data.md` |
| Node.js runtime | `resources/8_nodejs_core.md` |
| Express / NestJS | `resources/8_nodejs_http.md` |
| SQL / PostgreSQL | `resources/9_database_sql.md` |
| ORM | `resources/9_database_orm.md` |
| Bundlers | `resources/10_build_bundlers.md` |
| Docker | `resources/10_build_docker.md` |
| VS Code / DevTools | `resources/11_vsc_browser.md` |
| Git fundamentals | `resources/0_git_core.md` |
| System design foundations | `resources/0_system_design_foundations.md` |
| DevOps / OTel | `resources/15_devops.md` |

If two files both need depth (e.g. script loading in HTML vs JS), keep **one** full block and a short complementary angle in the other, linked both ways.

Hubs (`resources/0_interview.md`, `resources/3_js.md`, `resources/1_html.md`, and the other `*_*.md` hubs) stay as indexes — update links, not second copies of theory.

## Source URL audit

`npm run check-conspect` lists `url-dead` / `url-warn` / `unverified`. It does not edit notes. After an audit, patch only the flagged blocks with this skill. See `.cursor/skills/check-conspect/SKILL.md`.

## Done when

- Canonical block matches verified docs
- Grep hits are either updated or explicitly out of scope
- Related docs links are bidirectional where they should be
