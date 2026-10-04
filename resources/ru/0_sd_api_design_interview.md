# API Design — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [API Design — собеседование](./0_sd_api_design_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — API Design](https://devinterview.io/questions/software-architecture-and-system-design/api-design-interview-questions/).

### API Design Fundamentals

<details>
<summary>What is an API and what are its main purposes?</summary>

### What is an API and what are its main purposes?

**Definition:**

API — контракт, который вызывает другая программа: именованные операции, входы, которые они принимают, и выходы, которые они возвращают. Он существует, чтобы вызывающие не зависели от вашего закрытого кода.

**How it works:**

- Он прячет реализацию. Вызывающий видит метод, HTTP-ресурс или функцию библиотеки, а не ваши таблицы.
- Это граница, на которой можно сменить хранилище или поставщика, не переписывая каждого клиента.
- Это ещё и граница, где вы проверяете аутентификацию, данные и лимиты, потому что каждый вызывающий проходит через неё.
- API библиотеки работает в процессе. Веб-API — по сети. Оба — контракты. Протоколом на проводе является только второй.

**Examples:**

`POST /invoices` с телом JSON — веб-API. `Invoice.create(customer, lines)` в общем пакете — API библиотеки. Вызывающие и того и другого должны пережить смену SQL за ними.

</details>

<details>
<summary>Can you explain the difference between an API and a Web service?</summary>

### Can you explain the difference between an API and a Web service?

**Definition:**

Веб-сервис — сетевой API с описанным форматом на проводе. «API» — более широкое слово: оно покрывает ещё библиотеки и интерфейсы внутри процесса, которые машину не покидают.

**How it works:**

- API библиотеки может открывать поведение прямо (`charge(card)`). Веб-сервис открывает данные и действия как запросы и ответы: исторически XML с SOAP и WSDL, сегодня часто JSON по HTTP.
- REST API привязаны к HTTP. SOAP-сервисы часто едут по HTTP или SMTP и описывают себя через WSDL. Веб-сервис не обязан быть ни тем ни другим.
- Контракт SOAP формален и тяжелее в вызове. HTTP API с JSON обычно проще для браузера или маленького клиента и сам по себе не несёт WS-Security.
- У обоих есть адреса, операции и пары запрос/ответ. REST API разносит операции по ресурсам и методам. SOAP-сервис часто отправляет все операции на один URL и кладёт действие в тело.

**Examples:**

```text
REST:  POST /invoices     { "customer": "acme" }
SOAP:  POST /service      <CreateInvoice><customer>acme</customer></CreateInvoice>
```

</details>

<details>
<summary>What are the principles of a RESTful API?</summary>

### What are the principles of a RESTful API?

**Definition:**

RESTful API применяет ограничения REST к HTTP-ресурсам: клиенты работают с представлениями, а не с частным набором удалённых процедур.

**How it works:**

- Клиент и сервер разделены. Клиенту не нужна база сервера, а сервер не рисует экран клиента.
- Каждый запрос несёт то, что нужно серверу. Сервер не держит разговорную сессию, чтобы понять следующий вызов.
- Ответы говорят, можно ли их кэшировать и как долго.
- Клиент не отличает, стоял ли посередине шлюз или прокси. Это многослойная система.
- Единообразный интерфейс — та часть, которую имеют в виду на практике: ресурсы с именами-URL, действия через методы HTTP, представления вроде JSON и сообщения, которые описывают сами себя.
- Код по требованию — отправка клиенту исполняемого кода — необязателен и редок.
- «REST» — набор ограничений. «RESTful» — заявление, что конкретный HTTP API им следует. Многие JSON API используют ресурсный стиль и обходятся без гипермедиа.

**Examples:**

```text
GET /weather/paris
Cache-Control: max-age=60
→ { "tempC": 18 }
```

Клиент не вызывает `getWeather(city)`. Он забирает ресурс и может переиспользовать ответ 60 секунд.

</details>

<details>
<summary>How does a SOAP API differ from a REST API?</summary>

### How does a SOAP API differ from a REST API?

**Definition:**

SOAP — XML-протокол с формальным контрактом. REST — архитектурный стиль, обычно по HTTP с JSON и без обязательного языка схемы.

**How it works:**

