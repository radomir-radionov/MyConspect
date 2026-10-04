# SOA — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [SOA — собеседование](./0_sd_soa_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — SOA](https://devinterview.io/questions/software-architecture-and-system-design/service-oriented-architecture-interview-questions/).

### SOA Fundamentals

<details>
<summary>What are the core principles of Service-Oriented Architecture (SOA)?</summary>

### What are the core principles of Service-Oriented Architecture (SOA)?

**Definition:**

SOA делит систему на сервисы: каждый владеет бизнес-возможностью и публикует контракт, который вызывают другие системы.

**How it works:**

- Слабая связанность: вызывающий пользуется API или очередью, а не кодом, таблицами или именем хоста поставщика.
- Контракт: сервис публикует операции и схему, чтобы обе стороны знали сообщения.
- Нейтральность платформы: стек может быть любым, если сообщения остаются совместимыми.
- Гранулярность: сервис делает одну связную работу. Слой middleware может собрать несколько сервисов в больший поток.
- Повторное использование: одну возможность, например биллинг, вызывают многие приложения, а не копируют её.
- Автономия: команда меняет и выкатывает свой сервис по своему графику.
- Обнаружение и композиция: потребители находят сервисы и собирают из них процесс.
- Масштаб и изоляция: нагрузку можно распределить, и медленный сервис не обязан тормозить все остальные возможности.
- Сохранность: сервис может держать своё устойчивое состояние, а не одалживать базу вызывающего.
- По сравнению с монолитом SOA проводит границы по бизнес-возможностям и общается по сети. Микросервисы толкают ту же идею к более мелким единицам выкладки, каждая со своими данными.

**Examples:**

Экран заказа вызывает общий сервис Customer и общий сервис Pricing. Замена движка цен не требует нового бинарника checkout, пока сообщение о цене остаётся тем же.
</details>

<details>
<summary>Can you describe the difference between SOA and a microservices architecture?</summary>

### Can you describe the difference between SOA and a microservices architecture?

**Definition:**

Оба стиля делят работу на сервисы с контрактами. Они различаются размером, владением данными, способом интеграции и тем, насколько жёстко предприятие ими управляет.

**How it works:**

- Сервисы SOA обычно крупнее и могут покрывать несколько связанных возможностей. Микросервис обычно одна возможность, достаточно маленькая для одной команды.
- Классическая SOA часто интегрируется синхронными вызовами и корпоративной шиной. Микросервисы смешивают HTTP с очередями и стараются не держать бизнес-логику в общей шине.
- SOA часто делит канонические модели данных через контракты. Микросервисы предпочитают свою базу на сервис и мирятся с дублированием на краях.
- SOA склонна стандартизировать стек и центральное управление. Команды микросервисов выбирают свой язык и выпускают по своему конвейеру.
- Выкладки SOA независимы, но часто согласованы. Микросервис может уехать без перевыкладки соседей.
- Общие проблемы остаются: найти живой экземпляр, частичный сбой и данные, которые больше не в одной транзакции.
- Принципы, которые переносятся: слабая связанность, опубликованный контракт и автономия. Жёстче становится «данные ваши» и «выкатываетесь одни».

**Examples:**

SOA-сервис «Order» может резервировать склад, списывать карту и уведомлять доставку за одним контрактом. Разрез на микросервисы сделает Inventory, Payments и Shipping отдельными выкладками, каждая со своим хранилищем, и соберёт их событиями.
</details>

<details>
<summary>Explain the concept of a service contract in SOA.</summary>

### Explain the concept of a service contract in SOA.

**Definition:**

Контракт сервиса — обещание, на которое может опереться потребитель: операции, форма сообщений, протокол, ошибки и политики. Внутренности обеих сторон могут меняться, пока обещание держится.

**How it works:**

