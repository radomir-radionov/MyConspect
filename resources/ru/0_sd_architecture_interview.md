# Software Architecture — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Software Architecture — собеседование](./0_sd_architecture_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Software Architecture](https://devinterview.io/questions/software-architecture-and-system-design/software-architecture-interview-questions/).

### Software Architecture Fundamentals

<details>
<summary>What is the difference between software architecture and software design?</summary>

### What is the difference between software architecture and software design?

**Definition:**

Архитектура решает форму системы: крупные части, как они соединены и какие качества эта форма должна защищать. Проектирование решает, как часть построена внутри этих решений.

**How it works:**

- Архитектура — более широкий охват. Она называет компоненты, соединители и ограничения, которые дорого менять: границы процессов, владение данными, основные протоколы.
- Проектирование уже. Оно выбирает классы, алгоритмы и схемы внутри одного компонента.
- Архитектура остаётся устойчивой через много релизов, и ей владеют те, кто видит всю систему. Проектирование меняется с функцией, и им владеет команда, которая её строит.
- Оба заботятся о атрибутах качества. Архитектура разменивает их на уровне системы (задержка против согласованности). Проектирование разменивает их внутри модуля.
- Архитектурная ошибка проявляется как перерисовка системы. Ошибка проектирования — рефакторинг внутри границы.
- Записывайте архитектурные решения, чтобы позднее проектирование молча их не пересекало.

**Examples:**

«Заказы и платежи — отдельные сервисы со своими базами» — архитектура. «Платёж хранит токен карты в этой таблице и повторяет с такой паузой» — проектирование внутри платёжного сервиса.
</details>

<details>
<summary>Explain separation of concerns in software architecture.</summary>

### Explain separation of concerns in software architecture.

**Definition:**

Разделение ответственности даёт каждой части системы одну причину меняться и не пускает в неё другие причины.

**How it works:**

- Ответственность — это забота: отрисовка, бизнес-правила, хранение, аутентификация.
- Один модуль — одна забота. Это идея единственной ответственности выше уровня классов.
- Низкая связанность значит, что смена хранения не заставляет править UI. Высокая связность значит, что код, который должен быть вместе, действительно лежит вместе.
- Границы — интерфейсы. Пересекают их вызовом или сообщением, а не залезанием во внутренности другого модуля.
- Сквозные заботы (журналы, безопасность) выносят в middleware, чтобы их не копировали в каждый модуль.

**Examples:**

```text
class AdminAudit:      # who changed a role
    def record(self, actor, change): ...

class UserAccount:     # the account itself
    def rename(self, name): ...
```

Аудит не запихнут в `rename`. Учётная запись не знает, как хранятся строки аудита.
</details>

<details>
<summary>Define a system quality attribute and its importance in software architecture.</summary>

### Define a system quality attribute and its importance in software architecture.

**Definition:**

Атрибут качества — измеримое свойство работающей системы, например задержка, доступность или то, насколько трудно её менять. Архитектура во многом существует, чтобы выбранные атрибуты были достижимы.

**How it works:**

- Функциональные требования говорят, что система делает. Атрибуты качества — насколько хорошо: как быстро, как часто она доступна, насколько безопасна, насколько легко меняется.
- Они заставляют разменивать. Сильная согласованность стоит доступности при разделении сети. Дублирование сервисов поднимает доступность и операционную цену.
- Называйте их рано. Проект, который их игнорирует, обнаруживает промах в проде, когда структуру дорого переделывать.
- Частые: производительность, надёжность, доступность, безопасность, масштабируемость, изменяемость и удобство.
- Делайте их проверяемыми. «Быстро» — не атрибут. «p95 оформления заказа ниже 300 мс» — атрибут. Функции пригодности и нагрузочные тесты проверяют число.
- Архитектурное ревью проходит сценарии («основная база лежит») и спрашивает, какой атрибут ломается.

**Examples:**

Доступность 99.9% толкает к больше чем одному экземпляру и проверке здоровья. Команда, которая нарисовала только прямоугольники счастливого пути, этот атрибут ещё не спроектировала.
</details>

<details>
<summary>Describe the concept of a software architectural pattern.</summary>

### Describe the concept of a software architectural pattern.

**Definition:**

Архитектурный шаблон — именованное, переиспользуемое расположение частей и правил для повторяющейся проблемы системы. Он крупнее шаблона проектирования на уровне класса.

