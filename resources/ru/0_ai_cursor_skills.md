# Cursor — Skills

Многоэтапные рабочие процессы многократного использования, которые учат агента выполнять конкретную задачу. Более подробный, чем правила; вызывается с `/` или применяется автоматически, когда это необходимо.

### Related docs

* [Рабочий процесс AI](./0_ai.md) · [Правила](./0_ai_cursor_rules.md) · [Плагины](./0_ai_cursor_plugins.md) · [Slash-команды](./0_ai_cursor_slash.md) · [Вопросы](./0_ai_cursor_questions.md)

### Main concepts

| Площадь | Темы |
|------|--------|
| **Основы** | [Что такое навыки](#что такое-навыки), [Каталоги](#каталоги-навыков), [SKILL.md](#skillmd-format) |
| **Управление** | [Автоматический против косой черты](#автоматический-против-косой черты-вызов), [обзор путей](#объем-с-путями), [Пользовательский режим](#пользовательский-режим) |
| **Операции** | [Встроенные навыки](#built-in-skills), [Миграция из правил/команд](#migrate-to-skills) |

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

**Definition:** **Навык** — это переносимый пакет с контролем версий, который учит агента выполнять задачи, специфичные для предметной области. Это папка с необходимым `SKILL.md` (вставка YAML + инструкции по уценке) и необязательно `scripts/`, `references/`, и `assets/` этот Агент может действовать с помощью своих инструментов. Навыки более детализированы, чем [rules](./0_ai_cursor_rules.md), и созданы для многоэтапных повторяемых рабочих процессов.

**How it works:**

- **Обнаружение:** при запуске Cursor сканирует каталоги навыков (проект + пользователь; также пути, совместимые с Claude/Codex) и выводит список всех папок, содержащих `SKILL.md`. См. [Каталоги навыков](#skill-directory).
- **Актуальность:** Агент видит доступные навыки и выбирает тот, который соответствует запросу. `description` (ЧТО он делает + КОГДА его использовать). Расплывчатое описание → навык редко применяется автоматически.
- **Вызов вручную:** Тип `/` в чате агента и выберите навык (или `@` прикреплять). Это прикрепит навык к **одному** сообщению. Для всего сеанса повысьте его до [Пользовательский режим](#custom-mode) (Option+Enter/Alt+Enter).
- **Прогрессивный контекст:** Продолжайте `SKILL.md` сосредоточенный; вставьте глубокие документы `references/` и шаблоны в `assets/`. Агент загружает эти файлы по требованию, вместо того, чтобы распихивать все по очереди.
- **Действительно:** укажите агента на `scripts/deploy.sh` (или аналогичный). Он считывает навык, затем запускает указанные скрипты с помощью инструментов — Bash, Python, JS и т. д.
- **Открытый стандарт**. Навыки агентов работают со всеми агентами, которые реализуют [agentskills.io](https://agentskills.io). Cursor также включает в себя [встроенные навыки](#built-in-skills) (`/create-skill`, `/review`, …) рядом с твоим.

**When to use:**

| Используйте **навык**, когда… | Предпочитайте **правило**, когда… |
| --- | --- |
| Многоэтапная процедура (развертывание, аудит, обновление перспектив, получение запроса на запрос). | Краткое руководство или ограничение по кодированию («только TypeScript», «без экспорта по умолчанию»). |
| Агенту нужны упорядоченные шаги, контрольные списки или сценарии. | Руководство должно всегда следовать / посредством файловых глобусов / `@mention`. |
| Рабочий процесс можно повторно использовать в чатах и ​​поделиться им в репозитории. | Достаточно нескольких строк; нет пьесы. |

**Common pitfalls:** Написание «помогает с документами» в качестве описания (слишком расплывчато); вбрасываю роман в `SKILL.md` вместо прогрессивного `references/`; использование навыков для создания стиля, который принадлежит правилу; забывая `disable-model-invocation: true` когда ты только хочешь `/skill-name` (см. [Автоматический против косой черты](#automatic-vs-slash-infection)).

**Pluses and minuses:**

| + | − |
| --- | --- |
| Общедоступные, отслеживаемые git плейбуки для команды. | Плохой `description` → никогда не применяется автоматически. |
| Скрипты+ссылки+ассеты, загружаются постепенно. | Долгие постоянные навыки сжигают контекст. |
| Работает с `/`, автовыбор, пользовательский режим и плагины. | Правила пересекаются, если вы смешиваете «всегда стиль» с навыками. |

**Examples:**

Минимальный навык (папка `.cursor/skills/deploy-staging/SKILL.md`):

```markdown
---
name: deploy-staging
description: >
  Deploy the app to staging. Use when the user asks to deploy, ship to staging,
  or verify a staging release.
---

# Deploy to staging

1. Run the test suite
2. Build the production bundle
3. Deploy to the staging environment
4. Verify the deployment health check
```

Навык со скриптами (Агент следует по относительным путям от корня навыка):

```markdown
---
name: deploy-app
description: >
  Deploy the application to staging or production. Use when deploying code
  or when the user mentions deployment, releases, or environments.
---

# Deploy App

Run `scripts/deploy.sh <environment>` where `<environment>` is `staging` or `production`.
Before deploying, run `python scripts/validate.py`.
```

Создайте его в интерактивном режиме: введите `/create-skill` и опишите рабочий процесс — имя, структура и место сохранения встроенных в Cursor шаблонов навыков.

**Thoughts:** Правила = «всегда/при сопоставлении файлов». Навыки = «как выполнять эту работу». Если вы будете вставлять в чат один и тот же контрольный список каждую неделю, сделайте это навыком.

**Sources:** [Навыки агента](https://cursor.com/docs/skills.md) · [Что такое навыки?](https://cursor.com/docs/skills.md#what-are-skills) · [Помощь по навыкам](https://cursor.com/help/customization/skills) · [agentskills.io](https://agentskills.io)

</details>

## Skill directories

<details>
<summary>Skill directories</summary>

**Definition:** Курсор загружает навыки из папок проекта и пользователя; каждый навык представляет собой каталог, содержащий `SKILL.md`.

**How it works:**

| Расположение | Область применения |
| --- | --- |
| `.agents/skills/` | Проект |
| `.cursor/skills/` | Проект |
| `~/.agents/skills/` | Пользователь (локальный компьютер) |
| `~/.cursor/skills/` | Пользователь (локальный; может синхронизироваться с облачными агентами) |

- Также обнаруживает каталоги Claude/Codex: `.claude/skills/`, `.codex/skills/`и `~/` варианты.
- Вложенные папки категорий подходят (например, `.cursor/skills/shipping/land-it/SKILL.md`); имя навыка — это папка, в которой хранится `SKILL.md`.
- Навыки вложенного пакета (например. `apps/web/.cursor/skills/`) ограничены файлами в этом пакете.

**When to use:** Внедрите командные рабочие процессы `.cursor/skills/` (совершить их). Включите личные привычки `~/.cursor/skills/`.

**Sources:** [Каталоги навыков](https://cursor.com/docs/skills.md#skill-directories)

</details>

## SKILL.md format

<details>
<summary>SKILL.md format</summary>

**Definition:** Каждый навык – это `SKILL.md` файл с заголовком YAML (`name`, `description`) и инструкции по уценке.

**How it works:**

- Необходимый: `name` (кебаб-кебаб, должен соответствовать родительской папке), `description` (используется для автоматической релевантности).
- Необязательный: `paths` (глобальная область видимости), `disable-model-invocation` (только косая черта), `icon` / `color` (значок пользовательского режима), `metadata`.
- Дополнительные каталоги рядом с `SKILL.md`: `scripts/`, `references/`, `assets/`.

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

**Sources:** [Формат файла SKILL.md](https://cursor.com/docs/skills.md#skillmd-file-format)

</details>

## Automatic vs slash invocation

<details>
<summary>Automatic vs slash invocation</summary>

**Definition:** По умолчанию агент может применить навык, если запрос соответствует его описанию; с `disable-model-invocation: true` он запускается только тогда, когда вы печатаете `/skill-name`.

**How it works:**

- По умолчанию: вызов модели включен — навык ведет себя как умная книга действий.
- `disable-model-invocation: true` — классическое поведение слэш-команды (только явное).
- Ввод текста `/` прикрепляет навык к **одному** сообщению, если вы не переведете его в пользовательский режим.

**When to use:** Автоматически для плейбуков домена, которые агент должен получить. Slash-только для дорогостоящих или опасных рабочих процессов, на которые вы должны согласиться.

**Sources:** [Отключение автоматического вызова](https://cursor.com/docs/skills.md#disabling-automatic-infection)

</details>

## Scoping with paths

<details>
<summary>Scoping with paths</summary>

**Definition:** The `paths` Поле frontmatter ограничивает отображение навыка файлами, соответствующими шаблонам glob.

**How it works:**

- Принимает список или строку переменных, разделенных запятыми.
- Сброшено `paths` → доступно независимо от открытых файлов.
- Наследие `globs` все еще работает; новые навыки следует использовать `paths`.

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

**Sources:** [Охват навыка конкретными файлами](https://cursor.com/docs/skills.md#scoping-a-skill-to-specified-files)

</details>

## Custom Mode

<details>
<summary>Custom Mode</summary>

**Definition:** Пользовательский режим сохраняет навык в контексте на протяжении всего сеанса (значок во входных данных в чате), а не прикрепляет его к одному сообщению.

**How it works:**

- Выберите навык из `/`, затем Option+Enter (Mac)/Alt+Enter (Windows) или **Использовать как режим**.
- Стиль с дополнительным `icon` и `color` фронтовая тема.
- Доступно в окне агентов и интерфейсе командной строки.

**When to use:** Длительные сеансы, которые должны оставаться в одном playbook (TDD, контрольный список проверки кода). Пропустите одноразовые задачи.

**Sources:** [Использование навыка в качестве пользовательского режима](https://cursor.com/docs/skills.md#using-a-skill-as-a-custom-mode) · [Агенты подсказок](https://cursor.com/docs/agent/prompting.md)

</details>

## Built-in skills

<details>
<summary>Built-in skills</summary>

**Definition:** Cursor предоставляет встроенные навыки (управляемые Cursor), которые появляются в `/` меню рядом с вашими собственными навыками.

**How it works:** Встроенные модули с высоким трафиком включают в себя `/create-rule`, `/create-skill`, `/create-hook`, `/review`, `/review-bugbot`, `/review-security`, `/loop`, `/canvas`, `/migrate-to-skills`, `/split-to-prs`, `/shell`. Ежедневный список см. в разделе [Slash-команды](./0_ai_cursor_slash.md).

**When to use:** Предпочитайте встроенные функции для создания правил/навыков/крючков и для отзывов, а не заново изобретайте подсказки.

**Sources:** [Встроенные навыки курсора](https://cursor.com/docs/skills.md#built-in-cursor-skills)

</details>

## Migrate to skills

<details>
<summary>Migrate to skills</summary>

**Definition:** `/migrate-to-skills` (Курсор 2.4+) преобразует подходящие динамические правила и косые команды в навыки агента.

**How it works:**

- Преобразует правила «Применять разумно» (`alwaysApply: false` / не установлено, нет `globs`) → обычные навыки.
- Преобразует пользователя/рабочее пространство `.cursor/commands` → навыки работы с `disable-model-invocation: true`.
- **не** мигрирует `alwaysApply: true`, глобальные правила или пользовательские правила (не на диске).

**Examples:**

```text
# In Agent chat
/migrate-to-skills
```

**Sources:** [Перенос правил и команд в навыки](https://cursor.com/docs/skills.md#migrating-rules-and-commands-to-skills)

</details>

## Interview Practice

Вопросы и ответы перемещены в [Курсор — Вопросы](./0_ai_cursor_questions.md).