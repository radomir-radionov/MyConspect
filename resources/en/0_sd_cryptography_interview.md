# Cryptography — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [Cryptography — Interview](./0_sd_cryptography_interview.md)

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

Cryptography is the practice of using math so that secrets stay secret, changes are detectable, and a party can be tied to a message.

**How it works:**

- Confidentiality: encryption turns plaintext into ciphertext that is useless without the key. Decryption reverses it.
- Symmetric encryption uses one shared key. Asymmetric encryption uses a public key to encrypt and a private key to decrypt.
- Integrity: a hash or a MAC shows whether the bytes changed. Encryption alone does not always prove that.
- Authentication: a proof that the other party holds a secret you trust (a key, a certificate).
- Non-repudiation: a signature the signer cannot later deny, because only their private key could have produced it.
- None of this works if keys are weak, reused, or stored in the clear. Key generation, storage, and rotation are part of the system.
- Prefer vetted algorithms and implementations. Inventing a cipher is not a goal.

**Examples:**

A disk image is encrypted with a key so a stolen drive is unreadable (confidentiality). A signed software update fails verification if one byte changes (integrity) and only the vendor’s key validates (authentication and non-repudiation).
</details>

<details>
<summary>Explain the difference between symmetric and asymmetric cryptography.</summary>

### Explain the difference between symmetric and asymmetric cryptography.

**Definition:**

Symmetric cryptography uses one shared secret for both directions. Asymmetric cryptography uses a key pair: a public key anyone may have, and a private key that stays with the owner.

**How it works:**

- Symmetric algorithms (AES, ChaCha20) are fast and suit bulk data. The hard part is getting the same key to both parties without leaking it.
- Asymmetric algorithms (RSA, elliptic curves) are slower and suit small payloads: key exchange, signatures, and encrypting a symmetric key.
- Typical sizes: AES keys are 128 or 256 bits. RSA keys are thousands of bits for similar strength. Elliptic-curve keys are a few hundred bits.
- Real protocols combine them. TLS uses asymmetric cryptography to agree a session key, then symmetric encryption for the bytes.
- Symmetric failure mode: anyone who copies the key can read and forge. Asymmetric failure mode: a lost private key or a trusted public key that actually belongs to an attacker.
- Do not encrypt a large file with RSA directly. Encrypt the file with AES and wrap the AES key.

**Examples:**

Alice and Bob share a 256-bit AES key and encrypt a backup with it. For a first contact, Alice encrypts that AES key with Bob’s RSA public key. Only Bob’s private key unwraps it. After that, the file uses AES.
</details>

<details>
<summary>What is a cryptographic hash function, and what properties must it have?</summary>

### What is a cryptographic hash function, and what properties must it have?

**Definition:**

A cryptographic hash maps any input to a fixed-length digest so that the digest does not reveal the input and is impractical to forge.

**How it works:**

- The output length is fixed (SHA-256 yields 32 bytes) no matter how long the input is.
- Preimage resistance: given a digest, finding an input that hashes to it is infeasible.
- Second-preimage resistance: given an input, finding a different input with the same digest is infeasible.
- Collision resistance: finding any two different inputs with the same digest is infeasible. This is a stronger demand, and the birthday bound makes it the first property to fail as hashes age.
- A small input change should flip about half the output bits. That is the avalanche effect.
- Hashes are not encryption. There is no key and no way to “decrypt.” For a keyed integrity check, use an HMAC.
- MD5 and SHA-1 are broken for collisions. Use SHA-256, SHA-3, or a password hash such as Argon2 when the input is a password.

**Examples:**

A download page publishes the SHA-256 of a file. You hash your copy and compare. A matching digest means you almost certainly have the same bytes. It does not by itself prove who published the digest. That takes a signature.
</details>

<details>
<summary>Describe the concept of public key infrastructure (PKI).</summary>

### Describe the concept of public key infrastructure (PKI).

**Definition:**

PKI is the set of roles and documents that let you trust a public key belongs to a named party, not merely that some key exists.

**How it works:**

- Each party has a key pair. The private key stays secret. The public key is published.
- A certificate binds a public key to a name, signed by a certificate authority (CA). Trust comes from already trusting that CA, often through a chain up to a root in your trust store.
- Registration checks the name before the CA signs. Revocation (CRL or OCSP) marks a certificate unusable before it expires.
- You then get confidentiality (encrypt to the public key), integrity and authentication (verify a signature), and non-repudiation when the private key stayed with the owner.
- On the web this is TLS certificates for site names. The same pattern covers signed email, code signing, and VPN client certs.
- A CA that signs the wrong name breaks the system. Pinning, short lifetimes, and certificate transparency exist because of that.

