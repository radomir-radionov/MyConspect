# Genetic Algorithms — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./7_special_algorithms.md)

### Related docs

- [Genetic Algorithms — собеседование](./7_algo_genetic_interview.md)

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

Генетический алгоритм ищет хорошее решение, держа популяцию кандидатов и раз за разом отдавая предпочтение тем, кто набрал лучший балл.

**How it works:**

- Каждый кандидат закодирован хромосомой. Функция приспособленности его оценивает. Следующее поколение строится отбором, скрещиванием и мутацией.
- Биология здесь только метафора: более приспособленные чаще дают потомков, а случайная вариация смотрит соседние кодировки.
- Градиент и непрерывная формула не нужны. Нужны способ закодировать кандидата и способ сравнить двоих.
- Результат — эвристика. Нет гарантии, что лучшая особь — глобальный оптимум.

**Examples:**

Популяция маршрутов доставки оценивается полной длиной. Короткие маршруты чаще становятся родителями. Потомки меняются кусками остановок, а редкий обмен двух городов не даёт поиску застыть.
</details>

<details>
<summary>Can you explain the terms chromosome, gene, and allele in the context of GAs?</summary>

### Can you explain the terms chromosome, gene, and allele in the context of GAs?

**Definition:**

Хромосома — один полный кандидат. Ген — одна позиция в этой кодировке. Аллель — значение, которое стоит в этой позиции.

**How it works:**

- Кодировку выбирают под задачу: битовая строка, список вещественных чисел или перестановка.
- Область гена — набор аллелей, которые он может хранить. У бинарного гена аллели 0 и 1. Ген города в маршруте хранит идентификатор города, а вся хромосома должна оставаться перестановкой.
- Генотип — закодированная хромосома. Фенотип — реальное решение, которое оценивают после раскодирования.
- Скрещивание меняет гены между родителями. Мутация заменяет аллель другим допустимым.

**Examples:**

Хромосома `[1, 0, 1, 1]` собирает рюкзак. Ген 3 — третий предмет. Его аллель `1` значит, что предмет взят.
</details>

<details>
<summary>Describe the process of selection in genetic algorithms.</summary>

### Describe the process of selection in genetic algorithms.

**Definition:**

Отбор решает, кто станет родителями. Более высокая приспособленность должна повышать шанс, но не превращать каждого потомка в копию текущего победителя.

**How it works:**

- Пропорциональный отбор (рулетка) даёт сектор, равный приспособленности, делённой на сумму по популяции. Очень большой балл может захватить колесо.
- Турнирный отбор берёт маленькую группу и оставляет лучшего в ней. Размер турнира — это сила отбора.
- Ранговый отбор использует порядок баллов, а не сырые разрывы, поэтому один огромный балл не забирает всё колесо.
- Слишком сильное давление рано уничтожает разнообразие. Слишком слабое тратит поколения на слабых родителей.

**Examples:**

Баллы 5, 3 и 2 дают веса рулетки 0.5, 0.3 и 0.2. Турнир размера 2, который вытянул двух последних, оставляет того, у кого балл 3.
</details>

<details>
<summary>Explain crossover and mutation operations in genetic algorithms.</summary>

### Explain crossover and mutation operations in genetic algorithms.

**Definition:**

Скрещивание смешивает двух родителей в потомков. Мутация затем делает мелкую случайную правку, чтобы популяция добралась до кодировок, которых не было ни у одного родителя.

**How it works:**

- Одноточечное скрещивание режет обе хромосомы в одном индексе и меняет хвосты. Двухточечное меняет средний кусок. Равномерное выбирает каждый ген у одного из родителей подбрасыванием монеты.
- Задачам на перестановках нужен оператор, который всё ещё даёт перестановку, например порядковое скрещивание: кусок копируется, остальное добирается из второго родителя с пропуском повторов.
- Мутация битов переворачивает несколько позиций. Для вещественных генов добавляет небольшой шум. Для перестановок меняет две позиции или разворачивает кусок.
- Обычные частоты: скрещивание вероятно (часто заметно выше половины), мутация редка на ген. Высокая частота мутации превращает поиск в случайное блуждание.

**Examples:**

```text
родители  11010  и  00111
разрез в 2 -> дети 11111 и 00010
затем переворот гена 4 у первого ребёнка -> 11101
```
</details>

<details>
<summary>What is a fitness function in the context of a genetic algorithm?</summary>

### What is a fitness function in the context of a genetic algorithm?

**Definition:**

Функция приспособленности переводит раскодированного кандидата в число, которое умеет сравнивать отбор. Это единственная формулировка того, что значит «лучше».

**How it works:**