**How it works:**

- Шаблон говорит, какие виды компонентов есть, как они общаются и чем вы жертвуете.
- Знакомые: слои, MVC, микросервисы, событийная публикация-подписка, каналы и фильтры.
- Ограничения принимают намеренно. MVC держит отрисовку вне модели. Микросервисы принимают сетевой сбой в обмен на независимые выкладки.
- Берите шаблон, который можете объяснить. Растягивать его на задачу, которую он не решает, хуже небольшой собственной формы.
- Шаблоны помогают новому человеку узнать систему и помогают командам говорить об одних и тех же прямоугольниках.
- Они не заменяют работу над атрибутами качества. Две системы микросервисов могут сильно различаться по доступности.

**Examples:**

Каталог товаров, который в основном страницы поверх базы, ложится на слои. Поток событий «заказ оплачен», который потребляют несколько команд, ложится на публикацию-подписку. Выбирать микросервисы, потому что схема выглядит современно, при одной команде и одной базе — значит добавить только сеть.
</details>

<details>
<summary>What is the layered architectural pattern?</summary>

### What is the layered architectural pattern?

**Definition:**

Слоистый шаблон складывает систему так, что каждый слой зависит только от слоя под ним. Ответственности и направление вызовов фиксированы.

**How it works:**

- Типичные слои: представление, предметная или прикладная логика и доступ к данным. Иногда под доменом лежит отдельный слой интеграции.
- Запрос входит сверху и вызывает вниз. Нижний слой не вызывает вверх и не перепрыгивает уровень, чтобы трогать состояние UI.
- Выигрыш — устойчивая структура, заменяемые части и место, где можно масштабировать один слой.
- Он подходит веб-приложениям и корпоративным системам со многими пользователями и ясным путём запроса.
- Цены — лишние проходы по стеку и жёсткость, когда функции нужен короткий путь. Тогда слой обходят, и шаблон тихо умирает.
- Закрытые слои (обязательно звать следующий) строже. Открытые разрешают задокументированный пропуск.

**Examples:**

```text
HTTP handler -> OrderService -> OrderRepository -> SQL
```

Обработчик не импортирует драйвер SQL. Репозиторий не знает коды статуса.
</details>

<details>
<summary>What are the elements of a good software architecture?</summary>

### What are the elements of a good software architecture?

**Definition:**

Хорошая архитектура делает части системы, соединения и пределы явными и всё ещё может выполнить атрибуты качества, пока продукт меняется.

**How it works:**

- Компоненты делают работу. Соединители (вызовы, очереди, файлы) переносят данные и управление. Ограничения говорят, что запрещено, например делить базу между сервисами.
- Предпочитайте модульность, высокую связность, низкую связанность и простейшую форму, которая выполняет качества.
- Технические выборы (ярусы, хранилища, синхронно или асинхронно) должны следовать этим ограничениям, а не вести их.
- Шаблоны — инструменты, не цель. Интеграции с внешними системами — соединители со своими видами отказов.
- Архитектура должна говорить, как вы выкладываете, наблюдаете и меняете её. Схема без операционной истории неполна.
- «Хорошо» — пригодность для атрибутов этой системы, а не чеклист модных прямоугольников.

**Examples:**

Читаемая архитектура магазина называет сервис заказов, платёжную очередь, правило «платежи владеют своей базой» и цель: p95 оформления ниже 300 мс, когда один экземпляр платежей лежит.
</details>

<details>
<summary>Define “modularity” in software architecture.</summary>

### Define “modularity” in software architecture.

**Definition:**

Модульность — это разрез системы на части с ясным нутром и маленькой наружностью, чтобы часть можно было менять, переиспользовать или строить параллельно, не таща остальное.

**How it works:**

- Инкапсуляция прячет нутро. Вызывающие пользуются интерфейсом.
- Высокая связность держит одну причину меняться внутри модуля. Слабая связанность не пускает другие модули к этой причине.
- Абстракция — это интерфейс: обещание, а не реализация.
- Модуль можно заменить, проверить отдельно и отдать другой команде.
- В реальных системах: приложение Android делит функции на модули, облачная система делит выкладываемые части, игра делит симуляцию и отрисовку.
- Граница модуля, через которую текут его таблицы, — это папка, а не модуль.

**Examples:**

