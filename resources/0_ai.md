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

<details>
  <summary>AI-assisted workflow (Cursor, Copilot, Claude Code)</summary>

### AI-assisted workflow (Cursor, Copilot, Claude Code)

**Definition:** Using an LLM **in the editor** to draft, search, and refactor — you still own review, tests, and architecture. Copilot completes lines; Cursor/Claude Code can edit many files with tools.

**How it works:** The model sees open files + the prompt. It does **not** know last week's Next.js API unless you inject docs (**Context7**, **Ref.tools**). **RTK** shrinks terminal output so git/test logs fit in context. Treat generated code like a junior PR: run it, type-check it, do not paste secrets.

**When to use:**

Scaffold a Server Action from an existing one. Explain a failing test. **When NOT:** novel crypto, production incident without reading logs yourself.

#### Common pitfalls

Accepting `cookies()` as sync (Next 16). Committing `.env`. Asking the model to "remember" a CVE instead of fetching the advisory.

**Pluses and minuses:**

| + | − |
|------|------|
| Faster boilerplate, tests, refactors | Confident wrong APIs if docs are stale |
| Good at local patterns in the repo | Can over-edit unrelated files |
| Agents + MCP (Context7) beat memory | You must still design and review |

**Examples:**

Prompt shape that stays honest:

```
Use Context7 for Next.js 16 cookies() (async).
Add a Server Action that sets the session cookie.
Do not invent APIs. Show the docs snippet you used.
```

**Thoughts:** AI drafts; you verify against docs and tests.

