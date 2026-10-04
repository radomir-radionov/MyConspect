# Hash Tables — собеседование

Ответы заполнены для опубликованной части, остальные пустые.
[← К обзору](./7_special_data_structures.md)

### Related docs

- [Hash Tables — собеседование](./7_ds_hash_tables_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Hash Tables](https://devinterview.io/questions/data-structures-and-algorithms/hash-table-data-structure-interview-questions/).

### Basic Hash Table Concepts

<details>
<summary>What is a Hash Table?</summary>

### What is a Hash Table?

**Definition:**

Хеш-таблица хранит пары ключ-значение в массиве и хеш-функцией превращает ключ в индекс корзины.

**How it works:**

- Поиск, вставка и удаление ожидаемо O(1), когда ключи размазаны по корзинам. Одна перегруженная корзина делает эти операции O(n).
- Два ключа могут дать один индекс. Таблице нужна политика столкновений: цепочка или другой слот массива.
- Коэффициент заполнения — число ключей, делённое на число корзин. Рост массива и повторное хеширование держат это отношение в выбранном диапазоне.
- Ключу нужны стабильный хеш и проверка равенства. Изменяемый ключ, который поменял хеш после вставки, теряется.

**Examples:**

Корзин 8. Ключ `"tea"` хешируется в 3 и лежит в корзине 3. Поздний поиск снова хеширует `"tea"` и находит этот слот.
</details>

<details>
<summary>What is Hashing?</summary>

### What is Hashing?

**Definition:**

Хеширование отображает ключ любого размера в целое фиксированного размера, а затем обычно сводит это целое к индексу корзины.

**How it works:**

- Хеш пароля или файла — отпечаток. Хеш внутри таблицы — функция индекса. Слово одно, требования разные.
- Для таблицы равные ключи обязаны давать равный хеш, а неравные должны размазываться. Криптографический хеш медленнее, чем нужно таблице.
- Индекс часто равен `hash(key) по модулю ёмкости` или маске, когда ёмкость — степень двойки.
- Хеш — не шифрование. Его не задумывали обращать, а хеш таблицы не обязан сопротивляться атакующему, пока вы этого не потребовали.
</details>

<details>
<summary>Explain the difference between Hashing and Hash Tables.</summary>

### Explain the difference between Hashing and Hash Tables.

**Definition:**

Хеширование — функция из ключа в целое. Хеш-таблица — структура, которая хранит пары и разрешает столкновения с помощью этой функции.

**How it works:**

- Хешировать можно без таблицы: контрольные суммы, адреса по содержимому, наборы подписей.
- Таблица добавляет корзины, стратегию столкновений, коэффициент заполнения и повторное хеширование.
- Плохая функция портит хорошую таблицу. Идеальная функция всё равно нуждается в месте для значения и в плане роста.
- Множества и отображения стандартных библиотек — хеш-таблицы или деревья, которые прячут функцию.
</details>

<details>
<summary>Provide a simple example of a Hash Function.</summary>

### Provide a simple example of a Hash Function.

**Definition:**

Учебный хеш сворачивает байты ключа в одно целое, затем сводит его к числу корзин.

**How it works:**

- Полиномиальный хеш считает символы цифрами: `h = h × 31 + code` для каждого символа в фиксированной ширине целого.
- Множитель размазывает близкие строки. Множитель 1 просто суммирует коды и сталкивает анаграммы.
- Корзина — `h по модулю ёмкости`. Если `h` может быть отрицательным, берут неотрицательный остаток.
- Это не криптографический хеш. Он быстрый и достаточен, когда ключи выбирает не атакующий.

**Examples:**

```text
"ab" с множителем 31:
h = 0
h = 31 + 'a'
h = h * 31 + 'b'
корзина = h % 8
```
</details>

<details>
<summary>How do hash tables work under the hood, specifically in languages like Java, Python, and C++?</summary>

### How do hash tables work under the hood, specifically in languages like Java, Python, and C++?

**Definition:**

Стандартные отображения — это корзины плюс опубликованные хеш и равенство ключа, с ростом, когда заполнение пересекает порог.

**How it works:**

- Java `HashMap` цепляет записи. В текущих JDK длинная цепочка становится деревом, чтобы атака столкновениями была O(log n), а не O(n). Индекс мешает `hashCode` ключа. Ключ null допускается один раз.
- `dict` в Python — открытая адресация в разреженном массиве индексов, который указывает на плотную таблицу записей. Порядок вставки запоминается. Хеш солят на процесс.
- C++ `std::unordered_map` обычно — цепочки корзин. `hash` и `equal_to` — параметры шаблона. Худшая сложность может быть линейной.
- Все три перехешируют в большую таблицу. Итераторы и ссылки этот рост может инвалидировать, по правилам языка.
</details>

### Hash Functions and Collisions

<details>
<summary>What are Hash Collisions?</summary>

### What are Hash Collisions?

**Definition:**

Столкновение — два разных ключа, чьи хеши сводятся к одной корзине.

**How it works:**

- Принцип Дирихле: столкновения неизбежны, когда возможных ключей больше, чем корзин.
- Таблица всё равно должна вернуть верное значение, поэтому после совпадения хеша она сравнивает ключи на равенство.
- Несколько столкновений нормальны. Хеш, который сваливает все ключи в одну корзину, превращает таблицу в список.
- Атакующий, который подбирает ключи в одну корзину, делает поиск линейным, пока реализация не рандомизирует хеш или не превращает цепочку в дерево.

**Examples:**

Ёмкость 4. `"a"` и `"e"` оба попадают в корзину 1. Равенство затем различает их внутри этой корзины.
</details>

<details>
<summary>Name some Collision Handling Techniques.</summary>

### Name some Collision Handling Techniques.

**Definition:**

Два семейства: цепочки, которые хранят несколько ключей в одной корзине, и открытая адресация, которая хранит один ключ в слоте и ищет другой слот пробой.

**How it works:**

- Раздельные цепочки: каждая корзина — список или небольшое дерево.
- Открытая адресация: линейное пробирование, квадратичное пробирование или двойное хеширование идут по массиву, пока не найдут пустой слот.
- Robin Hood и кукушка — варианты открытой адресации, которые иначе ограничивают длину пробы.
- Идеальное хеширование строит функцию без столкновений для замороженного набора ключей. Растущему отображению оно не подходит.
</details>

<details>
<summary>Describe the characteristics of a good hash function.</summary>

### Describe the characteristics of a good hash function.

**Definition:**

Хороший хеш для таблицы быстрый, детерминированный и размазывает ключи так, чтобы корзины оставались короткими.

**How it works:**

- Равные ключи дают один хеш. Если равенство говорит, что два ключа совпали, их хеши обязаны совпасть.
- Изменение одного бита ключа должно сильно двигать хеш, чтобы похожие строки не делили корзину.
- Функция должна быть дешёвой рядом с остальным поиском. Криптографический хеш — неверный умолчательный выбор для отображения в памяти.
- Для недоверенных ключей секретное зерно мешает атакующему заранее вычислить одну корзину. Зерно должно быть постоянным, пока жива таблица.
</details>

<details>
<summary>What is Separate Chaining, and how does it handle collisions?</summary>

### What is Separate Chaining, and how does it handle collisions?

**Definition:**

Раздельные цепочки дают каждой корзине свою маленькую коллекцию. Ключи, которые хешируются туда, дописываются в эту коллекцию.

**How it works:**

- Вставка хеширует в корзину и идёт по цепочке в поисках равного ключа. Совпадение обновляет значение. Промах дописывает узел.
- Поиск и удаление идут по той же цепочке и сравнивают ключи, не только хеши.
- Связный список — простая цепочка. Длинную цепочку можно превратить в дерево, как Java делает после порога.
- Цепочки упрощают удаление и терпят коэффициент заполнения выше 1. Они платят лишним указателем на запись и лишним выделением.

**Examples:**

Корзина 2 держит `("cat", 1) -> ("car", 4)`. Поиск `"car"` хеширует в 2, пропускает `"cat"` и возвращает 4.
</details>

<details>
<summary>Explain Open Addressing and its different probing techniques.</summary>

### Explain Open Addressing and its different probing techniques.

**Definition:**

Открытая адресация хранит каждую запись в массиве корзин. При столкновении смотрят другие индексы по последовательности пробы, пока не найдут ключ или пустой слот.

**How it works:**

- Линейное пробирование пробует `index + 1`, `index + 2` и так далее по модулю ёмкости. Оно дружелюбно к кэшу и образует кластеры.
- Квадратичное пробирование пробует `index + i²`. Оно размазывает кластеры и может пропустить пустые слоты, если ёмкость и шаг выбраны так, что проба не попадает во все индексы.
- Двойное хеширование берёт шаг из второго хеша, поэтому разные ключи с одним стартовым индексом идут разными последовательностями.
- Удаление не может оставить по-настоящему пустой слот в середине цепочки пробы, иначе поздний поиск остановится слишком рано. Надгробие помечает «иди дальше, но слот можно занять снова».

**Examples:**

Линейная проба, ёмкость 5, оба ключа хотят слот 1. Второй ключ лежит в слоте 2. Его поиск проверяет 1, видит другой ключ, затем проверяет 2.
</details>

### Complexity and Performance

<details>
<summary>Explain the Time and Space Complexity of a Hash Table.</summary>

### Explain the Time and Space Complexity of a Hash Table.

**Definition:**

Средние вставка, поиск и удаление — O(1). Худший случай — O(n), когда все ключи столкнулись. Память пропорциональна числу корзин плюс числу записей.

**How it works:**

- Ожидаемые O(1) предполагают хеш, который размазывает ключи, и коэффициент заполнения, который повторным хешированием держат ниже константы.
- Одно повторное хеширование копирует каждую запись и стоит O(n). На серии вставок это амортизированные O(1) на вставку.
- Цепочки тратят лишние указатели. Открытая адресация тратит пустые слоты, поэтому массив больше числа записей.
- Обход для многих раскладок — O(ёмкость + n), не O(n), потому что пустые корзины тоже посещают.
</details>

<details>
<summary>What is a Load Factor in the context of Hash Tables?</summary>

### What is a Load Factor in the context of Hash Tables?

**Definition:**

Коэффициент заполнения — `n / ёмкость`: сколько записей в среднем сидит на корзину.

**How it works:**

- Низкий коэффициент — короткие цепочки или короткие пробы и больше пустой памяти. Высокий — больше столкновений.
- У Java `HashMap` по умолчанию 0.75. Открытая адресация обычно держится ниже, потому что пробы длиннеют по мере заполнения массива.
- Пересечение порога выделяет больший массив, часто примерно вдвое, и вставляет каждый ключ заново.
- Коэффициент — среднее. Плохой хеш может перегрузить одну корзину, пока среднее всё ещё выглядит нормально.
</details>

<details>
<summary>How does the load factor affect performance in a hash table?</summary>

### How does the load factor affect performance in a hash table?

**Definition:**

Когда коэффициент заполнения растёт, ожидаемая длина цепочки или пробы растёт, и каждая операция делает больше сравнений ключей.

**How it works:**

- При цепочках и приличном хеше ожидаемая длина цепочки около коэффициента. Поиск остаётся O(1), пока коэффициент — константа, с большей константой при коэффициенте 2, чем при 0.5.
- При открытой адресации длина пробы резко растёт, когда коэффициент подходит к 1. Полная таблица не может вставить.
- Повторное хеширование меняет редкую копию O(n) на возврат к коротким операциям. Слишком часто — трата времени. Слишком поздно — трата сравнений.
- Поведение кэша тоже меняется: огромная разреженная таблица чаще промахивается, чем более плотная, даже если математика пробы выглядит лучше.
</details>

<details>
<summary>Discuss different ways to resize a hash table. What is the complexity involved?</summary>

### Discuss different ways to resize a hash table. What is the complexity involved?

**Definition:**

Изменение размера выделяет новый массив корзин и вставляет в него каждый существующий ключ, потому что индексы зависят от ёмкости.

**How it works:**

- Обычный рост — удвоение. Новый индекс — `хеш по модулю новой ёмкости`, а не сдвиг старого индекса, если только хеш и маска степени двойки не задуманы именно так.
- Одно изменение размера — O(n). Если удваивать каждый раз, когда коэффициент пересекает константу, копии на n вставок суммируются в O(n), и каждая вставка платит амортизированные O(1).
- Рост на постоянное число слотов, например +10, делает суммарную цену копирования квадратичной.
- Постепенное перехеширование переносит несколько старых корзин на каждой операции, чтобы одна вставка не вставала копировать всё. Установившаяся цена всё равно амортизированные O(1).
</details>

<details>
<summary>How can the choice of a hash function impact the efficiency of a hash table?</summary>

### How can the choice of a hash function impact the efficiency of a hash table?

**Definition:**

Хеш решает корзину. Функция, которая сваливает ключи в кучу, заставляет каждую операцию идти по длинной цепочке, каким бы большим ни был массив.

**How it works:**

- Функция, которая смотрит только первый символ, кладёт все слова на одну букву в одну корзину.
- Медленная функция, например криптографический дайджест короткого ключа в памяти, доминирует в поиске, даже когда корзины короткие.
- Функция, которая игнорирует часть составного ключа, сталкивает объекты, различающиеся только в забытом поле.
- Смена функции требует полного перехеширования. Подмешивание зерна — обычное лечение, когда ключи враждебные.

**Examples:**

Ключи `"a1"`, `"a2"`, `"a3"` с хешем только первого символа все попадают в корзину `'a'`. Поиск любого из них сканирует всю цепочку.
</details>

### Cryptographic Hashing

<details>
<summary>What is the difference between a Hash Function and a Cryptographic Hash Function?</summary>

### What is the difference between a Hash Function and a Cryptographic Hash Function?

**Definition:**

</details>

<details>
<summary>What is the role of a Salt in Cryptographic Hashing?</summary>

### What is the role of a Salt in Cryptographic Hashing?

**Definition:**

</details>

<details>
<summary>Explain Types of Resistance in Cryptographic Hash Functions.</summary>

### Explain Types of Resistance in Cryptographic Hash Functions.

**Definition:**

</details>

<details>
<summary>What is MD5?</summary>

### What is MD5?

**Definition:**

</details>

<details>
<summary>What vulnerabilities exist in Hashing Algorithms like MD5 and SHA1?</summary>

### What vulnerabilities exist in Hashing Algorithms like MD5 and SHA1?

**Definition:**

</details>

### Hash Table Usage and Applications

<details>
<summary>Detect if a List is Cyclic using a Hash Table.</summary>

### Detect if a List is Cyclic using a Hash Table.

**Definition:**

</details>

<details>
<summary>Remove Duplicates from an Unsorted Linked List using a hash table.</summary>

### Remove Duplicates from an Unsorted Linked List using a hash table.

**Definition:**

</details>

<details>
<summary>Find Common Elements in two given Linked Lists and return them as a new Linked List using a hash table.</summary>

### Find Common Elements in two given Linked Lists and return them as a new Linked List using a hash table.

**Definition:**

</details>

<details>
<summary>Pair socks from a pile using a Hash Table.</summary>

### Pair socks from a pile using a Hash Table.

**Definition:**

</details>

<details>
<summary>How can hash tables be used in caching implementations? Describe a typical use case.</summary>

### How can hash tables be used in caching implementations? Describe a typical use case.

**Definition:**

</details>

<details>
<summary>Write an algorithm using a hash table to check if two strings are anagrams of each other.</summary>

### Write an algorithm using a hash table to check if two strings are anagrams of each other.

**Definition:**

</details>

<details>
<summary>Implement Autocomplete functionality using Hash Tables.</summary>

### Implement Autocomplete functionality using Hash Tables.

**Definition:**

</details>

<details>
<summary>Describe how a hash table can be used in the implementation of a CDN.</summary>

### Describe how a hash table can be used in the implementation of a CDN.

**Definition:**

</details>

### Hash Table Structures and Variants

<details>
<summary>What is the difference between HashMaps and HashTables in context of Java’s data structures?</summary>

### What is the difference between HashMaps and HashTables in context of Java’s data structures?

**Definition:**

</details>

<details>
<summary>Explain Cuckoo Hashing and when it is advantageous to use.</summary>

### Explain Cuckoo Hashing and when it is advantageous to use.

**Definition:**

</details>

<details>
<summary>What are Skip Lists and how do they compare to hash tables?</summary>

### What are Skip Lists and how do they compare to hash tables?

**Definition:**

</details>

<details>
<summary>Discuss the concept of a Dynamic Perfect Hash Table.</summary>

### Discuss the concept of a Dynamic Perfect Hash Table.

**Definition:**

</details>

<details>
<summary>In what scenarios would you use a Bloom Filter, and how does it relate to hash tables?</summary>

### In what scenarios would you use a Bloom Filter, and how does it relate to hash tables?

**Definition:**

</details>

### Advanced Hash Table Questions

<details>
<summary>What is the Pigeonhole Principle and how does it relate to hashing?</summary>

### What is the Pigeonhole Principle and how does it relate to hashing?

**Definition:**

</details>

<details>
<summary>What are the advantages of Tries over Hash Tables?</summary>

### What are the advantages of Tries over Hash Tables?

**Definition:**

</details>

<details>
<summary>Explain Robin Hood Hashing and its impact on performance and collision resolution.</summary>

### Explain Robin Hood Hashing and its impact on performance and collision resolution.

**Definition:**

</details>

<details>
<summary>What is Linear Hashing and how can it be used to handle growing datasets?</summary>

### What is Linear Hashing and how can it be used to handle growing datasets?

**Definition:**

</details>

<details>
<summary>How are hash tables applied in distributed systems, for example, in consistent hashing algorithms?</summary>

### How are hash tables applied in distributed systems, for example, in consistent hashing algorithms?

**Definition:**

</details>

<details>
<summary>Describe a situation where you would use a hash table over a binary search tree, and why.</summary>

### Describe a situation where you would use a hash table over a binary search tree, and why.

**Definition:**

</details>
