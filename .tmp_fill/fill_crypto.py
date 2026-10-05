#!/usr/bin/env python3
"""Fill empty cryptography interview definitions. Does not touch filled blocks."""

from pathlib import Path

ROOT = Path("/Users/radomir/Documents/business/MyConspect/resources")

# (heading, english body, russian body)
PAIRS = []

def add(heading, en, ru):
    PAIRS.append((heading, en.strip(), ru.strip()))

add(
"What is quantum cryptography, and how might it impact current encryption methods?",
"""**Definition:**

Quantum cryptography uses properties of quantum states, most often to agree a shared key. The impact that NIST is standardizing for is different: a future quantum computer may defeat many of today’s widely used public-key systems.

**How it works:**

- Quantum key distribution relies on the fact that measuring a quantum state disturbs it, so an on-path observer can be noticed while the key is being established. It does not replace a symmetric cipher by itself.
- NIST’s post-quantum project treats large quantum computers as a future threat to current public-key cryptography, not as a reason to abandon symmetric encryption wholesale.
- In August 2024 NIST published three principal standards: FIPS 203 (ML-KEM, key establishment), FIPS 204 (ML-DSA, signatures), and FIPS 205 (SLH-DSA, hash-based signatures).
- Those standards are meant to be deployed now. Under NIST IR 8547, quantum-vulnerable algorithms are to be removed from NIST standards by 2035, with high-risk systems moving earlier.
- Falcon and HQC were selected for further standardization as additional options. They are not the three standards already published.

**When to use:**

Use a published PQC scheme when you are migrating key establishment or signatures off algorithms NIST calls quantum-vulnerable. Keep a vetted symmetric cipher for bulk data, with the key sizes your current standard already requires.

**Sources:**

- https://csrc.nist.gov/projects/post-quantum-cryptography
""",
"""**Definition:**

Квантовая криптография использует свойства квантовых состояний, чаще всего чтобы согласовать общий ключ. Влияние, под которое NIST выпускает стандарты, другое: будущий квантовый компьютер может одолеть многие сегодняшние системы с открытым ключом.

**How it works:**

- Квантовое распределение ключей опирается на то, что измерение квантового состояния его нарушает, поэтому наблюдателя на пути можно заметить во время установления ключа. Само по себе оно не заменяет симметричный шифр.
- Проект NIST по постквантовой криптографии считает крупные квантовые компьютеры будущей угрозой нынешней криптографии с открытым ключом, а не поводом отказаться от симметричного шифрования целиком.
- В августе 2024 года NIST опубликовал три основных стандарта: FIPS 203 (ML-KEM, установление ключа), FIPS 204 (ML-DSA, подписи) и FIPS 205 (SLH-DSA, подписи на хешах).
- Эти стандарты рассчитаны на внедрение уже сейчас. По NIST IR 8547 уязвимые к квантовым вычислениям алгоритмы должны быть убраны из стандартов NIST к 2035 году, а высокорисковые системы — раньше.
- Falcon и HQC отобраны для дальнейшей стандартизации как дополнительные варианты. Это не те три стандарта, которые уже опубликованы.

**When to use:**

Берите опубликованную постквантовую схему, когда переносите установление ключа или подписи с алгоритмов, которые NIST считает уязвимыми к квантовым вычислениям. Для основного объёма данных оставляйте проверенный симметричный шифр с длинами ключей, которые уже требует ваш стандарт.

**Sources:**

- https://csrc.nist.gov/projects/post-quantum-cryptography
""")