- SOAP описан в W3C. Тело — XML, контракт — WSDL, транспорт часто HTTP или SMTP. В центре — именованная операция, а стандарты безопасности и транзакций появляются, если вы берёте стек WS-*. Вызов может быть с состоянием. Ошибки — элементы XML, а не только статусы HTTP.
- У REST нет органа стандартизации и обязательного документа. Он ограничивает то, как называют ресурсы и как с ними работают. HTTP — обычный протокол, JSON — обычное представление, а исход несут коды состояния. Сервер не держит сессию, чтобы истолковать следующий запрос. Связанность остаётся в форме ресурса, и клиентам это проще, пока форма не меняется без предупреждения.
- Выбирайте SOAP, когда существующий контракт, строгая схема или корпоративная шина уже говорят на нём. Выбирайте HTTP API в стиле REST, когда клиенты — браузеры, мобильные приложения или другие сервисы, которым нужен URL на ресурс.

**Examples:**

```text
SOAP: POST /soap  <GetInvoice><id>42</id></GetInvoice>
REST: GET /invoices/42
```

</details>

<details>
<summary>What is an API endpoint?</summary>

### What is an API endpoint?

**Definition:**

Конечная точка API — адрес плюс метод, который клиент вызывает, чтобы выполнить одну операцию над ресурсом.

**How it works:**

- URL идентифицирует ресурс (`/invoices/42`). Метод HTTP говорит, что делать. Заголовки несут аутентификацию и тип содержимого. Тело, когда оно есть, — представление, которое вы отправляете.
- У ответа свои статус, заголовки и тело.
- Ресурсный URL использует существительные и отдаёт действие методу: `GET /invoices/42`, `POST /invoices`.
- URL в стиле RPC кладёт глагол в путь и часто принимает только POST: `POST /submitInvoice`. Это работает, и это труднее кэшировать, авторизовать по ресурсу и угадать.

**Examples:**

```text
GET    /invoices/42     прочитать один счёт
POST   /invoices        создать один
PUT    /invoices/42     заменить его
PATCH  /invoices/42     изменить срок
DELETE /invoices/42     удалить его
```

</details>

<details>
<summary>What are the common methods (HTTP verbs) used in a REST API, and what does each method do?</summary>

### What are the common methods (HTTP verbs) used in a REST API, and what does each method do?

**Definition:**

Методы HTTP говорят REST API, что сделать с ресурсом. Клиенты и кэши полагаются на смысл метода, поэтому не изобретайте новый глагол, если подходит существующий.

**How it works:**

- `GET` читает ресурс или коллекцию и не должен менять состояние сервера. `HEAD` — то же без тела.
- `POST` создаёт подчинённый ресурс или запускает действие, которое не идемпотентно. Повтор может создать второй счёт.
- `PUT` заменяет ресурс по URL. Повтор того же представления оставляет тот же результат.
- `PATCH` применяет частичное изменение. Он не идемпотентен автоматически. Сделайте его таким, если клиенты будут повторять запрос.
- `DELETE` удаляет ресурс. Повторное удаление всё равно заканчивается тем, что ресурса нет.
- `OPTIONS` сообщает, какие методы URL разрешает; браузеры используют это для CORS. `TRACE` возвращает запрос эхом и обычно выключен. `CONNECT` открывает туннель через прокси.
- Свой глагол — крайняя мера. Промежуточные узлы и клиентские библиотеки уже понимают стандартный набор.

**Examples:**

```text
POST /invoices          создание, слепо повторять небезопасно
PUT  /invoices/42       замена, повторять безопасно
GET  /invoices/42       чтение, кэши могут его сохранить
```

</details>

<details>
<summary>How do you version an API?</summary>

### How do you version an API?

**Definition:**

Версионируйте API, когда изменение сломает существующих клиентов. Предпочитайте добавление, которое старые клиенты могут проигнорировать, а ломающему изменению дайте свою версию, на которую переходят сознательно.

**How it works:**

- Версия в пути (`/v1/invoices`, `/v2/invoices`) очевидна в журналах и кэшах. Она соблазняет раздвоить весь API.
- Параметр запроса (`?version=1`) легко пропустить, и кэшировать его как другой ресурс неудобно.
- Свой заголовок или значение `Accept` вроде `application/vnd.example.invoice.v2+json` сохраняет URL стабильным и делает версию частью согласования содержимого. Клиенты забывают заголовок.
- Нумеруйте ломающие изменения. Семантические версии (major.minor.patch) ложатся хорошо: новое поле может быть minor, если старые клиенты пропускают незнакомые поля, а удалённое поле — major.
- Документируйте дату отключения, держите старую версию, пока вызывающие не перейдут, и не меняйте смысл существующего поля внутри версии.

