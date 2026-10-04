# Git — Interview

Ответы заполнены для опубликованной части, остальные пустые.

[ ← Вернуться в хаб](./0_git.md)

### Related docs

* [Git — Core](./0_git_core.md) · [Git — Ветвление](./0_git_branching.md) · [Git — Команда](./0_git_team.md) · [Git — Интервью](./0_git_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы с [Devinterview.io — Git](https://devinterview.io/questions/web-and-mobile-development/git-interview-questions/).

### Git Fundamentals

<details>
<summary>What is Git and why is it used?</summary>

### What is Git and why is it used?

**Definition:**

Git — распределённая система контроля версий: каждый клон хранит содержимое проекта и его историю, поэтому коммитить, ветвиться и смотреть прошлое можно без центрального сервера.

**How it works:**

- История — граф снимков. Можно вернуться к раннему коммиту или прочитать дерево таким, каким оно было тогда.
- Каждый объект назван хешем своего содержимого (по умолчанию SHA-1, SHA-256 — в репозиториях, созданных для него), поэтому тихая подмена хранимых данных не совпадёт с именем.
- Участники работают параллельно в ветках и соединяют результат слиянием или rebase.
- Ревью происходит до вливания ветки, потому что изменение — это набор коммитов, который может прочитать другой человек.
- Коммит записывает один снимок, ветка — подвижное имя линии работы, слияние соединяет две линии. Remote вроде `origin` — другой репозиторий, из которого этот умеет забирать изменения и в который умеет их отправлять.
- Командная строка покрывает всё, что позволяет модель. Графический клиент — те же операции с другой поверхностью.
- Небольшие коммиты, сообщение о причине и push перед остановкой — привычки, которые оставляют историю пригодной.

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

Git отличается от более старых систем контроля версий прежде всего тем, что он распределённый, хранит снимки и делает ветки дешёвыми.

**How it works:**

- У каждого клона полная история, поэтому commit, diff и log работают офлайн. Централизованной системе вроде Subversion для большей части этого нужен сервер.
- Обычные операции остаются локальными и быстрыми, потому что история уже на диске.
- Имена объектов — хеши содержимого, поэтому порчу и тихую правку хранимых данных можно заметить. У многих старых систем такой проверки не было.
- Ветка — указатель на коммит, а не копия дерева, поэтому короткие ветки — обычный шаг, а не событие.
- Историю можно перестроить локально (rebase, squash) до публикации. Так команда выбирает процесс, а не наследует единственный.
- Индекс, или staging area, позволяет коммиту содержать лишь часть текущих правок.
- Коммит хранит снимок дерева, а не дельту к предыдущему файлу. Коммит атомарен: он есть целиком или его нет.
- Та же локальная история питает CI, и инструмент ведёт себя одинаково в Windows, macOS и Linux.
- Единый центральный сервер — единая точка отказа, часто нумерует ревизии одним возрастающим id, не доказывает, что файлы не меняли, блокирует работу без сети и оставляет неиспользуемые ветки на этом сервере.

**Examples:**

`svn commit` публикует изменения в центральный репозиторий. `git commit` только записывает локальный снимок; у остальных ничего не меняется, пока не выполнен `git push`.

</details>

<details>
<summary>What is the difference between Git and GitHub?</summary>

### What is the difference between Git and GitHub?

**Definition:**

Git — инструмент контроля версий, который записывает историю на вашей машине. GitHub — сайт, который размещает Git-репозитории и добавляет вокруг них совместную работу.

**How it works:**

- Git работает без сервера. Commit, branch и merge локальны, а staging area выбирает, что войдёт в следующий коммит. Учёт идёт по содержимому, а не по номеру ревизии каждого файла.
- GitHub хранит удалённую копию, чтобы клоны могли делать push и fetch. Вокруг этого remote он добавляет issues, pull request, ревью, права и доски задач.
- Git можно использовать без GitHub, а тот же remote разместить на GitLab, Bitbucket или своём сервере. Команды от этого не меняются.

**Examples:**

```bash
git commit -am "Fix the total"
git push origin HEAD
```

Коммит существует после первой команды, даже если GitHub недоступен. Вторая команда его публикует.

</details>

<details>
<summary>What is a repository in Git?</summary>

### What is a repository in Git?

**Definition:**

Репозиторий Git — это история проекта плюс файлы, которые вы редактируете сейчас. У каждого участника полная копия, а не вид на одну центральную базу.

**How it works:**

- Офлайновые commit и log возможны, потому что история локальна.
- Хранение адресуется содержимым. Одинаковое содержимое хранится один раз, а pack-файлы сжимают остальное дельтами. Это оптимизация на диске, а не модель данных.
- Каждый объект, который Git читает, сверяется со своим хешем.
- Каталог `.git` хранит базу объектов (коммиты, деревья, blob), ссылки, которые именуют коммиты (ветки и теги), и конфигурацию.
- Рабочее дерево — обычные файлы, которые вы правите. Это не история.

**Examples:**

```bash
git init invoices
# invoices/.git — репозиторий
# invoices/*.md — рабочее дерево
```

</details>

<details>
<summary>Explain the concept of a commit in Git.</summary>

### Explain the concept of a commit in Git.

**Definition:**

Коммит — один сохранённый снимок проекта плюс метаданные о том, как он связан со снимками до него.

**How it works:**

- Коммит указывает на дерево, которое записывает файлы и каталоги в этот момент.
- Он указывает на одного или нескольких родителей. У первого коммита родителей нет. У коммита слияния их два или больше.
- Метаданные — автор, коммитер, метки времени и сообщение.
- Рабочий каталог — файлы, которые вы правите. Staging area (индекс) — снимок, который вы собираете. База объектов — история после commit.
- Вы меняете файлы, добавляете в индекс те, что принадлежат одному изменению, и коммитите. Историю затем читают от новых к старым через `git log`.
- Этот снимок — то, к чему делают reset, что смотрит коллега и что собирает CI.

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

Git держит три копии текущей работы: рабочий каталог, который вы правите, staging area, которую вы собираете, и историю репозитория, которую вы уже закоммитили.

**How it works:**

- Рабочий каталог — файлы на диске. Правки здесь не в индексе, пока вы их не добавите.
- Staging area, или индекс, — следующий коммит. `git status` называет этот раздел «Changes to be committed».
- «Changes not staged for commit» — отслеживаемые файлы, которые отличаются от индекса. Неотслеживаемые файлы в индексе отсутствуют.
- Репозиторий — граф коммитов в `.git`. Commit копирует индекс как новый снимок и сдвигает указатель ветки вперёд.

**Examples:**

```text
edit notes.md          только рабочий каталог
git add notes.md       теперь в индексе
git commit             теперь снимок в репозитории
```

</details>

<details>
<summary>Define branching in Git and its importance.</summary>

### Define branching in Git and its importance.

**Definition:**

Ветка — именованный указатель на коммит. Создание ветки не копирует файлы, поэтому параллельная работа дешева.

**How it works:**

- Ветка по умолчанию (`main`, исторически `master`) — линия, которую проект считает точкой интеграции.
- Ветка функции начинается от этой линии и держит одно изменение, пока оно не готово.
- Слияние возвращает готовую ветку обратно. Если обе стороны правили одни и те же строки, слияние останавливается на конфликте, и разрешение записывают новым коммитом.
- Указатель ветки сдвигается вперёд на каждом коммите, пока ветка выписана. Остальные ветки остаются на месте.

**Examples:**

```bash
git switch -c fix-rounding
# правка, commit
git switch main
git merge fix-rounding
```

</details>

<details>
<summary>What is a HEAD in Git?</summary>

### What is a HEAD in Git?

**Definition:**

`HEAD` — указатель на коммит, который сейчас выписан. Следующий коммит станет ребёнком этого коммита.

**How it works:**

- Когда выписана ветка, `HEAD` указывает на имя ветки, а ветка — на коммит. Новый коммит двигает ветку, и `HEAD` следует за ней.
- В отсоединённом (`detached`) `HEAD` он указывает прямо на коммит. Новый коммит не попадает ни на какую ветку, пока вы её не назовёте.
- Рабочий каталог и индекс заполняются из дерева коммита, на который ссылается `HEAD`.
- `HEAD~1` — первый родитель этого коммита. `HEAD^2` — второй родитель слияния.

**Examples:**

```bash
git rev-parse --abbrev-ref HEAD   # main
git checkout --detach HEAD~2      # detached на более старом коммите
```

</details>

<details>
<summary>What does the clone operation in Git do?</summary>

### What does the clone operation in Git do?

**Definition:**

`git clone` копирует репозиторий на вашу машину и записывает источник как remote с именем `origin`, чтобы последующие fetch и push знали, куда ходить.

**How it works:**

- Локальный репозиторий получает объекты и, по умолчанию, ветки и теги, нужные чтобы восстановить историю.
- Рабочий каталог выписывается на ветке по умолчанию удалённой стороны.
- `origin` настраивается на URL remote. Локальная ветка по умолчанию следит за соответствующей удалённой веткой.
- Хеши объектов проверяются при передаче.
- Полный клон — обычный случай. Shallow clone (`--depth`) или частичный клон опускает часть истории, когда репозиторий велик. Такая локальная копия не видит коммиты, которые остались позади.

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

Git хранит снимки как объекты, адресованные хешем их содержимого. Ветка — лишь имя, которое указывает на один коммит.

**How it works:**

- Blob — содержимое одного файла.
- Дерево — один каталог: имена, режимы и хеши blob и вложенных деревьев.
- Коммит указывает на одно дерево, на родительские коммиты и на сообщение с данными автора.
- Аннотированный тег — отдельный объект, указывающий на коммит, обычно на выпуск. Лёгкий тег — просто ссылка.
- Индекс — подготовленный снимок, который следующий коммит превратит в дерево.
- `HEAD` именует текущую ветку, а ссылка ветки именует последний коммит на линии.
- После изменения файла и `git add` Git пишет новый blob. Следующий коммит пишет новое дерево и новый коммит, и ссылка ветки переходит на этот коммит. Неизменённые файлы сохраняют старые хеши blob.

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

`git init` создаёт новый репозиторий в текущем каталоге: пишет пустой `.git` с веткой по умолчанию и пока без коммитов.

**How it works:**

- `git init` в существующей папке или `git init project && cd project` — путь из командной строки. Графический клиент вызывает ту же операцию.
- Новые файлы не отслеживаются, пока не выполнен `git add`. `git commit` пишет первый снимок. Родителя нет.
- `git remote add origin <url>` называет место, куда вы будете отправлять изменения. `git push -u origin HEAD` публикует ветку и включает слежение.
- Секреты и результаты сборки кладите в `.gitignore` до первого коммита. Файл, который уже закоммичен, остаётся в истории, даже если потом его игнорировать.

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

`git status` сообщает, где вы находитесь и какие изменения подготовлены, не подготовлены или ещё не отслеживаются. Репозиторий он не меняет.

**How it works:**

- Первая строка — текущая ветка или пометка, что `HEAD` отсоединён.
- «Changes to be committed» перечисляет то, что индекс положит в следующий коммит.
- «Changes not staged for commit» перечисляет отслеживаемые файлы, которые отличаются от индекса.
- «Untracked files» перечисляет пути, которые Git ещё не просили записывать.
- Там же сказано, совпадает ли ветка с upstream или опережает его либо отстаёт на несколько коммитов.
- `git diff` показывает неподготовленную правку. `git diff --staged` показывает, что записал бы следующий коммит. Читайте status перед add или commit.

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

`git add` копирует текущее содержимое пути в индекс. Следующий коммит записывает этот подготовленный снимок, а не рабочее дерево само по себе.

**How it works:**

- В рабочем дереве могут быть правки, которые вы ещё не готовы коммитить. В индексе только те, что вы добавили. Репозиторий меняется только в момент commit.
- `git add path` готовит этот файл. `git add .` готовит изменения в текущем каталоге. `git add -p` позволяет подготовить часть фрагментов файла и оставить остальные.
- После правки конфликта `git add` на этом пути помечает его разрешённым.
- Добавление уже коммитившегося файла готовит новый blob. Старый blob остаётся достижимым из более ранних коммитов.

**Examples:**

```bash
git add -p src/tax.ts    # подготовить один фрагмент
git diff --staged        # индекс, а не оставшаяся правка
```

</details>

<details>
<summary>How do you create a commit in Git?</summary>

### How do you create a commit in Git?

**Definition:**

Создание коммита записывает индекс как новый снимок и передвигает на него текущую ветку. Файлы, которые вы не подготовили, в этот снимок не входят.

**How it works:**

- Неотслеживаемый файл не попадает в коммит, пока `git add` не положит его в индекс. Отслеживаемый файл уже известен; `git add` обновляет его подготовленное содержимое, а `git commit -a` сам готовит изменения и удаления отслеживаемых файлов. Новые файлы всё равно требуют `git add`.
- `git add path` или `git add '*.ts'` выбирает, что попадёт в индекс. `git add -p` выбирает фрагменты.
- `git rm` готовит удаление. `git mv` готовит переименование. `git reset path` (mixed, это режим по умолчанию) убирает путь из индекса и не выбрасывает правку в рабочем дереве.
- `git commit -m "why"` пишет снимок с этим сообщением. Без `-m` Git открывает редактор.
- Сгенерированные файлы и секреты держите вне репозитория через `.gitignore`, прежде чем их добавят. Не коммитьте пароли и закрытые ключи. Если такой файл уже закоммичен, удаление его из последнего дерева не удаляет его из старых коммитов.

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

Объект коммита — короткая текстовая запись: дерево, ноль или больше родителей, строки автора и коммитера, необязательная подпись и сообщение.

**How it works:**

- Автор и коммитер — это имя, почта и метка времени каждый. Они различаются, когда один человек коммитит изменение другого.
- Сообщение — свободный текст. Первую строку позже показывают журналы.
- Строки parent указывают на коммиты, за которыми следует этот. Два родителя означают слияние.
- Строка tree — хеш снимка корневого каталога. Это дерево указывает на blob (содержимое файлов) и другие деревья (подкаталоги).
- Ссылка ветки, а обычно и `HEAD` через эту ссылку, переходит на новый коммит. Сам объект коммита имя ветки не хранит.
- Коммит, на который не указывает ни одна ссылка — прямо или через потомков, — висячий, и со временем его соберёт сборщик мусора.
- Подпись GPG или SSH можно хранить в коммите, чтобы другие проверили, кто его подписал. Подпись покрывает содержимое коммита, а не имя ветки.

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
