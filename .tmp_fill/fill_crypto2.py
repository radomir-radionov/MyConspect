#!/usr/bin/env python3
import json
from pathlib import Path

p = Path("/Users/radomir/Documents/business/MyConspect/.tmp_fill/crypto_part1.json")
PAIRS = json.loads(p.read_text())

def add(heading, en, ru):
    PAIRS.append((heading, en.strip(), ru.strip()))

add(
"How does a digital signature guarantee the integrity and authenticity of a message?",
"""**Definition:**

A digital signature is the result of a cryptographic transformation of data. When it is implemented properly, NIST says it provides origin authentication, data integrity, and signatory non-repudiation. It does not provide confidentiality.

**How it works:**

- NIST SP 800-63-4 describes the operation as asymmetric: the private key signs, and the public key verifies.
- NIST SP 800-107 describes the transformation as two functions in order: a hash of the data, then a signature function on that hash. A changed message hashes differently, so verification fails. That is the integrity check.
- Authenticity is the check that the public key which verifies the signature belongs to the signer you meant. The signature does not by itself tell you whose key that is; a certificate or another trusted binding does.
- Non-repudiation is the claim that only the private-key holder could have produced the signature. NIST also notes that signatures do not provide replay protection.
- This note does not describe how to forge a signature.

**Sources:**

- https://csrc.nist.gov/glossary/term/digital_signature
""",
"""**Definition:**

Цифровая подпись — результат криптографического преобразования данных. При правильной реализации NIST говорит, что она даёт аутентификацию источника, целостность данных и неотказуемость подписавшего. Конфиденциальности она не даёт.

**How it works:**

- NIST SP 800-63-4 описывает операцию как асимметричную: закрытый ключ подписывает, открытый проверяет.
- NIST SP 800-107 описывает преобразование как две функции по порядку: хеш данных, затем функция подписи над этим хешем. Изменённое сообщение даёт другой хеш, и проверка не проходит. Это и есть проверка целостности.
- Подлинность — проверка того, что открытый ключ, которым сошлась подпись, принадлежит тому подписавшему, которого вы имели в виду. Сама подпись не сообщает, чей это ключ; это делает сертификат или другая доверенная привязка.
- Неотказуемость — утверждение, что подпись мог создать только владелец закрытого ключа. NIST также отмечает, что подписи не защищают от повтора.
- Эта заметка не описывает, как подделать подпись.

**Sources:**

- https://csrc.nist.gov/glossary/term/digital_signature
""")

add(
"What are RSA signatures, and how do they differ from RSA encryption?",
"""**Definition:**

RSA signatures and RSA encryption use the same kind of key pair and different schemes. RFC 8017 specifies RSASSA-PSS and RSASSA-PKCS1-v1_5 for signatures, and RSAES-OAEP and RSAES-PKCS1-v1_5 for encryption.

**How it works:**

- A signature uses the private key to sign and the public key to verify. NIST states that this gives authenticity, integrity, and non-repudiation, and not confidentiality.
- Encryption uses the public key so that only the private-key holder can read the message. That is confidentiality for one recipient, not a signature.
- The public key in RFC 8017 is the modulus n and the public exponent e. The private key is the private exponent d, or the prime factors and CRT coefficients. Publishing n and e is the point. Publishing d or the primes is not.
- Do not treat raw modular exponentiation as either scheme. The RFC specifies the padding and the encoding for each scheme, and the two jobs are not interchangeable.
- Prefer the OAEP encryption scheme and the PSS signature scheme the RFC specifies when you are choosing among the schemes it lists.

**When to use:**

Sign when you need integrity and origin. Encrypt when you need confidentiality to the holder of the private key. Use a separate key pair for each job.

**Sources:**

- https://www.rfc-editor.org/rfc/rfc8017#section-3.1
- https://csrc.nist.gov/glossary/term/digital_signature
""",
"""**Definition:**

Подписи RSA и шифрование RSA используют один и тот же вид пары ключей и разные схемы. RFC 8017 задаёт RSASSA-PSS и RSASSA-PKCS1-v1_5 для подписей и RSAES-OAEP и RSAES-PKCS1-v1_5 для шифрования.

**How it works:**

- Подпись использует закрытый ключ, чтобы подписать, и открытый, чтобы проверить. NIST указывает, что это даёт подлинность, целостность и неотказуемость, но не конфиденциальность.
- Шифрование использует открытый ключ так, чтобы прочитать сообщение мог только владелец закрытого ключа. Это конфиденциальность для одного получателя, а не подпись.
- Открытый ключ в RFC 8017 — модуль n и открытая экспонента e. Закрытый ключ — закрытая экспонента d либо простые множители и коэффициенты CRT. Публиковать n и e — смысл открытого ключа. Публиковать d или простые множители — нет.
- Не считайте голую модульную экспоненту ни одной из схем. RFC задаёт дополнение и кодирование для каждой схемы, и эти две задачи не взаимозаменяемы.
- Когда выбираете среди схем RFC, предпочитайте шифрование OAEP и подпись PSS, которые RFC указывает.

**When to use:**

Подписывайте, когда нужны целостность и источник. Шифруйте, когда нужна конфиденциальность для владельца закрытого ключа. Для каждой задачи используйте отдельную пару ключей.

**Sources:**

- https://www.rfc-editor.org/rfc/rfc8017#section-3.1
- https://csrc.nist.gov/glossary/term/digital_signature
""")

