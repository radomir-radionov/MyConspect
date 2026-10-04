# Layering & Middleware — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Layering & Middleware — собеседование](./0_sd_layering_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Layering & Middleware](https://devinterview.io/questions/software-architecture-and-system-design/layering-and-middleware-interview-questions/).

### Layering & Middleware Fundamentals

<details>
<summary>Can you explain what is meant by layering in the context of software architecture and its benefits?</summary>

### Can you explain what is meant by layering in the context of software architecture and its benefits?

**Definition:**

Слои группируют систему в уровни, у каждого своя ответственность и правило, какой уровень кого может вызывать.

**How it works:**

- Обычное деление: представление (пользователи и HTTP), бизнес-логика (правила) и доступ к данным (хранилище).
- Слой говорит с нижним через интерфейс. Он не лезет в таблицы или виджеты того слоя.
- Эту границу и тестируют, и заменяют: новый UI может оставить те же правила, новая база — те же сценарии.
- Модули остаются переиспользуемыми, потому что не привязаны ко всем остальным заботам.
- Когда слой медленный, масштабируют или кэшируют его, а не весь процесс.
- Цена — лишние переходы и соблазн протечь типами вверх, после чего граница ничего не значит.

**Examples:**

```text
OrderController  ->  OrderService  ->  OrderRepository  ->  database
```

Контроллер читает тело HTTP. Сервис решает, действителен ли заказ. Репозиторий пишет строки. Контроллер никогда не открывает SQL-соединение.
</details>

<details>
<summary>Describe the three typical layers you might find in a three-tiered application architecture and their responsibilities.</summary>

### Describe the three typical layers you might find in a three-tiered application architecture and their responsibilities.

**Definition:**

Трёхъярусное приложение отделяет интерфейс, бизнес-правила и хранимые данные, чтобы каждое можно было менять и масштабировать отдельно.

**How it works:**

- Представление обрабатывает ввод, отрисовку и лёгкие проверки вроде «это поле обязательно». Обычные инструменты — браузерный UI, мобильный клиент или шаблонизатор. Оно не решает цены и не пишет SQL.
- Ярус логики применяет правила: авторизацию, расчёты и шаги бизнес-процесса. Его обычно держат веб-фреймворки и серверы приложений.
- Ярус данных хранит и читает строки или документы, выполняет запросы и держит транзакции. Здесь живут базы и их драйверы.
- Каждый ярус может сидеть на своих машинах. UI масштабируется сессиями, логика — CPU, данные — диском и соединениями.
- «Три слоя в одном процессе» — то же деление ответственности. «Три яруса» подчёркивает, что разрез может быть ещё и границей процесса и сети.

**Examples:**

Страница оформления (представление) отправляет корзину в сервис заказов (логика). Тот пишет заказ через репозиторий (данные). Смена вёрстки не меняет правило налога, а смена базы не меняет страницу.
</details>

<details>
<summary>How does middleware facilitate decoupling of components in a system?</summary>

### How does middleware facilitate decoupling of components in a system?

**Definition:**

Middleware стоит между компонентами и берёт на себя общую работу по тому, как до них достучаться, поэтому вызывающие зависят от сообщения или запроса, а не от кода соседа.

**How it works:**

- Сообщения позволяют отправителю публиковать, не зная, какой процесс потребляет.
- Кэш стоит перед медленным компонентом, чтобы вызывающие не изобретали каждый свой.
- События отделяют «что-то случилось» от «кто реагирует».
- Балансировщик и переключение при сбое прячут, какой экземпляр жив.
- Пулы потоков и очереди поглощают всплески, чтобы медленный потребитель не останавливал производителя в процессе.
- Конвейер запроса добавляет аутентификацию один раз, а не внутри каждого обработчика.
- Итог — гибкость (заменить соседа), повторное использование (одна шина, много вызывающих), меньшая поверхность для эксплуатации и место, которое можно масштабировать наружу.

**Examples:**

Биллинг публикует `InvoiceIssued` в брокер. Почта и бухгалтерская книга каждая подписываются. Биллинг не импортирует ни один из модулей, и любой подписчик может лежать, не роняя вызов публикации исключением.
</details>

