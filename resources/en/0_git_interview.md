# Git — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_git.md)

### Related docs

* [Git — Core](./0_git_core.md) · [Git — Branching](./0_git_branching.md) · [Git — Team](./0_git_team.md) · [Git — Interview](./0_git_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Git](https://devinterview.io/questions/web-and-mobile-development/git-interview-questions/).

### Git Fundamentals

<details>
<summary>What is Git and why is it used?</summary>

### What is Git and why is it used?

**Definition:**

Git is a distributed version-control system: every clone holds the project’s content and its history, so people can commit, branch, and inspect the past without a central server.

**How it works:**

- History is a graph of snapshots. You can return to an earlier commit or read the tree as it was then.
- Each object is named by a hash of its contents (SHA-1 by default, SHA-256 in repositories created for it), so a silent rewrite of stored data does not match the name.
- Collaborators work in parallel on branches and combine the results with merge or rebase.
- A review happens before a branch is integrated, because the change is a set of commits someone else can read.
- A commit records one snapshot, a branch is a movable name for a line of work, and a merge joins two lines. A remote such as `origin` is another repository this one knows how to fetch from and push to.
- The command line can do everything the model allows. A graphical client is the same operations with a different surface.
- Small commits, a message that says why, and a push before you stop are the habits that keep the history usable.

**Examples:**

```bash
git switch -c pay-invoice
git commit -am "Record the invoice total before tax"
git push -u origin pay-invoice
```

</details>

<details>
<summary>How does Git differ from other version control systems (VCS)?</summary>

### How does Git differ from other version control systems (VCS)?

**Definition:**

Git differs from older version-control systems mainly by being distributed, by storing snapshots, and by making branches cheap.

**How it works:**

- Every clone has the full history, so commit, diff, and log work offline. A centralized system such as Subversion needs the server for most of that.
- Common operations stay local and are fast because the history is already on disk.
- Object names are hashes of content, so corruption and a quiet edit of stored data are detectable. Many older systems had no such check.
- A branch is a pointer to a commit, not a copy of the tree, so people open short-lived branches as a normal step.
- History can be rearranged locally (rebase, squash) before it is published, which is how teams pick a workflow instead of inheriting one.
- The index, or staging area, lets a commit contain some of the current edits and not others.
- A commit stores a snapshot of the tree, not a delta against the previous file. The commit is atomic: it exists entirely or not at all.
- The same local history feeds CI, and the tool behaves the same way on Windows, macOS, and Linux.
- A single central server is a single point of failure, often numbers revisions with one increasing id, cannot prove files were not altered, blocks work when the network is down, and leaves unused branches sitting on that server.

**Examples:**

`svn commit` publishes to the central repository. `git commit` only records a snapshot locally; nothing else changes until `git push`.

</details>

<details>
<summary>What is the difference between Git and GitHub?</summary>

### What is the difference between Git and GitHub?

**Definition:**

Git is the version-control tool that records history on your machine. GitHub is a website that hosts Git repositories and adds collaboration around them.

**How it works:**

- Git works without a server. Commit, branch, and merge are local, and the staging area chooses what the next commit contains. Tracking is by content, not by a per-file revision number.
- GitHub stores a remote copy, so clones can push and fetch. Around that remote it adds issues, pull requests, reviews, permissions, and project boards.
- You can use Git with no GitHub, and you can host the same remote on GitLab, Bitbucket, or your own server. The commands do not change.

**Examples:**

```bash
git commit -am "Fix the total"
git push origin HEAD
```

The commit exists after the first command even if GitHub is down. The second command is what publishes it.

</details>

<details>
<summary>What is a repository in Git?</summary>

### What is a repository in Git?

**Definition:**

A Git repository is the project’s history plus the files you are editing now. Each collaborator has a full copy, not a view onto one central database.

**How it works:**

- Offline commit and log are possible because the history is local.
- Storage is content-addressed. Identical contents are stored once, and pack files compress the rest as deltas. That is an on-disk optimization, not the data model.
- Every object Git reads is checked against its hash.
- The `.git` directory holds the object database (commits, trees, blobs), the refs that name commits (branches and tags), and configuration.
- The working tree is the ordinary files you edit. It is not the history.

**Examples:**

```bash
git init invoices
# invoices/.git is the repository
# invoices/*.md is the working tree
```

</details>

<details>
<summary>Explain the concept of a commit in Git.</summary>

### Explain the concept of a commit in Git.

**Definition:**

A commit is one stored snapshot of the project, plus the metadata that says how it relates to the snapshots before it.

**How it works:**

- The commit points at a tree, which records the files and directories at that moment.
- It points at one or more parents. The first commit has none. A merge commit has two or more.
- Metadata is the author, the committer, the timestamps, and the message.
- The working directory is the files you edit. The staging area (index) is the snapshot you are assembling. The object database is the history once you commit.
- You change files, stage the ones that belong together, and commit. History is then read newest-first with `git log`.
- That snapshot is what you reset back to, what a teammate reviews, and what CI builds.

**Examples:**

```bash
git add src/tax.ts
git commit -m "Round tax half away from zero"
git log -1 --stat
```

</details>

<details>
<summary>What is the difference between a working directory, staging area, and repository in Git?</summary>

### What is the difference between a working directory, staging area, and repository in Git?

**Definition:**

Git keeps three copies of the work in flight: the working directory you edit, the staging area you assemble, and the repository history you have already committed.

**How it works:**

- The working directory is the files on disk. Edits here are unstaged until you add them.
- The staging area, or index, is the next commit. `git status` calls that section “Changes to be committed.”
- “Changes not staged for commit” are tracked files that differ from the index. Untracked files are not in the index at all.
- The repository is the commit graph under `.git`. A commit copies the index in as a new snapshot and moves the branch pointer forward.

**Examples:**

```text
edit notes.md          working directory only
git add notes.md       now in the index
git commit             now a snapshot in the repository
```

</details>

<details>
<summary>Define branching in Git and its importance.</summary>

### Define branching in Git and its importance.

**Definition:**

A branch is a named pointer to a commit. Creating one does not copy files, which is why parallel work is cheap.

**How it works:**

- The default branch (`main`, historically `master`) is the line the project treats as the integration point.
- A feature branch starts from that line and holds one change until it is ready.
- Merging joins the finished branch back. When both sides edited the same lines, the merge stops for a conflict and you record the resolution in a new commit.
- The branch pointer moves forward on each commit made while it is checked out. Other branches stay where they were.

**Examples:**

```bash
git switch -c fix-rounding
# edit, commit
git switch main
git merge fix-rounding
```

</details>

<details>
<summary>What is a HEAD in Git?</summary>

### What is a HEAD in Git?

**Definition:**

`HEAD` is the pointer to the commit that is currently checked out. Your next commit becomes a child of that commit.

**How it works:**

- When a branch is checked out, `HEAD` points at the branch name, and the branch points at the commit. A new commit moves the branch, and `HEAD` follows.
- In a detached `HEAD`, it points straight at a commit. A new commit is not on any branch unless you name one.
- The working directory and the index are filled from the tree of the commit `HEAD` refers to.
- `HEAD~1` is that commit’s first parent. `HEAD^2` is the second parent of a merge.

**Examples:**

```bash
git rev-parse --abbrev-ref HEAD   # main
git checkout --detach HEAD~2      # detached at an older commit
```

</details>

<details>
<summary>What does the clone operation in Git do?</summary>

### What does the clone operation in Git do?

**Definition:**

`git clone` copies a repository onto your machine and records the source as a remote named `origin`, so later fetch and push know where to go.

**How it works:**

- The local repository receives the objects and, by default, the branches and tags needed to reconstruct history.
- The working directory is checked out at the remote’s default branch.
- `origin` is configured as the remote URL. The local default branch tracks the matching remote branch.
- Object hashes are verified as they are transferred.
- A full clone is the normal case. A shallow clone (`--depth`) or a partial clone omits part of the history when the repository is large. That local copy cannot see the commits that were left behind.

**Examples:**

```bash
git clone https://example.com/billing.git
git remote -v
# origin  https://example.com/billing.git (fetch)
# origin  https://example.com/billing.git (push)
```

</details>

<details>
<summary>How does Git store information?</summary>

### How does Git store information?

**Definition:**

Git stores snapshots as objects addressed by the hash of their contents. A branch is only a name that points at one commit.

**How it works:**

- A blob is the contents of one file.
- A tree is one directory: names, modes, and the hashes of blobs and nested trees.
- A commit points at one tree, at its parent commits, and at the message and author data.
- An annotated tag is its own object pointing at a commit, typically a release. A lightweight tag is just a ref.
- The index is the staged snapshot that the next commit will turn into a tree.
- `HEAD` names the current branch, and that branch ref names the latest commit on the line.
- After you change a file and add it, Git writes a new blob. The next commit writes a new tree and a new commit, and the branch ref moves to that commit. Unchanged files keep their old blob hashes.

**Examples:**

```bash
git cat-file -t HEAD    # commit
git rev-parse HEAD^{tree}
```

</details>


### Basic Git Commands

<details>
<summary>How do you initialize a new Git repository?</summary>

### How do you initialize a new Git repository?

**Definition:**

`git init` creates a new repository in the current directory by writing an empty `.git` with a default branch and no commits yet.

**How it works:**

- `git init` in an existing folder, or `git init project && cd project`, is the command-line path. A graphical client calls the same operation.
- New files are untracked until `git add`. `git commit` writes the first snapshot. There is no parent.
- `git remote add origin <url>` names the place you will push to. `git push -u origin HEAD` publishes the branch and sets tracking.
- Put secrets and build output in `.gitignore` before the first commit. A file that was committed is already in history even if you ignore it later.

**Examples:**

```bash
git init ledger
cd ledger
printf 'notes\n' >> .gitignore
git add README.md .gitignore
git commit -m "Start the ledger"
git remote add origin git@example.com:ledger.git
git push -u origin HEAD
```

</details>

<details>
<summary>Explain the purpose of the git status command.</summary>

### Explain the purpose of the git status command.

**Definition:**

`git status` reports where you are and which changes are staged, unstaged, or not tracked yet. It does not modify the repository.

**How it works:**

- The first line is the current branch, or a note that `HEAD` is detached.
- “Changes to be committed” lists what the index will put in the next commit.
- “Changes not staged for commit” lists tracked files that differ from the index.
- “Untracked files” lists paths Git has never been asked to record.
- It also says whether the branch matches its upstream, or is ahead or behind by some commits.
- `git diff` shows the unstaged edit. `git diff --staged` shows what the next commit would record. Read status before you add or commit.

**Examples:**

```text
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
Changes not staged for commit:
        modified:   src/tax.ts
Untracked files:
        src/tax.test.ts
```

</details>

<details>
<summary>What does the git add command do?</summary>

### What does the git add command do?

**Definition:**

`git add` copies the current contents of a path into the index. That staged snapshot, not the working tree by itself, is what the next commit records.

**How it works:**

- The working tree can contain edits you are not ready to commit. The index holds only the ones you added. The repository changes only at commit.
- `git add path` stages that file. `git add .` stages changes under the current directory. `git add -p` lets you stage some hunks of a file and leave the rest.
- After you edit a conflict and want the resolution recorded, `git add` on that path marks it resolved.
- Adding a file that was already committed stages the new blob. The old blob remains reachable from older commits.

**Examples:**

```bash
git add -p src/tax.ts    # stage one hunk
git diff --staged        # the index, not the leftover edit
```

</details>

<details>
<summary>How do you create a commit in Git?</summary>

### How do you create a commit in Git?

**Definition:**

Creating a commit records the index as a new snapshot and moves the current branch to it. Files you did not stage stay out of that snapshot.

**How it works:**

- An untracked file is not in the commit until `git add` puts it in the index. A tracked file is already known; `git add` updates its staged contents, and `git commit -a` stages tracked modifications and deletions for you. New files still need `git add`.
- `git add path` or `git add '*.ts'` chooses what enters the index. `git add -p` chooses hunks.
- `git rm` stages a deletion. `git mv` stages a rename. `git reset path` (mixed, the default) unstages a path without throwing away the working-tree edit.
- `git commit -m "why"` writes the snapshot with that message. Without `-m`, Git opens an editor.
- Keep generated files and secrets out with `.gitignore` before they are added. Do not commit passwords or private keys. If one was committed, removing it from the latest tree does not remove it from older commits.

**Examples:**

```bash
git add src/tax.ts
git commit -m "Apply the tax rate from the invoice"
```

</details>

<details>
<summary>What information is contained in a commit object in Git?</summary>

### What information is contained in a commit object in Git?

**Definition:**

A commit object is a small text record: a tree, zero or more parents, author and committer lines, an optional signature, and the message.

**How it works:**

- Author and committer are each a name, an email, and a timestamp. They differ when someone commits another person’s change.
- The message is free text. The first line is the summary later tools show in logs.
- Parent lines point at the commits this one follows. Two parents mean a merge.
- The tree line is the hash of the root directory snapshot. That tree points at blobs (file contents) and other trees (subdirectories).
- The branch ref, and usually `HEAD` through that ref, moves to the new commit. The commit object itself does not store the branch name.
- A commit with no ref pointing at it, directly or through its descendants, is dangling and will eventually be garbage-collected.
- A GPG or SSH signature can be stored in the commit so others can check who signed it. The signature covers the commit content, not the branch name.

**Examples:**

```text
tree 4f2a…
parent 9c01…
author Ada <ada@example.com> 1710000000 +0000
committer Ada <ada@example.com> 1710000000 +0000

Apply the tax rate from the invoice
```

</details>

<details>
<summary>How does git push differ from git fetch?</summary>

### How does git push differ from git fetch?

**Definition:**

</details>

<details>
<summary>Explain the purpose of the git pull command.</summary>

### Explain the purpose of the git pull command.

**Definition:**

</details>

<details>
<summary>Describe the use of the git branch command.</summary>

### Describe the use of the git branch command.

**Definition:**

</details>

<details>
<summary>How do you switch branches using git checkout?</summary>

### How do you switch branches using git checkout?

**Definition:**

</details>

<details>
<summary>What is the purpose of git merge?</summary>

### What is the purpose of git merge?

**Definition:**

</details>


### Git Branching and Merging

<details>
<summary>Explain the Git workflow you use most frequently.</summary>

### Explain the Git workflow you use most frequently.

**Definition:**

</details>

<details>
<summary>Can you describe the process of creating a new branch and merging it back into the main branch?</summary>

### Can you describe the process of creating a new branch and merging it back into the main branch?

**Definition:**

</details>

<details>
<summary>What is a merge conflict in Git and how do you resolve it?</summary>

### What is a merge conflict in Git and how do you resolve it?

**Definition:**

</details>

<details>
<summary>What is a fast-forward merge in Git?</summary>

### What is a fast-forward merge in Git?

**Definition:**

</details>

<details>
<summary>Define a three-way merge.</summary>

### Define a three-way merge.

**Definition:**

</details>

<details>
<summary>How do you rebase a branch in Git?</summary>

### How do you rebase a branch in Git?

**Definition:**

</details>

<details>
<summary>Explain the pros and cons of rebasing vs. merging.</summary>

### Explain the pros and cons of rebasing vs. merging.

**Definition:**

</details>

<details>
<summary>What is the purpose of git tag?</summary>

### What is the purpose of git tag?

**Definition:**

</details>

<details>
<summary>How do you revert a commit that has already been pushed to the remote repository?</summary>

### How do you revert a commit that has already been pushed to the remote repository?

**Definition:**

</details>

<details>
<summary>What is the significance of the master branch in Git?</summary>

### What is the significance of the master branch in Git?

**Definition:**

</details>


### Git Workflows and Patterns

<details>
<summary>What is a distributed version control system and how does Git function as one?</summary>

### What is a distributed version control system and how does Git function as one?

**Definition:**

</details>

<details>
<summary>Describe the Git feature branch workflow.</summary>

### Describe the Git feature branch workflow.

**Definition:**

</details>

<details>
<summary>Explain the Gitflow workflow.</summary>

### Explain the Gitflow workflow.

**Definition:**

</details>

<details>
<summary>What is a Forking workflow in Git?</summary>

### What is a Forking workflow in Git?

**Definition:**

</details>

<details>
<summary>Discuss the Centralized workflow in Git.</summary>

### Discuss the Centralized workflow in Git.

**Definition:**

</details>


### Git Repository Management

<details>
<summary>Explain what a remote repository is in Git.</summary>

### Explain what a remote repository is in Git.

**Definition:**

</details>

<details>
<summary>Describe how you would change a Git remote URL.</summary>

### Describe how you would change a Git remote URL.

**Definition:**

</details>

<details>
<summary>How do you synchronize your local repository with a remote repository?</summary>

### How do you synchronize your local repository with a remote repository?

**Definition:**

</details>

<details>
<summary>How do you clean up unused branches in your local and remote repository?</summary>

### How do you clean up unused branches in your local and remote repository?

**Definition:**

</details>

<details>
<summary>Describe the steps to resolve a merge conflict in Git.</summary>

### Describe the steps to resolve a merge conflict in Git.

**Definition:**

</details>


### Git Stashing and Cleaning

<details>
<summary>What is git stash used for?</summary>

### What is git stash used for?

**Definition:**

</details>

<details>
<summary>How do you view stashed changes in Git?</summary>

### How do you view stashed changes in Git?

**Definition:**

</details>

<details>
<summary>Can you apply a stash without removing it from the stash list?</summary>

### Can you apply a stash without removing it from the stash list?

**Definition:**

</details>

<details>
<summary>What does the git clean command do?</summary>

### What does the git clean command do?

**Definition:**

</details>

<details>
<summary>How do you remove a file from the working directory without deleting it from the repository?</summary>

### How do you remove a file from the working directory without deleting it from the repository?

**Definition:**

</details>


### Git Logging and History

<details>
<summary>How do you view the commit history in Git?</summary>

### How do you view the commit history in Git?

**Definition:**

</details>

<details>
<summary>Explain how to find a commit by a specific author in Git.</summary>

### Explain how to find a commit by a specific author in Git.

**Definition:**

</details>

<details>
<summary>How do you view the changes introduced in a commit?</summary>

### How do you view the changes introduced in a commit?

**Definition:**

</details>

<details>
<summary>Can you list the files changed in a specific commit?</summary>

### Can you list the files changed in a specific commit?

**Definition:**

</details>

<details>
<summary>What does the git blame command do?</summary>

### What does the git blame command do?

**Definition:**

</details>


### Git Tagging and Releases

<details>
<summary>What are Git tags and how are they different from branches?</summary>

### What are Git tags and how are they different from branches?

**Definition:**

</details>

<details>
<summary>How do you create, delete, and push tags?</summary>

### How do you create, delete, and push tags?

**Definition:**

</details>

<details>
<summary>What is semantic versioning in the context of Git tagging?</summary>

### What is semantic versioning in the context of Git tagging?

**Definition:**

</details>

<details>
<summary>How would you checkout to a specific tag?</summary>

### How would you checkout to a specific tag?

**Definition:**

</details>

<details>
<summary>Describe how to create a release from a tag.</summary>

### Describe how to create a release from a tag.

**Definition:**

</details>


### Advanced Git Operations

<details>
<summary>What is a git submodule and when would you use one?</summary>

### What is a git submodule and when would you use one?

**Definition:**

</details>

<details>
<summary>Explain the purpose of a git hook.</summary>

### Explain the purpose of a git hook.

**Definition:**

</details>

<details>
<summary>How do you perform a squash commit in Git?</summary>

### How do you perform a squash commit in Git?

**Definition:**

</details>

<details>
<summary>What is a git bisect and how do you use it?</summary>

### What is a git bisect and how do you use it?

**Definition:**

</details>

<details>
<summary>How do you manually resolve a conflict during a git merge?</summary>

### How do you manually resolve a conflict during a git merge?

**Definition:**

</details>


### Git Configuration and Customization

<details>
<summary>How do you set your username and email in Git?</summary>

### How do you set your username and email in Git?

**Definition:**

</details>

<details>
<summary>What is the scope of Git configuration files?</summary>

### What is the scope of Git configuration files?

**Definition:**

</details>

<details>
<summary>How can you create aliases for Git commands?</summary>

### How can you create aliases for Git commands?

**Definition:**

</details>

<details>
<summary>What is the purpose of a .gitignore file?</summary>

### What is the purpose of a .gitignore file?

**Definition:**

</details>

<details>
<summary>How would you ignore files globally?</summary>

### How would you ignore files globally?

**Definition:**

</details>


### Git Security

<details>
<summary>How do you ensure your commits are signed with your GPG key?</summary>

### How do you ensure your commits are signed with your GPG key?

**Definition:**

</details>

<details>
<summary>What are some common security practices for Git repositories?</summary>

### What are some common security practices for Git repositories?

**Definition:**

</details>

<details>
<summary>How do you encrypt sensitive data in a Git repository?</summary>

### How do you encrypt sensitive data in a Git repository?

**Definition:**

</details>

<details>
<summary>What are some strategies for credential storage in Git?</summary>

### What are some strategies for credential storage in Git?

**Definition:**

</details>

<details>
<summary>How would you revoke access to a Git repository?</summary>

### How would you revoke access to a Git repository?

**Definition:**

</details>


### Troubleshooting and Recovery

<details>
<summary>How do you find and restore a deleted file in a Git repository?</summary>

### How do you find and restore a deleted file in a Git repository?

**Definition:**

</details>

<details>
<summary>What steps would you take if you accidentally committed sensitive data?</summary>

### What steps would you take if you accidentally committed sensitive data?

**Definition:**

</details>

<details>
<summary>How do you handle detached HEAD state in Git?</summary>

### How do you handle detached HEAD state in Git?

**Definition:**

</details>

<details>
<summary>Explain how to recover a dropped stash in Git.</summary>

### Explain how to recover a dropped stash in Git.

**Definition:**

</details>

<details>
<summary>How do you amend the message of the last commit?</summary>

### How do you amend the message of the last commit?

**Definition:**

</details>


### Git Collaboration

<details>
<summary>What is a pull request and how does it work?</summary>

### What is a pull request and how does it work?

**Definition:**

</details>

<details>
<summary>How do you update a pull request?</summary>

### How do you update a pull request?

**Definition:**

</details>

<details>
<summary>What is a code review process in Git?</summary>

### What is a code review process in Git?

**Definition:**

</details>

<details>
<summary>How do you handle a pull request conflict?</summary>

### How do you handle a pull request conflict?

**Definition:**

</details>

<details>
<summary>What is the difference between git pull and git fetch followed by git merge?</summary>

### What is the difference between git pull and git fetch followed by git merge?

**Definition:**

</details>


### Git Performance and Scalability

<details>
<summary>How do you handle large files in Git?</summary>

### How do you handle large files in Git?

**Definition:**

</details>

<details>
<summary>What are some ways to improve the performance of a large Git repository?</summary>

### What are some ways to improve the performance of a large Git repository?

**Definition:**

</details>

<details>
<summary>What is a shallow clone in Git and when would you use it?</summary>

### What is a shallow clone in Git and when would you use it?

**Definition:**

</details>

<details>
<summary>How do you reduce the repository size in Git?</summary>

### How do you reduce the repository size in Git?

**Definition:**

</details>

<details>
<summary>Explain how Git LFS (Large File Storage) is used.</summary>

### Explain how Git LFS (Large File Storage) is used.

**Definition:**

</details>


### Git in Continuous Integration/Continuous Deployment (CI/CD)

<details>
<summary>How does Git integrate with CI/CD pipelines?</summary>

### How does Git integrate with CI/CD pipelines?

**Definition:**

</details>

<details>
<summary>Describe the process of automating deployments using Git.</summary>

### Describe the process of automating deployments using Git.

**Definition:**

</details>

<details>
<summary>How would you configure branch protection rules for a repository in the context of CI/CD?</summary>

### How would you configure branch protection rules for a repository in the context of CI/CD?

**Definition:**

</details>

<details>
<summary>What role do Git hooks play in automation?</summary>

### What role do Git hooks play in automation?

**Definition:**

</details>

<details>
<summary>How can Git help in the rollback process of a failed deployment?</summary>

### How can Git help in the rollback process of a failed deployment?

**Definition:**

</details>


### Git with IDEs and Tools

<details>
<summary>How do you integrate Git with your preferred IDE?</summary>

### How do you integrate Git with your preferred IDE?

**Definition:**

</details>

<details>
<summary>Discuss the pros and cons of using a GUI tool for Git versus the command line.</summary>

### Discuss the pros and cons of using a GUI tool for Git versus the command line.

**Definition:**

</details>

<details>
<summary>What plugins are commonly used with Git in development environments?</summary>

### What plugins are commonly used with Git in development environments?

**Definition:**

</details>

<details>
<summary>How do you resolve merge conflicts using a visual tool?</summary>

### How do you resolve merge conflicts using a visual tool?

**Definition:**

</details>

<details>
<summary>What is the purpose of a Git bridge for version control systems?</summary>

### What is the purpose of a Git bridge for version control systems?

**Definition:**

</details>


### Advanced Git Topics

<details>
<summary>How do you handle large binary files in Git without using Git LFS?</summary>

### How do you handle large binary files in Git without using Git LFS?

**Definition:**

</details>

<details>
<summary>What is the purpose of the git rebase -i command?</summary>

### What is the purpose of the git rebase -i command?

**Definition:**

</details>

<details>
<summary>How would you set up a continuous backup process for Git repositories?</summary>

### How would you set up a continuous backup process for Git repositories?

**Definition:**

</details>

<details>
<summary>Explain the impact of case sensitivity in Git and how to manage it across different operating systems.</summary>

### Explain the impact of case sensitivity in Git and how to manage it across different operating systems.

**Definition:**

</details>

<details>
<summary>How do you maintain multiple versions of a product using Git branches for each version?</summary>

### How do you maintain multiple versions of a product using Git branches for each version?

**Definition:**

</details>