- Он называет операции, схему каждого сообщения и какие ошибки могут вернуться.
- Рядом идут политики: аутентификация, шифрование, идемпотентность и иногда уровень обслуживания.
- Поставщик и потребитель могут быть на разных языках, потому что делят контракт, а не код.
- Формы: документ WSDL, описание OpenAPI или явная схема вроде JSON Schema или protobuf.
- Версионирование — часть контракта. Ломающее изменение — это новый контракт, а не тихая правка.
- Именно этот разрез делает независимые релизы возможными: вызывающие привязаны к контракту, а не к классу внутри поставщика.

**Examples:**

```text
POST /reservations
body: { "sku": "A1", "qty": 2 }
201: { "id": "r-9" }
409: { "error": "out_of_stock" }
```

Команда склада может заменить свою базу, пока этот запрос, это тело успеха и эта ошибка конфликта остаются действительными.
</details>

<details>
<summary>How does SOA facilitate service reusability?</summary>

### How does SOA facilitate service reusability?

**Definition:**

SOA стремится к одной реализации бизнес-функции за стабильным контрактом, чтобы много приложений вызывали её, а не копировали логику.

**How it works:**

- Модульность держит функцию в одном сервисе с одной целью.
- Общий контракт и стандартный формат сообщения значат, что новому каналу не нужна своя разновидность.
- Слабая связанность позволяет перенести или переписать поставщика без правки каждого вызывающего.
- Сообщения, не привязанные к платформе, позволяют интернет-магазину, приложению филиала и пакетной задаче звать один сервис биллинга.
- Реестр делает этот сервис находимым, чтобы команды не плодили второй только потому, что не видят первый.
- Повторное использование ломается, когда каждая команда всё равно выпускает свою копию с чуть другой схемой.

**Examples:**

Оформление заказа, инструмент колл-центра и партнёрский API все вызывают `Customer.lookup`. Новое поле добавляют в этот контракт один раз, а не вставляют в три кодовые базы.
</details>

<details>
<summary>What is loose coupling in SOA and why is it important?</summary>

### What is loose coupling in SOA and why is it important?

**Definition:**

Слабая связанность значит, что вызывающий зависит от контракта другого сервиса, а не от его кода, базы или адреса. Поставщика можно перенести или заменить, не перевыкладывая каждого вызывающего.

**How it works:**

- Взаимодействие идёт через сообщения или API. Общая таблица или вызов внутри процесса — противоположность.
- Прозрачность расположения: вызывающий ищет конечную точку, а не зашивает хост.
- Поставщик может масштабироваться, переключаться при сбое или менять стек, пока контракт держится.
- Это даёт устойчивость (один простой не обязан ронять каждого вызывающего, если те умеют повторять или ставить в очередь) и позволяет командам выпускать по разным графикам.
- Трудные места: обнаружение и версии, согласованность данных через границу и договорённость о транспорте и формате.
- Приёмы, которые держат связанность низкой: опубликованный контракт, сообщения, операции без состояния, идемпотентные повторы и скрытие модели данных поставщика.

**Examples:**

Checkout вызывает `POST /prices` и не знает, работает ли ценообразование в одном процессе или в двадцати. Перенос pricing в другой кластер меняет запись в реестре, а не код checkout.
</details>

<details>
<summary>What do you understand by service orchestration and service choreography in the context of SOA?</summary>

### What do you understand by service orchestration and service choreography in the context of SOA?

**Definition:**

Оркестрация ставит одного координатора над шагами. Хореография обходится без дирижёра: каждый сервис реагирует на события и сам выбирает следующий шаг.

**How it works:**

- Оркестратор вызывает склад, оплату и доставку по порядку и обрабатывает ошибки в одном месте. Поток легко читать и менять.
- Этот координатор также может стать узким местом или вторым монолитом, если в него сядет слишком много логики.
- В хореографии «место забронировано» — событие. Биллинг и уведомления каждый подписываются и действуют сами. Ни один сервис не говорит другим, что делать дальше.
- Хореография убирает центральный рантайм и держит сервисы независимыми. Общий поток труднее увидеть, и отсутствующий подписчик молча не срабатывает, если не трассировать события.
- Оркестрацию берут, когда у бизнес-процесса строгий порядок и один владелец. Хореографию — когда соседи должны остаться слабо связанными и набор слушателей будет расти.

