
# Git — Version Control & Collaboration

Covers Git internals, daily workflow, branching strategies, remote sync, recovery, team practices, hooks, CI/CD integration, and interview Q&A.

Git is a **distributed version control system (DVCS)**. Every developer has a full copy of the project history locally. A remote server (GitHub, GitLab, Bitbucket) is a coordination hub — not the source of truth for all operations.

### Related docs

* [Interview hub](./0_interview.md) · [Build tooling](./10_build.md) · [What is CI/CD](./10_build.md#what-is-cicd) · [DevOps](./15_devops.md) · [Encryption / hashes](./7_special.md#encryption)
* [VS Code](./11_vsc_browser.md) · [Databases](./9_database.md)

[← Back to interview hub](./0_interview.md)

### Main concepts

| Area | Topics |
|------|--------|
| **Internals** | DAG, objects (blob/tree/commit/tag), SHA-1, refs, three trees |
| **Daily workflow** | Git CLI loop, `add`, `commit`, `stash`, `diff`, `status` |
| **Branching** | `branch`, `switch`/`checkout`, `merge`, `rebase`, `cherry-pick` |
| **Remote** | `fetch`, `pull`, `push`, upstream, fork sync |
| **History** | `log`, `show`, `blame`, `reflog`, `bisect` |
| **Recovery** | `reset` modes, `revert`, `reflog` |
| **Team workflow** | PR/MR, code review, Git Flow, trunk-based |
| **Tooling** | hooks, `.gitignore`, `.gitattributes`, CI/CD |
| **Security** | signed commits, protected branches |

## Resources & links

<details>
  <summary>Primary references</summary>

* [Git official site](https://git-scm.com/)
* [Pro Git book](https://git-scm.com/book/en/v2)
* [GitHub Docs — Using Git](https://docs.github.com/en/get-started/using-git)
* [Atlassian Git tutorials](https://www.atlassian.com/git/tutorials/what-is-version-control)
* [Atlassian Git glossary](https://www.atlassian.com/git/glossary)
* [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
* [Essential Git cheatsheet (ByteByteGo)](https://blog.bytebytego.com/i/162154465/essential-git-cheatsheet)
* [Commit style guide (Eric VonB)](https://gist.github.com/ericavonb/3c79e5035567c8ef3267)

</details>

<details>
  <summary>Videos & courses</summary>

### Videos & courses

* [Git course playlist](https://www.youtube.com/playlist?list=PLDyvV36pndZFHXjXuwA_NywNrVQO0aQqb)
* [Basic Git commands](https://www.youtube.com/watch?v=EsA-9E0umCo)
* [GitHub Pages deploy](https://www.youtube.com/watch?v=dLX40HYzETY)

</details>

<details>
  <summary>SSH setup</summary>

### SSH setup

Protocol, `authorized_keys`, `sshd_config`, and server hardening: [DevOps — SSH](./15_devops.md#ssh). This block is GitHub/Git remotes only.

* [Git — Generating SSH keys](https://git-scm.com/book/en/v2/Git-on-the-Server-Generating-Your-SSH-Public-Key)
* [GitHub — Generating a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
* [GitHub — Adding a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"

# macOS / Windows / Linux clipboard
pbcopy < ~/.ssh/id_ed25519.pub
clip < ~/.ssh/id_ed25519.pub
xclip -selection clipboard < ~/.ssh/id_ed25519.pub

# or: gh ssh-key add ~/.ssh/id_ed25519.pub --title "laptop"
```

GitHub UI: **Settings → SSH and GPG keys → New SSH key** — paste the **`.pub`** file only. Remote URL: `git@github.com:user/repo.git`.

</details>

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Fundamentals](#fundamentals)
- [Workflow](#workflow) — [Git CLI daily loop](#workflow)
- [Branching & merge](#branching)
- [Remote](#remote)
- [Recovery](#recovery)
- [Team practices](#team)
- [Hooks & tooling](#hooks-tooling)
- [Advanced topics](#advanced)
- [Interview Practice](#interview-practice)
- [Appendix — Shell basics](#appendix-shell)

### Git internals & DAG

**Definition:**

Git stores project history as a **directed acyclic graph (DAG)** of immutable **commit** objects. Each commit points to a **tree** (directory snapshot) and one or more parent commits. Objects are content-addressed by **SHA-1** hashes and live in `.git/objects/`.

| Object | Contains |
|--------|----------|
| **Blob** | File content |
| **Tree** | Directory listing (names → blob/tree hashes) |
| **Commit** | Tree hash, parent(s), author, committer, message |
| **Tag** | Pointer to commit + optional GPG signature |

| Tree | Location | Role |
|------|----------|------|
| **Working directory** | Project files on disk | Where you edit |
| **Index (staging area)** | `.git/index` | What goes into the next commit |
| **Repository** | `.git/` | Commits, branches, tags, full history |

**When to use:** Understanding internals helps with recovery (`reflog`), conflict resolution, and knowing why `rebase` rewrites history. Object IDs are **cryptographic hashes of content** (collision-resistant addressing). That is integrity, not password hashing — [Encryption](./7_special.md#encryption).

**Examples:**

```bash
git cat-file -t HEAD          # type: commit
git cat-file -p HEAD          # pretty-print commit object
git log --graph --oneline --all
```

**Sources:** [Pro Git — Git Internals](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain) · [git-scm.com](https://git-scm.com/)

### Daily workflow

**Definition:**

The standard edit → stage → commit cycle moves changes through the three trees. `git add` copies changes from working directory to index; `git commit` freezes the index into a new commit in the repository.

| State | Description |
|-------|-------------|
| Untracked | Not in Git yet |
| Modified | Changed in working directory |
| Staged | Added to index, ready to commit |
| Unmodified | Same as last commit |

**When to use:** Every day — feature work, bug fixes, documentation updates. Stage selectively with `git add -p` for atomic commits. Full command loop: [Git CLI daily workflow](#workflow).

**Examples:**

```bash
git status
git diff                          # working dir vs index
git add -p path/to/file           # stage hunks interactively
git commit -m "feat: add login form"
```

**Sources:** [Pro Git — Recording Changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)

### Branching & merge

**Definition:**

A **branch** is a movable pointer to a commit. **Merge** combines branch histories (optionally creating a merge commit); **rebase** replays commits onto another base for a linear history.

| | `git merge` | `git rebase` |
|---|-------------|--------------|
| History | Preserves branch topology | Linear replay of commits |
| Merge commit | Yes (unless fast-forward) | No |
| Rewrites SHAs | No | Yes |
| Safe on shared branches | Yes | **No** — rewrites history |

**When to use:**

Branch for every feature/fix. Merge into shared branches after review. Rebase **local/private** branches before opening a PR.

Never rebase commits others have already pulled. Never `reset --hard` on shared branches.

**Examples:**

```bash
git switch -c feature/login
# ... work, commit ...
git fetch origin
git rebase origin/main          # update feature branch (local only)
git switch main && git merge feature/login
```

**Sources:**

[Pro Git — Branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell) · [Pro Git — Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)

---

<a name="fundamentals"></a>

## Fundamentals

<details>
  <summary>Version control types</summary>

### Version control types

**Definition:**

Version control tracks file changes over time so teams can collaborate, revert, and audit history.

| Type | Example | Characteristic |
|------|---------|----------------|
| Local | RCS | Single machine, file snapshots |
| Centralized | SVN, Perforce | One server; clients check out files |
| Distributed | Git, Mercurial | Full history on every clone |

**When to use:** Distributed VCS (Git) for modern software teams — offline work, cheap branching, full local history.

**Sources:** [Atlassian — What is version control](https://www.atlassian.com/git/tutorials/what-is-version-control)

</details>

<details>
  <summary>Three trees</summary>

### Three trees

**Definition:**

Git manages three distinct trees. Understanding them is the key to understanding every Git command.

| Tree | Location | Role |
|------|----------|------|
| **Working directory** | Project files on disk | Where you edit |
| **Index (staging area)** | `.git/index` | What goes into the next commit |
| **Repository** | `.git/` | Commits, branches, tags, full history |

**When to use:** Always — every `add`, `commit`, `diff`, and `restore` command moves data between these trees.

**Examples:**

```bash
# Two-step commit: working → index → repository
git add file.ts                   # working → index
git commit -m "feat: update file" # index → repository
```

**Sources:** [Pro Git — The Three Trees](https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified)

</details>

<details>
  <summary>File states</summary>

### File states

**Definition:**

Every tracked file is in one of four states relative to the last commit.

| State | Description |
|-------|-------------|
| Untracked | Not in Git yet |
| Unmodified | Same as last commit |
| Modified | Changed in working directory |
| Staged | Added to index, ready to commit |

**When to use:** Check with `git status` before every commit to know what will be included.

**Examples:**

```bash
git status -s
#  M file.ts    — modified, not staged
# M  file.ts    — staged
# ?? new.ts     — untracked
```

**Sources:** [Pro Git — File Status Lifecycle](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)

</details>

<details>
  <summary>Object model</summary>

### Object model

**Definition:**

Git stores **snapshots**, not diffs. Four object types live in `.git/objects/`. Each object is addressed by a **SHA-1 hash**. Commits form a **DAG** via parent pointers and are **immutable**.

| Object | Contains |
|--------|----------|
| **Blob** | File content |
| **Tree** | Directory listing (names → blob/tree hashes) |
| **Commit** | Tree hash, parent(s), author, committer, message |
| **Tag** | Pointer to commit + optional GPG signature |

**When to use:** Useful when inspecting history at the plumbing level or debugging corrupt repos with `git fsck`.

**Examples:**

```bash
git rev-parse HEAD                # commit SHA
git cat-file -p HEAD^{tree}       # root tree of HEAD
git ls-tree HEAD                  # list files in HEAD tree
```

**Sources:** [Pro Git — Git Objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)

</details>

<details>
  <summary>Pointers (refs)</summary>

### Pointers (refs)

**Definition:**

Refs are labels that point to commits. Branches move; tags stay fixed.

| Ref | Meaning |
|-----|---------|
| `HEAD` | Current commit (or branch that points to current commit) |
| `ORIG_HEAD` | Where HEAD was before `merge`/`reset`/`rebase` |
| **Branch** | Movable pointer to a commit (`main`, `feature/foo`) |
| **Tag** | Fixed pointer to a commit (`v1.0.0`) |
| **Detached HEAD** | HEAD points directly to a commit, not a branch |

**When to use:** `ORIG_HEAD` for undoing a bad merge; detached HEAD when checking out a specific commit for inspection.

**Examples:**

```bash
git switch --detach abc1234         # detached HEAD at commit
git switch main                     # re-attach HEAD to branch
```

**Sources:** [Pro Git — Git References](https://git-scm.com/book/en/v2/Git-Internals-Git-References)

</details>

<details>
  <summary>Git vs GitHub</summary>

### Git vs GitHub

**Definition:**

Git is the version control tool; GitHub/GitLab/Bitbucket are hosting and collaboration platforms built on top of Git.

| | Git | GitHub / GitLab / Bitbucket |
|---|-----|----------------------------|
| What | Version control tool (CLI) | Hosting + collaboration platform |
| Runs | Locally on your machine | Remote server |
| Stores | Full history in `.git/` | Remote copy of repo + PRs, CI, issues |

**When to use:** Git for all local version control; remote platform for team coordination, PRs, and CI/CD.

**Sources:** [GitHub Docs — Using Git](https://docs.github.com/en/get-started/using-git)

</details>

---

<a name="workflow"></a>

## Workflow

<details>
  <summary>Git CLI daily workflow</summary>

### Git CLI daily workflow

**Definition:** Git CLI is the terminal interface to Git — the portable tool on servers and CI where there is no GUI. GUIs (GitHub Desktop, GitKraken, Sourcetree, Fork, Tower, Sublime Merge) are optional; the same commands run everywhere.

**How it works:**

Teams share a **remote** repository (hosted copy, not “deleted”). Each developer clones it, works on a **branch**, stages, commits, pushes for review, then merges and deletes the branch.

Typical loop:

1. **Clone** once, then **pull** later to integrate remote updates.
2. **Branch** from current HEAD so parallel work collides less.
3. **Edit** files; **status** to see untracked / modified / staged.
4. **`git add`** copies working-tree changes into the index (new files are untracked until added).
5. **`git commit`** freezes the index into history.
6. **`git push`** publishes the branch; first push of a new branch needs an upstream (`-u`).
7. After review, **merge** into the integration branch, then **delete** the feature branch.

A **conflict** is when two people changed the same lines — Git cannot pick a winner automatically.

Child branches keep the history of the parent **at the moment they were created**. Later parent commits are not inherited until you merge (or rebase) them in; child commits stay off the parent until you merge the other way.

**When to use:**

Daily feature work; SSH sessions and CI; teaching a shared command vocabulary.

#### Common pitfalls

* `git pull --all` fetches **all remotes**; it still only **integrates into the current branch** (merge or rebase of that branch’s upstream). It does not update every local branch.
* `git add .` is relative to the **current directory**. `git add --all` / `-A` updates the index for the **whole working tree** (additions, modifications, deletions).
* Bare `git push` needs a configured upstream (`push.default` is `simple` since Git 2.0). Git prints `git push -u origin <branch>` when missing.
* `git switch` exists since **Git 2.23**; `checkout` still works but also does restore/detach work. Prefer `switch` / `restore`.
* On case-insensitive disks (`core.ignorecase`, typical macOS/Windows), renaming `Git-CLI` → `git-cli` may look like a no-op. Use `git mv`:

```bash
git mv Git-CLI tmp && git mv tmp git-cli
```

**Pluses and minuses:**

| + | − |
|------|------|
| Same commands on every OS and server | Easy to run destructive flags (`reset --hard`) |
| Scriptable, works without a GUI | New-branch `push` fails until upstream is set |
| Precise staging (`add -p`) | Case-only renames can be invisible on macOS/Windows |

**Examples:**

```bash
# First copy of the remote (SSH or HTTPS)
git clone git@github.com:org/repo.git
cd repo

# Later: fetch all remotes, then merge the current branch's upstream
git pull --all

# Branch (Git 2.23+: switch; older Git: checkout)
git switch -c new-user-profile      # create + switch
# equivalent: git branch new-user-profile && git switch new-user-profile
# pre-2.23:   git checkout -b new-user-profile

git status
git add filename.js                 # or: git add .   (this directory tree)
git add --all                       # entire working tree: add, modify, delete
git commit                          # opens editor for the message
git commit -m "feat: rename getUser"

git push                            # may print the -u command if no upstream
git push -u origin new-user-profile

# Integrate parent into the feature branch, then feature into main
git merge main                      # while on new-user-profile
git switch main
git merge new-user-profile
git branch -d new-user-profile      # delete after it is merged
```

**Thoughts:** Clone → branch → stage → commit → push → merge → delete branch. GUI is comfort; CLI is the contract.

**Sources:** [Pro Git — Recording Changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository) · [git-switch](https://git-scm.com/docs/git-switch) · [git-add](https://git-scm.com/docs/git-add) · [git-push](https://git-scm.com/docs/git-push) · [git-pull](https://git-scm.com/docs/git-pull)

</details>

<details>
  <summary>Initial configuration</summary>

### Initial configuration

**Definition:** One-time setup for identity, default branch, pull strategy, and line endings.

**When to use:** On first Git install on a new machine.

**Examples:**

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global pull.rebase false   # or true for rebase-on-pull

# Windows line endings
git config --global core.autocrlf true

# macOS / Linux
git config --global core.autocrlf input
```

**Sources:** [Pro Git — First-Time Git Setup](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)

</details>

<details>
  <summary>Vim in Git output</summary>

### Vim in Git output

**Definition:**

Long output (`git log -p`, interactive rebase) opens Vim as the default pager/editor.

| Key / command | Action |
|---------------|--------|
| `Esc` | Command mode |
| `i` | Insert mode |
| `:q` | Quit |
| `:q!` | Quit without saving |
| `:wq` | Save and quit |

**When to use:** Whenever Git opens an editor for commit messages or interactive rebase.

**Sources:** [Pro Git — Git Configuration](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration)

</details>

<details>
  <summary>Commit conventions</summary>

### Commit conventions

**Definition:**

Structured commit messages make history searchable and enable automated changelogs. Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

| Prefix | When to use | Example |
|--------|-------------|---------|
| `init:` | Start project/sprint/task | `init: start sprint-1` |
| `feat:` | New functionality | `feat: implement search box` |
| `fix:` | Bug fix | `fix: relayout header for firefox` |
| `refactor:` | No behavior change | `refactor: rename vars for readability` |
| `docs:` | Documentation only | `docs: update readme` |
| `chore:` | Tooling, deps | `chore: bump eslint` |
| `test:` | Tests only | `test: add login unit tests` |
| `ci:` | CI/CD config | `ci: add deploy workflow` |

**When to use:** Every commit on team projects. Use imperative mood: `add feature` not `added feature`.

**Examples:**

```bash
git commit -m "feat!: remove legacy auth endpoint"
# Breaking change: append ! or add BREAKING CHANGE: in footer
```

**Sources:** [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) · [Commit style guide (Eric VonB)](https://gist.github.com/ericavonb/3c79e5035567c8ef3267)

</details>

<details>
  <summary>Create repository & clone</summary>

### Create repository & clone

**Definition:** `git init` creates a new local repository; `git clone` copies an existing remote repository including full history.

**When to use:** `init` for new projects; `clone` when joining an existing project or setting up CI. Daily loop: [Git CLI daily workflow](#workflow).

**Examples:**

```bash
git init                          # init in current directory
git init folder-name              # init in specified directory

git clone git@github.com:user/repo.git
git clone https://github.com/user/repo.git
git clone https://github.com/user/repo.git FolderName
git clone https://github.com/user/repo.git .   # into current dir
git clone --depth 1 URL           # shallow clone (CI)
```

**Sources:** [Pro Git — Getting a Git Repository](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository)

</details>

<details>
  <summary>Inspect changes</summary>

### Inspect changes

**Definition:** `git status` and `git diff` show what changed and where — working directory, index, or between branches.

**When to use:** Before every commit and when reviewing PRs locally.

**Examples:**

```bash
git status
git diff                          # working dir vs index
git diff --staged                 # index vs HEAD (staged changes)
git diff HEAD                     # working dir vs HEAD
git diff --color-words
git diff main feature             # compare branches
git diff main...feature           # changes on feature since divergence
git diff --name-only main feature
```

**Sources:** [Pro Git — Viewing Your Commit History](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History)

</details>

<details>
  <summary>Stage changes</summary>

### Stage changes

**Definition:** `git add` copies changes from the working directory into the index (staging area). New files stay **untracked** until added. Ignored paths are skipped unless `-f`.

**When to use:** Before every commit. Use `-p` for selective hunk staging.

**Examples:**

```bash
git add path/to/file
git add .                         # this directory and below
git add --all                     # whole working tree: add, modify, delete (-A)
git add -u                        # tracked files only (no new untracked)
git add -p                        # interactive hunk staging
git add -i                        # interactive shell
```

**Sources:** [Pro Git — Recording Changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)

</details>

<details>
  <summary>Unstage & discard</summary>

### Unstage & discard

**Definition:** Unstage with `restore --staged` or `reset`; discard working changes with `restore`. `reset --hard` and `clean` permanently destroy uncommitted work.

**How it works:** `git reset --hard` permanently discards all uncommitted changes in tracked files. `git clean -df` removes untracked files — also irreversible.

**When to use:** Unstage when you added too much; discard when you want to throw away local edits. **Never** use `--hard` unless you are certain.

**Examples:**

```bash
git restore --staged file         # unstage (modern)
git reset file                    # unstage (classic)
git restore file                  # discard working changes (modern)
git checkout -- file              # discard working changes (classic)
git clean -df                     # remove untracked files/dirs
git reset --hard                  # DANGER: discard all uncommitted changes
```

**Sources:** [Pro Git — Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things)

</details>

<details>
  <summary>Commit</summary>

### Commit

**Definition:** `git commit` freezes the index into a new immutable commit object in the repository.

**When to use:** When a logical unit of work is complete and staged. Amend only unpushed commits. Bare `git commit` opens the configured editor; `-m` is for a short one-line message.

**Examples:**

```bash
git commit                        # editor for the message
git commit -m "feat: add login form"
git commit -a -m "fix: typo"      # stage tracked files only, then commit
git commit --amend -m "new message"   # rewrite last commit (unpushed only!)
git commit --signoff              # DCO sign-off line
```

**Sources:** [Pro Git — Recording Changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)

</details>

<details>
  <summary>Stash</summary>

### Stash

**Definition:** `git stash` temporarily shelves uncommitted changes so you can switch branches without committing WIP.

**When to use:** Urgent context switch, pull with dirty working tree, or saving experiments.

**Examples:**

```bash
git stash
git stash push -m "wip login"
git stash -u                        # include untracked
git stash list
git stash show -p stash@{0}
git stash apply stash@{0}
git stash pop
git stash drop stash@{0}
git stash branch feature/wip stash@{0}
```

**Sources:** [Pro Git — Stashing and Cleaning](https://git-scm.com/book/en/v2/Git-Tools-Stashing-and-Cleaning)

</details>

<details>
  <summary>History & blame</summary>

### History & blame

**Definition:** `git log`, `git show`, and `git blame` inspect commit history and line-by-line authorship.

**When to use:** Debugging regressions, understanding code ownership, preparing release notes.

**Examples:**

```bash
git log --oneline -10
git log --graph --oneline --all
git log -p -5
git log --since=2.weeks
git log --grep "fix" -i
git log -S "functionName" -p       # pickaxe: commits changing string
git log main..feature              # commits on feature not in main
git show abc123
git show HEAD~2:path/file         # file content at commit
git blame file.ts -L 10,20
```

Press `q` to exit long pager output.

**Sources:** [Pro Git — Viewing the Commit History](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History)

</details>

<details>
  <summary>Remove & move files</summary>

### Remove & move files

**Definition:** `git rm` stops tracking and deletes files; `git mv` renames with history preserved. `--cached` removes from index only.

**When to use:**

Deleting features, renaming modules, untracking secrets accidentally added.

#### Common pitfalls

A case-only rename in Finder/Explorer often produces an empty commit. Two-step `git mv` (or `git mv -f Old old` on some setups) records the change.

**Examples:**

```bash
git rm file.txt
git rm -r folder/
git rm --cached secret.env        # stop tracking; keep file on disk
git mv old.txt new.txt

# Case-only rename on case-insensitive FS (macOS/Windows, core.ignorecase)
git mv Git-CLI tmp && git mv tmp git-cli
```

**Sources:** [Pro Git — Recording Changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)

</details>

---

<a name="branching"></a>

## Branching & merge

<details>
  <summary>Branches</summary>

### Branches

**Definition:** A branch is a movable pointer to a commit. Creating branches is cheap — they are just refs, not file copies.

**When to use:** One branch per feature, fix, or experiment. Delete after merge.

**Examples:**

```bash
git branch
git branch -v
git branch feature/foo
git branch -d feature/foo           # delete merged branch
git branch -D feature/foo           # force delete
git branch -m old-name new-name
git branch --merged
git branch --no-merged
git branch -a                       # include remotes
```

**Sources:** [Pro Git — Branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)

</details>

<details>
  <summary>Switch commits & branches</summary>

### Switch commits & branches

**Definition:** `git switch` (Git **2.23+**) or `checkout` (classic) moves HEAD to a branch or specific commit. `checkout` also restores files and detaches HEAD; `switch` is the dedicated branch command.

**When to use:** Daily branch switching. Use `--detach` only for temporary inspection.

**Examples:**

```bash
git switch main                   # switch branch (modern)
git checkout main                 # switch branch (classic)
git switch -c feature/foo         # create + switch
git checkout -b feature/foo
git switch -c fix abc123          # branch from specific commit
git switch --detach abc123        # detached HEAD at commit
```

**Sources:** [git-scm.com — git-switch](https://git-scm.com/docs/git-switch) · [git-checkout](https://git-scm.com/docs/git-checkout)

</details>

<details>
  <summary>Merge</summary>

### Merge

**Definition:**

`git merge` integrates another branch into the current branch. Creates a merge commit unless fast-forward is possible.

| Strategy | Result | When |
|----------|--------|------|
| **Fast-forward** | Branch pointer moves; no merge commit | Linear history, no divergent commits |
| **3-way merge** | New merge commit with two parents | Both branches have unique commits |
| **`--no-ff`** | Always create merge commit | Preserve branch context in history |
| **Squash merge** | All branch commits → one commit on target | Clean history; lose individual commits |

**When to use:** Integrating completed features into the current branch after review. Same command both ways: merge `main` **into** a feature branch to pick up new parent commits, or merge the feature **into** `main` to land the work. `git merge <name>` always merges **that** branch into **HEAD**.

**Examples:**

```bash
git merge feature                   # merge named branch into current
git merge main                      # update feature branch with parent
git merge feature --no-ff           # always create merge commit
git merge feature --squash          # squash into one commit (manual commit after)
git merge --abort
```

**Sources:** [Pro Git — Basic Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)

</details>

<details>
  <summary>Rebase</summary>

### Rebase

**Definition:** `git rebase` replays commits from one branch onto another base, producing a linear history with new commit SHAs.

**How it works:** Rebase **rewrites history**. Force-pushing a rebased branch overwrites remote commits teammates may have based work on. Golden rule: never rebase commits that others have pulled.

**When to use:**

Update a **local/private** feature branch onto latest `main` before opening a PR. Clean up WIP commits with interactive rebase.

On any branch others have pulled. Never rebase `main` or shared release branches.

**Examples:**

```bash
git rebase main
git rebase -i HEAD~3                # interactive: squash, reword, drop
git rebase --onto main feature old-base
git rebase --abort
git rebase --continue
git pull --rebase origin main
```

Interactive rebase actions: `pick`, `reword`, `squash`, `fixup`, `drop`.

**Sources:** [Pro Git — Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)

</details>

<details>
  <summary>Merge vs rebase</summary>

### Merge vs rebase

**Definition:**

Two strategies for integrating branch histories — merge preserves topology; rebase linearizes.

| | `git merge` | `git rebase` |
|---|-------------|--------------|
| History | Preserves branch topology | Linear replay of commits |
| Merge commit | Yes (unless FF) | No |
| Conflicts | Once at merge time | Per replayed commit |
| Safe on shared branches | Yes | **No** — rewrites history |
| Best for | Integrating completed features | Cleaning local branch before PR |

**When to use:** Merge for shared branches; rebase for private feature branches before PR.

**Examples:**

```bash
# Update feature branch with latest main (rebase — clean history)
git switch feature/foo
git fetch origin
git rebase origin/main

# Update feature branch with latest main (merge — safe, preserves history)
git merge origin/main
```

**Sources:** [Pro Git — Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)

</details>

<details>
  <summary>Cherry-pick</summary>

### Cherry-pick

**Definition:** `git cherry-pick` applies a specific commit from another branch onto the current branch.

**When to use:** Backporting a fix, bringing one commit without merging entire branch.

**Examples:**

```bash
git cherry-pick abc123
git cherry-pick main~2..main
git cherry-pick -n abc123         # stage without committing
git cherry-pick --abort
git cherry-pick --continue
```

**Sources:** [Pro Git — Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)

</details>

<details>
  <summary>Tags</summary>

### Tags

**Definition:** Tags are fixed pointers to commits, typically marking releases. Annotated tags store metadata and are recommended for releases.

**When to use:** Release versioning (`v1.0.0`). Lightweight tags for temporary bookmarks.

**Examples:**

```bash
git tag v1.0.0                      # lightweight
git tag -a -m "Release" v1.0.1      # annotated (recommended for releases)
git tag -d v1.0.0
git push origin v1.0.1
git push origin --tags
```

**Sources:** [Pro Git — Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)

</details>

<details>
  <summary>Git Flow</summary>

### Git Flow

**Definition:**

A branching model with long-running `main` and `develop` branches plus short-lived feature, release, and hotfix branches.

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready |
| `develop` | Integration branch |
| `feature/*` | New features off develop |
| `release/*` | Release prep off develop |
| `hotfix/*` | Urgent fixes off main |

**When to use:** Scheduled releases with version numbers. Heavy for continuous deployment teams.

**Sources:** [Atlassian — Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

</details>

<details>
  <summary>GitHub Flow & trunk-based</summary>

### GitHub Flow & trunk-based

**Definition:**

Simpler models optimized for continuous integration and deployment.

| Model | Pattern |
|-------|---------|
| **GitHub Flow** | `main` + short-lived feature branches → PR → merge → deploy |
| **Trunk-based** | Everyone commits to `main` (or merges daily); feature flags hide incomplete work |

**When to use:** Teams deploying multiple times per day. Prefer trunk-based over Git Flow for CI/CD pipelines. How this sits in the delivery loop: [10_build.md — What is CI/CD](./10_build.md#what-is-cicd).

**Sources:** [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow) · [trunkbaseddevelopment.com](https://trunkbaseddevelopment.com/)

</details>

<details>
  <summary>Interactive rebase & squash</summary>

### Interactive rebase & squash

**Definition:** `git rebase -i` lets you reorder, squash, reword, or drop commits before merging.

**When to use:** Clean up WIP commits (`wip`, `fix typo`) into one logical commit before opening a PR. Only on unpushed or private history.

**Examples:**

```bash
git rebase -i origin/main
```

In the editor:

```
pick abc1234 feat: add form validation
squash def5678 wip
squash ghi9012 fix typo
reword jkl3456 feat: add login form
```

| Action | Effect |
|--------|--------|
| `squash` | Merge into previous commit; combine messages |
| `fixup` | Merge into previous; discard this message |
| `pick` | Keep as-is |
| `drop` | Remove commit |

**Sources:** [Pro Git — Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)

</details>

---

<a name="remote"></a>

## Remote

<details>
  <summary>Remote repositories</summary>

### Remote repositories

**Definition:** Remotes are named references to other repositories. `origin` is the default remote for your fork/clone; `upstream` is commonly used for the original repo when working from a fork.

**When to use:** Daily push/pull. Prefer SSH after key setup ([SSH setup](#ssh-setup); protocol: [DevOps — SSH](./15_devops.md#ssh)).

**Examples:**

```bash
git remote -v
git remote add origin git@github.com:user/repo.git
git remote add upstream git@github.com:original/repo.git
git remote remove origin
git fetch origin
git fetch origin main
git fetch --all --prune
git push origin main
git push -u origin feature/foo      # set upstream
git push --force-with-lease         # safer force push
git pull origin main
git pull --rebase origin main
git branch --set-upstream-to=origin/main
```

**Sources:** [Pro Git — Working with Remotes](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)

</details>

<details>
  <summary>Fetch vs pull vs push</summary>

### Fetch vs pull vs push

**Definition:**

`fetch` downloads remote changes without merging; `pull` fetches and integrates; `push` sends local commits to remote.

| Command | Fetch remote? | Update local branch? | Merge/rebase? |
|---------|---------------|----------------------|---------------|
| `git fetch` | Yes | No | No |
| `git pull` | Yes | Yes | Yes (merge or rebase) |
| `git push` | No | No | Sends local commits to remote |

**When to use:** `fetch` when you want to inspect remote changes before integrating: `git log main..origin/main`. `git pull --all` fetches every remote, then still only integrates the **current** branch.

**Examples:**

```bash
git fetch origin
git fetch --all --prune
git pull --all                    # fetch all remotes, then merge/rebase current upstream
git log main..origin/main         # what's new on remote
git merge origin/main             # integrate after review
```

**Sources:** [Pro Git — Working with Remotes](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)

</details>

<details>
  <summary>Sync fork with upstream</summary>

### Sync fork with upstream

**Definition:** Keep your fork current with the original repository by fetching from `upstream` and merging into your `main`.

**When to use:** Before starting new work on a forked open-source project.

**Examples:**

```bash
git remote add upstream git@github.com:original/repo.git
git fetch upstream
git switch main
git merge upstream/main
git push origin main
```

**Sources:** [GitHub — Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)

</details>

<details>
  <summary>Force push</summary>

### Force push

**Definition:** Overwrites remote branch history with your local branch. `--force-with-lease` is safer than `--force` because it fails if the remote has commits you haven't seen.

**When to use:** After rebasing your own feature branch before PR update. Never on shared branches.

**Examples:**

```bash
git push --force-with-lease origin feature/foo
```

Enable **protected branches** on `main` to block force pushes entirely.

**Sources:** [git-scm.com — git-push](https://git-scm.com/docs/git-push)

</details>

---

<a name="recovery"></a>

## Recovery

<details>
  <summary>Undo commits & reset</summary>

### Undo commits & reset

**Definition:**

`git reset` moves the branch pointer and optionally resets index/working tree. `git revert` creates a new commit that undoes a previous one — safe for shared history.

| Mode | Branch | Index | Working tree |
|------|--------|-------|--------------|
| `--soft` | moves back | unchanged | unchanged |
| `--mixed` (default) | moves back | reset | unchanged |
| `--hard` | moves back | reset | reset |

**How it works:** `git reset --hard` permanently destroys uncommitted changes and moves the branch pointer. On shared branches, use `revert` instead.

**When to use:** `reset` for unpushed local commits only. `revert` for pushed/shared commits.

**Examples:**

```bash
# Pushed commits — use revert (safe)
git revert HEAD --no-edit
git revert abc123 --no-edit
git revert -m 1 merge_commit      # revert merge (keep mainline parent 1)

# Unpushed commits only
git reset --soft HEAD~1           # move branch back; keep staged + working changes
git reset HEAD~1                  # mixed (default): unstage, keep working changes
git reset --hard HEAD~1           # DANGER: discard everything
git reset --keep HEAD~1           # safer hard reset; aborts if working tree conflicts
git reset --hard abc123
```

**Sources:** [Pro Git — Reset Demystified](https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified) · [Pro Git — Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things)

</details>

<details>
  <summary>Revert vs reset</summary>

### Revert vs reset

**Definition:**

Two ways to undo history — revert is non-destructive; reset rewrites branch position.

| | `revert` | `reset` |
|---|----------|---------|
| Creates new commit | Yes | No |
| Safe on pushed history | Yes | No (rewrites) |
| Use when | Public/shared branch | Local-only commits |

**When to use:** Always prefer `revert` on `main` or any branch teammates use.

**Sources:** [Pro Git — Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things)

</details>

<details>
  <summary>Restore file from history</summary>

### Restore file from history

**Definition:** Recover a file's content from a specific commit without checking out the entire commit.

**When to use:** Accidental deletion, need to restore one file from a known good commit.

**Examples:**

```bash
git restore --source=abc123 -- path/file
git checkout abc123 -- path/file  # classic equivalent
```

**Sources:** [git-scm.com — git-restore](https://git-scm.com/docs/git-restore)

</details>

<details>
  <summary>Reflog</summary>

### Reflog

**Definition:** Reflog records where HEAD and branch tips have been. It is your safety net for recovering "lost" commits and deleted branches.

**When to use:** After accidental `reset --hard`, deleted branch, or failed rebase.

**Examples:**

```bash
git reflog -20
git reflog show feature-branch
# find SHA → git branch recovered abc123
```

**Sources:** [Pro Git — Reflog](https://git-scm.com/book/en/v2/Git-Internals-The-Ref-Log)

</details>

<details>
  <summary>Recovery playbook</summary>

### Recovery playbook

**Definition:**

Quick reference for common disaster scenarios.

| Situation | Command |
|-----------|---------|
| Undo last commit, keep changes | `git reset --soft HEAD~1` |
| Undo last commit, discard changes | `git reset --hard HEAD~1` |
| Undo pushed commit safely | `git revert HEAD` |
| Recover deleted branch | `git reflog` → `git branch recovered abc123` |
| Abort bad merge | `git merge --abort` |
| Abort bad rebase | `git rebase --abort` |
| Undo bad merge on main | `git branch -f main ORIG_HEAD` |
| Restore file from old commit | `git restore --source=abc123 -- file` |

**When to use:** Bookmark this table — you will need it at 5 PM on a Friday.

**Sources:** [Pro Git — Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things)

</details>

<details>
  <summary>Merge conflicts</summary>

### Merge conflicts

**Definition:** Conflicts occur when Git cannot auto-merge changes to the same lines. You must manually resolve markers (`<<<<<<<`, `=======`, `>>>>>>>`) and stage the result.

**When to use:** During `merge`, `rebase`, or `cherry-pick` when both sides edited the same region.

**Examples:**

```bash
git merge feature
git merge-base main feature
git checkout --ours file            # keep current branch version
git checkout --theirs file          # keep incoming branch version
git merge --abort
git restore --conflict=diff3 --merge file   # show 3-way conflict markers
# edit file, remove markers, then:
git add file
git commit -m "fix: resolve merge conflict"
```

**Sources:** [Pro Git — Basic Merge Conflicts](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)

</details>

<details>
  <summary>Bisect</summary>

### Bisect

**Definition:** `git bisect` performs a binary search through commit history to find the commit that introduced a bug.

**When to use:** Regression with unknown cause — "it worked last week."

**Examples:**

```bash
git bisect start
git bisect bad                      # current commit is broken
git bisect good abc123              # this commit was fine
# test, then mark good/bad until found
git bisect reset

# Automated:
git bisect run npm test
```

**Sources:** [Pro Git — Debugging with Git](https://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git)

</details>

<details>
  <summary>Worktrees</summary>

### Worktrees

**Definition:** `git worktree` lets you check out multiple branches in separate directories from the same repository.

**When to use:** Hotfix while feature work is in progress — no stash/switch needed.

**Examples:**

```bash
git worktree add ../hotfix hotfix-branch
git worktree list
git worktree remove ../hotfix
```

**Sources:** [git-scm.com — git-worktree](https://git-scm.com/docs/git-worktree)

</details>

---

<a name="team"></a>

## Team practices

<details>
  <summary>PR / MR lifecycle</summary>

### PR / MR lifecycle

**Definition:** Pull Requests (GitHub) / Merge Requests (GitLab) are the standard workflow for proposing, reviewing, and merging code changes.

**When to use:** Every change to shared branches (`main`, `develop`).

**Examples:**

1. **Create branch** from `main` / `develop`
2. **Commit** atomically with clear messages
3. **Push** and open Pull Request (PR) / Merge Request (MR)
4. **Review** — teammates comment, request changes
5. **CI** — tests, lint, build run on branch
6. **Merge** into target branch after approval
7. **Delete** feature branch

![git flow](https://github.com/training-018/git-bash/blob/main/git_flow.jpeg)

PRs enable discussion before code lands on shared branches. Push additional commits during review; they appear in the PR automatically.

**Sources:** [GitHub — About pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)

</details>

<details>
  <summary>Git hygiene</summary>

### Git hygiene

**Definition:** Team conventions that keep repository history clean, secure, and reviewable.

**When to use:**

Always on team projects.

| Practice | Why |
|----------|-----|
| Atomic commits | One logical change per commit — easy to revert |
| Conventional commits | Searchable history, auto-changelog |
| Branch naming | `feature/`, `fix/`, `chore/` prefixes |
| Small PRs | Easier review, faster merge (< 400 lines ideal) |
| Rebase before PR | Linear, reviewable history |
| Never force-push shared branches | Prevents overwriting teammates' work |
| No secrets in repo | Use `.gitignore`, secret scanning |
| Signed commits | Verify authorship on sensitive repos |
| Delete merged branches | Reduce clutter locally and remotely |

**Sources:** [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

</details>

<details>
  <summary>Practical scenarios</summary>

### Practical scenarios

**Definition:**

End-to-end recipes for common real-world Git situations.

#### First repository setup

```bash
git init
touch readme.md
git add readme.md
git commit -m "init: project start"
git remote add origin git@github.com:user/repo.git
git push -u origin main
```

#### Amend last commit (unpushed)

```bash
# edit files
git add .
git commit --amend -m "feat: complete header task"
```

#### Hotfix while feature in progress

```bash
git switch -c feature/new-header
# work on header...
git commit -am "feat: update logo"

# urgent footer bug
git switch main
# fix footer
git commit -am "fix: correct contact in footer"
git push

git switch feature/new-header
git merge main              # or rebase onto main
```

#### Undo bad merge

```bash
git switch main
git merge fix-branch
# broken — roll back
git switch fix-branch       # must leave main to move it
git branch -f main ORIG_HEAD
```

#### Committed to wrong branch (unpushed)

```bash
git switch -c feature/correct-branch
git switch main
git reset --hard HEAD~1
git switch feature/correct-branch
```

#### Clean history before PR

```bash
git fetch origin
git rebase -i origin/main
git push --force-with-lease origin feature/foo
```

**Sources:** [Pro Git book](https://git-scm.com/book/en/v2)

</details>

<details>
  <summary>Quick fixes</summary>

### Quick fixes

**Definition:**

Short solutions for recurring Git annoyances.

#### Pull with merge instead of rebase

```bash
git fetch origin develop
git merge origin/develop
```

Avoid `git pull --force` — use `fetch` + `merge` or `pull --rebase` intentionally.

#### Revert merge commit

```bash
git revert -m 1 cc831fe
```

`-m 1` keeps the first parent (usually mainline).

#### GitHub asks for password on every push

Use SSH keys or credential helper: [GitHub credential caching](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git).

**Sources:** [GitHub Docs](https://docs.github.com/en/get-started/using-git)

</details>

<details>
  <summary>Signed commits</summary>

### Signed commits

**Definition:** GPG or SSH signing cryptographically verifies that a commit was made by you.

**When to use:** Production repos, open-source projects requiring verified commits, protected branch rules.

**Examples:**

```bash
git config --global user.signingkey KEY_ID
git config --global commit.gpgsign true
git commit -S -m "feat: secure change"
```

Verify on merge in protected branch rules. SSH signing also supported in Git 2.34+.

**Sources:** [GitHub — Signing commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)

</details>

---

<a name="hooks-tooling"></a>

## Hooks & tooling

<details>
  <summary>`.gitignore`</summary>

### `.gitignore`

**Definition:** Patterns that tell Git which files to never track.

**When to use:** From project day one — before first commit.

**Examples:**

```
node_modules/
dist/
build/
.idea/
.env
.env.local
*.log
.DS_Store
```

* Typical ignores: installable deps (`node_modules`), build output, IDE folders (`.idea`), secrets (`.env`, keys)
* One pattern per line; `#` for comments
* `!` negates: `*.log` then `!important.log`
* Global ignore: `git config --global core.excludesfile ~/.gitignore_global`
* Already tracked file: `git rm --cached file` then add to `.gitignore`

**Sources:** [git-scm.com — gitignore](https://git-scm.com/docs/gitignore)

</details>

<details>
  <summary>Git GUIs vs CLI</summary>

### Git GUIs vs CLI

**Definition:** Desktop clients visualize history, staging, and branches. They wrap the same Git operations as the CLI.

**When to use:** Local day-to-day work. Use CLI on servers, CI, and when teaching a shared command set. Daily command loop: [Git CLI daily workflow](#workflow).

**Examples:** GitHub Desktop, Sourcetree, GitKraken, Fork, Tower, Sublime Merge (licensing varies). VS Code Source Control and GitLens are in-editor GUIs.

**Thoughts:** Learn CLI; pick a GUI for comfort, not as a substitute on headless machines.

</details>

<details>
  <summary>`.gitattributes`</summary>

### `.gitattributes`

**Definition:** Per-path rules for line endings, diff drivers, and merge behavior.

**When to use:** Team projects with mixed OS environments.

**Examples:**

```
* text=auto eol=lf

*.html diff=html
*.css  diff=css
*.scss diff=css
*.png  binary
```

Renormalize after adding rules:

```bash
git add --renormalize .
git commit -m "chore: normalize line endings"
```

**Sources:** [git-scm.com — gitattributes](https://git-scm.com/docs/gitattributes)

</details>

<details>
  <summary>Line endings (CRLF vs LF)</summary>

### Line endings (CRLF vs LF)

**Definition:**

Windows uses CRLF (`\r\n`); Unix uses LF (`\n`). Mismatched line endings cause merge conflicts on every pull.

| OS | Default | Git setting |
|----|---------|-------------|
| Windows | CRLF | `core.autocrlf=true` |
| macOS/Linux | LF | `core.autocrlf=input` |

**When to use:** Fix team-wide before conflicts multiply (see interview Q1).

**Examples:**

```bash
# .gitattributes: * text=auto eol=lf
git add --renormalize .
git commit -m "chore: normalize line endings to LF"
```

**Sources:** [Pro Git — Customizing Git — Git Attributes](https://git-scm.com/book/en/v2/Customizing-Git-Git-Attributes)

</details>

<details>
  <summary>Git hooks</summary>

### Git hooks

**Definition:**

Scripts that run automatically at Git lifecycle events. Live in `.git/hooks/` or via tools like Husky.

| Hook | When | Typical use |
|------|------|-------------|
| `pre-commit` | Before commit | lint, format, typecheck |
| `commit-msg` | After message entered | enforce conventional commits |
| `pre-push` | Before push | run tests |

**When to use:** Enforce code quality gates before changes reach remote.

**Examples:**

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

**Sources:** [Pro Git — Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

</details>

<details>
  <summary>Submodules</summary>

### Submodules

**Definition:** Embed one Git repository inside another at a fixed commit.

**When to use:** Vendoring dependencies or monorepo-adjacent shared libraries. Prefer package managers when possible.

**Examples:**

```bash
git submodule add URL path
git submodule update --init --recursive
git clone --recurse-submodules URL
```

**Sources:** [Pro Git — Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

</details>

---

<a name="advanced"></a>

## Advanced topics

<details>
  <summary>Misc commands</summary>

### Misc commands

**Definition:** Utility commands for archiving, author stats, and repository integrity checks.

**When to use:** Release packaging, contributor reports, debugging corrupt repos.

**Examples:**

```bash
git archive -o project.zip HEAD
git shortlog -sn                    # commit counts per author
git fsck                            # verify repository integrity
```

**Sources:** [git-scm.com](https://git-scm.com/docs)

</details>

<details>
  <summary>Monorepo (brief)</summary>

### Monorepo (brief)

**Definition:** A single repository containing multiple packages or applications.

**When to use:**

Shared codebases with coordinated releases. Use path filters in CI to avoid building everything.

| Strategy | Tool / pattern |
|----------|----------------|
| Trunk-based + path filters | `paths:` in [GitHub Actions](./10_build.md#github-actions) |
| Sparse checkout | Clone only needed folders |
| Build orchestration | Nx, Turborepo, Lerna |

**Sources:** [Nx](https://nx.dev/) · [Turborepo](https://turbo.build/)

</details>

<details>
  <summary>Alternative VCS</summary>

### Alternative VCS

**Definition:**

Other version control systems with different trade-offs.

| System | Model | Trade-off |
|--------|-------|-----------|
| **SVN** | Centralized | Simple; no offline history; branching weaker |
| **Mercurial** | Distributed | Similar to Git; smaller ecosystem |
| **Perforce** | Centralized + large binaries | Game/film industry; complex |
| **Git** | Distributed | Industry standard; steep learning curve |

**When to use:** Git for web/frontend. SVN/Perforce in legacy enterprise or game studios.

**Sources:** [Atlassian — Git glossary](https://www.atlassian.com/git/glossary)

</details>

<details>
  <summary>CI/CD integration</summary>

### CI/CD integration

**Definition:** Git events (push, PR, tag) trigger automated build, test, and deploy pipelines. Concept: [10_build.md — What is CI/CD](./10_build.md#what-is-cicd). Workflow YAML: [10_build.md — YAML](./10_build.md#yaml).

**When to use:** Every team project — run lint/test on every PR; deploy tags to production.

**Examples:**

```yaml
# GitHub Actions — shallow fetch
- uses: actions/checkout@v4
  with:
    fetch-depth: 0   # full history for versioning/changelog

# Deploy on tag push
on:
  push:
    tags: ['v*']
```

* Cache `node_modules` keyed on lockfile hash
* Run lint/test on every PR
* Deploy `main` to staging; tags to production

**Sources:** [GitHub Actions — checkout](https://github.com/actions/checkout)

</details>

---

<a name="interview-practice"></a>

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

**Answer:** `clone` → `switch -c` (or `checkout -b`) → edit → `status` → `add` → `commit` → `push -u` → after review, checkout integration branch → `merge` → `branch -d`. Pull later with `git pull` (or `git pull --all` to fetch every remote, then integrate **current** upstream only). Full loop: [Git CLI daily workflow](#workflow).

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
