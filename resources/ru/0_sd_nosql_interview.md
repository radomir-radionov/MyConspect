# NoSQL — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [NoSQL — собеседование](./0_sd_nosql_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — NoSQL](https://devinterview.io/questions/software-architecture-and-system-design/nosql-interview-questions/).

### NoSQL Fundamentals

<details>
<summary>What are the different types of NoSQL databases, with an example of each?</summary>

### What are the different types of NoSQL databases, with an example of each?

**Definition:**

NoSQL — семейство хранилищ, которые построены не вокруг таблиц и соединений. Обычные четыре — ключ-значение, документ, широкие колонки и граф.

**How it works:**

- Хранилище ключ-значение сопоставляет ключ непрозрачному значению. Redis и DynamoDB — обычные примеры.
- Документное хранилище держит JSON-подобное дерево на запись, связанные поля лежат вместе. MongoDB и Couchbase.
- Хранилище широких колонок группирует строки по ключу раздела и допускает много разреженных колонок. Cassandra и Bigtable.
- Графовое хранилище считает сущности узлами, а связи — рёбрами, по которым можно идти. Neo4j и Neptune.

**Examples:**

```text
ключ-значение: session:42 -> {user:7, exp:1800}
документ:      {sku:"lamp", tags:["home"], price:{usd:40}}
широкие колонки: user 7 -> clicks:t1, clicks:t2, ...
граф:          (ada)-[:BOUGHT]->(lamp)
```
</details>

<details>
<summary>Explain eventual consistency and its role in NoSQL databases.</summary>

### Explain eventual consistency and its role in NoSQL databases.

**Definition:**

Eventual consistency значит, что реплики могут какое-то время расходиться и сходятся, когда обменяются пропущенными обновлениями. Многие системы NoSQL используют это, чтобы запись прошла без каждой реплики.

**How it works:**

- Gossip разносит обновление нескольким соседям, а те — дальше, вместо блокировки каждого узла.
- Метка времени или вектор часов говорит реплике, какое обновление новее, или что два обновления были одновременными и их надо слить.
- Last-writer-wins оставляет позднюю метку. Логика приложения или тип, который сливается сам, безопаснее, когда важны оба обновления.
- Хранилища в духе Dynamo (Riak, Cassandra, DynamoDB) сделали это путём по умолчанию и добавили уровень согласованности на запрос, чтобы ждать больше реплик, когда это важно.

**Examples:**

Две корзины добавляют последнюю лампу, пока реплики разрезаны. Обе записи проходят. После gossip одна корзина оставляет лампу, вторую поправляют. До этого чтения могут расходиться.
</details>

<details>
<summary>How is data modeling in NoSQL databases distinct from that in relational databases?</summary>

### How is data modeling in NoSQL databases distinct from that in relational databases?

**Definition:**

Реляционное моделирование нормализует факты в таблицы и соединяет их при чтении. Моделирование NoSQL хранит форму, которую ждёт один запрос, часто одним агрегатом, и допускает дубли.

**How it works:**

- Реляционная схема фиксируется до данных и держится ограничениями. Документ или запись ключ-значение может получить поля без миграции каждой строки.
- Реляционные системы целятся в ACID-транзакции через строки. Многие системы NoSQL целятся в BASE: доступны, мягкое состояние, eventually consistent, с атомарностью на одном ключе или документе.
- Реляционное наращивание — машина больше, затем осторожное шардирование. NoSQL обычно рассчитан на добавление узлов и раздел пространства ключей.
- Схемы звезда и снежинка обслуживают аналитические соединения. Документная модель вкладывает позиции внутрь заказа, потому что приложение читает их так.
- Цена вложения — устаревшие копии, когда один факт живёт во многих документах.

**Examples:**

```text
SQL:      orders + order_items, соединение по order_id
документ: {orderId, items:[{sku, qty}, {sku, qty}]}
```
</details>

<details>
<summary>What advantages do NoSQL databases offer for managing large volumes of data?</summary>

### What advantages do NoSQL databases offer for managing large volumes of data?

