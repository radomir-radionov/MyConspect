# Cursor — Rules

Persistent system-level instructions for Agent. Shorter than skills; scoped always, by file globs, by relevance, or by `@mention`.

### Related docs

* [AI workflow](./0_ai.md) · [Skills](./0_ai_cursor_skills.md) · [Plugins](./0_ai_cursor_plugins.md) · [Slash commands](./0_ai_cursor_slash.md) · [Questions](./0_ai_cursor_questions.md)

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

**Definition:** A **rule** is persistent system-level guidance injected into Agent’s context so the model keeps the same constraints across chats (LLMs do not remember between completions). Cursor has **four** places rules come from: **Project Rules**, **User Rules**, **Team Rules**, and plain **AGENTS.md**. Rules are shorter than [skills](./0_ai_cursor_skills.md); skills are multi-step playbooks, rules are ongoing constraints and conventions.

**How it works:**

- When a rule applies, its contents are included at the **start** of the model context for that Agent turn.
- Rules apply to **Agent (Chat) only** — not Cursor Tab, Inline Edit (Cmd/Ctrl+K), or Bugbot PR reviews.
- All applicable sources are **merged**; on conflict, earlier wins: **Team → Project → User** (see [Precedence](#precedence)). `AGENTS.md` sits alongside project guidance as a simple instruction file.

| Source | Where | Scope | Shape |
| --- | --- | --- | --- |
| **Project Rules** | `.cursor/rules/*.mdc` (git) | This repo / package | Frontmatter: `alwaysApply`, `description`, `globs` — see [Apply modes](#apply-modes) |
| **User Rules** | Customize → Rules (account sync); optional local `~/.cursor/rules` (machine-only, no sync) | All your projects | Free-form preferences (tone, personal conventions) |
| **Team Rules** | Cursor team dashboard | Org-wide (Team / Enterprise) | Free-form text; optional globs; can be **enforced** so members cannot disable |
| **AGENTS.md** | Project root and/or nested dirs | That directory tree | Plain markdown, **no** frontmatter; nested files combine with parents (more specific wins) |

**When to use:**

| Choose… | When… |
| --- | --- |
| **Project Rules** (`.mdc`) | Codebase conventions the whole team should share; need globs, always-on, intelligent, or `@mention` apply modes. |
| **User Rules** | Personal tone (“be concise”), private habits across every repo — not team policy. |
| **Team Rules** | Org standards / compliance baselines that must follow people across repos; use **Enforce** when optional toggle is not enough. |
| **AGENTS.md** | Simple readable instructions without frontmatter overhead; nested package notes. Prefer `.mdc` when you need apply modes. |

**Common pitfalls:** Putting a plain `.md` in `.cursor/rules/` (ignored — must be `.mdc`); expecting User Rules to affect Tab / Cmd+K; stuffing multi-step deploy checklists into rules instead of a [skill](./0_ai_cursor_skills.md); duplicating linter style guides into always-on rules.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Persistent guidance without re-pasting prompts. | Only Agent Chat — Tab / Inline Edit ignore rules. |
| Four layers: personal, project, org, simple markdown. | Too many always-on rules waste context. |
| Project `.mdc` + Team Rules are shareable / enforceable. | Wrong source (User for team policy) → inconsistent teammates. |

**Examples:**

User Rule (Customize → Rules):

```md
Please reply in a concise style. Avoid unnecessary repetition or filler language.
```

Project Rule (`.cursor/rules/typescript.mdc`) — always apply:

```md
---
alwaysApply: true
---

- Use TypeScript for all new files
- Prefer named exports over default exports
```

AGENTS.md (project root or nested folder):

```markdown
# Project Instructions

## Code Style
- Prefer functional components in React
- Use snake_case for database columns

## Architecture
- Follow the repository pattern
- Keep business logic in service layers
```

Create a project rule from chat: `/create-rule`, or Customize → Rules → Add Rule. For Team Rules detail see [Team Rules](#team-rules); for `.mdc` layout see [Project rules](#project-rules-mdc).

**Thoughts:** Pick the **narrowest** source that fits — personal tone in User, repo conventions in Project, org policy in Team, “just a markdown file” in AGENTS.md. If Agent repeats the same mistake, add or tighten a rule; if the job is a checklist, use a skill.

**Sources:** [Rules](https://cursor.com/docs/rules) · [Rules help](https://cursor.com/help/customization/rules) · [How rules work](https://cursor.com/docs/rules#how-rules-work)

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

Q&A moved to [Cursor — Questions](./0_ai_cursor_questions.md).