**Examples:**

A browser trusts a root CA. That CA signed an intermediate, which signed `shop.example`. The TLS handshake presents the chain. The browser checks the signatures, the name, and the dates, then uses the leaf public key. A self-signed cert for the same name fails because no trusted CA vouches for it.
</details>

<details>
<summary>What is a digital signature, and how does it work?</summary>

### What is a digital signature, and how does it work?

**Definition:**

A digital signature is a value produced with a private key over a hash of a message. Anyone with the public key can check that the message was not altered and that the private key took part.

**How it works:**

- The signer hashes the message and applies the private key to the digest (RSA, ECDSA, Ed25519).
- The verifier hashes the message again and checks the signature with the public key. A mismatch means a different message or a different key.
- Hashing first keeps the signature small and covers every byte.
- The public key has to be the right person’s. A certificate or a previously exchanged key supplies that. The signature does not by itself name a human.
- This is stronger than a scanned “electronic” signature image, which anyone can copy and which no math checks.
- Keep the private key offline or in a hardware module. A copied private key lets someone else sign as you.

**Examples:**

A release file is hashed with SHA-256 and signed with the vendor’s Ed25519 private key. Your package tool hashes the file it downloaded and verifies the signature. One flipped bit fails the check. A signature from any other key also fails.
</details>

<details>
<summary>Can you explain what a nonce is and how it’s used in cryptography?</summary>

### Can you explain what a nonce is and how it’s used in cryptography?

**Definition:**

A nonce is a number used once in a cryptographic operation so that the same inputs do not produce a repeatable result an attacker can replay or correlate.

**How it works:**

- It does not have to be secret. It does have to be unique for a given key. A counter or a large random value both work if you never repeat the pair.
- In AES-GCM and ChaCha20-Poly1305, repeating a nonce with the same key leaks plaintext and can break the authenticator.
- Protocols put a nonce in a handshake so an old captured message cannot be sent again as a fresh one.
- Hashed constructions mix a nonce or salt in so equal passwords do not hash equal, and so precomputed tables miss.
- Store the nonce beside the ciphertext. The decrypting side needs the same value. Losing uniqueness is worse than storing it in the clear.

**Examples:**

```text
ciphertext = AES-GCM(key, nonce=counter, plaintext)
counter = counter + 1
```

Each message under that key gets the next counter. Resetting the counter to 0 after a restart, with the same key, reuses nonces and is unsafe.
</details>

<details>
<summary>What does it mean for a cryptographic algorithm to be “computationally secure”?</summary>

### What does it mean for a cryptographic algorithm to be “computationally secure”?

**Definition:**

Computationally secure means breaking the algorithm takes more work than any realistic attacker can spend, not that breaking it is impossible in principle.

**How it works:**

- Information-theoretic security (a one-time pad used correctly) stays secret even against unlimited computing. Almost nothing else does.
- Computational security assumes a bound: so many operations, so much memory, so many years. A 128-bit key is secure because searching the key space is beyond that bound.
- “Secure” is always against a stated attack and a stated margin. A hash can be fine against preimages and weak against collisions.
- The bound moves. Hardware and new cryptanalysis shrink it. That is why key sizes grow and algorithms get retired.
- A computationally secure primitive still fails if the mode, the nonce, or the key handling is wrong. The definition is about the algorithm under its stated rules.
- Pick primitives whose bounds are published and reviewed. A secret design has no public bound to trust.

**Examples:**

AES-128 is treated as computationally secure: a brute-force search of the key is not a plan anyone can carry out. A one-time pad is the stricter idea, perfect secrecy, and it demands a fresh random key as long as the message. Using AES with a repeated nonce is not “AES is insecure.” It is a misuse outside the bound.
</details>

<details>
<summary>Describe the concept of perfect secrecy and name an encryption system that achieves it.</summary>

### Describe the concept of perfect secrecy and name an encryption system that achieves it.

**Definition:**

Perfect secrecy means the ciphertext gives an attacker with unlimited computing no new information about the plaintext. Seeing the ciphertext does not change the odds of any candidate message.

**How it works:**

- Claude Shannon’s condition: for every plaintext and ciphertext pair that can occur, the encryption must be consistent with enough keys that the ciphertext does not favor one plaintext.
- That forces the key to be at least as long as the message, chosen uniformly at random, and kept secret.
- The one-time pad does this. Ciphertext is plaintext XOR a random key of the same length. Every plaintext is still possible, with a different key.
- The key is used once. Reuse lets an attacker XOR two ciphertexts and cancel the key.
- The pad must be truly random, not a stretched password. Generating, carrying, and destroying that much key material is why almost every real system uses computational security instead.
- A one-time pad does not authenticate. An attacker can flip bits in the ciphertext and flip the same bits in the plaintext.

