# Cryptography — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Cryptography — собеседование](./0_sd_cryptography_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Cryptography](https://devinterview.io/questions/software-architecture-and-system-design/cryptography-interview-questions/).

### Cryptography Fundamentals

<details>
<summary>What is cryptography, and what are its main goals?</summary>

### What is cryptography, and what are its main goals?

**Definition:**

Криптография — практика применения математики, чтобы секреты оставались секретами, изменения были заметны, а сторону можно было связать с сообщением.

**How it works:**

- Конфиденциальность: шифрование превращает открытый текст в шифртекст, бесполезный без ключа. Расшифрование возвращает его обратно.
- Симметричное шифрование использует один общий ключ. Асимметричное шифрует открытым ключом и расшифровывает закрытым.
- Целостность: хеш или MAC показывает, изменились ли байты. Одно шифрование это не всегда доказывает.
- Аутентификация: доказательство, что другая сторона владеет секретом, которому вы доверяете (ключ, сертификат).
- Неотказуемость: подпись, от которой подписавший не сможет потом отказаться, потому что её мог создать только его закрытый ключ.
- Ничто из этого не работает, если ключи слабые, повторно используются или лежат открытым текстом. Порождение, хранение и ротация ключей — часть системы.
- Предпочитайте проверенные алгоритмы и реализации. Изобретать шифр — не цель.

**Examples:**

Образ диска зашифрован ключом, чтобы украденный диск нельзя было прочитать (конфиденциальность). Подписанное обновление программы не проходит проверку, если изменился один байт (целостность), и его подтверждает только ключ поставщика (аутентификация и неотказуемость).
</details>

<details>
<summary>Explain the difference between symmetric and asymmetric cryptography.</summary>

### Explain the difference between symmetric and asymmetric cryptography.

**Definition:**

Симметричная криптография использует один общий секрет в обе стороны. Асимметричная использует пару ключей: открытый, который может быть у кого угодно, и закрытый, который остаётся у владельца.

**How it works:**

- Симметричные алгоритмы (AES, ChaCha20) быстрые и подходят для больших данных. Трудность — доставить один и тот же ключ обеим сторонам, не утекая.
- Асимметричные алгоритмы (RSA, эллиптические кривые) медленнее и подходят для маленьких нагрузок: обмен ключами, подписи и шифрование симметричного ключа.
- Типичные размеры: ключи AES — 128 или 256 бит. Ключи RSA — тысячи бит для сходной стойкости. Ключи на эллиптических кривых — несколько сотен бит.
- Настоящие протоколы их сочетают. TLS асимметрией согласует сеансовый ключ, затем симметрией шифрует байты.
- Провал симметрии: кто скопировал ключ, тот читает и подделывает. Провал асимметрии: потерянный закрытый ключ или доверенный открытый ключ, который на самом деле принадлежит атакующему.
- Не шифруйте большой файл напрямую RSA. Шифруйте файл AES и оборачивайте ключ AES.

**Examples:**

Алиса и Боб делят 256-битный ключ AES и шифруют им резервную копию. Для первого контакта Алиса шифрует этот ключ AES открытым ключом RSA Боба. Разворачивает его только закрытый ключ Боба. Дальше файл идёт на AES.
</details>

<details>
<summary>What is a cryptographic hash function, and what properties must it have?</summary>

### What is a cryptographic hash function, and what properties must it have?

**Definition:**

Криптографическая хеш-функция отображает любой вход в дайджест фиксированной длины так, чтобы дайджест не раскрывал вход и его было непрактично подделать.

**How it works:**

- Длина выхода фиксирована (SHA-256 даёт 32 байта), какой бы длинной ни была входная строка.
- Стойкость к прообразу: по дайджесту найти вход, который хешируется в него, невыполнимо.
- Стойкость ко второму прообразу: по входу найти другой вход с тем же дайджестом невыполнимо.
- Стойкость к коллизиям: найти любые два разных входа с одним дайджестом невыполнимо. Это более сильное требование, и граница дня рождения делает его первым свойством, которое сдаёт по мере старения хешей.
- Малое изменение входа должно переворачивать около половины битов выхода. Это лавинный эффект.
- Хеш — не шифрование. Ключа нет и «расшифровать» нельзя. Для проверки целостности с ключом используют HMAC.
- MD5 и SHA-1 сломаны по коллизиям. Берите SHA-256, SHA-3 или хеш пароля вроде Argon2, когда вход — пароль.

