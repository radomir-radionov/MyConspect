# Linear Algebra — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./7_special_algorithms.md)

### Related docs

- [Linear Algebra — собеседование](./7_algo_linear_algebra_interview.md)

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

Вектор — упорядоченный список чисел. В машинном обучении так обычно кодируют один пример, один столбец весов или одно направление в пространстве признаков.

**How it works:**

- Длина списка — это размерность. Два вектора складываются только при одинаковой размерности, покомпонентно.
- Вектор признаков может быть `[age, income, clicks]`. Слово или пользователь могут быть эмбеддингом — выученным вектором, направление которого передаёт сходство.
- Веса модели — векторы или столбцы матрицы. Предсказание вроде линейного счёта — скалярное произведение весов и признаков.
- Геометрия остаётся: длина, угол и расстояние между векторами — так поиск ближайших соседей и косинус сравнивают объекты.

**Examples:**

Два покупателя `[1, 0]` и `[0.9, 0.1]` сидят рядом на двумерной плоскости признаков. Третий `[0, 1]` смотрит в другую сторону, поэтому поиск соседа вернёт первую пару.
</details>

<details>
<summary>Explain the difference between a scalar and a vector.</summary>

### Explain the difference between a scalar and a vector.

**Definition:**

Скаляр — одно число. Вектор — упорядоченный набор чисел. В машинном обучении у него обычно размерность больше единицы, или это хотя бы массив с одной осью.

**How it works:**

- У скаляра есть только величина. У вектора есть величина и, когда базис фиксирован, направление.
- Прибавить скаляр к вектору — не операция векторного пространства. Broadcasting в коде повторяет скаляр по компонентам, и это другая договорённость.
- Матрица 1×1 хранит один скаляр. Вектор длины 1 в библиотеках, которые следят за рангом, всё ещё одномерный массив, а не голое число.
- Функции потерь и скорости обучения — скаляры. Параметры и активации слоя — векторы или массивы более высокого ранга.

**Examples:**

`3` — скаляр. `[3, 0, -1]` — вектор. Умножение этого вектора на скаляр `2` даёт `[6, 0, -2]`.
</details>

<details>
<summary>What is a matrix and why is it central to linear algebra?</summary>

### What is a matrix and why is it central to linear algebra?

**Definition:**

Матрица — прямоугольная таблица чисел. Она задаёт линейное отображение, пакет векторов или таблицу данных.

**How it works:**

- Форма `m × n` — это m строк и n столбцов. Применение матрицы к вектору длины n даёт вектор длины m.
- В наборе данных одна строка часто — один пример, один столбец — один признак. Веса линейного слоя — матрица.
- Умножение матриц складывает два линейных отображения. Поэтому стопка слоёв — произведение матриц весов плюс нелинейности между ними.
- Особые формы — квадратная, диагональная, треугольная, симметричная — делают обращение, решение систем и собственные значения дешевле или вообще возможными.

**Examples:**

Матрица 2×3 на вектор признаков длины 3 даёт двумерный счёт. Два выхода могут быть логитами «спам» и «не спам» до softmax.
</details>

<details>
<summary>Explain the concept of a tensor in the context of machine learning.</summary>

### Explain the concept of a tensor in the context of machine learning.

**Definition:**

В машинном обучении тензор — массив с любым числом осей. Скаляр — ранг 0, вектор — ранг 1, матрица — ранг 2, пакет картинок — выше.

**How it works:**

- Ранг — это число осей, не то же слово, что ранг матрицы. Форма перечисляет размер каждой оси.
- Цветная картинка часто имеет ранг 3: высота, ширина, каналы. Мини-пакет картинок — ранг 4: пакет, высота, ширина, каналы.
- Фреймворки хранят тензор в одном непрерывном буфере и применяют broadcasting, когда формы отличаются осями размера 1.
- Операции линейной алгебры по-прежнему действуют на двух осях: пакетное умножение матриц схлопывает одну пару размерностей и оставляет оси пакета.

**Examples:**

Одно RGB-фото 32×32 имеет форму `(32, 32, 3)`. Шаг обучения на 64 фото — форма `(64, 32, 32, 3)`.
</details>

<details>
<summary>How do you perform matrix addition and subtraction?</summary>

### How do you perform matrix addition and subtraction?

**Definition:**

Сложение и вычитание идут по элементам. У обеих матриц должна быть одна и та же форма.

**How it works:**

- Элемент строки i и столбца j суммы — сумма этих двух элементов. Вычитание — то же с минусом.
- Операции коммутативны и ассоциативны. Прибавление нулевой матрицы ничего не меняет.
- Несовпадение формы в линейной алгебре не определено. Код, который как будто прибавляет вектор-строку, делает broadcasting, а не сложение матриц.
- Стоимость пропорциональна числу элементов, O(mn) для матрицы m×n.

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

