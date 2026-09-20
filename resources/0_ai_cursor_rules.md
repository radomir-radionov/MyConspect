# Cursor — Rules

Persistent system-level instructions for Agent. Shorter than skills; scoped always, by file globs, by relevance, or by `@mention`.

### Related docs

* [AI workflow](./0_ai.md) · [Skills](./0_ai_cursor_skills.md) · [Plugins](./0_ai_cursor_plugins.md) · [Slash commands](./0_ai_cursor_slash.md)

### Main concepts

| Area | Topics |
|------|--------|
| **Types** | [Four rule sources](#four-rule-sources), [Apply modes](#apply-modes) |
| **Files** | [Project rules (.mdc)](#project-rules-mdc), [AGENTS.md](#agentsmd) |
| **Team** | [Team Rules](#team-rules), [Precedence](#precedence) |

### Sections

- [Four rule sources](#four-rule-sources)
- [Apply modes](#apply-modes)
- [Project rules (.mdc)](#project-rules-mdc)
- [AGENTS.md](#agentsmd)
- [Team Rules](#team-rules)
- [Precedence](#precedence)
- [Interview Practice](#interview-practice)

---

## Four rule sources

<details>
<summary>Four rule sources</summary>

**Definition:** Cursor has four places rules come from: **Project Rules**, **User Rules**, **Team Rules**, and plain **AGENTS.md**.

**How it works:**

| Source | Where | Notes |
| --- | --- | --- |
| Project Rules | `.cursor/rules/*.mdc` | Version-controlled with the repo |
| User Rules | Customize → Rules | Global; Agent chat only (not Tab / Cmd+K) |
| Team Rules | Cursor dashboard | Team / Enterprise; can be enforced |
| AGENTS.md | Project root or nested dirs | Plain markdown, no frontmatter |

**When to use:** Project `.mdc` for codebase conventions. User Rules for personal tone. AGENTS.md when you want one simple instruction file. Team Rules for org-wide standards.

**Thoughts:** Rules do **not** apply to Cursor Tab or Inline Edit (Cmd/Ctrl+K) — only Agent (Chat).

**Sources:** [Rules](https://cursor.com/docs/rules)

</details>

## Apply modes

<details>
<summary>Apply modes</summary>

**Definition:** Each project rule uses frontmatter (`alwaysApply`, `description`, `globs`) to decide when it is injected into the model context.

**How it works:**

| UI type | Frontmatter behavior |
| --- | --- |
| Always Apply | `alwaysApply: true` — every chat; globs/description ignored |
| Apply to Specific Files | `alwaysApply: false` + `globs` — when a matching file is in context |
| Apply Intelligently | `alwaysApply: false` + `description`, no globs — Agent picks by relevance |
| Apply Manually | `alwaysApply: false`, no description, no globs — only via `@rule-name` |

**When to use:** Always for hard safety (“never commit secrets”). Globs for React/API folders. Intelligent for occasional domain tips. Manual for rare checklists.

**Examples:**

```md
---
globs: src/components/**/*.tsx
alwaysApply: false
---

- Use named exports, not default exports
- Keep components under 200 lines
```

**Sources:** [Rule anatomy](https://cursor.com/docs/rules#rule-anatomy)

</details>

## Project rules (.mdc)

<details>
<summary>Project rules (.mdc)</summary>

**Definition:** Project rules are `.mdc` files under `.cursor/rules` with YAML frontmatter plus markdown body. Plain `.md` in that folder is **ignored** (no frontmatter).

**How it works:**

- Name freely; nest in folders (e.g. `.cursor/rules/frontend/components.mdc`).
- Keep under ~500 lines; split large topics into composable rules.
- Reference files with `@filename.ts` instead of pasting whole guides.
- Create via `/create-rule` or Customize → Rules → Add Rule.

**When to use:** Encode domain knowledge, style decisions, and workflows the whole team should share. Skip dumping entire style guides — use a linter.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Checked into git; consistent Agent behavior. | Over-broad always-on rules waste context. |
| Globs keep guidance local to a folder. | Wrong extension (`.md`) silently does nothing. |

**Sources:** [Project rules](https://cursor.com/docs/rules#project-rules)

</details>

## AGENTS.md

<details>
<summary>AGENTS.md</summary>

**Definition:** `AGENTS.md` is a plain markdown file of agent instructions — a simple alternative to structured `.cursor/rules`.

**How it works:**

- Place in the project root and/or nested directories.
- Nested files apply when working under that directory; more specific nested instructions take precedence over parents.
- No frontmatter / apply modes — always treated as instruction text for that scope.

**When to use:** Small projects or package-level notes. Prefer `.mdc` rules when you need globs, always-apply, or intelligent apply.

**Examples:**

```markdown
# Project Instructions

## Code Style
- Use TypeScript for all new files
- Prefer functional components in React
```

**Sources:** [AGENTS.md](https://cursor.com/docs/rules#agentsmd)

</details>

## Team Rules

<details>
<summary>Team Rules</summary>

**Definition:** Team and Enterprise plans manage org-wide rules from the Cursor dashboard; admins can enforce them so members cannot disable them.

**How it works:**

- Free-form text (not the `.cursor/rules` folder layout).
- Optional globs for file-scoped team rules.
- Draft vs enabled; **Enforce** locks the rule on for everyone.
- Import from a GitHub repo only via a **plugin** marketplace (rules alone are not imported).

**When to use:** Company coding standards and compliance baselines. Do not treat AI rules as the only security control.

**Sources:** [Team Rules](https://cursor.com/docs/rules#team-rules)

</details>

## Precedence

<details>
<summary>Precedence</summary>

**Definition:** When guidance conflicts, Cursor merges applicable rules with this order: **Team Rules → Project Rules → User Rules** (earlier wins).

**How it works:**

- All matching rules are included; Team overrides Project overrides User on conflict.
- User Rules never reach Inline Edit / Tab.

**Thoughts:** Put irreversible safety in Team or always-apply Project rules; keep personal tone in User Rules.

**Sources:** [Team Rules — precedence](https://cursor.com/docs/rules#format-and-how-team-rules-are-applied)

</details>

## Interview Practice

**Q: Why is my `.cursor/rules/foo.md` ignored?**

Project rules must be `.mdc` with frontmatter. Use `AGENTS.md` for plain markdown, or rename to `.mdc` and add `description` / `globs` / `alwaysApply`.

**Q: Do User Rules affect Tab completion?**

No. User Rules apply to Agent (Chat) only — not Tab or Cmd/Ctrl+K.
