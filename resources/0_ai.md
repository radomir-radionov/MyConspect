# AI-assisted development

How to use Cursor, Copilot, Claude Code, and doc tools without shipping hallucinated APIs. Keep raw links below.

### Related docs

* [Interview hub](./0_interview.md) · [MVP & judgment](./0_mvp.md) · [RTK setup](#rtk-rust-token-killer) · [TypeScript](./5_ts.md) · [Next.js](./4_nextjs.md)

### Main concepts

| Area | Topics |
|------|--------|
| **Product** | [AI-first approach](#ai-first-approach) vs AI-enabled vs AI-augmented |
| **Workflow** | [AI-assisted editors](#ai-assisted-workflow-cursor-copilot-claude-code), [Context7 / Ref](#context7-and-reftools), [RTK](#rtk-rust-token-killer) |

### Sections

- [AI-first approach](#ai-first-approach)
- [AI-assisted workflow](#ai-assisted-workflow-cursor-copilot-claude-code)
- [Context7 and Ref.tools](#context7-and-reftools)
- [RTK](#rtk-rust-token-killer)
- [Interview Practice](#interview-practice)

---

## AI-first approach

<details>
<summary>AI-first approach</summary>

**Definition:** An **AI-first** product is designed around a model from the start — remove the model and there is no product. **AI-enabled** means the base product still works and AI is a feature. **AI-augmented** means the *team* uses AI to ship faster; the product itself may not contain a model.

**How it works:**

- **AI-first (product):** the core loop is a model (search ranking, assistant, codegen). Google used this phrasing for the shift after mobile-first (Pichai, 2016 Founders’ Letter: “We will move from mobile first to an AI first world”).
- **AI-enabled (product):** CRUD/UI still works offline from the model; chat, summaries, or suggestions are add-ons.
- **AI-augmented (team):** Cursor, Copilot, Claude Code, Context7/Ref, RTK — the handbook you are reading is this bucket unless the *product* is itself a model.

**When to use:** Product interviews (“is this AI-first?”), architecture reviews, and when deciding whether to wrap an LLM as the product vs as a coding aid. Skip the slogan when you only mean “we use ChatGPT at work.”

**Pluses and minuses:**

| + | − |
| --- | --- |
| Forces a clear product thesis: what dies if the model is down? | Easy to confuse team tooling with the customer-facing product. |
| Matches how large platforms talk about assistants vs screens. | “AI-first” is marketing unless the model *is* the loop. |

**Thoughts:** In this repo, most of the AI track is **AI-augmented development**. Call a note **AI-first** only when the shipped product cannot exist without the model.

**Sources:** [Google Founders’ Letter 2016](https://blog.google/alphabet/this-years-founders-letter/)

</details>

## AI-assisted workflow (Cursor, Copilot, Claude Code)

<details>
<summary>AI-assisted workflow (Cursor, Copilot, Claude Code)</summary>

**Definition:** AI-assisted editors run a coding **agent** (tools: read, edit, shell, search) and/or **inline completions**. The agent is not a source of truth — official docs and the compiler are.

**How it works:**

- **Cursor Agent (this chat):** can edit the workspace, run the terminal, and call MCP. User Rules apply to Agent chat, not to Tab or Cmd/Ctrl+K inline edit. Project rules (`.cursor/rules`) and skills load here.
- **Cursor Tab / Cmd+K:** completions and inline edits. Faster for local tweaks; they do not follow the same Agent rules/MCP loop.
- **Cursor CLI (`agent`):** same class of agent in a terminal/CI (`agent -p "…"`). Use when there is no editor window.
- **GitHub Copilot:** inline completions plus Copilot Chat (and Agent mode in current VS Code). Chat uses open files / repo context; optional `.github/copilot-instructions.md`. Org admins can disable chat or agent.
- **Claude Code:** terminal agent (`claude`). Tools (Read, Edit, Bash, Grep, …) make it agentic; without tools it only talks. Headless: `claude -p`. Built-in Read/Grep/Glob do **not** pass through a Bash hook — RTK only rewrites shell commands unless you call `rtk read` / `rtk grep` yourself.

**When to use:** Multi-file handbook/conspect work → Cursor Agent. One-hunk edits → Tab/Cmd+K. SSH/CI → Cursor CLI or `claude -p`. Stay in Copilot if that is the team standard.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Agent can grep, patch, and verify in the repo. | Training data hallucinates APIs; always fetch docs (Context7/Ref) before writing facts. |
| CLI agents automate CI and remote boxes. | CLI does not give editor diffs, Tab, or the same GUI approvals. |

**Examples:**

```bash
# Cursor CLI (no editor)
agent -p "Fix the failing lint on this branch"

# Claude Code headless
claude -p "Explain why parseTopicMarkdown returns 0 concepts"
```

**Thoughts:** For MyConspect day to day, stay in this Agent panel. Treat Copilot/Claude Code as the same *pattern* (completions vs tools), not as extra magic.

**Sources:** [Cursor rules](https://cursor.com/docs/rules) · [GitHub Copilot Chat in IDEs](https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-ide) · [Claude Code tools](https://code.claude.com/docs/en/glossary)

</details>

## Context7 and Ref.tools

<details>
<summary>Context7 and Ref.tools</summary>

**Definition:** Context7 and Ref are **MCP documentation tools**. They pull current library docs into the agent so it does not invent APIs from training data. The Next.js handbook never calls them — only the agent that edits `resources/` does.

**How it works:**

- **Context7 (two steps):** `resolve-library-id` (`libraryName` + `query`) → pick `/org/project` (prefer official ID, High reputation, version when the note names one) → `query-docs` (`libraryId` + **one** concept per call). Combined queries dilute ranking.
- **When to use Context7:** library/framework/SDK/API/CLI/cloud docs — even React/Next you think you know. **Do not** use it for generic refactoring, code review, or non-library concepts.
- **Ref.tools:** `ref_search_documentation(query)` then `ref_read_url` on a result URL (include the `#hash`). Better for a specific method/signature page. HTTP MCP: `https://api.ref.tools/mcp`.
- **Fallback:** web fetch (MDN, WHATWG, vendor docs) only if both miss.
- **In notes:** put canonical URLs on `**Sources:**`. This site is SSG; visitors do not “sync with MCP.”

**When to use:** Before adding or changing facts in `resources/*.md` (see `.cursor/rules/resources-official-docs.mdc`). Skip for personal hubs with no APIs (`0_me.md`) unless you add a factual claim.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Version-specific snippets beat memorized APIs. | Quota/auth failures — then Ref or official URLs. |
| Ref is token-cheap search → targeted read. | Context7 is the wrong tool for “rewrite this file.” |

**Thoughts:** “MCP synced” on the public site would be a lie. Truthful signal is `**Sources:**` plus a weekly `npm run check-conspect` URL audit.

**Sources:** [Context7](https://context7.com/) · [Context7 MCP](https://github.com/upstash/context7) · [Ref MCP tools](https://docs.ref.tools/context/mcp/tools)

</details>

## RTK (Rust Token Killer)

<details>
<summary>RTK (Rust Token Killer)</summary>

**Definition:** **RTK** is a CLI proxy that compresses `git` / `rg` / test / Docker output **before** the agent’s LLM sees it (often 60–90% fewer tokens). It is not Cursor CLI.

**How it works:**

- A hook rewrites `git status` → `rtk git status` (Cursor: `preToolUse` / `updated_input`). You still type in Agent chat; the shell tool is rewritten.
- Install for Cursor: `rtk init --global --agent cursor` (or `rtk init -g --agent cursor`), then restart Cursor.
- Compact forms: `rtk git status`, `rtk git diff`, `rtk git log -n 10`. Tests often collapse to failures only.
- Cursor Agent **Read / Grep / Glob** do not go through the Bash hook. For compact search/read, use shell `rg`/`cat` or `rtk grep` / `rtk read`.
- Bypass once: `RTK_DISABLED=1 git status`. Permanent skips: `exclude_commands` in `~/.config/rtk/config.toml`.
- Prompt-only agents (no hook) get instructions to call `rtk …` but do not intercept.

**When to use:** Long diffs, noisy test logs, big `git status`. Skip when you need the raw full output.

**Pluses and minuses:**

| + | − |
| --- | --- |
| More room in context for the actual task. | Hook bugs can silently pass through (treat non-zero `rtk rewrite` as failure). |
| One binary, many ecosystems. | Built-in editor search tools are not rewritten. |

**Examples:**

```bash
rtk init --global --agent cursor
rtk git status
RTK_DISABLED=1 git diff
```

**Thoughts:** If the agent “misses” files that `git status` listed, check whether RTK collapsed the output — or run raw git once.

**Sources:** [rtk-ai/rtk](https://github.com/RTK-AI/rtk) · [Supported agents](https://www.rtk-ai.app/docs/getting-started/supported-agents/)

</details>

## Interview Practice

**Q: What is an AI-first approach?**

Design the product around a model from the start. **AI-first** = remove the model and there is no product. **AI-enabled** = base product still works (AI is a feature). **AI-augmented** = the *team* uses AI to build faster. Google used “AI-first” for the shift after mobile-first (Pichai, 2016).

**Q: Why fetch docs instead of trusting the model?**

Training cutoffs invent APIs. Context7 (`resolve-library-id` → `query-docs`) and Ref (`ref_search_documentation` → `ref_read_url`) read current official pages. Put those URLs in **Sources:**.

**Q: Cursor chat vs Cursor CLI vs RTK?**

Chat/Agent in the IDE is the full agent with diffs and MCP. Cursor CLI is the same agent without the editor. RTK only shrinks shell output after `rtk init --global --agent cursor`.
