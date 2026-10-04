# Blockchain — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_algorithms.md)

### Related docs

- [Blockchain — Interview](./7_algo_blockchain_interview.md)

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

A blockchain is a replicated log of blocks. Each block commits to the previous block’s hash, so the log has one checkable history.

**How it works:**

- A block holds a batch of transactions, a timestamp or height, and the hash of the parent block.
- Nodes collect pending transactions, check signatures and balances, and propose a block under the consensus rule.
- Because block `n` stores `hash(block n−1)`, editing an old transaction changes every hash after it.
- Peers store copies. A peer rejects a chain whose links do not match or whose transactions break the protocol.
- “The” chain is the one the fork-choice rule prefers when two valid tips exist. The hash links make a quiet edit visible. They do not by themselves decide which of two valid tips wins.

**Examples:**

Block 2 stores `prev = H(block 1)`. Change a transfer inside block 1 and `H(block 1)` no longer equals that `prev`. Every later block has to be rebuilt to look consistent.
</details>

<details>
<summary>What is the difference between a public blockchain and a private blockchain?</summary>

### What is the difference between a public blockchain and a private blockchain?

**Definition:**

A public chain lets anyone read, submit, and help decide the next block. A private chain restricts those roles to a known operator or consortium.

**How it works:**

- Public membership is open. Safety comes from the cost of outvoting the rest of the hash power or the stake, not from an access list.
- Private membership is an administrative decision. The operator can add or remove validators, which buys access control and usually higher throughput.
- Readers of a public chain can check history themselves. Readers of a private chain trust the operator who controls who may append.
- “Permissioned” names the access rule. A ledger can be permissioned and still be run by several organizations. A single company’s database with a hash chain is private and is not decentralized in the public-chain sense.
- The data structure, a hash-linked log, is the same. What changes is who is allowed to write and who is trusted to choose the tip.

**Examples:**

Bitcoin is public: anyone can relay a transaction and mine. A bank’s internal ledger that only member banks may append is private, even if each block hashes the previous one.
</details>

<details>
<summary>What are the key features of a blockchain that make it secure?</summary>

### What are the key features of a blockchain that make it secure?

**Definition:**

Security comes from hash links, signatures, replication, and a consensus rule that makes a conflicting history expensive or organizationally hard to publish.

**How it works:**

- Each block stores the parent hash, so a quiet edit is caught by recomputing the chain.
- A signature shows that the private-key holder authorized that transaction. Other nodes check it with the public key.
- Many independent copies mean there is no single database to edit in secret.
- Consensus defines which valid tip wins. Under proof of work, rewriting history means redoing the work of every later block. Under a vote protocol, a minority cannot gather the quorum.
- A run of later blocks raises the cost of replacing an old one, because the replacement has to become the tip the fork-choice rule still prefers.
- None of this hides transaction contents on a public chain. Integrity and authentication are not confidentiality.

**Examples:**

To replace a payment ten blocks back on a proof-of-work chain, an attacker must remine that block and the ten after it faster than the honest chain grows.
</details>

<details>
<summary>How does a blockchain ensure data integrity and prevent tampering?</summary>

### How does a blockchain ensure data integrity and prevent tampering?

**Definition:**

Integrity is tamper evidence: any change to an old record changes its hash, which breaks the link stored in the next block. Honest nodes recompute those links and drop a chain that fails.

**How it works:**

- The hash in block `n` depends on block `n−1` and, through that link, on everything earlier.
- Transactions inside a block are usually summarized by a Merkle root, so one changed transaction changes the block hash as well.
- Nodes also check signatures and the protocol rules for balances or unspent outputs. A hash-valid block with an illegal transfer is still rejected.
- This detects an altered copy. It does not stop a majority of the validating power from adopting a different valid history under the consensus rules.
- “Immutable” in this setting means “altering the past is detectable and costly”, not “the bits cannot be rewritten on one disk”.

**Examples:**

Flip one bit of an old transaction. The Merkle root changes, the block hash changes, and the child block’s `prev` no longer matches. A node that recomputes the header rejects that file.
</details>

