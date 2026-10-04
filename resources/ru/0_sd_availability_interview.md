# Availability & Reliability — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Availability & Reliability — собеседование](./0_sd_availability_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Availability & Reliability](https://devinterview.io/questions/software-architecture-and-system-design/availability-and-reliability-interview-questions/).

### Availability & Reliability Fundamentals

<details>
<summary>What is the difference between availability and reliability in the context of a software system?</summary>

### What is the difference between availability and reliability in the context of a software system?

**Definition:**

Доступность — доля времени, когда система может ответить. Надёжность — насколько вероятно, что она проработает отрезок без сбоя.

**How it works:**

- Доступность — процент за окно: время работы, делённое на окно.
- Надёжность — вероятность успешной работы на интервале, её часто сводят к тому, как долго система живёт между сбоями.
- Система может быть надёжной и всё же выглядеть недоступной, если ремонт долгий.
- Систему могут быстро поднимать, и доступность остаётся высокой, хотя падает она часто.

**Examples:**

15 минут простоя в часе — это 75% доступности за этот час. Надёжность спрашивает другое: как часто такие простои случаются за месяцы, а не насколько тёмным был этот час.
</details>

<details>
<summary>How do you define system availability and what are the key components to measure it?</summary>

### How do you define system availability and what are the key components to measure it?

**Definition:**

Доступность системы — доля времени, когда она работает и может делать свою работу. Обычная оценка — среднее время между сбоями, делённое на это время плюс среднее время ремонта.

**How it works:**

- MTBF — среднее время работы между сбоями.
- MTTR — среднее время от обнаружения сбоя до восстановления сервиса.
- Доступность ≈ MTBF / (MTBF + MTTR). Рост MTBF или сокращение MTTR оба поднимают число.
- Мерить нужно за согласованное окно и считать только сбои, которые чувствуют пользователи, иначе процент будут оспаривать.

**Examples:**

MTBF 100 часов и MTTR 2 часа дают 100 / 102 ≈ 98,0% доступности. Сокращение ремонта до 30 минут поднимает её примерно до 99,5%, не делая детали долговечнее.
</details>

<details>
<summary>Can you explain the concept of “Five Nines” and how it relates to system availability?</summary>

### Can you explain the concept of “Five Nines” and how it relates to system availability?

**Definition:**

Пять девяток — это 99,999% доступности: около 5,26 минуты простоя в год. Это цель по тому, как мало сервис может быть тёмным, а не заявление, что ничего не ломается.

**How it works:**

- 90% — около 36,5 суток простоя в год. 99% — около 3,65 суток. 99,9% — около 8,8 часа.
- 99,99% — около 53 минут. 99,999% — около 5,3 минуты. 99,9999% — около половины минуты.
- Каждая лишняя девятка стоит избыточности, автоматизации и дисциплины эксплуатации, а не более быстрого сервера.
- Запасные части, больше одной площадки, проверки здоровья и автоматический failover делают цель правдоподобной.
- Плановое обслуживание считается, если его нельзя провести, не останавливая сервис.
</details>

<details>
<summary>How does redundancy contribute to the reliability of a system?</summary>

### How does redundancy contribute to the reliability of a system?

**Definition:**

Избыточность держит запас готовым, чтобы одна сломанная часть не остановила сервис. Надёжность растёт, потому что система может потерять компонент и продолжить.

**How it works:**

- Избыточность компонента зеркалирует диск, блок питания или сетевой путь. RAID-1 держит вторую копию блоков.
- Избыточность подсистемы дублирует целый ярус, например два ввода питания или два пула приложений.
- Информационная избыточность копирует сами данные, репликацией или кодами коррекции, чтобы потеря одной копии не была потерей данных.
- Failover — переключение на запас. Балансировка — как трафик обходит плохой путь.
- Кворум, например два из трёх узлов, использует лишние копии, чтобы решить, а не просто простаивать.

**Examples:**

Два диска в RAID-1: любой может отказать, и чтения всё ещё идут со второго. Один диск — единая точка отказа.
</details>

<details>
<summary>What is a single point of failure (SPOF), and how can it be mitigated?</summary>

### What is a single point of failure (SPOF), and how can it be mitigated?

**Definition:**

Единая точка отказа — любая часть, чья смерть роняет весь сервис. Смягчение — второй путь плюс способ на него переключиться.

**How it works:**

- Одинокий коммутатор, одинокий веб-сервер или одинокий блок питания — обычные примеры.
- Добавляют запас и failover, который уводит трафик, когда проверки здоровья падают.
- Ставят больше одного сервера за балансировщик и сам балансировщик делают парой.
- Обслуживание и записанный план восстановления снижают шанс, что запас устарел или никто не знает, как им пользоваться.
- Failover репетируют. Запас, на который ни разу не переключались, — надежда, а не смягчение.