**Examples:**

Страница загрузки публикует SHA-256 файла. Вы хешируете свою копию и сравниваете. Совпавший дайджест значит, что у вас почти наверняка те же байты. Сам по себе он не доказывает, кто опубликовал дайджест. Для этого нужна подпись.
</details>

<details>
<summary>Describe the concept of public key infrastructure (PKI).</summary>

### Describe the concept of public key infrastructure (PKI).

**Definition:**

PKI — набор ролей и документов, который позволяет доверять, что открытый ключ принадлежит названной стороне, а не просто что какой-то ключ существует.

**How it works:**

- У каждой стороны пара ключей. Закрытый остаётся секретом. Открытый публикуют.
- Сертификат связывает открытый ключ с именем и подписан удостоверяющим центром (CA). Доверие идёт от того, что вы уже доверяете этому CA, часто по цепочке до корня в вашем хранилище доверия.
- Регистрация проверяет имя до подписи CA. Отзыв (CRL или OCSP) помечает сертификат непригодным до истечения срока.
- Дальше вы получаете конфиденциальность (шифровать на открытый ключ), целостность и аутентификацию (проверить подпись) и неотказуемость, когда закрытый ключ оставался у владельца.
- В вебе это TLS-сертификаты имён сайтов. Тот же рисунок покрывает подписанную почту, подпись кода и клиентские сертификаты VPN.
- CA, который подписал чужое имя, ломает систему. Привязка, короткие сроки и certificate transparency существуют из-за этого.

**Examples:**

Браузер доверяет корневому CA. Тот подписал промежуточный, который подписал `shop.example`. Рукопожатие TLS предъявляет цепочку. Браузер проверяет подписи, имя и даты, затем использует открытый ключ листа. Самоподписанный сертификат на то же имя не проходит, потому что ни один доверенный CA за него не ручается.
</details>

<details>
<summary>What is a digital signature, and how does it work?</summary>

### What is a digital signature, and how does it work?

**Definition:**

Цифровая подпись — значение, созданное закрытым ключом над хешем сообщения. Любой, у кого есть открытый ключ, может проверить, что сообщение не меняли и что закрытый ключ участвовал.

**How it works:**

- Подписывающий хеширует сообщение и применяет закрытый ключ к дайджесту (RSA, ECDSA, Ed25519).
- Проверяющий хеширует сообщение снова и проверяет подпись открытым ключом. Несовпадение значит другое сообщение или другой ключ.
- Хеширование сначала держит подпись маленькой и покрывает каждый байт.
- Открытый ключ должен быть ключом нужного человека. Это даёт сертификат или ранее обменянный ключ. Сама подпись человека не называет.
- Это сильнее отсканированной картинки «электронной» подписи, которую кто угодно может скопировать и которую математика не проверяет.
- Держите закрытый ключ офлайн или в аппаратном модуле. Скопированный закрытый ключ позволяет другому подписывать от вашего имени.

**Examples:**

Файл релиза хешируют SHA-256 и подписывают закрытым ключом Ed25519 поставщика. Ваш инструмент пакетов хеширует скачанный файл и проверяет подпись. Один перевёрнутый бит проваливает проверку. Подпись любым другим ключом тоже проваливается.
</details>

<details>
<summary>Can you explain what a nonce is and how it’s used in cryptography?</summary>

### Can you explain what a nonce is and how it’s used in cryptography?

**Definition:**

Nonce — число, которое используют один раз в криптографической операции, чтобы одни и те же входы не давали повторяемый результат, который атакующий может переиграть или сопоставить.

**How it works:**

- Секретом оно быть не обязано. Уникальным для данного ключа — обязано. Счётчик или большое случайное значение оба годятся, если пару никогда не повторяют.
- В AES-GCM и ChaCha20-Poly1305 повтор nonce с тем же ключом раскрывает открытый текст и может сломать аутентификатор.
- Протоколы кладут nonce в рукопожатие, чтобы старое перехваченное сообщение нельзя было послать снова как свежее.
- Конструкции с хешем подмешивают nonce или соль, чтобы одинаковые пароли не хешировались одинаково и заранее посчитанные таблицы промахивались.
- Храните nonce рядом с шифртекстом. Расшифровывающей стороне нужно то же значение. Потеря уникальности хуже, чем хранение открытым текстом.