### Middleware Functions and Implementations

<details>
<summary>What are some common functionalities provided by middleware in a layered architecture?</summary>

### What are some common functionalities provided by middleware in a layered architecture?

**Definition:**

Middleware — общая машинерия слоистой системы, которую иначе копировали бы в каждый слой: соединения, транзакции, безопасность и доставка.

**How it works:**

- Вокруг данных: пулы соединений, заглушки удалённого вызова, репликация и кэш или преобразование результатов.
- Вокруг бизнес-потока: границы транзакций, оркестрация нескольких сервисов и доставка событий.
- На краю: аутентификация, авторизация и доставка контента или сжатие ответа.
- Сквозь слои: журналы, метрики, повторы и преобразование формата.
- В веб-стеке та же идея — цепочка функций вокруг обработчика: разобрать, аутентифицировать, затем вызвать следующий слой.
- Бизнес-слой по-прежнему владеет правилами. Middleware владеет механикой, как туда добраться.

**Examples:**

Один HTTP-конвейер проверяет сессию, открывает соединение из пула, выполняет сервис заказа внутри транзакции и пишет журнал доступа. Сервис заказа только считает сумму.
</details>

<details>
<summary>Give an example of a middleware solution that provides service orchestration.</summary>

### Give an example of a middleware solution that provides service orchestration.

**Definition:**

Middleware оркестрации выполняет бизнес-последовательность, вызывая несколько сервисов по порядку и решая, что делать с каждым результатом. Сервисы не вызывают друг друга.

**How it works:**

- Координатор получает один запрос и вызывает шаги: зарезервировать остаток, списать карту, затем создать отгрузку.
- Он передаёт выходы дальше и останавливается или компенсирует, когда шаг не удался.
- Шаговые сервисы остаются с одной целью. Поток живёт в координаторе: это может быть процесс, шина или небольшой конвейер в приложении.
- Порядок работы виден в одном месте. Координатор при этом должен оставаться тонким, иначе он станет вторым монолитом.

**Examples:**

```javascript
async function placeOrder(req, res, next) {
  const hold = await inventory.reserve(req.body.sku)
  const pay = await payments.charge(req.body.card, hold.amount)
  const order = await orders.create({ hold, pay })
  res.json(order)
}
```

Склад, платежи и заказы не знают последовательность. Её знает эта функция.
</details>

<details>
<summary>Explain the concept of a service layer and its purpose in a layered architecture.</summary>

### Explain the concept of a service layer and its purpose in a layered architecture.

**Definition:**

Слой сервисов — место сценариев использования. Он стоит между интерфейсом и кодом доступа к данным и является API, который вызывает остальное приложение.

**How it works:**

- Метод слоя сервисов — одна операция приложения: оформить заказ, а не «вставить строку» и не «нарисовать кнопку».
- Он применяет бизнес-правила, проверяет авторизацию этой операции и открывает транзакцию.
- Он вызывает репозитории или шлюзы за данными и к другим системам. Те остаются свободны от HTTP и от потока страниц.
- Контроллеры и обработчики сообщений остаются тонкими: перевести вход, вызвать один метод сервиса, перевести выход.
- Несколько интерфейсов (веб, очередь, CLI) могут делить один метод сервиса — ради этого повторного использования слой и существует.

**Examples:**

```text
POST /orders  ->  OrderController  ->  OrderService.place(cart)
                                      ->  InventoryGateway + OrderRepository
```

Ночная задача может вызвать `OrderService.place` без HTTP-стека.
</details>

<details>
<summary>Describe how middleware can support both synchronous and asynchronous communication patterns.</summary>

### Describe how middleware can support both synchronous and asynchronous communication patterns.

**Definition:**

Один и тот же ярус middleware может предложить вызов, который ждёт ответ, и передачу, которая возвращается до окончания работы.

**How it works:**

