# Databases — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Databases — собеседование](./0_sd_databases_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Databases](https://devinterview.io/questions/software-architecture-and-system-design/databases-interview-questions/).

### Database Fundamentals

<details>
<summary>What is a database management system (DBMS), and can you name some examples?</summary>

### What is a database management system (DBMS), and can you name some examples?

**Definition:**

Система управления базами данных — программа, которая хранит данные и отвечает на запросы, чтобы приложения не читали и не писали файлы сами.

**How it works:**

- Она даёт модель (таблицы, документы, ключи) и способ вставлять, читать, обновлять и удалять.
- Она проводит правила целостности, выдаёт или отказывает в доступе и согласовывает одновременные сессии, чтобы два писателя молча не затёрли друг друга.
- Она умеет копировать данные и восстанавливать их и планирует запросы так, чтобы чтение не просматривало больше необходимого.
- Реляционная система (PostgreSQL, MySQL, SQL Server, Oracle) хранит таблицы и использует SQL. NoSQL (MongoDB, Cassandra, Redis, Neo4j) использует другую модель и обычно масштабируется добавлением машин.
- Облачные предложения (Amazon RDS, Cloud SQL, DynamoDB) запускают это ПО за вас. Системы NewSQL целятся в SQL плюс горизонтальный масштаб. Объектные базы сохраняют объекты языка. Системы в памяти вроде Redis держат рабочий набор в RAM. Мультимодельный сервер поддерживает больше одной из этих моделей.

**Examples:**

Приложение вызывает `SELECT * FROM invoices WHERE id = 42`. СУБД проверяет право, использует индекс и возвращает строку. Файл таблицы приложение не открывает.

</details>

<details>
<summary>Explain the ACID properties in the context of databases.</summary>

### Explain the ACID properties in the context of databases.

**Definition:**

ACID — набор гарантий, которые транзакция либо даёт, либо явно ослабляет: работа целиком или никак, правила соблюдены, одновременные транзакции не видят незаконченную работу друг друга, и зафиксированное переживает аварию.

**How it works:**

- Атомарность: фиксируется каждый оператор транзакции или ни один. Движок откатывает неудачный перевод, чтобы не списать с одного счёта и забыть другой. Механизм — журнал изменений, который можно откатить.
- Согласованность: фиксация оставляет базу удовлетворяющей ограничениям (ключи, проверки, внешние ключи). Бизнес-правило приложение всё равно должно выразить ограничением или частью транзакции. Движок его не выдумает.
- Изоляция: одновременные транзакции ведут себя так, будто шли в некотором последовательном порядке, в той мере, которую обещает уровень изоляции. Read uncommitted, read committed, repeatable read и serializable — обычные ступени от слабого к сильному. Более слабые уровни дают больше параллелизма и больше аномалий.
- Долговечность: после возврата из commit изменение лежит на устойчивом носителе (журнал упреждающей записи сброшен на диск). Авария восстанавливает зафиксированное и отбрасывает незафиксированное.
- Движение денег, уменьшение остатка и бронь места — случаи, где нужен полный набор. Кэш или конвейер журналов часто ослабляют одну из гарантий сознательно.

**Examples:**

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

Если второе обновление падает, первое отменяется. После возврата из `COMMIT` авария всё равно показывает перевод.

</details>

<details>
<summary>What are the differences between SQL and NoSQL databases?</summary>

### What are the differences between SQL and NoSQL databases?

**Definition:**

SQL-базы хранят строки в таблицах с объявленной схемой и отвечают на SQL. NoSQL — семейство других моделей, которое выбирают, когда эта форма или её история масштабирования не подходят.

**How it works:**

- Данные SQL — таблицы, столбцы и связи. Схема проверяется при записи. NoSQL может быть документами (MongoDB), парами ключ-значение (Redis), широкими столбцами (Cassandra) или графами (Neo4j). Документное хранилище может принять поля, которых не было у предыдущего документа.
- Запросы SQL декларативны и хороши в соединениях. У каждой модели NoSQL свой путь доступа, а соединение часто делают в приложении или избегают, храня данные вместе.
- Традиционный SQL масштабируют вверх, усиливая одну машину, а вширь — с большим трудом. Многие системы NoSQL созданы, чтобы добавлять машины и оставаться доступными, когда одна упала.
- Транзакции SQL обычно ACID. Системы NoSQL располагаются от сильной согласованности до согласованности в конечном счёте. Вторую выбирают, только если устаревшие чтения приемлемы.
- Берите SQL, когда связи и ограничения и есть продукт. Берите документ или ключ-значение, когда вы в основном забираете один агрегат по id и растёте добавлением узлов.

