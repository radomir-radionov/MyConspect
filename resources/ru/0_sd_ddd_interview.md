# Domain-Driven Design — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Domain-Driven Design — собеседование](./0_sd_ddd_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Domain Driven Design](https://devinterview.io/questions/software-architecture-and-system-design/domain-driven-design-interview-questions/).

### DDD Fundamentals

<details>
<summary>What is Domain-Driven Design (DDD) and what are its core principles?</summary>

### What is Domain-Driven Design (DDD) and what are its core principles?

**Definition:**

Domain-Driven Design строит модель программы вокруг бизнеса, на языке, которым бизнес уже говорит, и режет модель там, где язык меняется.

**How it works:**

- Единый язык общий для кода, тестов и разговоров. Термин в модели значит то, что имеют в виду эксперты.
- Ограниченный контекст — граница одной модели. То же слово в соседнем контексте может значить другое.
- Тактические блоки живут внутри контекста: сущности, объекты-значения, агрегаты, события предметной области, репозитории и службы предметной области.
- Агрегаты рисуют границу согласованности. Репозитории их загружают и сохраняют. События предметной области объявляют то, что уже случилось.
- Модель — не схема базы. Хранение следует за моделью, а не наоборот.
</details>

<details>
<summary>How does DDD differ from traditional data-driven or service-driven approaches?</summary>

### How does DDD differ from traditional data-driven or service-driven approaches?

**Definition:**

Проектирование от данных начинает с таблиц и даёт схеме диктовать код. Проектирование от сервисов начинает с процедур. DDD начинает с бизнес-правил и слов, которыми их формулируют.

**How it works:**

- Код от данных часто зеркалит таблицы: один класс на таблицу, поведение размазано по запросам.
- Процедурный слой сервисов может стать местом, куда падает каждое правило, а сущности — только мешки полей.
- DDD кладёт инварианты в модель. Заказ отказывается от пустой строки, а не ждёт, что сервис вспомнит проверку.
- Хранение стоит за репозиторием. Вызывающие не собирают SQL, чтобы удержать правило.
- Владение правилом сидит в одном контексте, а не в общем сервисе-боге.

**Examples:**

Data-driven `placeOrder` вставляет строки и надеется, что суммы сойдутся. `Order.addItem` в модели предметной области отвергает количество меньше единицы до любого сохранения.
</details>

<details>
<summary>What is the difference between the Domain Model and the Data Model in DDD?</summary>

### What is the difference between the Domain Model and the Data Model in DDD?

**Definition:**

Модель предметной области — бизнес-правила в коде. Модель данных — как эти факты хранятся. Им разрешено выглядеть по-разному.

**How it works:**

- Модель предметной области использует сущности, объекты-значения и методы, которые берегут инварианты. Имён таблиц она не знает.
- Модель данных использует таблицы, документы или события. Она может разложить один агрегат по строкам или упаковать в один документ.
- Репозиторий переводит между ними при загрузке и сохранении.
- Смена колонки не должна переименовывать бизнес-понятие, а переименование понятия не должно требовать протекающего запроса в предметной области.

**Examples:**

```text
предметная область: Order.addItem(sku, qty) отвергает qty < 1
данные:             строка orders + строки order_items
репозиторий:        грузит оба, возвращает один Order
```
</details>

<details>
<summary>Can you explain what Bounded Contexts are in DDD, and why they are important?</summary>

### Can you explain what Bounded Contexts are in DDD, and why they are important?

**Definition:**

Ограниченный контекст — предел, внутри которого модель и её словарь согласованы. За этим пределом не считают, что то же слово значит то же самое.

**How it works:**

- «Customer» может быть лидом в продажах и счётом в биллинге. Один класс на оба делает обе модели хуже.
- Контекст — ещё и граница команды. Одна команда может менять модель без собрания про каждый другой модуль.
- Интеграция явная: API, событие или слой перевода. Общей изменяемой модели нет.
- Микросервис часто реализует один контекст, потому что единица поставки тогда совпадает с единицей модели.

**Examples:**