- Синхронное middleware пересылает запрос и держит вызывающего, пока не придёт ответ. Так работают RPC, HTTP-прокси и конвейеры запросов. Таймауты и предохранители принадлежат сюда, потому что вызывающий застрял.
- Асинхронное middleware принимает сообщение, подтверждает его и даёт другому рабочему его обработать. Так делают очереди и брокеры публикация-подписка. Отправитель не делит стек с получателем.
- Устойчивость на асинхронной стороне: брокер может хранить сообщение, пока потребитель не поднимется. Синхронная сторона падает, если сосед недоступен в момент вызова.
- Гибрид: край принимает HTTP-запрос (синхронно), пишет задачу в очередь (асинхронно) и возвращает `202`. Поздний вызов или обратный вызов доставляет результат.
- Синхронно — когда пользователь ждёт ответ. Асинхронно — когда работа может закончиться позже или разойтись многим слушателям.

**Examples:**

Оформление заказа вызывает платёжный прокси и ждёт. Та же платформа затем публикует `OrderPaid` для почты и аналитики, которые могут выполниться секундами позже.
</details>

### Middleware Types and Use Cases

<details>
<summary>How do Object Request Brokers (ORBs) differ from Message Oriented Middleware (MOM)?</summary>

### How do Object Request Brokers (ORBs) differ from Message Oriented Middleware (MOM)?

**Definition:**

Брокер объектных запросов делает удалённый вызов похожим на вызов локального метода. Message-oriented middleware переносит сообщения через брокер, и отправитель не ждёт стек получателя.

**How it works:**

- ORB (стиль CORBA) использует заглушки и скелеты. Клиент вызывает операцию, брокер находит объект, и ответ возвращается в том же вызове. Соседи говорят более прямо. Если цель лежит, вызов падает.
- MOM ставит между ними очередь или тему. Производители публикуют, потребители забирают, когда могут. Брокер может быть хабом. Сообщения могут лежать на диске, пока кто-то их не прочитает.
- Трафик ORB — в основном запрос и ответ. MOM естественно ложится на публикацию-подписку и очереди работ.
- MOM даёт устойчивость и выравнивание нагрузки. ORB даёт типизированный результат сейчас, с меньшей машинерией посередине.
- Ни то ни другое не заменяет бизнес-правило. Это два способа пересечь границу процесса.

**Examples:**

`account.debit(20)` через ORB блокируется, пока этот объект не вернётся. `queue.send({type: "debit", amount: 20})` возвращается после того, как брокер принял сообщение. Рабочий может применить списание позже, а отправитель уже пошёл дальше.
</details>

<details>
<summary>In what scenario would you choose an Enterprise Service Bus (ESB)?</summary>

### In what scenario would you choose an Enterprise Service Bus (ESB)?

**Definition:**

Шину ESB выбирают, когда много существующих систем должны обмениваться сообщениями и ни одна не должна знать протокол, формат и адрес каждой другой.

**How it works:**

- Она окупается, когда вы переводите протоколы, перекраиваете тела, проверяете сообщения и маршрутизируете по содержимому между пакетами, которыми не управляете.
- Шина также может оркестрировать короткий процесс, ставить сообщения в очередь, применять политику безопасности один раз и дать одно место, откуда смотреть потоки.
- Типичный случай — компания связывает CRM, пакет биллинга и склад, которые уже говорят на разных форматах.
- Слабый выбор — для горстки сервисов, которыми владеют ваши команды. Прямой HTTP или простая очередь — меньше машинерии, а бизнес-правила, закопанные в шине, становятся узким местом.
- Если задача «интегрировать ландшафт», шина — посредник. Если задача «API одной команды», обойдитесь без неё.

**Examples:**

Склад выдаёт файл отгрузки фиксированной ширины. Шина отображает его в сообщение обновления клиента для CRM, отвергает строку без идентификатора счёта и доставляет. Ни один продукт не правят, чтобы он говорил на API другого.
</details>

<details>
<summary>When would you use Remote Procedure Call (RPC) middleware, and what advantages does it offer?</summary>

### When would you use Remote Procedure Call (RPC) middleware, and what advantages does it offer?

**Definition:**

RPC используют, когда вызывающему результат нужен сейчас и операция естественно является функцией: входы внутрь, типизированный выход или ошибка наружу.