add(
"What is cryptanalysis?",
"""**Definition:**

Cryptanalysis is the study of mathematical techniques for attempting to defeat cryptographic techniques and information-system security, including looking for errors or weaknesses in an algorithm or in its implementation. It also covers operations that defeat cryptographic protection without an initial knowledge of the key.

**How it works:**

- NIST SP 800-57 Part 1 Rev. 5 uses that definition. The work is analysis of the design or the implementation, not a normal use of the key.
- A weakness may sit in the algorithm itself or only in how a product implements it. Both are in scope for the term.
- Interview answers stay at this level: name the kind of weakness (short key, bad mode, leaky implementation) and the impact (the protection no longer holds). They do not walk through a procedure.
- Designers answer cryptanalysis by using standardized algorithms, published schemes, and implementations that have been reviewed against those schemes.

**Sources:**

- https://csrc.nist.gov/glossary/term/cryptanalysis
""",
"""**Definition:**

Криптоанализ — изучение математических методов, которыми пытаются преодолеть криптографические средства и защиту информационной системы, включая поиск ошибок или слабостей в алгоритме или в его реализации. Сюда же входят действия, которые снимают криптографическую защиту без исходного знания ключа.

**How it works:**

- NIST SP 800-57 Part 1 Rev. 5 даёт именно это определение. Речь об анализе схемы или реализации, а не об обычном применении ключа.
- Слабость может быть в самом алгоритме или только в том, как продукт его реализовал. Оба случая входят в термин.
- На собеседовании ответ остаётся на этом уровне: назвать вид слабости (короткий ключ, плохой режим, утекающая реализация) и последствие (защита больше не держится). Процедуру не разбирают.
- На криптоанализ отвечают стандартными алгоритмами, опубликованными схемами и реализациями, которые сверяли с этими схемами.

**Sources:**

- https://csrc.nist.gov/glossary/term/cryptanalysis
""")

add(
"What is a brute force attack, and how can systems be protected against it?",
"""**Definition:**

A brute-force search tries keys from the key space until one works. The protection is to make that search impractical, not to hide which algorithm you used.

**How it works:**

- The cost tracks the size of the key space. A longer key is a larger space, which is why retired short-key ciphers are not a match for AES.
- For passwords, NIST SP 800-63B requires verifiers to store a salted password hash from a password hashing scheme that also takes a cost factor. The cost factor should be as high as practical, and raised over time as computers get faster, so each guess is expensive.
- The same publication treats a password as a memorized secret sent over an authenticated protected channel. Limiting guesses at the verifier is part of keeping online guessing impractical.
- This note does not describe how to search a key space or a password file.

**When to use:**

Prefer a standardized cipher with a modern key length for data, and a salted password hash with a high cost factor for memorized secrets. A fast general-purpose hash is the wrong tool for a password.

**Sources:**

- https://pages.nist.gov/800-63-4/sp800-63b.html
""",
"""**Definition:**

Полный перебор пробует ключи из пространства ключей, пока один не подойдёт. Защита в том, чтобы сделать этот перебор непрактичным, а не в том, чтобы скрывать название алгоритма.

**How it works:**

- Цена растёт вместе с размером пространства ключей. Более длинный ключ — большее пространство, поэтому устаревшие шифры с коротким ключом не стоят рядом с AES.
- Для паролей NIST SP 800-63B требует хранить у проверяющей стороны солёный хеш пароля, полученный схемой хеширования паролей, которая принимает ещё и коэффициент стоимости. Коэффициент должен быть настолько высоким, насколько это практично, и со временем повышаться, чтобы каждая догадка была дорогой.
- Та же публикация считает пароль запоминаемым секретом, который передают по аутентифицированному защищённому каналу. Ограничение числа попыток на стороне проверяющего удерживает онлайн-угадывание непрактичным.
- Эта заметка не описывает, как перебирать пространство ключей или файл паролей.

**When to use:**

Для данных берите стандартный шифр с современной длиной ключа, а для запоминаемых секретов — солёный хеш пароля с высоким коэффициентом стоимости. Быстрый хеш общего назначения для пароля не подходит.

**Sources:**

- https://pages.nist.gov/800-63-4/sp800-63b.html
""")