- Для минимизации, например длины, приспособленностью часто берут минус или обратную величину, чтобы отбор по-прежнему максимизировал.
- Она должна быть определена для каждой допустимой хромосомы. Если недопустимые хромосомы могут появиться, функция либо чинит их, либо оценивает нарушение.
- Дешёвая функция важна, потому что она считается раз на особь в поколении. Дорогая симуляция становится узким местом.
- Плоский ландшафт, где много разных хромосом имеют один балл, не даёт отбору кого предпочесть.

**Examples:**

Длины маршрута 40 и 25 становятся приспособленностью `1/40` и `1/25`, поэтому более короткий маршрут чаще выбирают родителем.
</details>

<details>
<summary>How does a GA differ from other optimization techniques?</summary>

### How does a GA differ from other optimization techniques?

**Definition:**

Генетический алгоритм сразу смотрит много кандидатов и пользуется только сравнением приспособленности, поэтому может двигаться по ландшафту без производной.

**How it works:**

- Градиентный спуск идёт по локальному наклону гладкой функции и держит одну точку. ГА держит популяцию и может сидеть в нескольких впадинах одновременно.
- Полный перебор проверяет заданное множество. ГА смотрит крошечную долю и может остановиться раньше с достаточно хорошей особью.
- Имитация отжига тоже использует случайность, но гуляет по одному решению и принимает ухудшения по графику охлаждения.
- Цена — много оценок приспособленности, несколько ручек настройки и отсутствие сертификата оптимальности. Выпуклым задачам с градиентом лучше подходят градиентные методы.
</details>

<details>
<summary>What are the typical stopping conditions for a GA?</summary>

### What are the typical stopping conditions for a GA?

**Definition:**

Цикл останавливается, когда новые поколения вряд ли окупятся, или когда цель по приспособленности уже достигнута.

**How it works:**

- Потолок поколений или бюджет по часам — жёсткий стоп.
- Порог приспособленности останавливает раньше, когда любая особь уже достаточно хороша для продукта.
- Правило плато останавливает, когда лучшая приспособленность не улучшалась заданное число поколений.
- Правило разнообразия может остановить, когда популяция сжалась до почти копий: скрещивание тогда почти ничего не меняет.
</details>

<details>
<summary>How can genetic algorithms be applied to combinatorial optimization problems?</summary>

### How can genetic algorithms be applied to combinatorial optimization problems?

**Definition:**

Комбинаторные задачи кодируют так, чтобы каждая хромосома была допустимой комбинацией, или чтобы недопустимую можно было починить до оценки.

**How it works:**

- Рюкзак — бит на предмет. Приспособленность — суммарная ценность, а перегруженные хромосомы получают штраф или чинятся выбрасыванием предметов.
- Маршрут — перестановка городов. Скрещивание и мутация должны сохранять «каждый город один раз».
- Расписание может быть последовательностью работ. Декодер превращает её в график, а приспособленность — это опоздание или стоимость.
- Пространство дискретное и обычно огромное. ГА — выборка, а не доказательство, что график оптимален.

**Examples:**

Города `A B C D E`. Порядковое скрещивание копирует кусок `C D` от родителя 1 и добирает остальное от родителя 2 в порядке `E A B`, пропуская уже использованные города. Получается `E A C D B`.
</details>

### Advanced Genetic Algorithm Concepts

<details>
<summary>What is elitism in GAs and why might it be used?</summary>

### What is elitism in GAs and why might it be used?

**Definition:**

Элитизм копирует несколько лучших особей в следующее поколение без изменений, чтобы скрещивание и мутация не выкинули текущего лучшего.

**How it works:**

- Без этого лучшая хромосома может не пройти отбор, или все её дети окажутся хуже, и лучшая приспособленность упадёт.
- Маленькой элиты, часто одной или нескольких особей, достаточно. Копирование большей части популяции останавливает исследование.
- Элитизм хорошо сочетается с более высокой мутацией у всех остальных: рекорд в безопасности, а остальная популяция продолжает пробовать.
- Видимый эффект — неубывающая кривая лучшего результата. Популяция вне элиты всё ещё может быть разнообразной.
</details>

<details>
<summary>How do penalty functions work in genetic algorithms?</summary>

### How do penalty functions work in genetic algorithms?

**Definition:**

Штраф вычитает из приспособленности, когда хромосома нарушает ограничение. Отбор тогда предпочитает допустимых, не запрещая недопустимых сразу.

**How it works:**

- Смертный штраф ставит приспособленность в худшее значение или выбрасывает особь. Это просто и теряет информацию внутри почти допустимой хромосомы.
- Градуированный штраф растёт с размером нарушения, например насколько рюкзак тяжелее предела.
- Слишком маленький штраф позволяет побеждать недопустимым. Слишком большой заставляет поиск игнорировать границу, где часто сидят хорошие допустимые решения.
- Альтернатива — декодер или починка, которые превращают каждую хромосому в допустимый фенотип до оценки.

