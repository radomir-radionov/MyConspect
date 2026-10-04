# Bit Manipulation — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_algorithms.md)

### Related docs

- [Bit Manipulation — Interview](./7_algo_bits_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Bit Manipulation](https://devinterview.io/questions/data-structures-and-algorithms/bit-manipulation-interview-questions/).

### Bit Manipulation Fundamentals

<details>
<summary>What is a Bit?</summary>

### What is a Bit?

**Definition:**

A bit is one binary digit, the smallest unit of information in a digital computer. It is either 0 or 1.

**How it works:**

- The name is short for binary digit. As a Boolean it is false or true.
- Place values are powers of two, not ten. The bit at position `i`, counting from 0 at the right, is worth `2^i`.
- Four bits are a nibble: 16 patterns, one hex digit from `0` to `F`. Eight bits are a byte: 256 patterns, 0 through 255.
- The decimal 5 is the byte `00000101`, because `4 + 1 = 5`.
- Bitwise operators act on these bits directly. AND, OR, XOR, NOT, and shifts are single ALU operations on a machine word.
- A signed integer is usually two’s complement. A fixed 64-bit signed value spans `-2^63` through `2^63 − 1`. A language with arbitrary-precision integers, such as Python, grows the bit string instead of overflowing the word.
- The machine word is the width the CPU handles in one register, 64 bits on current general-purpose chips. Wider SIMD registers apply the same bitwise idea to several words at once.

**Examples:**

`42 & 12` is `00101010` AND `00001100`, which is `00001000`, or 8.
</details>

<details>
<summary>What is a Byte?</summary>

### What is a Byte?

**Definition:**

A byte is a group of 8 bits, also called an octet. It holds 256 distinct patterns, the unsigned values 0 through 255.

**How it works:**

- Number the bits from 0 at the right, the least significant bit, up to 7 at the left, the most significant bit. Bit `i` contributes `b_i * 2^i`.
- The place values are 1, 2, 4, 8, 16, 32, 64, and 128. All eight bits set is 255.
- On ordinary architectures the byte is the smallest addressable unit. Larger integers are sequences of bytes, interpreted with an endianness.
- `int(bit_string, 2)` parses a binary text. A left-shift reconstruction does the same without a parser: start at 0, and for each next bit do `(value << 1) | bit`.
- Raw bytes are a different object from a binary string. `int.from_bytes(b"\xff", "big")` reads the all-ones byte as 255.
- SIMD code often moves 16, 32, or 64 bytes in one instruction. The byte is still the unit those vectors are made of.

**Examples:**

```text
value = 0
for bit in [1, 0, 1, 1, 0, 0, 0, 0]:  # high bit first
    value = (value << 1) | bit
# value == 176
```
</details>

<details>
<summary>Explain what is a Bitwise Operation.</summary>

### Explain what is a Bitwise Operation.

**Definition:**

A bitwise operation combines the individual bits of one or two integers. The CPU’s arithmetic logic unit does it in a single instruction on a machine word.

**How it works:**

- AND (`&`) is 1 only where both bits are 1. It masks fields out. `5 & 3` is `0101 & 0011 = 0001`.
- OR (`|`) is 1 where either bit is 1. It sets bits. `5 | 3` is `0111`, which is 7.
- XOR (`^`) is 1 where the bits differ. It toggles and checks parity. `5 ^ 3` is `0110`, which is 6.
- NOT (`~`) flips every bit. In two’s complement, `~x` equals `-(x + 1)`, so `~5` is `-6`.
- A left shift `x << k` moves bits toward the high end and fills zeros, multiplying by `2^k` when nothing shifts out. `5 << 2` is 20.
- An arithmetic right shift `x >> k` moves bits toward the low end. On a nonnegative value it is floor division by `2^k`. `5 >> 2` is 1.
- A logical right shift (`>>>` in Java and JavaScript) fills the high end with zeros. Python has no `>>>`; mask to the width you care about, then shift.
- Negating in two’s complement is “flip the bits and add 1”. The population count is the number of 1-bits; Python exposes it as `int.bit_count()`.
- Typical uses: pack flags into one word, bloom-filter membership, permission bits, and splitting a 32-bit color into 8-bit channels.

**Examples:**

```text
READ, WRITE, EXEC = 1, 2, 4
perms = READ | WRITE          # 0b011
can_exec = perms & EXEC       # 0
perms ^= EXEC                 # toggle execute -> 0b111
```
</details>

<details>
<summary>What are some real-world applications of Bitwise Operators?</summary>

### What are some real-world applications of Bitwise Operators?

**Definition:**

Bitwise operators pack, mask, and mix bits inside a word. They show up wherever a program talks to a compact binary layout instead of a separate variable per flag.

**How it works:**

- Compression appends variable-length codes, as in Huffman coding, by shifting bits into a byte stream. Bit-packing stores several small fields, such as 10-bit channels, in one integer so they share a cache line.
- Symmetric ciphers such as AES and ChaCha20 mix state with XOR and rotates. Checksums such as CRC use XOR and shifts to detect a flipped bit.
- A subnet check is `ip & mask`. The mask keeps the network prefix and clears the host bits.
- Device registers are updated in place: `reg |= 1 << k` sets a bit, `reg &= ~(1 << k)` clears it, `reg ^= 1 << k` toggles it.
- `n > 0 and (n & (n - 1)) == 0` tests a power of two. A bitset stores a Boolean array in one bit per flag, about eight times denser than an array of bytes.
- Graphics code uses shifts instead of division by a power of two, and uses masks to isolate color channels.
- A parity bit or `bit_count() & 1` detects a single-bit error. A Bloom filter ORs hash indexes into a bit array.

**Examples:**

```text
READ, WRITE = 1 << 0, 1 << 1
state = READ | WRITE
can_write = bool(state & WRITE)
state ^= (1 << 3)             # toggle an encrypted flag
```
</details>

<details>
<summary>What is a bitwise AND operation and how can it be used to check if a number is odd or even?</summary>

### What is a bitwise AND operation and how can it be used to check if a number is odd or even?

**Definition:**

Bitwise AND writes a 1 only in positions where both inputs have a 1. AND with 1 isolates the least significant bit, which is the parity of the integer.

**How it works:**

- Every higher bit is a positive power of two, so it is even. The bit worth `2^0` is the only one that can make the number odd.
- `n & 1` is 0 when `n` is even and 1 when `n` is odd.
- The same operator is a mask. `n & mask` clears every bit that is 0 in the mask and keeps the bits that are 1 in both.
- On a fixed-width word the operation is one instruction. A compiler often rewrites `n % 2` into this test when the divisor is the constant 2.
- It works for negative two’s-complement values as well: the least significant bit is still the remainder modulo 2.

**Examples:**

```text
is_odd = (n & 1) == 1
is_even = (n & 1) == 0
```

`6 & 1` is 0. `7 & 1` is 1.
</details>

<details>
<summary>Explain the bitwise OR operation with an example.</summary>

### Explain the bitwise OR operation with an example.

**Definition:**

Bitwise OR writes a 1 in every position where at least one of the two inputs has a 1. It is the operator that turns a bit on without disturbing the others.

**How it works:**

- `0 | 0` is 0. Any pair that includes a 1 is 1. OR cannot clear a bit: a 1 in either input stays 1.
- `n | (1 << k)` forces bit `k` on and leaves every other bit of `n` as it was.
- OR of two masks is their union. A permission word is built by OR-ing the flags that should be present.
- Inclusive OR is different from XOR. OR keeps a 1 when both sides are 1. XOR would turn that position off.

**Examples:**

`0b1010 | 0b0100` is `0b1110`. In decimal, `10 | 4` is 14. `0b1010 | 0b0010` stays `0b1010`, because that bit was already set.
</details>

<details>
<summary>How does the bitwise XOR operation work, and what is it commonly used for?</summary>

### How does the bitwise XOR operation work, and what is it commonly used for?

**Definition:**

XOR writes a 1 where the two bits differ and a 0 where they match. It is its own inverse, which is why it shows up in swaps, checksums, and “find the unique element”.

**How it works:**

- `0 ^ 0` and `1 ^ 1` are 0. `0 ^ 1` and `1 ^ 0` are 1.
- `a ^ a` is 0, `a ^ 0` is `a`, and `a ^ b ^ b` is `a`. The operation is commutative and associative.
- XOR of an array in which every value appears twice cancels those pairs and leaves the value that appears once.
- Three XORs swap two variables: `a ^= b; b ^= a; a ^= b`. It fails if `a` and `b` are the same object.
- Inside an adder, XOR is the sum of two bits with the carry removed. The carry is the AND, shifted left.
- Flipping any input bit flips the running XOR, so a one-bit change is visible in a parity checksum.
- `n ^ (1 << k)` toggles bit `k` and leaves the rest of the word alone.

**Examples:**

`5 ^ 3` is `0101 ^ 0011 = 0110`, which is 6. XOR that with 3 again and you are back at 5.
</details>

<details>
<summary>Demonstrate how to set, toggle, and clear a specific bit in a number using bitwise operators.</summary>

### Demonstrate how to set, toggle, and clear a specific bit in a number using bitwise operators.

**Definition:**

Build a one-bit mask `1 << k` and combine it with the word. OR sets the bit, XOR toggles it, and AND with the inverted mask clears it.

**How it works:**

- Number bits from 0 at the least significant end. `mask = 1 << k` has only bit `k` set.
- Set: `n | mask`. A 1 in the mask forces that position on.
- Toggle: `n ^ mask`. Positions where the mask is 0 stay unchanged, and bit `k` flips.
- Clear: `n & ~mask`. The complement has a 0 only at bit `k`, so AND keeps every other bit and forces bit `k` off.
- Test: `(n & mask) != 0`.
- On a fixed-width signed word, `~mask` has the high bits set. That is what you want for the clear. In a language with infinite sign bits, mask the complement to the width you are using.

**Examples:**

```text
mask = 1 << 2          # 0b100
n = 0b1001
set    = n | mask      # 0b1101
toggle = n ^ mask      # 0b1101
clear  = set & ~mask   # 0b1001
```
</details>

<details>
<summary>What is bit masking, and how would you create a mask to isolate the nth bit?</summary>

### What is bit masking, and how would you create a mask to isolate the nth bit?

**Definition:**

A mask is an integer whose 1-bits mark the positions you want to read or change. Isolating bit `n` means AND with a mask that has only that bit set.

**How it works:**

- `mask = 1 << n`. Then `value & mask` is either 0 or `mask`.
- Shift the result right by `n` if you want the bit as 0 or 1: `(value >> n) & 1`.
- A field from bit `lo` through bit `hi` uses a run of ones, `((1 << (hi - lo + 1)) - 1) << lo`, then AND.
- Masks compose. OR unions them, AND intersects them, and XOR flips exactly the marked bits.
- Clearing uses the complement of the mask. Setting uses OR. The mask itself does not include the data bits.

**Examples:**

```text
isolate bit 3 of 0b11010:
  0b11010 & (1 << 3)     # 0b01000
  (0b11010 >> 3) & 1     # 1
```
</details>

<details>
<summary>Explain how left and right shifts (`<<` and `>>`) work in bit manipulation.</summary>

### Explain how left and right shifts (`<<` and `>>`) work in bit manipulation.

**Definition:**

A shift moves every bit the same number of places. Bits that leave the word disappear, and the vacated end is filled with a pad bit.

**How it works:**

- `n << k` moves bits toward the high end and fills the low end with zeros. When the result still fits, that multiplies by `2^k`. `5 << 2` is `10100`, which is 20.
- A logical right shift moves bits toward the low end and fills the high end with zeros. On an unsigned value it is floor division by `2^k`.
- An arithmetic right shift copies the sign bit into the vacated positions, so a negative two’s-complement value stays negative. For a nonnegative value it matches the logical shift. `5 >> 2` is 1.
- The shift count is taken modulo the word width on some architectures and is undefined for a count outside `0 .. width-1` in others. Reduce `k` yourself if the language does not.
- Shifting into the sign bit, or shifting a 1 out of a fixed-width signed word, is where overflow shows up. Arbitrary-precision integers just grow.

**Examples:**

`0b001101 << 1` is `0b011010`. `0b001101 >> 1` is `0b000110`. The bit that fell off the right is gone; a rotation would have kept it.
</details>

<details>
<summary>What is the difference between `>>` and `>>>` operators?</summary>

### What is the difference between `>>` and `>>>` operators?

**Definition:**

`>>` is an arithmetic right shift: the vacated high bits are filled with a copy of the sign bit. `>>>` is a logical right shift: those bits are filled with zeros.

**How it works:**

- On a nonnegative value the two operators match, because the sign bit is already 0.
- On a negative two’s-complement value, `>>` keeps the result negative. `>>>` eventually produces a nonnegative bit pattern because zeros enter from the left.
- Java defines `>>>` on `int` and `long`. JavaScript converts the operand to a 32-bit integer first: signed for `>>`, unsigned for `>>>`.
- Python has no `>>>`. The same effect on a width-`w` pattern is `(n & ((1 << w) - 1)) >> k`.
- Use `>>>` or an unsigned mask when you are sliding a bit field and must not smear a sign bit into the data. Use `>>` when you mean floor division of a signed integer by a power of two.

**Examples:**

In a 32-bit word, `-8 >> 1` stays negative (`-4`). `-8 >>> 1` is a large positive value, because the sign bit moved right and a zero took its place.
</details>

<details>
<summary>Explain how to perform left and right bit rotations.</summary>

### Explain how to perform left and right bit rotations.

**Definition:**

A rotation moves bits the way a shift does, then feeds the bits that fell off one end back in at the other end. The word keeps the same number of 1-bits.

**How it works:**

- For a word of width `w`, rotate left by `k` with `((n << k) | (n >> (w - k)))` masked to `w` bits. Take `k` modulo `w` first.
- The right shift in that formula must be logical. An arithmetic shift would copy a sign bit instead of the bits that wrapped.
- Rotate right by `k` is a left rotate by `w - k`, or the same formula with the distances swapped.
- A plain shift destroys bits and fills zeros. A rotation is reversible: rotating back by the same distance restores the word.
- Hashes and ciphers use rotations because they mix high bits into low bits without the zero-fill of a shift.

**Examples:**

```text
def rotl(n, k, w=8):
    k %= w
    n &= (1 << w) - 1
    return ((n << k) | (n >> (w - k))) & ((1 << w) - 1)
```

`rotl(0b10000001, 1)` is `0b00000011`.
</details>

### Bitwise Problem Solving and Algorithms

<details>
<summary>Write a function that counts the number of set bits (1s) in an integer.</summary>

### Write a function that counts the number of set bits (1s) in an integer.

**Definition:**

The population count is the number of 1-bits. Kernighan’s loop clears one set bit per iteration, so it runs once per 1-bit rather than once per bit of width.

**How it works:**

- `n & (n - 1)` turns off the lowest set bit. Subtracting one flips that bit and every zero below it; the AND keeps the higher 1-bits.
- Repeat until `n` is 0 and count the iterations.
- A fixed-width word can also use a hardware popcount, or a parallel sum that adds adjacent bit groups with a few masks and shifts. That parallel method is a constant number of operations on a 32-bit or 64-bit word.
- Python’s `int.bit_count()` is the library form. On an arbitrary-precision integer the cost follows the number of limbs, not a single instruction.
- The result is an integer from 0 up to the width, also called the Hamming weight.

**Examples:**

```text
def popcount(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count
```

`popcount(0b10110)` is 3.
</details>

<details>
<summary>Determine if a number is a power of two using bit manipulation.</summary>

### Determine if a number is a power of two using bit manipulation.

**Definition:**

A positive power of two has exactly one bit set. `n > 0 and n & (n - 1) == 0` detects that pattern.

**How it works:**

- `8` is `1000`. `7` is `0111`. Their AND is 0.
- Any other positive pattern has at least two 1-bits, so clearing the lowest one still leaves a 1, and the AND is not 0.
- Zero is not a positive power of two, and `0 & -1` would be 0, so the `n > 0` test is required.
- Negative values are outside this test. In two’s complement they do not have a single positive power-of-two pattern.
- The test is one instruction after the comparison. A loop that divides by two also works and does Θ(log n) steps.

**Examples:**

```text
def is_pow2(n):
    return n > 0 and (n & (n - 1)) == 0
```

`is_pow2(16)` is true. `is_pow2(12)` is false. `is_pow2(0)` is false.
</details>

<details>
<summary>Design a function that adds two numbers without using the ‘+’ operator.</summary>

### Design a function that adds two numbers without using the ‘+’ operator.

**Definition:**

XOR is the sum of two bits with the carry thrown away, and a left-shifted AND is that carry. Repeat until the carry word is zero.

**How it works:**

- `sum_bits = a ^ b` adds each column and drops the carry.
- `carry = (a & b) << 1` is a 1 in the next column wherever both bits were 1.
- Replace `a` with `sum_bits` and `b` with `carry`, and repeat. When `b` is 0 there is nothing left to carry, and `a` is the total.
- This is a ripple-carry adder written as a loop. On a fixed-width word the carry shifts out within that width, so the loop ends.
- Subtraction is the same routine on `a` and the two’s-complement negation of `b` (`~b + 1`), which is allowed if the ban is only on the `+` source token you can build the increment from the carry loop itself.
- Overflow on a fixed-width signed word is the carry into the sign bit, the same as with ordinary addition.

**Examples:**

```text
def add(a, b):
    while b:
        carry = (a & b) << 1
        a = a ^ b
        b = carry
    return a
```

`add(5, 3)` walks the carry until it returns 8.
</details>

<details>
<summary>Implement a function that swaps the values of two variables without using extra space.</summary>

### Implement a function that swaps the values of two variables without using extra space.

**Definition:**

</details>

<details>
<summary>Find the only non-repeating element in an array where each element repeats twice, using bitwise operations.</summary>

### Find the only non-repeating element in an array where each element repeats twice, using bitwise operations.

**Definition:**

</details>

<details>
<summary>Given a list of numbers where every number appears three times except for one, find the single non-repeated number.</summary>

### Given a list of numbers where every number appears three times except for one, find the single non-repeated number.

**Definition:**

</details>

<details>
<summary>Implement a bit manipulation algorithm to find and clear the lowest set bit in a number.</summary>

### Implement a bit manipulation algorithm to find and clear the lowest set bit in a number.

**Definition:**

</details>

<details>
<summary>Write a function that would generate the next higher number with the same number of set bits as the given positive integer.</summary>

### Write a function that would generate the next higher number with the same number of set bits as the given positive integer.

**Definition:**

</details>

<details>
<summary>Reverse the bits of an unsigned integer.</summary>

### Reverse the bits of an unsigned integer.

**Definition:**

</details>

<details>
<summary>Calculate the absolute value of an integer using bit manipulation.</summary>

### Calculate the absolute value of an integer using bit manipulation.

**Definition:**

</details>

<details>
<summary>Multiply and divide a number by two using bit manipulation.</summary>

### Multiply and divide a number by two using bit manipulation.

**Definition:**

</details>

<details>
<summary>Determine the log base 2 of an integer using bitwise operations.</summary>

### Determine the log base 2 of an integer using bitwise operations.

**Definition:**

</details>

### Advanced Bit Manipulation Techniques

<details>
<summary>How can you detect and handle integer overflow and underflow while using bit manipulation for arithmetic operations?</summary>

### How can you detect and handle integer overflow and underflow while using bit manipulation for arithmetic operations?

**Definition:**

</details>

<details>
<summary>Explain the significance of setting flags and checking bits in the implementation of a bitmap or bitset.</summary>

### Explain the significance of setting flags and checking bits in the implementation of a bitmap or bitset.

**Definition:**

</details>

<details>
<summary>How can bit manipulation be used to perform efficient matrix multiplication of binary matrices?</summary>

### How can bit manipulation be used to perform efficient matrix multiplication of binary matrices?

**Definition:**

</details>

<details>
<summary>Design an algorithm to perform endian conversion (big endian to little endian and vice versa) using bit manipulation.</summary>

### Design an algorithm to perform endian conversion (big endian to little endian and vice versa) using bit manipulation.

**Definition:**

</details>

### Bit Manipulation in Computing and Data Processing

<details>
<summary>Give an example of how to use bitwise operations to implement a simple compression algorithm.</summary>

### Give an example of how to use bitwise operations to implement a simple compression algorithm.

**Definition:**

</details>

<details>
<summary>Can bitwise operations be used to efficiently encode and decode data? Illustrate with an example.</summary>

### Can bitwise operations be used to efficiently encode and decode data? Illustrate with an example.

**Definition:**

</details>

<details>
<summary>How are bitwise operations used in Huffman coding or other compression algorithms?</summary>

### How are bitwise operations used in Huffman coding or other compression algorithms?

**Definition:**

</details>

<details>
<summary>Explain the role of bit manipulation in encoding and decoding data, like Base64.</summary>

### Explain the role of bit manipulation in encoding and decoding data, like Base64.

**Definition:**

</details>

<details>
<summary>Discuss how bitmasking can manage the state of multiple boolean flags in a single byte.</summary>

### Discuss how bitmasking can manage the state of multiple boolean flags in a single byte.

**Definition:**

</details>

<details>
<summary>Explain the use of bit manipulation in network programming, specifically in creating and interpreting network packets.</summary>

### Explain the use of bit manipulation in network programming, specifically in creating and interpreting network packets.

**Definition:**

</details>

### Bit Manipulation Challenges and Creative Use Cases

<details>
<summary>Implement a modular exponentiation algorithm using bit manipulation.</summary>

### Implement a modular exponentiation algorithm using bit manipulation.

**Definition:**

</details>

<details>
<summary>Find the XOR of all numbers within a given range.</summary>

### Find the XOR of all numbers within a given range.

**Definition:**

</details>

<details>
<summary>Generate all possible subsets of a set using bit manipulation.</summary>

### Generate all possible subsets of a set using bit manipulation.

**Definition:**

</details>

<details>
<summary>Determine if a binary representation of an integer is a palindrome.</summary>

### Determine if a binary representation of an integer is a palindrome.

**Definition:**

</details>

<details>
<summary>Find the minimum and maximum of two integers without using comparisons.</summary>

### Find the minimum and maximum of two integers without using comparisons.

**Definition:**

</details>

<details>
<summary>Check if two integers have opposite signs using bit manipulation.</summary>

### Check if two integers have opposite signs using bit manipulation.

**Definition:**

</details>
