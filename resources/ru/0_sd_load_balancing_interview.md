# Load Balancing — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Load Balancing — собеседование](./0_sd_load_balancing_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Load Balancing](https://devinterview.io/questions/software-architecture-and-system-design/load-balancing-interview-questions/).

### Load Balancing Fundamentals

<details>
<summary>Define load balancing in the context of modern web services.</summary>

### Define load balancing in the context of modern web services.

**Definition:**

Балансировка нагрузки размазывает входящую работу по пулу серверов, чтобы ни одна машина не несла весь спрос и чтобы мёртвую машину можно было пропустить.

**How it works:**

- Клиенты используют один адрес. Балансировщик выбирает здоровый бэкенд и пересылает соединение или запрос.
- Обычные цели: доступность (пережить потерю сервера), масштаб (добавить серверы вместо одного большего) и более ровная задержка.
- Простые политики: круговой обход, взвешенный круговой обход, наименьшее число соединений, наименьшее время ответа.
- Более липкие или умные политики: хеш адреса клиента, маршрут по URL или заголовку и вывод сервера, когда проверка здоровья не проходит.
- Адаптивные политики смотрят живую нагрузку. Статические идут по фиксированному порядку и им всё равно, что один сервер медленнее.
- Балансировщик теперь на пути запроса. Ему нужна своя избыточность, иначе аварией становится он.

**Examples:**

Четыре процесса API стоят за одним DNS-именем. Каждый запрос идёт на следующий здоровый процесс. Выньте один — остальные три продолжают отвечать. Клиенты не хранят четыре адреса.
</details>

<details>
<summary>What are the primary objectives of implementing load balancing?</summary>

### What are the primary objectives of implementing load balancing?

**Definition:**

Смысл балансировщика — хорошо использовать пул: делить мощность, выкидывать отказавшие члены и держать задержку приемлемой, пока трафик растёт.

**How it works:**

- Размазать работу, чтобы один горячий сервер не был насыщен, пока другие простаивают.
- Поднять надёжность: проверка здоровья убирает плохой член, остальные продолжают обслуживать.
- Срезать хвостовую задержку, обходя перегруженный или медленный экземпляр.
- Дать одно место, куда добавляют мощность. Горизонтальный масштаб — это «добавить бэкенд», а не «увеличить единственную машину».
- Аппаратные устройства, программные прокси и края CDN — разные места для этой работы. Цель одна.
- Балансировщик не чинит медленную базу за каждым сервером. Он помогает, только когда узкое место — пул, который вы размазываете.

**Examples:**

p95 оформления заказа растёт, потому что один из трёх серверов приложения на 100% CPU, а два других на 30%. Наименьшее число соединений перестаёт слать новую работу на горячий. Если горячие все три, добавляют четвёртый. Работа балансировщика была в неровном размазывании, не в запросе.
</details>

<details>
<summary>Explain the difference between hardware and software load balancers.</summary>

### Explain the difference between hardware and software load balancers.

**Definition:**

Аппаратный балансировщик — выделенное устройство. Программный — программа, которую запускают на обычных серверах или как управляемый облачный сервис.

**How it works:**

- Устройства собраны вокруг обработки пакетов, часто с фиксированной настройкой и поддержкой поставщика. Они могут давать высокую пропускную способность с предсказуемой задержкой.
- Они дороже на старте, масштабируются покупкой ещё одной коробки или лицензии и медленно меняются, когда нужно новое правило маршрута.
- Софт (NGINX, HAProxy, Envoy, облачный балансировщик) работает на обычных машинах. Экземпляры добавляют, конфиг меняют в git и платят за мощность, которую используют.
- Пределы — хост: CPU на TLS, кривая обучения и необходимость самим эксплуатировать прокси, если его не ведёт облако.
- Облачные балансировщики — софт, который вы не ставите в стойку. Алгоритмы, проверки здоровья и поведение TLS вы всё равно выбираете.
- Многие системы используют оба: устройство или облачный балансировщик на краю и программный прокси ближе к сервисам.

**Examples:**