**Examples:**

```text
ciphertext = AES-GCM(key, nonce=counter, plaintext)
counter = counter + 1
```

Каждое сообщение под этим ключом получает следующий счётчик. Сброс счётчика в 0 после перезапуска с тем же ключом повторяет nonce и небезопасен.
</details>

<details>
<summary>What does it mean for a cryptographic algorithm to be “computationally secure”?</summary>

### What does it mean for a cryptographic algorithm to be “computationally secure”?

**Definition:**

Вычислительная стойкость значит, что сломать алгоритм стоит больше работы, чем реалистичный атакующий может потратить, а не что сломать его невозможно в принципе.

**How it works:**

- Теоретико-информационная стойкость (правильно использованный одноразовый блокнот) хранит секрет даже против неограниченных вычислений. Почти ничто другое так не делает.
- Вычислительная стойкость предполагает предел: столько операций, столько памяти, столько лет. 128-битный ключ стоек, потому что перебор пространства ключей за этим пределом.
- «Стоек» всегда против названной атаки и названного запаса. Хеш может быть хорош против прообразов и слаб против коллизий.
- Предел двигается. Железо и новый криптоанализ его уменьшают. Поэтому размеры ключей растут, а алгоритмы снимают.
- Вычислительно стойкий примитив всё равно падает, если неверны режим, nonce или обращение с ключом. Определение — про алгоритм по его заявленным правилам.
- Берите примитивы, чьи пределы опубликованы и разобраны. У секретной конструкции нет публичного предела, которому можно верить.

**Examples:**

AES-128 считают вычислительно стойким: полный перебор ключа — не план, который кто-то может выполнить. Одноразовый блокнот — более строгая идея, совершенная секретность, и он требует свежий случайный ключ длиной с сообщение. AES с повторным nonce — не «AES нестоек». Это использование вне предела.
</details>

<details>
<summary>Describe the concept of perfect secrecy and name an encryption system that achieves it.</summary>

### Describe the concept of perfect secrecy and name an encryption system that achieves it.

**Definition:**

Совершенная секретность значит, что шифртекст не даёт атакующему с неограниченными вычислениями новой информации об открытом тексте. Увидев шифртекст, он не меняет шансы ни одного кандидата в сообщения.

**How it works:**

- Условие Клода Шеннона: для каждой пары открытого текста и шифртекста, которая может встретиться, шифрование должно согласовываться с достаточным числом ключей, чтобы шифртекст не выделял один открытый текст.
- Это заставляет ключ быть не короче сообщения, выбранным равномерно случайно и хранимым в секрете.
- Одноразовый блокнот так и делает. Шифртекст — открытый текст XOR случайный ключ той же длины. Любой открытый текст всё ещё возможен, с другим ключом.
- Ключ используют один раз. Повтор позволяет атакующему XOR двух шифртекстов и сократить ключ.
- Блокнот должен быть истинно случайным, а не растянутым паролем. Порождать, перевозить и уничтожать столько ключевого материала — причина, почему почти каждая реальная система берёт вычислительную стойкость.
- Одноразовый блокнот не аутентифицирует. Атакующий может перевернуть биты шифртекста и перевернуть те же биты открытого текста.

**Examples:**

Бит открытого текста `1`, бит ключа `1`, бит шифртекста `0`. Тот же шифртекст — это и открытый текст `0` с ключом `0`. Без ключа оба сообщения остаются возможными. Используйте этот ключ на втором сообщении — два шифртекста раскроют XOR двух открытых текстов.
</details>

### Encryption Algorithms

<details>
<summary>What are substitution and permutation in the context of encryption algorithms?</summary>

### What are substitution and permutation in the context of encryption algorithms?

**Definition:**

Подстановка заменяет единицу открытого текста другой единицей. Перестановка меняет порядок единиц, не меняя их самих. Современные шифры смешивают оба приёма, чтобы результат не был ни простым кодбуком, ни перемешиванием.

**How it works:**