**Examples:**

Счёт со строками и клиентом — несколько SQL-таблиц и внешние ключи. Блоб сессии, который забирают по одному id, — запись ключ-значение. Заталкивать второе в пять таблиц или первое в один документ, который нельзя ограничить, — это и есть несоответствие.

</details>

<details>
<summary>Describe a relational database schema.</summary>

### Describe a relational database schema.

**Definition:**

Реляционная схема — объявленная форма данных: таблицы, столбцы, типы, ключи и правила, которые держат строки согласованными.

**How it works:**

- Таблица — множество строк. У каждого столбца есть имя и тип (целое, текст, метка времени, логическое).
- Первичный ключ идентифицирует одну строку. Ограничение уникальности делает то же для бизнес-значения, которое ключом не является. Внешний ключ говорит, что значение должно существовать в другой таблице.
- Связи бывают один-к-одному, один-ко-многим и многие-ко-многим. Для последней нужна таблица пар.
- `NOT NULL` запрещает отсутствие значения. `CHECK` запрещает значение вне правила. `DEFAULT` заполняет столбец, когда вставка его опускает. Индекс — не ограничение. Он ускоряет поиск, и через него часто проводят уникальность.
- Схему ревьюят. Строки хранят.

**Examples:**

```sql
CREATE TABLE students (
  id bigint PRIMARY KEY,
  email text NOT NULL UNIQUE
);
CREATE TABLE enrollments (
  student_id bigint REFERENCES students (id),
  course_id bigint NOT NULL,
  PRIMARY KEY (student_id, course_id)
);
```

</details>

<details>
<summary>What is a primary key, and why is it important?</summary>

### What is a primary key, and why is it important?

**Definition:**

Первичный ключ — столбец или столбцы, которые идентифицируют одну строку и не повторяются. Таблица использует его как адрес, на который указывают другие таблицы.

**How it works:**

- Значения уникальны и не равны null. Составной ключ уникален как кортеж, даже если каждый столбец по отдельности повторяется.
- Ключ меняют редко. Внешние ключи его хранят, поэтому изменение расходится волной. Суррогат (`bigint`, UUID) остаётся устойчивым, когда бизнес-код исправляют.
- Через него соединяют, им останавливают повторы строк и им нормализуют: атрибуты, которые зависят от строки, живут с этим ключом.
- Движки различаются шириной и типами. Столбцы больших объектов часто запрещены внутри ключа, а у индекса есть предел в байтах. Эти пределы — подробности движка, а не часть реляционной идеи.
- У одной таблицы один первичный ключ. Другие правила уникальности — ограничения `UNIQUE`.

**Examples:**

```sql
CREATE TABLE invoices (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  number text NOT NULL UNIQUE
);
```

`id` — устойчивый адрес. `number` уникален, потому что так говорит бизнес, и его можно исправить, не переписывая каждый внешний ключ.

</details>

<details>
<summary>Can you explain what a foreign key is and its role in the database?</summary>

### Can you explain what a foreign key is and its role in the database?

**Definition:**

Внешний ключ — столбец, значения которого должны совпадать с потенциальным ключом другой таблицы. Он делает связь принудительной, а не договорённостью в коде приложения.

**How it works:**

- Типы совпадают со столбцом, на который ссылаются. База отвергает вставку или обновление, которое указывало бы на отсутствующего родителя.
- При удалении или обновлении родителя выбирают действие: restrict (отклонить), cascade (применить то же изменение к детям) или записать в дочерний столбец null, если он это допускает.
- Соединения используют этот столбец, чтобы собрать родителя и ребёнка в один результат. Внутреннее соединение оставляет только совпавшие строки. Внешнее оставляет строки одной стороны, у которых нет пары.
- Ограничение видно в каталоге (`information_schema.referential_constraints` и `key_column_usage` в стандартном SQL). Угадывать его по именам столбцов не нужно.

**Examples:**

```sql
CREATE TABLE lines (
  id bigint PRIMARY KEY,
  invoice_id bigint NOT NULL REFERENCES invoices (id)
);
SELECT invoices.number, lines.amount
FROM lines
JOIN invoices ON invoices.id = lines.invoice_id;
```