Пара устройств в дата-центре завершает TLS для старого VLAN. Кластер Kubernetes использует программный ingress-контроллер для маршрутов по сервисам. Заменить маршрут во втором случае — правка конфига. Заменить его на устройстве — окно изменений.
</details>

<details>
<summary>Can you list some common load balancing algorithms and briefly describe how they work?</summary>

### Can you list some common load balancing algorithms and briefly describe how they work?

**Definition:**

Алгоритм — правило, которое выбирает следующий бэкенд. Более простые правила игнорируют живую нагрузку. Более тяжёлые смотрят на соединения, задержку или ключ из запроса.

**How it works:**

- Круговой обход идёт по списку по порядку и начинает сначала. Каждый здоровый сервер получает ход.
- Наименьшее число соединений шлёт запрос на сервер с наименьшим числом открытых соединений. Он благоволит серверам, которые быстрее заканчивают работу.
- Хеш IP клиента (или заголовка) всегда выбирает один и тот же сервер для этого ключа, пока пул не изменится.
- Взвешенный круговой обход и взвешенное наименьшее число соединений дают более крупной машине больше ходов или больший бюджет соединений.
- Наименьшее время ответа предпочитает сервер, который отвечал быстро, иногда вместе с числом соединений.
- Динамические политики добавляют пробы здоровья и нагрузки, чтобы медленный член выбирали реже. Правила по содержимому выбирают пул по URL или заголовку до того, как алгоритм работает внутри этого пула.

**Examples:**

```text
servers = [A, B, C]
next = servers[i % 3]; i += 1     # round-robin
```

При весах 5, 1, 1 сервер A выберут пять раз на каждый ход B и C. Наименьшее число соединений проигнорирует это расписание и посмотрит на открытые сокеты.
</details>

<details>
<summary>Describe the term “sticky session” in load balancing.</summary>

### Describe the term “sticky session” in load balancing.

**Definition:**

Липкая сессия отправляет поздние запросы того же клиента на тот же бэкенд, чтобы сервер мог дальше пользоваться состоянием, которое он сохранил локально для этого клиента.

**How it works:**

- Балансировщик запоминает ключ: IP клиента или cookie, которую он ставит на первый ответ.
- Следующий запрос с этим ключом пропускает обычную ротацию и возвращается на тот же сервер, пока запись жива.
- Так сессия в памяти, websocket или незавершённая загрузка остаются на одном процессе.
- Цена — неровная нагрузка. Занятый пользователь пришпиливает сервер. Мёртвый сервер роняет всех, кто к нему прилип, если сессию нельзя собрать заново.
- Предпочтительнее общее хранилище сессий или токен без состояния. Тогда любой сервер может взять следующий запрос, и липкость не нужна.
- Если оставляете её, задайте таймаут и запасной путь, когда выбранный сервер не проходит проверку здоровья.

**Examples:**

```text
# first response sets a cookie the balancer understands
Set-Cookie: SERVERID=b
# later requests with that cookie go back to b
```

Без cookie круговой обход посадил бы следующий вызов на A, который эту корзину пользователя никогда не видел.
</details>

<details>
<summary>How does load balancing improve application reliability?</summary>

### How does load balancing improve application reliability?

**Definition:**

Надёжность растёт, потому что отказавший или перегруженный экземпляр перестаёт быть единственной точкой отказа всего сервиса. Пул отвечает, пока этот экземпляр выключен.

**How it works:**

- Больше одного бэкенда значит, что сервис переживает крах, выкладку или полный диск на одной машине.
- Проверки здоровья перестают слать трафик члену, который лежит или слишком медленный, и возвращают его, когда он восстановился.
- Размазывание соединений избегает затора на одном процессе, который иначе увёл бы всех в таймаут.
- TLS может заканчиваться на балансировщике, чтобы каждый бэкенд не был отдельной проблемой сертификата. Это удобство. Кусок надёжности — всё ещё пул.
- Липкость сессии и локальный кэш работают против этого: они делают один сервер особенным. Общее состояние сохраняет способность любого выжившего обслуживать.
- Сам балансировщик должен быть избыточным (пара или anycast облачного балансировщика). Один прокси — новая единственная точка отказа.

**Examples:**

