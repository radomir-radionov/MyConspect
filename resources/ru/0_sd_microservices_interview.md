# Microservices — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Microservices — собеседование](./0_sd_microservices_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Microservices](https://devinterview.io/questions/software-architecture-and-system-design/microservices-interview-questions/).

### Microservices Fundamentals

<details>
<summary>What is a microservice and how does it differ from a monolithic architecture?</summary>

### What is a microservice and how does it differ from a monolithic architecture?

**Definition:**

Микросервис — один развёртываемый процесс, который владеет одной бизнес-возможностью и её данными. Монолит держит эти возможности в одной программе, одном релизе и обычно одной базе.

**How it works:**

- Монолит — одна кодовая база и одна единица поставки. Модули вызывают друг друга внутри процесса.
- Микросервис — отдельный процесс, его выпускают отдельно, он говорит по HTTP, gRPC или через брокер.
- У монолита обычно одна база. У каждого сервиса может быть своё хранилище.
- Масштаб монолита — копия всего приложения. Сервис масштабируют отдельно.
- Монолит обычно сидит на одном стеке. Сервисы могут брать разные языки и хранилища.
- Небольшой монолит может вести одна команда. Большую систему часто делят: одна команда — один сервис.
- Разрез окупается, когда возможности масштабируются по-разному, команды хотят выпускаться независимо или одной функции нужен другой инструмент. Цена — сеть и операционная поверхность.

**Examples:**

```text
монолит:   checkout + inventory + mail  ->  один процесс, одна база
сервисы:   checkout -> orders-db
           inventory -> stock-db
           mail      -> очередь
```
</details>

<details>
<summary>Can you describe the principles behind the microservices architecture?</summary>

### Can you describe the principles behind the microservices architecture?

**Definition:**

Микросервисы собирают приложение из небольших сервисов: каждый вокруг одной бизнес-возможности, у одной команды, со своим релизом.

**How it works:**

- У сервиса свои код, данные и runtime. Таблицами с соседями он не делится.
- Граница идёт по бизнес-возможности, и опубликованный API — единственное, от чего зависят снаружи.
- Команда владеет сервисом от сборки до продакшена. Отсюда связь с DevOps: собрал — сопровождаешь.
- Сбой ожидаем. Таймауты, переборки и урезанное поведение — часть схемы, а не запоздалая заплатка.
- Управление лёгкое. Команда берёт подходящий стек, пока контракт стабилен.
- Сборка, выкладка и конфиг автоматизированы, изменения приходят маленькими релизами, а не редкими большими.
- Сервисы находимы через описанный API или реестр, вызывающим не нужно зашивать адреса.
- Форма команд следует сервисам. Закон Конвея объясняет, почему несовпадающая оргструктура воюет с архитектурой.

**Examples:**

```text
POST /loans
  сервис проверки кредита решает, можно ли выдать
  этот сервис только возвращает одобрено или отказано
  базу проверки кредита он не делит
```
</details>

<details>
<summary>What are the main benefits of using microservices?</summary>

### What are the main benefits of using microservices?

**Definition:**

Польза микросервисов в том, что одна возможность может меняться, масштабироваться и падать, не таща за собой всю систему.

**How it works:**

- Горячий сервис масштабируют отдельно, а не копируют каждый модуль.
- Сбой чаще остаётся внутри одного процесса, остальные продолжают отвечать.
- Команды выпускаются в своём ритме, путь от правки до продакшена короче.
- Сервис может взять язык и хранилище, которые подходят его задаче.
- Меньшую кодовую базу одной команде проще понимать и безопасно менять.
- Политику безопасности можно ужесточить на сервисе с чувствительными данными и ослабить на том, где их нет.
- Эти выигрыши появляются только когда границы и эксплуатация действительно независимы.
</details>

<details>
<summary>What are some of the challenges you might face when designing a microservices architecture?</summary>

### What are some of the challenges you might face when designing a microservices architecture?

**Definition:**

Разрез системы на сервисы заменяет вызовы внутри процесса сетью, а одну базу — многими владельцами. Большая часть боли идёт из этих двух фактов.

**How it works:**

