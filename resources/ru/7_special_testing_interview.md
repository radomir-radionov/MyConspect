# Testing — Interview

Ответы заполнены для опубликованной части, остальные пустые.

[ ← Вернуться в хаб](./7_special_testing.md)

### Related docs

- [Fundamentals](./7_special_testing_fundamentals.md) · [Layers](./7_special_testing_layers.md) · [Practices](./7_special_testing_practices.md) · [Tooling](./7_special_testing_tooling.md) · [Interview](./7_special_testing_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы с [Devinterview.io — Testing](https://devinterview.io/questions/web-and-mobile-development/testing-interview-questions/).

### Testing Fundamentals

<details>
<summary>What is software testing, and why is it important?</summary>

### What is software testing, and why is it important?

**Definition:**

Тестирование программного обеспечения — дисциплина проверки, что система делает то, что должна, и выяснения, где она этого не делает, пока за ошибку не платят пользователи.

**How it works:**

- Оно находит дефекты: поведение, которое расходится с требованием или с ожиданием, которое можно сформулировать.
- Ранняя находка снижает цену и радиус поражения. Дефект в проде дороже того же дефекта рядом с изменением, которое его внесло.
- Результат — свидетельство о качестве, а не доказательство, что дефектов не осталось.
- Это свидетельство ещё и обратная связь для процесса: повторяющиеся сбои в одной области говорят, где слабы проект или требования.
- Тестирование — не «один раз пройти счастливый путь» и не фаза, которая начинается только после окончания кодирования.

**Examples:**

Тест оформления заказа, который проверяет, что итог равен `price + tax`, упадёт в день, когда кто-то изменит округление. В этом падении и смысл теста.

</details>

<details>
<summary>Define the difference between verification and validation in software testing.</summary>

### Define the difference between verification and validation in software testing.

**Definition:**

Верификация спрашивает, построен ли продукт по спецификации. Валидация спрашивает, является ли эта спецификация тем продуктом, который людям действительно нужен.

**How it works:**

- Верификация отвечает на вопрос «мы строим это правильно?». Типичны ревью, инспекции и разборы требований, проекта и кода, а также тесты, привязанные к записанному правилу.
- Валидация отвечает на вопрос «мы строим то, что нужно?». Типичны приёмочные тесты, альфа и бета и попытка пользователя выполнить настоящую задачу.
- Функция может пройти верификацию и провалить валидацию: налог совпадает со спецификацией, а спецификация берёт деньги не с той стороны.

**Examples:**

Ревью, которое сверяет правило округления с документом требований, — верификация. Продавец, который проводит настоящий счёт через оплату, — валидация.

</details>

<details>
<summary>Explain the software development life cycle and the role testing plays in each phase.</summary>

### Explain the software development life cycle and the role testing plays in each phase.

**Definition:**

Жизненный цикл разработки — путь от потребности к работающей системе и её сопровождению. У тестирования есть работа на каждой фазе, а не только в ячейке «QA» в конце.

**How it works:**

- Пока собирают потребности, тестирование их разбирает: прототипы и сценарии использования показывают пробелы и противоречия до появления кода.
- Пока пишут проект, ревью проверяет, что структура способна эти потребности закрыть.
- Пока пишут код, модульные тесты проверяют маленькие части по отдельности.
- Когда части соединяют, интеграционные тесты проверяют границы. Затем системные тесты прогоняют продукт целиком. Приёмка, включая альфу и бету, спрашивает, годится ли это к выпуску.
- Нагрузочные и похожие испытания толкают систему за обычную нагрузку до выпуска. После развёртывания проверки подтверждают живую среду, а сопровождение заново гоняет тесты, когда система меняется.

**Examples:**

```text
разбор потребностей → разбор проекта → модульные тесты
  → интеграция → система → приёмка → проверки в бою
```

</details>

<details>
<summary>What are the different levels of software testing?</summary>

### What are the different levels of software testing?

**Definition:**

Уровни тестирования — это масштабы проверки: от одной функции до решения пользователя, что продукт приемлем.

**How it works:**

- Модульные тесты покрывают одну функцию или класс, обычно во время написания, с подменёнными зависимостями. Они образуют широкое основание пирамиды тестов. Типичные раннеры — JUnit, NUnit и pytest.
- Компонентные тесты проверяют более крупную единицу, например модуль сервиса, после того как внутренние единицы прошли и до подключения к остальной системе.
- Интеграционные тесты проверяют интерфейсы между этими частями. Сбои здесь — контракты и проводка, а не арифметика внутри одной функции.
- Системные тесты гоняют собранный продукт против его требований в среде, похожей на продакшен.
- Приёмочные тесты спрашивают, выполняет ли результат условия заказчика. Они стоят на узкой вершине пирамиды.
- Альфа — такое испытание внутри организации. Бета — ограниченное испытание с внешними пользователями, часто после внутренней приёмки.

**Examples:**

Модульный тест вызывает `tax(100, 20)` и ждёт `20`. Интеграционный тест отправляет заказ через API и проверяет строку, которую записала база. Системный тест доводит оплату до конца в браузере.

</details>

<details>
<summary>Describe the difference between static and dynamic testing.</summary>

### Describe the difference between static and dynamic testing.

**Definition:**

Статическое тестирование изучает артефакты, не запуская их. Динамическое выполняет программу и сравнивает то, что она делает, с тем, что должна делать.

**How it works:**

- Статическая работа идёт рано: ревью требований и проекта плюс линтеры, проверщики типов и другие анализаторы исходников. Она может отметить пропущенное требование или опасный вызов, который ни один тест не выполняет.
- Динамической работе нужна сборка. Модульные, интеграционные, системные и приёмочные тесты динамические. Они показывают поведение, включая пути, которые ревью не представило.
- Статический анализ может сказать, что строка существует. Только выполнение говорит, что эта строка отработала на данном входе.
- Нужны оба. Ревью не поймает неверную ставку налога, которая проходит проверку типов, а тест не поймает требование, которое так и не записали.

**Examples:**

Линтер, который отвергает `eval(userInput)`, — статика. Тест, который отправляет этот ввод и ждёт, что значение сохранится как текст, — динамика.

</details>

<details>
<summary>What is a test case, and what elements should it contain?</summary>

### What is a test case, and what elements should it contain?

**Definition:**

Тест-кейс — одна задокументированная проверка: ситуация, шаги и результат, который считается успехом.

**How it works:**

- Дайте ему идентификатор и название, чтобы о нём можно было говорить.
- Опишите цель, предусловия и шаги, которые воспроизводят ситуацию.
- Ожидаемый результат запишите до прогона. Фактический результат — то, что произошло; его заполняют во время прогона.
- Комментарии, ответственный и время последнего изменения оставляют кейс сопровождаемым.
- Автоматический тест — та же запись в коде: подготовка, действие, проверка.

**Examples:**

```text
id: TAX-14
title: Tax is added once
precondition: a cart with one line of 100
steps: set the rate to 20% and request the total
expected: 120
```

</details>

<details>
<summary>Explain the concept of coverage in testing and the main types of coverage (e.g., line, branch, path, statement).</summary>

### Explain the concept of coverage in testing and the main types of coverage (e.g., line, branch, path, statement).

**Definition:**

Покрытие измеряет, какую часть программы набор тестов действительно выполняет. Большое число — не то же самое, что содержательный тест.

**How it works:**

- Покрытие операторов (его часто показывают как покрытие строк) — доля операторов, которые выполнились хотя бы раз.
- Покрытие ветвей спрашивает, выполнялась ли каждая сторона решения: и истинный, и ложный исход `if`.
- Покрытие путей спрашивает, прошёл ли каждый маршрут через решения. Число путей растёт быстро, поэтому полное покрытие путей редко практично.
- Два теста могут задеть одни и те же строки входами, которые не угрожают нужному вам дефекту. Покрытие используют, чтобы найти код, который не выполняется, а затем решить, какому из этого кода нужно более сильное утверждение.

**Examples:**

```text
if (rate < 0) reject();
else total = price + price * rate;
```

Один вызов с `rate = 20` покрывает оператор в `else` и пропускает ветвь `reject`.

</details>

<details>
<summary>What is the difference between white-box, black-box, and grey-box testing?</summary>

### What is the difference between white-box, black-box, and grey-box testing?

**Definition:**

Тестирование чёрного ящика смотрит на систему как на поверхность входов и выходов. Тестирование белого ящика использует внутреннюю структуру. Тестирование серого ящика использует ограниченный вид этой структуры.

**How it works:**

- Кейсы чёрного ящика берутся из требований и из поведения, которое видит пользователь. Исходники не нужны. Типичные приёмы — классы эквивалентности и граничные значения.
- Кейсы белого ящика берутся из кода: ветви, циклы и пути ошибок. Им нужны исходники, и именно их меряют инструменты покрытия.
- Серый ящик стоит между ними. Можно знать схему базы или форму API и при этом не идти по каждой функции. Так часто устроены интеграционные тесты.
- Три подхода отвечают на разные вопросы, поэтому изменению обычно нужно больше одного из них.

**Examples:**

Чёрный ящик: итог 100 при налоге 20% должен показать 120, какой бы ни была формула. Белый ящик: ветвь отрицательной ставки обязана вызвать `reject`. Серый ящик: API заказа должен записать одну строку с `total = 120`.

</details>

<details>
<summary>What is regression testing, and why is it performed?</summary>

### What is regression testing, and why is it performed?

**Definition:**

Регрессионное тестирование заново проверяет поведение, которое уже работало, после изменения, чтобы исправление или новая функция не сломали что-то ещё.

**How it works:**

- Поводом служит исправление дефекта, новая функция, рефакторинг или обновление зависимости.
- Полная регрессия гоняет широкий набор. Это самый безопасный и самый медленный вариант.
- Выборочная регрессия гоняет кейсы, связанные с изменённой областью, плюс тонкий дымовой проход по остальному.
- Модульные тесты в CI — регрессионная сеть на каждый коммит. Более широкие проходы интерфейса, часто с драйвером браузера вроде Selenium, идут по расписанию или перед выпуском. Сам конвейер может быть Jenkins, GitLab CI или другим раннером.
- Если набор никогда не падает, он вас не защищает. Если он падает на посторонних правках, он слишком сильно привязан к деталям реализации.

**Examples:**

После смены округления заново прогоните модульные тесты налога и один сценарий оплаты. Экраны сброса пароля заново проверять не нужно, если изменение не задело общий код, которым они пользуются.

</details>

<details>
<summary>Explain unit testing and which tools you might use for it.</summary>

### Explain unit testing and which tools you might use for it.

**Definition:**

Модульный тест проверяет один небольшой кусок поведения изолированно и достаточно быстро, чтобы гонять его на каждое изменение.

**How it works:**

- Единица не говорит с настоящей сетью, базой или часами. Их подменяют фикциями или заглушками, чтобы сбой указывал на эту единицу.
- Одни и те же входы должны давать один и тот же результат на любой машине.
- Обычные раннеры: JUnit 5 и TestNG для Java, NUnit и xUnit для .NET, pytest и unittest для Python, Jest и Mocha для JavaScript, RSpec для Ruby, GoogleTest для C++.
- Их запускают инструменты сборки (Maven, Gradle, npm) и CI (Jenkins, GitHub Actions). IDE гоняет те же тесты локально.
- JUnit организует это через `@Test`, утверждения вроде `assertEquals` и хуки: `@BeforeEach` / `@AfterEach` вокруг каждого теста, `@BeforeAll` / `@AfterAll` один раз на класс.
- Набор документирует задуманное поведение и делает рефакторинг безопаснее. Он подводит, когда покрытие желаемое, когда тесты делят глобальное состояние или когда они повторяют друг друга без нового утверждения.

**Examples:**

```java
@Test
void addsTaxOnce() {
    assertEquals(120, new Cart(100).total(20));
}
```

</details>

<details>
<summary>What is integration testing and what are its types?</summary>

### What is integration testing and what are its types?

**Definition:**

Интеграционное тестирование проверяет, что по отдельности верные части всё ещё работают, когда вызывают друг друга.

**How it works:**

- Искомые сбои — неверные сообщения, несовпавшие типы, плохая обработка ошибок и утечки ресурсов на границе.
- Сверху вниз начинают с входа, который видит пользователь, и заменяют неготовые модули заглушками. Архитектурные ошибки видны рано. Заглушки — дополнительная работа.
- Снизу вверх начинают с листьев, их вызывают драйверы, и сборка идёт вверх. Настоящие ошибки нижнего уровня всплывают до появления интерфейса.
- Сэндвич, или от середины, строит от ядра в обе стороны: середина настоящая, а концы ещё на заглушках.
- Гибрид режет систему вертикально (один пользовательский путь через все слои) или растёт наружу от ядра, а затем соединяет эти срезы.
- «Большой взрыв», когда всё соединяют сразу, — вариант, при котором первый сбой трудно приписать. Его оставляют только когда части крошечные.

**Examples:**

Сверху вниз: обработчик оплаты работает против заглушки платёжного сервиса, которая всегда одобряет. Снизу вверх: настоящего платёжного клиента вызывает маленький драйвер ещё до появления обработчика.

</details>

<details>
<summary>What is system testing, and how does it differ from other types of testing?</summary>

### What is system testing, and how does it differ from other types of testing?

**Definition:**

Системное тестирование гоняет готовый собранный продукт против его требований, так, как им будут пользоваться, а не против одного модуля.

**How it works:**

- Модульный тест изолирует одну часть и подменяет соседей. Системный тест использует настоящую сборку в среде, которая настолько близка к продакшену, насколько вы можете себе позволить.
- Интеграционное тестирование останавливается на вопросе «эти части говорят правильно?». Системное спрашивает «весь продукт соответствует спецификации?».
- Приёмочное тестирование спрашивает заинтересованную сторону, годится ли продукт для её цели. Системное — всё ещё проверка команды против требований, даже когда заказчика в комнате нет.
- Кейсы сквозные: браузер, API, база и внешняя песочница, а не подмена всего этого.

**Examples:**

Оформить заказ, оплатить картой песочницы и подтвердить письмо и уменьшение остатка. Это системный тест. Спросить продавца, так ли он принимает оплату, — приёмка.

</details>

<details>
<summary>Define acceptance testing and describe its types.</summary>

### Define acceptance testing and describe its types.

**Definition:**

Приёмочное тестирование решает, годится ли система людям, которые будут ей пользоваться, или договору, по которому её заказали. Это последний вопрос перед выпуском, а не ещё один проход по отдельным функциям.

**How it works:**

- Альфа идёт внутри организации на контролируемой сборке, чтобы найти дефекты, которые блокируют любое внешнее испытание.
- Бета отдаёт ограниченной внешней группе настоящий продукт, чтобы узнать то, что лаборатория пропустила.
- Пользовательскую приёмку выполняет заказчик или люди, которые его представляют, по их сценариям.
- Контрактная приёмка сверяет результат с письменным соглашением. Она обычна для государства и заказной работы.
- Регуляторная приёмка проверяет юридическое или отраслевое правило: здоровье, финансы, авиация.
- Эксплуатационная приёмка проверяет, что систему можно сопровождать: резервные копии, мониторинг, переключение при отказе и процедуры, которым будут следовать операторы.

**Examples:**

Клиника, которая подтверждает, что сценарий рецепта соответствует её процедуре, — пользовательская приёмка. Чеклист, что копии восстанавливаются и оповещения срабатывают, — эксплуатационная приёмка.

</details>

<details>
<summary>What are the benefits of test automation?</summary>

### What are the benefits of test automation?

**Definition:**

Автоматизация тестов выполняет проверки машиной, чтобы одно и то же свидетельство появлялось на каждое изменение и человек не повторял шаги.

**How it works:**

- Прогон каждый раз одинаков: пропущенные шаги исчезают, и сбой можно отнести к изменению, а не к тестировщику.
- Повторяющиеся проверки становятся дешёвыми, поэтому они могут стоять в CI и блокировать выпуск. Стоимость настройки платят один раз.
- Отчёты называют упавшее утверждение, а инструменты покрытия показывают, что ни разу не выполнялось.
- Быстрая обратная связь позволяет автору исправить поломку, пока изменение ещё в голове. На те же результаты смотрит вся команда.
- Конвейер, а не память, решает, что набор прогнан до развёртывания.
- Автоматизация не заменяет суждение о том, что стоит проверять. Она делает выбранные утверждения повторяемыми.

**Examples:**

Pull request гоняет модульный набор и несколько проверок API. Слияние ждёт этот результат, а не того, что кто-то снова прощёлкает оплату.

</details>

<details>
<summary>When would you choose not to automate test cases?</summary>

### When would you choose not to automate test cases?

**Definition:**

Оставляйте проверку ручной, когда её автоматизация стоит дороже, чем может сэкономить, или когда то, что нужно узнать, нельзя заранее записать как утверждение.

**How it works:**

- Разовый сценарий, одноразовая миграция или проверка, которую не будут запускать снова, часто быстрее руками.
- Исследовательское тестирование — это человек, который ищет поведение, которого вы не предсказали. Заскриптовать уже известные пути — другое занятие.
- Крошечный или короткий проект может не окупить стоимость каркаса.
- Чувствительные или регулируемые данные иногда нельзя класть в автоматическую фикстуру.
- Небольшую локальную правку можно подтвердить одним ручным проходом, если набора вокруг неё ещё нет.
- Устойчивый подход смешанный: сначала исследуют, затем автоматизируют повторяемые и рискованные кейсы. Инструменты могут записать то, что увидел исследователь, но само исследование остаётся человеческим.

**Examples:**

Автоматизируйте «налог на строку 100 равен 20», потому что это будет выполняться на каждом коммите. Не автоматизируйте разовую визуальную проверку печатного плаката, который больше не будут генерировать.

</details>


### Test Design Techniques

<details>
<summary>What is equivalence partitioning in software testing?</summary>

### What is equivalence partitioning in software testing?

**Definition:**

</details>

<details>
<summary>Explain boundary value analysis with an example.</summary>

### Explain boundary value analysis with an example.

**Definition:**

</details>

<details>
<summary>What is state transition testing, and where is it useful?</summary>

### What is state transition testing, and where is it useful?

**Definition:**

</details>

<details>
<summary>Describe the concept of decision table testing.</summary>

### Describe the concept of decision table testing.

**Definition:**

</details>

<details>
<summary>What is pairwise testing, and what tools support this technique?</summary>

### What is pairwise testing, and what tools support this technique?

**Definition:**

</details>

<details>
<summary>How do you prioritize test cases in a test suite?</summary>

### How do you prioritize test cases in a test suite?

**Definition:**

</details>

<details>
<summary>Explain error guessing and its effectiveness.</summary>

### Explain error guessing and its effectiveness.

**Definition:**

</details>

<details>
<summary>What is exploratory testing, and how is it structured?</summary>

### What is exploratory testing, and how is it structured?

**Definition:**

</details>

<details>
<summary>Describe the use-cases for model-based testing.</summary>

### Describe the use-cases for model-based testing.

**Definition:**

</details>


### Test Management

<details>
<summary>What is a test plan, and what should it typically include?</summary>

### What is a test plan, and what should it typically include?

**Definition:**

</details>

<details>
<summary>Describe test strategy and its importance.</summary>

### Describe test strategy and its importance.

**Definition:**

</details>

<details>
<summary>Explain the concept of a test charter in exploratory testing.</summary>

### Explain the concept of a test charter in exploratory testing.

**Definition:**

</details>

<details>
<summary>What is a test data management process?</summary>

### What is a test data management process?

**Definition:**

</details>

<details>
<summary>Define risk-based testing and its benefits.</summary>

### Define risk-based testing and its benefits.

**Definition:**

</details>

<details>
<summary>How do you track and manage defects in software testing?</summary>

### How do you track and manage defects in software testing?

**Definition:**

</details>

<details>
<summary>What is the role of a test lead or test manager in a testing team?</summary>

### What is the role of a test lead or test manager in a testing team?

**Definition:**

</details>

<details>
<summary>Describe the challenges in test environment management.</summary>

### Describe the challenges in test environment management.

**Definition:**

</details>

<details>
<summary>What tools are available for test management, and how do they differ?</summary>

### What tools are available for test management, and how do they differ?

**Definition:**

</details>

<details>
<summary>Explain what a traceability matrix is and how it is used in testing.</summary>

### Explain what a traceability matrix is and how it is used in testing.

**Definition:**

</details>

<details>
<summary>What are the key metrics used to measure test progress and coverage?</summary>

### What are the key metrics used to measure test progress and coverage?

**Definition:**

</details>


### Automation Testing

<details>
<summary>What are the criteria to decide whether a test should be automated?</summary>

### What are the criteria to decide whether a test should be automated?

**Definition:**

</details>

<details>
<summary>Describe the Page Object Model in automated testing.</summary>

### Describe the Page Object Model in automated testing.

**Definition:**

</details>

<details>
<summary>Explain the advantages and disadvantages of record and playback in test automation.</summary>

### Explain the advantages and disadvantages of record and playback in test automation.

**Definition:**

</details>

<details>
<summary>What is continuous integration, and how does it relate to test automation?</summary>

### What is continuous integration, and how does it relate to test automation?

**Definition:**

</details>

<details>
<summary>Which automation testing tools are you familiar with, and what are their strengths?</summary>

### Which automation testing tools are you familiar with, and what are their strengths?

**Definition:**

</details>

<details>
<summary>What is keyword-driven testing, and how does it work?</summary>

### What is keyword-driven testing, and how does it work?

**Definition:**

</details>

<details>
<summary>How does test automation fit into a DevOps environment?</summary>

### How does test automation fit into a DevOps environment?

**Definition:**

</details>

<details>
<summary>What are the main challenges you have faced in test automation?</summary>

### What are the main challenges you have faced in test automation?

**Definition:**

</details>

<details>
<summary>Explain the use of assertions in automated tests.</summary>

### Explain the use of assertions in automated tests.

**Definition:**

</details>

<details>
<summary>What is data-driven testing, and how can it be implemented?</summary>

### What is data-driven testing, and how can it be implemented?

**Definition:**

</details>


### Performance Testing

<details>
<summary>What is performance testing, and how does it differ from functional testing?</summary>

### What is performance testing, and how does it differ from functional testing?

**Definition:**

</details>

<details>
<summary>Describe the subtypes of performance testing (e.g., load, stress, capacity).</summary>

### Describe the subtypes of performance testing (e.g., load, stress, capacity).

**Definition:**

</details>

<details>
<summary>What are the key performance testing metrics?</summary>

### What are the key performance testing metrics?

**Definition:**

</details>

<details>
<summary>Explain how to set up a performance test.</summary>

### Explain how to set up a performance test.

**Definition:**

</details>

<details>
<summary>What tools can be used for performance testing, and what factors influence their selection?</summary>

### What tools can be used for performance testing, and what factors influence their selection?

**Definition:**

</details>

<details>
<summary>What is a performance bottleneck, and how is it identified and addressed?</summary>

### What is a performance bottleneck, and how is it identified and addressed?

**Definition:**

</details>

<details>
<summary>Explain the performance testing lifecycle.</summary>

### Explain the performance testing lifecycle.

**Definition:**

</details>


### Security Testing

<details>
<summary>What is security testing and why is it important?</summary>

### What is security testing and why is it important?

**Definition:**

</details>

<details>
<summary>Describe common security threats that testing should address.</summary>

### Describe common security threats that testing should address.

**Definition:**

</details>

<details>
<summary>What is OWASP, and why is it significant in security testing?</summary>

### What is OWASP, and why is it significant in security testing?

**Definition:**

</details>

<details>
<summary>Explain SQL injection and how you test for it.</summary>

### Explain SQL injection and how you test for it.

**Definition:**

</details>

<details>
<summary>How do you perform authentication and authorization checks in security testing?</summary>

### How do you perform authentication and authorization checks in security testing?

**Definition:**

</details>

<details>
<summary>What tools can be used for security testing?</summary>

### What tools can be used for security testing?

**Definition:**

</details>

<details>
<summary>What is penetration testing, and how is it executed?</summary>

### What is penetration testing, and how is it executed?

**Definition:**

</details>

<details>
<summary>What is the role of encryption and secure communication in testing?</summary>

### What is the role of encryption and secure communication in testing?

**Definition:**

</details>


### Mobile and Web Application Testing

<details>
<summary>How does mobile application testing differ from desktop application testing?</summary>

### How does mobile application testing differ from desktop application testing?

**Definition:**

</details>

<details>
<summary>Explain different types of mobile application testing, such as native, web, and hybrid.</summary>

### Explain different types of mobile application testing, such as native, web, and hybrid.

**Definition:**

</details>

<details>
<summary>What emulators are available for mobile testing, and when would you use real devices?</summary>

### What emulators are available for mobile testing, and when would you use real devices?

**Definition:**

</details>

<details>
<summary>What is responsive testing, and how is it conducted?</summary>

### What is responsive testing, and how is it conducted?

**Definition:**

</details>

<details>
<summary>Describe challenges unique to mobile application testing.</summary>

### Describe challenges unique to mobile application testing.

**Definition:**

</details>

<details>
<summary>What is cross-browser testing?</summary>

### What is cross-browser testing?

**Definition:**

</details>

<details>
<summary>What are the key areas to focus on in web application testing?</summary>

### What are the key areas to focus on in web application testing?

**Definition:**

</details>


### Test Automation Frameworks

<details>
<summary>What is a test automation framework?</summary>

### What is a test automation framework?

**Definition:**

</details>

<details>
<summary>Describe different types of test automation frameworks (e.g., data-driven, keyword-driven, hybrid, modular).</summary>

### Describe different types of test automation frameworks (e.g., data-driven, keyword-driven, hybrid, modular).

**Definition:**

</details>

<details>
<summary>What considerations are involved in choosing a test automation framework?</summary>

### What considerations are involved in choosing a test automation framework?

**Definition:**

</details>

<details>
<summary>How can you ensure maintainability of an automation framework?</summary>

### How can you ensure maintainability of an automation framework?

**Definition:**

</details>

<details>
<summary>How is reporting implemented in automation frameworks?</summary>

### How is reporting implemented in automation frameworks?

**Definition:**

</details>


### API Testing

<details>
<summary>What is API testing, and why is it important?</summary>

### What is API testing, and why is it important?

**Definition:**

</details>

<details>
<summary>How do you approach testing RESTful APIs?</summary>

### How do you approach testing RESTful APIs?

**Definition:**

</details>

<details>
<summary>Explain how to test SOAP-based web services.</summary>

### Explain how to test SOAP-based web services.

**Definition:**

</details>

<details>
<summary>What kind of tests would you write for an API?</summary>

### What kind of tests would you write for an API?

**Definition:**

</details>

<details>
<summary>Describe how to use Postman for API testing.</summary>

### Describe how to use Postman for API testing.

**Definition:**

</details>

<details>
<summary>What is contract testing, and which tools support this type of API testing?</summary>

### What is contract testing, and which tools support this type of API testing?

**Definition:**

</details>


### Quality Assurance Processes

<details>
<summary>What is quality assurance, and how does it differ from testing?</summary>

### What is quality assurance, and how does it differ from testing?

**Definition:**

</details>

<details>
<summary>Describe the QA process in agile development.</summary>

### Describe the QA process in agile development.

**Definition:**

</details>

<details>
<summary>Explain the role of a QA engineer in a scrum team.</summary>

### Explain the role of a QA engineer in a scrum team.

**Definition:**

</details>

<details>
<summary>What quality metrics are important for a software project?</summary>

### What quality metrics are important for a software project?

**Definition:**

</details>

<details>
<summary>How do you establish a QA process in an organization that has none?</summary>

### How do you establish a QA process in an organization that has none?

**Definition:**

</details>


### Advanced Testing Topics

<details>
<summary>What are the emerging trends in software testing, such as AI and ML applications?</summary>

### What are the emerging trends in software testing, such as AI and ML applications?

**Definition:**

</details>

<details>
<summary>How do you handle testing in a continuous delivery environment?</summary>

### How do you handle testing in a continuous delivery environment?

**Definition:**

</details>

<details>
<summary>Describe the concept of shift-left testing.</summary>

### Describe the concept of shift-left testing.

**Definition:**

</details>

<details>
<summary>What is chaos engineering, and how do you apply it?</summary>

### What is chaos engineering, and how do you apply it?

**Definition:**

</details>

<details>
<summary>Explain the role of virtualization in software testing.</summary>

### Explain the role of virtualization in software testing.

**Definition:**

</details>


### Behavioral Testing Questions

<details>
<summary>How do you stay updated about new testing technologies and practices?</summary>

### How do you stay updated about new testing technologies and practices?

**Definition:**

</details>

<details>
<summary>Describe a situation where you had to meet a tight deadline for testing. How did you handle it?</summary>

### Describe a situation where you had to meet a tight deadline for testing. How did you handle it?

**Definition:**

</details>

<details>
<summary>How do you handle disagreements with developers regarding bugs or software issues?</summary>

### How do you handle disagreements with developers regarding bugs or software issues?

**Definition:**

</details>

<details>
<summary>Can you explain your approach to testing a feature with unclear requirements?</summary>

### Can you explain your approach to testing a feature with unclear requirements?

**Definition:**

</details>

<details>
<summary>Describe a particularly challenging bug or issue you've had to deal with.</summary>

### Describe a particularly challenging bug or issue you've had to deal with.

**Definition:**

</details>


### Situation-based Testing Questions

<details>
<summary>How would you test an ATM machine as an end-user?</summary>

### How would you test an ATM machine as an end-user?

**Definition:**

</details>

<details>
<summary>Imagine you have a website that is experiencing performance issues. How would you test to find the cause?</summary>

### Imagine you have a website that is experiencing performance issues. How would you test to find the cause?

**Definition:**

</details>

<details>
<summary>Given an e-commerce application, how would you carry out security testing?</summary>

### Given an e-commerce application, how would you carry out security testing?

**Definition:**

</details>

<details>
<summary>How would you approach testing a new software application with no documentation available?</summary>

### How would you approach testing a new software application with no documentation available?

**Definition:**

</details>

<details>
<summary>Describe how you would test a new feature that interacts with multiple systems.</summary>

### Describe how you would test a new feature that interacts with multiple systems.

**Definition:**

</details>


### Technical Testing Questions

<details>
<summary>Write a basic SQL query to fetch records from a customer table where the customer's age is more than 30 years.</summary>

### Write a basic SQL query to fetch records from a customer table where the customer's age is more than 30 years.

**Definition:**

</details>

<details>
<summary>Given a function that calculates the nth Fibonacci number, how would you test it?</summary>

### Given a function that calculates the nth Fibonacci number, how would you test it?

**Definition:**

</details>
