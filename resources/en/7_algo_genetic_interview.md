# Genetic Algorithms — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_algorithms.md)

### Related docs

- [Genetic Algorithms — Interview](./7_algo_genetic_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Genetic Algorithms](https://devinterview.io/questions/machine-learning-and-data-science/genetic-algorithms-interview-questions/).

### Fundamental Concepts of Genetic Algorithms

<details>
<summary>What is a genetic algorithm (GA) and how is it inspired by biological evolution?</summary>

### What is a genetic algorithm (GA) and how is it inspired by biological evolution?

**Definition:**

A genetic algorithm searches for a good solution by keeping a population of candidates and repeatedly favoring the ones that score better.

**How it works:**

- Each candidate is encoded as a chromosome. A fitness function scores it. The next generation is built by selection, crossover, and mutation.
- The biological picture is only a metaphor: fitter individuals contribute more offspring, and random variation explores nearby encodings.
- It does not need a gradient or a continuous formula. It does need a way to encode a candidate and compare two of them.
- The result is a heuristic. There is no guarantee the best individual is the global optimum.

**Examples:**

A population of routes for a delivery tour is scored by total distance. Short routes are more likely to be parents. Offspring swap stretches of stops, and a rare swap of two cities keeps the search from freezing.
</details>

<details>
<summary>Can you explain the terms chromosome, gene, and allele in the context of GAs?</summary>

### Can you explain the terms chromosome, gene, and allele in the context of GAs?

**Definition:**

A chromosome is one complete candidate. A gene is one position in that encoding. An allele is the value sitting in that position.

**How it works:**

- The encoding is chosen for the problem: a bit string, a list of real numbers, or a permutation.
- A gene's domain is the set of alleles it may hold. A binary gene has alleles 0 and 1. A city gene in a tour has a city id, and the whole chromosome must stay a permutation.
- Genotype is the encoded chromosome. Phenotype is the actual solution you score, after decoding.
- Crossover swaps genes between parents. Mutation replaces an allele with another legal one.

**Examples:**

Chromosome `[1, 0, 1, 1]` packs a knapsack. Gene 3 is the third item. Its allele `1` means the item is taken.
</details>

<details>
<summary>Describe the process of selection in genetic algorithms.</summary>

### Describe the process of selection in genetic algorithms.

**Definition:**

Selection decides which individuals become parents. Higher fitness should raise the chance, without making every child a copy of the current winner.

**How it works:**

- Fitness-proportionate selection (roulette) gives a slice of the wheel equal to fitness divided by the population total. A very large fitness can dominate.
- Tournament selection draws a small group and keeps the best of that group. The tournament size is the selection pressure.
- Rank selection uses the order of scores, not the raw gaps, so one huge fitness does not take the whole wheel.
- Too much pressure collapses diversity early. Too little pressure wastes generations on weak parents.

**Examples:**

Scores 5, 3, and 2 give roulette weights 0.5, 0.3, and 0.2. A tournament of size 2 that draws the last two parents keeps the one with score 3.
</details>

<details>
<summary>Explain crossover and mutation operations in genetic algorithms.</summary>

### Explain crossover and mutation operations in genetic algorithms.

**Definition:**

Crossover mixes two parents into offspring. Mutation then makes a small random edit so the population can reach encodings neither parent had.

**How it works:**

- Single-point crossover cuts both chromosomes at one index and swaps the tails. Two-point swaps the middle slice. Uniform crossover picks each gene from either parent with a coin flip.
- Permutation problems need an operator that still produces a permutation, such as order crossover: a slice is copied, and the rest is filled from the other parent skipping duplicates.
- Mutation for bits flips a few positions. For real genes it adds a small noise. For permutations it swaps two positions or reverses a slice.
- Typical rates: crossover is likely (often well above a half), mutation is rare per gene. A high mutation rate turns the search into a random walk.

**Examples:**

```text
parents  11010  and  00111
cut at 2 -> children 11111 and 00010
then flip gene 4 of the first child -> 11101
```
</details>

<details>
<summary>What is a fitness function in the context of a genetic algorithm?</summary>

### What is a fitness function in the context of a genetic algorithm?

**Definition:**

The fitness function maps a decoded candidate to a number the selection step can compare. It is the only statement of what 'better' means.

**How it works:**

- For a minimization problem such as distance, fitness is often the negation or a reciprocal so that selection still maximizes.
- It must be defined for every legal chromosome. If illegal chromosomes can appear, the function either repairs them or scores the violation.
- A cheap function matters because it runs once per individual per generation. An expensive simulation becomes the bottleneck.
- A flat landscape, where many different chromosomes share one score, gives selection nothing to prefer.

**Examples:**

Tour length 40 and 25 become fitness `1/40` and `1/25`, so the shorter tour is more likely to be chosen as a parent.
</details>

<details>
<summary>How does a GA differ from other optimization techniques?</summary>

### How does a GA differ from other optimization techniques?

**Definition:**

A genetic algorithm samples many candidates at once and uses only fitness comparisons, so it can move on a landscape that has no derivative.

**How it works:**

- Gradient descent follows a local slope of a smooth function and keeps one point. A GA keeps a population and can sit in several basins at the same time.
- Brute force and exhaustive search check a defined set. A GA samples a tiny fraction and can stop early with a good-enough individual.
- Simulated annealing also uses randomness, but it walks one solution and accepts worse moves with a cooling schedule.
- The cost is many fitness evaluations, several tuning knobs, and no certificate of optimality. Convex problems with a gradient are a better fit for gradient methods.
</details>

<details>
<summary>What are the typical stopping conditions for a GA?</summary>

### What are the typical stopping conditions for a GA?

**Definition:**

The loop stops when more generations are unlikely to pay for themselves, or when a fitness goal has already been met.

**How it works:**

- A generation cap or a wall-clock budget is the hard stop.
- A fitness target stops early when any individual is good enough for the product.
- A plateau rule stops when the best fitness has not improved for a set number of generations.
- A diversity rule can stop when the population has collapsed to near-copies, because crossover then changes little.
</details>

<details>
<summary>How can genetic algorithms be applied to combinatorial optimization problems?</summary>

### How can genetic algorithms be applied to combinatorial optimization problems?

**Definition:**

Combinatorial problems are encoded so every chromosome is a legal combination, or so an illegal one can be repaired before scoring.

**How it works:**

- A knapsack uses a bit per item. Fitness is total value, and overweight chromosomes get a penalty or are repaired by dropping items.
- A tour uses a permutation of cities. Crossover and mutation must preserve 'each city once'.
- Scheduling can be a sequence of jobs. The decoder turns that sequence into a timetable and the fitness is lateness or cost.
- The search space is discrete and usually huge. The GA is a sampler, not a proof that the schedule is optimal.

**Examples:**

Cities `A B C D E`. Order crossover copies the slice `C D` from parent 1 and fills the rest from parent 2 in the order `E A B`, skipping cities already used, producing `E A C D B`.
</details>

### Advanced Genetic Algorithm Concepts

<details>
<summary>What is elitism in GAs and why might it be used?</summary>

### What is elitism in GAs and why might it be used?

**Definition:**

Elitism copies the best few individuals into the next generation unchanged, so crossover and mutation cannot throw away the current best.

**How it works:**

- Without it, the best chromosome can fail to be selected, or its children can all be worse, and the best fitness drops.
- A small elite, often one or a few individuals, is enough. Copying most of the population stalls exploration.
- Elitism pairs well with a higher mutation rate on everyone else: the record is safe while the rest of the population keeps probing.
- The monotone best-so-far curve is the visible effect. The population can still be diverse outside the elite.
</details>

<details>
<summary>How do penalty functions work in genetic algorithms?</summary>

### How do penalty functions work in genetic algorithms?

**Definition:**

A penalty subtracts from fitness when a chromosome breaks a constraint, so selection prefers legal individuals without banning illegal ones outright.

**How it works:**

- A death penalty sets fitness to the worst value, or discards the individual. That is simple and wastes the information inside a near-legal chromosome.
- A graded penalty grows with the size of the violation, such as how far over the weight limit the knapsack is.
- A penalty that is too small lets illegal individuals win. A penalty that is too large makes the search ignore the boundary, where good legal solutions often sit.
- The alternative is a decoder or a repair step that turns every chromosome into a legal phenotype before scoring.

**Examples:**

Value 40 with weight 2 over the limit and penalty factor 10 scores `40 - 10 * 2 = 20`. A legal packing of value 25 then ranks higher.
</details>

<details>
<summary>Explain the concept of genetic drift in GAs.</summary>

### Explain the concept of genetic drift in GAs.

**Definition:**

Genetic drift is the random loss of alleles in a finite population, even when those alleles are not worse.

**How it works:**

- Selection is a sample. A decent allele can miss every parent by chance, and then it is gone unless mutation recreates it.
- Small populations and weak selection make drift stronger. A large population keeps rare alleles longer.
- Drift reduces diversity and can fix a mediocre allele in the whole population. That is a different failure from selection converging on a local peak.
- A higher mutation rate, a larger population, or crowding that protects unusual individuals slows the loss.
</details>

<details>
<summary>What is a multi-objective genetic algorithm?</summary>

### What is a multi-objective genetic algorithm?

**Definition:**

A multi-objective GA searches for trade-offs among several scores at once, instead of collapsing them into one weighted sum.

**How it works:**

- A solution dominates another when it is no worse on every objective and better on at least one. The non-dominated set is the Pareto front.
- NSGA-II ranks the population by non-dominated layers and, inside a layer, prefers individuals in less crowded regions of objective space.
- A weighted sum is simpler and misses parts of a concave front, because one set of weights only supports one point.
- The user picks a point on the front afterward. The algorithm's job is to spread solutions along that front.

**Examples:**

Cost 10 with delay 5 and cost 7 with delay 8 can both be kept. Cost 12 with delay 9 is dominated by the first and can be dropped.
</details>

<details>
<summary>Can you describe what gene expression programming is?</summary>

### Can you describe what gene expression programming is?

**Definition:**

Gene expression programming evolves linear chromosomes that decode into expression trees, so the thing you mutate is not the tree itself.

**How it works:**

- A gene is a string of function symbols and terminal symbols. A fixed head may hold functions or terminals; the tail holds only terminals, which keeps every string a valid tree.
- The phenotype is the tree read from that string, for example an arithmetic expression. Fitness scores the tree on data.
- Crossover and mutation edit the linear string with ordinary string operators, which is simpler than editing tree nodes in place.
- This split of genotype and phenotype is the point relative to genetic programming that evolves the trees directly.

**Examples:**

The string `+ a * b c` decodes as the tree `a + (b * c)`. A mutation can replace `+` with `-` and the next evaluation scores `a - (b * c)`.
</details>

<details>
<summary>What are memetic algorithms and how do they differ from traditional GAs?</summary>

### What are memetic algorithms and how do they differ from traditional GAs?

**Definition:**

A memetic algorithm is a genetic algorithm plus a local improver that polishes each individual before it is scored or returned to the population.

**How it works:**

- The GA still selects, crosses, and mutates. The extra step runs hill-climbing, a 2-opt swap, or another neighborhood search on the phenotype.
- Evolution explores widely. Local search exploits the neighborhood of a promising individual. The hybrid spends its fitness evaluations on already-improved candidates.
- Lamarckian versions write the improved phenotype back into the chromosome. Baldwinian versions score the improved result but leave the chromosome as it was.
- The local search multiplies the cost per individual. It pays when a short polish fixes what crossover tends to break.
</details>

<details>
<summary>Define hypermutation and its role in GAs.</summary>

### Define hypermutation and its role in GAs.

**Definition:**

Hypermutation is a temporary jump in the mutation rate, used when the population has stalled, so alleles can change much faster than in a normal generation.

**How it works:**

- The idea is borrowed from affinity maturation in immune models: once a search is stuck, raise variation, then return to the usual low rate.
- A trigger is often a plateau in best fitness, or a detected change in a dynamic objective.
- While the rate is high, elitism is what keeps the current best from being destroyed. Everyone else is free to jump farther.
- Left on permanently, the same rate stops selection from accumulating small improvements.
</details>

<details>
<summary>How does parallelization improve the performance of genetic algorithms?</summary>

### How does parallelization improve the performance of genetic algorithms?

**Definition:**

</details>

### Genetic Algorithm Variants and Specialized Techniques

<details>
<summary>What is a steady-state genetic algorithm?</summary>

### What is a steady-state genetic algorithm?

**Definition:**

</details>

<details>
<summary>How do generational genetic algorithms operate?</summary>

### How do generational genetic algorithms operate?

**Definition:**

</details>

<details>
<summary>Describe island model GAs and their benefits.</summary>

### Describe island model GAs and their benefits.

**Definition:**

</details>

<details>
<summary>What is the role of crowding and niche in GAs?</summary>

### What is the role of crowding and niche in GAs?

**Definition:**

</details>

<details>
<summary>How do diploid and haploid structures function differently in genetic algorithms?</summary>

### How do diploid and haploid structures function differently in genetic algorithms?

**Definition:**

</details>

<details>
<summary>Explain how coevolution is implemented in GAs.</summary>

### Explain how coevolution is implemented in GAs.

**Definition:**

</details>

<details>
<summary>What is gene duplication and gene deletion in the context of GAs?</summary>

### What is gene duplication and gene deletion in the context of GAs?

**Definition:**

</details>

<details>
<summary>Discuss the concept of dominance and epistasis in genetic algorithms.</summary>

### Discuss the concept of dominance and epistasis in genetic algorithms.

**Definition:**

</details>

### Application and Problem Solving with Genetic Algorithms

<details>
<summary>How would you apply GAs to solve a traveling salesman problem (TSP)?</summary>

### How would you apply GAs to solve a traveling salesman problem (TSP)?

**Definition:**

</details>

<details>
<summary>Describe an application of GAs in machine learning model optimization.</summary>

### Describe an application of GAs in machine learning model optimization.

**Definition:**

</details>

<details>
<summary>How could you use GAs in feature selection for a predictive model?</summary>

### How could you use GAs in feature selection for a predictive model?

**Definition:**

</details>

<details>
<summary>What are the challenges of using GAs in real-time applications?</summary>

### What are the challenges of using GAs in real-time applications?

**Definition:**

</details>

<details>
<summary>Discuss the use of GAs in evolving neural network architectures.</summary>

### Discuss the use of GAs in evolving neural network architectures.

**Definition:**

</details>

<details>
<summary>Describe how GAs can be used to optimize portfolio allocations in finance.</summary>

### Describe how GAs can be used to optimize portfolio allocations in finance.

**Definition:**

</details>

<details>
<summary>What strategies can be employed to maintain diversity in a GA population?</summary>

### What strategies can be employed to maintain diversity in a GA population?

**Definition:**

</details>

<details>
<summary>How can GAs be used in job scheduling and resource allocation problems?</summary>

### How can GAs be used in job scheduling and resource allocation problems?

**Definition:**

</details>

### Implementation and Practical Considerations

<details>
<summary>What are the common genetic representation schemes used for different problem types?</summary>

### What are the common genetic representation schemes used for different problem types?

**Definition:**

</details>

<details>
<summary>Discuss how to choose an appropriate selection method for a specific GA application.</summary>

### Discuss how to choose an appropriate selection method for a specific GA application.

**Definition:**

</details>

<details>
<summary>How do you determine suitable crossover and mutation rates for a genetic algorithm?</summary>

### How do you determine suitable crossover and mutation rates for a genetic algorithm?

**Definition:**

</details>

<details>
<summary>What are some methods to ensure genetic diversity in a GA population?</summary>

### What are some methods to ensure genetic diversity in a GA population?

**Definition:**

</details>

<details>
<summary>Can you explain how to deal with constraints in genetic algorithms?</summary>

### Can you explain how to deal with constraints in genetic algorithms?

**Definition:**

</details>

<details>
<summary>Describe how a GA might become trapped in a local optimum and how to avoid it.</summary>

### Describe how a GA might become trapped in a local optimum and how to avoid it.

**Definition:**

</details>

<details>
<summary>How should one go about choosing a fitness function for a particular GA application?</summary>

### How should one go about choosing a fitness function for a particular GA application?

**Definition:**

</details>

<details>
<summary>Describe strategies for parallelizing genetic algorithms and the trade-offs involved.</summary>

### Describe strategies for parallelizing genetic algorithms and the trade-offs involved.

**Definition:**

</details>

### Coding Challenges

<details>
<summary>Implement a basic genetic algorithm in Python to solve the problem of maximizing the function f(x) = x^2.</summary>

### Implement a basic genetic algorithm in Python to solve the problem of maximizing the function f(x) = x^2.

**Definition:**

</details>

<details>
<summary>Write a genetic algorithm to evolve a simple string of characters toward a target string.</summary>

### Write a genetic algorithm to evolve a simple string of characters toward a target string.

**Definition:**

</details>

<details>
<summary>Create a mutation function for a GA that operates on real-valued vectors.</summary>

### Create a mutation function for a GA that operates on real-valued vectors.

**Definition:**

</details>

<details>
<summary>Code a crossover function that combines two parent solutions to produce offspring for a bit-string representation.</summary>

### Code a crossover function that combines two parent solutions to produce offspring for a bit-string representation.

**Definition:**

</details>

<details>
<summary>Develop a selection mechanism in Python to select fittest individuals based on the roulette wheel method.</summary>

### Develop a selection mechanism in Python to select fittest individuals based on the roulette wheel method.

**Definition:**

</details>

<details>
<summary>Write a Python function that implements a rank-based selection method for a GA.</summary>

### Write a Python function that implements a rank-based selection method for a GA.

**Definition:**

</details>

<details>
<summary>Implement a GA in Python to solve the problem of finding the minimal-cost path in a graph.</summary>

### Implement a GA in Python to solve the problem of finding the minimal-cost path in a graph.

**Definition:**

</details>

<details>
<summary>Create a simple GA in Python for optimizing the weights of a small neural network.</summary>

### Create a simple GA in Python for optimizing the weights of a small neural network.

**Definition:**

</details>

### Case Studies and Scenario-Based Questions

<details>
<summary>How would you design a GA for optimizing hyperparameters of an SVM classifier?</summary>

### How would you design a GA for optimizing hyperparameters of an SVM classifier?

**Definition:**

</details>

<details>
<summary>Propose a GA approach to create a timetable for a university course schedule.</summary>

### Propose a GA approach to create a timetable for a university course schedule.

**Definition:**

</details>

<details>
<summary>Discuss a scenario where a GA could be used to optimize the layout of a wind farm.</summary>

### Discuss a scenario where a GA could be used to optimize the layout of a wind farm.

**Definition:**

</details>

<details>
<summary>Describe how you would apply a GA to an image recognition problem with many features.</summary>

### Describe how you would apply a GA to an image recognition problem with many features.

**Definition:**

</details>

<details>
<summary>Present a strategy to use GAs for evolving decision rules in a rule-based system.</summary>

### Present a strategy to use GAs for evolving decision rules in a rule-based system.

**Definition:**

</details>

<details>
<summary>Explain how you might use a GA to optimize the parameters of an algorithm trading model.</summary>

### Explain how you might use a GA to optimize the parameters of an algorithm trading model.

**Definition:**

</details>

<details>
<summary>How would you use a genetic algorithm to handle the problem of vehicle routing with time windows?</summary>

### How would you use a genetic algorithm to handle the problem of vehicle routing with time windows?

**Definition:**

</details>

### Advanced Topics and Research

<details>
<summary>Discuss the role of speciation in genetic algorithms and its potential benefits.</summary>

### Discuss the role of speciation in genetic algorithms and its potential benefits.

**Definition:**

</details>

<details>
<summary>How can reinforcement learning be integrated with genetic algorithms?</summary>

### How can reinforcement learning be integrated with genetic algorithms?

**Definition:**

</details>

<details>
<summary>Describe recent advancements in hybrid genetic algorithms combining other AI techniques.</summary>

### Describe recent advancements in hybrid genetic algorithms combining other AI techniques.

**Definition:**

</details>

<details>
<summary>What is the significance of multi-level selection in GAs?</summary>

### What is the significance of multi-level selection in GAs?

**Definition:**

</details>

<details>
<summary>How might quantum computing impact the future of genetic algorithms?</summary>

### How might quantum computing impact the future of genetic algorithms?

**Definition:**

</details>

### General Machine Learning Integration

<details>
<summary>How can GAs assist in feature learning for deep learning models?</summary>

### How can GAs assist in feature learning for deep learning models?

**Definition:**

</details>

<details>
<summary>What are the advantages of using GAs for ensemble model selection?</summary>

### What are the advantages of using GAs for ensemble model selection?

**Definition:**

</details>

### Parameter Tuning and Optimization

<details>
<summary>How can GAs help in tuning the hyperparameters of a deep learning model?</summary>

### How can GAs help in tuning the hyperparameters of a deep learning model?

**Definition:**

</details>

<details>
<summary>Discuss the considerations in balancing exploration and exploitation in GAs.</summary>

### Discuss the considerations in balancing exploration and exploitation in GAs.

**Definition:**

</details>

### Real-world Implementations

<details>
<summary>Share an example where a GA has been successfully implemented in an industrial setting.</summary>

### Share an example where a GA has been successfully implemented in an industrial setting.

**Definition:**

</details>

<details>
<summary>How do you envision GAs influencing the development of autonomous systems?</summary>

### How do you envision GAs influencing the development of autonomous systems?

**Definition:**

</details>

<details>
<summary>What potential does GA have in the area of personalized medicine and treatment optimization?</summary>

### What potential does GA have in the area of personalized medicine and treatment optimization?

**Definition:**

</details>