- Свои данные у каждого сервиса делают межсервисные запросы и атомарные обновления трудными. Обычно получается eventual consistency.
- Синхронные цепочки связывают доступность: медленный вызываемый тормозит вызывающего. Поиск и маршрутизация сложнее с ростом числа сервисов.
- Авторизация, таймауты и политики должны быть согласованы во многих кодовых базах, иначе они разъедутся.
- Больше процессов — больше выкладок, больше конфига и мониторинг, который должен провести один запрос через сервисы.
- Бизнес-действие на нескольких сервисах уже не одна локальная транзакция.
- Интеграционные тесты дороги, а версионированные API должны оставлять старых клиентов рабочими.
- Команды без общей картины предметной области нарисуют границы, которые не совпадают с бизнесом.

**Examples:**

Оформление заказа, которое пишет заказ, склад и платёж в три базы, нельзя завернуть в один commit. Неудачное резервирование склада приходится отменять компенсирующим шагом, а не откатом базы.
</details>

<details>
<summary>How do microservices communicate with each other?</summary>

### How do microservices communicate with each other?

**Definition:**

Сервисы общаются либо вызовом, который ждёт ответ, либо сообщением, которого отправитель не ждёт. Выбор — про связность и задержку, а не про любимый протокол.

**How it works:**

- Синхронные HTTP или gRPC подходят, когда результат нужен сейчас. Вызывающий связан с доступностью вызываемого.
- Очередь или событие подходят, когда работу можно закончить позже. Отправитель жив, если получатель лежит, а брокер гасит всплески.
- Журнал или поток подходят для непрерывного большого потока, например цен или кликов.
- REST легко отлаживать и переносить. gRPC со схемой быстрее и раньше ловит несовпадение типов, браузеру он менее удобен.
- Шлюз или mesh могут добавить маршрутизацию, авторизацию и телеметрию. Решение sync против async они не меняют.

**Examples:**

```text
sync:  checkout --HTTP--> inventory  (ждёт "reserved")
async: checkout --OrderPlaced--> брокер --> почта, аналитика
```
</details>

<details>
<summary>What is Domain-Driven Design (DDD) and how is it related to microservices?</summary>

### What is Domain-Driven Design (DDD) and how is it related to microservices?

**Definition:**

Domain-Driven Design моделирует бизнес как ограниченные контексты, у каждого свой язык и свои правила. Микросервис часто совпадает с одним контекстом, чтобы модель менялась без общей корпоративной схемы.

**How it works:**

- Ограниченный контекст — край, внутри которого слово и модель значат одно.
- Одно слово, например customer, может быть лидом в продажах и счётом в биллинге. Такой раскол разрешён.
- Внутри контекста команда держит модель согласованной, часто в своей реляционной базе.
- Снаружи другие сервисы видят только API или события предметной области, не таблицы.
- Единый язык разработчиков и экспертов предметной области удерживает код и бизнес на одних и тех же словах.

**Examples:**

Продажи хранят лид со скорингом. Биллинг хранит счёт с балансом. Общей таблицы Customer у них нет. Когда лид конвертируется, продажи публикуют LeadConverted, и биллинг создаёт счёт.
</details>

<details>
<summary>How would you decompose a monolithic application into microservices?</summary>

### How would you decompose a monolithic application into microservices?

**Definition:**

Режут по бизнес-возможностям и по словам, которые люди уже используют, и выносят по одному срезу, пока монолит ещё обслуживает остальное.

**How it works:**

- Ищут возможность, чьи данные и правила меняются вместе. Это кандидат в сервис, а не технический слой вроде «все контроллеры».
- Срезу дают свой API и выносят его таблицы из общей базы.
- На новый сервис направляют только эту возможность. Подход strangler оставляет монолит работающим.
- Межсервисных вызовов оставляют мало. Если два среза переговариваются на каждый запрос, граница, скорее всего, неверная.
- Повторяют. Не переписывают всю систему, пока у первого среза нет настоящего владельца и настоящей выкладки.

**Examples:**

```text
монолит всё ещё обслуживает каталог и checkout
новый сервис владеет только тарифами и наклейками доставки
трафик /shipping идёт в новый сервис
```
</details>

<details>
<summary>What strategies can be employed to manage transactions across multiple microservices?</summary>

### What strategies can be employed to manage transactions across multiple microservices?

**Definition:**