<details>
<summary>Can you explain the concept of decentralization in blockchain?</summary>

### Can you explain the concept of decentralization in blockchain?

**Definition:**

Decentralization means no single party owns the ledger or can unilaterally decide which transactions are valid. Independent nodes apply the same public rules to their own copies.

**How it works:**

- Each full node downloads blocks, checks them, and relays what it accepts. A user can verify instead of trusting one database administrator.
- The degree varies. A handful of mining pools or a small validator set is more centralized than a diagram of equal peers.
- Open membership, as in proof of work, pushes the decision toward whoever pays for the work. Stake pushes it toward whoever locks the coins.
- A private chain run by one operator is a replicated database with an administrator. The hash links do not make it decentralized.
- Decentralization is a trade against throughput and against the ability to reverse a mistake. There is no help desk that can edit an old public block.

**Examples:**

If one Bitcoin node is shut off, the network still accepts blocks. If the single operator of a private ledger is shut off, appending stops, which is the centralized case.
</details>

<details>
<summary>What is a consensus mechanism, and why is it important in blockchain technology?</summary>

### What is a consensus mechanism, and why is it important in blockchain technology?

**Definition:**

A consensus mechanism is the rule by which nodes pick the next block and, when two valid blocks compete, which chain is authoritative.

**How it works:**

- The network delays and drops messages, and some nodes may be faulty or dishonest. Local validity checks are not enough, because two valid blocks can exist at the same height.
- The mechanism defines safety: honest nodes should not finalize conflicting histories. It defines liveness: the chain should still grow.
- Proof of work uses accumulated work as the fork choice. Proof of stake uses locked coins and votes. A permissioned protocol uses a quorum of known validators.
- Without a shared rule, peers can accept different histories and a double-spend can survive on one of them.
- The mechanism is not the hash link. The hash link checks integrity. Consensus chooses which intact chain the network treats as current.

**Examples:**

Two miners publish different valid blocks at height 800,000. The next proof-of-work blocks decide the winner: honest nodes switch to the heavier chain and drop the other tip.
</details>

<details>
<summary>Describe the most common types of consensus algorithms and how they differ.</summary>

### Describe the most common types of consensus algorithms and how they differ.

**Definition:**

The common families differ in who may propose a block, what they spend, and whether a block is final when it appears or only probably final.

**How it works:**

- Proof of work: miners search for a block hash under a target. The heaviest valid chain wins. Membership is open. Rewriting history takes a majority of the hash power, and the search spends energy.
- Proof of stake: validators lock coins and are selected to propose or vote. Misbehavior can destroy that stake. Influence follows the locked coins, and the energy cost is far lower than a hash search.
- Practical Byzantine Fault Tolerance and its relatives use a known validator set. A block is final once a supermajority of votes agrees. They suit a permissioned network and give explicit finality. They do not grow an open mining population.
- Safety assumptions differ. Proof of work assumes an honest majority of hash power over time. Voting protocols assume fewer than a threshold of validators are Byzantine, often one third.
- Throughput and openness move in opposite directions. An open race is slower to finalize than a small voting committee.

**Examples:**

Bitcoin finalizes by depth: six further blocks make a reversal expensive, not impossible. A three-node PBFT committee finalizes when two of the three (or the protocol’s supermajority) have voted, and that vote is the finality.
</details>

<details>
<summary>How does a blockchain achieve consensus in a distributed environment?</summary>

### How does a blockchain achieve consensus in a distributed environment?

**Definition:**

Each node checks blocks locally, then applies one fork-choice rule to whatever valid tips it has seen. Messages arrive late, so two honest nodes can disagree for a while and still converge.

**How it works:**

