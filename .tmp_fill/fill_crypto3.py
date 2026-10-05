#!/usr/bin/env python3
import json
from pathlib import Path

p = Path("/Users/radomir/Documents/business/MyConspect/.tmp_fill/crypto_part1.json")
PAIRS = json.loads(p.read_text())

def add(heading, en, ru):
    PAIRS.append((heading, en.strip(), ru.strip()))

add(
"What is multi-factor authentication, and how is cryptography involved?",
"""**Definition:**

Multi-factor authentication requires proof of possession and control of two distinct authentication factors. NIST SP 800-63B defines Authentication Assurance Level 2 that way, and requires approved cryptographic techniques there.

**How it works:**

- AAL2 allows either one multi-factor authenticator or a combination of two single-factor authenticators. A multi-factor authenticator needs two factors for a single authentication event, such as a cryptographic device that will not run until a biometric sensor activates it.
- Permitted multi-factor types at AAL2 include a multi-factor out-of-band authenticator, a multi-factor one-time password, and multi-factor cryptographic authentication.
- Multi-factor cryptographic authentication proves control of a key that is activated by a second factor. The output is generally a signed message. The key is “something you have”; the activation factor is “something you know” or “something you are.”
- At AAL3 those authenticators must use public-key cryptography so compromise of the verifier does not reveal the authentication secret.
- A password alone is one factor, “something you know,” and NIST says passwords are not phishing-resistant. Adding a second factor is what moves the event to AAL2.

**When to use:**

Use a multi-factor authenticator, or two distinct factors, when the account needs AAL2 or higher. Use public-key cryptographic authentication when the verifier must not hold a copy of the authentication secret.

**Sources:**

- https://pages.nist.gov/800-63-4/sp800-63b.html
""",
"""**Definition:**

Многофакторная аутентификация требует доказательства владения и управления двумя разными факторами аутентификации. NIST SP 800-63B так определяет уровень гарантии аутентификации 2 и требует там одобренные криптографические методы.

**How it works:**

- AAL2 допускает либо один многофакторный аутентификатор, либо сочетание двух однофакторных. Многофакторному аутентификатору нужны два фактора на одно событие аутентификации, например криптографическое устройство, которое не работает, пока его не активирует биометрический датчик.
- Среди разрешённых многофакторных типов на AAL2 — многофакторный внеполосный аутентификатор, многофакторный одноразовый пароль и многофакторная криптографическая аутентификация.
- Многофакторная криптографическая аутентификация доказывает управление ключом, который активируется вторым фактором. Выход — как правило, подписанное сообщение. Ключ — это «то, что у вас есть»; фактор активации — «то, что вы знаете» или «то, чем вы являетесь».
- На AAL3 такие аутентификаторы должны использовать криптографию с открытым ключом, чтобы компрометация проверяющего не раскрыла секрет аутентификации.
- Один пароль — это один фактор, «то, что вы знаете», и NIST говорит, что пароли не устойчивы к фишингу. Второй фактор переводит событие на AAL2.

**When to use:**

Используйте многофакторный аутентификатор или два разных фактора, когда учётной записи нужен AAL2 или выше. Используйте криптографическую аутентификацию с открытым ключом, когда у проверяющего не должно быть копии секрета аутентификации.

**Sources:**

- https://pages.nist.gov/800-63-4/sp800-63b.html
""")