Продажи хранят скоринг лида. Биллинг хранит баланс. Они публикуют LeadConverted. Таблицу Customer они не делят.
</details>

<details>
<summary>What strategies can you use to define Bounded Contexts in a large system?</summary>

### What strategies can you use to define Bounded Contexts in a large system?

**Definition:**

Контекст рисуют там, где язык, правила и люди, которые их меняют, уже образуют сгусток.

**How it works:**

- Слушают, где слова меняют смысл. Эта смена — граница.
- Идут по бизнес-процессу, пока данные и инварианты меняются вместе.
- Выравнивают по командам. Контекст, которым «владеют» два отдела, разорвут. Закон Конвея — предупреждение.
- Предпочитают границу, которую можно выкладывать и развивать без синхронного релиза.
- Связное поведение держат внутри. Если каждое изменение A меняет и B, это, скорее всего, один контекст.

**Examples:**

«Order» в магазине — корзина, которую оплачивают. «Order» на складе — лист отбора. Два контекста, хотя бизнес использует одно слово.
</details>

<details>
<summary>How do you integrate multiple Bounded Contexts within a single system?</summary>

### How do you integrate multiple Bounded Contexts within a single system?

**Definition:**

Контексты стыкуются явным отношением, а не общей базой. Карта контекстов называет это отношение.

**How it works:**

- Партнёрство: две команды меняют контракт вместе.
- Заказчик–поставщик: вышестоящая команда даёт то, что нужно нижестоящей, по согласованному ритму.
- Конформист: нижестоящая команда берёт модель вышестоящей как есть и не переводит.
- Слой защиты от искажений переводит чужую модель, чтобы она не протекла в вашу.
- Общее ядро — маленький кусок, который обе стороны правда делят, например объект-значение денег, версионируемый нарочно. Это не общий бизнес-модуль.
- События и API несут факты через границу. Каждая сторона отображает их в свой язык.

**Examples:**

Биллинг говорит «invoice». Доставка говорит «consignment». Слой защиты в доставке превращает InvoicePaid в отправление, которое она понимает, и имена классов биллинга не появляются в модели доставки.
</details>

<details>
<summary>Why is Ubiquitous Language important in DDD, and how do you establish it?</summary>

### Why is Ubiquitous Language important in DDD, and how do you establish it?

**Definition:**

Единый язык — один словарь контекста, в речи, задачах и коде. Он важен, потому что щель перевода — место, где строят неверное правило.

**How it works:**

- Собирают существительные и глаголы, которые эксперты реально используют. Эти имена предпочитают в типах и методах.
- Когда эксперты расходятся в слове, у вас либо два контекста, либо понятие ещё не устаканилось. Не замазывайте это расплывчатым именем класса.
- Тесты и имена событий используют те же слова, поэтому падающий тест читается как бизнес-правило.
- Синонимы выбрасывают. Если на оплате бизнес говорит «покупатель», код там не должен говорить `User`.

**Examples:**

Эксперты говорят «зарезервировать склад», а не «обновить строку инвентаря». Метод — `Stock.reserve(sku, qty)`. Позднему читателю не нужно переводить.
</details>

<details>
<summary>What is the role of Entities in DDD, and how do they differ from Value Objects?</summary>

### What is the role of Entities in DDD, and how do they differ from Value Objects?

**Definition:**

Сущность определяется устойчивой личностью, которая переживает смену атрибутов. Объект-значение определяется только атрибутами и своей личности не имеет.

**How it works:**

- Две сущности — одни и те же, когда совпали id, даже если поле изменилось. Заказ остаётся тем заказом после добавления строки.
- Два объекта-значения — одни и те же, когда совпал каждый атрибут. Два `Money(10, EUR)` взаимозаменяемы.
- У сущностей есть жизненный цикл. Объекты-значения заменяют, а не мутируют: новый адрес сменяет старый.
- Объекты-значения неизменяемы, чтобы их можно было делить и сравнивать без сюрпризов.
- Сущности — то, что ищут. Объекты-значения их описывают: деньги, диапазон дат, количество.

**Examples:**