**Examples:**

Plaintext bit `1`, key bit `1`, ciphertext bit `0`. The same ciphertext is also plaintext `0` with key `0`. Without the key, both messages remain possible. Use that key on a second message and the two ciphertexts reveal the XOR of the two plaintexts.
</details>

### Encryption Algorithms

<details>
<summary>What are substitution and permutation in the context of encryption algorithms?</summary>

### What are substitution and permutation in the context of encryption algorithms?

**Definition:**

Substitution replaces a unit of plaintext with another unit. Permutation (transposition) reorders units without changing them. Modern ciphers mix both so the result is neither a simple codebook nor a shuffle.

**How it works:**

- Substitution creates confusion: the relationship between key and ciphertext is tangled. An S-box in DES or AES is a fixed substitution of a small group of bits.
- Permutation creates diffusion: a change in one input bit spreads across the output. AES ShiftRows and MixColumns move and mix bytes. A classical transposition cipher only reorders letters.
- Substitution alone keeps letter frequencies (a Caesar shift still shows the same peaks). Permutation alone keeps the letters, so an anagram attack still sees them.
- A product cipher repeats substitute-then-permute for many rounds, with key material mixed in, so local structure does not survive.
- These are teaching ciphers, not things to deploy. They show the two moves. AES is the construction that uses them safely.

**Examples:**

```text
Caesar shift by 1:  cat -> dbu          # substitution
Rail fence, 2 rails: cat -> cta          # c then a then t, reordered
```

Neither hides a short message. AES runs a keyed substitution and a mixing permutation over many rounds so those classroom attacks do not apply.
</details>

<details>
<summary>Explain the basic principle behind the AES encryption algorithm.</summary>

### Explain the basic principle behind the AES encryption algorithm.

**Definition:**

AES encrypts a 128-bit block by repeating a substitution-permutation round, mixing in a key schedule derived from a 128-, 192-, or 256-bit key.

**How it works:**

- The block is a 4 by 4 array of bytes, called the state.
- Each full round does SubBytes (an S-box on every byte), ShiftRows (rotate rows), MixColumns (mix each column), and AddRoundKey (XOR a round key).
- The last round skips MixColumns. The first step is an initial AddRoundKey.
- Key length picks the round count: 10 rounds for 128-bit keys, 12 for 192, 14 for 256. The key schedule expands the key into one round key per round.
- It is a substitution-permutation network, not a Feistel network. Decryption uses inverse steps and the round keys in reverse order.
- AES is a block primitive. Real use needs a mode such as GCM, with a unique nonce, if you want both secrecy and integrity.

**Examples:**

A 16-byte block and a 32-byte key run 14 rounds. The same plaintext under the same key and a new GCM nonce produces different ciphertext. Reusing the nonce with that key is the failure mode, not a short key.
</details>

<details>
<summary>What is the Data Encryption Standard (DES), and why is it considered insecure today?</summary>

### What is the Data Encryption Standard (DES), and why is it considered insecure today?

**Definition:**

DES is a 1970s block cipher: 64-bit blocks, a 56-bit key, and 16 Feistel rounds. The algorithm’s structure held up better than its key length.

**How it works:**

- The 64-bit key includes 8 parity bits, so the secret is 56 bits. Each round expands, substitutes through S-boxes, permutes, and XORs a subkey.
- A 56-bit key can be searched. Purpose-built hardware did that in the late 1990s, and ordinary computing makes it cheaper now.
- The 64-bit block is a second limit. In common modes, enough blocks under one key invite birthday collisions.
- Differential and linear cryptanalysis exist. They are not why DES was retired in practice. The short key is.
- Triple DES runs DES three times to stretch the key, and AES replaces both with a 128-bit block and a longer key.
- Do not use DES for new systems. Treat any DES ciphertext as something to re-encrypt.

**Examples:**

A key space of 2^56 is about 72 quadrillion keys. A cluster that tries billions of keys a second finishes a single-key search in hours to days. AES-128’s space is 2^128, which that approach does not dent.
</details>

<details>
<summary>Describe the differences between RSA and ECC (Elliptic Curve Cryptography).</summary>

### Describe the differences between RSA and ECC (Elliptic Curve Cryptography).

**Definition:**

RSA’s security rests on factoring large integers. Elliptic-curve cryptography rests on a discrete-log problem on a curve. For the same security margin, ECC uses much shorter keys.

**How it works:**