add(
"Describe a man-in-the-middle attack and how it can be prevented.",
"""**Definition:**

A manipulator in the middle sits on the path between two parties and can read or change what they exchange. Prevention is to authenticate the peer, not to hope the path is private.

**How it works:**

- MDN describes TLS as a client/server protocol that uses cryptography so a third party cannot eavesdrop on or tamper with the messages. The server must present a valid digital certificate that confirms its identity before the secure connection is established.
- Both sides can authenticate if each presents its own certificate. That is mutual authentication.
- The `Secure` attribute on `Set-Cookie` sends the cookie only on `https:` (except localhost). MDN states that this makes the cookie more resistant to a manipulator in the middle. `Secure` does not by itself stop a script from reading the cookie if `HttpOnly` is absent.
- This note does not describe how to insert a party onto a path.

**When to use:**

Use TLS with a certificate the client can check whenever the bytes cross a network you do not control. Add `Secure` and `HttpOnly` on cookies that must not travel in the clear or be readable from page script.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/TLS
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
""",
"""**Definition:**

Посредник на пути сидит между двумя сторонами и может читать или менять то, чем они обмениваются. Предотвращение — аутентифицировать собеседника, а не надеяться, что путь и так закрыт.

**How it works:**

- MDN описывает TLS как протокол клиента и сервера, который с помощью криптографии не даёт третьей стороне подслушивать сообщения или подменять их. Сервер должен предъявить действительный цифровой сертификат, подтверждающий его личность, прежде чем будет установлено защищённое соединение.
- Обе стороны могут аутентифицировать друг друга, если каждая предъявляет свой сертификат. Это взаимная аутентификация.
- Атрибут `Secure` у `Set-Cookie` отправляет cookie только по `https:` (кроме localhost). MDN указывает, что это делает cookie устойчивее к посреднику на пути. Одного `Secure` недостаточно, чтобы запретить скрипту читать cookie, если нет `HttpOnly`.
- Эта заметка не описывает, как поставить сторону на путь.

**When to use:**

Используйте TLS с сертификатом, который клиент может проверить, когда байты идут по сети, которой вы не управляете. Для cookie, которые не должны идти открытым текстом или читаться скриптом страницы, добавляйте `Secure` и `HttpOnly`.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/TLS
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
""")

add(
"Explain what a side-channel attack is.",
"""**Definition:**

A side-channel attack is enabled by leakage from a physical or deployed cryptosystem. NIST lists timing, power consumption, and electromagnetic and acoustic emissions as characteristics that can be used.

**How it works:**

- The cipher’s math can be sound while the implementation still leaks. The leak is a measurement of how the device behaves, not a field in the ciphertext.
- NIST SP 800-63-4, SP 800-227, and SP 1800-21B all use that framing: timing, power, electromagnetic emissions, and acoustic emissions.
- FIPS 140-3 includes non-invasive security among the areas a cryptographic module must address, alongside physical security and self-tests.
- This note does not describe how to measure a device or how to turn a measurement into a key.

**When to use:**

Treat constant-time, reviewed implementations and a validated module as the response when the key is valuable enough that a lab measurement matters. Algorithm choice alone does not close a side channel.

**Sources:**

- https://csrc.nist.gov/glossary/term/side_channel_attack
- https://csrc.nist.gov/pubs/fips/140-3/final
""",
"""**Definition:**

Атака по побочному каналу возможна из-за утечки из физической или развёрнутой криптосистемы. NIST относит к таким характеристикам время, энергопотребление, электромагнитное и акустическое излучение.

**How it works:**

- Математика шифра может быть корректной, а реализация всё равно утекает. Утечка — это измерение поведения устройства, а не поле в шифртексте.
- NIST SP 800-63-4, SP 800-227 и SP 1800-21B формулируют это одинаково: время, мощность, электромагнитное и акустическое излучение.
- FIPS 140-3 включает неинвазивную безопасность в перечень областей, которые должен закрывать криптографический модуль, рядом с физической безопасностью и самопроверками.
- Эта заметка не описывает, как измерять устройство или как превратить измерение в ключ.

**When to use:**

Если ключ настолько ценен, что лабораторное измерение имеет значение, ответом служат реализации с постоянным временем, прошедшие разбор, и проверенный модуль. Одного выбора алгоритма недостаточно, чтобы закрыть побочный канал.

**Sources:**

- https://csrc.nist.gov/glossary/term/side_channel_attack
- https://csrc.nist.gov/pubs/fips/140-3/final
""")

