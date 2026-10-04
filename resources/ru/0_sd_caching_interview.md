# Caching — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Caching — собеседование](./0_sd_caching_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Caching](https://devinterview.io/questions/software-architecture-and-system-design/caching-interview-questions/).

### Caching Fundamentals

<details>
<summary>Define caching in the context of computer programming.</summary>

### Define caching in the context of computer programming.

**Definition:**

Кэш хранит копию данных, которые было дорого достать или посчитать, чтобы следующий запрос взял копию.

**How it works:**

- Копия лежит ближе к читателю: кэш процессора, память процесса, Redis или CDN.
- Она срезает повторную работу и снимает нагрузку с источника ценой значения, которое может быть старше источника.
- Она окупается на горячих данных, медленных вычислениях и всплесках, которые источник не переварит.
- Это плохой инструмент, когда каждое чтение обязано видеть последнюю запись.

**Examples:**

```text
промах: читать базу, сохранить под ключом "product:42", вернуть строку
попадание: вернуть сохранённую строку, базу не трогать
```
</details>

<details>
<summary>What are the main purposes of using a cache in a software application?</summary>

### What are the main purposes of using a cache in a software application?

**Definition:**

Кэш существует, чтобы повторная работа была дешёвой и система отвечала, когда источник медленный или ненадолго лежит.

**How it works:**

- Задержка падает, потому что память быстрее запроса или удалённого вызова.
- Источник видит меньше чтений, поэтому всплеск можно отдать с копии.
- Реплицированный кэш может ответить, если умер один узел кэша. Это устойчивость копии, не источника истины.
- Истечение и инвалидация — как ограничивают, насколько копия может устареть.
- Мемоизация чистой функции, например уже посчитанного шага Фибоначчи, — та же идея внутри одного процесса.

**Examples:**

```text
fib(n): если n в кэше — вернуть
        иначе посчитать, сохранить, вернуть
```
</details>

<details>
<summary>Can you explain the concept of cache hit and cache miss?</summary>

### Can you explain the concept of cache hit and cache miss?

**Definition:**

Попадание — поиск, который нашёл годную копию. Промах — поиск, который не нашёл, поэтому вызывающий платит полную цену и обычно сохраняет результат.

**How it works:**

- Обязательный промах — первое использование: для этого ключа кэш пуст.
- Промах по ёмкости случается, потому что кэш был полон и вытеснение убрало ключ, который снова понадобился.
- Промах по конфликту случается, когда два ключа попадают в один слот и выбивают друг друга, как в прямом кэше процессора.
- Промах по когерентности случается, когда другой писатель инвалидировал строку, которую вы держали.
- Доля попаданий — попадания, делённые на поиски. Поднять её — смысл размера и политики вытеснения.

**Examples:**

Десять поисков, семь отданы из памяти: доля попаданий 70%. Остальные три спросили базу и заполнили кэш.
</details>

<details>
<summary>Describe the impact of cache size on performance.</summary>

### Describe the impact of cache size on performance.

**Definition:**

Кэш больше держит больше ключей, поэтому меньше запросов промахиваются, пока кэш не станет дороже промахов, которые он предотвращает.

**How it works:**

- Слишком маленький: вытеснения молотят, и доля попаданий остаётся низкой.
- Достаточный для рабочего набора: большинство горячих ключей остаётся, и источник видит долю трафика.
- Больше рабочего набора: лишняя память простаивает. На маленьком устройстве эта память была нужна в другом месте.
- Огромный кэш — ещё и огромная поверхность устаревания. Инвалидации и истечению надо попасть в больше ключей.
- Политика вытеснения решает, какой лишний слот полезен. Размер без вменяемой политики всё равно выбрасывает горячий ключ.

**Examples:**

Горячая тысяча товаров каталога помещается в память, и QPS базы падает. Кэш всех 20 миллионов холодных SKU в основном хранит ключи, которые никто не спрашивает.
</details>

<details>
<summary>How does a cache improve data retrieval times?</summary>

### How does a cache improve data retrieval times?

**Definition:**

Кэш ускоряет получение, отвечая с более быстрого яруса и не повторяя медленную работу.