**Examples:**

Оркестрация: `placeOrder` вызывает резерв, затем списание, затем отгрузку и компенсирует, если списание не удалось. Хореография: Order публикует `OrderPlaced`; Inventory и Billing каждый потребляют его и публикуют свой результат. Внутри `placeOrder` никто не ждёт обоих.
</details>

<details>
<summary>How does SOA differ from traditional monolithic application architectures?</summary>

### How does SOA differ from traditional monolithic application architectures?

**Definition:**

Монолит поставляется одним процессом с вызовами внутри процесса и обычно одной базой. SOA делит возможности на сервисы, которые говорят по сети и могут принадлежать разным владельцам и масштабироваться отдельно.

**How it works:**

- Модули монолита живут в одной кодовой базе и одной выкладке. Изменение или масштабирование трогает всё приложение.
- Модули SOA — это сервисы. Они вызывают друг друга сообщениями, а не локальной функцией.
- Команды могут владеть сервисом всю его жизнь и выпускать его, не пересобирая остальные возможности.
- У монолита одна транзакция и одна схема. SOA выносит согласованность за границу сети.
- Сервисы могут быть на разных языках. Монолит обычно делит один стек.
- Платите задержкой, частичным сбоем и большими операционными затратами взамен на выкладку и масштаб одной возможности.

**Examples:**

В одном процессе `createOrder` вызывает `reserveStock` как метод, и оба делят транзакцию базы. После разреза checkout посылает запрос резерва и должен пережить таймаут, даже если сервис склада потом успеет.
</details>

<details>
<summary>What role does a service registry play in SOA?</summary>

### What role does a service registry play in SOA?

**Definition:**

Реестр сервисов — каталог, куда поставщики публикуют контракт и адрес, а потребители их ищут. Поиск заменяет зашитые адреса.

**How it works:**

- Поставщик регистрирует имя, версию, адрес и метаданные. Потребитель запрашивает эту запись перед вызовом.
- Реестр может и рассылать изменения, чтобы подписчики узнали, когда экземпляр появился или пропал.
- Именно это держит расположение прозрачным: процесс можно перенести, и вызывающие всё равно разрешают имя.
- Записи стоит закрывать доступом, а обновления аутентифицировать, чтобы чужой не опубликовал поддельный адрес.
- Классическая SOA использовала UDDI. Ту же работу сегодня часто делают Consul, control plane меша или облачный каталог сервисов.
- Реестр — не шина. Он отвечает «где совместимый экземпляр?». Сообщение он не преобразует.

**Examples:**

При старте процесс цен регистрирует `pricing` на `10.0.4.8:8080` с версией `2`. Checkout спрашивает реестр о `pricing` версии `2` и вызывает адрес, который вернулся. Вторая реплика регистрируется рядом. Checkout не хранит ни один из IP.
</details>

### Designing SOA-based Systems

<details>
<summary>What factors do you consider when designing a service interface in SOA?</summary>

### What factors do you consider when designing a service interface in SOA?

**Definition:**

Формируйте интерфейс вокруг одной бизнес-возможности, с небольшой явной схемой, чтобы вызывающие могли переиспользовать его, не изучая внутренности поставщика.

**How it works:**

- Гранулярность: достаточно широко, чтобы было полезно, и достаточно узко, чтобы посторонние изменения не ехали вместе. Группируйте операции одного бизнес-шага.
- Вход держите маленьким, а выход — полным результатом вызова, включая ясный формат ошибки.
- Прячьте таблицы и внутренние типы. Контракт — граница инкапсуляции.
- Проектируйте для повторного использования разными каналами, а специализацию потока отдайте оркестрации.
- Аутентификацию, авторизацию и проверку кладите в правила контракта, а не только в одного вызывающего.
- Предпочитайте идемпотентные операции там, где клиенты будут повторять, и делайте границу транзакции очевидной.
- Отделяйте устойчивое от того, что меняется часто, чтобы летучие детали не требовали новый контракт каждую неделю.
- Сервис должен находиться, измеряться (задержка, ошибки, доступность) и версионироваться, чтобы старые вызывающие выжили.
- Назовите схему, кэшируйте только там, где устаревание допустимо, и следуйте стандартам, которые организация уже использует.

