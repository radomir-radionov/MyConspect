# Git — Interview

Interview Q&A and shell appendix.

[← Back to hub](./0_git.md)

### Related docs

* [Git — Fundamentals](./0_git_core.md) · [Git — Branching](./0_git_branching.md) · [Git — Team](./0_git_team.md) · [Git — Interview](./0_git_interview.md)

### Sections

- [Interview Practice](#interview-practice)
- [Appendix — Shell basics](#appendix-shell-basics)

---

## Interview Practice

<details>
  <summary>Interview Practice</summary>

### Interview Practice

Questions from [0_interview.md](0_interview.md). Try answering before opening each solution.

### Question index (0_interview.md)

| # | Topic | Section |
|---|-------|---------|
| 131 | Line-ending conflicts on every pull | Q1 |
| 132 | `git fetch` | Q2 |
| 133 | Git hygiene | Q3 |
| 137 | `merge` vs `rebase` | Q4 |
| 138 | Staging area | Q5 |
| 139 | Code review | Q6 |
| 37 | Git Flow | Q7 |
| 38 | Squash during rebase | Q8 |
| 39 | Alternative VCS | Q9 |
| 40 | Git conventions | Q10 |

---

### Questions & Answers

<details>
  <summary>Q1. Every pull causes a conflict on the last line of all edited files. What is happening?</summary>

### Q1. Every pull causes a conflict on the last line of all edited files. What is happening?

**Question:** Each time you pull, the last line conflicts in every file you edited. Why?

**Answer:**

This is almost always a **line-ending mismatch** (CRLF on Windows vs LF on Unix).

Git sees the same logical content as different bytes. On merge, it flags every touched line — often appearing as a conflict on the "last line" (where the invisible `\r` differs).

**Fix:**

1. Team agrees on LF in repo: `* text=auto eol=lf` in `.gitattributes`
2. Per-developer: `core.autocrlf=true` (Windows) or `input` (macOS/Linux)
3. Add `.editorconfig` with `end_of_line = lf`
4. Renormalize: `git add --renormalize .` + one commit
5. Everyone pulls once; conflicts should stop

</details>

<details>
  <summary>Q2. What does `git fetch` do?</summary>

### Q2. What does `git fetch` do?

**Question:** Explain `git fetch`.

**Answer:**

`git fetch` downloads new commits, branches, and tags from a remote into your **local remote-tracking refs** (e.g. `origin/main`). It does **not** modify your working branch or working directory.

| Command | Fetch remote? | Update local branch? | Merge/rebase? |
|---------|---------------|----------------------|---------------|
| `git fetch` | Yes | No | No |
| `git pull` | Yes | Yes | Yes (merge or rebase) |
| `git push` | No | No | Sends local commits to remote |

Use `fetch` when you want to inspect remote changes before integrating: `git log main..origin/main`.

</details>

<details>
  <summary>Q3. What git hygiene approaches do you know?</summary>

### Q3. What git hygiene approaches do you know?

**Question:** Name git hygiene practices for team projects.

**Answer:**

1. **Conventional commits** — consistent, searchable messages
2. **Atomic commits** — one logical change each
3. **Small PRs** — reviewable diffs (< 400 lines ideal)
4. **Branch naming** — `feature/`, `fix/`, `chore/` prefixes
5. **Rebase feature branch** onto main before PR (linear history)
6. **Never force-push** shared branches
7. **Hooks** — lint/format/test before commit/push
8. **`.gitignore`** — no `node_modules`, `.env`, build artifacts
9. **No secrets** in history; rotate if leaked
10. **Delete merged branches** — reduce clutter
11. **Signed commits** on production repos
12. **Protected `main`** — require PR + CI + review

</details>

<details>
  <summary>Q4. How do `git merge` and `git rebase` differ?</summary>

### Q4. How do `git merge` and `git rebase` differ?

**Question:** Compare `git merge` and `git rebase`. When use each?

**Answer:**

| | Merge | Rebase |
|---|-------|--------|
| History shape | Branched (merge commits) | Linear |
| Rewrites commits | No | Yes (new SHAs) |
| Conflicts | Once | Per replayed commit |
| Safe on shared/pushed branch | Yes | **No** |

**Use merge** when integrating a completed feature into a shared branch, or when preserving exact branch history matters.

**Use rebase** to update your **local/private** feature branch onto latest `main` before opening a PR — cleaner review diff.

**Golden rule:** do not rebase commits others have already pulled.

</details>

<details>
  <summary>Q5. What is the staging area in Git?</summary>

### Q5. What is the staging area in Git?

**Question:** Explain the staging area (index).

**Answer:**

The **staging area** (index) is the intermediate layer between working directory and repository. It holds exactly what will go into the next commit.

```
Working directory  --git add-->  Index  --git commit-->  Repository
```

Why it exists:

* **Selective commits** — stage only part of your changes (`git add -p`)
* **Review before commit** — `git diff --staged` shows what you're about to commit
* **Separation of WIP from ready** — edit many files, commit only finished ones

Commands: `git add` (stage), `git restore --staged` (unstage), `git commit` (freeze index into commit).

</details>

<details>
  <summary>Q6. Describe the code review process.</summary>

### Q6. Describe the code review process.

**Question:** How do you conduct code review? Rules for conflicts and disagreements?

**Answer:**

**Process:**

1. Author opens PR with description, linked ticket, test notes
2. CI runs automatically (lint, tests, build)
3. Reviewer reads diff, leaves comments (blocking vs nit)
4. Author addresses feedback; pushes new commits
5. Re-review until approved
6. Merge (squash or merge commit per team policy)

**Reviewer checklist:**

* Correctness and edge cases
* Tests included
* No security issues (XSS, secrets, auth)
* Readable naming and structure
* Matches project conventions

**Resolving disagreements:**

* Discuss in PR comments with reasoning, not opinion
* Escalate to tech lead if no consensus
* Prefer measurable criteria (performance, spec, style guide)
* For style nits: follow team linter/config, not personal preference
* Time-box debates; ship with follow-up ticket if non-blocking

</details>

<details>
  <summary>Q7. Describe Git Flow in two words (branches).</summary>

### Q7. Describe Git Flow in two words (branches).

**Question:** Summarize Git Flow methodology.

**Answer:**

**Long-lived `main` + `develop`**, with short-lived `feature`, `release`, and `hotfix` branches.

| Branch | From | Into | Purpose |
|--------|------|------|---------|
| `feature/*` | develop | develop | New work |
| `release/*` | develop | main + develop | Release prep |
| `hotfix/*` | main | main + develop | Production fixes |

`main` = production. `develop` = integration. Good for versioned releases; heavy for continuous deployment — consider GitHub Flow or trunk-based instead.

</details>

<details>
  <summary>Q8. What does squashing commits during rebase mean?</summary>

### Q8. What does squashing commits during rebase mean?

**Question:** Explain squash commits during interactive rebase.

**Answer:**

Interactive rebase (`git rebase -i`) lets you **combine multiple commits into one** before merging.

```
pick abc1234 feat: add validation
squash def5678 wip
fixup ghi9012 typo
```

| Action | Effect |
|--------|--------|
| `squash` | Merge into previous commit; combine messages |
| `fixup` | Merge into previous; discard this message |
| `pick` | Keep as-is |
| `drop` | Remove commit |

**Why:** turn messy WIP history (`wip`, `fix typo`, `fix tests`) into one clean commit for PR/merge. Only on **unpushed or private** branch history.

</details>

<details>
  <summary>Q9. Opinion on alternative version control systems?</summary>

### Q9. Opinion on alternative version control systems?

**Question:** What alternatives to Git exist and when might you use them?

**Answer:**

| VCS | Strength | Weakness |
|-----|----------|----------|
| **SVN** | Simple mental model; path-level permissions | No local full history; branching painful |
| **Mercurial** | Distributed like Git; simpler CLI | Small ecosystem; declining use |
| **Perforce (Helix)** | Huge binaries, game/film pipelines | Centralized; expensive/complex |
| **Git** | Distributed, branching, ecosystem | Steep learning curve |

For web/frontend: **Git is the standard**. SVN/Perforce appear in legacy enterprise or game studios. Know trade-offs; default to Git unless org mandates otherwise.

</details>

<details>
  <summary>Q10. What Git conventions do you use?</summary>

### Q10. What Git conventions do you use?

**Question:** Which Git conventions do you follow?

**Answer:**

**Commits:** [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`, `ci:`

**Branches:** `feature/JIRA-123-short-desc`, `fix/login-bug`, `chore/deps-update`

**PR titles:** match commit convention; link ticket

**Merge:** squash for small features; merge commit for large features (team policy)

**Tags:** semver annotated tags for releases (`v1.2.3`)

**Hooks:** enforce lint + conventional commit message format

**Never:** secrets in repo, force-push to `main`, commits as "fix", "wip", "asdf"

</details>

<details>
  <summary>Q11. Walk through a Git CLI feature from clone to delete branch</summary>

### Q11. Walk through a Git CLI feature from clone to delete branch

**Question:** What commands do you run from first clone to landing a feature?

**Answer:** `clone` → `switch -c` (or `checkout -b`) → edit → `status` → `add` → `commit` → `push -u` → after review, checkout integration branch → `merge` → `branch -d`. Pull later with `git pull` (or `git pull --all` to fetch every remote, then integrate **current** upstream only). Full loop: [Git CLI daily workflow](./0_git_core.md#workflow).

</details>

---

### Hands-on tasks

### Task 1 — Recover deleted branch

Branch was deleted locally after merge. Recover last commit.

<details><summary>Solution</summary>

`git reflog` → find commit SHA → `git checkout -b feature-restored <sha>`

</details>

### Task 2 — Interactive rebase squash

Squash last 3 commits into one before PR.

<details><summary>Solution</summary>

`git rebase -i HEAD~3` → mark commits as `squash` / `fixup` → edit message.

</details>

### Task 3 — Resolve line-ending conflict

Team on Windows + Mac — prevent CRLF conflicts.

<details><summary>Solution</summary>

`.gitattributes`: `* text=auto eol=lf`, renormalize with `git add --renormalize .`

</details>

---

### Quick oral questions (self-check)

1. What are the three trees in Git?
2. What is HEAD? What is detached HEAD?
3. Difference between `git revert` and `git reset`?
4. When is a fast-forward merge possible?
5. What does `git cherry-pick` do?
6. What is `git reflog` used for?
7. What does `git bisect` do?
8. Why is `git reset --hard` dangerous?
9. What is `--force-with-lease` vs `--force`?
10. What is the difference between lightweight and annotated tags?
11. What does `git stash` store?
12. How do you sync a fork with upstream?
13. What is `ORIG_HEAD`?
14. What four object types does Git store?
15. Why should you not rebase a pushed shared branch?
16. What does `git rm --cached` do?
17. What is a merge conflict marker (`<<<<<<<`)?
18. What does signed commit prove?
19. What is `git worktree` for?
20. What does `git pull --rebase` do vs default pull?

</details>

---

<a name="appendix-shell"></a>

## Appendix — Shell basics

<details>
  <summary>Appendix — Shell basics for Git Bash</summary>

### Appendix — Shell basics for Git Bash

**Definition:** Terminal literacy for Windows Git Bash users. Not Git-specific — useful when working from the command line.

<details>
  <summary>List files</summary>

### List files

**Definition:** `ls` lists directory contents with optional flags for format and sorting.

**Examples:**

```bash
ls
ls -a                   # include hidden
ls -a -1                # one column
ls -hF -1 --sort=extension
ls build/css
ls /d/projects          # Windows path
```

</details>

<details>
  <summary>Navigate</summary>

### Navigate

**Definition:** `cd` changes the current working directory. `Tab` autocompletes paths.

**Examples:**

```bash
cd projects
cd /d/projects
cd /c/Program\ Files
cd ..                   # parent
cd -                    # previous directory
cd !$                   # last argument of previous command
```

</details>

<details>
  <summary>Create files and folders</summary>

### Create files and folders

**Definition:** `mkdir` creates directories; `touch` creates empty files.

**Examples:**

```bash
mkdir project
mkdir -p project/{css,js}
touch index.html
touch index.html css/style.css
```

</details>

<details>
  <summary>Copy, move, delete</summary>

### Copy, move, delete

**Definition:** `cp` copies files/directories; `mv` moves or renames; `rm` deletes.

**Examples:**

```bash
cp index.html catalog.html
cp index.html old/
cp -r temp/ temp2/
mv index.html old/
mv order.txt orderNew.txt
rm ghost.png
rm -rf old/
```

</details>

<details>
  <summary>Useful one-liners</summary>

### Useful one-liners

**Definition:** Common shell commands for inspection and cleanup.

**Examples:**

```bash
pwd
cat ~/.bash_profile
grep -i -n --color 'pattern' file1 file2
grep word -r project
find . -iname '*ind*'
rm -rf node_modules && npm i
```

</details>

<details>
  <summary>Shell aliases</summary>

### Shell aliases

**Definition:** Shortcuts for frequently used commands, defined in shell profile.

**Examples:**

Add to `~/.bash_profile` (macOS/Linux) or `C:/Users/NAME/.bash_profile` (Windows):

```bash
alias pro='cd /d/projects'
alias gs='git status'
alias gl='git log --oneline -10'
```

Restart terminal after changes.

</details>

</details>