Два сервера приложения и балансировщик. Вы перезапускаете один для выкладки. Проверки здоровья помечают его недоступным, второй берёт трафик, и перезапущенный возвращается, когда `/ready` успешен. Пользователи видят сбой только у запросов, которые уже были на перезапускаемом процессе.
</details>

<details>
<summary>How do load balancers perform health checks on backend servers?</summary>

### How do load balancers perform health checks on backend servers?

**Definition:**

Проверка здоровья решает, может ли бэкенд получать трафик. Активные проверки зондируют по таймеру. Пассивные смотрят на настоящие запросы, которые вы уже послали.

**How it works:**

- Активная проверка открывает TCP-порт или шлёт HTTP `GET /ready` каждые несколько секунд. Таймаут, отказ в соединении или не-2xx помечают члена недоступным после небольшого числа неудач.
- Путь должен значить «я могу обслуживать», а не только «процесс слушает». Проверка готовности, которая зависит от базы, падает, когда базы нет.
- Пассивная проверка считает ошибки и таймауты на живом трафике. Слишком много — и члена убирают без отдельного зонда.
- Пассивные проверки ничего не стоят, когда трафика нет, и они видят отказы, которые видят пользователи. Они медленно замечают сервер, который лежит, но в него не попадают.
- Используйте оба: зонд для машин без трафика и долю ошибок для машин, которые подняты, но портят запросы.
- Когда член снова проходит N успехов, он возвращается в пул. Не дёргайте его на одном успехе.

**Examples:**

```text
GET /ready every 5s, timeout 1s
unhealthy after 3 failures, healthy after 2 successes
```

Процесс, который принимает TCP, но возвращает 500 с `/ready`, убирают. Проверка только TCP продолжала бы слать ему пользователей.
</details>

<details>
<summary>What are the advantages and disadvantages of round-robin load balancing?</summary>

### What are the advantages and disadvantages of round-robin load balancing?

**Definition:**

Круговой обход отдаёт каждому здоровому серверу следующий запрос по очереди. Он прост и честен, только когда каждый запрос стоит примерно одинаково и каждый сервер одного размера.

**How it works:**

- Плюс: тривиально реализовать и объяснить. Кроме вращающегося индекса счётчиков по серверам нет.
- Плюс: на многих коротких похожих запросах каждый сервер получает примерно одно и то же число.
- Минус: длинный запрос считается одним ходом. Сервер может быть занят тяжёлым вызовом, а следующий лёгкий всё равно сядет на него.
- Минус: более медленная или меньшая машина получает ту же долю, что и быстрая, и копит очередь.
- Минус: время ответа игнорируется. Сервер, который ошибается, но всё ещё «поднят», сохраняет ход, пока проверка здоровья его не уберёт.
- Берите его для равных серверов и дешёвой похожей работы. Переходите к наименьшему числу соединений или весам, когда цена запроса или размер машины различаются.

**Examples:**

Три одинаковых API-сервера без состояния и обработчики по 1 мс: кругового обхода достаточно. Та же ротация перед изменением размера картинок, где один запрос занимает 2 секунды, сваливает эти задачи на того, чей ход. Наименьшее число соединений пропустило бы сервер, который уже меняет размер.
</details>

<details>
<summary>In load balancing, what is the significance of the least connections method?</summary>

### In load balancing, what is the significance of the least connections method?

**Definition:**

Метод наименьшего числа соединений шлёт следующий запрос на бэкенд, у которого сейчас меньше всего открытых соединений. Он следит за работой в полёте, а не только за тем, чей ход.

**How it works:**

- Длинный запрос держит соединение. Круговой обход этого не замечает. Наименьшее число соединений замечает и предпочитает сервер, который уже закончил.
- Это подходит keep-alive HTTP/1.1, websocket и любой смеси дешёвых и дорогих вызовов.
- Он считает, что одно соединение — одна единица нагрузки. Сервер с малым числом соединений, но огромной задачей на CPU, всё ещё может быть неверным выбором. Соедините с временем ответа или весом, если цены так сильно различаются.
- Балансировщик должен видеть соединения. Если их завершает что-то ещё, счётчики врут.
- Новые серверы начинают с нуля соединений, поэтому при входе их может залить. Медленный старт этого избегает.
- Веса масштабируют сравнение: машина вдвое крупнее может держать вдвое больше соединений, прежде чем выглядеть «более занятой».