add(
"What is a chosen plaintext attack?",
"""**Definition:**

A chosen-plaintext setting is one in which the analyst can obtain ciphertext for plaintexts they select. A confidentiality scheme is expected to keep the plaintext hidden even in that setting.

**How it works:**

- NIST defines cryptanalysis as the study of techniques for attempting to defeat cryptographic protection, including weaknesses in an algorithm or its implementation. Chosen plaintext is one of the models used in that study.
- The analyst’s extra power is access to an encryption operation, not knowledge of the key. The security claim is that this access still does not reveal other plaintexts.
- RSA in this note is not raw modular exponentiation. RFC 8017 specifies RSAES-OAEP and RSAES-PKCS1-v1_5 as the encryption schemes. The padding is part of the scheme, which is why interviews reject “encrypt the message as m^e mod n” as the whole design.
- This note does not describe how to choose plaintexts or how to use the resulting ciphertexts.

**Sources:**

- https://csrc.nist.gov/glossary/term/cryptanalysis
- https://www.rfc-editor.org/rfc/rfc8017#section-3.1
""",
"""**Definition:**

Модель с выбранным открытым текстом — это ситуация, в которой аналитик может получить шифртекст для открытых текстов, которые выбирает сам. Схема конфиденциальности должна скрывать открытый текст и в такой ситуации.

**How it works:**

- NIST определяет криптоанализ как изучение методов, которыми пытаются преодолеть криптографическую защиту, включая слабости алгоритма или его реализации. Выбранный открытый текст — одна из моделей этого изучения.
- Дополнительная возможность аналитика — доступ к операции шифрования, а не знание ключа. Утверждение о стойкости в том, что этот доступ всё равно не раскрывает другие открытые тексты.
- RSA в этой заметке — не голая модульная экспонента. RFC 8017 задаёт RSAES-OAEP и RSAES-PKCS1-v1_5 как схемы шифрования. Дополнение — часть схемы, поэтому на собеседовании ответ «зашифровать сообщение как m^e mod n» не считают всей конструкцией.
- Эта заметка не описывает, как выбирать открытые тексты или как использовать полученные шифртексты.

**Sources:**

- https://csrc.nist.gov/glossary/term/cryptanalysis
- https://www.rfc-editor.org/rfc/rfc8017#section-3.1
""")

add(
"How does a frequency analysis attack work against certain ciphers?",
"""**Definition:**

Frequency analysis matters for ciphers that preserve the frequency of symbols, such as a simple substitution in which one letter always becomes the same other letter. The ciphertext then still carries the language’s letter frequencies.

**How it works:**

- A classical substitution cipher maps each symbol to one symbol. Common letters stay common, only under a different name. That is the property the analysis uses.
- A modern block cipher does not keep that property. AES, covered earlier in this note, mixes substitution with a keyed permutation across the whole block, so a single letter’s frequency does not appear as a single ciphertext symbol’s frequency.
- The impact is limited to ciphers that leak symbol frequency. It is not a property of AES, and it is not a procedure this note will spell out.
- If a design still encrypts letter by letter with a fixed substitution, it has this weakness regardless of how the alphabet is scrambled.

**Sources:**

- https://csrc.nist.gov/glossary/term/cryptanalysis
""",
"""**Definition:**

Частотный анализ существенен для шифров, которые сохраняют частоту символов, например для простой замены, где одна буква всегда переходит в одну и ту же другую. Тогда шифртекст по-прежнему несёт частоты букв языка.

**How it works:**

- Классический шифр замены сопоставляет каждому символу один символ. Частые буквы остаются частыми, только под другим именем. Именно это свойство и использует анализ.
- Современный блочный шифр этого свойства не сохраняет. AES, разобранный раньше в этой заметке, смешивает замену с ключевой перестановкой по всему блоку, поэтому частота одной буквы не проявляется как частота одного символа шифртекста.
- Последствие ограничено шифрами, которые выдают частоту символов. Это не свойство AES, и эту заметку процедура не расписывает.
- Если схема всё ещё шифрует побуквенно фиксированной заменой, слабость остаётся, как бы ни был перемешан алфавит.

**Sources:**

- https://csrc.nist.gov/glossary/term/cryptanalysis
""")