- Подстановка создаёт запутывание: связь ключа и шифртекста запутана. S-box в DES или AES — фиксированная подстановка маленькой группы бит.
- Перестановка создаёт рассеивание: изменение одного входного бита расползается по выходу. ShiftRows и MixColumns в AES двигают и смешивают байты. Классический шифр перестановки только переставляет буквы.
- Одна подстановка сохраняет частоты букв (сдвиг Цезаря всё ещё показывает те же пики). Одна перестановка сохраняет буквы, и атака анаграммой их всё ещё видит.
- Композиционный шифр повторяет «подставить, затем переставить» много раундов, подмешивая ключевой материал, чтобы локальная структура не выжила.
- Это учебные шифры, не то, что разворачивают. Они показывают два хода. AES — конструкция, которая использует их безопасно.

**Examples:**

```text
Caesar shift by 1:  cat -> dbu          # substitution
Rail fence, 2 rails: cat -> cta          # c then a then t, reordered
```

Ни один не прячет короткое сообщение. AES гоняет подстановку с ключом и перемешивающую перестановку много раундов, так что эти учебные атаки не применяются.
</details>

<details>
<summary>Explain the basic principle behind the AES encryption algorithm.</summary>

### Explain the basic principle behind the AES encryption algorithm.

**Definition:**

AES шифрует 128-битный блок, повторяя раунд подстановки и перестановки и подмешивая расписание ключа, выведенное из ключа в 128, 192 или 256 бит.

**How it works:**

- Блок — массив байтов 4 на 4, его называют состоянием.
- Каждый полный раунд делает SubBytes (S-box на каждый байт), ShiftRows (сдвиг строк), MixColumns (смешивание каждого столбца) и AddRoundKey (XOR раундового ключа).
- Последний раунд пропускает MixColumns. Первый шаг — начальный AddRoundKey.
- Длина ключа выбирает число раундов: 10 для 128-битных ключей, 12 для 192, 14 для 256. Расписание ключа разворачивает ключ в один раундовый ключ на раунд.
- Это сеть подстановок и перестановок, не сеть Фейстеля. Расшифрование использует обратные шаги и раундовые ключи в обратном порядке.
- AES — блочный примитив. Реальное использование нуждается в режиме вроде GCM с уникальным nonce, если нужны и секретность, и целостность.

**Examples:**

Блок в 16 байт и ключ в 32 байта проходят 14 раундов. Тот же открытый текст под тем же ключом и новым nonce GCM даёт другой шифртекст. Повтор nonce с этим ключом — режим отказа, а не короткий ключ.
</details>

<details>
<summary>What is the Data Encryption Standard (DES), and why is it considered insecure today?</summary>

### What is the Data Encryption Standard (DES), and why is it considered insecure today?

**Definition:**

DES — блочный шифр 1970-х: блоки по 64 бита, ключ 56 бит и 16 раундов Фейстеля. Структура алгоритма держалась лучше, чем длина ключа.

**How it works:**

- 64-битный ключ включает 8 бит чётности, поэтому секрет — 56 бит. Каждый раунд расширяет, подставляет через S-box, переставляет и делает XOR подключа.
- Ключ в 56 бит можно перебрать. Специальное железо сделало это в конце 1990-х, а обычные вычисления теперь делают это дешевле.
- Блок в 64 бита — второй предел. В обычных режимах достаточно блоков под одним ключом приглашает коллизии дня рождения.
- Дифференциальный и линейный криптоанализ существуют. Не они на практике сняли DES. Короткий ключ.
- Triple DES гоняет DES трижды, чтобы растянуть ключ, а AES заменяет оба блоком в 128 бит и более длинным ключом.
- Не используйте DES в новых системах. Любой шифртекст DES считайте тем, что нужно перешифровать.

**Examples:**

Пространство ключей 2^56 — около 72 квадриллионов ключей. Кластер, который пробует миллиарды ключей в секунду, заканчивает поиск одного ключа за часы или дни. Пространство AES-128 — 2^128, и этот подход его не проминает.
</details>

<details>
<summary>Describe the differences between RSA and ECC (Elliptic Curve Cryptography).</summary>

### Describe the differences between RSA and ECC (Elliptic Curve Cryptography).

**Definition:**

Стойкость RSA опирается на разложение больших целых. Криптография на эллиптических кривых опирается на задачу дискретного логарифма на кривой. При том же запасе стойкости ECC использует гораздо более короткие ключи.

**How it works:**