Умножение матриц сочетает строки левой матрицы со столбцами правой. Внутренние размеры должны совпасть, и порядок важен.

**How it works:**

- Матрица `m × n` на матрицу `n × p` даёт `m × p`. Совпадающее n — схлопываемая размерность.
- Операция ассоциативна и дистрибутивна относительно сложения. Она не коммутативна: `AB` и `BA` могут различаться, или одно из них не определено.
- Умножение на единичную матрицу оставляет матрицу как есть. Нулевая или зависимая строка может сделать произведение вырожденным.
- Наивный алгоритм — O(mnp). Реализации используют блочные ядра, удобные для кэша; алгебраические свойства те же.

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

Транспонирование `Aᵀ` меняет строки и столбцы местами. Элемент, который был в строке i и столбце j, переезжает в строку j и столбец i.

**How it works:**

- Матрица `m × n` становится `n × m`. Двойное транспонирование возвращает исходную.
- `(A + B)ᵀ = Aᵀ + Bᵀ` и `(AB)ᵀ = Bᵀ Aᵀ`. Порядок произведения переворачивается.
- Симметричная матрица равна своему транспонированию. Вещественная ортогональная матрица удовлетворяет `Qᵀ Q = I`.
- В раскладке данных транспонирование — ещё и смена шага. Column-major и row-major не совпадают, пока одну сторону не транспонируют.

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

Скалярное произведение двух векторов одной длины — сумма покомпонентных произведений. Оно измеряет, насколько они смотрят в одну сторону.

**How it works:**

- `a · b = Σ aᵢ bᵢ = ‖a‖ ‖b‖ cos θ`. Положительное значение — острый угол, ноль — прямой, отрицательное — тупой.
- Счёт линейной модели — `w · x + b`. Веса внимания используют масштабированные скалярные произведения запроса и ключа.
- Косинусное сходство делит скалярное произведение на две длины, чтобы величина не доминировала.
- Стоимость — O(d) по размерности. Пакет таких произведений — умножение матриц.

**Examples:**

`[1, 0] · [1, 0] = 1` и `[1, 0] · [0, 1] = 0`. Первая пара совпадает; вторая ортогональна.
</details>

<details>
<summary>What is the cross product of vectors and when is it used?</summary>

### What is the cross product of vectors and when is it used?

**Definition:**

Векторное произведение двух векторов в трёх измерениях — третий вектор, перпендикулярный обоим. Его длина равна площади параллелограмма, который они натягивают.

**How it works:**

- `a × b` ортогонален `a` и `b`. Направление задаёт правило правой руки. `a × b = −(b × a)`.
- Модуль равен `‖a‖ ‖b‖ sin θ`. У параллельных векторов векторное произведение нулевое.
- Это операция в 3D. В 2D аналог — скаляр `aₓ bᵧ − aᵧ bₓ`, площадь со знаком.
- Графика использует его для нормалей граней и освещения. Физика — для момента силы. Обычным табличным признакам машинного обучения он не нужен.

**Examples:**

`[1, 0, 0] × [0, 1, 0] = [0, 0, 1]`. Результат — ось z, площадь параллелограмма равна 1.
</details>

<details>
<summary>How do you calculate the norm of a vector and what does it represent?</summary>

### How do you calculate the norm of a vector and what does it represent?

**Definition:**

Норма назначает вектору длину. Обычная евклидова норма — квадратный корень из суммы квадратов.

**How it works:**

- L2: `‖x‖₂ = sqrt(Σ xᵢ²)`. L1: `‖x‖₁ = Σ |xᵢ|`. L∞: наибольшая абсолютная компонента.
- Норма равна нулю только у нулевого вектора, масштабируется на `|c|` при умножении вектора на `c` и подчиняется неравенству треугольника.
- Деление ненулевого вектора на его L2-норму даёт единичный вектор. Косинусное сходство — скалярное произведение двух единичных векторов.
- L2-штраф при обучении уменьшает большие веса. L1-штраф доводит часть весов ровно до нуля.

**Examples:**

У `[3, 4]` L2-норма равна 5, L1-норма равна 7. Единичный вектор в этом направлении — `[0.6, 0.8]`.
</details>

<details>
<summary>Define the concept of orthogonality in linear algebra.</summary>

### Define the concept of orthogonality in linear algebra.

**Definition:**

Два вектора ортогональны, когда их скалярное произведение равно нулю. В евклидовом скалярном произведении они встречаются под прямым углом.

**How it works:**