**Definition:**

NoSQL держит большие объёмы, разрезая данные по машинам и позволяя каждой записи нести только те поля, которые у неё есть, вместо роста одной общей схемы.

**How it works:**

- Автоматическое разбиение разносит ключи по узлам, поэтому ёмкость растёт добавлением машин.
- Репликация держит копию на другом узле, поэтому один диск — не весь набор.
- Гибкая запись избегает миграции всей таблицы, когда новый атрибут появляется лишь у части элементов.
- Пути записи, которые подтверждают подмножество реплик, могут принять больший поток, чем полностью синхронный commit.
- Индексы строят под известные поиски. Они не замена произвольным соединениям по всему набору.
- Документы, широкие колонки, ключ-значение и поисковые движки (MongoDB, Cassandra, DynamoDB, Elasticsearch) толкают разные срезы этого: гибкие записи, широкие разреженные строки, простые ключи или инвертированные индексы.
</details>

<details>
<summary>When would you choose a NoSQL database over a relational database?</summary>

### When would you choose a NoSQL database over a relational database?

**Definition:**

NoSQL выбирают, когда шаблон доступа известен, схема будет меняться или поток записи требует больше машин. Реляционную базу выбирают, когда ценность — в ограничениях, соединениях и транзакциях на нескольких строках.

**How it works:**

- Меняющаяся форма документа, например товар каталога с необязательными атрибутами, ложится в документное хранилище.
- Огромное пространство ключей с поиском по ключу, например сессии или ряд по времени в разрезе устройства, ложится в ключ-значение или широкие колонки.
- Связь, по которой ходят, например «купившие это купили ещё», лучше ложится в граф, чем в груду таблиц соединений.
- Деньги, склад, который нельзя перепродать, и нерегламентированные отчёты всё ещё ложатся в SQL: ACID, внешние ключи и соединения.
- Готовый стек и команда, которые уже ведут Postgres, — причина остаться, даже если байты мог бы держать и NoSQL.

**Examples:**

```text
поиск сессии по id          -> Redis
товар с разными атрибутами  -> MongoDB
журнал проводок             -> Postgres
```
</details>

<details>
<summary>Describe the various consistency models in NoSQL databases and how they handle transactions and conflict resolution.</summary>

### Describe the various consistency models in NoSQL databases and how they handle transactions and conflict resolution.

**Definition:**

Согласованность NoSQL — меню, а не одна гарантия. Обычные ступени от слабой к сильной — eventual, причинная, read-your-writes и пересекающийся кворум.

**How it works:**

- Eventual: реплики сходятся после остановки обновлений. Обычные чтения DynamoDB и Cassandra на `ONE` стоят здесь.
- Причинная: следствие не видно, пока не видно причину. Одновременные обновления всё ещё могут требовать слияния.
- Read-your-writes: клиент видит свою последнюю запись, часто через привязку к сессии или лидеру. MongoDB и Couchbase могут дать это на primary.
- Сессионная гарантия — это read-your-writes плюс монотонные чтения для одного клиента, не для всех.
- Конфликты решают меткой времени, вектором часов, который ловит одновременность, или типами приложения, которые сливаются.
- ACID-транзакция на нескольких строках — не режим по умолчанию. Где она есть, её обычно ограничивают одним разделом или документом, а всё шире идёт более медленным путём.

**Examples:**

Две реплики принимают разные названия одного товара. Вектор часов помечает их одновременными. Приложение держит оба и спрашивает человека, вместо того чтобы тихо выбросить одно по метке времени.
</details>

<details>
<summary>List some NoSQL databases and the primary use cases they address.</summary>

### List some NoSQL databases and the primary use cases they address.

**Definition:**

Берут хранилище, чья форма данных совпадает с вопросом, который задают чаще всего, а не то, у которого шире маркетинговая этикетка.

**How it works:**