**How it works:**

- Заглушки делают удалённый вызов похожим на локальный, поэтому прикладной код остаётся близким к обычному вызову функции.
- Middleware находит сервер, кодирует аргументы и декодирует ответ.
- Это хорошо ложится на внутренние вызовы сервисов, инфраструктурные помощники и управление устройствами, где следующая строка кода зависит от ответа.
- Вы получаете прямую модель программирования и можете повесить аутентификацию на заглушку. Буфера, если вызываемый лежит, нет: вызов падает или истекает по времени.
- Очередь предпочтительнее, когда работа может подождать, разойтись многим или должна пережить перезапуск вызывающего.

**Examples:**

```text
quote = pricing.quote(sku, qty)   # blocks until the pricing process replies
if quote is None: reject()
```

Клиент остаётся вызовом функции. Сгенерированная заглушка кодирует `sku` и `qty` и бросает ошибку, если pricing не ответил вовремя.
</details>

### Middleware Integration and Communication

<details>
<summary>Explain how middleware systems support data format transformations between disparate technologies.</summary>

### Explain how middleware systems support data format transformations between disparate technologies.

**Definition:**

Middleware преобразования переписывает сообщение из формата отправителя в формат получателя, чтобы ни одна сторона не говорила на схеме другой.

**How it works:**

- Брокер или интеграционный поток разбирает входящее тело, сопоставляет поля и пишет исходящее тело.
- Тот же шаг может отвергнуть сообщение, не прошедшее схему, и не пустить плохие данные в ядро системы.
- Отправители и получатели остаются слабо связанными: у каждого своя модель.
- На том же переходе можно ещё ограничить темп, закэшировать справочник для сопоставления или разложить нагрузку. Это соседи преобразования, а не само преобразование.
- Частые формы обмена — XML, JSON и бинарная схема вроде Protocol Buffers. Middleware — место, которое переводит между ними.
- Держите сопоставление декларативным и покрытым тестами. Скрытые переименования полей — частый источник тихой потери данных.

**Examples:**

Партнёр шлёт XML `<Qty>2</Qty>`. Шлюз выдаёт JSON `{ "quantity": 2 }` для сервиса заказов и отбрасывает вызов, когда `Qty` нет. Партнёр никогда не видит имя JSON-поля.
</details>

<details>
<summary>Describe how middleware handles load balancing among multiple server instances.</summary>

### Describe how middleware handles load balancing among multiple server instances.

**Definition:**

Middleware балансировки даёт один адрес и размазывает запросы по здоровым экземплярам следующего яруса.

**How it works:**

- Клиенты говорят с прокси, а не с IP сервера. Прокси выбирает бэкенд и пересылает запрос.
- Частые выборы: круговой обход, наименьшее число соединений, хеш клиента, чтобы один клиент оставался на одном сервере, и веса, когда машины разного размера.
- Активные проверки дергают URL. Пассивные смотрят на реальные ошибки и медленные вызовы. Упавший экземпляр выпадает, пока не восстановится.
- Прокси также может завершать TLS и повторить идемпотентный вызов на следующем экземпляре.
- Прилипание сессии необязательно. Обработчикам без состояния оно не нужно. Сессиям в памяти нужно, либо сессию выносят в общее хранилище, и балансировщик снова свободен выбрать любой экземпляр.

**Examples:**

```text
upstream orders {
  server 10.0.0.2;
  server 10.0.0.3;
}
# a failed health check on /ready removes that server from the rotation
```

Вызывающие используют одно имя хоста. Два процесса заказов делят трафик, и мёртвый процесс перестаёт его получать.
</details>

<details>
<summary>Can you discuss strategies for scaling middleware solutions in response to increasing load?</summary>

### Can you discuss strategies for scaling middleware solutions in response to increasing load?

**Definition:**

Масштабируйте ярус middleware так же, как сервисы за ним: размазывайте нагрузку, избегайте повторной работы и добавляйте экземпляры раньше, чем более крупную машину.

**How it works:**

