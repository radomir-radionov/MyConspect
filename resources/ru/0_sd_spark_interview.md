# Apache Spark — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Apache Spark — собеседование](./0_sd_spark_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Apache Spark](https://devinterview.io/questions/machine-learning-and-data-science/apache-spark-interview-questions/).

### Spark Fundamentals

<details>
<summary>What is Apache Spark and what are its main components?</summary>

### What is Apache Spark and what are its main components?

**Definition:**

Apache Spark — распределённый движок для пакетов, SQL, машинного обучения и потоков. Промежуточные данные он держит в памяти, когда они туда помещаются.

**How it works:**

- Spark Core планирует задачи, режет данные на партиции и даёт модель выполнения RDD. Приложения пишут на Scala, Java, Python, R или SQL.
- Spark SQL добавляет DataFrame и Dataset, каталог и планировщик Catalyst. Structured Streaming использует те же таблицы для инкрементальных запросов.
- MLlib даёт распределённые конвейеры обучения. GraphX — операторы над графами. Оба сидят на том же runtime.
- Менеджер кластера — standalone, YARN или Kubernetes — размещает драйвер и исполнителей. Сам Spark менеджером ресурсов не является.

**Examples:**

```text
SparkSession
  -> задача Spark SQL / DataFrame
  -> план Catalyst
  -> задачи на executor
```
</details>

<details>
<summary>Explain how Apache Spark differs from Hadoop MapReduce.</summary>

### Explain how Apache Spark differs from Hadoop MapReduce.

**Definition:**

Оба умеют сканировать данные на кластере. Spark держит конвейер в памяти и не ограничен одной фазой map и одной фазой reduce.

**How it works:**

- MapReduce пишет каждую стадию на диск, прежде чем начнётся следующая задача. Spark передаёт партиции в памяти и сбрасывает на диск только то, что не влезло.
- Задача MapReduce — это фиксированные map и reduce. Задача Spark — граф преобразований, включая SQL, потоки и итерации в одном приложении.
- API Spark выше уровнем: DataFrame, SQL и типизированные Dataset. MapReduce просит автора написать классы mapper и reducer.
- Потерянная партиция Spark восстанавливается по lineage. MapReduce заново читает входной кусок упавшей задачи. Оба повторяют упавшие задачи.
- У Spark остаётся задержка shuffle. Один тяжёлый shuffle данных больше памяти ближе к задаче MapReduce, чем к чистому счёту в памяти.
</details>

<details>
<summary>Describe the concept of RDDs (Resilient Distributed Datasets) in Spark.</summary>

### Describe the concept of RDDs (Resilient Distributed Datasets) in Spark.

**Definition:**

RDD — неизменяемая коллекция, разрезанная на партиции. Преобразования только записывают новый RDD и не выполняются, пока действие не запросит результат.

**How it works:**

- Партиция — единица параллелизма. Узкое преобразование, такое как map или filter, остаётся внутри партиции. Широкое, такое как groupByKey или join, гоняет данные по сети.
- Lineage — цепочка родительских RDD и функция, которая построила каждую партицию. Если партиция потеряна, Spark пересчитывает её от этих родителей.
- Действия — count, collect, save — запускают задачу. collect огромного RDD стягивает результат на драйвер и может его исчерпать.
- cache или persist оставляют посчитанный RDD для следующего действия. Checkpoint обрезает длинный lineage, записывая материализованную копию.
</details>

<details>
<summary>What are DataFrames in Spark and how do they compare to RDDs?</summary>

### What are DataFrames in Spark and how do they compare to RDDs?

**Definition:**

DataFrame — распределённая таблица с именами колонок и схемой. Планировщик может её переписать; RDD из непрозрачных объектов обычно нет.

**How it works:**