- Открытый ключ RSA — показатель и модуль, который является произведением двух больших простых. Операции — модульное возведение в степень. Обычные размеры — 2048 или 3072 бита.
- ECC использует точку на именованной кривой. Ключ кривой в 256 бит в той же лиге, что ключ RSA в 3072 бита, по текущим оценкам.
- Более короткие ключи значат меньшие сертификаты, меньше трафика и более быстрые операции с закрытым ключом на маленьких устройствах. Проверка RSA с маленьким открытым показателем всё ещё может быть очень быстрой.
- Оба умеют подписывать и оба умеют оборачивать симметричный ключ. Ни один не должен шифровать большие данные.
- Выбор кривой важен. Берите разобранную кривую (P-256, Curve25519) и разобранную реализацию. Самодельная кривая — не короткий путь.
- Оба падают перед большим квантовым компьютером с алгоритмом Шора. Это повод для постквантовой работы, а не повод предпочесть сегодня более длинные ключи RSA.

**Examples:**

TLS-сертификат с ключом P-256 несёт гораздо меньший открытый ключ, чем сертификат RSA на 3072 бита, и всё ещё целится в сравнимый уровень классической стойкости. CPU рукопожатия на телефоне обычно в пользу кривой.
</details>

<details>
<summary>How does a stream cipher differ from a block cipher?</summary>

### How does a stream cipher differ from a block cipher?

**Definition:**

Поточный шифр сочетает открытый текст с гаммой по единице за раз. Блочный шифр преобразует блок фиксированного размера, а режим работы обрабатывает сообщения, которые не равны одному блоку.

**How it works:**

- Поточный шифр (или блочный в режиме счётчика) порождает гамму и делает XOR с открытым текстом. Первый байт можно зашифровать до того, как существует остальное. Дополнения нет.
- Блочный шифр вроде AES отображает 16 байт в 16 байт. ECB шифрует каждый блок отдельно. CBC, CTR и GCM определяют, как блоки сцепляются и нужен ли nonce.
- Повтор гаммы (тот же ключ и nonce) губителен: XOR двух шифртекстов её сокращает. Повтор блока под ECB выдаёт равенство блоков — это другая утечка.
- Ошибки битов: перевёрнутый бит шифртекста переворачивает тот же бит открытого текста в сыром поточном XOR. В CBC он портит этот блок и сдвигается в следующий. Режим AEAD отвергает сообщение, а не возвращает повреждённый открытый текст.
- Режим CTR — это блочный шифр, используемый как поток. Различие на практике часто в «каком режиме», а не в отдельном алгоритме.

**Examples:**

ChaCha20 делает XOR каждого байта открытого текста со следующим байтом гаммы. AES-ECB зашифровал бы `0123456789abcdef` как один блок и повторил бы рисунок, если следующий блок тот же. AES-GCM прячет это повторение и добавляет тег, если nonce меняется каждое сообщение.
</details>

<details>
<summary>Can you describe the Feistel cipher structure?</summary>

### Can you describe the Feistel cipher structure?

**Definition:**

Шифр Фейстеля делит каждый блок на две половины и повторяет раунд, который подмешивает одну половину в другую функцией раундового ключа. Сама функция не обязана быть обратимой.

**How it works:**

- Начинают с левой половины L и правой R.
- Один раунд ставит новую левую равной старой правой, а новую правую — старой левой XOR F(старая правая, раундовый ключ). В части описаний имена меняют местами. Идея — XOR и обмен.
- После последнего раунда половины — это шифртекст. Расшифрование гоняет те же раунды с раундовыми ключами в обратном порядке. F применяется так же, поэтому F может быть односторонним смешиванием.
- Больше раундов и сильная F поднимают работу криптоанализа. Слишком мало раундов течёт структурой.
- DES — знаменитый пример: блоки 64 бита, половины 32 бита, 16 раундов, F из расширения, S-box и перестановки.
- AES — не шифр Фейстеля. Он использует сеть подстановок и перестановок на всём состоянии, с обратимыми шагами.

**Examples:**

```text
L, R = split(block)
L, R = R, L xor F(R, k1)
L, R = R, L xor F(R, k2)
```

Чтобы отменить раунд 2, XOR F(L, k2) обратно в R и поменять половины. F не обращают. Её только пересчитывают с тем же раундовым ключом.
</details>

<details>
<summary>What are the key differences between DES and 3DES?</summary>

### What are the key differences between DES and 3DES?