- Поставьте балансировщик перед несколькими узлами middleware, чтобы ни один прокси или клиент брокера не был единственной дверью.
- Кэшируйте ответы и справочники на middleware, чтобы горячее чтение не доходило до более медленного яруса.
- Масштабируйте горизонтально: больше процессов прокси или рабочих без состояния за балансировщиком. Сессию и состояние сообщений держите в хранилище или кластерном брокере, а не в памяти одного процесса.
- Делите очереди по ключу, когда один потребитель не успевает, и добавляйте потребителей до числа разделов.
- Обратное давление и лимиты защищают ярус: полная очередь должна замедлять производителей, а не выделять память без предела.
- Более крупная машина помогает брокеру с состоянием, который пока нельзя разрезать. Это поздний шаг, не первый.

**Examples:**

Частота запросов утраивается. Вы добавляете ещё два процесса шлюза без состояния за существующим балансировщиком и кэшируете чтение товара на 30 секунд. QPS базы остаётся ровным. Брокер масштабируют разделом и потребителем, а не увеличением кучи шлюза.
</details>

### Middleware Configuration and Optimization

<details>
<summary>How can you configure middleware to ensure secure data transmission?</summary>

### How can you configure middleware to ensure secure data transmission?

**Definition:**

Защитите переход, который несёт middleware: шифруйте байты, аутентифицируйте соседа и замечайте подмену.

**How it works:**

- Завершайте или пропускайте TLS, чтобы соединение было зашифровано, а сервер аутентифицирован сертификатом. Не оставляйте внутренний переход открытым текстом только потому, что он «внутри».
- Шифруйте тела, которые должны остаться секретом даже от брокера, ключом, которого у брокера нет, когда middleware только маршрутизирует.
- Целостность — это MAC или аутентификация записи TLS: перевёрнутый бит не проходит проверку, а не доставляется как данные.
- Аутентифицируйте вызывающих на middleware (mTLS или токен) и авторизуйте до того, как сообщение дойдёт до сервиса.
- Ротируйте сертификаты и ключи и выключайте старые версии протокола. Прокси, который всё ещё разрешает устаревший TLS, отменяет остальное.

**Examples:**

Шлюз принимает только TLS 1.2+ с вашим сертификатом, проверяет токен вызывающего и пересылает в сервис по mTLS. Клиент, который шлёт HTTP на порт 80, перенаправляется или получает отказ. Сервис никогда не видит неаутентифицированный вызов.
</details>

<details>
<summary>Explain how middleware caching can improve the performance of a multi-layered application.</summary>

### Explain how middleware caching can improve the performance of a multi-layered application.

**Definition:**

Кэш в middleware отвечает на повторное чтение до того, как вызов дойдёт до более медленных слоёв, поэтому те делают меньше работы, а вызывающий меньше ждёт.

**How it works:**

- Горячие чтения (страницы товара, конфигурация, решения об авторизации, которые редко меняются) хранят на краю или перед сервисом.
- Кэшировать могут несколько слоёв: ярус HTTP кэширует ответ, ярус сервиса — посчитанную цену, ярус данных — запрос. Каждый избегает своей цены.
- Выигрыш — меньшая задержка и меньшая нагрузка на базу и на сервисы, в которые сходится трафик.
- Риск — устаревание. Ставьте TTL или сбрасывайте ключ, когда фиксируется запись, которая его меняет.
- Не кэшируйте персональные или авторизованные тела на общем ключе. Варьируйте ключ по пользователю или не кэшируйте.
- Промах кэша всё равно должен быть корректным. Лежащий кэш должен проваливаться в следующий слой, а не ронять запрос.

**Examples:**

```javascript
function cacheProduct(req, res, next) {
  const hit = store.get(req.params.id)
  if (hit) return res.json(hit)
  res.on("finish", () => store.set(req.params.id, res.locals.body, 30))
  next()
}
```

Второй запрос этого id возвращается из памяти. Смена цены удаляет ключ, и следующий запрос собирает ответ заново.
</details>

<details>
<summary>What are some common performance concerns when integrating middleware in a layered architecture?</summary>

### What are some common performance concerns when integrating middleware in a layered architecture?

**Definition:**

</details>

### Middleware Technologies and Standards