**How it works:**

- Память и локальный диск бьют круг до базы или в другой регион.
- Кэш браузера не скачивает CSS и картинки, которые не менялись.
- Хранилище в памяти вроде Redis или Memcached отдаёт горячие ключи многим экземплярам приложения.
- Распределённый кэш разносит эти ключи по узлам, чтобы потолком не была память одной машины.
- Меньше чтений источника значит, что источник меньше стоит в очереди, поэтому оставшиеся промахи тоже быстрее.
</details>

<details>
<summary>What is the difference between local caching and distributed caching?</summary>

### What is the difference between local caching and distributed caching?

**Definition:**

Локальный кэш живёт внутри одного процесса и невидим остальным. Распределённый кэш — общий сервис, который читают и пишут многие экземпляры.

**How it works:**

- У локального нет сетевого прыжка, и согласованность внутри процесса тривиальна. У каждого экземпляра может быть своё значение.
- Распределённый платит сетевой прыжок и может отдать один ключ с каждого узла приложения. Копии между узлами кэша часто eventually consistent.
- Локальный берут, когда данные частные для процесса, крошечные или задержка внутри одной машины решает всё.
- Распределённый берут, когда много экземпляров должны видеть одно значение, когда рабочий набор больше одного процесса или когда перезапущенный процесс не должен стартовать холодным.

**Examples:**

Каждый веб-процесс кэширует права пользователя в карте: быстро и устаревает до перезапуска этого процесса. Общий ключ Redis `perm:7` — то, что видит каждый процесс после обновления, как только запись дошла до Redis.
</details>

<details>
<summary>Explain the concept of cache eviction and mention common strategies.</summary>

### Explain the concept of cache eviction and mention common strategies.

**Definition:**

Вытеснение — как полный кэш выбирает ключ, который выбросить, чтобы вошёл новый.

**How it works:**

- Least recently used выбрасывает ключ, которого дольше всех не трогали. Нужен порядок свежести.
- Least frequently used выбрасывает ключ с наименьшим числом попаданий. Счётчик — лишняя работа, и он может застрять на ключе, который был горячим один раз.
- First in, first out выбрасывает самого старого жильца независимо от использования.
- Случайный выбор дёшев и на удивление приличен, когда учёт нельзя себе позволить.
- Сброс по time-to-live — это истечение, а не давление полного кэша, и его часто сочетают с одним из вариантов выше.

**Examples:**

Карта плюс двусвязный список реализуют LRU: попадание двигает узел в голову, а вставка в полный кэш вытесняет хвост.
</details>

<details>
<summary>What is a cache key and how is it used?</summary>

### What is a cache key and how is it used?

**Definition:**

Ключ кэша — личность сохранённого значения. Одни и те же входы должны давать один ключ, а разные входы не должны сталкиваться.

**How it works:**

- Ключ часто имя плюс аргументы: `product:42` или хеш запроса.
- Если забыть меняющийся аргумент, два пользователя делят значение. Если включить бесполезный, попаданий не будет.
- Нормализуйте порядок и регистр до хеша, иначе `b=1&a=2` и `a=2&b=1` промахиваются друг мимо друга.
- Не кладите секреты в ключ, который попадёт в лог.

**Examples:**

```text
key = "catalog:" + region + ":" + sku
GET catalog:eu:lamp
```
Без `region` европейская цена уйдёт американскому запросу.
</details>

<details>
<summary>Explain the importance of cache expiration and how it is managed.</summary>

### Explain the importance of cache expiration and how it is managed.

**Definition:**

Истечение ограничивает, как долго копию можно отдавать после изменения источника, даже если никто не вспомнил её инвалидировать.

**How it works:**

- TTL сбрасывает ключ через срок от записи или от последнего доступа.
- Короткий TTL держит данные свежее и даёт больше промахов. Длинный — наоборот.
- Истечение — страховочная сетка. Явная инвалидация на запись — как сбросить ключ в момент, когда он стал неверным.
- Serve-stale-while-revalidate может один раз отдать старое значение и обновить в фоне, чтобы шквал промахов не ударил в источник.