**Examples:**

`POST /orders` принимает идентификатор корзины и платёжный токен и возвращает идентификатор заказа или типизированную ошибку. Он не принимает сырой фрагмент SQL, а повтор того же ключа идемпотентности не создаёт второй заказ.
</details>

<details>
<summary>Explain how versioning of services is handled in a SOA environment.</summary>

### Explain how versioning of services is handled in a SOA environment.

**Definition:**

Публикуйте новую версию контракта, когда изменение сломает текущих клиентов, и держите старую, пока эти клиенты не переедут.

**How it works:**

- Версия в URL кладёт номер в путь (`/v1/orders`, `/v2/orders`). Это очевидно и легко маршрутизировать. Цена — больше путей, которые надо поддерживать.
- Версия в заголовке кладёт её в запрос, например `Accept: application/vnd.orders+json;version=2`. URL остаются стабильными. Кэши и часть клиентов плохо живут с нестандартным media type.
- Семантические версии говорят клиенту, аддитивное ли изменение (`1.1.0`) или ломающее (`2.0.0`).
- Добавленные поля, которые старые клиенты игнорируют, могут остаться на той же мажорной версии. Удаление или смена типа поля требуют новой.
- Шлюз может отправить каждую версию на свою выкладку, чтобы вызывающие держали одно имя хоста.
- Версию снимают только когда видно, что трафика на неё больше нет.

**Examples:**

`GET /v1/orders/1` по-прежнему возвращает `total`. `GET /v2/orders/1` делит это на `net` и `tax`. Шлюз ведёт `/v1` на старый процесс, пока не уйдёт последний клиент.
</details>

<details>
<summary>Describe a scenario in which you might opt for synchronous communication over asynchronous in SOA.</summary>

### Describe a scenario in which you might opt for synchronous communication over asynchronous in SOA.

**Definition:**

Синхронный вызов берут, когда вызывающий не может сделать следующий шаг без результата. Очередь оставила бы этот шаг ждать позднего события.

**How it works:**

- Оформление заказа должно сразу знать, авторизована ли карта, чтобы экран подтвердил или попросил другую карту.
- Проверка уникальности перед созданием учётной записи той же формы: ответ решает, фиксировать ли операцию.
- У шагов обязательный порядок, и ошибку нужно показать пользователю в этом же запросе.
- Цена принимается: вызывающий теперь зависит от доступности и задержки вызываемого, и медленная зависимость тормозит запрос.
- Работа, которая может закончиться позже (письмо, аналитика, сборка на складе), остаётся в очереди.

**Examples:**

```text
POST /checkout
  -> POST /payments/authorize   # wait
  <- { "status": "approved" }
  -> create order
```

Если авторизация не уложилась в таймаут, checkout возвращает ошибку. Он не говорит покупателю, что заказ есть, в надежде, что сообщение придёт позже.
</details>

<details>
<summary>What are some of the common data formats used for service communication in SOA?</summary>

### What are some of the common data formats used for service communication in SOA?

**Definition:**

Контракт называет байты на проводе, чтобы каждый потребитель разбирал одну и ту же структуру.

**How it works:**

- SOAP-сервисы обмениваются XML-конвертами, часто с WSDL-описанием операций и типов.
- HTTP API в стиле ресурсов чаще используют JSON: текст, его легко читать, типы слабые, пока не добавите схему.
- Бинарные схемы вроде Protocol Buffers или Avro появляются, когда важны размер сообщения и строгие правила эволюции.
- XML всё ещё уместен, когда предприятие уже делит контракты XSD или нужны пространства имён и строгая проверка.
- Один формат на контракт. Смешение на одной операции заставляет каждого вызывающего гадать.