- MongoDB и Couchbase: документы гибкой формы — контент, каталоги, мобильные профили.
- Redis: поиск ключа в памяти — кэш, сессии, счётчики, таблицы лидеров.
- DynamoDB: управляемые ключ-значение и документы на высокой пропускной способности, раздел по ключу.
- Cassandra и Bigtable: огромные разреженные строки — ряды по времени, логи, история событий.
- Neo4j и Neptune: обходы — социальные графы, кольца мошенничества, рекомендации.
- InfluxDB: измерения во времени.
- Elasticsearch: поиск по инвертированному индексу, не главный журнал проводок.
- ArangoDB и Couchbase могут держать больше одной модели, когда приложению правда нужны две формы.
</details>

### Key-Value Stores

<details>
<summary>How does a key-value store operate, and can you give a use-case example?</summary>

### How does a key-value store operate, and can you give a use-case example?

**Definition:**

Хранилище ключ-значение отвечает на get, put и delete по ключу. Значение для движка непрозрачно, пока вы не добавите возможность заглянуть внутрь.

**How it works:**

- Ключ решает раздел, часто хешем, поэтому узел, владеющий ключом, известен без планировщика запросов.
- Чтение и запись одного ключа — быстрый путь. Вопрос «все значения, где city = Oslo» — нет, если нет вторичного индекса.
- Значение может быть строкой, блобом или маленьким документом. Хранилище не соединяет его с другим ключом.
- Сессии — хрестоматийный случай: id сессии — ключ, вся сессия — значение.

**Examples:**

```text
SET session:91  {"user":7,"cart":["lamp"]}  EX 1800
GET session:91
```
</details>

<details>
<summary>What strategies can be used to scale key-value stores for high demand or large data volumes?</summary>

### What strategies can be used to scale key-value stores for high demand or large data volumes?

**Definition:**

Хранилище ключ-значение масштабируют, разнося ключи по узлам и оставляя каждую операцию поиском одного ключа.

**How it works:**

- Consistent hashing кладёт каждый ключ в раздел и при добавлении узла двигает только срез ключей.
- Репликация, primary-replica или несколько primary, добавляет ёмкость чтения и запасную копию. DynamoDB делит по ключу. Riak и Cassandra реплицируют по кольцу.
- Движок в памяти вроде Redis избегает диска на горячем пути, и ему нужен план сохранения, иначе данные теряются при падении.
- Сжатие и кэш впереди (само хранилище или Memcached рядом с медленной базой) режут байты и повторные чтения.
- Вторичные индексы и балансировка помогают поискам не по первичному ключу. Горячий ключ всё равно упирается в один раздел.
- Избегают соединений и транзакций через ключи. Они требуют координации, которую модель строили, чтобы пропустить.
</details>

<details>
<summary>What are some drawbacks of key-value stores compared to other NoSQL types?</summary>

### What are some drawbacks of key-value stores compared to other NoSQL types?

**Definition:**

Хранилище ключ-значение быстрое, потому что отказывается от большинства вопросов. Этот отказ и есть недостаток рядом с документами, широкими колонками и графами.

**How it works:**

- Без вторичного индекса значение можно достать, только если ключ уже известен.
- Связи — ваша проблема. Нет ребра, по которому идти, и нет соединения.
- Агрегации — суммы, группы, «топ категорий за неделю» — неудобны, если их не предвычислить в другие ключи.
- Удаление легко, когда это один ключ, и трудно, когда «удалить» значит условие по значениям, которых движок не видит.
- Индексы, где продукт их добавляет, — дополнительная структура, которую надо держать верной, а не родная модель.
</details>

<details>
<summary>Name a scenario where a key-value store might not be the best fit.</summary>

### Name a scenario where a key-value store might not be the best fit.

**Definition:**

Хранилище ключ-значение плохо подходит, когда бизнес-правило смотрит через много записей или должно отвергнуть запись, которая сломает связь.

**How it works:**

- Склад, который не должен продать последнюю единицу дважды, нуждается в ограничении или транзакции, а не в слепом put ключа остатка.
- Совместный документ с историей, комментариями и «кто менял этот абзац» — граф версий, а не один блоб.
- Карта пациента, которая должна оставаться согласованной с назначениями, анализами и аллергиями, хочет целостность через записи.