`Order` с id 9 — одна сущность. Его сумма `Money` — объект-значение. Смена суммы заменяет значение денег. Второй заказ она не создаёт.
</details>

<details>
<summary>How would you identify Aggregates in a domain model, and what boundary rules apply to them?</summary>

### How would you identify Aggregates in a domain model, and what boundary rules apply to them?

**Definition:**

Агрегат — сгусток сущностей и объектов-значений, которые должны оставаться согласованными вместе, с одной сущностью-корнем. Граница — наибольший набор, который вы готовы запереть в одной транзакции.

**How it works:**

- Начинают с инварианта. «Сумма заказа равна его строкам» значит, что строки живут внутри агрегата заказа.
- Внешний код держит только id корня. Он не лезет внутрь и не мутирует ребёнка.
- Агрегаты держат маленькими. Агрегат клиента, который содержит каждый заказ, запирает слишком много.
- Одна транзакция меняет один агрегат. Другой агрегат узнаёт об этом через событие предметной области.
- На другие агрегаты ссылаются по id, а не живым указателем на объект.

**Examples:**

Order — корень. Строки заказа живут внутри. Клиент — другой агрегат, на заказе хранится `customerId`. Оплата заказа не грузит всю историю клиента.
</details>

<details>
<summary>Can you explain what a Domain Event is and give an example of when it might be used?</summary>

### Can you explain what a Domain Event is and give an example of when it might be used?

**Definition:**

Событие предметной области — факт, который модель уже зафиксировала, названный на едином языке. Другие части системы реагируют на него, а не вызываются напрямую.

**How it works:**

- Имя в прошедшем времени: OrderPlaced, StockReserved. Это не команда.
- Оно несёт id и данные, которые нужны подписчику, а не весь агрегат.
- Внутри контекста оно может обновить другой агрегат после первого commit. Между контекстами это сообщение интеграции.
- Обработчики должны терпеть, что событие увидят больше одного раза.

**Examples:**

Когда заказ размещён, агрегат фиксирует OrderPlaced. Доставка начинает отправление. Почта шлёт чек. Агрегат заказа не вызывает ни то, ни другое.
</details>

### Tactical Design in DDD

<details>
<summary>How do Repositories function in DDD and what is their main responsibility?</summary>

### How do Repositories function in DDD and what is their main responsibility?

**Definition:**

Репозиторий притворяется, что агрегаты — коллекция в памяти. Его работа — загрузить и сохранить целый агрегат и скрыть, как это хранится.

**How it works:**

- Вызывающие просят агрегат по id или по предметному запросу и получают корень с согласованными детьми.
- Save пишет весь агрегат. Вызывающие сами дочернюю таблицу не обновляют.
- Интерфейс живёт в предметной области. Реализация на SQL или документах — снаружи.
- Это не общий API запросов для экранов. Модель чтения может отдавать списки, не проходя через агрегат.

**Examples:**

`orders.get(id)` возвращает Order. `orders.save(order)` пишет заказ и его строки. Сервис приложения никогда не видит таблицу `order_items`.
</details>

<details>
<summary>What is the difference between a Repository and a Service in DDD?</summary>

### What is the difference between a Repository and a Service in DDD?

**Definition:**

Репозиторий загружает и сохраняет агрегаты. Служба предметной области держит бизнес-правило, которое естественно не принадлежит одной сущности.

**How it works:**

- Если операция — «дай этот заказ» или «сохрани этот заказ», это репозиторий.
- Если операция — «оцени эту отправку по тарифу и адресу», и ни один объект не должен владеть другим, это служба предметной области.
- У репозитория нет бизнес-политики сверх восстановления годного агрегата.
- Служба не должна стать местом, которое лезет во внутренности чужого агрегата. Она говорит с корнями или с другими службами.

**Examples:**

`OrderRepository.save` сохраняет заказ. `TransferService.move(from, to, amount)` — служба предметной области, потому что правило охватывает два счёта и не живёт ни в одном из них в одиночку.
</details>

<details>
<summary>How would you handle complex domain logic that involves multiple entities and value objects?</summary>

