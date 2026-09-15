# MyConspect

Public, browse-only Next.js study handbook at the **repo root**. Markdown study notes (conspect) live in **`resources/`**. Do not mix React into those notes. The handbook reads **only** `resources/*.md`.

## Conspect notes (`resources/`)

Study-note **format and sync** follow `.cursor/rules/study-notes-structure.mdc` and `.cursor/skills/update-conspect/SKILL.md` **only when the user prompt asks to add, edit, or sync conspect notes** — not merely because a `.md` file is open. Verify facts via Context7 before writing.

Topic files are numbered `resources/*_*.md`. File lookup: `.cursor/skills/update-conspect/files.md`.

## Handbook app (repo root)

Handbook work follows `.cursor/rules/handbook-app.mdc` and `.cursor/skills/develop-handbook/SKILL.md`. Do not add progress, quiz, auth, or per-concept URLs.

When using shell tools in this repo, follow RTK rules for token-efficient output.

@RTK.md

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