**Examples:**

```text
GET /v1/invoices/42     { "total": 120 }
GET /v2/invoices/42     { "total": 120, "currency": "EUR" }
```

v1 остаётся, пока не уйдёт последний клиент, который не умеет читать `currency`.

</details>

<details>
<summary>What is idempotence in the context of API design, and why is it important?</summary>

### What is idempotence in the context of API design, and why is it important?

**Definition:**

Идемпотентная операция может повторяться и не менять исход сверх первого успешного применения. Клиенты повторяют запрос после таймаута, поэтому именно это делает повтор безопасным.

**How it works:**

- Потерянный ответ неотличим от потерянного запроса. Без идемпотентности повтор создаёт второе списание или второй счёт.
- В HTTP идемпотентными определены `GET`, `HEAD`, `OPTIONS`, `PUT` и `DELETE`. `POST` — нет. `PATCH` идемпотентен, только если вы так спроектировали изменение.
- Безопасные методы (`GET`, `HEAD`) ещё и не имеют побочных эффектов. Идемпотентность слабее: `PUT` и `DELETE` меняют состояние, и двукратное выполнение совпадает с однократным.
- Для операций, которые по природе «создать один раз», принимайте ключ идемпотентности. Храните ключ вместе с результатом и возвращайте исходный результат, когда ключ встречается снова. Метка времени или nonce помогают, только если сервер их помнит.
- Ключ нужно записать до побочного эффекта, иначе два одновременных повтора оба пройдут проверку.

**Examples:**

```text
POST /payments
Idempotency-Key: 6f1c-a9

первый вызов → 201 и id платежа
тот же ключ  → 201 и тот же id, второго списания нет
```

</details>

<details>
<summary>Can you explain what API rate limiting is and give an example of why it might be used?</summary>

### Can you explain what API rate limiting is and give an example of why it might be used?

**Definition:**

Ограничение частоты ставит потолок тому, сколько запросов клиент может сделать в окне, чтобы один вызывающий не съел сервис и не отказал в нём остальным.

**How it works:**

- Всплеск трафика, шторм повторов или скрипт в цикле уронят процесс, если обслуживать каждый запрос.
- Потолок — ещё и правило справедливости и способ принудить к плану, за который клиент заплатил.
- Считают по ключу API, пользователю или IP. Решают лимит и окно (100 запросов в минуту). Когда потолок достигнут, отвечают `429 Too Many Requests` и заголовком `Retry-After`, чтобы воспитанный клиент отступил.
- Ставьте ограничитель на краю, до дорогой работы. Лимит только в базе всё равно позволяет запросу занять соединение.

**Examples:**

```text
GET /invoices
→ 429 Too Many Requests
Retry-After: 30
X-RateLimit-Remaining: 0
```

Опрашивающий клиент ждёт 30 секунд вместо цикла.

</details>

<details>
<summary>Describe the concept of OAuth in relation to API security.</summary>

### Describe the concept of OAuth in relation to API security.

**Definition:**

OAuth — каркас авторизации: пользователь позволяет одному приложению коснуться своих данных в другом сервисе, не отдавая этому приложению пароль.

**How it works:**

- Владелец ресурса — пользователь. Клиент — приложение, которое просит доступ. Сервер авторизации аутентифицирует пользователя и выдаёт токен. Сервер ресурсов хранит данные и принимает этот токен.
- Пользователь одобряет область (читать счета, а не отправлять платежи). Сервер авторизации даёт клиенту токен доступа, часто через код авторизации, который клиент обменивает по закрытому каналу. Клиент отправляет токен серверу ресурсов.
- Пароль остаётся у пользователя и сервера авторизации. Токен ограничен областью и временем, и его можно отозвать.
- Сам по себе OAuth — не протокол входа. OpenID Connect добавляет личность поверх него. Использовать токен доступа как доказательство того, кто это, без этого слоя — частая ошибка.

**Examples:**