- Строки лежат в компактном колоночном формате, поэтому фильтр и агрегация трогают только нужные столбцы.
- Catalyst видит реляционные операторы: filter, project, join, aggregate. Он может протолкнуть предикат в источник и выбрать стратегию соединения. map на RDD — чёрный ящик.
- Тот же join, записанный через keyBy и join на RDD, длиннее и пропускает эти переписывания. Dataset добавляет типы на этапе компиляции поверх того же плана в Scala и Java.
- RDD уместен, когда у записей нет полезных колонок. DataFrame — для структурированных файлов, JDBC и SQL.

**Examples:**

```text
events.filter(col("day") == "2026-10-04").groupBy("path").count()
```

Планировщик может отбросить неиспользуемые колонки и пропустить файлы чужого дня. Эквивалентные RDD `filter` и `reduceByKey` прячут эту структуру внутри лямбд.
</details>

<details>
<summary>What is lazy evaluation and how does it benefit Spark computations?</summary>

### What is lazy evaluation and how does it benefit Spark computations?

**Definition:**

Spark записывает преобразования и выполняет их, только когда действие запрашивает результат. Всю цепочку можно спланировать как одну задачу.

**How it works:**

- map, filter, select и join строят логический план. count, show, write и collect запускают выполнение.
- Планировщик сливает узкие шаги, выбрасывает лишнюю работу и ведёт партиции потоком, чтобы данные не материализовались между каждым вызовом.
- Преобразование, которое не нужно ни одному действию, не считается. Два действия на одном некэшированном lineage считают его дважды.
- Отладка менее локальна: сбой виден на действии, а стек указывает назад по lineage.

**Examples:**

```text
df = spark.read.parquet("/events")
df2 = df.filter(df.day == "2026-10-04")   # чтения ещё нет
df2.count()                                # одна задача: чтение, фильтр, count
```
</details>

<details>
<summary>How does Spark achieve fault tolerance?</summary>

### How does Spark achieve fault tolerance?

**Definition:**

Spark считает потерянную партицию тем, что нужно пересчитать от родителей, и повторяет упавшие задачи на других исполнителях.

**How it works:**

- У каждой партиции RDD есть lineage: родительские партиции и функция, которая её породила. Неизменяемые входы делают повтор безопасным.
- Файлы shuffle записываются, чтобы следующая стадия могла забрать их снова. Потерянный выход map-стадии shuffle пересчитывается.
- checkpoint пишет материализованный RDD и забывает lineage до этой точки. Это ограничивает повтор длинной итеративной задачи.
- Драйвер может заново запустить упавшую задачу. Спекулятивное выполнение стартует вторую копию отстающей задачи. Кэш — оптимизация, а не механизм надёжности.
- Результат действия согласован с пересчётом, пока функции детерминированы. Недетерминированный map делает повтор другим.
</details>

<details>
<summary>What is the role of Spark Driver and Executors?</summary>

### What is the role of Spark Driver and Executors?

**Definition:**

Драйвер строит план и назначает задачи. Исполнители выполняют эти задачи и держат закэшированные партиции.

**How it works:**

- На драйвере живёт SparkSession. Он превращает логический план в стадии и шлёт задачи исполнителям. Туда же приезжают небольшие результаты, такие как count и строки take.
- Исполнитель — рабочий процесс с пулом потоков. Он выполняет задачи, хранит блоки shuffle и держит кэш.
- Менеджер кластера запускает исполнителей. В режиме cluster драйвер сам работает внутри кластера; в режиме client он остаётся на машине, которая отправила заявку.
- Широкое преобразование становится границей стадии. Драйвер запускает следующую стадию, только когда выходы shuffle предыдущей стадии готовы.
</details>

<details>
<summary>How does Spark's DAG (Directed Acyclic Graph) Scheduler work?</summary>

### How does Spark's DAG (Directed Acyclic Graph) Scheduler work?

**Definition:**

Планировщик DAG превращает lineage задачи в стадии, разрезанные по shuffle, а планировщик задач выполняет задачи внутри стадии.

**How it works:**