### How would you handle complex domain logic that involves multiple entities and value objects?

**Definition:**

Правило кладут на корень агрегата, если сущности делят одну границу согласованности. Если нет — публикуют событие и дают другому агрегату решить.

**How it works:**

- Корень — единственная дверь. `Order.addItem` проверяет количество, пересчитывает денежную сумму и отвергает сломанный заказ.
- Объекты-значения вроде Money и Quantity несут мелкие правила: сумма не отрицательна, валюта известна.
- Защитные условия падают до изменения состояния, поэтому полуобновлённый агрегат никогда не сохраняется.
- Правило через агрегаты — eventual. Первый агрегат фиксируется, событие хранится с этим commit, второй агрегат реагирует.
- Не растите агрегат только чтобы сделать правило синхронным. Большой агрегат — большая блокировка.

**Examples:**

`Order.addItem` отвергает вторую лампу, когда строки превысили бы лимит покупателя, хранящийся на заказе. Кредитный лимит клиента живёт на агрегате Customer и проверяется службой предметной области до открытия заказа, а не залезанием в Customer из Order.
</details>

<details>
<summary>Can you delineate the role of a Domain Service versus an Application Service?</summary>

### Can you delineate the role of a Domain Service versus an Application Service?

**Definition:**

Служба предметной области — бизнес-правило без естественного дома на одной сущности. Служба приложения — координатор сценария: грузит агрегаты, зовёт модель и сохраняет.

**How it works:**

- Служба предметной области: на входе чистые типы предметной области, на выходе предметный результат. Без HTTP, без API транзакций, без репозитория, если можно обойтись.
- Служба приложения: один сценарий. Она открывает транзакцию, достаёт агрегаты, зовёт предметную область, публикует события и фиксирует.
- Бизнес-если живут в предметной области. «Что делать, когда клиент зовёт этот endpoint» живёт в службе приложения.
- Если служба приложения сама начинает проверять количества, модель обошли.

**Examples:**

`PricingService.quote(shipment, tariff)` — предметная область: она возвращает Money. `BookShipmentService` — приложение: она грузит отправление, зовёт `quote`, резервирует склад и сохраняет.
</details>

<details>
<summary>What considerations are there for implementing Aggregates to ensure transactional consistency?</summary>

### What considerations are there for implementing Aggregates to ensure transactional consistency?

**Definition:**

Транзакционная согласованность кончается на агрегате. Одна транзакция сохраняет один агрегат, а проверка версии отвергает устаревшую запись.

**How it works:**

- Грузят агрегат, меняют его только через корень, сохраняют. Инвариант держится на commit, либо commit не случается.
- Оптимистичная конкуренция хранит версию. Два писателя одного заказа: второе сохранение падает и повторяется уже с новой версией.
- Не используйте двухфазный commit, чтобы втащить другой агрегат в ту же транзакцию. Вместо этого публикуйте событие предметной области.
- Таблица outbox в той же транзакции, что и агрегат, делает событие устойчивым вместе с изменением состояния.
- Агрегат держат маленьким, чтобы блокировка или конфликт версии оставались редкими.

**Examples:**

```text
загрузить заказ версии 4
добавить позицию
сохранить where version = 4, set version = 5
параллельное сохранение всё ещё на версии 4 падает и перечитывает
```
</details>

<details>
<summary>How do you deal with performance issues when loading large Aggregates?</summary>

### How do you deal with performance issues when loading large Aggregates?

**Definition:**

</details>

<details>
<summary>In what scenarios might you use a Specification pattern in DDD?</summary>

### In what scenarios might you use a Specification pattern in DDD?

**Definition:**

</details>

<details>
<summary>What are some Domain Modeling strategies to enforce invariants within an Aggregate?</summary>

### What are some Domain Modeling strategies to enforce invariants within an Aggregate?

**Definition:**

</details>

<details>
<summary>Can you discuss strategies for dealing with concurrency and synchronization within Aggregates?</summary>

### Can you discuss strategies for dealing with concurrency and synchronization within Aggregates?