```text
пользователь одобряет «читать счета» для бухгалтерского приложения
приложение получает токен доступа
GET /invoices  Authorization: Bearer <token>
```

Бухгалтерское приложение пароль пользователя не видит.

</details>

### API Design Best Practices

<details>
<summary>What strategies would you use to ensure the backward compatibility of an API?</summary>

### What strategies would you use to ensure the backward compatibility of an API?

**Definition:**

Обратная совместимость значит, что клиент, написанный под сегодняшний контракт, продолжает работать после следующего изменения.

**How it works:**

- Не удаляйте и не переименовывайте поле, URL или метод, которыми пользуются клиенты. Добавляйте поля. Старые клиенты игнорируют то, чего не знают. Новые это читают.
- Не меняйте смысл существующего поля, обязательность старого или код состояния, который случай уже возвращает. Новый код ошибки безопасен. Переиспользованный код с новым смыслом — нет.
- На переходный период принимайте и старую форму запроса, и новую. Если многошаговый поток должен остаться совместимым, держите каждый шаг идемпотентным, чтобы повтор от старого клиента не применил его дважды.
- Когда контракт всё же нужно сломать, опубликуйте новую версию и держите обе, пока использование старой не спадёт. Задокументируйте дату.

**Examples:**

```json
{ "total": 120, "currency": "EUR" }
```

Клиент, который читает только `total`, продолжает работать. Клиент, которому `total` был нужен строкой, ломается в день, когда вы присылаете число. Второе изменение несовместимо.

</details>

<details>
<summary>What are some common response codes that an API might return, and what do they signify?</summary>

### What are some common response codes that an API might return, and what do they signify?

**Definition:**

Коды состояния HTTP — первое, на чём ветвится клиент. Класс говорит, повторять ли запрос, исправлять ли его или идти по перенаправлению. Конкретный код говорит, какой именно случай.

**How it works:**

- 1xx значит, что сервер ещё работает. `100 Continue` позволяет клиенту отправить большое тело только после согласия сервера.
- 2xx значит, что запрос успешен. `200` — общий успех, `201` создал ресурс, `202` принял работу, которая ещё не закончена, `204` успешен без тела, `206` — частичное тело.
- 3xx значит «смотрите в другом месте». `301` и `308` постоянные, `302` и `307` временные, `304` значит, что кэшированная копия ещё свежа.
- 4xx значит, что клиент должен изменить запрос. `400` — неверная форма, `401` требует аутентификации, `403` — аутентифицирован, но не разрешён, `404` — нет, `405` — неверный метод, `409` конфликтует с текущим состоянием, `410` удалён намеренно, `429` — ограничение частоты.
- 5xx значит, что отказал сервер, и клиент может повторить, если метод безопасен или идемпотентен. `500` — необработанный сбой, `502` и `504` указывают на шлюз или таймаут, `503` — временно недоступен.

**Examples:**

```text
POST /invoices        → 201 Created, Location: /invoices/42
GET  /invoices/42     → 200
DELETE /invoices/42   → 204
GET  /invoices/42     → 404
```

</details>

<details>
<summary>How can you design an API to be easily consumable by clients?</summary>

### How can you design an API to be easily consumable by clients?

**Definition:**

Удобный API — тот, которым вызывающий пользуется правильно по URL, методу и одному примеру, не читая схему вашей базы.

**How it works:**

- Действие отдайте методу HTTP, а ресурсу — существительное. Предпочитайте `/invoices/42`, а не `/getInvoice?id=42`.
- Коллекции во множественном числе (`/invoices`), один элемент — с одним id (`/invoices/42`). Держите этот шаблон на каждом ресурсе.
- Возвращайте одну форму ошибки везде, со стабильным кодом и сообщением, которое может прочитать человек.
- Большие коллекции разбивайте на страницы, фильтруйте и сортируйте в строке запроса, чтобы клиент не был вынужден скачивать таблицу.
- Ломающие изменения версионируйте и не перегружайте один POST свободным полем `action`, если то же самое скажет ресурс или метод.
- Имена должны быть предсказуемыми: `dueDate`, а не `dd`, и одно и то же слово на входе и на выходе.

**Examples:**

```text
GET /invoices?status=open&limit=20
→ 200
{ "data": [ { "id": "42", "total": 120 } ], "next": "/invoices?status=open&cursor=42" }
```

</details>