Транзакцию оставляют внутри одного сервиса, когда бизнес-правило туда помещается. Когда должны сотрудничать несколько сервисов, координируют локальные commit, а не одну глобальную блокировку.

**How it works:**

- Двухфазный commit просит каждого участника подготовиться, затем зафиксировать. Глобальный исход он ещё может согласовать, но блокирует участников и плох как режим по умолчанию.
- Трёхфазный вариант добавляет pre-commit, чтобы меньше блокировать, и для вызовов сервисов он всё ещё тяжёлый.
- Saga проводит локальную транзакцию в каждом сервисе и компенсирующее действие, если поздний шаг падает.
- Transactional outbox пишет бизнес-изменение и исходящее сообщение в одном локальном commit, затем реле публикует сообщение.
- Если контексты нарисованы так, что правило живёт в одном сервисе, распределённая транзакция исчезает.
- CQRS и event sourcing помогают, когда модель записи — последовательность фактов, а модель чтения может отставать.

**Examples:**

Снять оплату, затем зарезервировать склад. Если склад не удался — вернуть оплату. Это saga. Сервис оплаты не откатывает базу склада.
</details>

<details>
<summary>Explain the concept of ‘Bounded Context’ in the microservices architecture.</summary>

### Explain the concept of ‘Bounded Context’ in the microservices architecture.

**Definition:**

Ограниченный контекст — граница, внутри которой модель и словарь значат одно. Микросервис обычно реализует один контекст и прячет остальное.

**How it works:**

- Команда и эксперты предметной области делят один язык внутри границы. То же слово за стеной может значить другое.
- Согласованность и транзакции остаются локальными. Данные уходят только через API или событие.
- У контекста обычно своя кодовая база, поэтому другая команда не может залезть и поменять модель.
- Связи между контекстами явные: один поставляет, другой подстраивается, либо между ними стоит слой перевода.

**Examples:**

В продажах лид — человек, который может купить. В поддержке тот же человек — контакт тикета. Два контекста, две модели, два сервиса. Они стыкуются событиями, а не общей таблицей Lead.
</details>

<details>
<summary>How do you handle failure in a microservice?</summary>

### How do you handle failure in a microservice?

**Definition:**

Сбой считают нормальным. Сломанную зависимость изолируют, повторяют только безопасное и оставляют меньшее полезное поведение, когда полное недоступно.

**How it works:**

- Circuit breaker перестаёт звать зависимость, которая уже падает, и пробует её позже.
- Bulkhead даёт каждой зависимости свой пул, чтобы застрявший вызываемый не исчерпал все потоки.
- Повторы имеют предел и backoff. Повтор нес-идемпотентного списания — способ списать дважды.
- Очередь отвязывает медленного потребителя. Health check выводит больной экземпляр из ротации.
- Кэш или урезанный ответ закрывает чтение, когда источник лежит. Шардирование не даёт падению одной базы унести все ключи.
- API версионируют, чтобы старый клиент работал, пока новый экземпляр болен.
- Автомасштабирование закрывает нагрузку, не баг логики. Алертят по симптомам и деградируют намеренно, а не вешают пользователя на таймауте.

**Examples:**

Склад начинает возвращать ошибки. Checkout размыкает цепь, перестаёт ждать и принимает заказ как «резерв ожидается», вместо того чтобы уронить всю страницу.
</details>

### Design Patterns and Best Practices

<details>
<summary>What design patterns are commonly used in microservices architectures?</summary>

### What design patterns are commonly used in microservices architectures?

**Definition:**

Паттерны, которые встречаются чаще всего, — про край, сбой, владение данными и то, как изменение доходит до продакшена.

**How it works:**

- API gateway — одна дверь для клиентов. Реестр и discovery позволяют сервисам находить друг друга, когда экземпляры появляются и исчезают.
- Circuit breaker и bulkhead не дают одному сбою утянуть вызывающих.
- База на сервис держит владение ясным. Saga координирует работу нескольких сервисов. Outbox публикует события, не теряя их.
- Event sourcing хранит факты, а не только последнюю строку. Cache-aside даёт сервису заполнить кэш при промахе.
- Strangler fig заменяет монолит по одному маршруту. Blue-green и canary переключают трафик. A/B сравнивает два поведения на срезе пользователей.

**Examples:**