**Examples:**

`SET price:lamp 40 EX 60` значит, что через минуту следующий читатель промахнётся и загрузит базу, изменилась цена или нет.
</details>

<details>
<summary>How does cache invalidation work and why is it necessary?</summary>

### How does cache invalidation work and why is it necessary?

**Definition:**

Инвалидация убирает или заменяет кэшированное значение, потому что источник изменился. Без неё читатели держат копию, которая уже неверна, пока TTL случайно не истечёт.

**How it works:**

- На запись ключ удаляют или перезаписывают. Следующее чтение заполняет свежую копию. Это инвалидация cache-aside.
- Write-through обновляет кэш и базу в одном запросе, поэтому позднее чтение попадает в новое значение.
- Write-behind обновляет кэш и сбрасывает в базу позже. Кэш впереди источника, и падение может потерять запись.
- В распределённом кэше каждый узел, который мог держать ключ, должен его сбросить, либо вы принимаете окно разногласия.
- Трудное — знать каждый ключ, которого касается запись, и сделать это при одновременных обновлениях.

**Examples:**

Обновление цены лампы удаляет `price:lamp`. Следующая страница товара промахивается, читает 42 из базы и сохраняет 42. Страница, которая всё ещё держала 40, была бы неверной.
</details>

### Cache Implementation and Design

<details>
<summary>Describe the steps involved in implementing a basic cache system.</summary>

### Describe the steps involved in implementing a basic cache system.

**Definition:**

Базовый кэш — карта от ключа к значению, способ ограничить размер и правило, что делать при промахе.

**How it works:**

- Ищут ключ. При попадании возвращают значение и обновляют то, что отслеживает политика вытеснения.
- При промахе грузят из источника, сохраняют значение и возвращают его.
- Если карта полна, сначала вытесняют одну запись. LRU — обычный выбор по умолчанию.
- Каждой записи дают TTL, чтобы забытый ключ не жил вечно.
- При записи в источник ключ удаляют. Не оставляйте кэш единственным местом нового значения, если вы не выбрали write-through.

**Examples:**

```text
get(key):
  if key in map and not expired: return map[key]
  value = load(key)
  if map is full: evict least recently used
  map[key] = value
  return value
```
</details>

<details>
<summary>How would you handle cache synchronization in a distributed environment?</summary>

### How would you handle cache synchronization in a distributed environment?

**Definition:**

Синхронизация значит, что запись, меняющая источник, также меняет или сбрасывает каждую кэшированную копию, которую ещё могут отдать.

**How it works:**

- Самый простой путь — короткий TTL и никакой активной синхронизации. Копии отстают и лечатся истечением.
- Явная инвалидация публикует «сбросить этот ключ» в шину, и каждый узел приложения удаляет его из локального кэша.
- Общий кэш вроде Redis — одна копия. Узлы приложения не держат каждый свою, поэтому разносить нечего, кроме собственных реплик Redis.
- Write-through обновляет общий кэш как часть записи. Write-behind рискует потерять обновления, если кэш умрёт до сброса.
- Версионируют значение. Читатель, увидевший старую версию, перечитывает. Это терпит потерянное сообщение инвалидации.

**Examples:**

После смены цены писатель удаляет ключ Redis и публикует `invalidate price:lamp`. Каждый сервер сбрасывает локальную копию. Сервер, пропустивший сообщение, всё равно истекает локальную запись через 30 секунд.
</details>

<details>
<summary>Explain the use of hash maps in cache implementation.</summary>

### Explain the use of hash maps in cache implementation.

**Definition:**

Хеш-карта — обычная структура кэша, потому что поиск, вставка и удаление в среднем занимают постоянное время.

**How it works:**

- Ключ хешируется в корзину, и значение лежит там вместе с метаданными: срок, число попаданий или указатель в список LRU.
- Карта отвечает «есть ли этот ключ?». Сама она не знает, какой ключ старее. Поэтому LRU ставит рядом со картой связный список.
- Коллизии значат, что два ключа делят корзину. Реализация цепляет их или идёт дальше пробой. Плохой хеш превращает это в скан.
- Изменение размера таблицы стоит паузы или постепенной работы. Ограничьте число записей, чтобы resize был редок.

