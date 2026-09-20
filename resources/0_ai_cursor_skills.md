# Cursor — Skills

Reusable multi-step workflows that teach Agent how to handle a specific task. More detailed than rules; invoked with `/` or applied automatically when relevant.

### Related docs

* [AI workflow](./0_ai.md) · [Rules](./0_ai_cursor_rules.md) · [Plugins](./0_ai_cursor_plugins.md) · [Slash commands](./0_ai_cursor_slash.md)

### Main concepts

| Area | Topics |
|------|--------|
| **Basics** | [What are skills](#what-are-skills), [Directories](#skill-directories), [SKILL.md](#skillmd-format) |
| **Control** | [Automatic vs slash](#automatic-vs-slash-invocation), [paths scoping](#scoping-with-paths), [Custom Mode](#custom-mode) |
| **Ops** | [Built-in skills](#built-in-skills), [Migrate from rules/commands](#migrate-to-skills) |

### Sections

- [What are skills](#what-are-skills)
- [Skill directories](#skill-directories)
- [SKILL.md format](#skillmd-format)
- [Automatic vs slash invocation](#automatic-vs-slash-invocation)
- [Scoping with paths](#scoping-with-paths)
- [Custom Mode](#custom-mode)
- [Built-in skills](#built-in-skills)
- [Migrate to skills](#migrate-to-skills)
- [Interview Practice](#interview-practice)

---

## What are skills

<details>
<summary>What are skills</summary>

**Definition:** A **skill** is a portable, version-controlled package (`SKILL.md` plus optional scripts/references) that teaches Agent how to perform a domain-specific, multi-step task.

**How it works:**

- On startup, Cursor discovers skills from known directories and shows them to Agent.
- Agent decides when a skill is relevant from its `description`, or you invoke it with `/skill-name`.
- Skills can ship scripts, templates, and reference docs that Agent loads on demand (progressive context).

**When to use:** Repeatable workflows (deploy, review, conspect update). Prefer a short **rule** for style constraints; prefer a **skill** when Agent needs a procedure.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Shareable, versioned playbooks. | Bad `description` → never auto-applied. |
| Optional scripts and references. | Long skills burn context if always attached. |

**Thoughts:** Rules = “always / when matching files.” Skills = “how to do this job.”

**Sources:** [Agent Skills](https://cursor.com/docs/skills.md) · [Skills help](https://cursor.com/help/customization/skills)

</details>

## Skill directories

<details>
<summary>Skill directories</summary>

**Definition:** Cursor loads skills from project and user folders; each skill is a directory that contains `SKILL.md`.

**How it works:**

| Location | Scope |
| --- | --- |
| `.agents/skills/` | Project |
| `.cursor/skills/` | Project |
| `~/.agents/skills/` | User (local machine) |
| `~/.cursor/skills/` | User (local; can sync to Cloud Agents) |

- Also discovers Claude/Codex dirs: `.claude/skills/`, `.codex/skills/`, and the `~/` variants.
- Nested category folders are fine (e.g. `.cursor/skills/shipping/land-it/SKILL.md`); the skill name is the folder that holds `SKILL.md`.
- Skills under a nested package (e.g. `apps/web/.cursor/skills/`) are scoped to files in that package.

**When to use:** Put team workflows in `.cursor/skills/` (commit them). Put personal habits in `~/.cursor/skills/`.

**Sources:** [Skill directories](https://cursor.com/docs/skills.md#skill-directories)

</details>

## SKILL.md format

<details>
<summary>SKILL.md format</summary>

**Definition:** Every skill is a `SKILL.md` file with YAML frontmatter (`name`, `description`) and markdown instructions.

**How it works:**

- Required: `name` (kebab-case, must match parent folder), `description` (used for auto-relevance).
- Optional: `paths` (glob scope), `disable-model-invocation` (slash-only), `icon` / `color` (Custom Mode badge), `metadata`.
- Optional dirs next to `SKILL.md`: `scripts/`, `references/`, `assets/`.

**Examples:**

```markdown
---
name: update-conspect
description: Add or correct study notes in resources/. Use when the user asks to edit conspect.
---

# Update conspect

1. Open files.md and pick the canonical file
2. Fetch official docs before writing facts
3. Edit one full details block; patch siblings with pointers
```

**Sources:** [SKILL.md file format](https://cursor.com/docs/skills.md#skillmd-file-format)

</details>

## Automatic vs slash invocation

<details>
<summary>Automatic vs slash invocation</summary>

**Definition:** By default Agent may apply a skill when the request matches its description; with `disable-model-invocation: true` it only runs when you type `/skill-name`.

**How it works:**

- Default: model-invocation on — skill behaves like a smart playbook.
- `disable-model-invocation: true` — classic slash-command behavior (explicit only).
- Typing `/` attaches the skill to **one** message unless you promote it to a Custom Mode.

**When to use:** Auto for domain playbooks you want Agent to pick up. Slash-only for expensive or dangerous workflows you must opt into.

**Sources:** [Disabling automatic invocation](https://cursor.com/docs/skills.md#disabling-automatic-invocation)

</details>

## Scoping with paths

<details>
<summary>Scoping with paths</summary>

**Definition:** The `paths` frontmatter field limits when a skill is surfaced to files matching glob patterns.

**How it works:**

- Accepts a list or a comma-separated string of globs.
- Unset `paths` → available regardless of open files.
- Legacy `globs` still works; new skills should use `paths`.

**Examples:**

```markdown
---
name: react-component-patterns
description: Conventions for writing React components in this codebase.
paths:
  - "**/*.tsx"
  - "packages/ui/**/*.ts"
---
```

**Sources:** [Scoping a skill to specific files](https://cursor.com/docs/skills.md#scoping-a-skill-to-specific-files)

</details>

## Custom Mode

<details>
<summary>Custom Mode</summary>

**Definition:** A Custom Mode keeps a skill in context for the whole session (badge in the chat input), instead of attaching it to a single message.

**How it works:**

- Pick the skill from `/`, then Option+Enter (Mac) / Alt+Enter (Windows), or **Use as Mode**.
- Style with optional `icon` and `color` frontmatter.
- Available in the Agents Window and the CLI.

**When to use:** Long sessions that should stay on one playbook (TDD, code review checklist). Skip for one-shot tasks.

**Sources:** [Using a skill as a Custom Mode](https://cursor.com/docs/skills.md#using-a-skill-as-a-custom-mode) · [Prompting agents](https://cursor.com/docs/agent/prompting.md)

</details>

## Built-in skills

<details>
<summary>Built-in skills</summary>

**Definition:** Cursor ships built-in skills (managed by Cursor) that appear in the `/` menu next to your own skills.

**How it works:** High-traffic built-ins include `/create-rule`, `/create-skill`, `/create-hook`, `/review`, `/review-bugbot`, `/review-security`, `/loop`, `/canvas`, `/migrate-to-skills`, `/split-to-prs`, `/shell`. See [Slash commands](./0_ai_cursor_slash.md) for the everyday list.

**When to use:** Prefer built-ins for creating rules/skills/hooks and for reviews instead of reinventing prompts.

**Sources:** [Built-in Cursor skills](https://cursor.com/docs/skills.md#built-in-cursor-skills)

</details>

## Migrate to skills

<details>
<summary>Migrate to skills</summary>

**Definition:** `/migrate-to-skills` (Cursor 2.4+) converts eligible dynamic rules and slash commands into Agent Skills.

**How it works:**

- Converts “Apply Intelligently” rules (`alwaysApply: false` / unset, no `globs`) → normal skills.
- Converts user/workspace `.cursor/commands` → skills with `disable-model-invocation: true`.
- Does **not** migrate `alwaysApply: true`, glob-scoped rules, or User Rules (not on disk).

**Examples:**

```text
# In Agent chat
/migrate-to-skills
```

**Sources:** [Migrating rules and commands to skills](https://cursor.com/docs/skills.md#migrating-rules-and-commands-to-skills)

</details>

## Interview Practice

**Q: Skills vs rules?**

Rules = short persistent guidance (always / globs / @mention). Skills = multi-step workflows, often invoked with `/` or auto-picked by description.

**Q: Where do project skills live?**

`.cursor/skills/<name>/SKILL.md` or `.agents/skills/<name>/SKILL.md` (also nested package paths).