- Transactions and blocks are gossiped. A node does not wait for a global lock.
- Validity is local: signatures, structure, and the ledger rules. Invalid data is not voted on; it is dropped.
- Fork choice is the shared rule. Proof of work prefers the heaviest chain. Proof of stake prefers the checkpoint justified by the most stake, or the head the votes support. A quorum protocol prefers the block a supermajority committed.
- Two heads can exist until more blocks or more votes arrive. Honest nodes that see the same evidence then pick the same tip.
- Finality is probabilistic under proof of work: a deeper block is harder to replace, not formally impossible. Under a voting protocol it is explicit once the quorum has committed.

**Examples:**

Node A sees block `X` first. Node B sees block `Y` first. Both are valid. When both nodes later see a child of `X` and none of `Y`, the heaviest-chain rule moves B onto `X`.
</details>

<details>
<summary>What is a node in the blockchain context, and what role does it play?</summary>

### What is a node in the blockchain context, and what role does it play?

**Definition:**

A node is a process that stores chain data and speaks the peer-to-peer protocol. Not every node checks the same amount of history.

**How it works:**

- A full node downloads blocks, checks every transaction and consensus rule, and relays what it accepts. It does not have to mine or stake.
- A light client stores headers and asks a full node for the pieces it needs. It trusts the header chain and a Merkle proof rather than replaying every transaction.
- Miners and validators are nodes that also propose blocks. Proposal is extra. Verification is the baseline.
- Users can check the chain themselves only while running a full node stays practical. If blocks are too heavy, people delegate verification and the network becomes easier to fool.
- Shutting off one full node does not stop a public network. Shutting off the only node of a private deployment does.

**Examples:**

A wallet on a phone that checks a Merkle proof against a header is a light client. The process that downloaded every Bitcoin block and rejected an invalid signature is a full node, whether or not it mines.
</details>

<details>
<summary>Can you explain what a blockchain fork is and why it might occur?</summary>

### Can you explain what a blockchain fork is and why it might occur?

**Definition:**

A fork is a split in the chain or in the rules nodes enforce. Short forks are ordinary. Rule forks split the software.

**How it works:**

- A transient fork happens when two valid blocks are produced at the same height before either has spread. The fork-choice rule later drops one branch. Its transactions return to the mempool if they are still valid.
- A hard fork changes the rules so old software rejects the new blocks. Nodes that do not upgrade stay on a separate chain. A disputed hard fork is how one network becomes two assets.
- A soft fork tightens the rules in a way old nodes still accept as valid, while upgraded nodes reject the newly forbidden blocks.
- Accidental forks come from latency. Intentional forks come from an upgrade or from an attack that privately mines a competing tip.
- Applications that treat the latest block as final will observe a payment and then see it disappear if that block is the one the fork choice drops.

**Examples:**

Two blocks at height 100, then a child only on the first. Nodes switch to that heavier tip. The transactions unique to the dropped block become pending again, unless they conflict with the winning branch.
</details>

### Cryptography in Blockchain

<details>
<summary>How does cryptography secure transactions and blocks in a blockchain?</summary>

### How does cryptography secure transactions and blocks in a blockchain?

**Definition:**

Cryptography supplies integrity and authentication. The sender signs the transaction, and hashes commit to the exact bytes of transactions and blocks. Which of two valid chains wins is still a consensus decision.

**How it works:**

- The sender signs the transaction bytes with a private key. Every other node checks that signature with the public key and never learns the private key.
- A block hash, and the Merkle root of the transactions, commits to those bytes. Any edit changes the digest.
- Proof of work is itself a search for a hash in a target range. The puzzle binds the block to a measurable amount of work.
- An address is commonly a hash of a public key, so the key need not appear on the chain until it spends.
- This does not encrypt a typical public-chain transfer. The amount and the recipient are readable. Confidentiality needs a separate scheme.

**Examples:**

A node rejects a transfer whose signature does not match the public key that owns the coins, even if the block hash is well formed. It also rejects a block whose stored parent hash is not the hash it just computed.
</details>

<details>
<summary>What is a hash function, and why is it crucial to blockchain technology?</summary>

### What is a hash function, and why is it crucial to blockchain technology?

**Definition:**

A cryptographic hash maps an input of any length to a fixed-size digest. Blockchains use it as the glue between blocks and as the summary of a block’s transactions.