- An RSA public key is an exponent and a modulus that is a product of two large primes. Operations are modular exponentiation. Common sizes are 2048 or 3072 bits.
- ECC uses a point on a named curve. A 256-bit curve key is in the same league as a 3072-bit RSA key for current estimates.
- Shorter keys mean smaller certificates, less bandwidth, and faster private-key operations on small devices. RSA verification with a small public exponent can still be very fast.
- Both can sign and both can wrap a symmetric key. Neither should encrypt bulk data.
- Curve choice matters. Use a reviewed curve (P-256, Curve25519) and a reviewed implementation. A home-made curve is not a shortcut.
- Both fall to a large quantum computer running Shor’s algorithm. That is a reason for post-quantum work, not a reason to prefer RSA’s longer keys today.

**Examples:**

A TLS certificate with a P-256 key carries a much smaller public key than a 3072-bit RSA certificate and still targets a comparable classical security level. Handshake CPU on a phone usually favors the curve.
</details>

<details>
<summary>How does a stream cipher differ from a block cipher?</summary>

### How does a stream cipher differ from a block cipher?

**Definition:**

A stream cipher combines the plaintext with a keystream a unit at a time. A block cipher transforms a fixed-size block, and a mode of operation handles messages that are not one block.

**How it works:**

- A stream cipher (or a block cipher in counter mode) produces a keystream and XORs it with the plaintext. The first byte can be encrypted before the rest exists. There is no padding.
- A block cipher such as AES maps 16 bytes to 16 bytes. ECB encrypts each block alone. CBC, CTR, and GCM define how blocks chain and whether a nonce is required.
- Reusing a stream keystream (same key and nonce) is fatal: XOR of two ciphertexts cancels it. A repeated block under ECB leaks equality of blocks, which is a different leak.
- Bit errors: a flipped ciphertext bit flips the same plaintext bit in a raw stream XOR. In CBC it damages that block and shifts into the next. An AEAD mode rejects the message instead of returning damaged plaintext.
- CTR mode is a block cipher used as a stream. The distinction in practice is often “which mode,” not a separate algorithm.

**Examples:**

ChaCha20 XORs each plaintext byte with the next keystream byte. AES-ECB would encrypt `0123456789abcdef` as one block and repeat the pattern if the next block is identical. AES-GCM hides that repetition and adds a tag, provided the nonce changes every message.
</details>

<details>
<summary>Can you describe the Feistel cipher structure?</summary>

### Can you describe the Feistel cipher structure?

**Definition:**

A Feistel cipher splits each block into two halves and repeats a round that mixes one half into the other with a function of the round key. The function itself does not have to be reversible.

**How it works:**

- Start with left half L and right half R.
- One round sets the new left to the old right, and the new right to the old left XOR F(old right, round key). Some descriptions swap the names. The XOR-and-swap is the idea.
- After the last round the halves are the ciphertext. Decryption runs the same rounds with the round keys in reverse order. F is applied the same way, so F can be a one-way mix.
- More rounds and a strong F raise the work of cryptanalysis. Too few rounds leak structure.
- DES is the famous example: 64-bit blocks, 32-bit halves, 16 rounds, F built from expansion, S-boxes, and a permutation.
- AES is not a Feistel cipher. It uses a substitution-permutation network on the whole state, with invertible steps.

**Examples:**

```text
L, R = split(block)
L, R = R, L xor F(R, k1)
L, R = R, L xor F(R, k2)
```

To undo round 2, XOR F(L, k2) back into R and swap. You never invert F. You only recompute it with the same round key.
</details>

<details>
<summary>What are the key differences between DES and 3DES?</summary>

### What are the key differences between DES and 3DES?

**Definition:**

3DES (Triple DES) applies the DES round structure three times with more key material. It stretches the key. It does not fix the 64-bit block.

**How it works:**

- DES uses one 56-bit key and 16 Feistel rounds on a 64-bit block.
- 3DES runs encrypt, decrypt, encrypt. Two-key 3DES uses two DES keys (about 112 bits). Three-key 3DES uses three (about 168 bits). The middle decrypt step lets a 3DES implementation act as DES when all keys are equal.
- The S-boxes and the Feistel F are the same. The extra strength is the repeated keyed passes, not a new substitution design.
- 3DES is three times the work of DES and still has a 64-bit block. In long-lived modes that birthday bound (the Sweet32 attack on CBC) is a practical limit even when the key is long.
- Standards have retired both for new work. AES is the replacement: a 128-bit block and a key that does not need three passes.
- If you meet 3DES, treat it as a compatibility path to migrate off, not as a peer of AES.

**Examples:**

A payment device that still speaks two-key 3DES can talk to an old peer. A new design uses AES-GCM. Wrapping the same DES key three times (`E-D-E` with K, K, K) is just DES, which is why the three keys have to differ for the extra strength to exist.
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