**Examples:**

```text
buckets[hash("price:lamp") % n] -> {value: 40, expires: t}
get: хеш, найти узел, вернуть значение
```
</details>

<details>
<summary>What are some common caching algorithms, and how do they differ?</summary>

### What are some common caching algorithms, and how do they differ?

**Definition:**

Обычные алгоритмы различаются тем, какого жильца вытесняют, когда кэш полон, и сколько учёта этот выбор стоит.

**How it works:**

- LRU вытесняет наименее недавно использованный. Он следит за свежестью и подходит нагрузкам, где недавнее прошлое предсказывает следующее чтение.
- LFU вытесняет наименее часто использованный. Он подходит устойчивому набору горячих ключей и может держаться за ключ, который был популярен, а потом остыл.
- FIFO вытесняет самую старую вставку и игнорирует поздние попадания. Он прост и слабее, когда ключ горячий.
- MRU вытесняет наиболее недавно использованный. Это узкая ниша для скана, который не переиспользует только что тронутое.
- Случайный вытесняет любой ключ. Метаданных ему почти не нужно.
- TTL ортогонален: он убирает ключ, потому что тот стар по времени, полон кэш или нет.
</details>

<details>
<summary>Explain the design considerations for a cache that supports high concurrency.</summary>

### Explain the design considerations for a cache that supports high concurrency.

**Definition:**

Параллельный кэш должен пускать многих читателей и писателей, не превращая карту в один глобальный замок.

**How it works:**

- Делите карту по хешу ключа, чтобы два ключа редко делили замок. Один мьютекс на весь кэш сериализует каждый запрос.
- Предпочитайте параллельные чтения. Замок чтение-запись или неизменяемый снимок на шард держат попадания вне пути записи.
- Обновление списка LRU на пути попадания должно быть дешёвым, иначе «подвинуть в голову» популярного ключа станет узким местом. Иногда хватает выборочного LRU.
- Атомарный put-if-absent не даёт двум промахам оба загрузить источник и перезаписать друг друга.
- Устаревание решают заранее. Write-through свежее и медленнее. Короткий TTL с инвалидацией обычно достаточен и избегает распределённой транзакции.
- Ограничьте память на шард, чтобы один горячий шард не рос без предела.

**Examples:**

```text
shard = hash(key) % 32
lock only shard
при промахе: single-flight загрузки, чтобы 100 ждущих разделили одно чтение источника
```
</details>

<details>
<summary>How would you prevent cache stampede in a high-load application?</summary>

### How would you prevent cache stampede in a high-load application?

**Definition:**

</details>

<details>
<summary>What are the trade-offs between read-heavy and write-heavy caching strategies?</summary>

### What are the trade-offs between read-heavy and write-heavy caching strategies?

**Definition:**

</details>

<details>
<summary>Describe the role of a cache manifest in web applications.</summary>

### Describe the role of a cache manifest in web applications.

**Definition:**

</details>

<details>
<summary>How do you ensure consistency between cache and primary data storage?</summary>

### How do you ensure consistency between cache and primary data storage?

**Definition:**

</details>

<details>
<summary>Explain the use of cache tagging and its benefits.</summary>

### Explain the use of cache tagging and its benefits.

**Definition:**

</details>

### Caching in Distributed Systems

<details>
<summary>Explain distributed caching and its advantages over local caching.</summary>

### Explain distributed caching and its advantages over local caching.

**Definition:**

</details>

<details>
<summary>How do you handle cache partitioning in distributed systems?</summary>

### How do you handle cache partitioning in distributed systems?

**Definition:**

</details>

<details>
<summary>Describe consistency models in distributed caching (e.g., eventual consistency).</summary>

### Describe consistency models in distributed caching (e.g., eventual consistency).

**Definition:**

</details>

<details>
<summary>What is cache replication and how is it typically implemented?</summary>

### What is cache replication and how is it typically implemented?

**Definition:**

</details>

