# Database — Interview

Ответы заполнены для опубликованной части, остальные пустые.

[ ← Вернуться в хаб](./9_database.md)

### Related docs

- [БД — Основы](./9_database_core.md) · [БД — SQL](./9_database_sql.md) · [БД — NoSQL](./9_database_nosql.md) · [БД — ORM](./9_database_orm.md) · [БД — Производство](./9_database_production.md) · [БД — Интервью](./9_database_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы с [Devinterview.io — SQL](https://devinterview.io/questions/web-and-mobile-development/sql-interview-questions/).

### SQL Fundamentals

<details>
<summary>What is SQL and what is it used for?</summary>

### What is SQL and what is it used for?

**Definition:**

SQL — язык описания и запросов к реляционным данным. Им объявляют таблицы и ограничения, меняют строки и задают вопросы, на которые движок отвечает множествами.

**How it works:**

- DDL (`CREATE`, `ALTER`, `DROP`) описывает объекты схемы. DML (`INSERT`, `UPDATE`, `DELETE`, `MERGE`) меняет строки.
- DQL — это `SELECT`, который читает. DCL (`GRANT`, `REVOKE`) задаёт, кому что можно. TCL (`BEGIN`, `COMMIT`, `ROLLBACK`) собирает изменения в транзакцию.
- Реляционный движок проверяет типы и ограничения и использует индексы, чтобы не читать каждую строку.
- Транзакции ACID делают группу записей успешной или неуспешной целиком и долговечной после фиксации.
- Один и тот же оператор идёт на PostgreSQL, MySQL и SQL Server с небольшими различиями диалекта в типах, `LIMIT` и синтаксисе upsert.

**Examples:**

```sql
SELECT customer_id, SUM(total) AS spent
FROM orders
WHERE placed_at >= DATE '2026-01-01'
GROUP BY customer_id;
```

**Sources:**

- [PostgreSQL — SQL syntax](https://www.postgresql.org/docs/current/sql-syntax.html)
</details>

<details>
<summary>Describe the difference between SQL and NoSQL databases.</summary>

### Describe the difference between SQL and NoSQL databases.

**Definition:**

SQL-базы хранят строки в таблицах с объявленной схемой и отвечают на вопросы соединениями этих таблиц. NoSQL — семейство хранилищ, которые отказываются от одной табличной модели, чтобы масштабироваться или держать другую форму данных.

**How it works:**

- Реляционная схема фиксирует столбцы и связи заранее. Ограничения и транзакции на несколько строк — обычный инструмент целостности.
- Документные хранилища держат JSON-подобный документ на ключ. Ключ-значение держит непрозрачное значение. Колоночные — разреженные строки. Графовые — узлы и рёбра.
- Реляционные системы долго предпочитали вертикальное масштабирование и реплики для чтения. Распределённый SQL тоже режет данные и сохраняет SQL-транзакции. Многие NoSQL сначала режут данные и предлагают более слабый выбор согласованности.
- PostgreSQL может хранить JSON рядом с реляционными столбцами. Это не делает его документной базой: язык запросов по-прежнему SQL.
- Таблицы выбирают, когда данные связаны и нужны жёсткие ограничения. Документ или ключ-значение — когда доступ это «загрузить блок по id», а соединения редки.

**Sources:**

- [PostgreSQL — Tutorial](https://www.postgresql.org/docs/current/tutorial-concepts.html)
</details>

<details>
<summary>What are the different types of SQL commands?</summary>

### What are the different types of SQL commands?

**Definition:**

Операторы SQL делятся по задаче: описать объекты, изменить строки, прочитать их, выдать права и управлять транзакциями.

**How it works:**

- DQL: `SELECT` с `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, соединениями и `WITH` для обобщённых табличных выражений.
- DDL: `CREATE`, `ALTER`, `DROP`. `TRUNCATE` быстро удаляет все строки, и несколько движков считают это операцией уровня схемы.
- DML: `INSERT`, `UPDATE`, `DELETE` и `MERGE` (вставка или обновление одним оператором).
- TCL: `COMMIT` делает работу долговечной, `ROLLBACK` отменяет её, `SAVEPOINT` отмечает точку внутри транзакции.
- DCL: `GRANT` и `REVOKE` назначают привилегии. Роли группируют эти привилегии.
- Подписи — учебное деление. Настоящий скрипт их смешивает, и `SELECT` может сидеть внутри `INSERT`.

**Examples:**

```sql
BEGIN;
UPDATE accounts SET balance = balance - 20 WHERE id = 7;
UPDATE accounts SET balance = balance + 20 WHERE id = 9;
COMMIT;
```

**Sources:**

- [PostgreSQL — SQL commands](https://www.postgresql.org/docs/current/sql-commands.html)
</details>

<details>
<summary>Explain the purpose of the SELECT statement.</summary>

### Explain the purpose of the SELECT statement.

**Definition:**

`SELECT` читает строки и возвращает набор результатов. Хранимые данные он не меняет. Порядок предложений, который вы пишете, — не порядок, в котором движок логически их применяет.

**How it works:**

- Логический порядок: `FROM` и соединения, `WHERE`, `GROUP BY`, `HAVING`, оконные функции, список `SELECT`, `DISTINCT`, `ORDER BY`, затем `LIMIT`.
- Список выборки может считать выражения, агрегаты и `CASE`. `SELECT *` удобен и ломается, когда столбцы меняются.
- `WITH` именует подзапрос, чтобы следующее предложение им пользовалось, включая рекурсивный обход дерева.
- Оконные функции (`OVER (PARTITION BY ...)`) считают значение на строку, не схлопывая группу, как это делает `GROUP BY`.
- Планировщик может взять индекс, последовательное чтение или стратегию соединения. Оператор описывает результат, а не путь доступа.

**Examples:**

```sql
SELECT id, total,
       SUM(total) OVER (PARTITION BY customer_id) AS customer_spent
FROM orders
WHERE status = 'paid';
```

**Sources:**

- [PostgreSQL — SELECT](https://www.postgresql.org/docs/current/sql-select.html)
</details>

<details>
<summary>What is the difference between WHERE and HAVING clauses?</summary>

### What is the difference between WHERE and HAVING clauses?

**Definition:**

`WHERE` фильтрует строки до группировки. `HAVING` фильтрует группы после вычисления агрегатов. Агрегаты законны в `HAVING` и незаконны в `WHERE`.

**How it works:**

- `WHERE status = 'paid'` отбрасывает неоплаченные заказы до `SUM`, поэтому агрегат дешевле и может использовать индекс по `status`.
- `HAVING SUM(total) > 100` оставляет только группы, чья сумма перешла порог. Во время `WHERE` этой суммы ещё нет.
- Можно использовать оба: отфильтровать строки, сгруппировать, затем отфильтровать группы.
- Условие по обычному столбцу принадлежит `WHERE`. В `HAVING` оно заставляет движок строить группы, которые потом выбросят.
- `GROUP BY` создаёт корзины, которые видит `HAVING`. Без группировки `HAVING` редко то, что нужно.

**Examples:**

```sql
SELECT customer_id, SUM(total) AS spent
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
HAVING SUM(total) > 100;
```

**Sources:**

- [PostgreSQL — SELECT](https://www.postgresql.org/docs/current/sql-select.html)
</details>

<details>
<summary>Define what a JOIN is in SQL and list its types.</summary>

### Define what a JOIN is in SQL and list its types.

**Definition:**

Соединение складывает строки двух таблиц по условию совпадения, обычно внешний ключ равен первичному. Тип соединения решает, что происходит со строками без пары.

**How it works:**

- `INNER JOIN` оставляет только совпавшие пары.
- `LEFT JOIN` оставляет каждую строку левой таблицы и заполняет правую сторону NULL, когда пары нет. `RIGHT JOIN` — зеркало. `FULL JOIN` оставляет несовпавшие строки с обеих сторон.
- `CROSS JOIN` строит каждую пару и не имеет условия совпадения. Он умножает числа строк.
- Самосоединение использует одну таблицу дважды под двумя псевдонимами, например сотрудника и его руководителя.
- Перечисляйте нужные столбцы. `SELECT *` через соединение дублирует ключевые столбцы и ломается, если любая таблица обрастёт.
- В PostgreSQL первичный ключ — не кластерный индекс. Планировщик может сделать hash join, merge join или вложенные циклы; индекс по столбцу соединения помогает двум последним.

**Examples:**

```sql
SELECT e.name, m.name AS manager
FROM employees AS e
LEFT JOIN employees AS m ON m.id = e.manager_id;
```

**Sources:**

- [PostgreSQL — Table expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html)
</details>

<details>
<summary>What is a primary key in a database?</summary>

### What is a primary key in a database?

**Definition:**

Первичный ключ — столбец или набор столбцов, который опознаёт одну строку. Движок отвергает вторую строку с тем же ключом и отвергает NULL в этих столбцах.

**How it works:**

- Уникальность и `NOT NULL` обеспечиваются. Менять первичный ключ можно, и обычно это ошибка: каждый внешний ключ, который на него указывает, тоже должен сдвинуться.
- Другие таблицы на него ссылаются. Поэтому соединение значит «этот ребёнок принадлежит тому родителю».
- InnoDB и SQL Server часто хранят таблицу в порядке первичного ключа (кластерный индекс). PostgreSQL хранит кучу и добавляет уникальный B-tree для первичного ключа. Это разная раскладка.
- Суррогатный ключ (`bigint` identity или UUID с временем в начале) остаётся стабильным, когда деловой атрибут вроде email меняется. Естественный ключ годится, когда атрибут правда никогда не меняется.
- Узкие ключи держат индексы меньше. Широкий текстовый первичный ключ копируется в каждый вторичный индекс, который указывает на строку.

**Examples:**

```sql
CREATE TABLE customers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE
);
```

**Sources:**

- [PostgreSQL — Primary keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-PRIMARY-KEYS)
</details>

<details>
<summary>Explain what a foreign key is and how it is used.</summary>

### Explain what a foreign key is and how it is used.

**Definition:**

Внешний ключ — столбец, чьи значения должны совпадать с ключом-кандидатом другой таблицы или быть NULL. Так связь держит база, а не только приложение.

**How it works:**

- Вставка дочерней строки с несуществующим id родителя не проходит. Удаление родителя не проходит, пока дети на него указывают, если не задать `ON DELETE CASCADE`, `SET NULL` или `SET DEFAULT`.
- `ON UPDATE` даёт те же варианты, когда ключ родителя меняется.
- NULL допустим, если столбец не объявлен `NOT NULL`. NULL во внешнем ключе значит «родителя нет», а не «родителя забыли».
- В PostgreSQL внешний ключ не индексируется сам. Добавьте индекс на дочерний столбец, иначе удаление и соединение по нему читают всю дочернюю таблицу.
- Сторона родителя должна быть первичным ключом или уникальным ограничением. Внешний ключ не может указывать на произвольный неуникальный столбец.
- Внешних ключей между базами нет. Целостность между сервисами — задача приложения.

**Examples:**

```sql
CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers (id)
);
CREATE INDEX ON orders (customer_id);
```

**Sources:**

- [PostgreSQL — Foreign keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)
</details>

<details>
<summary>How can you prevent SQL injections?</summary>

### How can you prevent SQL injections?

**Definition:**

SQL-инъекция случается, когда недоверенный текст склеивают в оператор, и движок разбирает его как SQL. Исправление — отправлять форму оператора и значения отдельно.

**How it works:**

- Параметризованный запрос или подготовленный оператор использует заполнители (`$1`, `?`). Драйвер подставляет значения так, что кавычка во вводе не закрывает строку.
- Хранимые процедуры помогают, только если тоже принимают параметры. Склейка SQL внутри процедуры всё ещё уязвима.
- Проверяйте форму там, где можете: перечень столбцов сортировки, приведение id к целому. Для идентификаторов белый список лучше чёрного: их нельзя связать как значения.
- Роль базы не должна владеть схемой и читать чужие таблицы. Тогда ошибка не сможет сделать `DROP` того, чего роль не видит.
- ORM безопасны, когда параметризуют. Запросы, собранные строкой через `.raw()`, — нет.
- Ручное экранирование кавычек ломается на кодировках и на идентификаторах. Это не основная защита.

**Examples:**

```sql
PREPARE find_user (text) AS
  SELECT id FROM users WHERE email = $1;
EXECUTE find_user('ada@example.com');
```

**Sources:**

- [OWASP — SQL injection](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
</details>

<details>
<summary>What is normalization? Explain with examples.</summary>

### What is normalization? Explain with examples.

**Definition:**

Нормализация разносит таблицы так, чтобы каждый факт хранился один раз и зависел от ключа, который его опознаёт. Обычная цель для транзакционных данных — третья нормальная форма.

**How it works:**

- Первая нормальная форма: в столбце одно значение, а не список, запихнутый в ячейку. Строки заказа становятся строками другой таблицы.
- Вторая нормальная форма: при составном ключе каждый неключевой столбец зависит от всего ключа, а не от его части. Имя товара не принадлежит таблице строк заказа с ключом `(order_id, product_id)`, если имя зависит только от `product_id`.
- Третья нормальная форма: неключевой столбец не зависит от другого неключевого. Город клиента не принадлежит заказу, если он зависит от клиента, а не от заказа.
- Бойс-Кодд — более строгая форма той же идеи. Четвёртая нормальная форма убирает из одной таблицы независимые многозначные факты.
- Цена — больше соединений. Обычно это дешевле, чем править один адрес в пяти строках и пропустить одну.

**Examples:**

```text
orders(id, customer_id, placed_at)
order_lines(order_id, product_id, qty)
customers(id, name)
```

**Sources:**

- [PostgreSQL — Constraints and schema](https://www.postgresql.org/docs/current/ddl-constraints.html)
</details>

<details>
<summary>Describe the concept of denormalization and when you would use it.</summary>

### Describe the concept of denormalization and when you would use it.

**Definition:**

Денормализация копирует факт в другую таблицу или заранее считает агрегат, чтобы чтение меньше соединяло и сканировало. Вы принимаете лишние записи, чтобы это чтение стало дешевле.

**How it works:**

- Отчётная таблица может хранить `customer_name` в каждом заказе, чтобы панель не соединяла `customers` на каждую строку.
- Столбец-счётчик (`comment_count`) избегает `COUNT(*)` на горячем пути. Путь записи должен обновлять его в той же транзакции, иначе он разъедется.
- Материализованные представления и сводные таблицы — управляемые копии. Обновляйте их по расписанию или на записи.
- Поиск и аналитика часто денормализуют нарочно. Транзакционное хранилище может остаться нормализованным и питать их.
- Риски — устаревшие копии, более тяжёлые записи и схема, которую труднее менять, потому что один факт живёт в нескольких местах.

**Sources:**

- [PostgreSQL — Materialized views](https://www.postgresql.org/docs/current/rules-materializedviews.html)
</details>

<details>
<summary>What are indexes and how can they improve query performance?</summary>

### What are indexes and how can they improve query performance?

**Definition:**

Индекс — структура, которой планировщик может найти строки, не читая всю таблицу. Он ускоряет поиск, сортировку и соединения и замедляет запись, потому что каждое изменение должно обновить и индекс.

**How it works:**

- B-tree, значение по умолчанию в PostgreSQL, поддерживает равенство и диапазоны и может отдать строки в порядке ключа, чтобы `ORDER BY` обошёлся без отдельной сортировки.
- Покрывающий индекс содержит каждый столбец, который нужен запросу, поэтому движок не ходит в кучу за этими строками.
- Хеш-индексы годятся только для равенства. GIN и GiST обслуживают полнотекст, JSON и геометрию. BRIN — крошечный индекс диапазонов значений по блокам, полезный для огромных естественно упорядоченных таблиц.
- Низкая селективность (логическое значение, истинное у большинства строк) часто делает последовательное чтение дешевле. Планировщику можно игнорировать ваш индекс.
- Каждый лишний индекс стоит места и времени записи. Индексируйте столбцы в `WHERE`, `JOIN` и `ORDER BY`, затем смотрите план через `EXPLAIN`.
- В PostgreSQL первичный ключ — уникальный B-tree плюс `NOT NULL`, а не приказ физически кластеризовать кучу.

**Examples:**

```sql
CREATE INDEX orders_customer_idx ON orders (customer_id);
EXPLAIN SELECT * FROM orders WHERE customer_id = 7;
```

**Sources:**

- [PostgreSQL — Indexes](https://www.postgresql.org/docs/current/indexes.html)
</details>

<details>
<summary>Explain the purpose of the GROUP BY clause.</summary>

### Explain the purpose of the GROUP BY clause.

**Definition:**

`GROUP BY` схлопывает строки с общим ключом в одну выходную строку, чтобы агрегат (`COUNT`, `SUM`, `AVG`) описывал группу, а не одну строку.

**How it works:**

- Каждый выбранный столбец должен быть в ключе группы или внутри агрегата. Движки, которые это проверяют, отвергают лишний столбец, чьё значение было бы неоднозначным.
- `WHERE` выполняется до группировки. `HAVING` фильтрует группы после.
- Планировщик может хешировать группы или сортировать их. Индекс по столбцам группировки может удешевить путь с сортировкой.
- Оконные функции — альтернатива, когда нужны и агрегат, и исходные строки. `GROUP BY` выбрасывает строки-детали.
- Группировка огромной таблицы — настоящая работа. Сначала фильтруйте и не группируйте в приложении, вытянув каждую строку, если база может агрегировать.

**Examples:**

```sql
SELECT status, COUNT(*) AS n
FROM orders
GROUP BY status;
```

**Sources:**

- [PostgreSQL — Aggregate functions](https://www.postgresql.org/docs/current/tutorial-agg.html)
</details>

<details>
<summary>What is a subquery, and when would you use one?</summary>

### What is a subquery, and when would you use one?

**Definition:**

Подзапрос — `SELECT`, вложенный в другой оператор. Он поставляет значение, список или таблицу, которыми пользуется внешний запрос.

**How it works:**

- Скалярный подзапрос должен вернуть один столбец и не больше одной строки. Он может стоять в списке выборки или в сравнении.
- `IN` и `EXISTS` принимают подзапрос, который возвращает множество. `EXISTS` останавливается на первом совпадении и обычно проверяет «есть хотя бы один ребёнок».
- Коррелированный подзапрос ссылается на внешнюю строку и может выполняться по разу на неё. Это дорого. Планировщик часто переписывает его в соединение; когда не может, яснее соединение или `LATERAL`.
- Обобщённое табличное выражение (`WITH`) именует подзапрос сверху. Предпочитайте его, когда вложенность трудно читать.
- Оконные функции заменяют многие коррелированные подзапросы, которые считают ранг или нарастающий итог.

**Examples:**

```sql
SELECT id, email
FROM customers AS c
WHERE EXISTS (
  SELECT 1 FROM orders AS o WHERE o.customer_id = c.id
);
```

**Sources:**

- [PostgreSQL — Scalar subqueries](https://www.postgresql.org/docs/current/sql-expressions.html#SQL-SYNTAX-SCALAR-SUBQUERIES)
</details>

<details>
<summary>Describe the functions of the ORDER BY clause.</summary>

### Describe the functions of the ORDER BY clause.

**Definition:**

`ORDER BY` сортирует результат. Без него порядок строк не входит в контракт, даже если сегодняшний план выглядит отсортированным.

**How it works:**

- Столбцы или выражения перечисляют слева направо. Каждый может быть `ASC` (по умолчанию) или `DESC`.
- `NULLS FIRST` и `NULLS LAST` явно ставят NULL. Значение по умолчанию зависит от направления и движка.
- Если индекс совпадает с сортировкой, планировщик может читать его по порядку и пропустить отдельную сортировку. Несовпадающий порядок или выражение, которого в индексе нет, сортируют в памяти или на диске.
- Большая сортировка, которая не влезает в `work_mem` PostgreSQL, сбрасывается во временные файлы.
- `ORDER BY` относится к итоговой проекции. Внутри подзапроса он не обещает порядок внешнему запросу, пока внешний запрос не отсортирует снова или не использует средство того же уровня запроса, которое сохраняет порядок, например `LIMIT`.
- `DISTINCT ON` в PostgreSQL требует совпадающий префикс `ORDER BY`, когда нужна одна строка на группу.

**Examples:**

```sql
SELECT id, placed_at
FROM orders
ORDER BY placed_at DESC NULLS LAST, id
LIMIT 20;
```

**Sources:**

- [PostgreSQL — Sorting rows](https://www.postgresql.org/docs/current/queries-order.html)
</details>

<details>
<summary>What are aggregate functions in SQL?</summary>

### What are aggregate functions in SQL?

**Definition:**

</details>

<details>
<summary>Explain the differences between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL JOIN.</summary>

### Explain the differences between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL JOIN.

**Definition:**

</details>

<details>
<summary>How do you insert a new row into a database table?</summary>

### How do you insert a new row into a database table?

**Definition:**

</details>

<details>
<summary>Explain how to update records in a database table.</summary>

### Explain how to update records in a database table.

**Definition:**

</details>

<details>
<summary>What is a SQL View and what are its advantages?</summary>

### What is a SQL View and what are its advantages?

**Definition:**

</details>


### SQL Data Types and Operators

<details>
<summary>List the different data types available in SQL.</summary>

### List the different data types available in SQL.

**Definition:**

</details>

<details>
<summary>What are the differences between CHAR, VARCHAR, and TEXT data types?</summary>

### What are the differences between CHAR, VARCHAR, and TEXT data types?

**Definition:**

</details>

<details>
<summary>How do you use the BETWEEN operator in SQL?</summary>

### How do you use the BETWEEN operator in SQL?

**Definition:**

</details>

<details>
<summary>Describe the use of the IN operator.</summary>

### Describe the use of the IN operator.

**Definition:**

</details>

<details>
<summary>Explain the use of wildcard characters in SQL.</summary>

### Explain the use of wildcard characters in SQL.

**Definition:**

</details>

<details>
<summary>What is the purpose of the LIKE operator?</summary>

### What is the purpose of the LIKE operator?

**Definition:**

</details>

<details>
<summary>How do you handle NULL values in SQL?</summary>

### How do you handle NULL values in SQL?

**Definition:**

</details>

<details>
<summary>What does the COALESCE function do?</summary>

### What does the COALESCE function do?

**Definition:**

</details>

<details>
<summary>What is the difference between UNION and UNION ALL?</summary>

### What is the difference between UNION and UNION ALL?

**Definition:**

</details>

<details>
<summary>Describe the use of arithmetic operators in SQL queries.</summary>

### Describe the use of arithmetic operators in SQL queries.

**Definition:**

</details>


### SQL Advanced Queries

<details>
<summary>Explain how to use the CASE statement in SQL.</summary>

### Explain how to use the CASE statement in SQL.

**Definition:**

</details>

<details>
<summary>How would you perform a self JOIN?</summary>

### How would you perform a self JOIN?

**Definition:**

</details>

<details>
<summary>What is a cross JOIN and when would you use it?</summary>

### What is a cross JOIN and when would you use it?

**Definition:**

</details>

<details>
<summary>How to implement pagination in SQL queries?</summary>

### How to implement pagination in SQL queries?

**Definition:**

</details>

<details>
<summary>Explain the concept of Common Table Expressions (CTEs) and recursive CTEs.</summary>

### Explain the concept of Common Table Expressions (CTEs) and recursive CTEs.

**Definition:**

</details>

<details>
<summary>What are window functions and how are they used?</summary>

### What are window functions and how are they used?

**Definition:**

</details>

<details>
<summary>How can you concatenate column values in SQL?</summary>

### How can you concatenate column values in SQL?

**Definition:**

</details>

<details>
<summary>What is the PIVOT operation and how would you apply it?</summary>

### What is the PIVOT operation and how would you apply it?

**Definition:**

</details>

<details>
<summary>Explain the process of combining a query that uses a GROUP BY with one that uses ORDER BY.</summary>

### Explain the process of combining a query that uses a GROUP BY with one that uses ORDER BY.

**Definition:**

</details>

<details>
<summary>How would you find duplicate records in a table?</summary>

### How would you find duplicate records in a table?

**Definition:**

</details>


### Database Design & Architecture

<details>
<summary>What is the Entity-Relationship Model?</summary>

### What is the Entity-Relationship Model?

**Definition:**

</details>

<details>
<summary>Explain the different types of database schema.</summary>

### Explain the different types of database schema.

**Definition:**

</details>

<details>
<summary>What are Stored Procedures and how are they beneficial?</summary>

### What are Stored Procedures and how are they beneficial?

**Definition:**

</details>

<details>
<summary>What is a trigger in SQL and when should it be used?</summary>

### What is a trigger in SQL and when should it be used?

**Definition:**

</details>

<details>
<summary>Describe the concept of ACID in databases.</summary>

### Describe the concept of ACID in databases.

**Definition:**

</details>

<details>
<summary>What is database sharding?</summary>

### What is database sharding?

**Definition:**

</details>

<details>
<summary>How do database indexes work and what types are there?</summary>

### How do database indexes work and what types are there?

**Definition:**

</details>

<details>
<summary>Describe the process of data warehousing.</summary>

### Describe the process of data warehousing.

**Definition:**

</details>

<details>
<summary>Explain the difference between OLTP and OLAP systems.</summary>

### Explain the difference between OLTP and OLAP systems.

**Definition:**

</details>

<details>
<summary>What are materialized views and how do they differ from standard views?</summary>

### What are materialized views and how do they differ from standard views?

**Definition:**

</details>


### SQL Optimization and Performance

<details>
<summary>How do you identify and optimize slow-running queries?</summary>

### How do you identify and optimize slow-running queries?

**Definition:**

</details>

<details>
<summary>What is query execution plan in SQL?</summary>

### What is query execution plan in SQL?

**Definition:**

</details>

<details>
<summary>Explain how to use EXPLAIN or EXPLAIN ANALYZE.</summary>

### Explain how to use EXPLAIN or EXPLAIN ANALYZE.

**Definition:**

</details>

<details>
<summary>How can indexing affect performance both positively and negatively?</summary>

### How can indexing affect performance both positively and negatively?

**Definition:**

</details>

<details>
<summary>Describe how to measure the performance of SQL queries.</summary>

### Describe how to measure the performance of SQL queries.

**Definition:**

</details>

<details>
<summary>How would you rewrite a query to improve its performance?</summary>

### How would you rewrite a query to improve its performance?

**Definition:**

</details>

<details>
<summary>What are partitioned tables and how can they optimize performance?</summary>

### What are partitioned tables and how can they optimize performance?

**Definition:**

</details>


### SQL Security

<details>
<summary>How do you implement database encryption in SQL?</summary>

### How do you implement database encryption in SQL?

**Definition:**

</details>

<details>
<summary>What are roles and how do they manage database access?</summary>

### What are roles and how do they manage database access?

**Definition:**

</details>

<details>
<summary>Explain the concept of row-level security.</summary>

### Explain the concept of row-level security.

**Definition:**

</details>

<details>
<summary>Describe how to create and use user-defined functions (UDFs).</summary>

### Describe how to create and use user-defined functions (UDFs).

**Definition:**

</details>


### SQL Functions and Expressions

<details>
<summary>Describe scalar-valued and table-valued functions.</summary>

### Describe scalar-valued and table-valued functions.

**Definition:**

</details>

<details>
<summary>How would you define a stored procedure with input and output parameters?</summary>

### How would you define a stored procedure with input and output parameters?

**Definition:**

</details>

<details>
<summary>What is the difference between a function and a stored procedure?</summary>

### What is the difference between a function and a stored procedure?

**Definition:**

</details>

<details>
<summary>How do you use the CAST and CONVERT functions?</summary>

### How do you use the CAST and CONVERT functions?

**Definition:**

</details>


### Transaction Control and Locking

<details>
<summary>What is a database transaction?</summary>

### What is a database transaction?

**Definition:**

</details>

<details>
<summary>Explain the concept of locking and its types in SQL databases.</summary>

### Explain the concept of locking and its types in SQL databases.

**Definition:**

</details>

<details>
<summary>What are the properties of transactions?</summary>

### What are the properties of transactions?

**Definition:**

</details>

<details>
<summary>How do you manage transaction isolation levels?</summary>

### How do you manage transaction isolation levels?

**Definition:**

</details>

<details>
<summary>What does it mean to commit or roll back a transaction?</summary>

### What does it mean to commit or roll back a transaction?

**Definition:**

</details>


### SQL and Modern Data Ecosystems

<details>
<summary>How can SQL be integrated with big data technologies?</summary>

### How can SQL be integrated with big data technologies?

**Definition:**

</details>

<details>
<summary>Discuss the interoperability of SQL with cloud-based data stores.</summary>

### Discuss the interoperability of SQL with cloud-based data stores.

**Definition:**

</details>

<details>
<summary>What is Data Lake and how can SQL interact with it?</summary>

### What is Data Lake and how can SQL interact with it?

**Definition:**

</details>

<details>
<summary>Explain the interaction between SQL and NoSQL within the same application.</summary>

### Explain the interaction between SQL and NoSQL within the same application.

**Definition:**

</details>

<details>
<summary>How does SQL work within a microservices architecture?</summary>

### How does SQL work within a microservices architecture?

**Definition:**

</details>


### SQL Best Practices and Standards

<details>
<summary>What are some common SQL coding practices you follow?</summary>

### What are some common SQL coding practices you follow?

**Definition:**

</details>

<details>
<summary>How can you ensure the portability of SQL scripts across different database systems?</summary>

### How can you ensure the portability of SQL scripts across different database systems?

**Definition:**

</details>

<details>
<summary>What methods do you use for version controlling SQL scripts?</summary>

### What methods do you use for version controlling SQL scripts?

**Definition:**

</details>

<details>
<summary>What are the benefits of using stored procedures instead of embedding SQL queries in code?</summary>

### What are the benefits of using stored procedures instead of embedding SQL queries in code?

**Definition:**

</details>

<details>
<summary>How do you document SQL code effectively?</summary>

### How do you document SQL code effectively?

**Definition:**

</details>


### Analytical SQL Questions

<details>
<summary>How would you find the Nth highest salary from a table?</summary>

### How would you find the Nth highest salary from a table?

**Definition:**

</details>

<details>
<summary>How do you count the number of occurrences of a specific value in a column?</summary>

### How do you count the number of occurrences of a specific value in a column?

**Definition:**

</details>

<details>
<summary>How can you calculate running totals in SQL?</summary>

### How can you calculate running totals in SQL?

**Definition:**

</details>

<details>
<summary>Explain how to reverse the contents of a column without using a reverse function.</summary>

### Explain how to reverse the contents of a column without using a reverse function.

**Definition:**

</details>

<details>
<summary>What approach do you use for creating a calendar table, and what are its uses?</summary>

### What approach do you use for creating a calendar table, and what are its uses?

**Definition:**

</details>


### Data Manipulation and ETL

<details>
<summary>What is the process of Extract, Transform, Load (ETL)?</summary>

### What is the process of Extract, Transform, Load (ETL)?

**Definition:**

</details>

<details>
<summary>How do you import/export data from/to a flat file using SQL?</summary>

### How do you import/export data from/to a flat file using SQL?

**Definition:**

</details>

<details>
<summary>Explain the steps for a basic ETL process in a data warehousing environment.</summary>

### Explain the steps for a basic ETL process in a data warehousing environment.

**Definition:**

</details>

<details>
<summary>How do you cleanse and format data using SQL queries?</summary>

### How do you cleanse and format data using SQL queries?

**Definition:**

</details>

<details>
<summary>What tools do you use for automating data import/export routines?</summary>

### What tools do you use for automating data import/export routines?

**Definition:**

</details>


### Domain-Specific SQL Scenarios

<details>
<summary>How would you model a many-to-many relationship in SQL?</summary>

### How would you model a many-to-many relationship in SQL?

**Definition:**

</details>

<details>
<summary>Describe how to manage hierarchical data in SQL.</summary>

### Describe how to manage hierarchical data in SQL.

**Definition:**

</details>

<details>
<summary>How would you approach writing SQL queries for a reporting application?</summary>

### How would you approach writing SQL queries for a reporting application?

**Definition:**

</details>

<details>
<summary>Explain how to handle temporal data and time zones in SQL.</summary>

### Explain how to handle temporal data and time zones in SQL.

**Definition:**

</details>

<details>
<summary>How do you use SQL in financial applications for risk and portfolio analysis?</summary>

### How do you use SQL in financial applications for risk and portfolio analysis?

**Definition:**

</details>


### Troubleshooting and Debugging

<details>
<summary>What steps do you take to troubleshoot a failed SQL query?</summary>

### What steps do you take to troubleshoot a failed SQL query?

**Definition:**

</details>

<details>
<summary>How can you recover data from a corrupt SQL database?</summary>

### How can you recover data from a corrupt SQL database?

**Definition:**

</details>

<details>
<summary>What methods do you employ to ensure data integrity?</summary>

### What methods do you employ to ensure data integrity?

**Definition:**

</details>

<details>
<summary>How do you decipher and resolve deadlocks in SQL?</summary>

### How do you decipher and resolve deadlocks in SQL?

**Definition:**

</details>


### Advanced Data Analysis in SQL

<details>
<summary>Explain how to use SQL for predictive analysis and machine learning purposes.</summary>

### Explain how to use SQL for predictive analysis and machine learning purposes.

**Definition:**

</details>