</details>

<details>
<summary>What is database normalization, and why do we use it?</summary>

### What is database normalization, and why do we use it?

**Definition:**

Нормализация расставляет таблицы так, чтобы каждый факт хранился один раз и каждый неключевой столбец зависел от ключа, от всего ключа и только от ключа.

**How it works:**

- Выигрыш — меньше противоречий: адрес клиента живёт в одной строке, и нельзя обновить одну копию и забыть другую. Цена — больше соединений.
- Первая нормальная форма: в каждом столбце одно значение, а не список, и каждая строка однозначно идентифицирована.
- Вторая нормальная форма: при составном ключе каждый неключевой столбец зависит от всего ключа, а не от его части. Название курса не принадлежит записи о зачислении с ключом из студента и курса.
- Третья нормальная форма: неключевой столбец не зависит от другого неключевого столбца. Город не стоит рядом с почтовым индексом, если город определяется этим индексом. Его переносят в свою таблицу.
- Бойс–Кодд — более строгая форма того же правила: каждый детерминант является потенциальным ключом. Четвёртая нормальная форма убирает многозначные зависимости (два независимых списка в одной таблице). Пятая убирает зависимости соединения, которые нельзя восстановить из меньших таблиц. Большинство рабочих схем останавливаются на третьей нормальной форме или на Бойсе–Кодде.

**Examples:**

```text
students(id, name, email)
enrollments(student_id, course_id)
courses(id, title)
```

Почта студента хранится один раз. Зачисление хранит только два идентификатора.

</details>

<details>
<summary>What is denormalization and when would you consider it?</summary>

### What is denormalization and when would you consider it?

**Definition:**

Денормализация сознательно копирует факт в другую таблицу, чтобы горячее чтение не делало соединение, ценой поддержания этих копий одинаковыми.

**How it works:**

- Чтения становятся проще и часто быстрее. Записи становятся труднее: каждая копия должна измениться в одной транзакции, либо вы принимаете окно, в котором они расходятся.
- Хранилище растёт. Дефект, который обновляет одну копию, — тихий дефект целостности, против которого нормализация и задумана.
- Это окупается, когда повторённое значение постоянно читают и редко пишут: подпись статуса, имя клиента на счёте, который после выставления менять нельзя, отчётная таблица, которую пересобирают по расписанию.
- Это также окупается, когда вы секционируете или шардируете и хотите, чтобы каждая часть отвечала, не вызывая остальные.
- Представление или запрос могут показать соединённую форму, не храня копию. Предпочитайте это, пока измерение не скажет, что проблема в соединении.

**Examples:**

```sql
-- пишется один раз, когда счёт выставлен
INSERT INTO invoices (id, customer_name, total)
SELECT 42, customers.name, 120 FROM customers WHERE customers.id = 7;
```

Позднее переименование клиента выставленный счёт не переписывает. Эта копия — снимок, а не случайность.

</details>

<details>
<summary>Compare and contrast the DROP, DELETE, and TRUNCATE commands.</summary>

### Compare and contrast the DROP, DELETE, and TRUNCATE commands.

**Definition:**

`DELETE` удаляет строки и умеет фильтровать. `TRUNCATE` быстро опустошает таблицу. `DROP` удаляет саму таблицу.

**How it works:**

- `DELETE FROM t WHERE …` удаляет совпавшие строки, запускает строковые триггеры и входит в транзакцию, которую можно откатить. Это команда, когда часть строк должна остаться.
- `TRUNCATE` удаляет все строки и обычно возвращает место, не просматривая каждую строку. Это не фильтрованное удаление. В PostgreSQL его можно откатить внутри транзакции. В MySQL это DDL, и он фиксируется неявно. Не переносите поведение одного движка на другой.
- `DROP TABLE` удаляет таблицу, её индексы и определение. PostgreSQL может откатить drop внутри транзакции. MySQL его фиксирует. В обоих случаях код, который всё ещё называет таблицу, ломается.
- Ничто из этого не стратегия резервного копирования. `DELETE` без `WHERE` — авария. `TRUNCATE` и `DROP` — аварии, из которых нельзя выйти фильтром.

**Examples:**