add(
"Explain the importance of using a secure hash algorithm for digital signatures.",
"""**Definition:**

NIST describes a digital signature as a hash of the data followed by a signature function. The signature checks the hash, so the hash has to be a function for which a second message with the same digest is impractical.

**How it works:**

- Integrity fails open if a second message collides with the signed hash: verification succeeds for a message the private key never signed.
- The birthday bound puts that collision near 2^(n/2) evaluations for an n-bit digest. A hash whose output is too short does not meet a collision requirement even when the signature math is fine.
- RFC 2104 already treated the hash as replaceable, and its 1997 examples (MD5, SHA-1) are not what you put under a new signature. Node’s `createHmac('sha256', key)` shows the modern habit: name a current hash explicitly.
- XML Signature 1.1, in a related standard, called out additional hash algorithms as a conformance change for the same reason: the hash under the signature is part of the security claim.

**When to use:**

Hash with a current approved function such as SHA-256 or stronger, then sign that digest with the signature scheme. Do not sign with MD5 or SHA-1 in a new design.

**Sources:**

- https://csrc.nist.gov/glossary/term/digital_signature
- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
""",
"""**Definition:**

NIST описывает цифровую подпись как хеш данных и затем функцию подписи. Подпись проверяет хеш, поэтому хеш должен быть функцией, для которой второе сообщение с тем же дайджестом непрактично.

**How it works:**

- Целостность не держится, если второе сообщение сталкивается с подписанным хешем: проверка проходит для сообщения, которое закрытый ключ не подписывал.
- Граница дня рождения ставит такую коллизию около 2^(n/2) вычислений для n-битного дайджеста. Хеш со слишком коротким выходом не закрывает требование по коллизиям, даже если математика подписи в порядке.
- RFC 2104 уже считал хеш заменяемым, а его примеры 1997 года (MD5, SHA-1) не то, что ставят под новую подпись. `createHmac('sha256', key)` в Node показывает современную привычку: явно называть текущий хеш.
- XML Signature 1.1, в смежном стандарте, выделил дополнительные алгоритмы хеша как изменение требований по той же причине: хеш под подписью — часть утверждения о стойкости.

**When to use:**

Хешируйте текущей одобренной функцией, такой как SHA-256 или сильнее, и подписывайте этот дайджест схемой подписи. В новой схеме не подписывайте с MD5 или SHA-1.

**Sources:**

- https://csrc.nist.gov/glossary/term/digital_signature
- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
""")