add(
"Describe the OAuth 2.0 protocol and its use cases in authentication.",
"""**Definition:**

OAuth 2.0 is an authorization framework. RFC 6749 says it lets a third-party application obtain limited access to an HTTP service, either on behalf of a resource owner or on its own behalf. It obsoletes the OAuth 1.0 protocol in RFC 5849.

**How it works:**

- The resource owner approves the access. The application receives a limited grant, not the owner’s password.
- “On its own behalf” is the other case in the abstract: the application is the client, and there is no end-user approval step for that client’s own access.
- OAuth is not itself a login protocol. Authentication of the user is what the approval step relies on. OpenID Connect and similar layers add an identity token on top; RFC 6749’s job is the limited access.
- Cryptography shows up in the HTTPS channel those HTTP requests use, and in any token that must be integrity-protected. The RFC’s subject is the authorization grant, not a new cipher.
- RFC 8252, RFC 8996, and RFC 9700 are later updates listed on the RFC 6749 page. Read those before treating every 2012 grant type as still recommended.

**When to use:**

Use OAuth 2.0 when an application needs limited access to an HTTP API without collecting the resource owner’s password. Do not treat the access token as proof of identity unless a profile you have actually adopted says it is.

**Sources:**

- https://www.rfc-editor.org/rfc/rfc6749#section-1.1
""",
"""**Definition:**

OAuth 2.0 — каркас авторизации. RFC 6749 говорит, что он позволяет стороннему приложению получить ограниченный доступ к HTTP-сервису либо от имени владельца ресурса, либо от своего имени. Он отменяет протокол OAuth 1.0 из RFC 5849.

**How it works:**

- Владелец ресурса одобряет доступ. Приложение получает ограниченное предоставление, а не пароль владельца.
- «От своего имени» — второй случай в аннотации: приложение само является клиентом, и для его собственного доступа нет шага одобрения конечным пользователем.
- Сам по себе OAuth — не протокол входа. Аутентификация пользователя — то, на что опирается шаг одобрения. OpenID Connect и похожие слои добавляют сверху токен личности; задача RFC 6749 — ограниченный доступ.
- Криптография появляется в канале HTTPS, по которому идут эти HTTP-запросы, и в любом токене, чью целостность надо защитить. Предмет RFC — предоставление авторизации, а не новый шифр.
- RFC 8252, RFC 8996 и RFC 9700 — более поздние обновления, перечисленные на странице RFC 6749. Прочитайте их, прежде чем считать каждый тип предоставления 2012 года по-прежнему рекомендуемым.

**When to use:**

Используйте OAuth 2.0, когда приложению нужен ограниченный доступ к HTTP API без сбора пароля владельца ресурса. Не считайте токен доступа доказательством личности, если принятый вами профиль этого прямо не говорит.

**Sources:**

- https://www.rfc-editor.org/rfc/rfc6749#section-1.1
""")

add(
"Explain the concept of role-based access control (RBAC) and its cryptographic requirements.",
"""**Definition:**

Role-based access control decides what a subject may do from a role, not from the subject’s individual identity. NIST SP 800-53 Rev. 5 describes a role as a collection of access authorizations a user receives by assuming that role. A role may apply to one person or to several.

**How it works:**

- NIST SP 800-95, citing the OASIS XACML profile, says permitted actions are identified with roles rather than with individual subject identities. Permissions may be inherited through a role hierarchy.
- RBAC is an authorization model. It does not encrypt data and it does not define a cipher.
- The cryptographic piece sits in front of the role check and around the data that carries the role. The subject must be authenticated (NIST SP 800-63B). A token or assertion that states the role needs integrity, which is a signature or a MAC, or the role can be rewritten in transit.
- Confidentiality of the resource is a separate decision. RBAC can allow a role to read a field that is still encrypted to a different key.

**When to use:**

Use RBAC when many people share the same job and you want to grant the job, not each person. Authenticate the subject and protect the integrity of the role statement. Do not expect the role model itself to be a cryptographic algorithm.

**Sources:**

- https://csrc.nist.gov/glossary/term/role_based_access_control
- https://pages.nist.gov/800-63-4/sp800-63b.html
""",
"""**Definition:**

Управление доступом на основе ролей решает, что субъекту можно делать, исходя из роли, а не из индивидуальной личности субъекта. NIST SP 800-53 Rev. 5 описывает роль как набор полномочий доступа, которые пользователь получает, принимая эту роль. Роль может относиться к одному человеку или к нескольким.

**How it works:**

- NIST SP 800-95, ссылаясь на профиль OASIS XACML, говорит, что разрешённые действия связывают с ролями, а не с индивидуальными личностями субъектов. Полномочия могут наследоваться через иерархию ролей.
- RBAC — модель авторизации. Она не шифрует данные и не задаёт шифр.
- Криптографическая часть стоит перед проверкой роли и вокруг данных, которые роль переносят. Субъекта нужно аутентифицировать (NIST SP 800-63B). Токену или утверждению, которое называет роль, нужна целостность — подпись или MAC, — иначе роль можно переписать в пути.
- Конфиденциальность ресурса — отдельное решение. RBAC может разрешить роли читать поле, которое всё ещё зашифровано на другой ключ.

**When to use:**

Используйте RBAC, когда много людей делят одну должность и вы хотите выдавать права должности, а не каждому человеку. Аутентифицируйте субъекта и защищайте целостность утверждения о роли. Не ждите, что сама модель ролей окажется криптографическим алгоритмом.

**Sources:**

- https://csrc.nist.gov/glossary/term/role_based_access_control
- https://pages.nist.gov/800-63-4/sp800-63b.html
""")

