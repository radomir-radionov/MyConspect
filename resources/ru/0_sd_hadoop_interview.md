# Hadoop — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Hadoop — собеседование](./0_sd_hadoop_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Hadoop](https://devinterview.io/questions/machine-learning-and-data-science/hadoop-interview-questions/).

### Hadoop Fundamentals

<details>
<summary>What is Hadoop and what are its core components?</summary>

### What is Hadoop and what are its core components?

**Definition:**

Hadoop — открытый набор для хранения очень больших файлов на кластере обычных серверов и пакетной обработки рядом с этими файлами.

**How it works:**

- HDFS режет файл на крупные блоки, хранит копии на DataNode, а дерево каталогов и карту блоков держит на NameNode. Байты файла через NameNode не проходят.
- YARN выдаёт контейнеры CPU и памяти. ResourceManager ведёт учёт кластера, NodeManager стоит на каждой машине, у каждого приложения свой ApplicationMaster.
- MapReduce — исходная пакетная модель: mapper выдаёт пары ключ-значение, shuffle собирает одинаковые ключи, reducer агрегирует один ключ за раз.
- Hive даёт SQL-подобное хранилище поверх файлов, Pig — язык потоков данных, HBase — произвольный доступ к строкам, ZooKeeper — координацию кластера, Oozie — многошаговые сценарии. Mahout — более старая библиотека пакетных задач машинного обучения.
</details>

<details>
<summary>Explain the concept of a Hadoop Distributed File System (HDFS) and its architecture.</summary>

### Explain the concept of a Hadoop Distributed File System (HDFS) and its architecture.

**Definition:**

HDFS — распределённая файловая система для обычных дисков. Она рассчитана на длинное последовательное чтение огромных файлов, а не на низкую задержку мелких обновлений.

**How it works:**

- Файл — последовательность блоков. Блок по умолчанию 128 МБ, коэффициент репликации обычно три; оба параметра задаются на файл. Коротким может быть только последний блок.
- NameNode владеет пространством имён: создание, переименование, удаление, права и то, какие DataNode держат каждый блок. DataNode хранят блоки и обслуживают чтение и запись клиентов.
- Запись прокачивает блок по цепочке DataNode, так что реплики заполняются по мере прихода байтов. Чтение спрашивает у NameNode адреса и читает поток с ближайшей реплики.
- Допущения: запись один раз (кроме append и truncate), один писатель в момент времени и перенос задачи к данным, а не файла к задаче.
- Мелкие файлы раздувают память NameNode, потому что каждый блок — это метаданные. HDFS плохо подходит для интерактивных случайных правок, которым нужна строгая транзакция на строку.

**Examples:**

Клиент открывает `/logs/2026-10-04/events.txt`. NameNode возвращает DataNode, где лежит блок `blk_42`. Клиент читает этот блок с ближайшего DataNode и не тянет полезную нагрузку через NameNode.
</details>

<details>
<summary>How does MapReduce programming model work in Hadoop?</summary>

### How does MapReduce programming model work in Hadoop?

**Definition:**

MapReduce сводит большой пакет к двум функциям: map помечает записи, reduce собирает все записи с одной пометкой.

**How it works:**

- Вход режется на куски, обычно по блокам HDFS. Каждый mapper читает свой кусок и выдаёт промежуточные пары ключ-значение.
- Partitioner решает, какому reducer принадлежит ключ. Shuffle сортирует и группирует пары, чтобы reducer увидел все значения своих ключей.
- Необязательный combiner заранее агрегирует пары на машине mapper, если операция это позволяет (сумма, счётчик), и тем самым уменьшает shuffle.
- Планировщик старается поставить задачу на узел, где блок уже лежит. Упавшая или слишком медленная задача запускается на другом узле.

**Examples:**

```text
map("red fish blue fish") -> (red, 1), (fish, 1), (blue, 1), (fish, 1)
shuffle собирает fish -> [1, 1]
reduce(fish, [1, 1]) -> (fish, 2)
```
</details>