add(
"What is a Merkle tree, and how is it used in cryptography?",
"""**Definition:**

A Merkle hash tree commits a list of entries to one root hash. RFC 6962 uses a binary Merkle hash tree so a log can be audited efficiently: a leaf can be shown to sit under the signed root without sending every entry.

**How it works:**

- The hash in that RFC is SHA-256. The input is an ordered list of data entries. Those entries are hashed to form the leaves. The output is a single 32-byte Merkle Tree Hash.
- An empty list hashes as SHA-256 of an empty string. A single entry (a leaf) is SHA-256 of `0x00` concatenated with the entry. For a longer list, the root is SHA-256 of `0x01` concatenated with the hashes of the left and right parts. The RFC says this domain separation is required for second-preimage resistance.
- The tree need not be a full power of two. Its shape is fixed by the number of leaves.
- A Merkle audit path is the shortest list of extra nodes needed to recompute the root from one leaf. If that root matches the signed root, the leaf is in the tree.
- Certificate Transparency uses this so a client can check inclusion. The same shape appears wherever a signed root must cover many items.

**Examples:**

A log signs one root. A client that holds one certificate and the audit path recomputes the root and compares it to the signed root. The client does not need every certificate in the log.

**Sources:**

- https://www.rfc-editor.org/rfc/rfc6962#section-2.1
""",
"""**Definition:**

Хеш-дерево Меркла связывает список записей с одним корневым хешем. RFC 6962 использует двоичное хеш-дерево Меркла, чтобы журнал можно было эффективно проверять: лист можно показать под подписанным корнем, не передавая все записи.

**How it works:**

- Хеш в этом RFC — SHA-256. Вход — упорядоченный список записей. Из них хешированием получают листья. Выход — один 32-байтовый Merkle Tree Hash.
- Пустой список хешируется как SHA-256 пустой строки. Одна запись (лист) — это SHA-256 от `0x00`, склеенного с записью. Для более длинного списка корень — SHA-256 от `0x01`, склеенного с хешами левой и правой частей. RFC говорит, что это разделение областей нужно для стойкости ко второму прообразу.
- Дерево не обязано быть полной степенью двойки. Его форма задаётся числом листьев.
- Путь аудита Меркла — кратчайший список дополнительных узлов, нужных чтобы пересчитать корень от одного листа. Если этот корень совпал с подписанным корнем, лист входит в дерево.
- Certificate Transparency использует это, чтобы клиент мог проверить включение. Та же форма появляется везде, где подписанный корень должен покрывать много элементов.

**Examples:**

Журнал подписывает один корень. Клиент, у которого есть один сертификат и путь аудита, пересчитывает корень и сравнивает его с подписанным корнем. Все сертификаты журнала клиенту не нужны.

**Sources:**

- https://www.rfc-editor.org/rfc/rfc6962#section-2.1
""")

add(
"What is key distribution, and what challenges does it present?",
"""**Definition:**

Key distribution is getting keying material to the parties who must use it, with the protection that type of key requires. NIST SP 800-57 Part 1 Rev. 5 is the general guidance: security services, algorithms, key types, and the protection each type needs.

**How it works:**

- A secret or private key must stay confidential on the way. A public key must stay unmodified, because a substituted public key sends data to the wrong holder or verifies the wrong signer.
- Symmetric encryption needs the same secret at both ends before any ciphertext is useful. That shared secret is the distribution problem.
- Asymmetric encryption publishes the public key and keeps the private key at one holder. Distribution then becomes an integrity problem for the public key, which is what a certificate is for.
- Diffie-Hellman, below, agrees a shared secret without sending that secret. It still needs the parties to authenticate each other, or the agreed secret is with the wrong peer.
- SP 800-57 discusses the functions of key management and the issues that show up when cryptography is actually used. Generation, storage, and who may see each key are part of distribution, not a later cleanup.

**Sources:**

- https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final
""",
"""**Definition:**

Распределение ключей — это доставка ключевого материала тем сторонам, которые должны его применять, с защитой, которую требует данный тип ключа. NIST SP 800-57 Part 1 Rev. 5 — общее руководство: сервисы безопасности, алгоритмы, типы ключей и защита, нужная каждому типу.

**How it works:**

- Секретный или закрытый ключ по пути должен оставаться конфиденциальным. Открытый ключ должен остаться неизменным, потому что подменённый открытый ключ отправит данные не тому владельцу или проверит не того подписавшего.
- Симметричному шифрованию нужен один и тот же секрет на обоих концах, прежде чем шифртекст станет полезен. Этот общий секрет и есть проблема распределения.
- Асимметричное шифрование публикует открытый ключ и держит закрытый у одного владельца. Распределение тогда становится проблемой целостности открытого ключа, и для этого существует сертификат.
- Diffie-Hellman, ниже, согласовывает общий секрет, не пересылая этот секрет. Сторонам всё равно нужно аутентифицировать друг друга, иначе секрет согласован не с тем собеседником.
- SP 800-57 разбирает функции управления ключами и вопросы, которые возникают, когда криптографию реально применяют. Порождение, хранение и то, кто может видеть каждый ключ, — часть распределения, а не последующая уборка.

**Sources:**

- https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final
""")