**Examples:**

Ценность 40 при перевесе 2 и коэффициенте штрафа 10 даёт `40 - 10 * 2 = 20`. Допустимая укладка ценностью 25 тогда выше.
</details>

<details>
<summary>Explain the concept of genetic drift in GAs.</summary>

### Explain the concept of genetic drift in GAs.

**Definition:**

Генетический дрейф — случайная потеря аллелей в конечной популяции, даже когда эти аллели не хуже.

**How it works:**

- Отбор — это выборка. Приличный аллель может по случайности не попасть ни к одному родителю и тогда исчезнет, пока мутация его не создаст снова.
- Маленькие популяции и слабый отбор усиливают дрейф. Большая популяция дольше хранит редкие аллели.
- Дрейф снижает разнообразие и может закрепить посредственный аллель во всей популяции. Это другой сбой, чем сходимость отбора к локальному пику.
- Более высокая мутация, большая популяция или crowding, который бережёт необычных особей, замедляют потерю.
</details>

<details>
<summary>What is a multi-objective genetic algorithm?</summary>

### What is a multi-objective genetic algorithm?

**Definition:**

Многокритериальный ГА ищет компромиссы между несколькими оценками сразу, а не схлопывает их в одну взвешенную сумму.

**How it works:**

- Решение доминирует другое, если оно не хуже по каждой цели и лучше хотя бы по одной. Недоминируемое множество — фронт Парето.
- NSGA-II ранжирует популяцию слоями недоминирования и внутри слоя предпочитает особей в менее тесных областях пространства целей.
- Взвешенная сумма проще и пропускает части вогнутого фронта: один набор весов поддерживает только одну точку.
- Пользователь выбирает точку на фронте потом. Задача алгоритма — разложить решения вдоль этого фронта.

**Examples:**

Стоимость 10 при задержке 5 и стоимость 7 при задержке 8 можно оставить обе. Стоимость 12 при задержке 9 доминируется первой и её можно отбросить.
</details>

<details>
<summary>Can you describe what gene expression programming is?</summary>

### Can you describe what gene expression programming is?

**Definition:**

Генное экспрессионное программирование эволюционирует линейные хромосомы, которые раскодируются в деревья выражений. Мутирует строка, а не само дерево.

**How it works:**

- Ген — строка символов функций и терминалов. Фиксированная голова может держать функции или терминалы; хвост — только терминалы, поэтому каждая строка остаётся допустимым деревом.
- Фенотип — дерево, прочитанное из этой строки, например арифметическое выражение. Приспособленность оценивает дерево на данных.
- Скрещивание и мутация правят линейную строку обычными строковыми операторами. Это проще, чем править узлы дерева на месте.
- Этот разрыв генотипа и фенотипа — отличие от генетического программирования, которое эволюционирует сами деревья.

**Examples:**

Строка `+ a * b c` раскодируется в дерево `a + (b * c)`. Мутация может заменить `+` на `-`, и следующая оценка считает `a - (b * c)`.
</details>

<details>
<summary>What are memetic algorithms and how do they differ from traditional GAs?</summary>

### What are memetic algorithms and how do they differ from traditional GAs?

**Definition:**

Меметический алгоритм — генетический алгоритм плюс локальный улучшатель, который шлифует каждую особь до оценки или возврата в популяцию.

**How it works:**

- ГА по-прежнему отбирает, скрещивает и мутирует. Дополнительный шаг запускает подъём на холм, обмен 2-opt или другой поиск по окрестности фенотипа.
- Эволюция широко исследует. Локальный поиск эксплуатирует окрестность перспективной особи. Гибрид тратит оценки приспособленности на уже улучшенных кандидатов.
- Ламарковские версии записывают улучшенный фенотип обратно в хромосому. Болдуиновские оценивают улучшенный результат, но оставляют хромосому как была.
- Локальный поиск умножает стоимость на особь. Он окупается, когда короткая шлифовка чинит то, что скрещивание обычно ломает.
</details>

<details>
<summary>Define hypermutation and its role in GAs.</summary>

### Define hypermutation and its role in GAs.

**Definition:**

Гипермутация — временный скачок частоты мутации, когда популяция застряла. Аллели тогда меняются гораздо быстрее, чем в обычном поколении.

**How it works:**

- Идея заимствована у созревания аффинности в иммунных моделях: поиск застрял — поднять вариацию, затем вернуть обычную низкую частоту.
- Триггером часто служит плато лучшей приспособленности или замеченное изменение динамической цели.
- Пока частота высока, элитизм удерживает текущего лучшего от разрушения. Остальные могут прыгать дальше.
- Если оставить ту же частоту навсегда, отбор перестаёт накапливать мелкие улучшения.
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