<details>
<summary>What is YARN, and how does it improve Hadoop's resource management?</summary>

### What is YARN, and how does it improve Hadoop's resource management?

**Definition:**

YARN отделяет планирование кластера от модели MapReduce, поэтому несколько движков делят один пул CPU и памяти.

**How it works:**

- В старой схеме JobTracker один процесс и раздавал слоты, и вёл задачу MapReduce. Фиксированные map- и reduce-слоты делали Spark или Tez неудобными гостями.
- ResourceManager — планировщик кластера. Каждый NodeManager сообщает свободные CPU и память и запускает контейнеры. У приложения свой ApplicationMaster: он запрашивает контейнеры и следит за своими задачами.
- Контейнер — это порция CPU и памяти, а не заранее нарезанный map- или reduce-слот. Задача просит столько, сколько ей нужно.
- Очереди capacity или fair делят кластер между командами. MapReduce, Spark и Tez работают рядом, потому что они приложения, а не сам планировщик.
</details>

<details>
<summary>Explain the role of the Namenode and Datanode in HDFS.</summary>

### Explain the role of the Namenode and Datanode in HDFS.

**Definition:**

NameNode — хозяин метаданных. DataNode — рабочие узлы, которые держат байты блоков и отвечают клиентам.

**How it works:**

- NameNode хранит дерево каталогов, права, коэффициент репликации и список DataNode для каждого блока. Пользовательские данные через него не идут.
- DataNode хранит блоки на локальных дисках, обслуживает чтение и запись и создаёт, удаляет или копирует блоки по указанию NameNode.
- Каждый DataNode шлёт heartbeat и периодический отчёт о блоках. Пропавший heartbeat значит, что эти реплики потеряны, и NameNode заказывает новые копии, пока коэффициент не восстановится.
- Правки пространства имён пишутся в журнал и периодические снимки (fsimage). Резервный NameNode, который читает кворум journal node, может принять роль; старый secondary NameNode только собирал снимки и не был горячей заменой.
</details>

<details>
<summary>What is a Rack Awareness algorithm in HDFS, and why is it important?</summary>

### What is a Rack Awareness algorithm in HDFS, and why is it important?

**Definition:**

Rack awareness — это карта NameNode «DataNode → стойка». Она позволяет пережить отказ коммутатора, не гоняя каждую запись через магистраль.

**How it works:**

- Скрипт топологии или статическая таблица сообщает NameNode, в какой стойке сидит каждый DataNode. Трафик внутри стойки считается дешевле трафика через корневой коммутатор.
- При трёх репликах обычная политика кладёт первую на узел писателя (или в его стойку), вторую — на узел другой стойки, третью — на другой узел той же удалённой стойки.
- Стойка может целиком отказать, и одна реплика останется. Три реплики в трёх разных стойках тоже пережили бы отказ стойки, но каждая запись дважды пересекла бы магистраль.
- Читателя направляют к ближайшей реплике: тот же узел, затем та же стойка, затем местный дата-центр.
</details>

<details>
<summary>What are some of the characteristics that differentiate Hadoop from traditional RDBMS?</summary>

### What are some of the characteristics that differentiate Hadoop from traditional RDBMS?

**Definition:**

Hadoop — платформа файлов и пакетов. Реляционная база — транзакционное хранилище, где схема проверяется на каждой записи.

**How it works:**

- Hadoop накладывает структуру, когда задача читает файлы (schema on read). RDBMS отвергает строку, которая не совпала с таблицей (schema on write).
- HDFS растёт добавлением дешёвых машин и хорошо переносит огромные сканы. RDBMS сделана для поиска по индексу и коротких правок структурированных таблиц.
- Задачи MapReduce и SQL-on-Hadoop сканируют и агрегируют. RDBMS меняет отдельные строки под блокировками и ждёт много коротких транзакций.
- HDFS хранит несколько копий блока и допускает одного писателя, append и truncate. RDBMS стремится к зафиксированным транзакциям, которые другие сессии видят согласованно.
- Логи, клики и выгрузки сначала кладут в Hadoop. Заказы, балансы и остатки, которые нельзя порвать, живут в базе.
</details>

