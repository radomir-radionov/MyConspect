# Git — Interview

Интервью с вопросами и ответами и приложение-оболочка.

[ ← Вернуться в хаб](./0_git.md)

### Related docs

* [Git — Core](./0_git_core.md) · [Git — Ветвление](./0_git_branching.md) · [Git — Команда](./0_git_team.md) · [Git — Интервью](./0_git_interview.md)

### Sections

- [Interview Practice](#interview-practice)
- [Appendix — Shell basics](#appendix-shell-basics)

---

## Interview Practice

<details>
  <summary>Interview Practice</summary>

### Interview Practice

Вопросы от [0_interview.md](0_interview.md). Попробуйте ответить, прежде чем открывать каждое решение.

### Question index (0_interview.md)

| # | Тема | Раздел |
|---|-------|---------|
| 131 | Конфликты окончания строки при каждом нажатии | 1 квартал |
| 132 | `git fetch` | 2 квартал |
| 133 | Гигиена Git | 3 квартал |
| 137 | `merge` vs `rebase` | 4 квартал |
| 138 | Плацдарм | Q5 |
| 139 | Проверка кода | Q6 |
| 37 | Git-поток | Q7 |
| 38 | Сквош во время перезагрузки | Q8 |
| 39 | Альтернативная система контроля версий | Q9 |
| 40 | Соглашения Git | Q10 |

---

### Questions & Answers

<details>
  <summary>Q1. Every pull causes a conflict on the last line of all edited files. What is happening?</summary>

### Q1. Every pull causes a conflict on the last line of all edited files. What is happening?

**Question:** Каждый раз, когда вы тянете, последняя строка конфликтует в каждом файле, который вы редактировали. Почему?

**Answer:**

Почти всегда это **несоответствие конца строки** (CRLF в Windows и LF в Unix).

Git видит одно и то же логическое содержимое как разные байты. При слиянии он помечает каждую затронутую строку — часто это проявляется как конфликт в «последней строке» (где невидимый `\r` отличается).

**Fix:**

1. Команда согласовывает LF в репо: `* text=auto eol=lf` in `.gitattributes`
2. Для каждого разработчика: `core.autocrlf=true` (Окна) или `input` (macOS/Линукс)
3. Добавить `.editorconfig` с `end_of_line = lf`
4. Перенормировать: `git add --renormalize .` + один коммит
5. Каждый тянет один раз; конфликты должны прекратиться

</details>

<details>
  <summary>Q2. What does `git fetch` do?</summary>

### Q2. What does `git fetch` do?

**Question:** Объяснять `git fetch`.

**Answer:**

`git fetch` загружает новые коммиты, ветки и теги с удаленного устройства в ваши **локальные ссылки для удаленного отслеживания** (например, `origin/main`). Он **не** изменяет вашу рабочую ветку или рабочий каталог.

| Команда | Принести пульт? | Обновить местную ветку? | Объединить/перебазировать? |
|---------|---------------|----------------------|---------------|
| `git fetch` | Да | Нет | Нет |
| `git pull` | Да | Да | Да (объединить или перебазировать) |
| `git push` | Нет | Нет | Отправляет локальные коммиты на удаленные |

Использовать `fetch` если вы хотите проверить удаленные изменения перед интеграцией: `git log main..origin/main`.

</details>

<details>
  <summary>Q3. What git hygiene approaches do you know?</summary>

### Q3. What git hygiene approaches do you know?

**Question:** Назовите правила гигиены git для командных проектов.

**Answer:**

1. **Обычные коммиты** — согласованные сообщения с возможностью поиска.
2. **Атомарные коммиты** — по одному логическому изменению.
3. **Небольшие PR** — проверяемые различия (идеально — < 400 строк).
4. **Именование ветвей** — `feature/`, `fix/`, `chore/` префиксы
5. **Перебазируйте ветку функций** на главную перед PR (линейная история).
6. **Никогда не отправляйте принудительно** общие ветки.
7. **Хуки** — проверка/форматирование/проверка перед фиксацией/отправкой
8. **`.gitignore`** — no `node_modules`, `.env`, строить артефакты
9. **В истории нет секретов**; повернуть, если протечет
10. **Удалите объединенные ветки** — уменьшите беспорядок
11. **Подписанные коммиты** для производственных репозиториев
12. ** Защищено `main`** — требуется PR + CI + проверка

</details>

<details>
  <summary>Q4. How do `git merge` and `git rebase` differ?</summary>

### Q4. How do `git merge` and `git rebase` differ?

**Question:** Сравнивать `git merge` и `git rebase`. Когда использовать друг?

**Answer:**


| Объединить | Перебазировать |
| --- | ------- |
| Форма истории | Разветвленный (слияние коммитов) | Линейный |
| Перезаписывает коммиты | Нет | Да (новые SHA) |
| Конфликты | Однажды | За повторный коммит |
| Безопасно в общей/перемещенной ветке | Да | **Нет** |

**Используйте объединение** при интеграции завершенной функции в общую ветку или при сохранении точной истории ветки.**Используйте rebase**, чтобы обновить **локальную/частную** ветку функций до последней версии. `main` прежде чем открывать пиар — обзор почище диффа.

**Golden rule:** не перебазируйте коммиты, которые уже удалили другие.

</details>

<details>
  <summary>Q5. What is the staging area in Git?</summary>

### Q5. What is the staging area in Git?

**Question:** Объясните промежуточную область (индекс).

**Answer:**

**Промежуточная область** (индекс) — это промежуточный уровень между рабочим каталогом и репозиторием. Он содержит именно то, что войдет в следующий коммит.

```
Working directory  --git add-->  Index  --git commit-->  Repository
```

Почему он существует:

* **Выборочная фиксация** — загружайте только часть ваших изменений (`git add -p`)
* **Проверка перед фиксацией** — `git diff --staged` показывает, что вы собираетесь совершить
* **Отделение WIP от готового** — редактируйте много файлов, коммитите только готовые

Команды: `git add` (этап), `git restore --staged` (без сцены), `git commit` (заморозить индекс в фиксации).

</details>

<details>
  <summary>Q6. Describe the code review process.</summary>

### Q6. Describe the code review process.

**Question:** Как вы проводите проверку кода? Правила конфликтов и разногласий?

**Answer:**

**Process:**

1. Автор открывает PR с описанием, привязанным билетом, примечаниями к тестированию.
2. CI запускается автоматически (lint, тесты, сборка)
3. Рецензент читает диффы, оставляет комментарии (блокировка vs нит)
4. Автор обращается к отзывам; отправляет новые коммиты
5. Повторное рассмотрение до утверждения
6. Слияние (сжатие или слияние в соответствии с политикой команды)

**Reviewer checklist:**

* Корректность и крайние случаи
* Тесты включены
* Никаких проблем с безопасностью (XSS, секреты, аутентификация)
* Читабельное название и структура.
* Соответствует соглашениям проекта

**Resolving disagreements:**

* Обсуждайте в пиар-комментариях аргументировано, а не мнением
* Если нет консенсуса, обратитесь к техническому руководителю
* Предпочитаете измеримые критерии (производительность, характеристики, руководство по стилю)
* Для стилевых нитов: следуйте командному линтеру/конфигурации, а не личным предпочтениям.
* Дебаты о временных рамках; отправить с последующим билетом, если не блокируется

</details>

<details>
  <summary>Q7. Describe Git Flow in two words (branches).</summary>

### Q7. Describe Git Flow in two words (branches).

**Question:** Краткое изложение методологии Git Flow.

**Answer:**

**Долговечный `main` + `develop`**, с кратковременным `feature`, `release`, и `hotfix` ветки.

| Филиал | От | В | Цель |
|--------|------|------|---------|
| `feature/*` | развивать | развивать | Новая работа |
| `release/*` | развивать | главная + разработка | Подготовка к выпуску |
| `hotfix/*` | главная | главная + разработка | Производственные исправления |

`main` = производство. `develop` = интеграция. Подходит для версий релизов; тяжеловат для непрерывного развертывания — вместо этого рассмотрите GitHub Flow или транковый вариант.

</details>

<details>
  <summary>Q8. What does squashing commits during rebase mean?</summary>

### Q8. What does squashing commits during rebase mean?

**Question:** Объясните сквош-фиксации во время интерактивного перебазирования.

**Answer:**

Интерактивная перебазировка (`git rebase -i`) позволяет **объединить несколько коммитов в один** перед слиянием.

```
pick abc1234 feat: add validation
squash def5678 wip
fixup ghi9012 typo
```

| Действие | Эффект |
|--------|--------|
| `squash` | Слияние с предыдущим коммитом; объединить сообщения |
| `fixup` | Слияние с предыдущим; удалить это сообщение |
| `pick` | Сохранить как есть |
| `drop` | Удалить фиксацию |

**Why:** запутать историю незавершенного производства (`wip`, `fix typo`, `fix tests`) в один чистый коммит для PR/слияния. Только в истории **неотправленных или частных** веток.

</details>

<details>
  <summary>Q9. Opinion on alternative version control systems?</summary>

### Q9. Opinion on alternative version control systems?

**Question:** Какие альтернативы Git существуют и когда их можно использовать?

**Answer:**

| СВК | Сила | Слабость |
|-----|----------|----------|
| **СВН** | Простая ментальная модель; разрешения на уровне пути | Нет полной местной истории; ветвление болезненное |
| **Ртутный** | Распространяется как Git; более простой интерфейс командной строки | Маленькая экосистема; снижение использования |
| **Перфорс (Спираль)** | Огромные двоичные файлы, конвейеры игр/фильмов | Централизованный; дорогой/сложный |
| **Гит** | Распределенная, ветвящаяся, экосистема | Крутая кривая обучения |Для веб-интерфейса и веб-интерфейса: **Git является стандартом**. SVN/Perforce появляются в устаревших корпоративных или игровых студиях. Знайте компромиссы; по умолчанию используется Git, если организация не требует иного. |

</details>

<details>
  <summary>Q10. What Git conventions do you use?</summary>

### Q10. What Git conventions do you use?

**Question:** Каким соглашениям Git вы следуете?

**Answer:**

**Commits:** [Обычные коммиты](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`, `ci:`

**Branches:** `feature/JIRA-123-short-desc`, `fix/login-bug`, `chore/deps-update`

**PR titles:** соглашение о фиксации совпадения; ссылка на билет

**Merge:** сквош для мелких деталей; коммит слияния для больших функций (политика команды)

**Tags:** semver аннотированные теги для релизов (`v1.2.3`)

**Hooks:** применять lint + обычный формат сообщения фиксации

**Never:** секреты в репо, принудительное нажатие `main`, фиксируется как "fix", "wip", "asdf"

</details>

<details>
  <summary>Q11. Walk through a Git CLI feature from clone to delete branch</summary>

### Q11. Walk through a Git CLI feature from clone to delete branch

**Question:** Какие команды вы выполняете от первого клонирования до создания функции?

**Answer:** `clone` → `switch -c` (or `checkout -b`) → редактировать → `status` → `add` → `commit` → `push -u` → после проверки оформить ветку интеграции → `merge` → `branch -d`. Вытащить позже с помощью `git pull` (or `git pull --all` для получения каждого удаленного устройства, а затем интегрируйте только **текущий** восходящий поток). Полный цикл: [ежедневный рабочий процесс Git CLI](./0_git_core.md#workflow).

</details>

---

### Hands-on tasks

### Task 1 — Recover deleted branch

Ветка была удалена локально после слияния. Восстановить последний коммит.

<details><summary>Solution</summary>

`git reflog` → найти коммит SHA → `git checkout -b feature-restored <sha>`

</details>

### Task 2 — Interactive rebase squash

Сведите последние 3 коммита в один перед PR.

<details><summary>Solution</summary>

`git rebase -i HEAD~3` → пометить коммиты как `squash` / `fixup` → редактировать сообщение.

</details>

### Task 3 — Resolve line-ending conflict

Команда на Windows + Mac — предотвращайте конфликты CRLF.

<details><summary>Solution</summary>

`.gitattributes`: `* text=auto eol=lf`, перенормировать с помощью `git add --renormalize .`

</details>

---

### Quick oral questions (self-check)

1. Какие три дерева есть в Git?
2. Что такое ГОЛОВА? Что такое отсоединенная ГОЛОВКА?
3. Разница между `git revert` и `git reset`?
4. Когда возможно ускоренное слияние?
5. Что означает `git cherry-pick` делать?
6. Что такое `git reflog` используется для?
7. Что означает `git bisect` делать?
8. Почему `git reset --hard` опасный?
9. Что такое `--force-with-lease` vs `--force`?
10. В чем разница между облегченными и аннотированными тегами?
11. Что означает `git stash` магазин?
12. Как синхронизировать форк с восходящим потоком?
13. Что такое `ORIG_HEAD`?
14. Какие четыре типа объектов хранит Git?
15. Почему не следует перебазировать отправленную общую ветку?
16. Что означает `git rm --cached` делать?
17. Что такое маркер конфликта слияния (`<<<<<<<`)?
18. Что доказывает подписанный коммит?
19. Что такое `git worktree` для?
20. Что означает `git pull --rebase` делать vs по умолчанию?

</details>

---

<a name="appendix-shell"></a>

## Appendix — Shell basics

<details>
  <summary>Appendix — Shell basics for Git Bash</summary>

### Appendix — Shell basics for Git Bash

**Definition:** Терминальная грамотность для пользователей Windows Git Bash. Не специфично для Git — полезно при работе из командной строки.

<details>
  <summary>List files</summary>

### List files

**Definition:** `ls` перечисляет содержимое каталога с дополнительными флагами для форматирования и сортировки.

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

**Definition:** `cd` меняет текущий рабочий каталог. `Tab` автозаполнение путей.

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

**Definition:** `mkdir` создает каталоги; `touch` создает пустые файлы.

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

**Definition:** `cp` копирует файлы/каталоги; `mv` перемещает или переименовывает; `rm` удаляет.

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

**Definition:** Общие команды оболочки для проверки и очистки.

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

**Definition:** Ярлыки для часто используемых команд, определенные в профиле оболочки.

**Examples:**

добавить в `~/.bash_profile` (macOS/Linux) или `C:/Users/NAME/.bash_profile` (Окна):

```bash
alias pro='cd /d/projects'
alias gs='git status'
alias gl='git log --oneline -10'
```

Перезагрузите терминал после изменений.

</details>

</details>