- Набор ортогонален, когда у каждой различной пары скалярное произведение нулевое. Он ортонормирован, когда каждый вектор ещё и имеет длину 1.
- Ортогональные столбцы не делят компоненту, поэтому проекции на них можно считать отдельно и потом сложить.
- У ортогональной матрицы ортонормированные столбцы, и транспонирование совпадает с обращением. Она сохраняет длины и углы.
- В моделях ортогональная инициализация и ограничения не дают направлениям схлопнуться друг в друга.

**Examples:**

`[1, 0]` и `[0, 2]` ортогональны, потому что скалярное произведение равно 0. Ортонормированными они станут, когда второй вектор масштабируют до `[0, 1]`.
</details>

<details>
<summary>What is the determinant of a matrix and what information does it provide?</summary>

### What is the determinant of a matrix and what information does it provide?

**Definition:**

Определитель — скаляр, посчитанный по квадратной матрице. Это коэффициент со знаком, на который линейное отображение умножает площадь или объём.

**How it works:**

- Нулевой определитель значит, что матрица вырождена: столбцы зависимы, отображение сплющивает пространство, обратной матрицы нет.
- Отрицательный определитель меняет ориентацию. Обмен двух строк меняет знак. Умножение строки на `c` умножает определитель на `c`.
- `det(AB) = det(A) det(B)` и `det(Aᵀ) = det(A)`.
- Для матрицы 2×2 `[[a, b], [c, d]]` значение равно `ad − bc`. Большие матрицы раскладывают по строке или считают через разложение.

**Examples:**

У `[[2, 0], [0, 3]]` определитель 6: площади растут в 6 раз. У `[[1, 2], [2, 4]]` определитель 0: вторая строка вдвое больше первой, и отображение схлопывает плоскость в прямую.
</details>

<details>
<summary>Can you explain what an eigenvector and eigenvalue are?</summary>

### Can you explain what an eigenvector and eigenvalue are?

**Definition:**

Собственный вектор квадратной матрицы — ненулевой вектор, который матрица только растягивает или переворачивает. Собственное значение — этот коэффициент.

**How it works:**

- `A v = λ v`. Направление `v` остаётся на той же прямой. `λ` может быть отрицательным, тогда направление меняется на противоположное, или комплексным у вещественной матрицы, которая вращает.
- Собственные векторы разных собственных значений независимы. У симметричной вещественной матрицы вещественные собственные значения и ортогональные собственные векторы.
- PCA берёт собственные векторы ковариационной матрицы. Наибольшие собственные значения — направления, где данные разбросаны сильнее всего.
- В линейной динамической системе `|λ| > 1` растит эту моду, а `|λ| < 1` её сжимает.

**Examples:**

`[[2, 0], [0, 3]]` переводит `[1, 0]` в `[2, 0]`, собственное значение 2. Она переводит `[0, 1]` в `[0, 3]`, собственное значение 3.
</details>

<details>
<summary>How is the trace of a matrix defined and what is its relevance?</summary>

### How is the trace of a matrix defined and what is its relevance?

**Definition:**

След — сумма диагональных элементов квадратной матрицы. Он равен сумме собственных значений с учётом кратности.

**How it works:**

- `tr(A) = a₁₁ + a₂₂ + … + aₙₙ`.
- `tr(A + B) = tr(A) + tr(B)` и `tr(cA) = c tr(A)`. `tr(AB) = tr(BA)`, когда оба произведения существуют, даже если `A` и `B` не квадратные одной формы.
- След не меняется при смене базиса: `tr(P⁻¹ A P) = tr(A)`.
- Для ковариации или проекции след — полная дисперсия или число измерений, которое не зависит от поворота осей.

**Examples:**

У `[[2, 9], [0, 3]]` след `2 + 3 = 5`, как сумма собственных значений 2 и 3. Внедиагональная 9 в след не входит.
</details>

### Special Matrices and Their Properties

<details>
<summary>What is a diagonal matrix and how is it used in linear algebra?</summary>

### What is a diagonal matrix and how is it used in linear algebra?

**Definition:**

Диагональная матрица квадратная, и все элементы вне главной диагонали равны нулю. Умножение на неё масштабирует каждую ось и не смешивает их.

**How it works:**

- Произведение диагональной матрицы и вектора умножает компоненту i на диагональный элемент i. Две диагональные матрицы коммутируют, и их произведение диагонально.
- Обратная, когда каждый диагональный элемент ненулевой, — диагональ из обратных величин. Ноль на диагонали делает матрицу вырожденной.
- Спектральное разложение записывает диагонализуемую матрицу как `Q D Q⁻¹`, где в `D` стоят собственные значения. Степени матрицы становятся степенями этих диагональных элементов.
- В оптимизации и отбеливании диагональная матрица — дешёвый способ масштабировать признаки независимо.

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
