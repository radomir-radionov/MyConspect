# Fibonacci Sequence — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_algorithms.md)

### Related docs

- [Fibonacci Sequence — Interview](./7_algo_fibonacci_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Fibonacci Sequence](https://devinterview.io/questions/data-structures-and-algorithms/fibonacci-sequence-interview-questions/).

### Fibonacci Sequence Basics

<details>
<summary>What is the Fibonacci sequence?</summary>

### What is the Fibonacci sequence?

**Definition:**

The Fibonacci sequence starts `0, 1` and each later term is the sum of the two before it: `F(n) = F(n-1) + F(n-2)`, with `F(0) = 0` and `F(1) = 1`.

**How it works:**

- The first terms are `0, 1, 1, 2, 3, 5, 8, 13`. Some texts start at `1, 1`; the recurrence is the same and the index shifts by one.
- The ratio of consecutive terms approaches the golden ratio `φ = (1 + √5) / 2 ≈ 1.618`.
- The same recurrence shows up when counting tilings, binary strings without two consecutive ones, and the leaves of a naive recursion tree.
- A direct recursive function matches the definition and repeats a huge amount of work. A loop or a table writes each term once.

**Examples:**

```text
F(0)=0, F(1)=1
F(6)=8, because 0,1,1,2,3,5,8
```
</details>

<details>
<summary>Write a function to calculate the nth Fibonacci number using a recursive approach.</summary>

### Write a function to calculate the nth Fibonacci number using a recursive approach.

**Definition:**

The recursive function returns the base cases for 0 and 1 and otherwise returns the sum of the two smaller calls.

**How it works:**

- If `n` is 0, return 0. If `n` is 1, return 1.
- Otherwise return `fib(n-1) + fib(n-2)`.
- Time is Θ(φⁿ), which people often write as O(2ⁿ). Every call branches in two, and the recursion tree has exponentially many leaves.
- Stack space is Θ(n), because the deepest chain is the `n-1` spine, not the whole tree.
- Memoization or a loop removes the repeated calls. The recurrence itself stays the same.

**Examples:**

```text
fib(n):
  if n < 2: return n
  return fib(n-1) + fib(n-2)
```

`fib(5)` returns 5 after a tree that recomputes `fib(2)` and `fib(3)` several times.
</details>

<details>
<summary>Provide a non-recursive implementation for generating the Fibonacci sequence to the nth number.</summary>

### Provide a non-recursive implementation for generating the Fibonacci sequence to the nth number.

**Definition:**

A non-recursive Fibonacci either loops from the two seeds or evaluates Binet’s closed form. The loop is the one you ship.

**How it works:**

- Binet: `F(n) = (φⁿ − ψⁿ) / √5`, where `φ = (1+√5)/2` and `ψ = (1−√5)/2`. Rounding `φⁿ / √5` to the nearest integer also works while the floating-point value is exact.
- That formula is O(1) arithmetic and O(1) memory, and it drifts once `φⁿ` no longer fits in a precise float. Large `n` needs an exact method.
- The iterative method starts with `prev = 0`, `curr = 1`. For each step up to `n`, replace the pair with `(curr, prev + curr)`.
- The loop is Θ(n) time and Θ(1) extra memory if you only keep the last two terms. Keeping the whole list is Θ(n) memory, which is the output size.

**Examples:**

```text
prev, curr = 0, 1
for _ in 2..n:
  prev, curr = curr, prev + curr
return curr if n > 0 else 0
```

After four updates the pair walks `1,1` then `1,2` then `2,3` then `3,5`.
</details>

<details>
<summary>What is the time complexity of the recursive Fibonacci solution, and how can this be improved?</summary>

### What is the time complexity of the recursive Fibonacci solution, and how can this be improved?

**Definition:**

The naive recursion is exponential because each call makes two more calls. A cache or a loop computes each index a constant number of times.

**How it works:**

- Base cases: return 0 at `n = 0` and 1 at `n = 1`.
- Each larger call adds the two recursive results. The call tree is Θ(φⁿ), often bounded as O(2ⁿ). The stack depth is Θ(n).
- Memoization stores `fib(n)` the first time it is computed. Later calls return the stored value. Time drops to Θ(n), and the cache is Θ(n) memory.
- The iterative pair `(a, b) = (0, 1)`, updated `n` times, is also Θ(n) time and only Θ(1) memory.
- Matrix exponentiation and fast doubling go further, to Θ(log n) arithmetic operations, if multiplication of the growing integers is treated carefully.

**Examples:**

`fib(10)` without a cache does hundreds of calls. With a cache it fills indexes 2 through 10 once each.
</details>

<details>
<summary>Describe the memoization technique as applied to the Fibonacci sequence calculation.</summary>

### Describe the memoization technique as applied to the Fibonacci sequence calculation.

**Definition:**

Memoized Fibonacci keeps a map from `n` to `F(n)` and fills an entry only on the first call with that argument.

**How it works:**

- On entry, if `n` is already in the map, return it.
- If `n` is 0 or 1, store that base and return it.
- Otherwise compute `fib(n-1) + fib(n-2)`, store the sum under `n`, and return it.
- Each index from 0 through n is written once, so the time is Θ(n) instead of exponential.
- The map holds Θ(n) entries, and the recursion still uses Θ(n) stack until the base case returns. An explicit loop avoids that stack.

**Examples:**

```text
fib(n, memo):
  if n in memo: return memo[n]
  memo[n] = n if n < 2 else fib(n-1, memo) + fib(n-2, memo)
  return memo[n]
```

The second call to `fib(40)` after the first one is a single lookup.
</details>

### Efficient Fibonacci Algorithms

<details>
<summary>Implement an iterative solution to generate the Fibonacci sequence, discussing its time and space complexity.</summary>

### Implement an iterative solution to generate the Fibonacci sequence, discussing its time and space complexity.

**Definition:**

The iterative solution keeps the last two terms and advances them `n` times. It never builds the recursion tree.

**How it works:**

- Start with `a = 0` and `b = 1`, which are `F(0)` and `F(1)`.
- Repeat `n` times if you want `F(n)`: set `a, b = b, a + b`. After `k` steps, `a` is `F(k)`.
- One step is a constant amount of arithmetic on the current integers. With fixed-width words that is Θ(n) time. With growing big integers the later additions cost more than O(1).
- Extra memory is Θ(1) besides the output, against Θ(n) stack for the naive recursion and Θ(φⁿ) time.
- If the caller wants the whole sequence, append each `a` to a list. That list is Θ(n) and is the result, not overhead.

**Examples:**

```text
a, b = 0, 1
repeat n times:
  a, b = b, a + b
# a is F(n)
```

The first four steps of `a` are `1, 1, 2, 3`.
</details>

<details>
<summary>Explain the concept of dynamic programming as it relates to the Fibonacci sequence.</summary>

### Explain the concept of dynamic programming as it relates to the Fibonacci sequence.

**Definition:**

Fibonacci is the smallest DP example: the recurrence overlaps, and storing each `F(k)` once turns an exponential tree into a linear chain.

**How it works:**

- Optimal substructure is the recurrence itself. `F(n)` is exactly `F(n-1) + F(n-2)`, so the answer is built from smaller answers.
- Overlap is the waste in the naive tree: `F(n-2)` is reached from both branches.
- Top-down DP memoizes the recursive function. Bottom-up DP writes an array from index 2 up to n.
- Both are Θ(n) time. The array is the explicit table; the memo map is the same table filled in the order the recursion discovers.
- Two rolling variables are the space-optimized bottom-up form. They are still DP: each step reuses the two previous states and throws the older ones away.

**Examples:**

`t[0] = 0`, `t[1] = 1`, then `t[i] = t[i-1] + t[i-2]`. The cell `t[n]` is the answer, and no cell was computed twice.
</details>

<details>
<summary>Solve the nth Fibonacci number problem using matrix exponentiation and analyze its efficiency.</summary>

### Solve the nth Fibonacci number problem using matrix exponentiation and analyze its efficiency.

**Definition:**

The step from `(F(n), F(n+1))` to the next pair is multiplication by a fixed 2×2 matrix. Raising that matrix to the nth power jumps straight to `F(n)`.

**How it works:**

- `[[1, 1], [1, 0]]ⁿ = [[F(n+1), F(n)], [F(n), F(n-1)]]`. The top-right entry is `F(n)`.
- Exponentiation by squaring computes the power with Θ(log n) matrix multiplications: square to get `M²`, `M⁴`, and so on, and multiply the factors whose bits are set in `n`.
- Each multiplication is a constant amount of arithmetic if the integers are fixed width. With big integers the bit length of `F(n)` is Θ(n), so each multiplication costs more as `n` grows.
- Extra memory is the Θ(log n) stack of squaring, or Θ(1) if the squaring is written as a loop.
- This is the same recurrence as the loop. It skips the intermediate Fibonacci numbers you do not need, except the ones the squaring happens to form.

**Examples:**

```text
M = [[1, 1], [1, 0]]
# top-right of M^n is F(n)
# M^1 gives F(1)=1, M^5 gives F(5)=5
```
</details>

<details>
<summary>Can the nth Fibonacci number be found using the golden ratio, and if so, how would you implement this method?</summary>

### Can the nth Fibonacci number be found using the golden ratio, and if so, how would you implement this method?

**Definition:**

Yes. The nearest integer to `φⁿ / √5` is `F(n)`, for `φ = (1 + √5) / 2`. It is Binet’s formula with the smaller `ψⁿ` term rounded away.

**How it works:**

- `φ` and `√5` are irrational, so the implementation uses floating point or an exact algebraic type.
- Double precision stays exact only while `F(n)` is small enough that the rounding error is under `0.5`. Past roughly `n = 70` a 64-bit float is no longer a safe source of the integer.
- The arithmetic is O(1) for a fixed-width float and does not build the previous terms.
- For a large exact `F(n)`, use the integer loop, fast doubling, or matrix power. Use the golden-ratio form for a closed formula, a limit argument, or a small `n` where you have checked the rounding.

**Examples:**

```text
phi = (1 + sqrt(5)) / 2
F(n) = round(phi**n / sqrt(5))
```

`n = 10` rounds to 55. Do not use this for `n = 100` in a 64-bit float.
</details>

<details>
<summary>Present an approach to precomputing Fibonacci numbers to answer multiple nth Fibonacci queries efficiently.</summary>

### Present an approach to precomputing Fibonacci numbers to answer multiple nth Fibonacci queries efficiently.

**Definition:**

If many queries share an upper bound, fill a table once up to that bound and answer each query by index.

**How it works:**

- Let `N` be the largest `n` you will be asked, or grow the table when a query exceeds it.
- Write `t[0] = 0`, `t[1] = 1`, and `t[i] = t[i-1] + t[i-2]` through `N`. That pass is Θ(N) arithmetic.
- A query for `n ≤ N` is Θ(1): return `t[n]`.
- `q` queries with maximum `N` cost Θ(N + q) instead of Θ(N) per query.
- The table is Θ(N) memory, or more once the integers themselves become large. If only one query arrives, the rolling loop is enough and the table is wasted.

**Examples:**

```text
build through max_n once
answer(n) = table[n]
```

Queries `7, 3, 7` after a build through 7 are three array reads: `13, 2, 13`.
</details>

### Fibonacci Variants and Applications

<details>
<summary>How might the Fibonacci sequence be altered to start with two arbitrary initial values? Provide an algorithm for such a sequence.</summary>

### How might the Fibonacci sequence be altered to start with two arbitrary initial values? Provide an algorithm for such a sequence.

**Definition:**

Keep the same additive step and replace the seeds. A sequence with `G(0) = a` and `G(1) = b`, then `G(n) = G(n-1) + G(n-2)`, is a Fibonacci-like sequence. Lucas numbers are the case `a = 2`, `b = 1`.

**How it works:**

- If `n` is 0, return `a`. If `n` is 1, return `b`. The two seeds may be equal; nothing in the recurrence forbids that.
- Otherwise iterate `n - 1` steps from the pair `(a, b)`, replacing it with `(b, a + b)` each time. The first component becomes `G(n)`.
- Time is Θ(n) and extra memory is Θ(1), the same as ordinary Fibonacci.
- Any such sequence is a linear combination of the standard Fibonacci sequence, so the closed form and the matrix power still apply after you change the initial vector.

**Examples:**

```text
nth(a, b, n):
  if n == 0: return a
  x, y = a, b
  repeat n-1 times:
    x, y = y, x + y
  return x
```

`nth(2, 1, 5)` is the Lucas number 11: `2, 1, 3, 4, 7, 11`.
</details>

<details>
<summary>Explain an algorithm to compute the sum of the first n Fibonacci numbers without generating the entire sequence.</summary>

### Explain an algorithm to compute the sum of the first n Fibonacci numbers without generating the entire sequence.

**Definition:**

The sum of `F(1) + … + F(n)` equals `F(n+2) − 1`. With `F(0) = 0` included, the sum through `F(n)` is the same value. You compute one later Fibonacci number, then subtract 1.

**How it works:**

- The identity is `F(1) + … + F(n) = F(n+2) − 1`. Check: `1+1+2+3+5 = 12` and `F(7) − 1 = 13 − 1`.
- Compute `F(n+2)` with the rolling loop, fast doubling, or the matrix power, and subtract 1. You never store `F(1)` through `F(n)`.
- The matrix form is the same 2×2 Fibonacci matrix. Its nth power yields `F(n+2)` in the corner you read, in Θ(log n) multiplications.
- Changing the seeds changes the closed sum. For the standard seeds the subtraction of 1 is the whole shortcut.
- Time matches whatever Fibonacci routine you call. The rolling loop is Θ(n); the matrix power is Θ(log n) arithmetic operations.

**Examples:**

Sum of the first 6 positive Fibonacci numbers: `1+1+2+3+5+8 = 20`, and `F(8) − 1 = 21 − 1 = 20`.
</details>

<details>
<summary>Define the Lucas sequence and detail how a program can generate it.</summary>

### Define the Lucas sequence and detail how a program can generate it.

**Definition:**

The Lucas sequence uses the Fibonacci recurrence with seeds `L(0) = 2` and `L(1) = 1`. The terms begin `2, 1, 3, 4, 7, 11, 18`.

**How it works:**

- `L(n) = L(n-1) + L(n-2)`. The step is the same addition as Fibonacci; only the start pair changes. It is not a cheaper recurrence.
- A loop from `(2, 1)` produces `L(n)` in Θ(n) time and Θ(1) extra memory.
- The closed form is `L(n) = φⁿ + ψⁿ`, which is an integer even though `φ` and `ψ` are irrational. Fibonacci’s Binet form divides by `√5` and then rounds.
- Lucas and Fibonacci are linked: `L(n) = F(n-1) + F(n+1)`. If you already have a Fibonacci table, the Lucas term is one addition.

**Examples:**

```text
x, y = 2, 1
repeat n times:
  x, y = y, x + y
# x is L(n)
```

`L(5) = 11`.
</details>

<details>
<summary>How can the Fibonacci sequence be used to solve the tiling problem, where you need to cover a 2xn rectangle with 2x1 tiles?</summary>

### How can the Fibonacci sequence be used to solve the tiling problem, where you need to cover a 2xn rectangle with 2x1 tiles?

**Definition:**

The number of ways to tile a `2×n` board with `2×1` dominoes is a Fibonacci number, because the leftmost column forces a split into a smaller board of the same kind.

**How it works:**

- Let `T(n)` be the number of tilings of `2×n`. `T(0) = 1` (one way to tile nothing) and `T(1) = 1` (one vertical domino). A horizontal domino covers two columns and must come with a partner, so it is one piece of width 2.
- A tiling either starts with a vertical domino and a tiling of `2×(n-1)`, or with two horizontal dominoes and a tiling of `2×(n-2)`. Those cases do not overlap.
- So `T(n) = T(n-1) + T(n-2)`. With these seeds, `T(n) = F(n+1)` when `F(1) = 1`, `F(2) = 1`, `F(3) = 2`.
- Compute it with the same rolling loop. Time Θ(n), extra memory Θ(1).

**Examples:**

A `2×3` board has 3 tilings: three verticals; two horizontal on the left plus one vertical; one vertical plus two horizontal on the right. `T(3) = 3 = F(4)`.
</details>

### Large Fibonacci Numbers and Modular Arithmetic

<details>
<summary>How to calculate large Fibonacci numbers without encountering integer overflow issues?</summary>

### How to calculate large Fibonacci numbers without encountering integer overflow issues?

**Definition:**

`F(n)` has Θ(n) bits, so a fixed-width integer overflows. Use a type that grows, or stop storing the full integer if you only need a residue or a suffix.

**How it works:**

- A wider primitive only postpones the overflow. `F(93)` already exceeds a signed 64-bit integer. `long` in C++ is not a plan for `F(1000)`.
- Arbitrary-precision integers, such as Python `int` or Java `BigInteger`, allocate more limbs as the number grows. The loop is still the right algorithm; each addition costs more as the bit length grows.
- If you only need `F(n) mod m`, reduce at every step. The values stay bounded by `m`, and overflow of the full `F(n)` never happens. The Pisano period says the sequence of residues repeats.
- The last `k` decimal digits are the special case `m = 10^k`.
- A hand-rolled digit array or a base-10⁹ limb array is the same idea as a big-integer library when the language does not provide one.

**Examples:**

```text
a, b = 0, 1          # language big integers
repeat n times:
  a, b = b, a + b
```

In a language with fixed words, store `a` and `b` as digit lists and add them with a carry.
</details>

<details>
<summary>Implement a function that computes the nth Fibonacci number modulo m.</summary>

### Implement a function that computes the nth Fibonacci number modulo m.

**Definition:**

</details>

<details>
<summary>Implement an algorithm to find the last k digits of the nth Fibonacci number.</summary>

### Implement an algorithm to find the last k digits of the nth Fibonacci number.

**Definition:**

</details>

<details>
<summary>Check if a given number is a Fibonacci number.</summary>

### Check if a given number is a Fibonacci number.

**Definition:**

</details>

<details>
<summary>Solve for the nth Fibonacci number using fast doubling.</summary>

### Solve for the nth Fibonacci number using fast doubling.

**Definition:**

</details>

### Fibonacci Sequence in Data Structures

<details>
<summary>How can a Fibonacci heap data structure benefit from the properties of the Fibonacci sequence?</summary>

### How can a Fibonacci heap data structure benefit from the properties of the Fibonacci sequence?

**Definition:**

</details>

<details>
<summary>Implement Fibonacci sequence generation using an array as storage.</summary>

### Implement Fibonacci sequence generation using an array as storage.

**Definition:**

</details>

<details>
<summary>Provide an example of when and why a Fibonacci queue might be preferred over a traditional queue structure.</summary>

### Provide an example of when and why a Fibonacci queue might be preferred over a traditional queue structure.

**Definition:**

</details>

### Advanced Fibonacci Concepts

<details>
<summary>Explain the Pisano Period and how it pertains to the calculation of Fibonacci numbers modulo m.</summary>

### Explain the Pisano Period and how it pertains to the calculation of Fibonacci numbers modulo m.

**Definition:**

</details>

<details>
<summary>What is the relationship between Fibonacci numbers and the Euclidean algorithm for finding the greatest common divisor?</summary>

### What is the relationship between Fibonacci numbers and the Euclidean algorithm for finding the greatest common divisor?

**Definition:**

</details>

<details>
<summary>Can you prove that the sum of n Fibonacci numbers is equivalent to the (n+2)nd Fibonacci number minus 1?</summary>

### Can you prove that the sum of n Fibonacci numbers is equivalent to the (n+2)nd Fibonacci number minus 1?

**Definition:**

</details>

### Fibonacci Numbers in Sorting and Searching Algorithms

<details>
<summary>Describe a scenario where Fibonacci numbers can be applied to optimize a search algorithm.</summary>

### Describe a scenario where Fibonacci numbers can be applied to optimize a search algorithm.

**Definition:**

</details>

<details>
<summary>Implement a Fibonacci Search algorithm and compare its efficiency with binary search.</summary>

### Implement a Fibonacci Search algorithm and compare its efficiency with binary search.

**Definition:**

</details>

<details>
<summary>Can the Fibonacci sequence optimize the worst-case running time of an algorithm? Provide an example.</summary>

### Can the Fibonacci sequence optimize the worst-case running time of an algorithm? Provide an example.

**Definition:**

</details>

### Fibonacci Sequence Mathematical Questions

<details>
<summary>Prove by induction that the sum of the first n even-indexed Fibonacci numbers is the (n+1)st Fibonacci number minus 1.</summary>

### Prove by induction that the sum of the first n even-indexed Fibonacci numbers is the (n+1)st Fibonacci number minus 1.

**Definition:**

</details>

<details>
<summary>How can Fibonacci numbers be related to the Binet’s formula, and is it practical for computing Fibonacci numbers?</summary>

### How can Fibonacci numbers be related to the Binet’s formula, and is it practical for computing Fibonacci numbers?

**Definition:**

</details>

<details>
<summary>Do Fibonacci numbers have a connection with Pascal’s Triangle?</summary>

### Do Fibonacci numbers have a connection with Pascal’s Triangle?

**Definition:**

</details>

<details>
<summary>Generate the Fibonacci sequence using a two-variable iterative process.</summary>

### Generate the Fibonacci sequence using a two-variable iterative process.

**Definition:**

</details>

### Fibonacci Numbers in Theoretical Computer Science

<details>
<summary>How is the Fibonacci sequence used in the analysis of algorithms, particularly in the derivation of time complexities?</summary>

### How is the Fibonacci sequence used in the analysis of algorithms, particularly in the derivation of time complexities?

**Definition:**

</details>

<details>
<summary>Discuss the significance of the Fibonacci sequence in computational complexity theory and provide an example.</summary>

### Discuss the significance of the Fibonacci sequence in computational complexity theory and provide an example.

**Definition:**

</details>

### Fibonacci Sequence Interview Challenges

<details>
<summary>Implement a script that generates a spiral matrix filled in with Fibonacci numbers.</summary>

### Implement a script that generates a spiral matrix filled in with Fibonacci numbers.

**Definition:**

</details>