**Definition:**

</details>

### Domain Events and Event Sourcing

<details>
<summary>How can Domain Events help in designing a loosely coupled system?</summary>

### How can Domain Events help in designing a loosely coupled system?

**Definition:**

</details>

<details>
<summary>What is Event Sourcing, and how does it differ from standard persistence mechanisms?</summary>

### What is Event Sourcing, and how does it differ from standard persistence mechanisms?

**Definition:**

</details>

<details>
<summary>Can you explain how CQRS (Command Query Responsibility Segregation) complements DDD?</summary>

### Can you explain how CQRS (Command Query Responsibility Segregation) complements DDD?

**Definition:**

</details>

<details>
<summary>In what situations would you choose to implement Event Sourcing in a DDD context?</summary>

### In what situations would you choose to implement Event Sourcing in a DDD context?

**Definition:**

</details>

<details>
<summary>How do you typically handle events that should trigger side effects in other Bounded Contexts?</summary>

### How do you typically handle events that should trigger side effects in other Bounded Contexts?

**Definition:**

</details>

### Strategic Design and DDD Implementation

<details>
<summary>How does DDD address the issue of complex domain logic changes over time?</summary>

### How does DDD address the issue of complex domain logic changes over time?

**Definition:**

</details>

<details>
<summary>Describe the concept of a context map in DDD and its purpose.</summary>

### Describe the concept of a context map in DDD and its purpose.

**Definition:**

</details>

<details>
<summary>What is the Anti-Corruption Layer in DDD, and when would you use one?</summary>

### What is the Anti-Corruption Layer in DDD, and when would you use one?

**Definition:**

</details>

<details>
<summary>How might you implement a Policy in DDD, and what are its advantages?</summary>

### How might you implement a Policy in DDD, and what are its advantages?

**Definition:**

</details>

<details>
<summary>Can you give an example of how DDD can coexist with microservices architecture?</summary>

### Can you give an example of how DDD can coexist with microservices architecture?

**Definition:**

</details>

<details>
<summary>What factors would influence the decision to refactor a legacy system with a DDD approach?</summary>

### What factors would influence the decision to refactor a legacy system with a DDD approach?

**Definition:**

</details>

### Advanced DDD Concepts

<details>
<summary>Explain how DDD principles can be applied at different scales in a software project.</summary>

### Explain how DDD principles can be applied at different scales in a software project.

**Definition:**

</details>

<details>
<summary>How can DDD help in understanding and aligning complex organizational structures?</summary>

### How can DDD help in understanding and aligning complex organizational structures?

**Definition:**

</details>

<details>
<summary>How does DDD assist in creating a pluggable component architecture?</summary>

### How does DDD assist in creating a pluggable component architecture?

**Definition:**

</details>

<details>
<summary>How does DDD help manage distributed systems complexity, particularly in consistency management?</summary>

### How does DDD help manage distributed systems complexity, particularly in consistency management?

**Definition:**

</details>

<details>
<summary>What are the challenges involved in implementing DDD in a large, multidisciplinary team?</summary>

### What are the challenges involved in implementing DDD in a large, multidisciplinary team?

**Definition:**

</details>

### Practical Considerations

<details>
<summary>What are common pitfalls when transitioning an existing project to DDD?</summary>

### What are common pitfalls when transitioning an existing project to DDD?

**Definition:**

</details>

<details>
<summary>How do you measure the success of DDD implementation in a project?</summary>

### How do you measure the success of DDD implementation in a project?

**Definition:**

</details>

<details>
<summary>What tools or frameworks are supportive of DDD and why?</summary>

### What tools or frameworks are supportive of DDD and why?

**Definition:**

</details>

<details>
<summary>How would you address the training and knowledge transfer needed for a team new to DDD?</summary>

### How would you address the training and knowledge transfer needed for a team new to DDD?

**Definition:**

</details>

<details>
<summary>Can you provide an example of a project where DDD provided clear benefits over other design approaches?</summary>

### Can you provide an example of a project where DDD provided clear benefits over other design approaches?

**Definition:**

</details>
