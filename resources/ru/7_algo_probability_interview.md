# Probability — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./7_special_algorithms.md)

### Related docs

- [Probability — собеседование](./7_algo_probability_interview.md)

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

Вероятность назначает число от 0 до 1 тому, насколько вероятен исход. Машинное обучение использует эти числа как предсказания, как цели обучения и как способ сказать о неопределённости.

**How it works:**

- Модель вроде логистической регрессии выдаёт `P(y = 1 | x)`. Языковая модель выдаёт распределение следующего токена.
- Обучение часто минимизирует потерю, равную минус логарифму вероятности наблюдаемой метки.
- Правило Байеса обновляет убеждение о параметрах после данных. Многие регуляризаторы — это априорные распределения, записанные как штрафы.
- Важна калибровка: предсказанные 0.8 должны оказываться верными примерно в 80% случаев, а не только стоять выше 0.2.
</details>

<details>
<summary>Define the terms sample space and event in probability.</summary>

### Define the terms sample space and event in probability.

**Definition:**

Пространство элементарных исходов — множество всех исходов, которые эксперимент может дать. Событие — подмножество этого пространства, исходы, которые вы решили объединить.

**How it works:**

- Вероятностная мера назначает каждому событию число от 0 до 1. Всё пространство имеет вероятность 1. Пустое событие имеет вероятность 0.
- Дополнение события — остаток пространства. `P(не A) = 1 − P(A)`, когда пространство исчерпывающее.
- События соединяются объединением (A или B) и пересечением (A и B).
- Исходы — атомы. События — то, на что ссылаются высказывания вроде «кость выпала чётной».

**Examples:**

У одной честной кости пространство `{1, 2, 3, 4, 5, 6}`. Событие «чёт» — `{2, 4, 6}`, вероятность 1/2.
</details>

<details>
<summary>What is the difference between discrete and continuous probability distributions?</summary>

### What is the difference between discrete and continuous probability distributions?

**Definition:**

Дискретное распределение кладёт вероятность на счётное множество значений. Непрерывное размазывает вероятность по интервалу, так что у любой отдельной точки вероятность ноль.

**How it works:**

- Дискретное: функция массы `P(X = x)` суммируется в 1 по значениям. Примеры — Бернулли, биномиальное и Пуассон.
- Непрерывное: плотность интегрируется в 1. Вероятность интервала — площадь под кривой, не высота в точке. Примеры — гауссово и экспоненциальное.
- Плотность может быть больше 1. Сама по себе она не вероятность.
- Смешанные данные выглядят как счётчики (дискретные) и измерения (непрерывные). Семейство модели должно этому соответствовать.

**Examples:**

Монета дискретна: `P(орёл) = 0.5`. Время выполнения в секундах непрерывно: `P(время = 1.5000…) = 0`, тогда как `P(1 ≤ время ≤ 2)` может быть 0.4.
</details>

<details>
<summary>Explain the differences between joint, marginal, and conditional probabilities.</summary>

### Explain the differences between joint, marginal, and conditional probabilities.

**Definition:**

Совместная вероятность — шанс, что два утверждения верны вместе. Маргинальная — шанс одного утверждения, когда второе просуммировали. Условная — шанс одного, когда второе уже известно.

**How it works:**

- `P(A, B)` — совместная. `P(A) = Σᵦ P(A, B)` — маргинальная для дискретного партнёра, а в непрерывном случае ту роль играет интеграл.
- `P(A | B) = P(A, B) / P(B)`, когда `P(B) > 0`. Условие перенормирует срез, где B случилось.
- Цепное правило пишет совместную как `P(A, B) = P(A | B) P(B)`.
- Модель `P(метка | признаки)` — условная. Таблица частот обучающих данных ближе к совместной, из которой можно получить обе.

**Examples:**

Дождь и пробки: `P(дождь, пробки) = 0.2`, `P(дождь) = 0.25`. Тогда `P(пробки | дождь) = 0.2 / 0.25 = 0.8`, а маргинальная вероятность пробок может быть 0.3 после добавления среза без дождя.
</details>

<details>
<summary>What does it mean for two events to be independent?</summary>

### What does it mean for two events to be independent?

**Definition:**

Два события независимы, когда знание одного не меняет вероятность другого.

**How it works:**

- Проверка: `P(A, B) = P(A) P(B)`, или равносильно `P(A | B) = P(A)`, когда `P(B) > 0`.
- Взаимоисключающие события с положительной вероятностью зависимы: если одно случилось, другого не было.
- Попарная независимость трёх событий не означает, что все три взаимно независимы. Тройная совместная вероятность всё ещё должна раскладываться.
- Наивный Байес предполагает, что признаки независимы при данном классе. Это часто неверно и всё же полезное приближение.

**Examples:**

Две честные монеты: `P(первая орёл) = 0.5`, `P(обе орёл) = 0.25 = 0.5 × 0.5`. Они независимы. «Первая орёл» и «монеты совпали» — нет.
</details>

<details>
<summary>Describe Bayes' Theorem and provide an example of how it's used.</summary>

### Describe Bayes' Theorem and provide an example of how it's used.

**Definition:**