<details>
<summary>When designing an API, how would you document it for end-users?</summary>

### When designing an API, how would you document it for end-users?

**Definition:**

Документируйте API как контракт, который вызывающий может попробовать: URL, метод, поля, ошибки и разобранный пример. Проза «смотрите код» этим контрактом не является.

**How it works:**

- Документ OpenAPI (формат, который по-прежнему называют Swagger) описывает ресурсы, параметры и схемы в YAML или JSON. Инструменты превращают его в страницу, с которой можно отправить запрос. Swagger — более раннее имя этой спецификации.
- API Blueprint и RAML — другие форматы описания. Они решают ту же задачу: один машиночитаемый контракт.
- Справки, собранные из комментариев в исходниках (Javadoc, doc-комментарии), полезны для библиотеки. Для HTTP API они устаревают, если комментарий не порождён контрактом, а не наоборот.
- Коллекции Postman полезны как примеры и как тесты. Они плохи как единственная спецификация, потому что расходятся с сервером.
- Публикуйте аутентификацию, разбиение на страницы и каждый код ошибки. Рядом с версией держите список изменений.

**Examples:**

```yaml
paths:
  /invoices/{id}:
    get:
      parameters:
        - name: id
          in: path
          required: true
      responses:
        "200":
          description: The invoice
        "404":
          description: No such invoice
```

</details>

<details>
<summary>What considerations might influence how you paginate API responses?</summary>

### What considerations might influence how you paginate API responses?

**Definition:**

Разбиение на страницы — то, как конечная точка коллекции возвращает ограниченную страницу вместо всей таблицы. Выбранная схема должна оставаться верной, когда строки вставляют или удаляют по ходу обхода.

**How it works:**

- Смещение и предел (`?offset=40&limit=20`) просты. Они замедляются с ростом смещения, а строка, вставленная на первой странице, сдвигает все следующие, и клиент пропускает или повторяет элементы.
- Пагинация по ключу помнит последний возвращённый ключ и просит строки после него (`where id > 42 order by id limit 20`). Она остаётся быстрой и не плывёт, если ключ уникален и упорядочен. Прыгнуть на страницу 50 она не может.
- Метка времени работает так же, когда время монотонно и уникально. Совпадения требуют второго ключа.
- Курсор — непрозрачный токен этой позиции. Клиент относится к нему как к закладке, и ключ под ним можно менять. Для клиента это лучший контракт.
- Ещё решают размер страницы по умолчанию, максимум, обещанный порядок и можно ли кэшировать URL. О следующей странице сообщают ссылкой, а не заставляют клиента угадывать.

**Examples:**

```text
GET /invoices?limit=20
→ { "data": [ ... ], "next": "/invoices?limit=20&cursor=eyJpZCI6IjQyIn0" }

GET /invoices?limit=20&cursor=eyJpZCI6IjQyIn0
→ следующая страница, устойчивая, если сверху появился новый счёт
```

</details>

<details>
<summary>What is HATEOAS, and how does it relate to API design?</summary>

### What is HATEOAS, and how does it relate to API design?

**Definition:**

</details>

<details>
<summary>How would you handle localization and internationalization in APIs?</summary>

### How would you handle localization and internationalization in APIs?

**Definition:**

</details>

<details>
<summary>What are some best practices for designing error responses in an API?</summary>

### What are some best practices for designing error responses in an API?

**Definition:**

</details>

<details>
<summary>What are the benefits of using API Gateways?</summary>

### What are the benefits of using API Gateways?

**Definition:**

</details>

<details>
<summary>How would you approach handling file uploads in an API design?</summary>

### How would you approach handling file uploads in an API design?

**Definition:**

</details>

### API Performance and Scalability

<details>
<summary>How can caching be incorporated into API design to improve performance?</summary>

### How can caching be incorporated into API design to improve performance?

**Definition:**

</details>

<details>
<summary>What are some strategies for dealing with high traffic volumes in a scalable API?</summary>

### What are some strategies for dealing with high traffic volumes in a scalable API?

**Definition:**

</details>

<details>
<summary>How does connection pooling work and how can it benefit API performance?</summary>

### How does connection pooling work and how can it benefit API performance?

**Definition:**

</details>

<details>
<summary>When is it appropriate to use synchronous vs asynchronous processing in an API?</summary>