add(
"Describe Diffie-Hellman key exchange and its primary use.",
"""**Definition:**

Diffie-Hellman lets two parties agree a shared secret. Each keeps a private value and sends a public value. The secret is computed from one side’s private value and the other side’s public value. It is not sent on the wire.

**How it works:**

- Node’s `crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])` builds a key-exchange object from a prime and an optional generator. The generator defaults to 2.
- `crypto.diffieHellman({ privateKey, publicKey })` computes the shared secret. Both keys must be the same asymmetric type and must support DH or ECDH. The return value is a `Buffer`.
- The primary use is key agreement: the shared secret becomes keying material for a symmetric cipher, so the long-term problem is no longer “ship the symmetric key.”
- Agreement is not authentication. TLS 1.3 uses (EC)DHE with a pre-shared key when it wants forward secrecy together with shared keys. A PSK used alone, the RFC says, drops forward secrecy for the application data.
- This note does not include parameters chosen so that the exchange is weak, and it does not describe how to recover a private value.

**When to use:**

Use DH or ECDH when two parties need a fresh shared secret and can authenticate the public values. Use the Node functions only with keys that already support DH or ECDH.

**Sources:**

- https://nodejs.org/api/crypto.html#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding
- https://www.rfc-editor.org/rfc/rfc8446#section-1.2
""",
"""**Definition:**

Diffie-Hellman позволяет двум сторонам согласовать общий секрет. Каждая хранит закрытое значение и отправляет открытое. Секрет вычисляется из закрытого значения одной стороны и открытого значения другой. По проводу его не передают.

**How it works:**

- `crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])` в Node строит объект обмена ключами из простого числа и необязательного генератора. Генератор по умолчанию равен 2.
- `crypto.diffieHellman({ privateKey, publicKey })` вычисляет общий секрет. Оба ключа должны быть одного асимметричного типа и поддерживать DH или ECDH. Возвращается `Buffer`.
- Главное применение — согласование ключа: общий секрет становится ключевым материалом для симметричного шифра, и давняя проблема «переслать симметричный ключ» снимается.
- Согласование — это не аутентификация. TLS 1.3 использует (EC)DHE вместе с заранее известным ключом, когда нужна прямая секретность вместе с общими ключами. RFC говорит, что PSK сам по себе лишает данные приложения прямой секретности.
- В этой заметке нет параметров, подобранных так, чтобы обмен был слабым, и нет описания, как восстановить закрытое значение.

**When to use:**

Используйте DH или ECDH, когда двум сторонам нужен свежий общий секрет и они могут аутентифицировать открытые значения. Функции Node применяйте только с ключами, которые уже поддерживают DH или ECDH.

**Sources:**

- https://nodejs.org/api/crypto.html#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding
- https://www.rfc-editor.org/rfc/rfc8446#section-1.2
""")

add(
"Explain what a key escrow is and its purpose in cryptography.",
"""**Definition:**

Key escrow, in the NIST glossary, is the retention of the private component of the key pair associated with a subscriber’s encryption certificate, so that the key can be recovered.

**How it works:**

- The purpose is recovery. If the holder loses the private decryption key, retained material can still decrypt data that was encrypted to that certificate.
- The glossary ties the retained component to an encryption certificate. A signature key is a different object: escrow of a signing key would let someone else produce signatures, which is not the recovery goal stated there.
- Escrow is a policy and a storage problem. SP 800-57 Part 1 requires each type of keying material to be protected as that type requires. Escrowed private keys need the same confidentiality as any other private decryption key, plus a rule for who may ask for recovery.
- It is not a substitute for a backup you do not control. It is an intentional copy, held so recovery is possible.

**When to use:**

Use escrow when the organization must be able to decrypt data after the holder is gone, and when policy allows a copy of that decryption key. Do not escrow a signing key in order to decrypt.

**Sources:**

- https://csrc.nist.gov/glossary/term/key_escrow
- https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final
""",
"""**Definition:**

Депонирование ключа, по глоссарию NIST, — это хранение закрытого компонента пары ключей, связанной с сертификатом шифрования абонента, чтобы ключ можно было восстановить.

**How it works:**

- Цель — восстановление. Если владелец потерял закрытый ключ расшифрования, сохранённый материал всё ещё может расшифровать данные, зашифрованные на этот сертификат.
- Глоссарий привязывает сохраняемый компонент к сертификату шифрования. Ключ подписи — другой объект: депонирование ключа подписи позволило бы кому-то другому создавать подписи, а это не та цель восстановления, которая там указана.
- Депонирование — вопрос политики и хранения. SP 800-57 Part 1 требует защищать каждый тип ключевого материала так, как требует этот тип. Депонированные закрытые ключи нуждаются в той же конфиденциальности, что и любой другой закрытый ключ расшифрования, плюс в правиле, кто может запросить восстановление.
- Это не замена резервной копии, которой вы не управляете. Это намеренная копия, которую держат, чтобы восстановление было возможно.

**When to use:**

Депонируйте ключ, когда организация должна расшифровывать данные после ухода владельца и когда политика разрешает копию этого ключа расшифрования. Не депонируйте ключ подписи ради расшифрования.

**Sources:**

- https://csrc.nist.gov/glossary/term/key_escrow
- https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final
""")