**Definition:**

3DES (Triple DES) применяет структуру раундов DES трижды с большим ключевым материалом. Он растягивает ключ. Блок в 64 бита он не чинит.

**How it works:**

- DES использует один 56-битный ключ и 16 раундов Фейстеля на блоке в 64 бита.
- 3DES выполняет шифрование, расшифрование, шифрование. Двухключевой 3DES использует два ключа DES (около 112 бит). Трёхключевой — три (около 168 бит). Средний шаг расшифрования позволяет реализации 3DES вести себя как DES, когда все ключи равны.
- S-box и F Фейстеля те же. Лишняя стойкость — в повторных проходах с ключом, а не в новой схеме подстановки.
- 3DES — это тройная работа DES, и блок всё ещё 64 бита. В долгоживущих режимах граница дня рождения (атака Sweet32 на CBC) — практический предел, даже когда ключ длинный.
- Стандарты сняли оба для новой работы. Замена — AES: блок 128 бит и ключ, которому не нужны три прохода.
- Если встречаете 3DES, считайте его путём совместимости, с которого надо уехать, а не ровней AES.

**Examples:**

Платёжное устройство, которое всё ещё говорит на двухключевом 3DES, может говорить со старым соседом. Новый проект использует AES-GCM. Оборачивание одного и того же ключа DES трижды (`E-D-E` с K, K, K) — это просто DES, поэтому три ключа должны различаться, чтобы лишняя стойкость существовала.
</details>

<details>
<summary>Explain the main security features of the RSA algorithm.</summary>

### Explain the main security features of the RSA algorithm.

**Definition:**

</details>

<details>
<summary>What is quantum cryptography, and how might it impact current encryption methods?</summary>

### What is quantum cryptography, and how might it impact current encryption methods?

**Definition:**

</details>

### Cryptanalysis

<details>
<summary>What is cryptanalysis?</summary>

### What is cryptanalysis?

**Definition:**

</details>

<details>
<summary>What is a brute force attack, and how can systems be protected against it?</summary>

### What is a brute force attack, and how can systems be protected against it?

**Definition:**

</details>

<details>
<summary>Describe a man-in-the-middle attack and how it can be prevented.</summary>

### Describe a man-in-the-middle attack and how it can be prevented.

**Definition:**

</details>

<details>
<summary>Explain what a side-channel attack is.</summary>

### Explain what a side-channel attack is.

**Definition:**

</details>

<details>
<summary>What is a chosen plaintext attack?</summary>

### What is a chosen plaintext attack?

**Definition:**

</details>

<details>
<summary>How does a frequency analysis attack work against certain ciphers?</summary>

### How does a frequency analysis attack work against certain ciphers?

**Definition:**

</details>

### Hash Functions and Digital Signatures

<details>
<summary>What is the difference between HMAC and a simple hash function?</summary>

### What is the difference between HMAC and a simple hash function?

**Definition:**

</details>

<details>
<summary>Explain the concept of a collision in hash functions and why it is significant.</summary>

### Explain the concept of a collision in hash functions and why it is significant.

**Definition:**

</details>

<details>
<summary>Describe the birthday attack and its relevance to hash functions.</summary>

### Describe the birthday attack and its relevance to hash functions.

**Definition:**

</details>

<details>
<summary>How does a digital signature guarantee the integrity and authenticity of a message?</summary>

### How does a digital signature guarantee the integrity and authenticity of a message?

**Definition:**

</details>

<details>
<summary>What are RSA signatures, and how do they differ from RSA encryption?</summary>

### What are RSA signatures, and how do they differ from RSA encryption?

**Definition:**

</details>

<details>
<summary>Explain the importance of using a secure hash algorithm for digital signatures.</summary>

### Explain the importance of using a secure hash algorithm for digital signatures.

**Definition:**

</details>

<details>
<summary>What is a Merkle tree, and how is it used in cryptography?</summary>

### What is a Merkle tree, and how is it used in cryptography?

**Definition:**

</details>

### Key Management and Protocols

<details>
<summary>What is key distribution, and what challenges does it present?</summary>

### What is key distribution, and what challenges does it present?

**Definition:**

</details>

<details>
<summary>Describe Diffie-Hellman key exchange and its primary use.</summary>

### Describe Diffie-Hellman key exchange and its primary use.