Клиенты зовут только шлюз. Шлюз находит склад в реестре, и breaker оборачивает этот вызов. Склад никогда не читает базу заказов.
</details>

<details>
<summary>Can you describe the API Gateway pattern and its benefits?</summary>

### Can you describe the API Gateway pattern and its benefits?

**Definition:**

API gateway — единственный вход со стороны клиента: он маршрутизирует, формирует и защищает вызовы к сервисам позади.

**How it works:**

- Один клиентский вызов он может разложить на несколько вызовов сервисов и собрать один ответ.
- Он кэширует горячие чтения, аутентифицирует вызывающего и применяет лимит частоты до того, как трафик дойдёт до сервисов.
- Он может балансировать нагрузку и узнавать, какой экземпляр жив.
- Клиенты знают один хост и одну форму. Сервисы за шлюзом могут говорить разными протоколами.
- Сбой можно превратить в запасной ответ на краю, а не каскадом к клиенту.
- Логи и метрики на шлюзе показывают систему глазами клиента.
- Сам шлюз должен быть избыточным, иначе он становится аварией.

**Examples:**

Домашний экран телефона хочет профиль, число позиций в корзине и рекомендации. Приложение один раз зовёт GET /home. Шлюз зовёт три сервиса и возвращает один JSON.
</details>

<details>
<summary>Explain the ‘Circuit Breaker’ pattern. Why is it important in a microservices ecosystem?</summary>

### Explain the ‘Circuit Breaker’ pattern. Why is it important in a microservices ecosystem?

**Definition:**

Circuit breaker не даёт вызывающему долбить зависимость, которая уже падает, и пробует её снова только после паузы.

**How it works:**

- Closed — вызовы проходят. Сбои считают.
- Open — вызовы падают сразу или идут в запасной ответ. У зависимости есть время восстановиться.
- Half-open пропускает несколько пробных вызовов. Успех замыкает цепь. Сбой снова размыкает.
- Пороги — подряд идущие ошибки, доля ошибок или таймауты, а не один сбой.
- Без этого потоки копятся на мёртвом сервисе, и падает уже вызывающий.

**Examples:**

```text
closed -> 5 таймаутов -> open на 30 с
half-open -> один успех -> closed
half-open -> таймаут -> снова open
```
</details>

<details>
<summary>What is a ‘Service Mesh’? How does it aid in managing microservices?</summary>

### What is a ‘Service Mesh’? How does it aid in managing microservices?

**Definition:**

Service mesh — отдельный сетевой слой, обычно sidecar-прокси рядом с каждым сервисом, который ведёт трафик между сервисами, чтобы код приложения этого не делал.

**How it works:**

- Data plane — прокси, например Envoy, которые сидят рядом с каждым экземпляром и несут байты.
- Control plane, например Istio, раздаёт политику: маршруты, повторы и сертификаты.
- Взаимный TLS и идентичность дают шифрованные вызовы, и каждому сервису не нужно изобретать свою безопасность.
- Mesh проверяет здоровье соседей, балансирует по задержке или round-robin и может сдвинуть срез трафика для canary.
- Если экземпляр выглядит больным, прокси перестаёт слать ему работу.
- Метрики и трейсы идут с прокси, поэтому у каждого сервиса одна и та же телеметрия.

**Examples:**

Checkout не знает IP пода склада. Его sidecar шлёт вызов sidecar склада, тот один раз повторяет, пишет задержку и предъявляет сертификат.
</details>

<details>
<summary>How do you ensure data consistency across microservices?</summary>

### How do you ensure data consistency across microservices?

**Definition:**

Каждый сервис фиксирует свою базу, поэтому бизнес-действие через несколько сервисов обычно eventually consistent. Путь проектируют так, чтобы локальный commit и следующее за ним сообщение не могли разъехаться.

**How it works:**

- Синхронный вызов может выглядеть свежим, и это всё равно не атомарный commit двух баз. Он ещё и связывает доступность.
- Публикуют через outbox: изменение строки и вставка события фиксируются вместе, реле доставляет событие.
- Потребители применяют свою локальную транзакцию и должны быть безопасны к повторной доставке.
- Saga компенсирует, если поздний шаг падает. BASE — basically available, soft state, eventually consistent — обычное имя этой позиции.
- Во время разделения нельзя иметь линеаризуемое обновление нескольких сервисов и полную доступность. Выбирают, каким операциям можно отстать.