**How it works:**

- The same input always produces the same digest, and computing it is fast.
- A one-bit change spreads across the output, so similar transactions do not have similar hashes.
- Preimage resistance makes the digest hard to invert. Collision resistance makes it hard to find two inputs with the same digest. Those are the properties a chain relies on when it treats the digest as a name for the bytes.
- Uses: the parent pointer, the Merkle root, addresses derived from keys, and the proof-of-work puzzle.
- A hash is not encryption. It is not built to be reversed and read back. Knowing `H(block)` does not reveal the block.

**Examples:**

`H("pay Alice 1")` and `H("pay Alice 2")` are unrelated digests. The second is not a small edit of the first, which is why a changed amount cannot hide inside an old block hash.
</details>

<details>
<summary>Can you explain asymmetric encryption and how it’s used in blockchains?</summary>

### Can you explain asymmetric encryption and how it’s used in blockchains?

**Definition:**

Asymmetric cryptography uses a key pair: an operation done with one key is checked or undone only with the other. On a blockchain the common use is a signature, not secrecy of the transfer.

**How it works:**

- The private key stays with its owner. The public key, or an address derived from it, is what the chain stores.
- The owner signs with the private key. Anyone verifies with the public key. A valid check shows authorization of those exact bytes.
- The same mathematics can encrypt a payload for the holder of a private key. A typical public-chain transaction does not do that. Every node must read the amount and the recipient to check the ledger rules.
- Publishing the public key does not reveal the private key, because the derivation is one-way, usually multiplication on an elliptic curve.
- Losing the private key loses the ability to authorize spends. There is no recovery from the public data on the chain.

**Examples:**

Alice signs “pay Bob 3” with her private key. Bob and every full node verify with Alice’s public key. They learn that Alice authorized it. They do not learn a secret they can use to spend her other coins.
</details>

<details>
<summary>What is a digital signature, and how does it provide authenticity in transactions?</summary>

### What is a digital signature, and how does it provide authenticity in transactions?

**Definition:**

A digital signature is a short value computed from the transaction bytes and the signer’s private key. A verifier accepts it only when those same bytes match the public key.

**How it works:**

- The signature covers a hash of the transaction, not a separate sticky note. Changing the amount or the recipient makes verification fail.
- It shows authenticity: the private-key holder produced it. It shows integrity of the signed bytes. It does not hide them.
- Schemes such as ECDSA and EdDSA are used because the signatures are short and every node can verify them cheaply.
- A signature does not prove a person, only a key. Whoever holds the key can produce a signature the network will accept.
- Replay is a protocol concern. A signature of “pay Bob 3” must be bound to a nonce, a chain id, or a specific unspent output, or the same bytes could be submitted twice.

**Examples:**

```text
sig = sign(private_key, hash(tx))
ok = verify(public_key, hash(tx), sig)
```

Edit `tx.amount` after signing and `ok` becomes false, without anyone needing the private key to notice.
</details>

<details>
<summary>How do public and private keys work within blockchain?</summary>

### How do public and private keys work within blockchain?

**Definition:**

The private key is a secret random number. The public key is derived from it by a one-way function. Spending requires a signature that verifies under the public key the coins were sent to.

**How it works:**

- Generation starts with randomness. A weak random source produces a guessable private key.
- On the curves blockchains actually use, the public key is scalar multiplication of a fixed base point. Going backward, from the point to the scalar, is the hard problem.
- You distribute the public key or, more often, an address that is a hash of it. You do not distribute the private key.
- The chain checks `verify(public_key, tx, signature)`. It never sees the private key, and it cannot recover one.
- Losing the private key loses control of the funds. There is no administrator reset. Exposing it lets anyone produce a signature the network will accept.
- Wallets often derive many private keys from one seed so a single backup covers the accounts. The seed is then the secret that must not leak.

**Examples:**

Coins sent to an address derived from public key `P` move only when a later transaction carries a signature that `P` verifies. A signature made by a different key fails, even if the attacker copies the rest of a previous transaction.
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