Теорема Байеса превращает известное правдоподобие и априорную вероятность в вероятность гипотезы после свидетельства.

**How it works:**

- `P(H | D) = P(D | H) P(H) / P(D)`. `P(H)` — априорная, `P(D | H)` — правдоподобие, `P(H | D)` — апостериорная.
- `P(D)` — полная вероятность свидетельства, сумма по гипотезам: `Σ P(D | Hᵢ) P(Hᵢ)`.
- Редкая гипотеза остаётся маловероятной, пока отношение правдоподобий не велико. Базовые частоты важны.
- Спам-фильтры, медицинские тесты и байесовское обновление весов — то же тождество с разными именами H и D.

**Examples:**

Болезнь имеет априорную вероятность 0.01. Тест положителен у 90% больных и у 5% здоровых. `P(болен | плюс) = (0.9 × 0.01) / (0.9 × 0.01 + 0.05 × 0.99) ≈ 0.15`. Большинство положительных тестов всё ещё ложная тревога.
</details>

<details>
<summary>What is a probability density function (PDF)?</summary>

### What is a probability density function (PDF)?

**Definition:**

PDF — неотрицательная функция, площадь которой по всей прямой равна 1. Вероятность интервала — интеграл PDF по этому интервалу.

**How it works:**

- Значение `f(x)` — плотность, не `P(X = x)`. Вероятность точки у непрерывной величины равна нулю.
- Более высокий пик значит, что значения скапливаются там. Кривая может превышать 1, если пик узкий.
- Правдоподобие непрерывного наблюдения в методе максимального правдоподобия — плотность в этой точке. Её сравнивают, но это не вероятность.
- Гистограммы оценивают PDF, считая массу в корзинах и деля на ширину корзины.

**Examples:**

Равномерная плотность на `[0, 0.5]` равна 2 внутри интервала. `P(0.1 ≤ X ≤ 0.2) = 2 × 0.1 = 0.2`.
</details>

<details>
<summary>What is the role of the cumulative distribution function (CDF)?</summary>

### What is the role of the cumulative distribution function (CDF)?

**Definition:**

CDF в точке `x` — это `P(X ≤ x)`. Она превращает распределение в одну неубывающую кривую от 0 до 1.

**How it works:**

- Для дискретной величины это сумма масс до `x`. Для непрерывной — интеграл PDF слева до `x`.
- Там, где PDF существует, она является производной CDF. Скачки CDF — точечные массы.
- `P(a < X ≤ b) = F(b) − F(a)`. Квантили — обратный поиск по CDF.
- Эмпирические CDF сравнивают выборку с теоретическим распределением без выбора ширины корзины.

**Examples:**

У честной кости `F(3) = P(X ≤ 3) = 1/2`, и `F(3.9) = 1/2` по-прежнему, потому что между 3 и 4 ничего нет.
</details>

### Probabilistic Models and Theories

<details>
<summary>Explain the Central Limit Theorem and its significance in machine learning.</summary>

### Explain the Central Limit Theorem and its significance in machine learning.

**Definition:**

Центральная предельная теорема говорит, что среднее многих независимых выборок, после центрирования и масштабирования, приближается к нормальному распределению, даже если каждая выборка не нормальна.

**How it works:**

- Среднее выборочного среднего равно истинному среднему. Его дисперсия — дисперсия одного испытания, делённая на размер выборки.
- Приближение лучше на большой выборке и плохо на крошечной или при очень тяжёлых хвостах.
- Поэтому доверительные интервалы и многие статистики критериев используют нормальную или t-кривую для средних.
- Шум градиента мини-пакета часто считают примерно гауссовым по той же причине: среднее пакета складывает много мелких вкладов.

**Examples:**

Броски кости равномерны на 1..6 и не колоколообразны. Среднее 50 бросков всё равно сидит около 3.5 с примерно нормальной гистограммой.
</details>

<details>
<summary>What is the Law of Large Numbers?</summary>

### What is the Law of Large Numbers?

**Definition:**

Закон больших чисел говорит, что среднее всё большего числа независимых выборок из одного распределения садится на математическое ожидание.

**How it works:**

- Слабая форма: вероятность большого зазора между средним и ожиданием стремится к нулю. Сильная форма: среднее сходится с вероятностью 1.
- Конечная дисперсия — обычное условие учебника. Выборки должны быть одинаково распределены и не слишком зависимы.
- Он оправдывает замену теоретического среднего длинным выборочным средним, в том числе эмпирического риска вместо ожидаемой потери.
- Он не говорит, что среднее становится нормальным. Про форму говорит центральная предельная теорема. Он также не говорит, что короткая выборка уже близка.

**Examples:**

Доля орлов честной монеты после 20 бросков может быть 0.7. После 20 000 бросков она сидит близко к 0.5.
</details>

<details>
<summary>Define expectation, variance, and covariance.</summary>

### Define expectation, variance, and covariance.

**Definition:**

Математическое ожидание — среднее случайной величины с весами-вероятностями. Дисперсия — ожидаемый квадрат расстояния до этого среднего. Ковариация — то, как две величины движутся вместе.

**How it works:**