<details>
<summary>How can you secure a Hadoop cluster? Name some of the security mechanisms available.</summary>

### How can you secure a Hadoop cluster? Name some of the security mechanisms available.

**Definition:**

Боевой кластер проверяет личность, разрешает доступ к каждому сервису и шифрует данные на диске и в сети.

**How it works:**

- Обычная аутентификация — Kerberos. Учётные записи часто приходят из LDAP или Active Directory. После входа сервисы выдают delegation token, чтобы задачи не повторяли обмен Kerberos.
- HDFS применяет права владельца, группы и остальных, плюс ACL на файлы и каталоги. Apache Ranger (и более старый Sentry) добавляет центральные политики для Hive, HBase и похожих сервисов.
- Зоны шифрования HDFS хранят файлы зашифрованными на диске. Key management service раскрывает ключ зоны только разрешённым клиентам. RPC и передача данных могут идти по SASL и TLS.
- Настройки proxy user позволяют сервису вроде Hive действовать от имени конечного пользователя, чтобы проверка файловой системы видела его, а не учётную запись сервиса. Доступ к shell и хостам по-прежнему требует обычного укрепления ОС.
</details>

### Hadoop Ecosystem and Tools

<details>
<summary>Describe the role of HBase in Hadoop ecosystem.</summary>

### Describe the role of HBase in Hadoop ecosystem.

**Definition:**

HBase — колоночное хранилище поверх HDFS для больших таблиц, которым нужны случайные чтение и запись. Пакетный скан в Hive для этого слишком медленный.

**How it works:**

- Строки упорядочены по ключу и разрезаны на регионы. RegionServer обслуживает эти диапазоны. HMaster назначает регионы, ZooKeeper следит за активным мастером и расположением регионов.
- Семейство колонок группирует столбцы, которые лежат вместе. Версии ячейки хранятся по метке времени. Одна строка строго согласована; это не база многострочных транзакций.
- По оси CAP HBase для одной строки выбирает согласованность и поведение при разделении и теряет доступность региона, пока сервер лежит.
- Типичные таблицы — ряды времени, события кликов или устройств, поиск признаков и метаданные, которые нужно доставать по ключу, а не сканировать.
</details>

<details>
<summary>What is Apache Hive and what types of problems does it solve?</summary>

### What is Apache Hive and what types of problems does it solve?

**Definition:**

Hive — слой хранилища: аналитик пишет HiveQL, а Hive превращает запрос в задачи над файлами, которые уже лежат в HDFS или объектном хранилище.

**How it works:**

- Metastore записывает базы, схемы таблиц, разделы и расположение файлов. Байты остаются в файлах; тело таблицы в metastore не лежит.
- Драйвер разбирает HiveQL, оптимизатор переписывает план, движок (MapReduce, Tez или Spark) его выполняет. HiveServer2 принимает удалённые сессии JDBC и ODBC.
- Подходит для сканов, агрегаций, соединений и ETL больших пакетов. Базу для транзакций одной строки он не заменяет.
- Внешние таблицы с разделами позволяют запросу пропускать целые каталоги — так дневные выгрузки логов остаются дешёвыми для запросов.
</details>

<details>
<summary>How does Apache Pig fit into the Hadoop ecosystem?</summary>

### How does Apache Pig fit into the Hadoop ecosystem?

**Definition:**

Pig — язык сценариев Pig Latin для многошаговых файловых конвейеров, когда автор не хочет писать mapper и reducer вручную.

**How it works:**