**Examples:**

Один primary базы без реплики: диск primary умирает, и сайт лежит. Синхронная реплика плюс поднимаемый standby убирает эту единую точку.
</details>

<details>
<summary>Discuss the significance of Mean Time Between Failures (MTBF) in reliability engineering.</summary>

### Discuss the significance of Mean Time Between Failures (MTBF) in reliability engineering.

**Definition:**

MTBF — среднее время работы между сбоями. Большее число значит, что компонент или система отказывают реже, и это сторона надёжности в формуле доступности.

**How it works:**

- Это суммарное время работы, делённое на число сбоев за это время.
- Планировщики используют его, чтобы назначать замену и решать, сколько запаса держать до вероятного следующего сбоя.
- Простая цифра предполагает примерно постоянную интенсивность отказов. Износ и ранние отказы этому не следуют.
- Число зависит от нагрузки, температуры и того, как деталь используют. MTBF из паспорта — не ваш продакшен-MTBF.
- Производители дисков публикуют MTBF, чтобы оценить замену. Проектировщики смотрят, хватит ли одной копии или нужна пара.

**Examples:**

Два сбоя за 1 000 часов работы — MTBF 500 часов. Это не говорит, что следующий сбой будет на 500-м часе. Это говорит, что средний промежуток на длинной дистанции — 500 часов.
</details>

<details>
<summary>What is the role of Mean Time to Repair (MTTR) in maintaining system availability?</summary>

### What is the role of Mean Time to Repair (MTTR) in maintaining system availability?

**Definition:**

MTTR — среднее время от обнаружения сбоя до восстановления сервиса. Доступность растёт, когда этот интервал сжимается, даже если сбои остаются столь же частыми.

**How it works:**

- Часы идут с обнаружения, а не с момента, когда кто-то начал печатать исправление. Медленные алерты раздувают MTTR.
- Сюда входят диагностика, ремонт или failover и проверка, что сервис действительно вернулся.
- В паре с MTBF: доступность ≈ MTBF / (MTBF + MTTR).
- Автоматизация, runbook и тёплый запас режут MTTR дешевле, чем бессмертие каждой детали.

**Examples:**

База, которая падает дважды в месяц (MTBF около 360 часов), с ручным восстановлением в 4 часа близка к 99% доступности. Те же сбои с failover за 5 минут — около 99,98%.
</details>

<details>
<summary>Can you differentiate between high availability (HA) and fault tolerance (FT)?</summary>

### Can you differentiate between high availability (HA) and fault tolerance (FT)?

**Definition:**

Высокая доступность минимизирует простой failover, и короткая пауза допустима. Отказоустойчивость сохраняет корректность сервиса сквозь отказ компонента, без видимого перерыва.

**How it works:**

- HA замечает плохой узел и уводит трафик. Пользователь может увидеть повтор или несколько секунд ошибок.
- FT держит запасные части так, что отказ маскируется. Запас уже в шаге, а не ждёт загрузки.
- Оба используют лишние копии. HA оптимизирует время восстановления. FT оптимизирует непрерывную корректность.
- Балансировщик, снимающий мёртвый веб-сервер, — это HA. Пара в lockstep, которая продолжает транзакцию, когда умирает один CPU, — это FT.
- Данные для HA часто реплицируют, чтобы другой узел мог обслужить. Данные для FT держат достаточно согласованными, чтобы выживший путь не отдал порванную запись.

**Examples:**

Веб-ярус теряет одну машину, и балансировщик шлёт следующий запрос в другое место: высокая доступность. Массив, который заканчивает запись на зеркале, и клиент не видит ошибки: отказоустойчивость.
</details>

### Designing for Availability

<details>
<summary>How would you architect a system for high availability?</summary>

### How would you architect a system for high availability?

**Definition:**

Для высокой доступности убирают единые точки, быстро замечают отказ и переключаются без человека на пути.

**How it works:**

- Ставят избыточный балансировщик перед несколькими экземплярами приложения и реплицируют базу.
- Active-active, когда обе стороны могут обслуживать, или active-passive, когда хватает одного тёплого standby.
- Проверки здоровья и автомасштабирование заменяют мёртвые или перегруженные экземпляры.
- Вторая площадка закрывает потерю целого дата-центра. Решают, какой согласованностью пожертвуют во время разрыва.
- Кэш и CDN снимают чтение с origin, чтобы всплеск не стал аварией.
- Правила резидентности данных учитывают, если второму региону нельзя хранить данные.

**Examples:**