**Sources:** [Cursor](https://cursor.com/) · [GitHub Copilot](https://github.com/features/copilot) · [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

</details>

<details>
  <summary>AI-first approach</summary>

### AI-first approach

**Definition:** Design the **product, architecture, and workflow around a model** from day one — intelligence is how value is delivered, not a later add-on. Google framed this as the shift from *mobile-first* to *AI-first* (Sundar Pichai, 2016).

**How it works:**

Three labels that people mix up:

| Label | What changes | Litmus test |
|-------|----------------|-------------|
| **AI-first** | The product *is* the model loop (retrieve → generate/act → eval → feedback) | Model down for a week → **no product** (Cursor without an LLM is a VS Code fork) |
| **AI-enabled** | Working product + AI features (summarize, chatbot, autocomplete) | Model down → base product still works (Notion without AI is still Notion) |
| **AI-augmented** | *How the team builds* (Cursor, Copilot) — the shipped product may not be AI | Removing the coding assistant does not change the product |

AI-first design starts with: what must the model **know**, **decide**, and **do**; what only a human can own; where feedback trains the next run. UI, APIs, storage, and permissions wrap that loop — they are not the core.

**When to use:**

Coding agents, meeting notes that only exist because of the transcript model, support that resolves tickets without a scripted tree. **When NOT:** You already have PMF and AI is a compounding feature (Linear, Notion). Do not slap “AI-first” on a side-panel chatbot.

#### Common pitfalls

Calling a bolted-on chatbot “AI-first.” Skipping evals because “it’s just an MVP.” Confusing **AI-augmented engineering** (this file’s Cursor/Copilot block) with an AI-first *product*. No fallback when the provider is down.

**Pluses and minuses:**

| + | − |
|------|------|
| New UX (generate, classify, act) that rules cannot express | Quality, latency, and cost *are* the product — a model regression is a P0 |
| Data + evals become a moat | Needs retrieval, evals, fallbacks, human override from the start |
| Pricing can follow outcomes, not seats | Easy to fake with a chatbot; trust fails if users cannot override |

**Examples:**

The shipped feature *is* the model + tools loop (Vercel AI SDK). Strip this route and there is nothing to sell:

```ts
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  tool,
} from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: "openai/gpt-4.1",
    messages: await convertToModelMessages(messages),
    tools: {
      searchDocs: tool({
        description: "Search the company knowledge base",
        inputSchema: z.object({ query: z.string() }),
        execute: async ({ query }) => searchIndex(query),
      }),
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
```

**Thoughts:** If you can remove the model and the product still ships value, you are AI-enabled — not AI-first.

**Sources:** [Google — from mobile-first to AI-first](https://blog.google/intl/en-ca/products/explore-get-answers/a-personal-google-just-for-you/) · [AI-first vs AI-enabled](https://www.institutepm.com/knowledge-hub/ai-first-vs-ai-enabled-strategy) · [AI SDK](https://ai-sdk.dev/)

</details>

https://aqtopus.com/

https://blog.bytebytego.com/p/ep167-top-20-ai-concepts-you-should

build app - https://www.freecodecamp.org/news/how-to-use-ai-effectively-in-your-dev-projects/ 

 Use Google AI Studio for prototyping interface layouts (it’s free).

src: https://www.paralect.com/academy/product-engineer 

### Page builder

https://replit.com/@radomirradionov/Page-Builder 
https://lovable.dev/pricing 

нейронки проблема с контекстом
ии агнет - хорошо спраляется

Нейросеть — это мозг
ИИ-агент — это человек с мозгом, руками и задачей

<details>
  <summary>Context7 and Ref.tools</summary>

### Context7 and Ref.tools

# Using Context7 and Ref.tools with AI Coding Assistants

## Overview
Modern AI coding assistants produce better results when they can access **up-to-date documentation**. Two tools commonly used for this purpose are **Context7** and **Ref.tools**.

These tools allow an AI agent to retrieve relevant documentation before generating code, which helps reduce hallucinations and improves accuracy.

- **Context7** → Injects the latest framework or library documentation into the AI's context.
- **Ref.tools** → Searches documentation sources and returns only the relevant sections.

Using both together helps AI assistants generate **more reliable and accurate code**.

---

# Context7

## What It Does
Context7 provides **automatic access to the latest documentation for frameworks and libraries**.

When used in a prompt, it retrieves relevant documentation and injects it into the AI’s context so the assistant can use **current syntax and examples**.

## Typical Use Cases
- Framework documentation
- Library usage examples
- Version-specific syntax
- Quick references for common APIs

## Example Request

Build a Next.js API route for user authentication using JWT.
use context7

In this example, Context7 loads the latest **Next.js documentation** and provides examples before the AI generates the code.

---

# Ref.tools

## What It Does
Ref.tools acts as a **documentation search system for AI agents**.

Instead of loading entire documentation websites, it searches for relevant information and retrieves **only the sections needed** to answer a request.

This reduces token usage and ensures the AI references accurate documentation.

## Typical Use Cases
- Searching API documentation
- Retrieving endpoint details
- Finding parameters and request formats
- Looking up specific functions or SDK usage

## Example Request

Use reftools to find the Stripe API documentation for creating a checkout session.
Then generate a Node.js example using the official Stripe SDK.

In this case, Ref.tools searches the Stripe documentation and retrieves the exact section related to **checkout session creation**.

---

# Using Both Tools Together

Developers often combine Context7 and Ref.tools in the same workflow.

- **Context7** provides general framework documentation.
- **Ref.tools** retrieves detailed API references.

## Example Combined Request

Build a Next.js API endpoint that creates a Stripe checkout session.

Steps:

use context7 to load the latest Next.js API route documentation

use reftools to search Stripe docs for "create checkout session"

generate a TypeScript implementation

## Workflow

1. Context7 loads relevant **framework documentation**.
2. Ref.tools searches and retrieves **specific API details**.
3. The AI generates an implementation using both sources.

---

# Comparison

| Feature | Context7 | Ref.tools |
|--------|--------|--------|
| Primary purpose | Inject library documentation | Search documentation |
| Best for | Frameworks and libraries | APIs and endpoints |
| Documentation scope | Version-specific docs | Targeted documentation sections |
| Token efficiency | Medium | High |

---

# Best Practices

When working with AI coding assistants:

- Use **Context7** when working with **frameworks and libraries**.
- Use **Ref.tools** when you need **specific API documentation**.

Combining both tools allows AI systems to access **high-level documentation and precise technical references**, resulting in more accurate generated code.

</details>

https://aistudio.google.com/api-keys?project=gen-lang-client-0702797993

When iterating on UI, ask to design multiple options. This is a powerful way to build the best interfaces. Use Google AI Studio for prototyping interface layouts (it’s free).

# 2026

q - https://docs.google.com/document/d/1SI3ufNt6N3LMrsP0rBpOfCYr7trNpkPRKT9n3M_WZg4/edit?tab=t.0

vercel skills - https://github.com/vercel-labs/agent-skills/tree/main

---

## RTK (Rust Token Killer)

[rtk-ai/rtk](https://github.com/rtk-ai/rtk) — CLI proxy that compresses shell output before it enters the AI context (~60–90% token savings on `git`, `rg`, `cat`, test runners, etc.). Site: [rtk-ai.app](https://www.rtk-ai.app).

The Cursor hook is **machine-wide** (`rtk init -g --agent cursor`). After that, Shell calls like `git status` are rewritten to `rtk git status`. Built-in Cursor tools (`Read`, `Grep`, `Glob`) skip the hook — use `rtk read` / `rtk rg` when output is large. Full output: `rtk proxy git diff`. Savings: `rtk gain`.

### Quick checklist (once per machine)

| Step | Command / action |
|------|------------------|
| 1 | `brew install rtk` (or [install.sh](https://github.com/rtk-ai/rtk)) |
| 2 | `which rtk && rtk --version` (`rtk 0.40.0+`; not crates.io “Rust Type Kit”) |
| 3 | `rtk init -g --agent cursor` |
| 4 | `rtk init -g --agent cursor --show` → `[ok] Cursor hook` |
| 5 | Restart Cursor |
| 6 | `rtk git status && rtk gain` |

**Already in repo (after clone):** `AGENTS.md` · `.rtk/filters.toml`

### Comparison with Context7 / Ref.tools

| Tool | Purpose |
|------|---------|
| **RTK** | Shrink *command output* already in context |
| **Context7** | Inject *library docs* into context |
| **Ref.tools** | Search and fetch *API doc sections* |

Use all three together: RTK for terminal work, Context7/Ref for accurate library references.

---

<a name="interview-practice"></a>

## Interview Practice

**Q: What is an AI-first approach?**

Design the product around a model from the start. **AI-first** = remove the model and there is no product. **AI-enabled** = base product still works (AI is a feature). **AI-augmented** = the *team* uses AI to build faster. Google used “AI-first” for the shift after mobile-first (Pichai, 2016).