```sql
DELETE FROM sessions WHERE expires_at < now();  -- часть строк остаётся
TRUNCATE TABLE sessions;                         -- строк нет, таблица есть
DROP TABLE sessions;                             -- таблицы нет
```

</details>

<details>
<summary>What is the difference between a full join and an inner join?</summary>

### What is the difference between a full join and an inner join?

**Definition:**

Внутреннее соединение возвращает только совпавшие пары. Полное соединение возвращает эти пары и ещё несовпавшие строки с обеих сторон.

**How it works:**

- Внутреннее: студент без зачисления исчезает, и зачисление с отсутствующим id студента тоже. Вы просили пары.
- Полное (full outer): появляется каждый студент, с пустыми столбцами зачисления, если их нет, и каждое зачисление, с пустыми столбцами студента, если студента нет. Так в одном результате находят оба вида сирот.
- Левое соединение — односторонняя версия: сохранить каждую строку левой таблицы. Правое сохраняет каждую строку правой. Полное — оба этих несовпавших множества плюс совпадения.
- Совпадение — условие `ON`. Фильтр в `WHERE`, применённый к внешней стороне после соединения, может молча превратить полное или левое соединение обратно во внутреннее.

**Examples:**

```sql
SELECT students.id, enrollments.course_id
FROM students
FULL JOIN enrollments ON enrollments.student_id = students.id;
```

У студента без курса `course_id` равен null. Внутреннее соединение этого студента опустило бы.

</details>

### SQL and Query Optimization

<details>
<summary>How would you write an SQL query to fetch duplicate records from a table?</summary>

### How would you write an SQL query to fetch duplicate records from a table?

**Definition:**

Повторяющиеся строки — те, что делят значение, которое вы считали уникальным. Группируют по этому значению и оставляют группы, где счётчик больше одного.

**How it works:**

- `GROUP BY` по столбцам, которые должны были быть уникальны, `HAVING count(*) > 1`, и вы получаете ключи, которые столкнулись. Соедините обратно с таблицей, если нужны все копии, а не только ключ.
- `count(*)` считает строки. `count(column)` пропускает null, и это прячет другую проблему.
- Оконная функция вроде `row_number() OVER (PARTITION BY email)` нумерует копии, чтобы удалить все, кроме одной. Делайте это в транзакции и заранее решите, какая копия останется.
- Ограничение уникальности — исправление на будущее. Запрос только находит ущерб.

**Examples:**

```sql
SELECT email, count(*)
FROM users
GROUP BY email
HAVING count(*) > 1;
```

</details>

<details>
<summary>What is a prepared statement, and why would you use one?</summary>

### What is a prepared statement, and why would you use one?

**Definition:**

Подготовленный оператор — запрос, который движок разбирает один раз, с заполнителями, а затем выполняет со значениями, переданными отдельно. Значения не могут изменить форму оператора.

**How it works:**

- Это разделение — защита от SQL-инъекции: текст фиксирован, а кавычка внутри значения остаётся данными.
- Движок может переиспользовать план выполнения для следующих вызовов с новыми значениями. Это важно, когда один оператор выполняется в цикле.
- SQL остаётся читаемым, потому что параметры в него не склеивают.
- Используйте его, когда значение приходит извне программы и когда оператор повторяется. Оператор, собранный склейкой строк, не имеет ни того ни другого свойства.
- Подготовка бесполезна для разовой административной команды, в текст которой внешние данные не входят. Она не необязательна для запроса, в который входят.

**Examples:**

```sql
PREPARE find_user (text) AS
  SELECT id FROM users WHERE email = $1;
EXECUTE find_user('ada@example.com');
```

</details>

<details>
<summary>What is the N+1 query problem and how can you solve it?</summary>

### What is the N+1 query problem and how can you solve it?

**Definition:**

Проблема N+1 — это один запрос за списком родителей и затем ещё по запросу на каждого родителя, чтобы догрузить то, что можно было забрать вместе с ними.

**How it works:**

- Она проявляется при ленивой загрузке: первый запрос возвращает 50 счетов, а чтение `invoice.customer` каждый раз отправляет новый запрос. Пятьдесят один круг заменяет один.
- Исправление — загрузить связь в исходном запросе: соединение или явная жадная загрузка (`JOIN` / `includes` / `selectin`), которая забирает детей пакетом.
- Ленивая загрузка обычно причина, а не лечение. Оставляйте её для связей, которых этот запрос не коснётся.
- Проекция, которая выбирает только нужные странице столбцы, не строит весь граф объектов.
- Разбиение на страницы уменьшает N. Оно не убирает запрос на строку. Меряйте число операторов, а не только время одного из них.