**Examples:**

У сервера A 40 открытых загрузок. У сервера B — 3. Следующий запрос идёт на B, даже если круговой обход выбрал бы A. Когда загрузка на A заканчивается, счётчик A падает, и он снова становится кандидатом.
</details>

<details>
<summary>Explain how a load balancer might handle failure in one of the servers it manages.</summary>

### Explain how a load balancer might handle failure in one of the servers it manages.

**Definition:**

Когда сервер падает, балансировщик перестаёт слать ему новую работу и продолжает обслуживать с членов, которые ещё здоровы.

**How it works:**

- Активные зонды или серия настоящих ошибок помечают члена недоступным. Запросы, уже летящие на него, падают. Новые идут на остальных.
- Алгоритм (круговой обход, наименьшее число соединений, веса) затем работает только на оставшемся наборе.
- Липких клиентов мёртвого сервера нужно переназначить, иначе они продолжают падать. Общее хранилище сессий делает переназначение безболезненным.
- Если TLS заканчивается на балансировщике, бэкенды могут умирать без того, чтобы клиенты заново согласовывали сертификат.
- Одного балансировщика мало. Второй или облачный балансировщик со своим переключением должен забрать виртуальный адрес.
- Возвращайте члена только после подряд успешных проверок. При плановой остановке можно сначала осушить его, чтобы текущие соединения закончились.
- Запасной пул (меньшая дежурная группа) может принять переполнение, когда основной пул стал слишком мал после потери.

**Examples:**

Три сервера, один трижды не проходит `/ready`. Ротация балансировщика становится двумя другими. Пользователя, чья cookie указывала на мёртвый сервер, на следующем запросе отправляют на живой. Через десять минут сервер проходит две проверки и снова входит в ротацию.
</details>

### Load Balancing Strategies

<details>
<summary>How does a load balancer distribute traffic in a stateless vs stateful scenario?</summary>

### How does a load balancer distribute traffic in a stateless vs stateful scenario?

**Definition:**

Бэкенды без состояния могут взять любой запрос, поэтому балансировщик свободен использовать чистый алгоритм размазывания. Бэкенды с состоянием помнят клиента, поэтому балансировщик должен слать этого клиента в то же место, или состояние должно переехать.

**How it works:**

- Без состояния: каждый запрос несёт то, что нужно серверу (токен, ключ идемпотентности). Хватает кругового обхода или наименьшего числа соединений. Любой выживший обрабатывает следующий вызов.
- С состоянием: сервер держит в памяти сессию, websocket или частичную загрузку. Балансировщик использует cookie или хеш IP (липкость), чтобы следующий пакет попал в эту память.
- Распределение с состоянием неровное и хрупкое, когда этот сервер умирает. Состояние пропало, если его не записали ещё и в общее место.
- Обычное исправление — сделать ярус без состояния с точки зрения балансировщика: сессия в Redis, файлы в объектном хранилище. Алгоритм возвращается к чистому размазыванию.
- Не путайте «балансировщик с состоянием» и «приложение с состоянием». Балансировщик может помнить липкую карту, даже когда вы хотели бы, чтобы приложению она была не нужна.

**Examples:**

`GET /products/1` без сессии не имеет состояния: ответить может любой из четырёх серверов. Чат по websocket, приколотый cookie, имеет состояние: сокет есть только у сервера, который принял обновление. Если сообщения чата лежат в общей шине, переподключение может сесть куда угодно.
</details>

<details>
<summary>What is the concept of session persistence, and why is it important?</summary>

### What is the concept of session persistence, and why is it important?

**Definition:**

Устойчивость сессии значит, что балансировщик продолжает выбирать один и тот же бэкенд для клиента, чтобы сессия этого клиента оставалась действительной. Это важно, когда сессия живёт на одном сервере.

**How it works:**

