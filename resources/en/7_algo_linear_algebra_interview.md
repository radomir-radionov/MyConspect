# Linear Algebra — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_algorithms.md)

### Related docs

- [Linear Algebra — Interview](./7_algo_linear_algebra_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Linear Algebra](https://devinterview.io/questions/machine-learning-and-data-science/linear-algebra-interview-questions/).

### Linear Algebra Fundamentals

<details>
<summary>What is a vector and how is it used in machine learning?</summary>

### What is a vector and how is it used in machine learning?

**Definition:**

A vector is an ordered list of numbers. In machine learning it is the usual encoding of one example, one weight column, or one direction in feature space.

**How it works:**

- The length of the list is the dimension. Two vectors add only when they have the same dimension, component by component.
- A feature vector might be `[age, income, clicks]`. A word or a user can be an embedding, which is a learned vector whose direction captures similarity.
- Model weights are vectors (or columns of a matrix). A prediction such as a linear score is a dot product of weights and features.
- Geometry still applies: length, angle, and distance between vectors are how nearest-neighbor and cosine search compare items.

**Examples:**

Two shoppers `[1, 0]` and `[0.9, 0.1]` sit near each other in a 2-d feature plane. A third shopper `[0, 1]` points elsewhere, so a nearest-neighbor lookup returns the first pair.
</details>

<details>
<summary>Explain the difference between a scalar and a vector.</summary>

### Explain the difference between a scalar and a vector.

**Definition:**

A scalar is a single number. A vector is an ordered collection of numbers with a dimension greater than one in the usual machine-learning usage, or at least a one-axis array.

**How it works:**

- Scalars have magnitude only. Vectors have magnitude and, once a basis is fixed, a direction.
- Adding a scalar to a vector is not a vector-space operation; broadcasting in code repeats the scalar across components, which is a different convention.
- A 1×1 matrix holds one scalar. A vector of length 1 is still a one-dimensional array, not a bare number, in libraries that track rank.
- Losses and learning rates are scalars. Parameters and activations of a layer are vectors or higher-rank arrays.

**Examples:**

`3` is a scalar. `[3, 0, -1]` is a vector. Scaling that vector by the scalar `2` yields `[6, 0, -2]`.
</details>

<details>
<summary>What is a matrix and why is it central to linear algebra?</summary>

### What is a matrix and why is it central to linear algebra?

**Definition:**

A matrix is a rectangular table of numbers. It represents a linear map, a batch of vectors, or a table of data.

**How it works:**

- Shape `m × n` means m rows and n columns. Applying the matrix to a vector of length n produces a vector of length m.
- In a dataset, one row is often one example and one column one feature. Weights of a linear layer are a matrix.
- Matrix multiplication composes two linear maps. That is why a stack of layers is a product of weight matrices plus nonlinearities between them.
- Special shapes — square, diagonal, triangular, symmetric — make inversion, solving, and eigenvalues cheaper or even possible.

**Examples:**

A 2×3 matrix times a feature vector of length 3 is a 2-d score. Two outputs can be 'spam' and 'not spam' logits before a softmax.
</details>

<details>
<summary>Explain the concept of a tensor in the context of machine learning.</summary>

### Explain the concept of a tensor in the context of machine learning.

**Definition:**

In machine learning a tensor is an array with any number of axes. A scalar is rank 0, a vector rank 1, a matrix rank 2, and an image batch is higher.

**How it works:**

- Rank is the number of axes, not the same word as matrix rank. Shape lists the size of each axis.
- A color image is often rank 3: height, width, channels. A minibatch of images is rank 4: batch, height, width, channels.
- Frameworks store tensors in one contiguous buffer and apply broadcasting rules when shapes differ by size-1 axes.
- The linear-algebra operations still apply on two of the axes: a batched matmul contracts one pair of dimensions and leaves the batch axes alone.

**Examples:**

One RGB photo of 32×32 is shape `(32, 32, 3)`. A training step on 64 photos is shape `(64, 32, 32, 3)`.
</details>

<details>
<summary>How do you perform matrix addition and subtraction?</summary>

### How do you perform matrix addition and subtraction?

**Definition:**

Addition and subtraction are element by element. Both matrices must have the same shape.

**How it works:**

- The entry in row i, column j of the sum is the sum of those two entries. Subtraction is the same with a minus.
- The operations are commutative and associative. Adding a zero matrix changes nothing.
- A shape mismatch is undefined in linear algebra. Code that appears to add a row vector is broadcasting, not matrix addition.
- Cost is proportional to the number of entries, O(mn) for an m×n matrix.

**Examples:**

```text
[1 2] + [5 6] = [6  8]
[3 4]   [7 8]   [10 12]
```
</details>

<details>
<summary>What are the properties of matrix multiplication?</summary>

### What are the properties of matrix multiplication?

**Definition:**

Matrix multiplication combines rows of the left matrix with columns of the right. The inner dimensions must match, and the order matters.

**How it works:**

- An `m × n` matrix times an `n × p` matrix is `m × p`. The n's are the contracted dimension.
- It is associative and distributive over addition. It is not commutative: `AB` and `BA` can differ or one of them can be undefined.
- Multiplying by the identity leaves a matrix unchanged. A zero row or a dependent row can make the product singular even when factors look harmless.
- The naive algorithm is O(mnp). Implementations use blocked, cache-friendly kernels; the algebraic properties stay the same.

**Examples:**

```text
[1 2] [5 6] = [1*5+2*7  1*6+2*8] = [19 22]
[3 4] [7 8]   [3*5+4*7  3*6+4*8]   [43 50]
```
</details>

<details>
<summary>Define the transpose of a matrix.</summary>

### Define the transpose of a matrix.

**Definition:**

The transpose `Aᵀ` swaps rows and columns. The entry that was in row i, column j moves to row j, column i.

**How it works:**

- An `m × n` matrix becomes `n × m`. Transposing twice returns the original.
- `(A + B)ᵀ = Aᵀ + Bᵀ` and `(AB)ᵀ = Bᵀ Aᵀ`. The order of a product reverses.
- A symmetric matrix equals its transpose. A real orthogonal matrix satisfies `Qᵀ Q = I`.
- In data layouts, transpose is also a stride change. A column-major store and a row-major store disagree until one side is transposed.

**Examples:**

```text
[1 2 3]ᵀ = [1 4]
[4 5 6]     [2 5]
            [3 6]
```
</details>

### Vector and Matrix Operations

<details>
<summary>Explain the dot product of two vectors and its significance in machine learning.</summary>

### Explain the dot product of two vectors and its significance in machine learning.

**Definition:**

The dot product of two equal-length vectors is the sum of component-wise products. It measures how much they point the same way.

**How it works:**

- `a · b = Σ aᵢ bᵢ = ‖a‖ ‖b‖ cos θ`. A positive value is an acute angle, zero is a right angle, negative is obtuse.
- A linear model score is `w · x + b`. Attention weights use scaled dot products between query and key vectors.
- Cosine similarity divides the dot product by the two lengths, so magnitude does not dominate.
- Cost is O(d) in the dimension. A batch of them is a matrix product.

**Examples:**

`[1, 0] · [1, 0] = 1` and `[1, 0] · [0, 1] = 0`. The first pair matches; the second is orthogonal.
</details>

<details>
<summary>What is the cross product of vectors and when is it used?</summary>

### What is the cross product of vectors and when is it used?

**Definition:**

The cross product of two vectors in three dimensions is a third vector perpendicular to both. Its length equals the area of the parallelogram they span.

**How it works:**

- `a × b` is orthogonal to `a` and to `b`. The direction follows the right-hand rule. `a × b = −(b × a)`.
- The magnitude is `‖a‖ ‖b‖ sin θ`. Parallel vectors have cross product zero.
- It is a 3-d operation. In 2-d the analogous quantity is the scalar `aₓ bᵧ − aᵧ bₓ`, the signed area.
- Graphics uses it for face normals and lighting. Physics uses it for torque. Typical tabular machine-learning features do not.

**Examples:**

`[1, 0, 0] × [0, 1, 0] = [0, 0, 1]`. The result is the z-axis, and the parallelogram has area 1.
</details>

<details>
<summary>How do you calculate the norm of a vector and what does it represent?</summary>

### How do you calculate the norm of a vector and what does it represent?

**Definition:**

A norm assigns a length to a vector. The usual Euclidean norm is the square root of the sum of squares.

**How it works:**

- L2: `‖x‖₂ = sqrt(Σ xᵢ²)`. L1: `‖x‖₁ = Σ |xᵢ|`. L∞: the largest absolute component.
- A norm is zero only for the zero vector, scales with `|c|` when the vector is multiplied by `c`, and obeys the triangle inequality.
- Dividing a non-zero vector by its L2 norm produces a unit vector. Cosine similarity is the dot product of two unit vectors.
- L2 penalties in training shrink large weights. L1 penalties drive some weights to exactly zero.

**Examples:**

`[3, 4]` has L2 norm 5 and L1 norm 7. The unit vector in that direction is `[0.6, 0.8]`.
</details>

<details>
<summary>Define the concept of orthogonality in linear algebra.</summary>

### Define the concept of orthogonality in linear algebra.

**Definition:**

Two vectors are orthogonal when their dot product is zero. They meet at a right angle in the Euclidean inner product.

**How it works:**

- A set is orthogonal when every distinct pair has dot product zero. It is orthonormal when each vector also has length 1.
- Orthogonal columns do not share a component, so projections onto them can be computed separately and then added.
- An orthogonal matrix has orthonormal columns, and its transpose is its inverse. It preserves lengths and angles.
- In models, orthogonal initializations and constraints keep directions from collapsing into one another.

**Examples:**

`[1, 0]` and `[0, 2]` are orthogonal because the dot product is 0. They are not orthonormal until the second vector is scaled to `[0, 1]`.
</details>

<details>
<summary>What is the determinant of a matrix and what information does it provide?</summary>

### What is the determinant of a matrix and what information does it provide?

**Definition:**

The determinant is a scalar computed from a square matrix. It is the signed factor by which the linear map scales area or volume.

**How it works:**

- A determinant of zero means the matrix is singular: columns are dependent, the map squashes space, and no inverse exists.
- A negative determinant reverses orientation. Swapping two rows flips the sign. Scaling a row by `c` scales the determinant by `c`.
- `det(AB) = det(A) det(B)` and `det(Aᵀ) = det(A)`.
- For a 2×2 matrix `[[a, b], [c, d]]` the value is `ad − bc`. Larger matrices expand along a row or use a factorization.

**Examples:**

`[[2, 0], [0, 3]]` has determinant 6: areas grow by 6. `[[1, 2], [2, 4]]` has determinant 0: the second row is twice the first, and the map collapses the plane to a line.
</details>

<details>
<summary>Can you explain what an eigenvector and eigenvalue are?</summary>

### Can you explain what an eigenvector and eigenvalue are?

**Definition:**

An eigenvector of a square matrix is a non-zero vector that the matrix only stretches or flips. The eigenvalue is that scale factor.

**How it works:**

- `A v = λ v`. The direction of `v` stays on the same line. `λ` can be negative, which reverses the direction, or complex for a real matrix that rotates.
- Eigenvectors for distinct eigenvalues are independent. A symmetric real matrix has real eigenvalues and orthogonal eigenvectors.
- PCA takes the eigenvectors of the covariance matrix. The largest eigenvalues are the directions where the data spreads the most.
- In a linear dynamical system, `|λ| > 1` grows that mode and `|λ| < 1` shrinks it.

**Examples:**

`[[2, 0], [0, 3]]` sends `[1, 0]` to `[2, 0]`, so the eigenvalue is 2. It sends `[0, 1]` to `[0, 3]`, so the eigenvalue is 3.
</details>

<details>
<summary>How is the trace of a matrix defined and what is its relevance?</summary>

### How is the trace of a matrix defined and what is its relevance?

**Definition:**

The trace is the sum of the diagonal entries of a square matrix. It equals the sum of the eigenvalues, counted with multiplicity.

**How it works:**

- `tr(A) = a₁₁ + a₂₂ + … + aₙₙ`.
- `tr(A + B) = tr(A) + tr(B)` and `tr(cA) = c tr(A)`. `tr(AB) = tr(BA)` when both products exist, even if `A` and `B` are not square of the same shape.
- The trace is invariant under a change of basis: `tr(P⁻¹ A P) = tr(A)`.
- For a covariance or a projection, the trace is a total variance or a dimension count that does not depend on rotating the axes.

**Examples:**

`[[2, 9], [0, 3]]` has trace `2 + 3 = 5`, the same as the sum of eigenvalues 2 and 3. The off-diagonal 9 does not enter the trace.
</details>

### Special Matrices and Their Properties

<details>
<summary>What is a diagonal matrix and how is it used in linear algebra?</summary>

### What is a diagonal matrix and how is it used in linear algebra?

**Definition:**

A diagonal matrix is square and every entry off the main diagonal is zero. Multiplying by it scales each axis and does not mix them.

**How it works:**

- The product of a diagonal matrix and a vector multiplies component i by diagonal entry i. Two diagonal matrices commute, and their product is diagonal.
- The inverse, when every diagonal entry is non-zero, is the diagonal of reciprocals. A zero on the diagonal makes the matrix singular.
- An eigendecomposition writes a diagonalizable matrix as `Q D Q⁻¹`, where `D` holds the eigenvalues. Powers of the matrix become powers of those diagonal entries.
- In optimization and whitening, a diagonal matrix is a cheap way to scale features independently.

**Examples:**

```text
[2 0] [x] = [2x]
[0 3] [y]   [3y]
```
</details>

<details>
<summary>Explain the properties of an identity matrix.</summary>

### Explain the properties of an identity matrix.

**Definition:**

</details>

<details>
<summary>Define what a symmetric matrix is.</summary>

### Define what a symmetric matrix is.

**Definition:**

</details>

<details>
<summary>What is a unit vector and how do you find it?</summary>

### What is a unit vector and how do you find it?

**Definition:**

</details>

<details>
<summary>Explain the concept of an orthogonal matrix.</summary>

### Explain the concept of an orthogonal matrix.

**Definition:**

</details>

<details>
<summary>Define positive definiteness of a matrix.</summary>

### Define positive definiteness of a matrix.

**Definition:**

</details>

<details>
<summary>What is the rank of a matrix and why is it important?</summary>

### What is the rank of a matrix and why is it important?

**Definition:**

</details>

### Systems of Linear Equations

<details>
<summary>How do you represent a system of linear equations using matrices?</summary>

### How do you represent a system of linear equations using matrices?

**Definition:**

</details>

<details>
<summary>What is the method of Gaussian elimination?</summary>

### What is the method of Gaussian elimination?

**Definition:**

</details>

<details>
<summary>Explain the concept of linear dependence and independence.</summary>

### Explain the concept of linear dependence and independence.

**Definition:**

</details>

<details>
<summary>What is the meaning of the solution space of a system of linear equations?</summary>

### What is the meaning of the solution space of a system of linear equations?

**Definition:**

</details>

<details>
<summary>Describe the conditions for consistency in linear equations.</summary>

### Describe the conditions for consistency in linear equations.

**Definition:**

</details>

<details>
<summary>Define and differentiate between homogenous and non-homogenous systems.</summary>

### Define and differentiate between homogenous and non-homogenous systems.

**Definition:**

</details>

### Advanced Matrix Operations

<details>
<summary>How do you compute the inverse of a matrix and when is it possible?</summary>

### How do you compute the inverse of a matrix and when is it possible?

**Definition:**

</details>

<details>
<summary>Explain the LU decomposition of a matrix.</summary>

### Explain the LU decomposition of a matrix.

**Definition:**

</details>

<details>
<summary>What are singular or ill-conditioned matrices?</summary>

### What are singular or ill-conditioned matrices?

**Definition:**

</details>

<details>
<summary>How do you perform QR decomposition?</summary>

### How do you perform QR decomposition?

**Definition:**

</details>

<details>
<summary>What is the Singular Value Decomposition (SVD) and its applications in machine learning?</summary>

### What is the Singular Value Decomposition (SVD) and its applications in machine learning?

**Definition:**

</details>

<details>
<summary>Explain the concept of matrix factorization.</summary>

### Explain the concept of matrix factorization.

**Definition:**

</details>

### Linear Transformations and Mapping

<details>
<summary>What is a linear transformation in linear algebra?</summary>

### What is a linear transformation in linear algebra?

**Definition:**

</details>

<details>
<summary>How can you represent linear transformation using a matrix?</summary>

### How can you represent linear transformation using a matrix?

**Definition:**

</details>

<details>
<summary>Describe the kernel and image of a linear transformation.</summary>

### Describe the kernel and image of a linear transformation.

**Definition:**

</details>

<details>
<summary>How does change of basis affect matrix representation of linear transformations?</summary>

### How does change of basis affect matrix representation of linear transformations?

**Definition:**

</details>

### Coding Challenges

<details>
<summary>Write code to add, subtract, and multiply two matrices without using external libraries.</summary>

### Write code to add, subtract, and multiply two matrices without using external libraries.

**Definition:**

</details>

<details>
<summary>Implement a function to calculate the transpose of a given matrix.</summary>

### Implement a function to calculate the transpose of a given matrix.

**Definition:**

</details>

<details>
<summary>Code to find the determinant of a matrix using recursion.</summary>

### Code to find the determinant of a matrix using recursion.

**Definition:**

</details>

<details>
<summary>Develop a Python function to compute the inverse of a matrix.</summary>

### Develop a Python function to compute the inverse of a matrix.

**Definition:**

</details>

<details>
<summary>Write an algorithm to perform eigenvalue and eigenvector decomposition.</summary>

### Write an algorithm to perform eigenvalue and eigenvector decomposition.

**Definition:**

</details>

<details>
<summary>Create a Python script to solve a system of linear equations using NumPy.</summary>

### Create a Python script to solve a system of linear equations using NumPy.

**Definition:**

</details>

<details>
<summary>Implement a function to calculate the L2 norm of a vector.</summary>

### Implement a function to calculate the L2 norm of a vector.

**Definition:**

</details>

<details>
<summary>Write a program to verify if a given square matrix is orthogonal.</summary>

### Write a program to verify if a given square matrix is orthogonal.

**Definition:**

</details>

### Applications of Linear Algebra in Machine Learning

<details>
<summary>How is linear regression related to linear algebra?</summary>

### How is linear regression related to linear algebra?

**Definition:**

</details>

<details>
<summary>Describe the role of linear algebra in neural network computations.</summary>

### Describe the role of linear algebra in neural network computations.

**Definition:**

</details>

<details>
<summary>How do eigenvalues and eigenvectors apply to Principal Component Analysis (PCA)?</summary>

### How do eigenvalues and eigenvectors apply to Principal Component Analysis (PCA)?

**Definition:**

</details>

<details>
<summary>Explain how the SVD is used in recommendation systems.</summary>

### Explain how the SVD is used in recommendation systems.

**Definition:**

</details>

<details>
<summary>Discuss the importance of linear algebra in optimization problems, such as gradient descent.</summary>

### Discuss the importance of linear algebra in optimization problems, such as gradient descent.

**Definition:**

</details>

### Practical Implementation and Problem Solving

<details>
<summary>How would you handle large-scale matrix operations efficiently in terms of memory and computation?</summary>

### How would you handle large-scale matrix operations efficiently in terms of memory and computation?

**Definition:**

</details>

<details>
<summary>Explain how you would preprocess data to be used in linear algebra computations.</summary>

### Explain how you would preprocess data to be used in linear algebra computations.

**Definition:**

</details>

<details>
<summary>Describe ways to find the rank of a matrix effectively.</summary>

### Describe ways to find the rank of a matrix effectively.

**Definition:**

</details>

<details>
<summary>What would you consider when choosing a library for linear algebra operations?</summary>

### What would you consider when choosing a library for linear algebra operations?

**Definition:**

</details>

<details>
<summary>How do you ensure numerical stability when performing matrix computations?</summary>

### How do you ensure numerical stability when performing matrix computations?

**Definition:**

</details>

### Real-world Scenarios and Data Handling

<details>
<summary>Propose a method for dimensionality reduction using linear algebra techniques.</summary>

### Propose a method for dimensionality reduction using linear algebra techniques.

**Definition:**

</details>

<details>
<summary>Explain how you would use linear algebra to clean and preprocess a dataset.</summary>

### Explain how you would use linear algebra to clean and preprocess a dataset.

**Definition:**

</details>

<details>
<summary>Describe a scenario where linear algebra could be used to improve model accuracy.</summary>

### Describe a scenario where linear algebra could be used to improve model accuracy.

**Definition:**

</details>

<details>
<summary>How would you use matrices to model relational data in databases?</summary>

### How would you use matrices to model relational data in databases?

**Definition:**

</details>

<details>
<summary>Discuss how to apply linear algebra to image processing tasks.</summary>

### Discuss how to apply linear algebra to image processing tasks.

**Definition:**

</details>

### Advanced Topics and Research

<details>
<summary>What are sparse matrices and how are they efficiently represented and used?</summary>

### What are sparse matrices and how are they efficiently represented and used?

**Definition:**

</details>

<details>
<summary>Discuss the role of linear algebra in deep learning, specifically in training convolutional neural networks.</summary>

### Discuss the role of linear algebra in deep learning, specifically in training convolutional neural networks.

**Definition:**

</details>

<details>
<summary>Explain how tensor operations are vital in algorithms working with higher-dimensional data.</summary>

### Explain how tensor operations are vital in algorithms working with higher-dimensional data.

**Definition:**

</details>

<details>
<summary>What is the role of linear algebra in time series analysis?</summary>

### What is the role of linear algebra in time series analysis?

**Definition:**

</details>

<details>
<summary>How do graph theory and linear algebra intersect in machine learning?</summary>

### How do graph theory and linear algebra intersect in machine learning?

**Definition:**

</details>

### Case Studies and Scenario-Based Challenges

<details>
<summary>Given a dataset, determine if PCA would be beneficial and justify your approach.</summary>

### Given a dataset, determine if PCA would be beneficial and justify your approach.

**Definition:**

</details>

<details>
<summary>How would you implement a linear algebra-based algorithm to classify text documents?</summary>

### How would you implement a linear algebra-based algorithm to classify text documents?

**Definition:**

</details>

<details>
<summary>Design a linear algebra solution for a collaborative filtering problem in a movie recommendation system.</summary>

### Design a linear algebra solution for a collaborative filtering problem in a movie recommendation system.

**Definition:**

</details>

<details>
<summary>Propose strategies to visualize high-dimensional data using linear algebra techniques.</summary>

### Propose strategies to visualize high-dimensional data using linear algebra techniques.

**Definition:**

</details>

<details>
<summary>Discuss an approach for optimizing memory usage in matrix computations for a large-scale machine learning application.</summary>

### Discuss an approach for optimizing memory usage in matrix computations for a large-scale machine learning application.

**Definition:**

</details>