**Examples:**

```sql
-- один запрос вместо 1 + N
SELECT invoices.id, customers.name
FROM invoices
JOIN customers ON customers.id = invoices.customer_id
WHERE invoices.status = 'open';
```

</details>

<details>
<summary>Explain the function of GROUP BY and HAVING clauses in SQL.</summary>

### Explain the function of GROUP BY and HAVING clauses in SQL.

**Definition:**

`GROUP BY` схлопывает строки с общим ключом в одну строку на группу, чтобы агрегат посчитался по каждой группе. `HAVING` фильтрует эти группы. `WHERE` фильтрует строки до группировки.

**How it works:**

- Агрегаты вроде `count`, `sum` и `avg` считаются по группе. Каждый выбранный столбец либо входит в `GROUP BY`, либо находится внутри агрегата. Так строка остаётся осмысленной.
- `WHERE` агрегат не видит. Он отбрасывает счета до того, как их посчитают.
- `HAVING` агрегат видит. Он отбрасывает группы, например клиентов, у которых посчитанный итог ниже порога.
- Порядок работы: `WHERE`, затем `GROUP BY`, затем `HAVING`, затем `ORDER BY`.

**Examples:**

```sql
SELECT customer_id, count(*) AS n
FROM invoices
WHERE status = 'open'
GROUP BY customer_id
HAVING count(*) > 3;
```

Закрытые счета в группу не входят. Клиенты с тремя или меньше открытыми счетами исчезают после подсчёта.

</details>

<details>
<summary>What are indexes and how do they work in databases?</summary>

### What are indexes and how do they work in databases?

**Definition:**

Индекс — структура рядом с таблицей, которая сопоставляет ключ строкам, где он встречается, чтобы движок не читал каждую строку ради условия.

**How it works:**

- B-дерево — вариант по умолчанию. Оно обслуживает равенство и диапазон (`WHERE created_at >= …`), потому что ключи упорядочены.
- Хеш-индекс обслуживает только равенство. Диапазону он не помогает.
- Полнотекстовый индекс разбивает текст для поиска по словам. Битовый индекс подходит столбцу с немногими различными значениями и обычен в аналитических движках.
- Планировщик может проигнорировать индекс, когда условие совпадает с большей частью таблицы. Тогда дешевле просмотр.
- Каждая вставка, обновление и удаление должны поддерживать индекс. Индексируйте столбцы, по которым фильтруете, соединяете и упорядочиваете. Не индексируйте каждый столбец «на всякий случай».
- Уникальный индекс — ещё и ограничение. Первичный ключ — один из них.

**Examples:**

```sql
CREATE INDEX invoices_customer_idx ON invoices (customer_id);
-- WHERE customer_id = 7 может искать по этому индексу
-- WHERE lower(note) LIKE '%tax%' не может, если вы не проиндексировали это выражение
```

</details>

<details>
<summary>What impact do JOIN operations have on database performance?</summary>

### What impact do JOIN operations have on database performance?

**Definition:**

</details>

<details>
<summary>Define what a subquery is and provide a use case for it.</summary>

### Define what a subquery is and provide a use case for it.

**Definition:**

</details>

<details>
<summary>What is a correlated subquery?</summary>

### What is a correlated subquery?

**Definition:**

</details>

<details>
<summary>Describe how you would optimize a slow SQL query.</summary>

### Describe how you would optimize a slow SQL query.

**Definition:**

</details>

<details>
<summary>Explain the EXPLAIN statement and how you use it in query optimization.</summary>

### Explain the EXPLAIN statement and how you use it in query optimization.

**Definition:**

</details>

### Data Modeling and Design

<details>
<summary>What is an Entity-Relationship (ER) model, and why is it useful?</summary>

### What is an Entity-Relationship (ER) model, and why is it useful?

**Definition:**

</details>

<details>
<summary>Describe the process of converting an ER model into a relational database schema.</summary>

### Describe the process of converting an ER model into a relational database schema.

**Definition:**

</details>

<details>
<summary>How do you design a scalable database schema for a high-traffic application?</summary>

### How do you design a scalable database schema for a high-traffic application?

**Definition:**

</details>