`Billing` открывает `charge(orderId)`. Вызывающие не запрашивают его таблицы. Команда может сменить процессор карт за этой функцией без изменения в оформлении заказа.
</details>

<details>
<summary>Discuss the concepts of coupling and cohesion.</summary>

### Discuss the concepts of coupling and cohesion.

**Definition:**

Связность — насколько модуль сосредоточен. Связанность — насколько один модуль должен знать о другом. Нужны высокая связность и низкая связанность.

**How it works:**

- Высокая связность: части внутри модуля меняются по одной причине. Модуль цен, который ещё и шлёт почту, делает две работы.
- Низкая связанность: модули взаимодействуют через маленький интерфейс. Изменение внутри одного не расходится волной.
- Тесная связанность — это общая база, вызовы конкретных классов или зависимость от порядка вызовов, который другой модуль не обещал.
- Низкая связность делает модуль трудным для имени, теста и повторного использования. Тесная связанность мешает менять одну сторону отдельно.
- Они двигаются вместе. Разрез модуля-свалки поднимает связность. Если новые части всё ещё делят внутренности, связанность остаётся высокой, и вы только добавили файлы.

**Examples:**

Обработчик формы, который проверяет, пишет SQL и рисует HTML, имеет низкую связность и тесно связан с базой и страницей. Разделите его на валидатор, репозиторий и представление. Валидатор можно переиспользовать и проверить без базы.
</details>

<details>
<summary>What is the principle of least knowledge (Law of Demeter) in architecture?</summary>

### What is the principle of least knowledge (Law of Demeter) in architecture?

**Definition:**

Закон Деметры говорит, что единица должна говорить только со своими прямыми сотрудниками, а не с объектами, которые она находит, проходя сквозь них.

**How it works:**

- Метод может вызывать свои поля, свои аргументы и объекты, которые создаёт. Он не должен идти цепочкой по внутренностям соседа (`order.customer.address.city`).
- «Не разговаривай с незнакомцами» и «говори только с ближайшими друзьями» — то же правило словами.
- Смысл в локальности: смена того, как хранятся адреса, не должна пересобирать каждого вызывающего, которому нужен был только город.
- Отношение к сотруднику как к чёрному ящику держит границы архитектуры настоящими. Цепочка геттеров — дырявая граница.
- Это эвристика. Объект передачи данных, который явно является мешком полей, — не то же нарушение, что предметная логика, пролезающая через три сервиса.

**Examples:**

```text
# reaches through strangers
ship_to(order.customer.address.city)

# ask the friend
ship_to(order.delivery_city())
```

`Order` прячет, живёт ли город на покупателе, на отгрузке или в справочнике.
</details>

<details>
<summary>How are cross-cutting concerns addressed in software architecture?</summary>

### How are cross-cutting concerns addressed in software architecture?

**Definition:**

Сквозная забота применяется ко многим частям системы (журналы, авторизация, транзакции, метрики) и не принадлежит внутрь каждой из них. Архитектура даёт ей один механизм.

**How it works:**

- Middleware и фильтры оборачивают запрос: аутентифицировать, затем записать в журнал, затем вызвать обработчик. Обработчик остаётся на бизнес-правиле.
- Инструменты в стиле аспектов выполняют кусок кода в точке соединения (перед каждым вызовом репозитория), чтобы забота была написана один раз.
- Платформенный сервис может впитать заботу: шлюз делает TLS и лимиты, менеджер транзакций проводит границу, библиотека делает запрос, чтобы обработчики не повторяли шаблон доступа к данным.
- События могут нести аудит подписчиком, а не строкой в каждом методе.
- Плохой исход — размазывание: скопированные проверки авторизации, которые разъезжаются. Другой плохой исход — спрятать в обёртке столько, что реальный поток никто не видит.
- Держите механизм явным и упорядоченным. Документируйте, через что проходит каждый запрос.

**Examples:**

Каждый HTTP-вызов проходит одно middleware аутентификации и одно middleware метрик. Обработчики сами не читают cookie сессии. Добавить идентификатор запроса значит поправить middleware, а не восемьдесят контроллеров.
</details>

### Design Patterns and Principles

<details>
<summary>Describe the Model-View-Controller (MVC) architectural pattern.</summary>

### Describe the Model-View-Controller (MVC) architectural pattern.

**Definition:**