- Сценарий загружает файлы, фильтрует, соединяет, группирует и сохраняет результат. Шаги описывают поток данных, а схема может оставаться свободной, пока поле не понадобится.
- Сценарий компилируется в логический план. Работа начинается, когда запрошены store или dump, поэтому неиспользуемые ветки не выполняются.
- План идёт как MapReduce или более новый движок. Пользовательские функции на Java или Python закрывают шаги, которых нет в языке.
- Аналитикам на SQL удобнее Hive. Процедурный конвейер со своими функциями удобнее писать на Pig.

**Examples:**

```text
clicks = LOAD '/logs/clicks' AS (user:chararray, path:chararray);
home = FILTER clicks BY path == '/';
per_user = GROUP home BY user;
STORE per_user INTO '/out/home-users';
```

Пока нет `STORE`, ничего не считается.
</details>

<details>
<summary>Explain how Apache Flume helps with log and event data collection for Hadoop.</summary>

### Explain how Apache Flume helps with log and event data collection for Hadoop.

**Definition:**

Flume переносит потоки событий, обычно логи, от многих источников в HDFS или другой приёмник, без своего сборщика на каждом хосте.

**How it works:**

- Агент состоит из трёх частей: source принимает события, channel их буферизует, sink записывает дальше.
- Надёжный file channel хранит принятые события, пока sink не подтвердит запись, поэтому перезапуск процесса не теряет эту порцию. Memory channel быстрее и может потерять буфер.
- Агенты стоят ярусами: много краевых агентов шлют в меньшее число агрегаторов, а те нарезают файлы в HDFS. Interceptor может пометить, отфильтровать или переписать событие по пути.
- Flume рассчитан на непрерывные потоки логов. Для массового копирования реляционных таблиц нужен Sqoop.

**Examples:**

```text
веб-серверы -> Flume source (avro) -> file channel -> HDFS sink
нарезает /logs/app/2026-10-04/events.0001
```
</details>

<details>
<summary>What is Apache Sqoop and how does it interact with Hadoop?</summary>

### What is Apache Sqoop and how does it interact with Hadoop?

**Definition:**

Sqoop массово копирует таблицы между реляционной базой и Hadoop параллельными map-задачами, а не одним клиентским курсором.

**How it works:**

- Import читает срезы таблицы через JDBC и пишет их в HDFS, Hive или HBase. Export читает файлы из HDFS и вставляет или обновляет строки обратно в базе.
- Столбец разбиения, часто числовой первичный ключ, делит таблицу на диапазоны. Каждый диапазон — один mapper.
- Коннекторы покрывают обычные базы через JDBC. Для некоторых движков есть прямой режим, который обходит JDBC ради скорости.
- Инкрементальный import может забрать только строки новее столбца last-value — так ночное хранилище не отстаёт от операционной таблицы.

**Examples:**

```text
sqoop import --table orders --split-by id --target-dir /warehouse/orders
```

Четыре mapper могут читать диапазоны `id` 1–250000, 250001–500000 и так далее и записать четыре part-файла.
</details>

<details>
<summary>How does Apache Oozie help in workflow scheduling in Hadoop?</summary>

### How does Apache Oozie help in workflow scheduling in Hadoop?

**Definition:**

Oozie выполняет ориентированный граф действий Hadoop и может запускать этот граф по часам или когда появляются входные данные.

**How it works:**

- Workflow — это граф: узлы MapReduce, Hive, Pig, Sqoop, shell и похожие действия, плюс узлы fork, join и decision.
- Coordinator запускает workflow по расписанию или когда готов экземпляр набора данных. Bundle объединяет coordinator, которые нужно стартовать и останавливать вместе.
- Каждое действие сообщает успех или неудачу. Граф может повторить шаг или уйти в переход ошибки. Параметры задаются языком выражений, так что одно описание обслуживает много дат.
- Сервер Oozie хранит состояние вне короткой заявки YARN, поэтому многочасовой конвейер может продолжиться после падения одного действия.

**Examples:**