<details>
<summary>What is database sharding, and what are its benefits and drawbacks?</summary>

### What is database sharding, and what are its benefits and drawbacks?

**Definition:**

</details>

<details>
<summary>Explain the term “data integrity” and how it’s enforced in databases.</summary>

### Explain the term “data integrity” and how it’s enforced in databases.

**Definition:**

</details>

### Transactions and Concurrency Control

<details>
<summary>Can you explain the concept of transaction isolation levels?</summary>

### Can you explain the concept of transaction isolation levels?

**Definition:**

</details>

<details>
<summary>What is a deadlock in databases, and how can it be resolved?</summary>

### What is a deadlock in databases, and how can it be resolved?

**Definition:**

</details>

<details>
<summary>Describe optimistic vs. pessimistic locking.</summary>

### Describe optimistic vs. pessimistic locking.

**Definition:**

</details>

<details>
<summary>How does a database ensure consistency during concurrent transactions?</summary>

### How does a database ensure consistency during concurrent transactions?

**Definition:**

</details>

<details>
<summary>What is a savepoint in a database transaction?</summary>

### What is a savepoint in a database transaction?

**Definition:**

</details>

### Database Security

<details>
<summary>What is SQL injection, and how do you prevent it?</summary>

### What is SQL injection, and how do you prevent it?

**Definition:**

</details>

<details>
<summary>Explain the role of access control in database security.</summary>

### Explain the role of access control in database security.

**Definition:**

</details>

<details>
<summary>What are the best practices for storing passwords in a database?</summary>

### What are the best practices for storing passwords in a database?

**Definition:**

</details>

<details>
<summary>How do you secure data transmission to and from a database?</summary>

### How do you secure data transmission to and from a database?

**Definition:**

</details>

<details>
<summary>Describe the use of encryption within databases for data at rest.</summary>

### Describe the use of encryption within databases for data at rest.

**Definition:**

</details>

### Backup and Recovery

<details>
<summary>What is a database snapshot, and when would you use one?</summary>

### What is a database snapshot, and when would you use one?

**Definition:**

</details>

<details>
<summary>Explain the difference between logical and physical backups.</summary>

### Explain the difference between logical and physical backups.

**Definition:**

</details>

<details>
<summary>How would you restore a database from a backup file?</summary>

### How would you restore a database from a backup file?

**Definition:**

</details>

<details>
<summary>What are the common strategies for database disaster recovery?</summary>

### What are the common strategies for database disaster recovery?

**Definition:**

</details>

<details>
<summary>How does point-in-time recovery work in databases?</summary>

### How does point-in-time recovery work in databases?

**Definition:**

</details>

### Performance Tuning and Scaling

<details>
<summary>How would you handle a scenario where your database’s read load significantly increases?</summary>

### How would you handle a scenario where your database’s read load significantly increases?

**Definition:**

</details>

<details>
<summary>What strategies exist for scaling writes in a high-volume database system?</summary>

### What strategies exist for scaling writes in a high-volume database system?

**Definition:**

</details>

<details>
<summary>Describe how connection pooling benefits database performance.</summary>

### Describe how connection pooling benefits database performance.

**Definition:**

</details>

<details>
<summary>How do you monitor and identify database performance bottlenecks?</summary>

### How do you monitor and identify database performance bottlenecks?

**Definition:**

</details>

<details>
<summary>What is horizontal and vertical scaling in databases?</summary>

### What is horizontal and vertical scaling in databases?

**Definition:**

</details>

### NoSQL Databases

<details>
<summary>Explain what a document store is and give an example of where it’s appropriate to use.</summary>

### Explain what a document store is and give an example of where it’s appropriate to use.

**Definition:**

</details>

<details>
<summary>What is a graph database, and what are its typical use cases?</summary>

### What is a graph database, and what are its typical use cases?

**Definition:**

</details>

<details>
<summary>Describe the key-value store model and its typical applications.</summary>

### Describe the key-value store model and its typical applications.

**Definition:**

</details>

<details>
<summary>How do you choose between consistency and availability in a NoSQL database, referencing the CAP theorem?</summary>

### How do you choose between consistency and availability in a NoSQL database, referencing the CAP theorem?

**Definition:**

</details>

<details>
<summary>What is eventual consistency, and in what scenarios is it used?</summary>

### What is eventual consistency, and in what scenarios is it used?

**Definition:**

</details>