```text
клиенты -> anycast / DNS
        -> пара балансировщиков
        -> экземпляры приложения в двух зонах
        -> primary базы + реплика
```
</details>

<details>
<summary>What design patterns are commonly used to improve system availability?</summary>

### What design patterns are commonly used to improve system availability?

**Definition:**

Паттерны доступности в основном про запас, быстрое обнаружение и про то, чтобы одна упавшая зависимость не остановила всех.

**How it works:**

- Избыточность и failover держат второй экземпляр готовым. Балансировщик размазывает работу и пропускает нездоровые цели.
- Circuit breaker падает быстро, когда зависимость лежит, и вызывающие остаются живы.
- Bulkhead изолирует пулы, чтобы одна медленная зависимость не съела все потоки.
- Повторы с backoff закрывают короткий сбой. Очередь принимает всплеск, который сервис не может обработать сразу.
- Проверки здоровья и выбор лидера решают, кому можно обслуживать.
- Процесс-одиночка или пул объектов могут ограничить расход ресурсов, и доступности они помогают, только если потеря этого одного процесса сама не является аварией.
</details>

<details>
<summary>How can load balancing improve system availability, and what are some of its potential pitfalls?</summary>

### How can load balancing improve system availability, and what are some of its potential pitfalls?

**Definition:**

Балансировщик размазывает запросы по здоровым экземплярам, чтобы один перегруженный или мёртвый сервер не уронил сервис. Сам балансировщик может стать аварией, если он один.

**How it works:**

- Round-robin идёт по целям по кругу. Least-connections предпочитает простаивающий. Хеш от личности клиента держит пользователя на одном сервере.
- Проверки здоровья позволяют перестать слать работу цели, которая не проходит пробу.
- Липкие сессии помогают приложениям, которые держат состояние в памяти, и вредят, когда этот сервер умирает: сессия умирает с ним.
- Добавление экземпляров — способ масштабироваться, пока балансировщик и база выдерживают лишний fan-in.
- Один балансировщик — единая точка отказа. Ставят пару.
- Балансировщик 7-го уровня может маршрутизировать по URL и терминирует TLS, поэтому ошибка сертификата или конфига становится общесайтовой.

**Examples:**

```text
запрос 1 -> app-a
запрос 2 -> app-b
запрос 3 -> app-c
app-b не проходит health -> следующие запросы обходят app-b
```
</details>

<details>
<summary>Explain the role of health checks in maintaining an available system.</summary>

### Explain the role of health checks in maintaining an available system.

**Definition:**

Проверка здоровья — повторный зонд, который решает, должен ли экземпляр получать трафик. Так failover случается раньше, чем сбой найдут пользователи.

**How it works:**

- Поверхностная проверка бьёт в HTTP-endpoint и ждёт успешный статус. Она доказывает, что процесс слушает.
- Глубокая проверка ещё открывает базу, очередь или нижестоящий сервис, без которого экземпляр не может обслужить.
- CPU, память и диск говорят, что машина жива, но слишком больна, чтобы быть полезной.
- Балансировщик, оркестратор или mesh по результату выводит экземпляр и, когда тот оправился, возвращает.
- Проверка, которая всегда возвращает успех, прячет аварию. Проверка, зависящая от дёрганого downstream, будет дёргать весь ярус.

**Examples:**

GET /health возвращает 200, только если процесс может выполнить SELECT 1. Балансировщик снимает экземпляр, который упал два раза подряд.
</details>

<details>
<summary>What is the purpose of a circuit breaker pattern in a distributed system?</summary>

### What is the purpose of a circuit breaker pattern in a distributed system?

**Definition:**

Circuit breaker бережёт доступность, отказываясь ждать зависимость, которая уже падает. Вызывающие падают быстро или берут запасной ответ, а у зависимости появляется место восстановиться.

**How it works:**

- Closed: вызовы проходят, ошибки считают.
- Open: вызовы не уходят. Задержка низкая, потому что никто не ждёт таймаут.
- Half-open: пробный вызов проверяет, вернулась ли зависимость.
- Это ограничивает каскадный сбой. Потоки, которые зависли бы на мёртвом сервисе, свободны для работы, которая ещё может пройти.
- Пользователь получает быстрый урезанный ответ вместо зависшей страницы.

**Examples:**

Рекомендации уходят в таймаут. Страница товара размыкает цепь и рисуется без этого блока, вместо того чтобы держать ответ 30 секунд.
</details>

### Monitoring & Incident Response

<details>
<summary>What are some key indicators you would monitor to ensure system reliability?</summary>

### What are some key indicators you would monitor to ensure system reliability?

**Definition:**