<details>
<summary>Name and discuss several prominent middleware technologies currently used in the industry and their typical use cases.</summary>

### Name and discuss several prominent middleware technologies currently used in the industry and their typical use cases.

**Definition:**

</details>

<details>
<summary>How have web services evolved to serve middleware functions in modern applications?</summary>

### How have web services evolved to serve middleware functions in modern applications?

**Definition:**

</details>

<details>
<summary>What is the significance of using middleware that adheres to standards like AMQP (Advanced Message Queuing Protocol)?</summary>

### What is the significance of using middleware that adheres to standards like AMQP (Advanced Message Queuing Protocol)?

**Definition:**

</details>

### Middleware Security and Reliability

<details>
<summary>How does middleware support authentication and authorization across different layers?</summary>

### How does middleware support authentication and authorization across different layers?

**Definition:**

</details>

<details>
<summary>Describe how middleware can assist with data encryption during transit between application layers.</summary>

### Describe how middleware can assist with data encryption during transit between application layers.

**Definition:**

</details>

<details>
<summary>Discuss how middleware can provide reliable message delivery and fault tolerance in the case of network failures.</summary>

### Discuss how middleware can provide reliable message delivery and fault tolerance in the case of network failures.

**Definition:**

</details>

### Middleware Testing and Debugging

<details>
<summary>What are effective strategies for testing middleware integration within a system?</summary>

### What are effective strategies for testing middleware integration within a system?

**Definition:**

</details>

<details>
<summary>Explain how you would approach debugging a performance bottleneck at the middleware layer.</summary>

### Explain how you would approach debugging a performance bottleneck at the middleware layer.

**Definition:**

</details>

<details>
<summary>Describe an approach to simulating high loads for middleware during the testing phase.</summary>

### Describe an approach to simulating high loads for middleware during the testing phase.

**Definition:**

</details>

### Middleware Design Patterns and Best Practices

<details>
<summary>Describe the Chain of Responsibility pattern and its role in middleware layer design.</summary>

### Describe the Chain of Responsibility pattern and its role in middleware layer design.

**Definition:**

</details>

<details>
<summary>Can you name and describe one or two middleware-related design patterns that enhance scalability or maintainability?</summary>

### Can you name and describe one or two middleware-related design patterns that enhance scalability or maintainability?

**Definition:**

</details>

<details>
<summary>What best practices would you recommend for designing an effective middleware layer in a modern application?</summary>

### What best practices would you recommend for designing an effective middleware layer in a modern application?

**Definition:**

</details>

### Middleware Specifics and Advanced Concepts

<details>
<summary>How does middleware support orchestration and choreography in microservices architectures?</summary>

### How does middleware support orchestration and choreography in microservices architectures?

**Definition:**

</details>

<details>
<summary>Describe the role of API Gateways as a form of middleware in a microservices environment.</summary>

### Describe the role of API Gateways as a form of middleware in a microservices environment.

**Definition:**

</details>

<details>
<summary>Explain the concept of middleware as a Service (MaaS) and how it can be leveraged in cloud architectures.</summary>

### Explain the concept of middleware as a Service (MaaS) and how it can be leveraged in cloud architectures.

**Definition:**

</details>

### Middleware in Enterprise Context

<details>
<summary>How do enterprise service buses differ from more lightweight middleware solutions?</summary>

### How do enterprise service buses differ from more lightweight middleware solutions?

**Definition:**

</details>

<details>
<summary>Describe a scenario where middleware plays a critical role in enterprise application integration (EAI).</summary>

### Describe a scenario where middleware plays a critical role in enterprise application integration (EAI).

**Definition:**

</details>

### Middleware and Big Data

<details>
<summary>How can middleware solutions facilitate Big Data processing and integration with traditional enterprise systems?</summary>

### How can middleware solutions facilitate Big Data processing and integration with traditional enterprise systems?

**Definition:**

</details>

<details>
<summary>Discuss the role of middleware in streamlining data flows between IoT devices and backend systems.</summary>

### Discuss the role of middleware in streamlining data flows between IoT devices and backend systems.

**Definition:**

</details>