add(
"How does HTTPS utilize cryptography to secure communications over the web?",
"""**Definition:**

HTTPS is HTTP over TLS. TLS is the protocol that gives the HTTP messages confidentiality and integrity, and that checks the server’s identity with a certificate.

**How it works:**

- RFC 8446 says TLS lets client/server applications communicate over the Internet in a way designed to prevent eavesdropping, tampering, and message forgery.
- MDN states that the server must provide a valid digital certificate confirming its identity before the secure connection is established. That certificate is how the client knows which public key belongs to the name.
- The session that follows uses the keys the handshake agreed. TLS 1.3 can combine a pre-shared key with (EC)DHE so the application data has forward secrecy. A PSK alone does not.
- Cookies set over that channel should carry `Secure`, so the browser sends them only on `https:`. `HttpOnly` keeps page script from reading them. Those are HTTP attributes on top of TLS, not a second encryption layer.
- Major browsers removed TLS 1.0 and 1.1 in early 2020. MDN says the server needs TLS 1.2 or 1.3.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/TLS
- https://www.rfc-editor.org/rfc/rfc8446#section-1.2
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
""",
"""**Definition:**

HTTPS — это HTTP поверх TLS. TLS — протокол, который даёт сообщениям HTTP конфиденциальность и целостность и проверяет личность сервера сертификатом.

**How it works:**

- RFC 8446 говорит, что TLS позволяет приложениям клиента и сервера общаться через Интернет так, чтобы это было рассчитано на предотвращение подслушивания, подмены и подлога сообщений.
- MDN указывает, что сервер должен предоставить действительный цифровой сертификат, подтверждающий личность, прежде чем будет установлено защищённое соединение. По этому сертификату клиент понимает, какой открытый ключ принадлежит имени.
- Следующий сеанс использует ключи, которые согласовал handshake. TLS 1.3 может сочетать заранее известный ключ с (EC)DHE, чтобы у данных приложения была прямая секретность. Один только PSK её не даёт.
- Cookie, выставленные в этом канале, должны нести `Secure`, чтобы браузер отправлял их только по `https:`. `HttpOnly` не даёт скрипту страницы их читать. Это атрибуты HTTP поверх TLS, а не второй слой шифрования.
- Крупные браузеры убрали TLS 1.0 и 1.1 в начале 2020 года. MDN говорит, что серверу нужен TLS 1.2 или 1.3.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/TLS
- https://www.rfc-editor.org/rfc/rfc8446#section-1.2
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
""")