- Пользователи остаются в системе, многошаговые формы держат место, и корзина на стороне сервера не исчезает между запросами.
- Запись, которая должна увидеть предыдущую запись на том же процессе, тоже от этого зависит, пока вы не перенесёте эту последовательность в общее хранилище.
- Механизмы: липкая cookie, привязка по IP источника или устойчивый хеш идентификатора сессии.
- Лучший долгий механизм — не устойчивость вовсе: положите сессию в хранилище, которое читает каждый сервер. Тогда устойчивость необязательна.
- Избегайте её, когда она прикалывает слишком много трафика к одной машине, когда клиенты делят один NAT-адрес (привязка по IP тогда приклеивает весь офис) или когда сервер нужно свободно осушать.
- Если используете, истекайте карту и переназначайте при провале проверки здоровья, чтобы мёртвый сервер не запирал пользователя.

**Examples:**

Мастер оформления заказа хранит шаг 2 только в памяти процесса. Без устойчивости шаг 3 попадает на другой процесс, и мастер начинается сначала. Перенос состояния мастера в хранилище сессий позволяет любому серверу нарисовать шаг 3, и балансировщик снова может ходить по кругу.
</details>

<details>
<summary>Discuss the role of DNS in load balancing.</summary>

### Discuss the role of DNS in load balancing.

**Definition:**

Балансировка через DNS выдаёт разным клиентам разные IP-адреса одного имени, чтобы они соединялись с разными серверами до того, как пакет увидит какой-либо прокси.

**How it works:**

- Круговой DNS возвращает несколько записей A или AAAA и вращает их порядок. Резолверы и клиенты выбирают один.
- Это просто и без лишнего перехода через прокси. Контроль слабый: кэши игнорируют ваш TTL, и мёртвый IP продолжают выдавать, пока кэши не истекут.
- В простом DNS нет проверки здоровья на запрос. Запись может указывать на сервер, который уже лежит.
- Взвешенный или гео-DNS (часто сервис DNS, а не статическая зона) возвращает адрес по региону или весу. Так направляют глобальный трафик.
- Клиенты, которые закрепили один ответ, остаются там. Открытое соединение сменой DNS не перебалансировать.
- DNS используйте, чтобы выбрать площадку или балансировщик. Настоящий балансировщик за этим адресом выбирает живой процесс.

**Examples:**

```text
shop.example.  30  IN  A  203.0.113.10
shop.example.  30  IN  A  203.0.113.11
```

Половина резолверов пробует первый адрес. Если `.10` умирает, эти клиенты падают, пока запись не устареет. Балансировщик на каждом адресе всё ещё может переключиться внутри площадки, не дожидаясь DNS.
</details>

<details>
<summary>In what scenarios would you use weighted load balancing?</summary>

### In what scenarios would you use weighted load balancing?

**Definition:**

Веса используют, когда бэкенды не должны получать равные доли: они разного размера, вы выпускаете канареечную версию или осушаете машину.

**How it works:**

- Вес — относительная доля. Веса 5 и 1 шлют около пяти запросов первому серверу на каждый один второму, во взвешенном круговом обходе.
- Взвешенное наименьшее число соединений масштабирует, сколько соединений считаются «полными» на более крупной машине.
- Новая версия может взять вес 1, пока старая берёт 9, и канарейка видит срез трафика.
- Сервер, который вы вот-вот уберёте, получает вес 0, заканчивает то, что у него есть, и затем уходит.
- Веса не чинят нездоровый сервер. Проверки здоровья всё равно его убирают. Высокий вес на больном сервере просто роняет больше пользователей, пока проверка не сработает.
- Пересматривайте веса, когда меняете размер машины. Забытая «5» на маленькой VM воссоздаёт перегруз, которого вы хотели избежать.

**Examples:**

```text
A weight 9   # current release, large instances
B weight 1   # canary
C weight 0   # draining
```

Около 90% новых запросов идут на A, 10% на B и ни одного на C. Вес B поднимают только после того, как его доля ошибок станет похожа на A.
</details>

<details>
<summary>How can load balancers help mitigate DDoS attacks?</summary>

### How can load balancers help mitigate DDoS attacks?

**Definition:**