add(
"How do certificate authorities help in securing communications over the internet?",
"""**Definition:**

A certificate authority binds a name to a public key by signing that binding. TLS then uses the certificate so the client can confirm the server’s identity before the secure session.

**How it works:**

- MDN states that a TLS server must provide a valid digital certificate confirming its identity in order to establish a secure connection. Without that check, the client cannot tell which public key belongs to the name it asked for.
- A digital signature, per NIST, gives origin authentication and integrity when the private key signs and the public key verifies. The CA’s signature on the certificate is that operation applied to the name and the subject public key.
- The client already trusts the CA’s public key (or a chain up to one it trusts). Checking the signature fails if the certificate was altered.
- Both parties may present certificates. MDN calls that mutual authentication.
- The CA does not encrypt the traffic. TLS does that after the identity check. The CA’s job is the binding the check relies on.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/TLS
- https://csrc.nist.gov/glossary/term/digital_signature
""",
"""**Definition:**

Удостоверяющий центр связывает имя с открытым ключом, подписывая эту связь. TLS затем использует сертификат, чтобы клиент мог подтвердить личность сервера до защищённого сеанса.

**How it works:**

- MDN указывает, что TLS-сервер должен предоставить действительный цифровой сертификат, подтверждающий его личность, чтобы установить защищённое соединение. Без этой проверки клиент не может сказать, какой открытый ключ принадлежит имени, которое он запросил.
- Цифровая подпись, по NIST, даёт аутентификацию источника и целостность, когда закрытый ключ подписывает, а открытый проверяет. Подпись центра на сертификате — эта операция, применённая к имени и открытому ключу субъекта.
- Клиент уже доверяет открытому ключу центра (или цепочке до ключа, которому доверяет). Проверка подписи не проходит, если сертификат изменили.
- Обе стороны могут предъявить сертификаты. MDN называет это взаимной аутентификацией.
- Центр не шифрует трафик. Это делает TLS после проверки личности. Работа центра — связь, на которую опирается проверка.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/TLS
- https://csrc.nist.gov/glossary/term/digital_signature
""")