Ночной граф параллельно делает import Sqoop и свёртку Flume, затем join и агрегацию Hive. Coordinator стартует его, когда есть `/raw/2026-10-04`, а упавший шаг Hive уходит в ветку ошибки, а не помечает весь день успешным.
</details>

<details>
<summary>What is Apache ZooKeeper and why is it important for Hadoop?</summary>

### What is Apache ZooKeeper and why is it important for Hadoop?

**Definition:**

ZooKeeper — небольшое реплицированное хранилище для координации: конфигурация, состав участников и то, кто сейчас лидер.

**How it works:**

- Клиенты видят дерево znode. Обновления полностью упорядочены. Сессия может создать эфемерный узел, который исчезнет вместе с сессией, и последовательный узел, к имени которого добавляется счётчик.
- Watch сообщает клиенту, что znode изменился, поэтому сервисы не опрашивают каждого соседа. Ансамбль фиксирует запись, только когда согласилось большинство.
- Высокая доступность HDFS использует ZooKeeper, чтобы активным был один NameNode. HBase выбирает через него мастера и публикует, какой сервер держит регион. YARN может хранить там состояние восстановления ResourceManager.
- Это сервис координации, а не база прикладных записей. Данные в znode должны оставаться маленькими.
</details>

<details>
<summary>Discuss the role of Apache Spark in the Hadoop ecosystem.</summary>

### Discuss the role of Apache Spark in the Hadoop ecosystem.

**Definition:**

</details>

### Data Management and Processing

<details>
<summary>How does Hadoop handle the failure of a datanode?</summary>

### How does Hadoop handle the failure of a datanode?

**Definition:**

</details>

<details>
<summary>Explain the process of data replication in HDFS.</summary>

### Explain the process of data replication in HDFS.

**Definition:**

</details>

<details>
<summary>What is speculative execution in Hadoop, and why is it used?</summary>

### What is speculative execution in Hadoop, and why is it used?

**Definition:**

</details>

<details>
<summary>How are large datasets processed in Hadoop?</summary>

### How are large datasets processed in Hadoop?

**Definition:**

</details>

<details>
<summary>What is the significance of the input split in MapReduce jobs?</summary>

### What is the significance of the input split in MapReduce jobs?

**Definition:**

</details>

<details>
<summary>How does partitioning work in Hadoop, and when is it used?</summary>

### How does partitioning work in Hadoop, and when is it used?

**Definition:**

</details>

<details>
<summary>Explain how reducers work in MapReduce and their interaction with shufflers.</summary>

### Explain how reducers work in MapReduce and their interaction with shufflers.

**Definition:**

</details>

<details>
<summary>What are SequenceFiles in Hadoop?</summary>

### What are SequenceFiles in Hadoop?

**Definition:**

</details>

### Performance Tuning and Optimization

<details>
<summary>Describe the ways to optimize a MapReduce job.</summary>

### Describe the ways to optimize a MapReduce job.

**Definition:**

</details>

<details>
<summary>How can you diagnose and troubleshoot Hadoop performance issues?</summary>

### How can you diagnose and troubleshoot Hadoop performance issues?

**Definition:**

</details>

<details>
<summary>What is the significance of combiner in the Hadoop MapReduce framework?</summary>

### What is the significance of combiner in the Hadoop MapReduce framework?

**Definition:**

</details>

<details>
<summary>Explain what you can do to optimize the performance of HDFS.</summary>

### Explain what you can do to optimize the performance of HDFS.

**Definition:**

</details>

<details>
<summary>How can job scheduling be optimized in Hadoop?</summary>

### How can job scheduling be optimized in Hadoop?

**Definition:**

</details>

<details>
<summary>What are the best practices for managing memory and CPU resources in a Hadoop cluster?</summary>

### What are the best practices for managing memory and CPU resources in a Hadoop cluster?

**Definition:**

</details>

### Coding Challenges

<details>
<summary>Write a MapReduce job in Java that counts the number of words in a text file.</summary>

### Write a MapReduce job in Java that counts the number of words in a text file.

**Definition:**

</details>