MVC делит интерактивное приложение на данные и правила (модель), представление (вид) и переводчик, который обрабатывает ввод (контроллер).

**How it works:**

- Модель держит состояние и операции, которые его меняют. Она не знает про HTML или пиксели.
- Вид рисует модель. Он не решает бизнес-правила.
- Контроллер принимает ввод, вызывает модель и выбирает вид.
- Частый поток однонаправленный: ввод в контроллер, контроллер обновляет модель, вид читает модель. Некоторые UI-инструменты также позволяют виду наблюдать модель.
- Плюсы: экран и правила можно делать параллельно, виды можно заменять, модель можно проверять без браузера.
- Минусы: толстый контроллер, который впитал правила, или вид, который ходит в базу, схлопывают разрез. Маленькая функция может ощущаться как три файла на одно изменение.

**Examples:**

`POST /orders` попадает в `OrderController`, который вызывает `Order.place`. Контроллер затем рисует `order/show` с сохранённым заказом. Шаблон не считает налог. Модель не пишет строки HTTP-статуса.
</details>

<details>
<summary>Explain the Publish-Subscribe pattern and its applications.</summary>

### Explain the Publish-Subscribe pattern and its applications.

**Definition:**

Публикация-подписка связывает производителей и потребителей через события. Издатели не знают, кто слушает. Подписчики не знают, кто сказал.

**How it works:**

- Издатель выдаёт сообщение в тему или под именем события.
- Брокер или посредник доставляет его текущим подписчикам. Любая сторона может появляться и исчезать.
- Подписчики реагируют сами. Издатель их не ждёт, если вы не добавили отдельный путь запроса.
- Это берут для рассылки (один заказ оплачен, много реакций), для развязки команд и для работы, которая может чуть задержаться.
- Трудные места: гарантии доставки, порядок, повторные сообщения и видимость всего потока, когда нет одного вызывающего.
- Плохой выбор, когда вызывающему нужен ответ, прежде чем он ответит пользователю.

**Examples:**

`OrderPaid` публикуется один раз. Склад уменьшает остаток, почта шлёт чек, аналитика записывает выручку. Добавить проверку мошенничества — это новый подписчик. Сервис заказов не пересобирают.
</details>

<details>
<summary>Define Microservices architecture and contrast it with Monolithic architecture.</summary>

### Define Microservices architecture and contrast it with Monolithic architecture.

**Definition:**

Монолит — одна выкладка с одной кодовой базой и обычно одной базой данных. Микросервисы — отдельно выкладываемые процессы, каждый владеет возможностью и своими данными.

**How it works:**

- Монолит проще запускать, отлаживать и обернуть в одну транзакцию. Трудно масштабировать одну горячую точку, давать командам выпускать отдельно и менять стек одной части.
- Микросервис маленький, со своим жизненным циклом, и говорит по сети. Команды могут выпускать и масштабировать его независимо и выбрать подходящее хранилище.
- Цены переезжают в эксплуатацию: обнаружение, частичный сбой, распределённые данные и трассировка запроса через процессы.
- Монолит, который всё ещё легко менять, не обязан быть разрезан. Режьте по границам изменений, когда одна выкладка стала узким местом.
- «Микро» — про независимое изменение, а не про наименьший возможный процесс.

**Examples:**

Один бинарник магазина и одна база — монолит: правка цен перевыкладывает и оформление заказа. После разреза pricing выкладывается один и держит свои таблицы. Checkout его вызывает и должен пережить таймаут.
</details>

<details>
<summary>What are the SOLID principles of object-oriented design?</summary>

### What are the SOLID principles of object-oriented design?

**Definition:**

SOLID — пять правил, чтобы объектный дизайн было легко менять: одна причина меняться, расширение вместо правок, подставляемые типы, маленькие интерфейсы и зависимости, направленные на абстракции.

**How it works:**

- Единственная ответственность: класс меняется по одной причине. Разделите класс, который и считает налог, и шлёт почту.
- Открыт-закрыт: поведение добавляют новым кодом (новый тип или стратегия), а не правкой стабильного класса на каждый случай.
- Подстановка Лисков: подтип должен держать контракт базового типа. «Квадрат», который ломает независимые ширину и высоту прямоугольника, не является заменой.
- Разделение интерфейса: вызывающие не должны зависеть от методов, которыми не пользуются. Предпочтительнее маленький `Readable`, чем толстый `Store`.
- Инверсия зависимости: политика высокого уровня зависит от интерфейса. Адаптер базы его реализует, а не наоборот.
- Это правила проектирования внутри модуля. Сами по себе они не выбирают сервисы или базу.