add(
"What is a TLS/SSL certificate, and how does it establish a secure session?",
"""**Definition:**

A TLS certificate is the digital certificate a TLS peer presents to confirm its identity. MDN says every modern browser requires the server to provide a valid one before a secure connection is established. SSL is the former name of the protocol; the certificate’s job did not change when the protocol was renamed TLS.

**How it works:**

- The certificate carries the server’s public key and an issuer’s signature over that binding. Checking the signature with a trusted issuer’s public key is what makes the binding trustworthy. NIST’s definition of a digital signature is the operation: private key signs, public key verifies, and the result supports origin authentication and integrity.
- After the identity check, the handshake agrees the keys that protect the application data. RFC 8446 designs TLS to prevent eavesdropping, tampering, and message forgery. The certificate does not itself encrypt the HTTP body.
- The client may also present a certificate. MDN calls that mutual authentication.
- A certificate the client cannot chain to a trust anchor does not establish the session the browser will accept, even if the bytes on the wire are otherwise well formed.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/TLS
- https://csrc.nist.gov/glossary/term/digital_signature
- https://www.rfc-editor.org/rfc/rfc8446#section-1.2
""",
"""**Definition:**

TLS-сертификат — это цифровой сертификат, который сторона TLS предъявляет, чтобы подтвердить свою личность. MDN говорит, что каждый современный браузер требует от сервера действительный сертификат, прежде чем будет установлено защищённое соединение. SSL — прежнее имя протокола; задача сертификата не изменилась, когда протокол переименовали в TLS.

**How it works:**

- Сертификат несёт открытый ключ сервера и подпись издателя над этой связью. Проверка подписи открытым ключом доверенного издателя делает связь заслуживающей доверия. Определение цифровой подписи у NIST — это сама операция: закрытый ключ подписывает, открытый проверяет, и результат поддерживает аутентификацию источника и целостность.
- После проверки личности handshake согласовывает ключи, которые защищают данные приложения. RFC 8446 проектирует TLS так, чтобы предотвращать подслушивание, подмену и подлог сообщений. Сам сертификат тело HTTP не шифрует.
- Клиент тоже может предъявить сертификат. MDN называет это взаимной аутентификацией.
- Сертификат, который клиент не может довести до якоря доверия, не устанавливает сеанс, который браузер примет, даже если байты на проводе в остальном корректны.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/TLS
- https://csrc.nist.gov/glossary/term/digital_signature
- https://www.rfc-editor.org/rfc/rfc8446#section-1.2
""")

add(
"Explain how cryptography is used in blockchain technology.",
"""**Definition:**

A blockchain uses hash chaining so a change in an earlier block changes every later hash, signatures so only the key holder authorizes a transaction, and often a Merkle tree so one root commits to many transactions.

**How it works:**

- A hash link means each block includes the digest of the previous block. Changing an earlier block changes that digest, so the chain of hashes no longer matches. That is the integrity property from the hash, the same property a digital signature relies on when it signs a digest.
- NIST describes a signature as a private-key operation that supports origin authentication, integrity, and non-repudiation, and not confidentiality. A transaction signature is that operation: verifiers use the public key, and the signer cannot later claim a different message under the same signature unless the hash collides.
- RFC 6962 shows the Merkle shape used for a signed root over many leaves. A light client recomputes the root from one leaf and an audit path and compares it to the signed root.
- Confidentiality is not what those three primitives provide. A public chain publishes the transactions. Encryption is a separate choice when the payload must stay private.

**Sources:**

- https://csrc.nist.gov/glossary/term/digital_signature
- https://www.rfc-editor.org/rfc/rfc6962#section-2.1
""",
"""**Definition:**

Блокчейн использует цепочку хешей, чтобы изменение раннего блока меняло каждый последующий хеш, подписи, чтобы транзакцию мог авторизовать только владелец ключа, и часто дерево Меркла, чтобы один корень фиксировал много транзакций.

**How it works:**

- Хеш-связь означает, что каждый блок включает дайджест предыдущего блока. Изменение раннего блока меняет этот дайджест, и цепочка хешей больше не сходится. Это свойство целостности хеша, то же свойство, на которое опирается цифровая подпись, когда подписывает дайджест.
- NIST описывает подпись как операцию закрытым ключом, которая поддерживает аутентификацию источника, целостность и неотказуемость, но не конфиденциальность. Подпись транзакции — эта операция: проверяющие используют открытый ключ, и подписавший не сможет позже заявить другое сообщение под той же подписью, если хеш не столкнётся.
- RFC 6962 показывает форму Меркла для подписанного корня над многими листьями. Лёгкий клиент пересчитывает корень по одному листу и пути аудита и сравнивает его с подписанным корнем.
- Конфиденциальность эти три примитива не дают. Публичная цепочка публикует транзакции. Шифрование — отдельный выбор, когда полезная нагрузка должна остаться закрытой.

**Sources:**

- https://csrc.nist.gov/glossary/term/digital_signature
- https://www.rfc-editor.org/rfc/rfc6962#section-2.1
""")