**Examples:**

Уменьшение `stock:lamp` на двух серверах приложения сразу может увести значение в минус, если условие никто не проверяет атомарно. Реляционное обновление с `WHERE qty >= 1` или документная транзакция могут отказать второй продаже.
</details>

### Document-Oriented Databases

<details>
<summary>What makes a document in a NoSQL database different from a row in a relational database?</summary>

### What makes a document in a NoSQL database different from a row in a relational database?

**Definition:**

Документ — самодостаточное дерево, часто JSON, которое может вкладывать списки и объекты. Реляционная строка — один плоский кортеж, чьи повторяющиеся группы живут в других таблицах.

**How it works:**

- Документ может опустить поля и добавить новые. У строки — колонки её таблицы.
- Данные «один ко многим» часто вкладывают, поэтому чтение документа не требует соединения. Цена — документ больше и факты дублируются.
- Реляционная модель нормализует и соединяет. Она остаётся компактнее, и один факт легко обновить везде.
- Атомарность естественна для одного документа. Транзакции на нескольких документах есть в движках вроде MongoDB, и они дороже записи одного документа.
- Сила реляционного движка — транзакция, которая покрывает много строк с ограничениями.

**Examples:**

```json
{"orderId": 9, "items": [{"sku": "lamp", "qty": 1}, {"sku": "bulb", "qty": 4}]}
```
Те же данные в SQL — одна строка orders и две строки order_items.
</details>

<details>
<summary>How does indexing work in document-oriented databases?</summary>

### How does indexing work in document-oriented databases?

**Definition:**

Индекс — боковая структура, обычно B-дерево, которая сопоставляет значение поля документам, где оно есть, чтобы запрос не сканировал всю коллекцию.

**How it works:**

- Движок держит ключи индекса по порядку. Поиск или диапазон идёт по дереву, а не по каждому документу.
- Мультиключевой индекс выпускает одну запись на элемент массива, поэтому документ может оказаться под несколькими ключами.
- Пути через точку индексируют вложенное поле, например `address.city`.
- Каждый индекс ускоряет подходящий запрос и замедляет запись, потому что запись должна обновить и индекс.
- Некоторые движки используют LSM-дерево вместо B-дерева. Идея та же: структура рядом с документами, а не скан.

**Examples:**

Индекс по `sku` превращает «найти лампу» в поиск по дереву. Индекс по `tags` хранит одну запись на каждый тег массива, поэтому тот же документ находится и по `home`, и по `sale`.
</details>

<details>
<summary>Give an example of a query in a document-oriented database.</summary>

### Give an example of a query in a document-oriented database.

**Definition:**

Документный запрос называет поля для совпадения, включая вложенные через путь с точкой, и движок использует индекс, если он есть.

**How it works:**

- Равенство, сравнение и операторы массивов живут в документе запроса, а не в секции соединения.
- Вложенное поле — это `address.city`, а не вторая таблица.
- Проекция может вернуть только поля, которые нужны вызывающему.
- Без индекса тот же запрос всё ещё работает, как скан коллекции.

**Examples:**

```js
db.orders.find(
  { status: "open", "shipTo.city": "Bergen", total: { $gt: 100 } },
  { orderId: 1, total: 1 }
)
```
</details>

<details>
<summary>Suggest a typical application for a document-oriented database.</summary>

### Suggest a typical application for a document-oriented database.

**Definition:**

Контентная или каталожная система — естественное документное приложение: каждый элемент — одно дерево, у элементов нет одного жёсткого набора полей, и приложение грузит элемент целиком.

**How it works:**

- CMS хранит статью с телом, списком тегов и необязательными блоками, которые различаются от статьи к статье.
- Каталог товаров хранит атрибуты, которые есть только у части товаров, например диагональ или степень обжарки.
- Документ — единица чтения и обновления одного элемента, что совпадает с тем, как собран экран.
- Он слабее подходит, когда много элементов надо обновить вместе под ограничением, например перевести деньги между счетами.