**Examples:**

`OrderService` зависит от `PaymentGateway`. `StripeGateway` и `FakeGateway` оба его реализуют. Тесты передают подделку. Добавление второго провайдера не правит правила заказа.
</details>

<details>
<summary>When should the Singleton pattern be applied and what are its drawbacks?</summary>

### When should the Singleton pattern be applied and what are its drawbacks?

**Definition:**

Одиночка — тип, который допускает только один экземпляр, с глобальным способом его достать. Используйте его только для настоящего ресурса на весь процесс, чья единственность и есть смысл.

**How it works:**

- Разумные случаи: одно соединение к журналу на процесс или конфигурация только для чтения, загруженная один раз, когда программа действительно должна делить этот объект.
- Экземпляр обычно создают при первом обращении и кладут в статическое поле. Все вызывают `getInstance()`.
- Минусы: спрятанное глобальное состояние. Тесты не могут подставить подделку без дополнительной машинерии. Порядок создания и первый одновременный доступ требуют осторожности.
- Он связывает каждого вызывающего с конкретным типом, что спорит с инверсией зависимости.
- В кластере «один экземпляр» — неправда: у каждого процесса свой. Одиночка не координирует машины.
- Предпочтительнее передать зависимость. Если один экземпляр всё же нужен, создайте его один раз в корне композиции и раздайте. Вы получаете один объект без глобального поиска.

**Examples:**

Фасад журнала, созданный в `main` и переданный в сервисы, — один объект без одиночки. `Metrics.getInstance()`, вызванный из предметного кода, прячет зависимость, и тест делит состояние с предыдущим тестом.
</details>

<details>
<summary>Define the Repository pattern and its use cases.</summary>

### Define the Repository pattern and its use cases.

**Definition:**

</details>

<details>
<summary>Describe the Service-Oriented Architecture (SOA) pattern and its components.</summary>

### Describe the Service-Oriented Architecture (SOA) pattern and its components.

**Definition:**

</details>

<details>
<summary>Explain the Decorator pattern with an example.</summary>

### Explain the Decorator pattern with an example.

**Definition:**

</details>

<details>
<summary>What is the Command pattern and its implementation?</summary>

### What is the Command pattern and its implementation?

**Definition:**

</details>

<details>
<summary>When would you use the Adapter pattern?</summary>

### When would you use the Adapter pattern?

**Definition:**

</details>

### Scalability and Performance Considerations

<details>
<summary>What strategies can be used to scale a software application?</summary>

### What strategies can be used to scale a software application?

**Definition:**

</details>

<details>
<summary>Describe load balancing and its significance in software architecture.</summary>

### Describe load balancing and its significance in software architecture.

**Definition:**

</details>

<details>
<summary>Explain the concept of a stateless architecture.</summary>

### Explain the concept of a stateless architecture.

**Definition:**

</details>

<details>
<summary>How does caching improve system performance?</summary>

### How does caching improve system performance?

**Definition:**

</details>

<details>
<summary>What practices are vital for designing high availability systems?</summary>

### What practices are vital for designing high availability systems?

**Definition:**

</details>

<details>
<summary>Detail the trade-offs in the CAP theorem.</summary>

### Detail the trade-offs in the CAP theorem.

**Definition:**

</details>

<details>
<summary>How would you prevent single points of failure in software architecture?</summary>

### How would you prevent single points of failure in software architecture?

**Definition:**

</details>

<details>
<summary>Describe the role of a Content Delivery Network (CDN) in an architecture.</summary>

### Describe the role of a Content Delivery Network (CDN) in an architecture.

**Definition:**

</details>

<details>
<summary>Discuss techniques for optimizing database performance architecturally.</summary>

### Discuss techniques for optimizing database performance architecturally.

**Definition:**

</details>

<details>
<summary>Explain database replication and failover in your architecture.</summary>

### Explain database replication and failover in your architecture.

**Definition:**

</details>

### Cloud Computing and DevOps

<details>
<summary>How does cloud computing influence software architecture design?</summary>

### How does cloud computing influence software architecture design?

**Definition:**

</details>