add(
"Describe the use of cryptographic primitives in password hashing.",
"""**Definition:**

A password hashing scheme turns a password into a stored verifier. NIST SP 800-63B says verifiers must salt and hash passwords with a scheme that takes a password, a salt, and a cost factor, so a stolen file does not give the password and each guess is expensive.

**How it works:**

- The salt makes two equal passwords store as different hashes. The cost factor is what makes each guess slow. NIST says the cost factor should be as high as practical without hurting verifier performance, and it should be raised over time as computers get faster.
- A fast hash such as a bare SHA-256 is the wrong primitive. It has no cost factor, so a stolen file can be tested at the speed of the hash.
- Node’s `crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)` is one such function: an HMAC digest is applied for `iterations` passes to derive `keylen` bytes. The Node documentation says the salt should be random and at least 16 bytes, and iterations should be a positive number set as high as possible.
- The password still travels to the verifier. NIST requires an authenticated protected channel for that request. Hashing replaces storage, not TLS.
- This note does not describe how to test a stolen hash file.

**When to use:**

Use a password hashing scheme with a per-password salt and a high cost factor for any centrally verified password. Use PBKDF2 from `node:crypto` when that is the approved function you have adopted, with a random salt of at least 16 bytes.

**Examples:**

```js
import { pbkdf2 } from 'node:crypto';

pbkdf2(password, salt, iterations, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  // store salt and derivedKey, not the password
});
```

**Sources:**

- https://pages.nist.gov/800-63-4/sp800-63b.html
- https://nodejs.org/api/crypto.html#cryptopbkdf2password-salt-iterations-keylen-digest-callback
""",
"""**Definition:**

Схема хеширования паролей превращает пароль в хранимый проверяемый результат. NIST SP 800-63B говорит, что проверяющие должны солить и хешировать пароли схемой, которая принимает пароль, соль и коэффициент стоимости, чтобы украденный файл не отдавал пароль и каждая догадка была дорогой.

**How it works:**

- Соль делает так, что два одинаковых пароля хранятся как разные хеши. Коэффициент стоимости замедляет каждую догадку. NIST говорит, что коэффициент должен быть настолько высоким, насколько это практично без вреда для производительности проверяющего, и его следует повышать со временем, по мере роста скорости компьютеров.
- Быстрый хеш вроде голого SHA-256 — неверный примитив. У него нет коэффициента стоимости, поэтому украденный файл можно проверять со скоростью хеша.
- `crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)` в Node — одна такая функция: HMAC-дайджест применяется `iterations` раз, чтобы получить `keylen` байт. Документация Node говорит, что соль должна быть случайной и не короче 16 байт, а число итераций — положительным и настолько большим, насколько возможно.
- Пароль всё равно едет к проверяющему. NIST требует для этого запроса аутентифицированный защищённый канал. Хеширование заменяет хранение, а не TLS.
- Эта заметка не описывает, как проверять украденный файл хешей.

**When to use:**

Для любого централизованно проверяемого пароля используйте схему хеширования паролей с солью на каждый пароль и высоким коэффициентом стоимости. Берите PBKDF2 из `node:crypto`, если это принятая у вас одобренная функция, со случайной солью не короче 16 байт.

**Examples:**

```js
import { pbkdf2 } from 'node:crypto';

pbkdf2(password, salt, iterations, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  // store salt and derivedKey, not the password
});
```

**Sources:**

- https://pages.nist.gov/800-63-4/sp800-63b.html
- https://nodejs.org/api/crypto.html#cryptopbkdf2password-salt-iterations-keylen-digest-callback
""")