add(
"What is forward secrecy, and what protocols use this property?",
"""**Definition:**

Forward secrecy means a later compromise of a long-term key does not reveal earlier session keys. NIST’s glossary defines perfect forward secrecy for IPsec as a new secret key created and shared through a new Diffie-Hellman exchange for each IPsec security association.

**How it works:**

- The IPsec wording in NIST SP 800-77 Rev. 1 is specific: each security association gets its own Diffie-Hellman secret, so an old key cannot be used against newer keys that still protect integrity and confidentiality.
- TLS 1.3 states the same property for pre-shared keys. A PSK used with (EC)DHE key exchange provides forward secrecy in combination with the shared keys. A PSK used alone loses forward secrecy for the application data.
- The session key is what encrypts the data. If that key was produced by a fresh Diffie-Hellman and then discarded, a later copy of the long-term key does not recompute it.
- RSA key transport of a session key does not have this property: the long-term private key can still decrypt the transported session key.

**When to use:**

Prefer a fresh Diffie-Hellman (or ECDH) per session when recorded traffic must stay confidential even if a long-term key is later copied. In TLS 1.3, that means (EC)DHE, including with a PSK, rather than a PSK alone.

**Sources:**

- https://csrc.nist.gov/glossary/term/perfect_forward_secrecy
- https://www.rfc-editor.org/rfc/rfc8446#section-1.2
""",
"""**Definition:**

Прямая секретность означает, что позднее раскрытие долговременного ключа не раскрывает прежние сеансовые ключи. Глоссарий NIST определяет совершенную прямую секретность для IPsec как новый секретный ключ, который создают и разделяют новым обменом Diffie-Hellman для каждой ассоциации безопасности IPsec.

**How it works:**

- Формулировка IPsec в NIST SP 800-77 Rev. 1 конкретна: каждая ассоциация безопасности получает свой секрет Diffie-Hellman, поэтому старый ключ нельзя применить к более новым ключам, которые всё ещё защищают целостность и конфиденциальность.
- TLS 1.3 говорит то же свойство про заранее известные ключи. PSK вместе с обменом (EC)DHE даёт прямую секретность в сочетании с общими ключами. PSK сам по себе лишает данные приложения прямой секретности.
- Сеансовый ключ шифрует данные. Если он получен свежим Diffie-Hellman и затем отброшен, поздняя копия долговременного ключа его не пересчитает.
- Транспорт сеансового ключа на RSA этого свойства не имеет: долговременный закрытый ключ по-прежнему может расшифровать переданный сеансовый ключ.

**When to use:**

Предпочитайте свежий Diffie-Hellman (или ECDH) на каждый сеанс, когда записанный трафик должен остаться конфиденциальным даже после копирования долговременного ключа. В TLS 1.3 это (EC)DHE, в том числе вместе с PSK, а не один только PSK.

**Sources:**

- https://csrc.nist.gov/glossary/term/perfect_forward_secrecy
- https://www.rfc-editor.org/rfc/rfc8446#section-1.2
""")

add(
"Explain the role of cryptography in user authentication.",
"""**Definition:**

Authentication shows that a claimant controls an authenticator bound to the subscriber. NIST SP 800-63B requires approved cryptographic techniques at Authentication Assurance Level 2 and above, and uses cryptography so a verifier can check that control without receiving a copy of a long-term private key.

**How it works:**

- A password is “something you know.” It is sent over an authenticated protected channel. The verifier stores a salted hash, not the password. That hash is a cryptographic primitive used so a stolen store is not the password list.
- Single-factor and multi-factor cryptographic authenticators prove possession of a key. The output is generally some type of signed message. At AAL3, multi-factor cryptographic authenticators must use public-key cryptography so the verifier’s copy of the check does not expose the authentication secret.
- TLS supplies the authenticated protected channel those passwords and protocol messages travel in. MDN requires the server certificate before that channel exists.
- Authentication is not authorization. Cryptography here answers “who controls this authenticator,” not “what that identity may do.”

**Sources:**

- https://pages.nist.gov/800-63-4/sp800-63b.html
- https://developer.mozilla.org/en-US/docs/Glossary/TLS
""",
"""**Definition:**

Аутентификация показывает, что заявитель управляет аутентификатором, привязанным к абоненту. NIST SP 800-63B требует одобренные криптографические методы на уровне гарантии аутентификации 2 и выше и использует криптографию, чтобы проверяющий мог убедиться в этом управлении, не получая копию долговременного закрытого ключа.

**How it works:**

- Пароль — это «то, что вы знаете». Его передают по аутентифицированному защищённому каналу. Проверяющий хранит солёный хеш, а не пароль. Этот хеш — криптографический примитив, чтобы украденное хранилище не было списком паролей.
- Однофакторные и многофакторные криптографические аутентификаторы доказывают владение ключом. Выход — как правило, некоторое подписанное сообщение. На AAL3 многофакторные криптографические аутентификаторы должны использовать криптографию с открытым ключом, чтобы копия проверки у проверяющего не раскрывала секрет аутентификации.
- TLS даёт тот аутентифицированный защищённый канал, по которому идут пароли и сообщения протокола. MDN требует сертификат сервера до того, как этот канал появится.
- Аутентификация — это не авторизация. Криптография здесь отвечает на вопрос «кто управляет этим аутентификатором», а не «что этой личности разрешено».

**Sources:**

- https://pages.nist.gov/800-63-4/sp800-63b.html
- https://developer.mozilla.org/en-US/docs/Glossary/TLS
""")

p.write_text(json.dumps(PAIRS, ensure_ascii=False, indent=1))
print("count", len(PAIRS))