**Definition:**

</details>

<details>
<summary>Explain what a key escrow is and its purpose in cryptography.</summary>

### Explain what a key escrow is and its purpose in cryptography.

**Definition:**

</details>

<details>
<summary>How do certificate authorities help in securing communications over the internet?</summary>

### How do certificate authorities help in securing communications over the internet?

**Definition:**

</details>

<details>
<summary>What is forward secrecy, and what protocols use this property?</summary>

### What is forward secrecy, and what protocols use this property?

**Definition:**

</details>

### Authentication and Access Control

<details>
<summary>Explain the role of cryptography in user authentication.</summary>

### Explain the role of cryptography in user authentication.

**Definition:**

</details>

<details>
<summary>What is multi-factor authentication, and how is cryptography involved?</summary>

### What is multi-factor authentication, and how is cryptography involved?

**Definition:**

</details>

<details>
<summary>Describe the OAuth 2.0 protocol and its use cases in authentication.</summary>

### Describe the OAuth 2.0 protocol and its use cases in authentication.

**Definition:**

</details>

<details>
<summary>Explain the concept of role-based access control (RBAC) and its cryptographic requirements.</summary>

### Explain the concept of role-based access control (RBAC) and its cryptographic requirements.

**Definition:**

</details>

### Cryptography in Software and Applications

<details>
<summary>How does HTTPS utilize cryptography to secure communications over the web?</summary>

### How does HTTPS utilize cryptography to secure communications over the web?

**Definition:**

</details>

<details>
<summary>What is a TLS/SSL certificate, and how does it establish a secure session?</summary>

### What is a TLS/SSL certificate, and how does it establish a secure session?

**Definition:**

</details>

<details>
<summary>Explain how cryptography is used in blockchain technology.</summary>

### Explain how cryptography is used in blockchain technology.

**Definition:**

</details>

<details>
<summary>Describe the use of cryptographic primitives in password hashing.</summary>

### Describe the use of cryptographic primitives in password hashing.

**Definition:**

</details>

<details>
<summary>How do secure cookies work, and what cryptographic measures are involved?</summary>

### How do secure cookies work, and what cryptographic measures are involved?

**Definition:**

</details>

### Advanced Topics

<details>
<summary>Explain the principles behind homomorphic encryption and its potential applications.</summary>

### Explain the principles behind homomorphic encryption and its potential applications.

**Definition:**

</details>

<details>
<summary>What is zero-knowledge proof, and how does it maintain privacy?</summary>

### What is zero-knowledge proof, and how does it maintain privacy?

**Definition:**

</details>

<details>
<summary>Describe the concept of secure multi-party computation.</summary>

### Describe the concept of secure multi-party computation.

**Definition:**

</details>

<details>
<summary>Explain the purpose of post-quantum cryptography.</summary>

### Explain the purpose of post-quantum cryptography.

**Definition:**

</details>

### Standards and Protocols

<details>
<summary>What is the NIST, and what role does it play in cryptography?</summary>

### What is the NIST, and what role does it play in cryptography?

**Definition:**

</details>

<details>
<summary>How do cryptographic modules and algorithms get validated (e.g., FIPS 140-2)?</summary>

### How do cryptographic modules and algorithms get validated (e.g., FIPS 140-2)?

**Definition:**

</details>

<details>
<summary>Explain the importance and usage of the Common Criteria for Information Technology Security Evaluation.</summary>

### Explain the importance and usage of the Common Criteria for Information Technology Security Evaluation.

**Definition:**

</details>

<details>
<summary>Describe the purpose of the Transport Layer Security (TLS) protocol and its predecessor SSL.</summary>

### Describe the purpose of the Transport Layer Security (TLS) protocol and its predecessor SSL.

**Definition:**

</details>

<details>
<summary>What is the S/MIME standard, and what is it used for?</summary>

### What is the S/MIME standard, and what is it used for?

**Definition:**

</details>

### Practical Implementation and Best Practices

<details>
<summary>When should you use hardware-based cryptographic modules such as HSMs in an application?</summary>

### When should you use hardware-based cryptographic modules such as HSMs in an application?

**Definition:**

</details>

<details>
<summary>What are the best practices for managing cryptographic keys within an enterprise?</summary>

### What are the best practices for managing cryptographic keys within an enterprise?

**Definition:**

</details>