**Examples:**

```text
BEGIN;
  UPDATE orders SET status = 'placed' WHERE id = 9;
  INSERT INTO outbox (type, payload) VALUES ('OrderPlaced', '...');
COMMIT;
-- реле публикует OrderPlaced после commit
```
</details>

<details>
<summary>Discuss the strategies you would use for testing microservices.</summary>

### Discuss the strategies you would use for testing microservices.

**Definition:**

</details>

<details>
<summary>How can you prevent configuration drift in a microservices environment?</summary>

### How can you prevent configuration drift in a microservices environment?

**Definition:**

</details>

<details>
<summary>When should you use synchronous vs. asynchronous communication in microservices?</summary>

### When should you use synchronous vs. asynchronous communication in microservices?

**Definition:**

</details>

<details>
<summary>What role does containerization play in microservices?</summary>

### What role does containerization play in microservices?

**Definition:**

</details>

### Deployment and Operations

<details>
<summary>What are the challenges of deploying microservices?</summary>

### What are the challenges of deploying microservices?

**Definition:**

</details>

<details>
<summary>Describe blue-green deployment and how it applies to microservices.</summary>

### Describe blue-green deployment and how it applies to microservices.

**Definition:**

</details>

<details>
<summary>How does canary releasing work, and how is it beneficial for microservices deployments?</summary>

### How does canary releasing work, and how is it beneficial for microservices deployments?

**Definition:**

</details>

<details>
<summary>Explain the concept of ‘Infrastructure as Code’ and how it benefits microservices management.</summary>

### Explain the concept of ‘Infrastructure as Code’ and how it benefits microservices management.

**Definition:**

</details>

<details>
<summary>Describe what Continuous Integration/Continuous Deployment (CI/CD) pipelines look like for microservices.</summary>

### Describe what Continuous Integration/Continuous Deployment (CI/CD) pipelines look like for microservices.

**Definition:**

</details>

<details>
<summary>How do you monitor health and performance of microservices?</summary>

### How do you monitor health and performance of microservices?

**Definition:**

</details>

### Microservices and Data Management

<details>
<summary>How do you handle database schema changes in a microservice architecture?</summary>

### How do you handle database schema changes in a microservice architecture?

**Definition:**

</details>

<details>
<summary>Discuss the pros and cons of using a shared database vs. a database-per-service.</summary>

### Discuss the pros and cons of using a shared database vs. a database-per-service.

**Definition:**

</details>

<details>
<summary>Explain the concept of ‘Event Sourcing’ in the context of microservices.</summary>

### Explain the concept of ‘Event Sourcing’ in the context of microservices.

**Definition:**

</details>

<details>
<summary>What is Command Query Responsibility Segregation (CQRS) and how can it be applied to microservices?</summary>

### What is Command Query Responsibility Segregation (CQRS) and how can it be applied to microservices?

**Definition:**

</details>

<details>
<summary>Can you discuss strategies for dealing with data consistency without using distributed transactions?</summary>

### Can you discuss strategies for dealing with data consistency without using distributed transactions?

**Definition:**

</details>

### Security

<details>
<summary>How do you implement authentication and authorization in microservices?</summary>

### How do you implement authentication and authorization in microservices?

**Definition:**

</details>

<details>
<summary>What are some common security concerns when handling inter-service communication?</summary>

### What are some common security concerns when handling inter-service communication?

**Definition:**

</details>

<details>
<summary>Describe how you would use OAuth2 or JWT in a microservices architecture.</summary>

### Describe how you would use OAuth2 or JWT in a microservices architecture.

**Definition:**

</details>

<details>
<summary>What mechanisms would you implement to prevent or detect security breaches at the microservices level?</summary>

### What mechanisms would you implement to prevent or detect security breaches at the microservices level?

**Definition:**

</details>

<details>
<summary>How do you ensure that sensitive data is protected when using microservices?</summary>

### How do you ensure that sensitive data is protected when using microservices?

**Definition:**

</details>

### Scalability and Performance

<details>
<summary>How do you ensure that a microservice is scalable?</summary>

### How do you ensure that a microservice is scalable?

**Definition:**

</details>

<details>
<summary>What metrics would you monitor to assess a microservice’s performance?</summary>