Надёжность видна в том, как часто система падает, как быстро отвечает и целы ли данные и машина под ними.

**How it works:**

- Показатели доступности: uptime, MTBF и MTTR.
- Производительность: задержка и пропускная способность. Система, которая «жива», но слишком медленна, уже подвела пользователей.
- Ошибки: частота отказов и то, локализован сбой или расползается.
- Данные: успех резервных копий и совпадают ли ещё реплики.
- Сеть: потери, задержка и насыщение.
- Помещение и питание: температура и подача, потому что тепловой отбой выглядит как программная авария.
- Контроли безопасности важны, когда отказ — это взлом, но они не заменяют сигналы доступности.

**Examples:**

Алерт, когда доля ошибок выше 1% пять минут, когда p99 задержки удваивается или когда последняя успешная копия старше суток.
</details>

<details>
<summary>How do you implement a monitoring system that accurately reflects system availability?</summary>

### How do you implement a monitoring system that accurately reflects system availability?

**Definition:**

Доступность меряют так, как её чувствует пользователь: зонд, который делает настоящее действие, снаружи кластера, и алерт по этому сигналу.

**How it works:**

- Синтетические проверки из более чем одной сети бьют в публичный endpoint и пишут успех или провал.
- Внутри кластера проверки здоровья, насыщение и доля ошибок объясняют, почему внешний зонд упал.
- Простой считают с точки зрения пользователя. Процесс, который жив, пока балансировщик его снял, недоступен.
- Будят по симптомам, которые значат, что пользователи не могут закончить дело, а не по каждому дёрганью CPU.
- Историю хранят, чтобы посчитать девятки за месяц, а не гадать по скриншоту дашборда.

**Examples:**

Проверка каждую минуту логинится и открывает страницу счёта снаружи дата-центра. Минуты с провалом — это простой, который вы сообщаете. Внутренние графики CPU объясняют причину, они не определяют аварию.
</details>

<details>
<summary>Discuss the importance of alerting and on-call rotations in maintaining system reliability.</summary>

### Discuss the importance of alerting and on-call rotations in maintaining system reliability.

**Definition:**

</details>

<details>
<summary>What steps would you take to respond to an incident that reduces system availability?</summary>

### What steps would you take to respond to an incident that reduces system availability?

**Definition:**

</details>

<details>
<summary>How can post-mortem analysis improve future system reliability and availability?</summary>

### How can post-mortem analysis improve future system reliability and availability?

**Definition:**

</details>

### Scaling & Performance

<details>
<summary>How does system scalability impact availability?</summary>

### How does system scalability impact availability?

**Definition:**

</details>

<details>
<summary>What strategies can be employed to scale a system while maintaining or improving reliability?</summary>

### What strategies can be employed to scale a system while maintaining or improving reliability?

**Definition:**

</details>

<details>
<summary>Describe how caching can affect system reliability and what are some trade-offs.</summary>

### Describe how caching can affect system reliability and what are some trade-offs.

**Definition:**

</details>

<details>
<summary>Explain the role of rate limiting in preserving system availability.</summary>

### Explain the role of rate limiting in preserving system availability.

**Definition:**

</details>

### Reliability in Distributed Systems

<details>
<summary>How do eventual consistency and strong consistency differ and what are the reliability implications?</summary>

### How do eventual consistency and strong consistency differ and what are the reliability implications?

**Definition:**

</details>

<details>
<summary>Describe the CAP theorem and its relevance to system availability.</summary>

### Describe the CAP theorem and its relevance to system availability.

**Definition:**

</details>

<details>
<summary>Can you discuss how quorum-based decision making in distributed systems affects reliability?</summary>

### Can you discuss how quorum-based decision making in distributed systems affects reliability?

**Definition:**

</details>

<details>
<summary>What is the role of distributed transactions in reliability, and what are the challenges associated with them?</summary>

### What is the role of distributed transactions in reliability, and what are the challenges associated with them?

**Definition:**

</details>

### Recovery Strategies

<details>
<summary>What is a disaster recovery plan and how does it relate to reliability?</summary>

### What is a disaster recovery plan and how does it relate to reliability?

**Definition:**

</details>

<details>
<summary>How do backup and restore operations impact system availability?</summary>

### How do backup and restore operations impact system availability?

**Definition:**

</details>

<details>
<summary>Discuss the importance and challenges of data replication in a highly available system.</summary>

### Discuss the importance and challenges of data replication in a highly available system.

**Definition:**

</details>

<details>
<summary>Explain how you would plan for a failover strategy in a multi-region deployment to ensure reliability.</summary>

### Explain how you would plan for a failover strategy in a multi-region deployment to ensure reliability.

**Definition:**

</details>