<details>
<summary>Name some strategies to avoid cache coherence issues in distributed systems.</summary>

### Name some strategies to avoid cache coherence issues in distributed systems.

**Definition:**

</details>

<details>
<summary>How do you handle network latency in distributed caching?</summary>

### How do you handle network latency in distributed caching?

**Definition:**

</details>

<details>
<summary>What are the challenges in maintaining a distributed cache?</summary>

### What are the challenges in maintaining a distributed cache?

**Definition:**

</details>

<details>
<summary>Explain the concept of a write-through cache in a distributed environment.</summary>

### Explain the concept of a write-through cache in a distributed environment.

**Definition:**

</details>

<details>
<summary>How does a distributed cache handle node failures?</summary>

### How does a distributed cache handle node failures?

**Definition:**

</details>

<details>
<summary>What is a shared cache, and how does it differ from a distributed cache?</summary>

### What is a shared cache, and how does it differ from a distributed cache?

**Definition:**

</details>

### Advanced Caching Concepts

<details>
<summary>Explain the concept of a content delivery network (CDN) and its relation to caching.</summary>

### Explain the concept of a content delivery network (CDN) and its relation to caching.

**Definition:**

</details>

<details>
<summary>Explain edge caching and its use cases.</summary>

### Explain edge caching and its use cases.

**Definition:**

</details>

<details>
<summary>What is cache warming and when is it used?</summary>

### What is cache warming and when is it used?

**Definition:**

</details>

<details>
<summary>How does query result caching work in database systems?</summary>

### How does query result caching work in database systems?

**Definition:**

</details>

<details>
<summary>Describe object caching and its advantages in object-oriented programming.</summary>

### Describe object caching and its advantages in object-oriented programming.

**Definition:**

</details>

<details>
<summary>Discuss the impact of caching on microservices architecture.</summary>

### Discuss the impact of caching on microservices architecture.

**Definition:**

</details>

<details>
<summary>Explain how caching interacts with serverless computing models.</summary>

### Explain how caching interacts with serverless computing models.

**Definition:**

</details>

<details>
<summary>Describe cache compression techniques and their trade-offs.</summary>

### Describe cache compression techniques and their trade-offs.

**Definition:**

</details>

<details>
<summary>How does machine learning influence caching strategies?</summary>

### How does machine learning influence caching strategies?

**Definition:**

</details>

<details>
<summary>Discuss the role of caching in IoT (Internet of Things) applications.</summary>

### Discuss the role of caching in IoT (Internet of Things) applications.

**Definition:**

</details>

### Caching Tools and Technologies

<details>
<summary>What are some popular caching systems and their key features?</summary>

### What are some popular caching systems and their key features?

**Definition:**

</details>

<details>
<summary>How do you configure cache settings in a web server (e.g., Nginx, Apache)?</summary>

### How do you configure cache settings in a web server (e.g., Nginx, Apache)?

**Definition:**

</details>

<details>
<summary>Explain the role of HTTP headers in web caching.</summary>

### Explain the role of HTTP headers in web caching.

**Definition:**

</details>

<details>
<summary>How do caching mechanisms differ across various programming languages?</summary>

### How do caching mechanisms differ across various programming languages?

**Definition:**

</details>

<details>
<summary>Describe the use of caching in mobile application development.</summary>

### Describe the use of caching in mobile application development.

**Definition:**

</details>

<details>
<summary>What tools are available for monitoring and analyzing cache performance?</summary>

### What tools are available for monitoring and analyzing cache performance?

**Definition:**

</details>

<details>
<summary>Explain the integration of caching in cloud computing services.</summary>

### Explain the integration of caching in cloud computing services.

**Definition:**

</details>

<details>
<summary>How does caching work in content management systems (CMS)?</summary>

### How does caching work in content management systems (CMS)?

**Definition:**

</details>

<details>
<summary>What are the considerations for caching in a serverless architecture?</summary>

### What are the considerations for caching in a serverless architecture?

**Definition:**

</details>

<details>
<summary>Name some caching strategies in big data processing and analytics.</summary>

### Name some caching strategies in big data processing and analytics.

**Definition:**

</details>