### What metrics would you monitor to assess a microservice’s performance?

**Definition:**

</details>

<details>
<summary>Discuss strategies to handle high-load or peak traffic in a microservices architecture.</summary>

### Discuss strategies to handle high-load or peak traffic in a microservices architecture.

**Definition:**

</details>

<details>
<summary>How do Microservices handle load balancing?</summary>

### How do Microservices handle load balancing?

**Definition:**

</details>

<details>
<summary>In terms of performance, what would influence your decision to use a message broker vs direct service-to-service communication?</summary>

### In terms of performance, what would influence your decision to use a message broker vs direct service-to-service communication?

**Definition:**

</details>

### Inter-Process Communication

<details>
<summary>What are the advantages and drawbacks of using REST over gRPC in microservice communication?</summary>

### What are the advantages and drawbacks of using REST over gRPC in microservice communication?

**Definition:**

</details>

<details>
<summary>How would you implement versioning in microservices API?</summary>

### How would you implement versioning in microservices API?

**Definition:**

</details>

<details>
<summary>What are the challenges of network latency in microservices and how can they be mitigated?</summary>

### What are the challenges of network latency in microservices and how can they be mitigated?

**Definition:**

</details>

<details>
<summary>Explain the difference between message queues and event buses. In which scenarios would you use each?</summary>

### Explain the difference between message queues and event buses. In which scenarios would you use each?

**Definition:**

</details>

<details>
<summary>How can transactional outbox patterns be used in microservices?</summary>

### How can transactional outbox patterns be used in microservices?

**Definition:**

</details>

### Resiliency and Reliability

<details>
<summary>How would you design a microservice to be fault-tolerant?</summary>

### How would you design a microservice to be fault-tolerant?

**Definition:**

</details>

<details>
<summary>Discuss the importance of timeouts and retry logic in a microservices architecture.</summary>

### Discuss the importance of timeouts and retry logic in a microservices architecture.

**Definition:**

</details>

<details>
<summary>What strategies can be used to achieve high availability in microservices?</summary>

### What strategies can be used to achieve high availability in microservices?

**Definition:**

</details>

<details>
<summary>How do you approach disaster recovery in a microservices-based system?</summary>

### How do you approach disaster recovery in a microservices-based system?

**Definition:**

</details>

<details>
<summary>Explain how you would handle a cascading failure in a microservice ecosystem.</summary>

### Explain how you would handle a cascading failure in a microservice ecosystem.

**Definition:**

</details>

### Observability and Monitoring

<details>
<summary>What tools or practices would you recommend for logging in a distributed microservices system?</summary>

### What tools or practices would you recommend for logging in a distributed microservices system?

**Definition:**

</details>

<details>
<summary>How do you trace requests across boundaries of different microservices?</summary>

### How do you trace requests across boundaries of different microservices?

**Definition:**

</details>

<details>
<summary>Discuss the importance of metrics and alerts in maintaining a microservices architecture.</summary>

### Discuss the importance of metrics and alerts in maintaining a microservices architecture.

**Definition:**

</details>

<details>
<summary>How do you handle performance bottlenecks in microservices?</summary>

### How do you handle performance bottlenecks in microservices?

**Definition:**

</details>

<details>
<summary>What is distributed tracing and which tools help you accomplish it in a microservices setup?</summary>

### What is distributed tracing and which tools help you accomplish it in a microservices setup?

**Definition:**

</details>

### Containers and Orchestration

<details>
<summary>Explain the role of Docker in developing and deploying microservices.</summary>

### Explain the role of Docker in developing and deploying microservices.

**Definition:**

</details>

<details>
<summary>How do container orchestration tools like Kubernetes help with microservice deployment?</summary>

### How do container orchestration tools like Kubernetes help with microservice deployment?

**Definition:**

</details>

<details>
<summary>Describe the lifecycle of a container within a microservices architecture.</summary>

### Describe the lifecycle of a container within a microservices architecture.

**Definition:**

</details>

<details>
<summary>How do you ensure that containers are secure and up-to-date?</summary>

### How do you ensure that containers are secure and up-to-date?

**Definition:**

</details>

<details>
<summary>What are the best practices for container networking in the context of microservices?</summary>

### What are the best practices for container networking in the context of microservices?

**Definition:**

</details>