- Узкие зависимости сливаются в одну стадию: несколько map и filter на той же партиции становятся одной задачей.
- Широкая зависимость, такая как shuffle join или groupBy, заканчивает стадию. Следующая стадия не начнётся, пока эти выходы не появятся.
- Граф ациклический, потому что каждый RDD указывает только на более старых родителей. Планировщик идёт от действия назад к источникам.
- Упавшие задачи отправляются снова. Если в стадии слишком много отказов, стадия падает, и повтор lineage может заново выполнить предыдущую стадию.

**Examples:**

```text
read -> filter -> map          стадия 1 (без shuffle)
groupBy("user")                граница стадии
count                          стадия 2
```
</details>

### Spark Architecture and Ecosystem

<details>
<summary>Explain the concept of a Spark Session and its purpose.</summary>

### Explain the concept of a Spark Session and its purpose.

**Definition:**

SparkSession — входной объект одного приложения: конфигурация, каталог, SQL и чтение-запись DataFrame.

**How it works:**

- Builder задаёт имя приложения, master и настройки, затем getOrCreate возвращает сессию. Повторный вызов в том же процессе её переиспользует.
- spark.read и DataFrameWriter идут через сессию. spark.sql выполняет запрос к временным представлениям и таблицам каталога.
- Каталог создаёт и удаляет представления, кэширует таблицы и перечисляет базы. UDF регистрируют на сессии, чтобы SQL мог их вызвать.
- spark.sparkContext по-прежнему открывает старую точку входа RDD. Остановка сессии освобождает контекст и принадлежащих ей исполнителей.

**Examples:**

```text
spark = SparkSession.builder.appName("daily").getOrCreate()
spark.read.parquet("/events").createOrReplaceTempView("events")
spark.sql("SELECT path, count(*) FROM events GROUP BY path")
```
</details>

<details>
<summary>How does Spark integrate with Hadoop components like HDFS and YARN?</summary>

### How does Spark integrate with Hadoop components like HDFS and YARN?

**Definition:**

Spark читает и пишет HDFS через файловые API Hadoop и может попросить YARN разместить драйвер и исполнителей.

**How it works:**

- Пути вроде `hdfs://namenode/events` используют конфигурацию Hadoop кластера: `core-site.xml` и `hdfs-site.xml`. Те же читатели открывают Parquet, ORC и текст.
- `--master yarn` отправляет приложение в ResourceManager. YARN выделяет контейнеры; Spark решает, какие задачи в них бегут.
- Режим `cluster` запускает драйвер в контейнере YARN, ноутбук может отключиться. Режим `client` оставляет драйвер на отправителе, и исполнители должны его видеть.
- Расположение блоков HDFS по-прежнему влияет на предпочтительное место задачи — та же идея локальности данных, что у MapReduce.
</details>

<details>
<summary>Describe the various ways to run Spark applications (cluster, client, local modes).</summary>

### Describe the various ways to run Spark applications (cluster, client, local modes).

**Definition:**

Локальный режим выполняет всё в одном процессе. Режимы client и cluster различаются тем, где живёт драйвер, а не тем, как написана задача.

**How it works:**

- `local` и `local[n]` запускают драйвер и задачи в JVM отправителя. `local[*]` берёт по потоку на ядро. Это для разработки, не для общего кластера.
- Standalone — собственные master и worker Spark. YARN и Kubernetes — внешние менеджеры. Код приложения тот же.
- Режим client оставляет драйвер на машине, которая отправила задачу. Исполнители должны достучаться до этого драйвера, и мёртвый ноутбук убивает задачу.
- Режим cluster кладёт драйвер внутрь кластера. `spark-submit` только доставляет приложение и может завершиться. Логи драйвера тогда на кластере, а не в локальном терминале.

**Examples:**

```text
spark-submit --master local[*] app.py
spark-submit --master yarn --deploy-mode client app.py
spark-submit --master yarn --deploy-mode cluster app.py
```
</details>

<details>
<summary>What are Spark's data source APIs and how do you use them?</summary>

### What are Spark's data source APIs and how do you use them?

**Definition:**

DataFrameReader и DataFrameWriter — общий API: выбрать формат, задать параметры и загрузить или сохранить таблицу.

