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

1. **Verify facts** with Context7 (`resolve-library-id` then `query-docs`). Use Ref.tools for narrow APIs. Web search only if those lack coverage.
2. **Choose the canonical file** from [files.md](files.md) and the ownership table below.
3. **Find siblings** — grep, then read headers + matching blocks only.
4. **Edit canonical** — one full `<details>` block matching the sample in `.cursor/rules/study-notes-structure.mdc` (same as `/instructions`): **Definition:** required; then optional **How it works:** → **When to use:** → **Pluses and minuses:** → **Examples:** → **Thoughts:** → **Sources:**. Align examples with fetched docs.
5. **Patch pointers** — in other hits, replace duplicated essays with 2–4 lines + a link to the canonical heading. Fix contradictions; do not copy the full block.
6. **Cross-links** — add or fix `### Related docs` in both files when overlap is real.
7. **Local TOC** — if you added/renamed/removed a heading, update that file’s Main concepts table and Sections list.
8. **Stop** — do not rewrite unrelated sections; edit `resources/*.md` notes only (not the Next.js app unless asked).

## Canonical ownership (defaults)

| Concept area | Canonical file |
|--------------|----------------|
| Document structure, semantics, forms, a11y HTML | `resources/1_html.md` |
| Selectors, layout, cascade, CSS APIs | `resources/2_css.md` |
| JS language, types, runtime (not DOM) | `resources/3_js_core.md` |
| Prototypes, classes (JS) | `resources/3_js_oop.md` |
| DOM, BOM, events, browser storage | `resources/3_js_browser.md` |
| Promises, fetch, event loop | `resources/3_js_async.md` |
| JS hub / index only | `resources/3_js.md` (links, no duplicate essays) |
| React | `resources/4_react.md` |
| Next.js | `resources/4_nextjs.md` |
| TypeScript | `resources/5_ts.md` |
| HTTP, browser Web APIs, PWA | `resources/6_web_api.md` |
| OOP/SOLID extras, web attacks | `resources/7_special.md` |
| Node.js | `resources/8_nodejs.md` |
| Databases | `resources/9_database.md` |
| Bundlers, CI build | `resources/10_build.md` |
| VS Code / DevTools | `resources/11_vsc_browser.md` |
| Git | `resources/0_git.md` |
| System design | `resources/0_system_design.md` |
| DevOps / OTel | `resources/15_devops.md` |

If two files both need depth (e.g. script loading in HTML vs JS), keep **one** full block and a short complementary angle in the other, linked both ways.

Hubs (`resources/0_interview.md`, `resources/0_mvp.md`, `resources/3_js.md`) stay as indexes — update links, not second copies of theory.

## Source URL audit

`npm run check-conspect` lists `url-dead` / `url-warn` / `unverified`. It does not edit notes. After an audit, patch only the flagged blocks with this skill. See `.cursor/skills/check-conspect/SKILL.md`.

## Done when

- Canonical block matches verified docs
- Grep hits are either updated or explicitly out of scope
- Related docs links are bidirectional where they should be
