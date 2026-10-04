# Blockchain — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./7_special_algorithms.md)

### Related docs

- [Blockchain — собеседование](./7_algo_blockchain_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Blockchain](https://devinterview.io/questions/data-structures-and-algorithms/blockchain-interview-questions/).

### Blockchain Fundamentals

<details>
<summary>Can you explain what a blockchain is and how it works?</summary>

### Can you explain what a blockchain is and how it works?

**Definition:**

Блокчейн — реплицируемый журнал блоков. Каждый блок фиксирует хеш предыдущего, поэтому у журнала одна проверяемая история.

**How it works:**

- Блок хранит пачку транзакций, метку времени или высоту и хеш родительского блока.
- Узлы собирают ожидающие транзакции, проверяют подписи и балансы и предлагают блок по правилу консенсуса.
- Поскольку блок `n` хранит `hash(block n−1)`, правка старой транзакции меняет каждый хеш после неё.
- Участники хранят копии. Участник отвергает цепь, чьи связи не сходятся или чьи транзакции нарушают протокол.
- «Та» цепь — та, которую правило выбора развилки предпочитает, когда есть два годных конца. Хеш-связи делают тихую правку видимой. Сами по себе они не решают, какой из двух годных концов побеждает.

**Examples:**

Блок 2 хранит `prev = H(block 1)`. Измените перевод внутри блока 1, и `H(block 1)` больше не равен этому `prev`. Каждый поздний блок пришлось бы пересобрать, чтобы история выглядела согласованной.
</details>

<details>
<summary>What is the difference between a public blockchain and a private blockchain?</summary>

### What is the difference between a public blockchain and a private blockchain?

**Definition:**

Публичная цепь позволяет кому угодно читать, отправлять транзакции и участвовать в выборе следующего блока. Приватная ограничивает эти роли известным оператором или консорциумом.

**How it works:**

- Публичное членство открыто. Безопасность идёт от цены перевесить остальную хеш-мощность или долю, а не от списка доступа.
- Приватное членство — административное решение. Оператор может добавить или убрать валидаторов, что покупает контроль доступа и обычно большую пропускную способность.
- Читатели публичной цепи могут проверить историю сами. Читатели приватной доверяют оператору, который решает, кто может дописывать.
- «Permissioned» называет правило доступа. Журнал может быть с разрешениями и всё ещё работать у нескольких организаций. База одной компании с хеш-цепью приватна и не децентрализована в смысле публичной цепи.
- Структура данных, журнал на хешах, одна и та же. Меняется то, кому разрешено писать и кому доверяют выбор конца цепи.

**Examples:**

Bitcoin публичен: кто угодно может переслать транзакцию и майнить. Внутренний журнал банка, дописывать который могут только банки-участники, приватен, даже если каждый блок хеширует предыдущий.
</details>

<details>
<summary>What are the key features of a blockchain that make it secure?</summary>

### What are the key features of a blockchain that make it secure?

**Definition:**

Безопасность складывается из хеш-связей, подписей, репликации и правила консенсуса, которое делает противоречивую историю дорогой или организационно трудной для публикации.

**How it works:**

- Каждый блок хранит хеш родителя, поэтому тихую правку ловят пересчётом цепи.
- Подпись показывает, что держатель закрытого ключа разрешил эту транзакцию. Другие узлы проверяют её открытым ключом.
- Много независимых копий значит, что нет одной базы, которую можно тихо поправить.
- Консенсус определяет, какой годный конец побеждает. При доказательстве работы переписать историю значит переделать работу каждого позднего блока. При протоколе голосования меньшинство не соберёт кворум.
- Череда поздних блоков поднимает цену замены старого, потому что замена должна стать концом, который правило выбора развилки всё ещё предпочитает.
- Ничто из этого не скрывает содержимое транзакций на публичной цепи. Целостность и аутентификация — не конфиденциальность.

**Examples:**

Чтобы заменить платёж десять блоков назад на цепи с доказательством работы, атакующему нужно перемайнить этот блок и десять после него быстрее, чем растёт честная цепь.
</details>

<details>
<summary>How does a blockchain ensure data integrity and prevent tampering?</summary>

### How does a blockchain ensure data integrity and prevent tampering?

**Definition:**

Целостность здесь — очевидность подделки: любое изменение старой записи меняет её хеш и рвёт связь, хранимую в следующем блоке. Честные узлы пересчитывают эти связи и отбрасывают цепь, которая не сходится.

**How it works:**

- Хеш в блоке `n` зависит от блока `n−1` и через эту связь от всего более раннего.
- Транзакции внутри блока обычно свёрнуты в корень Меркла, поэтому одна изменённая транзакция меняет и хеш блока.
- Узлы также проверяют подписи и правила протокола для балансов или неизрасходованных выходов. Блок с верным хешем и незаконным переводом всё равно отвергается.
- Это обнаруживает изменённую копию. Это не мешает большинству проверяющей мощности принять другую годную историю по правилам консенсуса.
- «Неизменяемый» в этом смысле значит «изменить прошлое заметно и дорого», а не «биты нельзя переписать на одном диске».

**Examples:**

Переверните один бит старой транзакции. Корень Меркла меняется, хеш блока меняется, и `prev` дочернего блока больше не совпадает. Узел, который пересчитывает заголовок, отвергает этот файл.
</details>

<details>
<summary>Can you explain the concept of decentralization in blockchain?</summary>

### Can you explain the concept of decentralization in blockchain?

**Definition:**

Децентрализация значит, что ни одна сторона не владеет журналом и не может в одиночку решить, какие транзакции годны. Независимые узлы применяют одни и те же публичные правила к своим копиям.

**How it works:**

- Каждый полный узел скачивает блоки, проверяет их и пересылает то, что принимает. Пользователь может проверить сам, а не доверять одному администратору базы.
- Степень разная. Горстка майнинговых пулов или маленький набор валидаторов централизованнее, чем схема равных участников.
- Открытое членство, как в доказательстве работы, сдвигает решение к тому, кто платит за работу. Доля сдвигает его к тому, кто запер монеты.
- Приватная цепь одного оператора — реплицируемая база с администратором. Хеш-связи не делают её децентрализованной.
- Децентрализация — обмен на пропускную способность и на возможность отменить ошибку. Нет службы поддержки, которая поправит старый публичный блок.

**Examples:**

Если выключить один узел Bitcoin, сеть всё ещё принимает блоки. Если выключить единственного оператора приватного журнала, дописывание останавливается — это централизованный случай.
</details>

<details>
<summary>What is a consensus mechanism, and why is it important in blockchain technology?</summary>

### What is a consensus mechanism, and why is it important in blockchain technology?

**Definition:**

Механизм консенсуса — правило, по которому узлы выбирают следующий блок и, когда соревнуются два годных блока, какая цепь главная.

**How it works:**

- Сеть задерживает и теряет сообщения, а некоторые узлы могут быть неисправны или нечестны. Локальных проверок годности мало, потому что два годных блока могут существовать на одной высоте.
- Механизм определяет безопасность: честные узлы не должны финализировать противоречивые истории. Он определяет живость: цепь должна продолжать расти.
- Доказательство работы использует накопленную работу как выбор развилки. Доказательство доли использует запертые монеты и голоса. Протокол с разрешениями использует кворум известных валидаторов.
- Без общего правила участники могут принять разные истории, и двойная трата выживет на одной из них.
- Механизм — не хеш-связь. Хеш-связь проверяет целостность. Консенсус выбирает, какую целую цепь сеть считает текущей.

**Examples:**

Два майнера публикуют разные годные блоки на высоте 800 000. Следующие блоки доказательства работы решают победителя: честные узлы переходят на более тяжёлую цепь и бросают другой конец.
</details>

<details>
<summary>Describe the most common types of consensus algorithms and how they differ.</summary>

### Describe the most common types of consensus algorithms and how they differ.

**Definition:**

Обычные семейства различаются тем, кто может предложить блок, чем он платит и финален ли блок в момент появления или только вероятно финален.

**How it works:**

- Доказательство работы: майнеры ищут хеш блока ниже цели. Побеждает самая тяжёлая годная цепь. Членство открыто. Переписать историю стоит большинства хеш-мощности, и поиск тратит энергию.
- Доказательство доли: валидаторы запирают монеты и их выбирают предлагать или голосовать. За плохое поведение эту долю могут уничтожить. Влияние следует запертым монетам, и энергия гораздо ниже поиска хеша.
- Практическая византийская отказоустойчивость и родственники используют известный набор валидаторов. Блок финален, когда сверхбольшинство голосов согласно. Они подходят сети с разрешениями и дают явную финальность. Открытое население майнеров они не растят.
- Допущения о безопасности различаются. Доказательство работы предполагает честное большинство хеш-мощности во времени. Протоколы голосования предполагают, что византийских валидаторов меньше порога, часто трети.
- Пропускная способность и открытость движутся в противоположные стороны. Открытая гонка финализирует медленнее, чем маленький комитет голосования.

**Examples:**

Bitcoin финализирует глубиной: шесть дальнейших блоков делают откат дорогим, не невозможным. Комитет PBFT из трёх узлов финализирует, когда проголосовали двое из трёх (или сверхбольшинство протокола), и этот голос и есть финальность.
</details>

<details>
<summary>How does a blockchain achieve consensus in a distributed environment?</summary>

### How does a blockchain achieve consensus in a distributed environment?

**Definition:**

Каждый узел проверяет блоки локально, затем применяет одно правило выбора развилки к тем годным концам, которые он видел. Сообщения прибывают поздно, поэтому два честных узла могут какое-то время расходиться и всё же сойтись.

**How it works:**

- Транзакции и блоки рассылают сплетнями. Узел не ждёт глобальной блокировки.
- Годность локальна: подписи, структура и правила журнала. Негодные данные не голосуют; их отбрасывают.
- Выбор развилки — общее правило. Доказательство работы предпочитает самую тяжёлую цепь. Доказательство доли предпочитает контрольную точку, оправданную наибольшей долей, или голову, которую поддерживают голоса. Протокол кворума предпочитает блок, который зафиксировало сверхбольшинство.
- Две головы могут существовать, пока не придут ещё блоки или голоса. Честные узлы, которые видят одни и те же свидетельства, затем выбирают один конец.
- Финальность при доказательстве работы вероятностна: более глубокий блок труднее заменить, и это не формально невозможно. При протоколе голосования она явна, как только кворум зафиксировал блок.

**Examples:**

Узел A первым видит блок `X`. Узел B первым видит блок `Y`. Оба годны. Когда оба узла позже видят ребёнка `X` и ни одного у `Y`, правило самой тяжёлой цепи переводит B на `X`.
</details>

<details>
<summary>What is a node in the blockchain context, and what role does it play?</summary>

### What is a node in the blockchain context, and what role does it play?

**Definition:**

Узел — процесс, который хранит данные цепи и говорит по одноранговому протоколу. Не каждый узел проверяет одинаковый объём истории.

**How it works:**

- Полный узел скачивает блоки, проверяет каждую транзакцию и правило консенсуса и пересылает то, что принимает. Майнить или ставить долю он не обязан.
- Лёгкий клиент хранит заголовки и просит у полного узла нужные куски. Он доверяет цепи заголовков и доказательству Меркла, а не проигрывает каждую транзакцию.
- Майнеры и валидаторы — узлы, которые ещё и предлагают блоки. Предложение — добавка. Проверка — базовый уровень.
- Пользователи могут проверить цепь сами только пока полный узел остаётся практичным. Если блоки слишком тяжелы, люди делегируют проверку, и сеть легче обмануть.
- Выключение одного полного узла не останавливает публичную сеть. Выключение единственного узла приватного развёртывания останавливает.

**Examples:**

Кошелёк на телефоне, который проверяет доказательство Меркла по заголовку, — лёгкий клиент. Процесс, который скачал каждый блок Bitcoin и отверг негодную подпись, — полный узел, майнит он или нет.
</details>

<details>
<summary>Can you explain what a blockchain fork is and why it might occur?</summary>

### Can you explain what a blockchain fork is and why it might occur?

**Definition:**

Форк — раскол цепи или правил, которые узлы применяют. Короткие форки обычны. Форки правил раскалывают программы.

**How it works:**

- Короткий форк случается, когда два годных блока созданы на одной высоте, прежде чем любой из них разошёлся. Правило выбора развилки позже бросает одну ветвь. Её транзакции возвращаются в мемпул, если они всё ещё годны.
- Хардфорк меняет правила так, что старые программы отвергают новые блоки. Узлы, которые не обновились, остаются на отдельной цепи. Спорный хардфорк — то, как одна сеть становится двумя активами.
- Софтфорк сужает правила так, что старые узлы всё ещё принимают блоки как годные, а обновлённые отвергают вновь запрещённые.
- Случайные форки идут от задержки. Намеренные — от обновления или от атаки, которая тайно майнит конкурирующий конец.
- Приложения, которые считают последний блок финальным, увидят платёж и затем его исчезновение, если правило выбора бросит именно этот блок.

**Examples:**

Два блока на высоте 100, затем ребёнок только у первого. Узлы переходят на этот более тяжёлый конец. Транзакции, уникальные для брошенного блока, снова становятся ожидающими, если они не конфликтуют с победившей ветвью.
</details>

### Cryptography in Blockchain

<details>
<summary>How does cryptography secure transactions and blocks in a blockchain?</summary>

### How does cryptography secure transactions and blocks in a blockchain?

**Definition:**

Криптография даёт целостность и аутентификацию. Отправитель подписывает транзакцию, а хеши фиксируют точные байты транзакций и блоков. Какая из двух годных цепей побеждает — всё ещё решение консенсуса.

**How it works:**

- Отправитель подписывает байты транзакции закрытым ключом. Каждый другой узел проверяет эту подпись открытым ключом и никогда не узнаёт закрытый ключ.
- Хеш блока и корень Меркла транзакций фиксируют эти байты. Любая правка меняет дайджест.
- Доказательство работы само есть поиск хеша в целевом диапазоне. Головоломка связывает блок с измеримым объёмом работы.
- Адрес обычно — хеш открытого ключа, поэтому ключ может не появляться в цепи, пока им не тратят.
- Это не шифрует обычный перевод на публичной цепи. Сумма и получатель читаемы. Конфиденциальности нужна отдельная схема.

**Examples:**

Узел отвергает перевод, чья подпись не совпадает с открытым ключом, которому принадлежат монеты, даже если хеш блока хорошо сформирован. Он также отвергает блок, чей сохранённый хеш родителя — не тот хеш, который он только что вычислил.
</details>

<details>
<summary>What is a hash function, and why is it crucial to blockchain technology?</summary>

### What is a hash function, and why is it crucial to blockchain technology?

**Definition:**

Криптографический хеш отображает вход любой длины в дайджест фиксированного размера. Блокчейны используют его как склейку между блоками и как сводку транзакций блока.

**How it works:**

- Один и тот же вход всегда даёт один и тот же дайджест, и вычислить его быстро.
- Изменение одного бита размазывается по выходу, поэтому похожие транзакции не имеют похожих хешей.
- Стойкость к прообразу делает дайджест трудным для обращения. Стойкость к коллизиям делает трудным поиск двух входов с одним дайджестом. На этих свойствах цепь стоит, когда считает дайджест именем байтов.
- Применения: указатель на родителя, корень Меркла, адреса, выведенные из ключей, и головоломка доказательства работы.
- Хеш — не шифрование. Он не построен так, чтобы его обратили и прочитали обратно. Знание `H(block)` не раскрывает блок.

**Examples:**

`H("pay Alice 1")` и `H("pay Alice 2")` — несвязанные дайджесты. Второй — не мелкая правка первого, поэтому изменённую сумму нельзя спрятать внутри старого хеша блока.
</details>

<details>
<summary>Can you explain asymmetric encryption and how it’s used in blockchains?</summary>

### Can you explain asymmetric encryption and how it’s used in blockchains?

**Definition:**

Асимметричная криптография использует пару ключей: операцию, сделанную одним ключом, проверяют или обращают только другим. На блокчейне обычное применение — подпись, а не секретность перевода.

**How it works:**

- Закрытый ключ остаётся у владельца. Открытый ключ или адрес, выведенный из него, — то, что хранит цепь.
- Владелец подписывает закрытым ключом. Кто угодно проверяет открытым. Годная проверка показывает разрешение именно этих байтов.
- Та же математика может зашифровать данные для держателя закрытого ключа. Обычная транзакция публичной цепи этого не делает. Каждый узел должен прочитать сумму и получателя, чтобы проверить правила журнала.
- Публикация открытого ключа не раскрывает закрытый, потому что вывод односторонний, обычно умножение на эллиптической кривой.
- Потеря закрытого ключа теряет способность разрешать траты. Из публичных данных цепи восстановления нет.

**Examples:**

Алиса подписывает «заплатить Бобу 3» своим закрытым ключом. Боб и каждый полный узел проверяют открытым ключом Алисы. Они узнают, что Алиса это разрешила. Они не узнают секрет, которым можно потратить остальные её монеты.
</details>

<details>
<summary>What is a digital signature, and how does it provide authenticity in transactions?</summary>

### What is a digital signature, and how does it provide authenticity in transactions?

**Definition:**

Цифровая подпись — короткое значение, вычисленное из байтов транзакции и закрытого ключа подписавшего. Проверяющий принимает её, только когда те же байты сходятся с открытым ключом.

**How it works:**

- Подпись покрывает хеш транзакции, а не отдельную записку. Изменение суммы или получателя роняет проверку.
- Она показывает подлинность: её произвёл держатель закрытого ключа. Она показывает целостность подписанных байтов. Она их не скрывает.
- Схемы вроде ECDSA и EdDSA используют, потому что подписи коротки и каждый узел проверяет их дёшево.
- Подпись не доказывает личность, только ключ. Кто держит ключ, может произвести подпись, которую сеть примет.
- Повтор — забота протокола. Подпись «заплатить Бобу 3» должна быть привязана к nonce, идентификатору цепи или конкретному неизрасходованному выходу, иначе те же байты можно отправить дважды.

**Examples:**

```text
sig = sign(private_key, hash(tx))
ok = verify(public_key, hash(tx), sig)
```

Измените `tx.amount` после подписи, и `ok` станет ложью, и никому не нужен закрытый ключ, чтобы это заметить.
</details>

<details>
<summary>How do public and private keys work within blockchain?</summary>

### How do public and private keys work within blockchain?

**Definition:**

Закрытый ключ — секретное случайное число. Открытый ключ выводят из него односторонней функцией. Трата требует подписи, которая проверяется открытым ключом, на который монеты были отправлены.

**How it works:**

- Порождение начинают со случайности. Слабый источник случайности даёт угадываемый закрытый ключ.
- На кривых, которые блокчейны реально используют, открытый ключ — умножение фиксированной базовой точки на скаляр. Обратный путь, от точки к скаляру, — трудная задача.
- Раздают открытый ключ или, чаще, адрес, который является его хешем. Закрытый ключ не раздают.
- Цепь проверяет `verify(public_key, tx, signature)`. Закрытый ключ она не видит и восстановить его не может.
- Потеря закрытого ключа теряет контроль над средствами. Административного сброса нет. Утечка позволяет кому угодно произвести подпись, которую сеть примет.
- Кошельки часто выводят много закрытых ключей из одного семени, чтобы одна резервная копия покрывала счета. Семя тогда и есть секрет, который не должен утечь.

**Examples:**

Монеты, отправленные на адрес, выведенный из открытого ключа `P`, двигаются только когда поздняя транзакция несёт подпись, которую проверяет `P`. Подпись другим ключом не проходит, даже если атакующий скопировал остальное из предыдущей транзакции.
</details>

### Smart Contracts

<details>
<summary>Define smart contracts and how they operate within a blockchain.</summary>

### Define smart contracts and how they operate within a blockchain.

**Definition:**

</details>

<details>
<summary>What platforms can you use to deploy smart contracts, and what are their differences?</summary>

### What platforms can you use to deploy smart contracts, and what are their differences?

**Definition:**

</details>

<details>
<summary>How can smart contracts access off-chain data?</summary>

### How can smart contracts access off-chain data?

**Definition:**

</details>

<details>
<summary>Explain how smart contracts handle exceptions or errors.</summary>

### Explain how smart contracts handle exceptions or errors.

**Definition:**

</details>

<details>
<summary>Can you describe a potential security vulnerability in a smart contract?</summary>

### Can you describe a potential security vulnerability in a smart contract?

**Definition:**

</details>

### Ethereum Basics

<details>
<summary>What is Ethereum, and how does it differ from Bitcoin?</summary>

### What is Ethereum, and how does it differ from Bitcoin?

**Definition:**

</details>

<details>
<summary>Can you describe what Gas is in the context of Ethereum?</summary>

### Can you describe what Gas is in the context of Ethereum?

**Definition:**

</details>

<details>
<summary>What is the Ethereum Virtual Machine (EVM), and what is its role?</summary>

### What is the Ethereum Virtual Machine (EVM), and what is its role?

**Definition:**

</details>

<details>
<summary>How is the state of the Ethereum blockchain maintained?</summary>

### How is the state of the Ethereum blockchain maintained?

**Definition:**

</details>

<details>
<summary>Explain what ERC-20 and ERC-721 tokens are.</summary>

### Explain what ERC-20 and ERC-721 tokens are.

**Definition:**

</details>

### Blockchain Data Structures & Design

<details>
<summary>Explain the structure of a blockchain block and its contents.</summary>

### Explain the structure of a blockchain block and its contents.

**Definition:**

</details>

<details>
<summary>What is a Merkle tree, and why is it important in blockchain?</summary>

### What is a Merkle tree, and why is it important in blockchain?

**Definition:**

</details>

<details>
<summary>How can blockchain systems ensure scalability and performance?</summary>

### How can blockchain systems ensure scalability and performance?

**Definition:**

</details>

<details>
<summary>Describe the process of adding a new block to a blockchain.</summary>

### Describe the process of adding a new block to a blockchain.

**Definition:**

</details>

<details>
<summary>What considerations are involved in designing a blockchain architecture?</summary>

### What considerations are involved in designing a blockchain architecture?

**Definition:**

</details>

### Transactions and UTXOs

<details>
<summary>Explain the concept of transactions within a blockchain.</summary>

### Explain the concept of transactions within a blockchain.

**Definition:**

</details>

<details>
<summary>What is a UTXO, and how is it different from an account/balance model?</summary>

### What is a UTXO, and how is it different from an account/balance model?

**Definition:**

</details>

<details>
<summary>How are fees determined in a blockchain transaction?</summary>

### How are fees determined in a blockchain transaction?

**Definition:**

</details>

<details>
<summary>Describe the lifecycle of a blockchain transaction from creation to confirmation.</summary>

### Describe the lifecycle of a blockchain transaction from creation to confirmation.

**Definition:**

</details>

<details>
<summary>What is a mempool in the context of blockchain?</summary>

### What is a mempool in the context of blockchain?

**Definition:**

</details>

### Blockchain Security

<details>
<summary>Discuss the concept of the 51% attack and its implications.</summary>

### Discuss the concept of the 51% attack and its implications.

**Definition:**

</details>

<details>
<summary>How can a blockchain prevent double-spending?</summary>

### How can a blockchain prevent double-spending?

**Definition:**

</details>

<details>
<summary>What are some common security threats to blockchain systems?</summary>

### What are some common security threats to blockchain systems?

**Definition:**

</details>

<details>
<summary>Can you explain how blockchain immutability is maintained?</summary>

### Can you explain how blockchain immutability is maintained?

**Definition:**

</details>

<details>
<summary>How does a blockchain network defend against Sybil attacks?</summary>

### How does a blockchain network defend against Sybil attacks?

**Definition:**

</details>

### Interoperability and Scalability

<details>
<summary>What strategies exist to improve blockchain scalability?</summary>

### What strategies exist to improve blockchain scalability?

**Definition:**

</details>

<details>
<summary>How can different blockchain networks achieve interoperability?</summary>

### How can different blockchain networks achieve interoperability?

**Definition:**

</details>

<details>
<summary>Explain the concept of sidechains and how they work.</summary>

### Explain the concept of sidechains and how they work.

**Definition:**

</details>

<details>
<summary>What role do layer 2 protocols play in blockchain?</summary>

### What role do layer 2 protocols play in blockchain?

**Definition:**

</details>

<details>
<summary>Discuss the trade-offs between scalability, security, and decentralization.</summary>

### Discuss the trade-offs between scalability, security, and decentralization.

**Definition:**

</details>

### Blockchain Development and Testing

<details>
<summary>What tools and environments are available for blockchain development?</summary>

### What tools and environments are available for blockchain development?

**Definition:**

</details>

<details>
<summary>How would you approach testing smart contracts?</summary>

### How would you approach testing smart contracts?

**Definition:**

</details>

<details>
<summary>What is a testnet, and why is it important for blockchain developers?</summary>

### What is a testnet, and why is it important for blockchain developers?

**Definition:**

</details>

<details>
<summary>Can you explain the difference between on-chain and off-chain coding?</summary>

### Can you explain the difference between on-chain and off-chain coding?

**Definition:**

</details>

<details>
<summary>How can you ensure that a blockchain application is GDPR compliant, considering the immutability of data?</summary>

### How can you ensure that a blockchain application is GDPR compliant, considering the immutability of data?

**Definition:**

</details>
