# RTK — Rust Token Killer

Token-optimized CLI proxy for shell commands. Compresses output before it reaches the AI context (~60–90% savings on `git`, `rg`, `cat`, tests, etc.).

Repo: [rtk-ai/rtk](https://github.com/rtk-ai/rtk) · Site: [rtk-ai.app](https://www.rtk-ai.app)

---

## Setup (do once per machine)

### Step 1 — Install RTK

```bash
brew install rtk
```

Or without Homebrew:

```bash
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
```

### Step 2 — Verify the binary

```bash
which rtk
rtk --version
```

Expected: path like `/opt/homebrew/bin/rtk` and version `rtk 0.40.0+`.

> **Wrong package?** If `rtk gain` fails, you may have Rust Type Kit from crates.io. Use `brew install rtk` or `cargo install --git https://github.com/rtk-ai/rtk`.

### Step 3 — Install the Cursor hook (global)

Cursor hooks are **machine-wide**, not per-repo:

```bash
rtk init -g --agent cursor
```

### Step 4 — Confirm the hook

```bash
rtk init -g --agent cursor --show
```

Look for: `[ok] Cursor hook: registered in hooks.json`

`~/.cursor/hooks.json` should contain:

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "command": "rtk hook cursor",
        "matcher": "Shell"
      }
    ]
  }
}
```

### Step 5 — Restart Cursor

Quit and reopen Cursor so the hook loads.

### Step 6 — Smoke test

```bash
rtk git status
rtk gain
```

`rtk git status` should show a compact summary instead of full `git status` output.

---

## Project files (already in this repo)

These are committed with MyConspect — no extra init needed after clone:

| File                | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `RTK.md`            | Agent instructions (this file)               |
| `AGENTS.md`         | Project context + `@RTK.md` for Cursor/Codex |
| `.rtk/filters.toml` | Optional project-specific filters            |

After clone, only **Steps 1–6** above are required on a new machine.

---

## Usage in this repo

Next.js handbook at the repo root; conspect markdown in `resources/`. Prefer `rtk` for `git`, `rg`, and reading large notes.

### Step 7 — Prefix shell commands with `rtk`

```bash
rtk git status
rtk git diff
rtk git log -n 10
rtk rg "pattern" resources
rtk read resources/3_js.md
rtk ls resources
```

The global Cursor hook rewrites Shell tool calls automatically (`git status` → `rtk git status`).

Built-in Cursor tools (`Read`, `Grep`, `Glob`) **do not** pass through the hook — use `rtk read`, `rtk rg`, or shell commands when compact output matters.

### Step 8 — Check savings over time

```bash
rtk gain
rtk gain --history
```

### Step 9 — Full output when needed

```bash
rtk proxy git diff
```

---

## How the layers fit together

| Layer              | Location               | What it does                          |
| ------------------ | ---------------------- | ------------------------------------- |
| **Global hook**    | `~/.cursor/hooks.json` | Rewrites Shell calls before execution |
| **Project rules**  | `AGENTS.md`, `RTK.md`  | Tells agents to prefer `rtk`          |
| **Custom filters** | `.rtk/filters.toml`    | Project-specific output rules         |

More context: [0_ai.md — RTK](./resources/0_ai.md#rtk-rust-token-killer).