add(
"What is the difference between HMAC and a simple hash function?",
"""**Definition:**

A hash function maps a message to a digest with no secret. HMAC is a message authentication code: the same kind of hash, plus a shared secret key, so only a holder of the key can produce or check the tag.

**How it works:**

- RFC 2104 defines HMAC as a MAC built from any iterative cryptographic hash, denoted H, and a secret shared key. The strength depends on the properties of that hash.
- The RFC’s goals are to use existing hash functions unchanged, keep their performance, handle keys simply, rest the analysis on assumptions about H, and swap H when a better hash appears.
- The RFC’s 1997 examples are HMAC-MD5 and HMAC-SHA1. Those names illustrate the construction. A current call is Node’s `crypto.createHmac(algorithm, key)`, for example `createHmac('sha256', key)`, then `update` and `digest`.
- A bare hash is public. Anyone who has the message can recompute it, so it does not authenticate the sender. HMAC does, because the key is required on both sides.
- Compare tags with a constant-time compare. Node’s `crypto.timingSafeEqual` requires the two buffers to have the same length.

**When to use:**

Use a hash when you need a fingerprint and no one has to prove they hold a key. Use HMAC when two parties share a secret and must detect a changed message.

**Examples:**

```js
import { createHmac } from 'node:crypto';

const tag = createHmac('sha256', key).update(message).digest('hex');
```

**Sources:**

- https://www.rfc-editor.org/rfc/rfc2104.html
- https://nodejs.org/api/crypto.html#cryptocreatehmacalgorithm-key-options
""",
"""**Definition:**

Хеш-функция переводит сообщение в дайджест без секрета. HMAC — код аутентификации сообщения: та же хеш-функция плюс общий секретный ключ, так что создать или проверить метку может только владелец ключа.

**How it works:**

- RFC 2104 определяет HMAC как MAC, построенный из любой итеративной криптографической хеш-функции, обозначенной H, и общего секретного ключа. Стойкость зависит от свойств этой хеш-функции.
- Цели RFC: использовать существующие хеш-функции без изменений, сохранить их скорость, просто обращаться с ключами, опираться в анализе на предположения об H и заменять H, когда появляется лучшая хеш-функция.
- Примеры RFC 1997 года — HMAC-MD5 и HMAC-SHA1. Эти имена иллюстрируют конструкцию. Современный вызов — `crypto.createHmac(algorithm, key)` в Node, например `createHmac('sha256', key)`, затем `update` и `digest`.
- Голый хеш публичен. Кто угодно, у кого есть сообщение, пересчитает его, поэтому отправителя он не аутентифицирует. HMAC аутентифицирует, потому что ключ нужен обеим сторонам.
- Метки сравнивают за постоянное время. `crypto.timingSafeEqual` в Node требует, чтобы оба буфера были одной длины.

**When to use:**

Хеш нужен, когда требуется отпечаток и никому не надо доказывать владение ключом. HMAC нужен, когда две стороны делят секрет и должны заметить изменённое сообщение.

**Examples:**

```js
import { createHmac } from 'node:crypto';

const tag = createHmac('sha256', key).update(message).digest('hex');
```

**Sources:**

- https://www.rfc-editor.org/rfc/rfc2104.html
- https://nodejs.org/api/crypto.html#cryptocreatehmacalgorithm-key-options
""")