**How it works:**

- `spark.read.format(name)` выбирает источник: parquet, orc, json, csv, text или jdbc. Параметры задают пути, схемы и учётные данные. `load` возвращает DataFrame.
- `df.write.format(name).mode(...)` сохраняет. Режимы: ошибка, если путь есть; overwrite; append; ignore.
- Обнаружение разделов считает имена каталогов вроде `day=2026-10-04` колонками. `partitionBy` при записи создаёт эти каталоги.
- Короткое имя вроде `spark.read.parquet(path)` — тот же читатель с уже выбранным форматом. API каталога регистрирует DataFrame как таблицу metastore.

**Examples:**

```text
spark.read.format("csv").option("header", "true").schema(schema).load("/in")
df.write.mode("overwrite").partitionBy("day").parquet("/out")
```
</details>

<details>
<summary>Discuss the role of accumulators and broadcast variables in Spark.</summary>

### Discuss the role of accumulators and broadcast variables in Spark.

**Definition:**

Аккумуляторы собирают побочный итог с задач. Broadcast-переменные доставляют одну копию небольшого значения только для чтения на каждый исполнитель.

**How it works:**

- Аккумулятор на исполнителях только для записи, а читает его драйвер. Задачи прибавляют; `value` должен читать драйвер. Надёжны обновления внутри действий: повтор стадии может прибавить дважды, если Spark не корректирует этот тип аккумулятора.
- Broadcast копируется один раз на исполнитель и переиспользуется всеми его задачами. Задачи должны считать его неизменяемым.
- Аккумулятор годится для диагностического счётчика, например битых строк. Broadcast — для справочника, который иначе уехал бы внутри замыкания каждой задачи.
- Ни то ни другое не заменяет shuffle. Большой справочник принадлежит join, а не broadcast, который не влезает в память исполнителя.

**Examples:**

```text
bad_rows = sc.accumulator(0)

def parse(line):
    if line.count(",") != 3:
        bad_rows.add(1)
        return None
    return line.split(",")

rates = sc.broadcast({"usd": 1.0, "eur": 0.92})
amount_usd = lambda row: row.amount / rates.value[row.currency]
```
</details>

<details>
<summary>What is the significance of the Catalyst optimizer in Spark SQL?</summary>

### What is the significance of the Catalyst optimizer in Spark SQL?

**Definition:**

Catalyst превращает DataFrame или SQL-запрос в исполнимый план: разбирает его, переписывает правилами и выбирает физические операторы.

**How it works:**

- Анализатор сопоставляет имена, типы и функции с каталогом и отвергает запрос, который не проходит проверку типов.
- Логические правила сворачивают константы, проталкивают фильтры к источнику, отбрасывают лишние колонки и упрощают предикаты. Правила можно добавлять: движок — это набор переписываний дерева.
- Физическое планирование выбирает операторы, например broadcast hash join против sort-merge join, и то, как резать shuffle, используя статистику, если она есть.
- Затем сгенерированный код выполняет выбранный план. Кэш таблицы — отдельное решение о хранении. Задача Catalyst — план, а не ручной ярус памяти.

**Examples:**

```text
SELECT path FROM events WHERE day = '2026-10-04'
```

Анализ связывает `events`. Логическое правило может протолкнуть `day` в чтение раздела и отбросить все колонки, кроме `path`, ещё до скана.
</details>

<details>
<summary>How does Tungsten contribute to Spark's performance?</summary>

### How does Tungsten contribute to Spark's performance?

**Definition:**

Tungsten — слой выполнения Spark. Он хранит строки в компактном двоичном виде и гоняет сгенерированный код, чтобы процессор меньше времени тратил на объекты и сборку мусора.

**How it works:**