### When is it appropriate to use synchronous vs asynchronous processing in an API?

**Definition:**

</details>

<details>
<summary>What are some challenges of maintaining an API at scale?</summary>

### What are some challenges of maintaining an API at scale?

**Definition:**

</details>

### API Security Considerations

<details>
<summary>What are common security concerns when designing an API?</summary>

### What are common security concerns when designing an API?

**Definition:**

</details>

<details>
<summary>How do you prevent injection attacks in API design?</summary>

### How do you prevent injection attacks in API design?

**Definition:**

</details>

<details>
<summary>Can you explain what CORS is and why it’s important in API design?</summary>

### Can you explain what CORS is and why it’s important in API design?

**Definition:**

</details>

<details>
<summary>What is the purpose of an API key?</summary>

### What is the purpose of an API key?

**Definition:**

</details>

<details>
<summary>How would you implement authentication and authorization in APIs?</summary>

### How would you implement authentication and authorization in APIs?

**Definition:**

</details>

### Advanced API Design Concepts

<details>
<summary>What is the role of an API Gateway in microservices architecture?</summary>

### What is the role of an API Gateway in microservices architecture?

**Definition:**

</details>

<details>
<summary>Can you explain the concept of a headless API?</summary>

### Can you explain the concept of a headless API?

**Definition:**

</details>

<details>
<summary>How do GraphQL APIs differ from traditional RESTful APIs?</summary>

### How do GraphQL APIs differ from traditional RESTful APIs?

**Definition:**

</details>

<details>
<summary>What is gRPC and how might it be used in API design?</summary>

### What is gRPC and how might it be used in API design?

**Definition:**

</details>

<details>
<summary>How can WebSockets enhance API functionalities?</summary>

### How can WebSockets enhance API functionalities?

**Definition:**

</details>

### API Development and Testing

<details>
<summary>What tools or frameworks do you use to develop and test APIs?</summary>

### What tools or frameworks do you use to develop and test APIs?

**Definition:**

</details>

<details>
<summary>How would you test for API performance and what metrics would you track?</summary>

### How would you test for API performance and what metrics would you track?

**Definition:**

</details>

<details>
<summary>What is contract testing in the context of API development?</summary>

### What is contract testing in the context of API development?

**Definition:**

</details>

<details>
<summary>Describe the mocking of APIs for development and testing purposes.</summary>

### Describe the mocking of APIs for development and testing purposes.

**Definition:**

</details>

<details>
<summary>How can automated API testing improve the software development lifecycle?</summary>

### How can automated API testing improve the software development lifecycle?

**Definition:**

</details>

### API Data Management

<details>
<summary>How do you handle large volumes of data in API responses?</summary>

### How do you handle large volumes of data in API responses?

**Definition:**

</details>

<details>
<summary>How can an API be designed to support multiple data formats?</summary>

### How can an API be designed to support multiple data formats?

**Definition:**

</details>

<details>
<summary>What are best practices for managing sensitive data through an API?</summary>

### What are best practices for managing sensitive data through an API?

**Definition:**

</details>

<details>
<summary>In an API, how do you approach filtering and sorting of data?</summary>

### In an API, how do you approach filtering and sorting of data?

**Definition:**

</details>

<details>
<summary>Can you discuss strategies for transaction management within API endpoints?</summary>

### Can you discuss strategies for transaction management within API endpoints?

**Definition:**

</details>

### API Specification and Standards

<details>
<summary>Are you familiar with any API specification formats and what benefits do they provide?</summary>

### Are you familiar with any API specification formats and what benefits do they provide?

**Definition:**

</details>

<details>
<summary>How do you approach the design of an API to comply with industry standards?</summary>

### How do you approach the design of an API to comply with industry standards?

**Definition:**

</details>

<details>
<summary>How do you foresee OpenAPI/Swagger specifications evolving, and how do they impact API design?</summary>

### How do you foresee OpenAPI/Swagger specifications evolving, and how do they impact API design?

**Definition:**

</details>

<details>
<summary>How can APIs be designed with interoperability in mind?</summary>

### How can APIs be designed with interoperability in mind?

**Definition:**

</details>

<details>
<summary>How does a standard like JSON:API influence the way you structure response payloads?</summary>

### How does a standard like JSON:API influence the way you structure response payloads?

**Definition:**

</details>