Балансировщик — одно из мест, которое может поглотить или сбросить злоупотребляющий трафик до приложения. Сам по себе это не полная защита.

**How it works:**

- У пула больше мощности, чем у одного сервера, поэтому скромный поток размазывается, а не плавит один процесс.
- Лимиты частоты и потолки соединений на адрес клиента сбрасывают трафик сверх бюджета. У законных всплесков бюджет не должен быть крошечным.
- Край может отбрасывать трафик, который так и не закончил рукопожатие, и проверять очевидных ботов, чтобы до источника доходили только клиенты, прошедшие проверку.
- Anycast и большая краевая сеть (CDN или облачный балансировщик) принимают объёмные потоки далеко от вашего источника. Ваши собственные два прокси этого не могут.
- Проверки здоровья не должны помечать каждый сервер недоступным только потому, что поток сделал их медленными, иначе балансировщик опустошит пул и закончит аварию.
- Атаки на приложение (злоупотребляющие, но правильно сформированные запросы) нуждаются в лимитах и межсетевом экране на краю. Ровное размазывание всё равно наносит урон, только на большем числе серверов.

**Examples:**

Всплеск попыток соединения бьёт в облачный балансировщик. Лимиты на адрес и проверки рукопожатия отбрасывают большую часть. Автомасштабирование источника добавляет два экземпляра для трафика, который остался. У приложения всё ещё свой лимит на дорогие поисковые вызовы, потому что те выглядят как обычный HTTP.
</details>

<details>
<summary>Explain the difference between horizontal and vertical scaling, and how load balancing applies to each.</summary>

### Explain the difference between horizontal and vertical scaling, and how load balancing applies to each.

**Definition:**

</details>

<details>
<summary>What factors should you consider when choosing a load balancing method for a particular application?</summary>

### What factors should you consider when choosing a load balancing method for a particular application?

**Definition:**

</details>

<details>
<summary>Discuss how global server load balancing differs from local server load balancing.</summary>

### Discuss how global server load balancing differs from local server load balancing.

**Definition:**

</details>

### Load Balancer Configuration & Performance

<details>
<summary>What metrics would you monitor to assess the performance of a load balancer?</summary>

### What metrics would you monitor to assess the performance of a load balancer?

**Definition:**

</details>

<details>
<summary>Describe one method to handle SSL/TLS traffic in load balancing.</summary>

### Describe one method to handle SSL/TLS traffic in load balancing.

**Definition:**

</details>

<details>
<summary>Explain the concept of direct server return and its significance in load balancing.</summary>

### Explain the concept of direct server return and its significance in load balancing.

**Definition:**

</details>

<details>
<summary>How can caching be integrated with load balancing to improve performance?</summary>

### How can caching be integrated with load balancing to improve performance?

**Definition:**

</details>

<details>
<summary>Discuss the challenges of load balancing microservice architectures.</summary>

### Discuss the challenges of load balancing microservice architectures.

**Definition:**

</details>

<details>
<summary>How do you configure a health check on a load balancer?</summary>

### How do you configure a health check on a load balancer?

**Definition:**

</details>

<details>
<summary>What is connection draining, and why is it used in load balancing?</summary>

### What is connection draining, and why is it used in load balancing?

**Definition:**

</details>

### Load Balancing in Cloud and Hybrid Environments

<details>
<summary>How do cloud provider load balancers (e.g., AWS ELB, Azure Load Balancer) differ from on-premise solutions?</summary>

### How do cloud provider load balancers (e.g., AWS ELB, Azure Load Balancer) differ from on-premise solutions?

**Definition:**

</details>

<details>
<summary>Can you explain the role of load balancing in auto-scaling groups/clusters?</summary>

### Can you explain the role of load balancing in auto-scaling groups/clusters?

**Definition:**

</details>

<details>
<summary>Describe the process of load balancing in a multi-cloud environment.</summary>

### Describe the process of load balancing in a multi-cloud environment.

**Definition:**

</details>

<details>
<summary>Discuss how load balancing might work in a hybrid cloud scenario with both private and public resources.</summary>

### Discuss how load balancing might work in a hybrid cloud scenario with both private and public resources.

**Definition:**

