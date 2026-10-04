# Probability — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_algorithms.md)

### Related docs

- [Probability — Interview](./7_algo_probability_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Probability](https://devinterview.io/questions/machine-learning-and-data-science/probability-interview-questions/).

### Probability Basics

<details>
<summary>What is probability, and how is it used in machine learning?</summary>

### What is probability, and how is it used in machine learning?

**Definition:**

Probability assigns a number from 0 to 1 to how likely an outcome is. Machine learning uses those numbers as predictions, as training targets, and as a way to state uncertainty.

**How it works:**

- A model such as logistic regression outputs `P(y = 1 | x)`. A language model outputs a distribution over the next token.
- Training often minimizes a loss that is the negative log of the probability of the observed label.
- Bayes' rule updates a belief about parameters after data. Many regularizers are priors written as penalties.
- Calibration matters: a predicted 0.8 should be right about 80% of the time, not merely rank above a 0.2.
</details>

<details>
<summary>Define the terms sample space and event in probability.</summary>

### Define the terms sample space and event in probability.

**Definition:**

The sample space is the set of every outcome the experiment can produce. An event is a subset of that space, the outcomes you chose to group together.

**How it works:**

- A probability measure assigns each event a number from 0 to 1. The whole sample space has probability 1. The empty event has probability 0.
- The complement of an event is the rest of the sample space. `P(not A) = 1 − P(A)` when the space is exhaustive.
- Events combine with union (A or B) and intersection (A and B).
- Outcomes are the atoms. Events are what statements such as 'the die is even' refer to.

**Examples:**

One fair die has sample space `{1, 2, 3, 4, 5, 6}`. The event 'even' is `{2, 4, 6}` and has probability 1/2.
</details>

<details>
<summary>What is the difference between discrete and continuous probability distributions?</summary>

### What is the difference between discrete and continuous probability distributions?

**Definition:**

A discrete distribution puts probability on a countable set of values. A continuous distribution spreads probability over an interval so that any single point has probability zero.

**How it works:**

- Discrete: a probability mass function `P(X = x)` sums to 1 over the values. Examples are Bernoulli, binomial, and Poisson.
- Continuous: a probability density function integrates to 1. Probability of an interval is the area under the curve, not the height at a point. Examples are Gaussian and exponential.
- A density can be larger than 1. It is not itself a probability.
- Mixed data shows up as counts (discrete) and measurements (continuous). The model family has to match that.

**Examples:**

A coin is discrete: `P(heads) = 0.5`. A completion time in seconds is continuous: `P(time = 1.5000…) = 0`, while `P(1 ≤ time ≤ 2)` can be 0.4.
</details>

<details>
<summary>Explain the differences between joint, marginal, and conditional probabilities.</summary>

### Explain the differences between joint, marginal, and conditional probabilities.

**Definition:**

Joint probability is the chance that two statements are true together. Marginal is the chance of one statement after the other has been summed away. Conditional is the chance of one given that the other is known.

**How it works:**

- `P(A, B)` is the joint. `P(A) = Σᵦ P(A, B)` is the marginal for a discrete partner, and the integral plays that role in the continuous case.
- `P(A | B) = P(A, B) / P(B)` when `P(B) > 0`. Conditioning rescales the slice where B happened.
- The chain rule writes the joint as `P(A, B) = P(A | B) P(B)`.
- A model of `P(label | features)` is conditional. The training data's frequency table is closer to a joint, from which both can be derived.

**Examples:**

Rain and traffic: `P(rain, traffic) = 0.2`, `P(rain) = 0.25`. Then `P(traffic | rain) = 0.2 / 0.25 = 0.8`, and the marginal of traffic might be 0.3 after adding the no-rain slice.
</details>

<details>
<summary>What does it mean for two events to be independent?</summary>

### What does it mean for two events to be independent?

**Definition:**

Two events are independent when knowing one does not change the probability of the other.

**How it works:**

- The test is `P(A, B) = P(A) P(B)`, or equivalently `P(A | B) = P(A)` when `P(B) > 0`.
- Mutually exclusive events with positive probability are dependent: if one happened, the other did not.
- Pairwise independence of three events does not imply that all three are mutually independent. The triple joint must still factor.
- Naive Bayes assumes features are independent given the class, which is often false and still a useful approximation.

**Examples:**

Two fair coins: `P(first heads) = 0.5`, `P(both heads) = 0.25 = 0.5 × 0.5`. They are independent. 'First coin heads' and 'the two coins match' are not.
</details>

<details>
<summary>Describe Bayes' Theorem and provide an example of how it's used.</summary>

### Describe Bayes' Theorem and provide an example of how it's used.

**Definition:**

Bayes' theorem turns a known likelihood and a prior into the probability of the hypothesis after the evidence.

**How it works:**

- `P(H | D) = P(D | H) P(H) / P(D)`. `P(H)` is the prior, `P(D | H)` the likelihood, `P(H | D)` the posterior.
- `P(D)` is the total probability of the evidence, summed over hypotheses: `Σ P(D | Hᵢ) P(Hᵢ)`.
- A rare hypothesis stays unlikely unless the likelihood ratio is large. Base rates matter.
- Spam filters, medical tests, and Bayesian updates of model weights are the same identity with different names for H and D.

**Examples:**

A disease has prior 0.01. The test is positive for 90% of sick people and 5% of healthy people. `P(sick | positive) = (0.9 × 0.01) / (0.9 × 0.01 + 0.05 × 0.99) ≈ 0.15`. Most positive tests are still false alarms.
</details>

<details>
<summary>What is a probability density function (PDF)?</summary>

### What is a probability density function (PDF)?

**Definition:**

A PDF is a non-negative function whose area over the whole line is 1. The probability of an interval is the integral of the PDF over that interval.

**How it works:**

- The value `f(x)` is a density, not `P(X = x)`. That point probability is zero for a continuous variable.
- A taller peak means the values concentrate there. The curve may exceed 1 if the peak is narrow.
- The likelihood of a continuous observation in maximum likelihood is the density at that point, used for comparison, not as a probability.
- Histograms estimate a PDF by counting mass in bins and dividing by bin width.

**Examples:**

A uniform density on `[0, 0.5]` equals 2 everywhere inside the interval. `P(0.1 ≤ X ≤ 0.2) = 2 × 0.1 = 0.2`.
</details>

<details>
<summary>What is the role of the cumulative distribution function (CDF)?</summary>

### What is the role of the cumulative distribution function (CDF)?

**Definition:**

The CDF at `x` is `P(X ≤ x)`. It turns a distribution into a single non-decreasing curve from 0 to 1.

**How it works:**

- For a discrete variable it is the sum of masses up to `x`. For a continuous variable it is the integral of the PDF from the left up to `x`.
- Where the PDF exists, it is the derivative of the CDF. Jumps in the CDF are point masses.
- `P(a < X ≤ b) = F(b) − F(a)`. Quantiles are inverse lookups on the CDF.
- Empirical CDFs compare a sample to a theoretical distribution without choosing a bin width.

**Examples:**

A fair die has `F(3) = P(X ≤ 3) = 1/2` and `F(3.9) = 1/2` still, because nothing sits between 3 and 4.
</details>

### Probabilistic Models and Theories

<details>
<summary>Explain the Central Limit Theorem and its significance in machine learning.</summary>

### Explain the Central Limit Theorem and its significance in machine learning.

**Definition:**

The central limit theorem says that the average of many independent draws, suitably centered and scaled, approaches a normal distribution even when each draw is not normal.

**How it works:**

- The mean of the sample average is the true mean. Its variance is the single-draw variance divided by the sample size.
- The approximation improves as the sample grows, and it is poor for tiny samples or very heavy tails.
- That is why confidence intervals and many test statistics use a normal or a t curve for averages.
- Mini-batch gradient noise is often treated as roughly Gaussian for the same reason: each batch mean stacks many small contributions.

**Examples:**

Die rolls are uniform on 1..6, not bell-shaped. The average of 50 rolls still sits near 3.5 with a roughly normal histogram.
</details>

<details>
<summary>What is the Law of Large Numbers?</summary>

### What is the Law of Large Numbers?

**Definition:**

The law of large numbers says that the average of more and more independent draws from the same distribution settles on the expected value.

**How it works:**

- The weak form says the probability of a large gap between the average and the mean goes to zero. The strong form says the average converges with probability 1.
- Finite variance is the usual textbook condition. The draws must be identically distributed and not too dependent.
- It justifies replacing a theoretical mean with a long-run sample mean, including an empirical risk in place of the expected loss.
- It does not say the average becomes normal. That shape statement is the central limit theorem. It also does not say a short sample is already close.

**Examples:**

A fair coin's proportion of heads after 20 flips can sit at 0.7. After 20,000 flips it sits close to 0.5.
</details>

<details>
<summary>Define expectation, variance, and covariance.</summary>

### Define expectation, variance, and covariance.

**Definition:**

Expectation is the probability-weighted average of a random variable. Variance is the expected squared distance from that average. Covariance is how two variables move together.

**How it works:**

- `E[X] = Σ x P(X = x)` or the integral `x f(x) dx`. It is linear: `E[aX + bY] = a E[X] + b E[Y]` even when X and Y are dependent.
- `Var(X) = E[(X − E[X])²] = E[X²] − (E[X])²`. `Var(aX) = a² Var(X)`.
- `Cov(X, Y) = E[(X − E[X])(Y − E[Y])]`. Zero covariance does not by itself prove independence, except in special families such as jointly normal variables.
- A covariance matrix of features is what PCA diagonalizes. High variance in one feature can dominate a distance unless you scale.

**Examples:**

A fair die has expectation 3.5. Variance is about 2.92. Two independent dice have covariance 0, so the variance of their sum is about 5.83.
</details>

<details>
<summary>What are the characteristics of a Gaussian (Normal) distribution?</summary>

### What are the characteristics of a Gaussian (Normal) distribution?

**Definition:**

A normal distribution is the bell curve fixed by a mean `μ` and a variance `σ²`. It is symmetric, and the mean, median, and mode coincide.

**How it works:**

- The density is highest at `μ` and falls off as `exp(−(x − μ)² / (2σ²))`. About 68% of the mass lies within one standard deviation, about 95% within two, about 99.7% within three.
- The sum of independent normals is normal. A scaled normal is normal. That closure is why noise models add up cleanly.
- Standardizing `(X − μ) / σ` produces the standard normal, which is what z-tables use.
- Real errors are often only roughly normal. Heavy tails and hard bounds break the 68-95-99.7 picture.
</details>

<details>
<summary>Explain the utility of the Binomial distribution in machine learning.</summary>

### Explain the utility of the Binomial distribution in machine learning.

**Definition:**

A binomial count is the number of successes in a fixed number of independent yes-or-no trials that share one success probability.

**How it works:**

- `P(K = k) = C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ`. The mean is `np` and the variance is `np(1 − p)`.
- It models how many of n emails are spam, how many of n users click, or how many of n cross-validation folds pass, when each trial is a Bernoulli draw.
- Logistic regression models one trial. A binomial likelihood extends that to a count out of n at the same features.
- When n is large and p is not tiny, the count is approximately normal. When n is large and p is tiny, it is approximately Poisson.

**Examples:**

Ten independent users click with probability 0.2. The expected click count is 2, and the chance of zero clicks is `0.8¹⁰ ≈ 0.107`.
</details>

<details>
<summary>How does the Poisson distribution differ from the Binomial distribution?</summary>

### How does the Poisson distribution differ from the Binomial distribution?

**Definition:**

Poisson counts events in a fixed interval when they arrive independently at a constant average rate. Binomial counts successes in a fixed number of trials.

**How it works:**

- Poisson has one parameter `λ`, the mean count. Variance equals the mean. Probabilities are `e⁻λ λᵏ / k!`.
- There is no separate n. The interval can hold arbitrarily many events, though large k becomes unlikely.
- It is the limit of a binomial as n grows, p shrinks, and `np` stays at `λ`. That is why rare events in a large population look Poisson.
- Use Poisson for arrivals, faults per hour, or words in a window. Use binomial when the number of attempts is the thing you fixed.

**Examples:**

Calls average 4 per hour. `P(0 calls) = e⁻⁴ ≈ 0.018`. A binomial would need you to name the number of candidate callers first.
</details>

<details>
<summary>What is the relevance of the Bernoulli distribution in machine learning?</summary>

### What is the relevance of the Bernoulli distribution in machine learning?

**Definition:**

A Bernoulli distribution is one yes-or-no trial with success probability `p`. It is the likelihood underneath binary classification.

**How it works:**

- `P(X = 1) = p` and `P(X = 0) = 1 − p`. The mean is `p` and the variance is `p(1 − p)`.
- Logistic regression sets `p = σ(w · x + b)` and trains by the Bernoulli log-likelihood, which is binary cross-entropy.
- A sequence of independent Bernoulli trials with the same `p` is a binomial count. A different `p` per row is a set of separate Bernoulli draws.
- Accuracy throws away the probability. The Bernoulli likelihood uses the confidence, so 0.99 on a wrong label is punished harder than 0.51.

**Examples:**

A click model with `p = 0.2` has log-likelihood `log 0.2` on a click and `log 0.8` on a miss. Training nudges `w` so those logs grow on the observed labels.
</details>

### Applying Probability in Machine Learning

<details>
<summary>How do probabilistic models cope with uncertainty in predictions?</summary>

### How do probabilistic models cope with uncertainty in predictions?

**Definition:**

</details>

<details>
<summary>In machine learning, what are Naive Bayes classifiers, and why are they naive?</summary>

### In machine learning, what are Naive Bayes classifiers, and why are they naive?

**Definition:**

</details>

<details>
<summary>How does logistic regression utilize probability?</summary>

### How does logistic regression utilize probability?

**Definition:**

</details>

<details>
<summary>What is the concept of entropy in information theory, and how does it relate to machine learning models?</summary>

### What is the concept of entropy in information theory, and how does it relate to machine learning models?

**Definition:**

</details>

<details>
<summary>Explain the relationship between Maximum Likelihood Estimation (MLE) and probability.</summary>

### Explain the relationship between Maximum Likelihood Estimation (MLE) and probability.

**Definition:**

</details>

<details>
<summary>How is probability used in Bayesian inference for machine learning?</summary>

### How is probability used in Bayesian inference for machine learning?

**Definition:**

</details>

### Practical Considerations of Probability in Machine Learning

<details>
<summary>How can assuming independence in probabilistic models lead to inaccuracies?</summary>

### How can assuming independence in probabilistic models lead to inaccuracies?

**Definition:**

</details>

<details>
<summary>Describe how to update probabilities using the concept of prior, likelihood, and posterior.</summary>

### Describe how to update probabilities using the concept of prior, likelihood, and posterior.

**Definition:**

</details>

<details>
<summary>What strategies would you use to handle missing data in probabilistic models?</summary>

### What strategies would you use to handle missing data in probabilistic models?

**Definition:**

</details>

<details>
<summary>How do you determine the significance of an observed effect using probability?</summary>

### How do you determine the significance of an observed effect using probability?

**Definition:**

</details>

<details>
<summary>What are p-values and confidence intervals, and how are they interpreted?</summary>

### What are p-values and confidence intervals, and how are they interpreted?

**Definition:**

</details>

### Specific Algorithms and Techniques

<details>
<summary>Describe how a probabilistic graphical model (PGM) works.</summary>

### Describe how a probabilistic graphical model (PGM) works.

**Definition:**

</details>

<details>
<summary>Explain the concepts of Markov Chains and how they apply to machine learning.</summary>

### Explain the concepts of Markov Chains and how they apply to machine learning.

**Definition:**

</details>

<details>
<summary>How do Hidden Markov Models (HMMs) use probability in sequential data modeling?</summary>

### How do Hidden Markov Models (HMMs) use probability in sequential data modeling?

**Definition:**

</details>

<details>
<summary>What is Expectation-Maximization (EM) algorithm and how does probability play a role in it?</summary>

### What is Expectation-Maximization (EM) algorithm and how does probability play a role in it?

**Definition:**

</details>

### Coding Challenges

<details>
<summary>Write a Python function that calculates the probability of rolling a sum of S on two dice.</summary>

### Write a Python function that calculates the probability of rolling a sum of S on two dice.

**Definition:**

</details>

<details>
<summary>Implement a function that simulates a biased coin flip n times and estimates the probability of heads.</summary>

### Implement a function that simulates a biased coin flip n times and estimates the probability of heads.

**Definition:**

</details>

<details>
<summary>Code a Gaussian Naive Bayes classifier from scratch using Python.</summary>

### Code a Gaussian Naive Bayes classifier from scratch using Python.

**Definition:**

</details>

<details>
<summary>Simulate the Law of Large Numbers using Python: verify that as the number of coin tosses increases, the average of the results becomes closer to the expected value.</summary>

### Simulate the Law of Large Numbers using Python: verify that as the number of coin tosses increases, the average of the results becomes closer to the expected value.

**Definition:**

</details>

<details>
<summary>Write a Python script that estimates the mean and variance of a dataset and plots the corresponding Gaussian distribution.</summary>

### Write a Python script that estimates the mean and variance of a dataset and plots the corresponding Gaussian distribution.

**Definition:**

</details>

### Scenario-Based Probability Questions

<details>
<summary>How would you use probability to design a recommendation system model?</summary>

### How would you use probability to design a recommendation system model?

**Definition:**

</details>

<details>
<summary>Propose a method for predicting customer churn using probabilistic models.</summary>

### Propose a method for predicting customer churn using probabilistic models.

**Definition:**

</details>

<details>
<summary>Discuss how you would use probabilities to detect anomalies in transaction data.</summary>

### Discuss how you would use probabilities to detect anomalies in transaction data.

**Definition:**

</details>

<details>
<summary>Describe how you might use Bayesian methods to improve the performance of a spam classifier.</summary>

### Describe how you might use Bayesian methods to improve the performance of a spam classifier.

**Definition:**

</details>

<details>
<summary>Explain a situation where you would use Markov Chains for modeling customer behavior on a website.</summary>

### Explain a situation where you would use Markov Chains for modeling customer behavior on a website.

**Definition:**

</details>

### Advanced Probability Concepts and Research

<details>
<summary>How has the advent of Quantum Computing influenced probabilistic algorithms?</summary>

### How has the advent of Quantum Computing influenced probabilistic algorithms?

**Definition:**

</details>

<details>
<summary>What role does probability play in reinforcement learning and decision making?</summary>

### What role does probability play in reinforcement learning and decision making?

**Definition:**

</details>

<details>
<summary>Describe how Monte Carlo simulations are used in machine learning for approximation of probabilities.</summary>

### Describe how Monte Carlo simulations are used in machine learning for approximation of probabilities.

**Definition:**

</details>

<details>
<summary>How do GANs (Generative Adversarial Networks) utilize probability theory?</summary>

### How do GANs (Generative Adversarial Networks) utilize probability theory?

**Definition:**

</details>

<details>
<summary>What are the probabilistic underpinnings of Active Learning and how might they be utilized in algorithm design?</summary>

### What are the probabilistic underpinnings of Active Learning and how might they be utilized in algorithm design?

**Definition:**

</details>