add(
"How do secure cookies work, and what cryptographic measures are involved?",
"""**Definition:**

A cookie is a name-value pair the server sends in `Set-Cookie` and the browser sends back later. The cryptographic measures are the HTTPS channel that carries it, plus attributes that keep it off unencrypted requests and away from page script.

**How it works:**

- MDN defines `Set-Cookie` as the response header that sends the cookie. `Secure` means the cookie is sent only on `https:` (localhost excepted), which MDN says makes it more resistant to a manipulator in the middle.
- `HttpOnly` forbids JavaScript from reading the cookie through `Document.cookie`. The cookie is still sent on `fetch` and `XMLHttpRequest`. MDN says this mitigates cross-site scripting against the cookie.
- `SameSite` controls whether the cookie is sent on cross-site requests. `Strict` sends it only for same-site requests. `Lax` also sends it on top-level navigations that use a safe method. `None` requires `Secure`.
- `__Host-` cookies must be set with `Secure` from HTTPS, must not set `Domain`, and must set `Path=/`. That keeps the cookie on the host that set it.
- None of these attributes encrypt the cookie value. TLS encrypts it on the wire. A value that must stay secret from the browser’s script also needs `HttpOnly`.

**When to use:**

Set `Secure`, `HttpOnly`, and an explicit `SameSite` on a session cookie. Use the `__Host-` prefix when the cookie must be host-only and path `/`.

**Examples:**

```http
Set-Cookie: sessionId=38afes7a8; Secure; HttpOnly; SameSite=Lax; Path=/
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
""",
"""**Definition:**

Cookie — это пара имени и значения, которую сервер отправляет в `Set-Cookie`, а браузер позже присылает обратно. Криптографические меры — это канал HTTPS, который её несёт, и атрибуты, которые не пускают её в незашифрованные запросы и не отдают скрипту страницы.

**How it works:**

- MDN определяет `Set-Cookie` как заголовок ответа, который отправляет cookie. `Secure` означает, что cookie уходит только по `https:` (кроме localhost); MDN говорит, что это делает её устойчивее к посреднику на пути.
- `HttpOnly` запрещает JavaScript читать cookie через `Document.cookie`. Cookie всё равно уходит с `fetch` и `XMLHttpRequest`. MDN говорит, что это смягчает межсайтовый скриптинг в отношении cookie.
- `SameSite` управляет тем, уходит ли cookie с межсайтовыми запросами. `Strict` отправляет её только для запросов того же сайта. `Lax` также отправляет её при навигации верхнего уровня безопасным методом. `None` требует `Secure`.
- Cookie с префиксом `__Host-` должны выставляться с `Secure` по HTTPS, без `Domain` и с `Path=/`. Тогда cookie остаётся на том хосте, который её выставил.
- Ни один из этих атрибутов не шифрует значение cookie. На проводе её шифрует TLS. Значению, которое должно быть скрыто от скрипта браузера, нужен ещё и `HttpOnly`.

**When to use:**

Для сеансовой cookie ставьте `Secure`, `HttpOnly` и явный `SameSite`. Используйте префикс `__Host-`, когда cookie должна быть только для этого хоста и пути `/`.

**Examples:**

```http
Set-Cookie: sessionId=38afes7a8; Secure; HttpOnly; SameSite=Lax; Path=/
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
""")