<details>
<summary>Define Infrastructure as Code (IaC) and its relationship to architecture.</summary>

### Define Infrastructure as Code (IaC) and its relationship to architecture.

**Definition:**

</details>

<details>
<summary>Describe microservices in cloud-native design.</summary>

### Describe microservices in cloud-native design.

**Definition:**

</details>

<details>
<summary>Explain containerization and its architectural benefits.</summary>

### Explain containerization and its architectural benefits.

**Definition:**

</details>

<details>
<summary>Discuss the role of CI/CD in architectural design.</summary>

### Discuss the role of CI/CD in architectural design.

**Definition:**

</details>

<details>
<summary>How do serverless architectures operate and their benefits?</summary>

### How do serverless architectures operate and their benefits?

**Definition:**

</details>

<details>
<summary>What is feature toggling and how does it support DevOps practices?</summary>

### What is feature toggling and how does it support DevOps practices?

**Definition:**

</details>

<details>
<summary>How would you incorporate monitoring and logging in a cloud-based architecture?</summary>

### How would you incorporate monitoring and logging in a cloud-based architecture?

**Definition:**

</details>

<details>
<summary>What is blue-green deployment and its role in minimizing downtime?</summary>

### What is blue-green deployment and its role in minimizing downtime?

**Definition:**

</details>

<details>
<summary>Describe approaches for achieving multi-tenancy in the cloud.</summary>

### Describe approaches for achieving multi-tenancy in the cloud.

**Definition:**

</details>

### Data Management and Integration

<details>
<summary>Discuss the concept and role of a data lake.</summary>

### Discuss the concept and role of a data lake.

**Definition:**

</details>

<details>
<summary>Compare ETL and ELT processes.</summary>

### Compare ETL and ELT processes.

**Definition:**

</details>

<details>
<summary>How is big data processing handled in software architecture?</summary>

### How is big data processing handled in software architecture?

**Definition:**

</details>

<details>
<summary>Describe the role of message brokers in system integration.</summary>

### Describe the role of message brokers in system integration.

**Definition:**

</details>

<details>
<summary>Explain the significance of an API Gateway.</summary>

### Explain the significance of an API Gateway.

**Definition:**

</details>

<details>
<summary>How is Event Sourcing applied in architecture?</summary>

### How is Event Sourcing applied in architecture?

**Definition:**

</details>

<details>
<summary>Discuss strategies for managing database schema migrations.</summary>

### Discuss strategies for managing database schema migrations.

**Definition:**

</details>

<details>
<summary>Best practices for data consistency in distributed systems?</summary>

### Best practices for data consistency in distributed systems?

**Definition:**

</details>

<details>
<summary>How to integrate third-party services securely into your architecture?</summary>

### How to integrate third-party services securely into your architecture?

**Definition:**

</details>

<details>
<summary>When choosing between SQL and NoSQL databases, what are the considerations?</summary>

### When choosing between SQL and NoSQL databases, what are the considerations?

**Definition:**

</details>

### Reliability, Maintenance, and Evolution

<details>
<summary>Explain fault tolerance and its incorporation into software architecture.</summary>

### Explain fault tolerance and its incorporation into software architecture.

**Definition:**

</details>

<details>
<summary>What architectural practices facilitate maintainability and evolution?</summary>

### What architectural practices facilitate maintainability and evolution?

**Definition:**

</details>

<details>
<summary>Why is documentation crucial for software architecture maintenance?</summary>

### Why is documentation crucial for software architecture maintenance?

**Definition:**

</details>

<details>
<summary>How do you manage technical debt within a software architecture?</summary>

### How do you manage technical debt within a software architecture?

**Definition:**

</details>

<details>
<summary>Discuss the importance of automated testing for architectural resilience.</summary>

### Discuss the importance of automated testing for architectural resilience.

**Definition:**

</details>

<details>
<summary>Define “refactoring” in the context of software architecture.</summary>

### Define “refactoring” in the context of software architecture.

**Definition:**

</details>

<details>
<summary>What is graceful degradation in system design?</summary>

### What is graceful degradation in system design?

**Definition:**

</details>

<details>
<summary>How do you plan for backward compatibility when evolving architecture?</summary>

### How do you plan for backward compatibility when evolving architecture?

**Definition:**

</details>

<details>
<summary>Define feature deprecation and its architectural considerations.</summary>