**Examples:**

Партнёрский шлюз говорит на SOAP с XSD. Внутренний API заказов говорит на JSON, описанном OpenAPI. Плотный поток остатков использует protobuf, чтобы то же сообщение оставалось маленьким и типизированным.
</details>

<details>
<summary>Provide an example of how you would refactor a monolithic application into a SOA-based architecture.</summary>

### Provide an example of how you would refactor a monolithic application into a SOA-based architecture.

**Definition:**

Режьте монолит по бизнес-возможностям, публикуйте каждый контракт и выносите по одному сервису вместе с его данными. Оставьте фасад, чтобы старый процесс для вызывающих выглядел по-прежнему.

**How it works:**

- Найдите модули со своей причиной меняться. В магазине это часто каталог, заказы, пользователи и платежи.
- Решите, какие вызовы должны вернуть ответ сейчас (checkout к платежам), а какие могут быть событиями (письмо, аналитика).
- Напишите интерфейс и случаи ошибок до переноса кода.
- Вынесите сервис, перенесите таблицы, которыми он владеет, и направьте монолит на новую конечную точку через тонкий адаптер.
- Зарегистрируйте конечную точку, затем добавьте аутентификацию и метрики на этой границе.
- Повторяйте. Не разносите каждый класс в одном релизе.
- Вы получаете отдельные выкладки и свободу масштабировать одни платежи. Вы принимаете сетевые сбои, а транзакция базы, которая была локальной, становится сагой.

**Examples:**

Неделя первая: наружу уезжает `PaymentService`. Метод монолита `charge()` становится HTTP-вызовом с ключом идемпотентности. Заказы и каталог остаются в процессе. Неделя вторая: уезжает каталог, и в монолите остаётся только фасад оформления заказа.
</details>

### Implementing SOA

<details>
<summary>What is an Enterprise Service Bus (ESB) and how does it support SOA?</summary>

### What is an Enterprise Service Bus (ESB) and how does it support SOA?

**Definition:**

Корпоративная сервисная шина — middleware, которое маршрутизирует, преобразует и опосредует сообщения, чтобы сервисы не интегрировались каждый с каждым.

**How it works:**

- Движок сообщений переносит сообщения. Адаптеры говорят на протоколе каждой системы.
- Слой медиации преобразует форматы, сопоставляет поля и проверяет сообщения.
- Реестр на шине записывает, какие сервисы есть. Маршрут может зависеть от содержимого.
- Шина может проводить безопасность и другую политику в одном месте, держать очередь и выполнять поток оркестрации.
- Сервисы говорят с шиной, а не хранят адрес и схему каждого соседа.
- Риск той же централизации: если бизнес-решения копятся внутри шины, она становится узким местом и единственным местом, которое трогает каждое изменение.

**Examples:**

Складская система выдаёт сообщение файла фиксированной ширины. Шина превращает его в JSON сервиса заказов, проверяет схему и доставляет. Ни одна система не линкуется с библиотекой другой.
</details>

<details>
<summary>How would you handle transaction management in a SOA system?</summary>

### How would you handle transaction management in a SOA system?

**Definition:**

Внутри одного сервиса локальная транзакция базы всё ещё может быть атомарной. Через сервисы распределённый двухфазный коммит хрупок, поэтому обычный дизайн — цепочка локальных фиксаций плюс явная отмена.

**How it works:**

- Локальная транзакция покрывает таблицы одного сервиса. Изоляция и устойчивость остаются внутри этой базы.
- Продление одной ACID-транзакции через сеть связывает блокировки всех участников и плохо ломается, когда один из них недоступен.
- Компенсация: каждый шаг фиксируется локально, а при сбое выполняется отмена, например возврат денег или освобождение остатка. Отмена — обычная операция, а не откат базы.
- Сага записывает, какие шаги прошли, и запускает соответствующие компенсации в обратном порядке. Эту запись может держать оркестратор, или каждый сервис реагирует на событие сбоя.
- Повторы должны быть идемпотентными, а таймауты явными, потому что сеть может доставить успех после того, как вызывающий сдался.
- Изоляция слабее, чем в одной базе: другой вызывающий может увидеть зарезервированный остаток до завершения оплаты. Поток должен допускать это промежуточное состояние.