</details>

### Advanced Load Balancing Topics

<details>
<summary>What is cross-region load balancing, and in what scenario would it be necessary?</summary>

### What is cross-region load balancing, and in what scenario would it be necessary?

**Definition:**

</details>

<details>
<summary>Explain how a load balancer can make routing decisions based on content type.</summary>

### Explain how a load balancer can make routing decisions based on content type.

**Definition:**

</details>

<details>
<summary>How would you enable graceful shutdown of servers in a load-balanced environment?</summary>

### How would you enable graceful shutdown of servers in a load-balanced environment?

**Definition:**

</details>

<details>
<summary>Discuss the role of API gateways in conjunction with load balancers.</summary>

### Discuss the role of API gateways in conjunction with load balancers.

**Definition:**

</details>

<details>
<summary>What is load balancer affinity, and when might you enforce it?</summary>

### What is load balancer affinity, and when might you enforce it?

**Definition:**

</details>

<details>
<summary>How does load balancing work in a containerized environment, such as with Docker and Kubernetes?</summary>

### How does load balancing work in a containerized environment, such as with Docker and Kubernetes?

**Definition:**

</details>

<details>
<summary>What is a reverse proxy, and how does it relate to load balancing?</summary>

### What is a reverse proxy, and how does it relate to load balancing?

**Definition:**

</details>

<details>
<summary>Can you explain how load balancing works with websockets or other persistent connection protocols?</summary>

### Can you explain how load balancing works with websockets or other persistent connection protocols?

**Definition:**

</details>

<details>
<summary>Discuss how machine learning can be applied to improve load balancing decisions.</summary>

### Discuss how machine learning can be applied to improve load balancing decisions.

**Definition:**

</details>

<details>
<summary>What strategies might you employ to handle sudden spikes in traffic using load balancing?</summary>

### What strategies might you employ to handle sudden spikes in traffic using load balancing?

**Definition:**

</details>

### Load Balancing and Security

<details>
<summary>How do load balancers contribute to a system’s security posture?</summary>

### How do load balancers contribute to a system’s security posture?

**Definition:**

</details>

<details>
<summary>Can load balancers protect against SQL injection or XSS attacks? If so, how?</summary>

### Can load balancers protect against SQL injection or XSS attacks? If so, how?

**Definition:**

</details>

<details>
<summary>How does a Web Application Firewall (WAF) integrate with load balancing solutions?</summary>

### How does a Web Application Firewall (WAF) integrate with load balancing solutions?

**Definition:**

</details>

<details>
<summary>Describe the importance of properly configuring HTTPS certificates on load balancers.</summary>

### Describe the importance of properly configuring HTTPS certificates on load balancers.

**Definition:**

</details>

<details>
<summary>Discuss the security implications of SSL termination at the load balancer.</summary>

### Discuss the security implications of SSL termination at the load balancer.

**Definition:**

</details>

<details>
<summary>Explain how rate limiting works in the context of load balancing.</summary>

### Explain how rate limiting works in the context of load balancing.

**Definition:**

</details>

### Load Balancing Troubleshooting and Problem Solving

<details>
<summary>How would you troubleshoot a situation where a load balancer is incorrectly routing traffic?</summary>

### How would you troubleshoot a situation where a load balancer is incorrectly routing traffic?

**Definition:**

</details>

<details>
<summary>What steps would you take if a backend server is reported down by the load balancer but is actually running?</summary>

### What steps would you take if a backend server is reported down by the load balancer but is actually running?

**Definition:**

</details>

<details>
<summary>Describe how you might identify and resolve performance bottlenecks in a load-balanced system.</summary>

### Describe how you might identify and resolve performance bottlenecks in a load-balanced system.

**Definition:**

</details>

<details>
<summary>How would you handle a situation where the load balancer becomes the performance bottleneck?</summary>

### How would you handle a situation where the load balancer becomes the performance bottleneck?

**Definition:**

</details>

<details>
<summary>Suppose a load balancer is causing increased latency—what potential root causes would you investigate?</summary>

### Suppose a load balancer is causing increased latency—what potential root causes would you investigate?

**Definition:**

</details>