- `E[X] = Σ x P(X = x)` или интеграл `x f(x) dx`. Оно линейно: `E[aX + bY] = a E[X] + b E[Y]`, даже когда X и Y зависимы.
- `Var(X) = E[(X − E[X])²] = E[X²] − (E[X])²`. `Var(aX) = a² Var(X)`.
- `Cov(X, Y) = E[(X − E[X])(Y − E[Y])]`. Нулевая ковариация сама по себе не доказывает независимость, кроме особых семейств вроде совместно нормальных величин.
- Ковариационную матрицу признаков диагонализует PCA. Высокая дисперсия одного признака может доминировать в расстоянии, пока его не масштабируют.

**Examples:**

У честной кости ожидание 3.5. Дисперсия около 2.92. У двух независимых костей ковариация 0, поэтому дисперсия их суммы около 5.83.
</details>

<details>
<summary>What are the characteristics of a Gaussian (Normal) distribution?</summary>

### What are the characteristics of a Gaussian (Normal) distribution?

**Definition:**

Нормальное распределение — колоколообразная кривая, которую задают среднее `μ` и дисперсия `σ²`. Оно симметрично, и среднее, медиана и мода совпадают.

**How it works:**

- Плотность максимальна в `μ` и спадает как `exp(−(x − μ)² / (2σ²))`. Около 68% массы лежит в одном стандартном отклонении, около 95% в двух, около 99.7% в трёх.
- Сумма независимых нормальных величин нормальна. Масштабированная нормальная величина нормальна. Эта замкнутость делает модели шума складываемыми.
- Стандартизация `(X − μ) / σ` даёт стандартное нормальное, по которому устроены z-таблицы.
- Реальные ошибки часто лишь примерно нормальны. Тяжёлые хвосты и жёсткие границы ломают картину 68-95-99.7.
</details>

<details>
<summary>Explain the utility of the Binomial distribution in machine learning.</summary>

### Explain the utility of the Binomial distribution in machine learning.

**Definition:**

Биномиальный счётчик — число успехов в фиксированном числе независимых испытаний «да или нет» с одной и той же вероятностью успеха.

**How it works:**

- `P(K = k) = C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ`. Среднее — `np`, дисперсия — `np(1 − p)`.
- Так моделируют, сколько из n писем — спам, сколько из n пользователей кликнули или сколько из n фолдов кросс-валидации прошли, когда каждое испытание — бернуллиевское.
- Логистическая регрессия моделирует одно испытание. Биномиальное правдоподобие расширяет это до счётчика из n при тех же признаках.
- Когда n велико и p не крошечное, счётчик приблизительно нормален. Когда n велико и p крошечное, он приблизительно пуассоновский.

**Examples:**

Десять независимых пользователей кликают с вероятностью 0.2. Ожидаемое число кликов — 2, а шанс нуля кликов — `0.8¹⁰ ≈ 0.107`.
</details>

<details>
<summary>How does the Poisson distribution differ from the Binomial distribution?</summary>

### How does the Poisson distribution differ from the Binomial distribution?

**Definition:**

Пуассон считает события на фиксированном интервале, когда они приходят независимо с постоянной средней частотой. Биномиальное распределение считает успехи в фиксированном числе испытаний.

**How it works:**

- У Пуассона один параметр `λ` — средний счёт. Дисперсия равна среднему. Вероятности — `e⁻λ λᵏ / k!`.
- Отдельного n нет. На интервале может быть сколь угодно много событий, хотя большой k становится маловероятен.
- Это предел биномиального, когда n растёт, p падает, а `np` остаётся равным `λ`. Поэтому редкие события в большой совокупности выглядят пуассоновскими.
- Пуассон — для поступлений, сбоев в час или слов в окне. Биномиальное — когда число попыток вы зафиксировали заранее.

**Examples:**

Звонки в среднем 4 в час. `P(0 звонков) = e⁻⁴ ≈ 0.018`. Биномиальной модели сначала нужно назвать число возможных звонящих.
</details>

<details>
<summary>What is the relevance of the Bernoulli distribution in machine learning?</summary>

### What is the relevance of the Bernoulli distribution in machine learning?

**Definition:**

Распределение Бернулли — одно испытание «да или нет» с вероятностью успеха `p`. Это правдоподобие под бинарной классификацией.

**How it works:**

- `P(X = 1) = p` и `P(X = 0) = 1 − p`. Среднее — `p`, дисперсия — `p(1 − p)`.
- Логистическая регрессия задаёт `p = σ(w · x + b)` и учится по логарифму правдоподобия Бернулли, то есть по бинарной кросс-энтропии.
- Последовательность независимых испытаний Бернулли с одним `p` — биномиальный счёт. Разный `p` на строку — набор отдельных бернуллиевских испытаний.
- Accuracy выбрасывает вероятность. Правдоподобие Бернулли использует уверенность, поэтому 0.99 на неверной метке наказывается сильнее, чем 0.51.

**Examples:**

Модель клика с `p = 0.2` имеет логарифм правдоподобия `log 0.2` на клике и `log 0.8` на промахе. Обучение двигает `w`, чтобы эти логарифмы росли на наблюдаемых метках.
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