add(
"Explain the concept of a collision in hash functions and why it is significant.",
"""**Definition:**

A collision is two different inputs that a hash function maps to the same digest. It matters because a digital signature is a hash of the data followed by a signature function: a collision means one signature can verify for a different message.

**How it works:**

- NIST SP 800-107 describes a digital signature as those two functions in that order. Origin authentication, integrity, and non-repudiation are claims about the message that was hashed.
- If a second message hashes to the same digest, the signature check succeeds for the second message as well. The private key never touched that second message.
- A cryptographic hash is expected to make finding such a pair impractical. A hash that does not is the wrong function under a signature.
- This note does not describe how to search for a colliding pair.

**Sources:**

- https://csrc.nist.gov/glossary/term/digital_signature
""",
"""**Definition:**

Коллизия — два разных входа, которые хеш-функция переводит в один и тот же дайджест. Это важно, потому что цифровая подпись — это хеш данных и затем функция подписи: при коллизии одна подпись может пройти проверку для другого сообщения.

**How it works:**

- NIST SP 800-107 описывает цифровую подпись как эти две функции именно в таком порядке. Аутентификация источника, целостность и неотказуемость — утверждения о том сообщении, которое хешировали.
- Если второе сообщение даёт тот же дайджест, проверка подписи проходит и для него. Закрытый ключ этого второго сообщения не касался.
- От криптографической хеш-функции ждут, что найти такую пару будет непрактично. Хеш, который этого не обеспечивает, нельзя ставить под подпись.
- Эта заметка не описывает, как искать пару с коллизией.

**Sources:**

- https://csrc.nist.gov/glossary/term/digital_signature
""")

add(
"Describe the birthday attack and its relevance to hash functions.",
"""**Definition:**

The birthday bound is the point at which a collision between two hash outputs becomes plausible: on the order of the square root of the number of possible digests, not after a search of every digest. For an n-bit hash that is about 2^(n/2) evaluations.

**How it works:**

- The name comes from the same counting as the birthday paradox: matches show up much earlier than a scan of the whole space.
- The impact on hash choice is direct. A 128-bit collision bound needs a hash whose output is about 256 bits, which is why SHA-256 is the usual answer when that bound is the requirement.
- RFC 6962’s Merkle tree separates leaf hashes and inner hashes (a `0x00` prefix on a leaf, a `0x01` prefix on an inner node) and says that domain separation is required to give second-preimage resistance. That is a concrete place where hash collisions are a design constraint, not an afterthought.
- This note does not describe a search that looks for the collision.

**Sources:**

- https://www.rfc-editor.org/rfc/rfc6962#section-2.1
- https://csrc.nist.gov/glossary/term/digital_signature
""",
"""**Definition:**

Граница дня рождения — это момент, когда коллизия двух хеш-выходов становится правдоподобной: порядка квадратного корня из числа возможных дайджестов, а не после перебора каждого дайджеста. Для n-битного хеша это около 2^(n/2) вычислений.

**How it works:**

- Название из того же подсчёта, что и парадокс дней рождения: совпадения появляются гораздо раньше, чем обход всего пространства.
- На выбор хеша это влияет прямо. Граница коллизий в 128 бит требует хеш с выходом около 256 бит, поэтому при таком требовании обычный ответ — SHA-256.
- Дерево Меркла в RFC 6962 разделяет хеши листьев и внутренних узлов (префикс `0x00` у листа, `0x01` у внутреннего узла) и говорит, что разделение областей нужно для стойкости ко второму прообразу. Это конкретное место, где коллизии хеша — ограничение проекта, а не запоздалая мысль.
- Эта заметка не описывает поиск, который ищет коллизию.

**Sources:**

- https://www.rfc-editor.org/rfc/rfc6962#section-2.1
- https://csrc.nist.gov/glossary/term/digital_signature
""")

print("pairs so far", len(PAIRS))
Path("/tmp/crypto_pairs_count.txt").write_text(str(len(PAIRS)))
# store as pickle for the applier to extend — write json of first batch
import json
Path("/Users/radomir/Documents/business/MyConspect/.tmp_fill/crypto_part1.json").write_text(
    json.dumps(PAIRS, ensure_ascii=False, indent=1)
)
print("wrote", len(PAIRS))
PY