**Examples:**

```json
{"slug": "harbor-lamp", "blocks": [{"type": "p", "text": "..."}], "tags": ["home"]}
```
Следующая статья может добавить в `blocks` элемент типа `video`, не меняя таблицу.
</details>

<details>
<summary>How do document databases handle schema changes and migration?</summary>

### How do document databases handle schema changes and migration?

**Definition:**

</details>

### Column-Family Stores

<details>
<summary>Describe the data structure in a column-family store and how it supports certain query types.</summary>

### Describe the data structure in a column-family store and how it supports certain query types.

**Definition:**

</details>

<details>
<summary>Name a popular column-family store and its key features that contribute to its performance.</summary>

### Name a popular column-family store and its key features that contribute to its performance.

**Definition:**

</details>

<details>
<summary>How are data partitioning and distribution handled in column-family stores?</summary>

### How are data partitioning and distribution handled in column-family stores?

**Definition:**

</details>

### Graph Databases

<details>
<summary>Explain the data representation in a graph database.</summary>

### Explain the data representation in a graph database.

**Definition:**

</details>

<details>
<summary>Compare querying in graph databases with other NoSQL database types.</summary>

### Compare querying in graph databases with other NoSQL database types.

**Definition:**

</details>

<details>
<summary>Suggest a real-world problem that fits a graph database solution.</summary>

### Suggest a real-world problem that fits a graph database solution.

**Definition:**

</details>

<details>
<summary>Define the role of an edge in a graph database and its relationship with nodes.</summary>

### Define the role of an edge in a graph database and its relationship with nodes.

**Definition:**

</details>

### Data Consistency & Replication

<details>
<summary>What replication strategies are often used in NoSQL databases?</summary>

### What replication strategies are often used in NoSQL databases?

**Definition:**

</details>

<details>
<summary>What are quorum reads/writes and their impact on consistency in NoSQL databases?</summary>

### What are quorum reads/writes and their impact on consistency in NoSQL databases?

**Definition:**

</details>

<details>
<summary>Describe how NoSQL databases maintain consistency during network issues.</summary>

### Describe how NoSQL databases maintain consistency during network issues.

**Definition:**

</details>

### Scalability & Performance

<details>
<summary>Explain common data sharding strategies in NoSQL databases and their impact on system performance.</summary>

### Explain common data sharding strategies in NoSQL databases and their impact on system performance.

**Definition:**

</details>

<details>
<summary>How is load balancing achieved in NoSQL database environments?</summary>

### How is load balancing achieved in NoSQL database environments?

**Definition:**

</details>

<details>
<summary>Discuss the role of caching in NoSQL database performance enhancement.</summary>

### Discuss the role of caching in NoSQL database performance enhancement.

**Definition:**

</details>

<details>
<summary>What approaches do NoSQL databases use to ensure high availability?</summary>

### What approaches do NoSQL databases use to ensure high availability?

**Definition:**

</details>

### Querying and Data Manipulation

<details>
<summary>How do NoSQL databases manage complex queries, such as those requiring join operations?</summary>

### How do NoSQL databases manage complex queries, such as those requiring join operations?

**Definition:**

</details>

<details>
<summary>What is map-reduce, and how is it utilized within NoSQL databases?</summary>

### What is map-reduce, and how is it utilized within NoSQL databases?

**Definition:**

</details>

<details>
<summary>Are transactions supported by NoSQL databases, and if so, how are they implemented?</summary>

### Are transactions supported by NoSQL databases, and if so, how are they implemented?

**Definition:**

</details>

### Indexing and Storage Strategies

<details>
<summary>Compare indexing strategies between NoSQL and traditional relational databases.</summary>

### Compare indexing strategies between NoSQL and traditional relational databases.

**Definition:**

</details>

<details>
<summary>How do different storage formats, like JSON, BSON, or binary, affect the performance and flexibility of NoSQL databases?</summary>

### How do different storage formats, like JSON, BSON, or binary, affect the performance and flexibility of NoSQL databases?

**Definition:**

</details>