### Define feature deprecation and its architectural considerations.

**Definition:**

</details>

<details>
<summary>Discuss architectural strategies for effective debugging.</summary>

### Discuss architectural strategies for effective debugging.

**Definition:**

</details>

### Mobile and IoT Architecture

<details>
<summary>Discuss considerations for mobile application architecture.</summary>

### Discuss considerations for mobile application architecture.

**Definition:**

</details>

<details>
<summary>How does IoT architecture differ from traditional architectures?</summary>

### How does IoT architecture differ from traditional architectures?

**Definition:**

</details>

<details>
<summary>Define edge computing in the context of IoT.</summary>

### Define edge computing in the context of IoT.

**Definition:**

</details>

<details>
<summary>How do you manage data synchronization between mobile devices and servers?</summary>

### How do you manage data synchronization between mobile devices and servers?

**Definition:**

</details>

<details>
<summary>Address battery life and resource constraints in mobile/IoT architectures.</summary>

### Address battery life and resource constraints in mobile/IoT architectures.

**Definition:**

</details>

### Communication and Networking

<details>
<summary>Explain RESTful API design principles.</summary>

### Explain RESTful API design principles.

**Definition:**

</details>

<details>
<summary>Considerations for designing a GraphQL API?</summary>

### Considerations for designing a GraphQL API?

**Definition:**

</details>

<details>
<summary>Describe WebSocket communication and when it’s preferred.</summary>

### Describe WebSocket communication and when it’s preferred.

**Definition:**

</details>

<details>
<summary>What is long-polling and how is it supported architecturally?</summary>

### What is long-polling and how is it supported architecturally?

**Definition:**

</details>

<details>
<summary>How can network latency impact architecture and how is it mitigated?</summary>

### How can network latency impact architecture and how is it mitigated?

**Definition:**

</details>

### Architecture Analysis and Evaluation

<details>
<summary>How do you assess the quality of a software architecture?</summary>

### How do you assess the quality of a software architecture?

**Definition:**

</details>

<details>
<summary>Describe the Architecture Tradeoff Analysis Method (ATAM).</summary>

### Describe the Architecture Tradeoff Analysis Method (ATAM).

**Definition:**

</details>

<details>
<summary>What are architectural fitness functions?</summary>

### What are architectural fitness functions?

**Definition:**

</details>

<details>
<summary>Conducting performance analysis on software architectures: methodologies?</summary>

### Conducting performance analysis on software architectures: methodologies?

**Definition:**

</details>

<details>
<summary>Define a risk-driven architectural approach and its application.</summary>

### Define a risk-driven architectural approach and its application.

**Definition:**

</details>

### Emerging Technologies and Future Trends

<details>
<summary>What role does AI play in modern software architecture?</summary>

### What role does AI play in modern software architecture?

**Definition:**

</details>

<details>
<summary>How can blockchain technology be integrated into software architectures?</summary>

### How can blockchain technology be integrated into software architectures?

**Definition:**

</details>

<details>
<summary>Potential impact of quantum computing on future architectures?</summary>

### Potential impact of quantum computing on future architectures?

**Definition:**

</details>

<details>
<summary>Architectural changes to support AR and VR applications?</summary>

### Architectural changes to support AR and VR applications?

**Definition:**

</details>

<details>
<summary>Discuss 5G technology and its effect on software architectures.</summary>

### Discuss 5G technology and its effect on software architectures.

**Definition:**

</details>

### Collaboration and Team Dynamics

<details>
<summary>How do you communicate architecture decisions to non-technical stakeholders?</summary>

### How do you communicate architecture decisions to non-technical stakeholders?

**Definition:**

</details>

<details>
<summary>How do you define the architect’s role within an agile development team?</summary>

### How do you define the architect’s role within an agile development team?

**Definition:**

</details>

<details>
<summary>How do you handle conflicting architectural decisions among team members?</summary>

### How do you handle conflicting architectural decisions among team members?

**Definition:**

</details>

<details>
<summary>What is the importance and usage of architecture decision records (ADRs)?</summary>

### What is the importance and usage of architecture decision records (ADRs)?

**Definition:**

</details>

<details>
<summary>How do you ensure team-wide comprehension and adherence to the defined software architecture?</summary>

### How do you ensure team-wide comprehension and adherence to the defined software architecture?

**Definition:**

</details>