<details>
<summary>Create an HDFS command script that copies files from a local file system to HDFS.</summary>

### Create an HDFS command script that copies files from a local file system to HDFS.

**Definition:**

</details>

<details>
<summary>Implement a simple Hive query to summarize data from a Hive table.</summary>

### Implement a simple Hive query to summarize data from a Hive table.

**Definition:**

</details>

<details>
<summary>Code a Pig Latin script to process and transform a dataset into a desired format.</summary>

### Code a Pig Latin script to process and transform a dataset into a desired format.

**Definition:**

</details>

<details>
<summary>Automate a process to import data from a MySQL database into HDFS using Sqoop.</summary>

### Automate a process to import data from a MySQL database into HDFS using Sqoop.

**Definition:**

</details>

<details>
<summary>Implement a Spark job in Scala or Python to perform a join operation on two datasets.</summary>

### Implement a Spark job in Scala or Python to perform a join operation on two datasets.

**Definition:**

</details>

<details>
<summary>Develop an Oozie workflow that schedules and runs a set of MapReduce and Hive jobs.</summary>

### Develop an Oozie workflow that schedules and runs a set of MapReduce and Hive jobs.

**Definition:**

</details>

<details>
<summary>Write a Java program to implement custom input and output format classes in Hadoop.</summary>

### Write a Java program to implement custom input and output format classes in Hadoop.

**Definition:**

</details>

### Advanced Hadoop Features and Architecture

<details>
<summary>What is the concept of erasure coding in HDFS, and how does it differ from replication?</summary>

### What is the concept of erasure coding in HDFS, and how does it differ from replication?

**Definition:**

</details>

<details>
<summary>Explain how Hadoop uses data locality to improve performance.</summary>

### Explain how Hadoop uses data locality to improve performance.

**Definition:**

</details>

<details>
<summary>How does Hadoop support different file formats, and what are some of them?</summary>

### How does Hadoop support different file formats, and what are some of them?

**Definition:**

</details>

<details>
<summary>What is Hadoop federation, and how can it scale a Hadoop cluster?</summary>

### What is Hadoop federation, and how can it scale a Hadoop cluster?

**Definition:**

</details>

<details>
<summary>Discuss the concept and benefits of a journal node in HDFS HA configuration.</summary>

### Discuss the concept and benefits of a journal node in HDFS HA configuration.

**Definition:**

</details>

<details>
<summary>What are the implications of small files on HDFS performance and how can this be mitigated?</summary>

### What are the implications of small files on HDFS performance and how can this be mitigated?

**Definition:**

</details>

### Troubleshooting and Maintenance

<details>
<summary>How would you recover a Hadoop cluster from a Namenode failure?</summary>

### How would you recover a Hadoop cluster from a Namenode failure?

**Definition:**

</details>

<details>
<summary>What considerations should be made for Hadoop cluster backup and disaster recovery?</summary>

### What considerations should be made for Hadoop cluster backup and disaster recovery?

**Definition:**

</details>

<details>
<summary>How would you monitor the health of a Hadoop cluster, and what tools would you use?</summary>

### How would you monitor the health of a Hadoop cluster, and what tools would you use?

**Definition:**

</details>

<details>
<summary>Discuss a strategy for Hadoop cluster capacity planning and scaling.</summary>

### Discuss a strategy for Hadoop cluster capacity planning and scaling.

**Definition:**

</details>

### Scenario-Based Questions and Use Case Discussions

<details>
<summary>A company wants to process clickstream data in real-time. How would you integrate Hadoop and Spark to meet this requirement?</summary>

### A company wants to process clickstream data in real-time. How would you integrate Hadoop and Spark to meet this requirement?

**Definition:**

</details>

<details>
<summary>Propose a data pipeline using Hadoop components to manage and analyze sensor data from IoT devices.</summary>

### Propose a data pipeline using Hadoop components to manage and analyze sensor data from IoT devices.

**Definition:**

</details>