- Двоичный формат держит значения колонок в раскладке, удобной для кэша, а не как граф Java-объектов на каждое поле.
- Управляемая память может лежать вне кучи Java, и сборщик мусора эти байты не сканирует. Память выполнения и память хранения делят один пул и могут занимать друг у друга.
- Генерация кода на всю стадию сливает несколько операторов в один метод Java. Это убирает виртуальные вызовы и промежуточные строки между ними.
- Кодировщики переводят объекты JVM в этот двоичный вид на границе. Операторы в середине работают с байтами и не сериализуют строку на каждом шаге.

**Examples:**

Закэшированный DataFrame `(name, age)` хранится строками Tungsten. Последующие `filter` и `count` могут идти сгенерированным кодом по этой раскладке, а не выделять Java-объект на каждое поле каждой строки.
</details>

### Spark Programming and APIs

<details>
<summary>Briefly describe the Spark Core API and its features.</summary>

### Briefly describe the Spark Core API and its features.

**Definition:**

</details>

<details>
<summary>What are the transformations and actions in Spark RDDs?</summary>

### What are the transformations and actions in Spark RDDs?

**Definition:**

</details>

<details>
<summary>How do you handle partitioning in Spark to optimize performance?</summary>

### How do you handle partitioning in Spark to optimize performance?

**Definition:**

</details>

<details>
<summary>Illustrate the differences between map and flatMap functions in Spark.</summary>

### Illustrate the differences between map and flatMap functions in Spark.

**Definition:**

</details>

<details>
<summary>What are Key-Value pair RDDs, and when would you use them?</summary>

### What are Key-Value pair RDDs, and when would you use them?

**Definition:**

</details>

<details>
<summary>Explain how to perform a join operation in Spark.</summary>

### Explain how to perform a join operation in Spark.

**Definition:**

</details>

<details>
<summary>Detail how window functions work in Spark SQL.</summary>

### Detail how window functions work in Spark SQL.

**Definition:**

</details>

### Spark Streaming and Real-Time Processing

<details>
<summary>Describe the concept of discretized streams (DStreams) in Spark.</summary>

### Describe the concept of discretized streams (DStreams) in Spark.

**Definition:**

</details>

<details>
<summary>How does Structured Streaming differ from DStream-based streaming?</summary>

### How does Structured Streaming differ from DStream-based streaming?

**Definition:**

</details>

<details>
<summary>What are the fault-tolerance mechanisms in Spark Streaming?</summary>

### What are the fault-tolerance mechanisms in Spark Streaming?

**Definition:**

</details>

<details>
<summary>How do you handle late data and stateful processing in Spark Streaming?</summary>

### How do you handle late data and stateful processing in Spark Streaming?

**Definition:**

</details>

<details>
<summary>Explain watermarks and windowing operations in Structured Streaming.</summary>

### Explain watermarks and windowing operations in Structured Streaming.

**Definition:**

</details>

### Performance Tuning and Optimization

<details>
<summary>What are some common Spark performance issues and how do you resolve them?</summary>

### What are some common Spark performance issues and how do you resolve them?

**Definition:**

</details>

<details>
<summary>How can you minimize data shuffling in Spark?</summary>

### How can you minimize data shuffling in Spark?

**Definition:**

</details>

<details>
<summary>Discuss the importance and methods of caching/persistence in Spark.</summary>

### Discuss the importance and methods of caching/persistence in Spark.

**Definition:**

</details>

<details>
<summary>Explain how you would monitor and log a Spark application.</summary>

### Explain how you would monitor and log a Spark application.

**Definition:**

</details>

<details>
<summary>What is the role of partitioner objects in Spark and how do they affect performance?</summary>

### What is the role of partitioner objects in Spark and how do they affect performance?

**Definition:**

</details>

### Spark MLlib (Machine Learning Library)

<details>
<summary>What are the main features of Spark MLlib?</summary>

### What are the main features of Spark MLlib?

**Definition:**

</details>

<details>
<summary>How does Spark MLlib handle machine learning pipelines?</summary>

### How does Spark MLlib handle machine learning pipelines?

**Definition:**

</details>

<details>
<summary>Describe a use case for MLlib's collaborative filtering algorithms.</summary>