**Examples:**

Зарезервировать остаток (зафиксировать), затем списать карту. Если списание отклонено, вызвать `releaseStock` с тем же идентификатором резерва. Второй release ничего не делает. Транзакции, которая охватывает базу склада и процессор карт, нет.
</details>

<details>
<summary>What strategies would you use to ensure high availability in a SOA deployment?</summary>

### What strategies would you use to ensure high availability in a SOA deployment?

**Definition:**

</details>

<details>
<summary>What is WS-Security and how does it relate to SOA?</summary>

### What is WS-Security and how does it relate to SOA?

**Definition:**

</details>

### SOA Standards and Protocols

<details>
<summary>What are the benefits of using standard protocols like SOAP or REST in SOA?</summary>

### What are the benefits of using standard protocols like SOAP or REST in SOA?

**Definition:**

</details>

<details>
<summary>Explain the role of WSDL in SOA.</summary>

### Explain the role of WSDL in SOA.

**Definition:**

</details>

<details>
<summary>How does UDDI facilitate service discovery in SOA?</summary>

### How does UDDI facilitate service discovery in SOA?

**Definition:**

</details>

<details>
<summary>What is the significance of OASIS in the context of SOA?</summary>

### What is the significance of OASIS in the context of SOA?

**Definition:**

</details>

### Securing SOA Applications

<details>
<summary>What are the main security concerns in a SOA environment?</summary>

### What are the main security concerns in a SOA environment?

**Definition:**

</details>

<details>
<summary>How would you approach identity management in SOA?</summary>

### How would you approach identity management in SOA?

**Definition:**

</details>

<details>
<summary>Can you explain the concept of security tokens in SOA?</summary>

### Can you explain the concept of security tokens in SOA?

**Definition:**

</details>

### SOA Testing

<details>
<summary>Describe your approach to testing services in SOA.</summary>

### Describe your approach to testing services in SOA.

**Definition:**

</details>

<details>
<summary>What are the challenges of testing in a SOA-based system compared to a monolithic one?</summary>

### What are the challenges of testing in a SOA-based system compared to a monolithic one?

**Definition:**

</details>

<details>
<summary>How would you perform load testing for an SOA service?</summary>

### How would you perform load testing for an SOA service?

**Definition:**

</details>

### Performance and Scalability

<details>
<summary>How would you monitor the performance of services in SOA?</summary>

### How would you monitor the performance of services in SOA?

**Definition:**

</details>

<details>
<summary>Describe a strategy to scale a service in a SOA system.</summary>

### Describe a strategy to scale a service in a SOA system.

**Definition:**

</details>

<details>
<summary>How do you manage service dependencies to avoid performance bottlenecks in SOA?</summary>

### How do you manage service dependencies to avoid performance bottlenecks in SOA?

**Definition:**

</details>

### SOA Governance

<details>
<summary>What does governance mean in the context of SOA?</summary>

### What does governance mean in the context of SOA?

**Definition:**

</details>

<details>
<summary>Describe a policy you might enforce as part of SOA governance.</summary>

### Describe a policy you might enforce as part of SOA governance.

**Definition:**

</details>

<details>
<summary>Can you explain the purpose of a service level agreement (SLA) in a SOA context?</summary>

### Can you explain the purpose of a service level agreement (SLA) in a SOA context?

**Definition:**

</details>

### Troubleshooting and Maintenance

<details>
<summary>What steps would you take to troubleshoot a failing service in a SOA architecture?</summary>

### What steps would you take to troubleshoot a failing service in a SOA architecture?

**Definition:**

</details>

<details>
<summary>How do you manage and maintain services throughout their lifecycle in a SOA infrastructure?</summary>

### How do you manage and maintain services throughout their lifecycle in a SOA infrastructure?

**Definition:**

</details>