add(
"Explain the principles behind homomorphic encryption and its potential applications.",
"""**Definition:**

Fully homomorphic encryption computes on encrypted data. NIST’s privacy-enhancing cryptography project describes it as computing over encrypted data without learning the plaintext input or output, while still applying the intended function. The result is ciphertext of the result.

**How it works:**

- The worker applies the function to ciphertexts. It does not decrypt. The holder of the decryption key obtains the plaintext of the function’s output, not a view of the intermediate values.
- NIST groups FHE with other privacy-enhancing tools (zero-knowledge proofs, secure multi-party computation) whose point is to let parties interact without revealing extraneous private information.
- The same page points at HomomorphicEncryption.org as an open effort toward standardizing fully homomorphic encryption. This note does not name a parameter set or a library call that page does not specify.
- Potential uses NIST lists around these tools include statistics over distributed data and delegating computation to a party who must not see the plaintext.

**When to use:**

Consider FHE when a party must compute on data it is not allowed to see in the clear, and when the cost of that computation is acceptable. For a joint function over several parties’ inputs, NIST’s description of multi-party computation is the closer match.

**Sources:**

- https://csrc.nist.gov/projects/privacy-enhancing-cryptography
""",
"""**Definition:**

Полностью гомоморфное шифрование вычисляет над зашифрованными данными. Проект NIST по криптографии, усиливающей приватность, описывает его как вычисление над зашифрованными данными без знания открытого входа и выхода, с сохранением задуманной функции. Результат — шифртекст результата.

**How it works:**

- Исполнитель применяет функцию к шифртекстам. Он не расшифровывает. Владелец ключа расшифрования получает открытый текст выхода функции, а не промежуточные значения.
- NIST ставит FHE рядом с другими средствами усиления приватности (доказательства с нулевым разглашением, безопасные многосторонние вычисления), смысл которых — дать сторонам взаимодействовать, не раскрывая лишнюю частную информацию.
- Та же страница указывает на HomomorphicEncryption.org как на открытую работу по стандартизации полностью гомоморфного шифрования. Эта заметка не называет набор параметров или вызов библиотеки, которых эта страница не задаёт.
- Среди возможных применений, которые NIST связывает с этими средствами, — статистика по распределённым данным и передача вычисления стороне, которая не должна видеть открытый текст.

**When to use:**

Рассматривайте FHE, когда сторона должна считать над данными, которые ей нельзя видеть в открытом виде, и когда цена такого вычисления приемлема. Для совместной функции над входами нескольких сторон ближе описание многосторонних вычислений у NIST.

**Sources:**

- https://csrc.nist.gov/projects/privacy-enhancing-cryptography
""")

add(
"What is zero-knowledge proof, and how does it maintain privacy?",
"""**Definition:**

A zero-knowledge proof lets a prover convince a verifier that a statement is true without providing any more information than that one bit: true rather than false. NISTIR 8301 states it that way. NIST’s privacy-enhancing cryptography page adds the usual interview form: prove knowledge of a secret solution without revealing the solution.

**How it works:**

- The verifier learns that the statement holds. The verifier does not learn the witness, the secret that makes the statement true.
- Privacy is that gap. The proof is not a copy of the secret and not an encryption of the secret for the verifier to decrypt.
- NIST lists identification and authentication among the application areas, including a credential that proves a predicate on private data (for example, that a person is of voting age) while the rest of the data stays hidden.
- The glossary definition is the security claim. It is not a circuit, a curve, or a proof system this note will instantiate.

**When to use:**

Use a zero-knowledge proof when the verifier needs to accept a fact and must not receive the underlying secret. If the verifier must learn the result of a function on several parties’ private inputs, multi-party computation is the closer NIST description.

**Sources:**

- https://csrc.nist.gov/glossary/term/zero_knowledge_proof
- https://csrc.nist.gov/projects/privacy-enhancing-cryptography
""",
"""**Definition:**

Доказательство с нулевым разглашением позволяет доказывающему убедить проверяющего, что утверждение истинно, не сообщая ничего сверх одного бита: истинно, а не ложно. Так это формулирует NISTIR 8301. Страница NIST о криптографии, усиливающей приватность, добавляет обычную форму для собеседования: доказать знание секретного решения, не раскрывая решение.

**How it works:**

- Проверяющий узнаёт, что утверждение верно. Проверяющий не узнаёт свидетельство — секрет, который делает утверждение истинным.
- Приватность — в этом зазоре. Доказательство — не копия секрета и не шифрование секрета, которое проверяющий мог бы расшифровать.
- NIST относит к областям применения идентификацию и аутентификацию, включая удостоверение, которое доказывает предикат над частными данными (например, что человек достиг избирательного возраста), а остальные данные остаются скрыты.
- Определение глоссария — это утверждение о стойкости. Это не схема, кривая или система доказательств, которую эта заметка будет собирать.

**When to use:**

Используйте доказательство с нулевым разглашением, когда проверяющему нужно принять факт и нельзя получать лежащий в основе секрет. Если проверяющий должен узнать результат функции над частными входами нескольких сторон, ближе описание многосторонних вычислений у NIST.

**Sources:**

- https://csrc.nist.gov/glossary/term/zero_knowledge_proof
- https://csrc.nist.gov/projects/privacy-enhancing-cryptography
""")

p.write_text(json.dumps(PAIRS, ensure_ascii=False, indent=1))
print("count", len(PAIRS))