### Describe a use case for MLlib's collaborative filtering algorithms.

**Definition:**

</details>

<details>
<summary>Explain the difference between Spark MLlib and external machine learning libraries.</summary>

### Explain the difference between Spark MLlib and external machine learning libraries.

**Definition:**

</details>

### Coding Challenges

<details>
<summary>Write a Scala/Python Spark code snippet that reads a CSV file and calculates the average of a column.</summary>

### Write a Scala/Python Spark code snippet that reads a CSV file and calculates the average of a column.

**Definition:**

</details>

<details>
<summary>Implement a Spark streaming application that counts words in text data received from a socket.</summary>

### Implement a Spark streaming application that counts words in text data received from a socket.

**Definition:**

</details>

<details>
<summary>Code a Spark SQL query that finds the top 3 most occurring words in a DataFrame.</summary>

### Code a Spark SQL query that finds the top 3 most occurring words in a DataFrame.

**Definition:**

</details>

<details>
<summary>Create a Spark job that joins two datasets on a key and summarizes data.</summary>

### Create a Spark job that joins two datasets on a key and summarizes data.

**Definition:**

</details>

<details>
<summary>Write a Python function using PySpark to filter out records with null values in a specific column.</summary>

### Write a Python function using PySpark to filter out records with null values in a specific column.

**Definition:**

</details>

<details>
<summary>Implement a logistic regression model in Spark MLlib.</summary>

### Implement a logistic regression model in Spark MLlib.

**Definition:**

</details>

<details>
<summary>Create a Spark Streaming application to aggregate event data by time windows.</summary>

### Create a Spark Streaming application to aggregate event data by time windows.

**Definition:**

</details>

<details>
<summary>Write Spark code to calculate the PageRank of a simple website link graph.</summary>

### Write Spark code to calculate the PageRank of a simple website link graph.

**Definition:**

</details>

### Case Studies and Scenario-Based Questions

<details>
<summary>How would you build a recommender system in Spark?</summary>

### How would you build a recommender system in Spark?

**Definition:**

</details>

<details>
<summary>Discuss a strategy to perform real-time sentiment analysis using Spark Streaming.</summary>

### Discuss a strategy to perform real-time sentiment analysis using Spark Streaming.

**Definition:**

</details>

<details>
<summary>Propose an ETL pipeline design using Spark to process large datasets.</summary>

### Propose an ETL pipeline design using Spark to process large datasets.

**Definition:**

</details>

<details>
<summary>How would you use Spark to detect fraudulent behavior in financial transactions?</summary>

### How would you use Spark to detect fraudulent behavior in financial transactions?

**Definition:**

</details>

<details>
<summary>Illustrate how you would use Spark to optimize marketing strategies based on customer behavior data.</summary>

### Illustrate how you would use Spark to optimize marketing strategies based on customer behavior data.

**Definition:**

</details>

<details>
<summary>Explain a big data analytics project where Spark would be a better choice than other big data technologies and why.</summary>

### Explain a big data analytics project where Spark would be a better choice than other big data technologies and why.

**Definition:**

</details>

### Advanced Topics and Research

<details>
<summary>Discuss the advancements in Spark 3.x and their impact on big data processing.</summary>

### Discuss the advancements in Spark 3.x and their impact on big data processing.

**Definition:**

</details>

<details>
<summary>Explain how Dynamic Resource Allocation works in Spark.</summary>

### Explain how Dynamic Resource Allocation works in Spark.

**Definition:**

</details>

<details>
<summary>How do you implement custom aggregations in Spark?</summary>

### How do you implement custom aggregations in Spark?

**Definition:**

</details>

<details>
<summary>What are the current research areas or challenges in the Apache Spark ecosystem?</summary>

### What are the current research areas or challenges in the Apache Spark ecosystem?

**Definition:**

</details>

<details>
<summary>How does Spark support deep learning workloads and integration with popular deep learning frameworks?</summary>

### How does Spark support deep learning workloads and integration with popular deep learning frameworks?

**Definition:**

</details>
