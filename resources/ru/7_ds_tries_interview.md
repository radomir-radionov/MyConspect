# Trie — собеседование

Ответы заполнены для опубликованной части, остальные пустые.
[← К обзору](./7_special_data_structures.md)

### Related docs

- [Trie — собеседование](./7_ds_tries_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Trie Data Structure](https://devinterview.io/questions/data-structures-and-algorithms/trie-data-structure-interview-questions/).

### Understanding Tries

<details>
<summary>What is a Trie?</summary>

### What is a Trie?

**Definition:**

Trie — дерево символов. Каждое ребро — один символ, и путь от корня складывается в префикс или в целый ключ.

**How it works:**

- Узел держит отображение символа в ребёнка плюс флаг, что здесь кончается слово. Флаг нужен, потому что слово может быть префиксом другого.
- Вставка, поиск и проверка префикса идут по одному ребру на символ, поэтому ключ длины L стоит O(L) и не зависит от того, сколько других ключей не делят префикс.
- Общие префиксы делят узлы. В этом выигрыш памяти против хранения каждой строки отдельно, когда словарь пересекается.
- Размер алфавита решает, будет ли карта детей массивом, хеш-таблицей или отсортированным списком.

**Examples:**

Вставили `cat` и `car`. Узел `c → a` общий. `t` и `r` — разные дети, и оба помечены как концы слов.
</details>

<details>
<summary>What are the advantages of Tries over Hash Tables?</summary>

### What are the advantages of Tries over Hash Tables?

**Definition:**

Trie находит каждый ключ с заданным префиксом и может перечислить их по порядку. Хеш-таблица находит точный ключ и разбрасывает порядок.

**How it works:**

- Поиск по префиксу, автодополнение и самое длинное совпадение префикса — проход до узла префикса плюс обход поддерева.
- Нет столкновений хеша и нет коэффициента заполнения. Цена пропорциональна длине ключа.
- Упорядоченный обход — обход в глубину детей в порядке символов.
- Хеш-таблица меньше и быстрее для точного поиска длинных ключей без общих кусков. Trie платит узлом на символ.
</details>

<details>
<summary>What are Advantages and Disadvantages of a Trie?</summary>

### What are Advantages and Disadvantages of a Trie?

**Definition:**

Trie сильны на префиксах и общей структуре. Они тратят место, когда ключи почти не пересекаются или массив алфавита широкий и пустой.

**How it works:**

- Поиск — O(L) с маленькой константой, когда дети — массив. Неудачный поиск останавливается на первом отсутствующем ребре.
- Массив из 26 или 256 указателей на узел быстрый и в основном пустой. Хеш-карта детей плотнее и медленнее на шаг.
- Удаление снимает пометку слова и затем отрезает узлы, которые не являются концом слова и не имеют детей.
- Unicode и длинные случайные идентификаторы делают дерево глубоким или широким. Хеш-таблица или сжатое trie (radix) часто подходят лучше.
</details>

<details>
<summary>How do you handle the case sensitivity problem in Tries?</summary>

### How do you handle the case sensitivity problem in Tries?

**Definition:**

Алфавит решают до первой вставки. Либо складывают регистр на проходе, либо хранят оба регистра разными рёбрами.

**How it works:**

- Сложение в нижний регистр при вставке и при поиске делает `Cat` и `cat` одним словом. Делайте это Unicode case fold, не только ASCII `toLowerCase`, если словарь не английский.
- Сохранение регистра значит, что `C` и `c` — разные дети. Поиск чувствителен к регистру и совпадает с сохранённым написанием.
- Третий вариант хранит исходное написание в конечном узле и идёт по сложенному пути, так что автодополнение показывает `Cat`, а поиск регистр игнорирует.
- Смешение политик между вставкой и поиском — ошибка: один путь складывает регистр, другой нет, и слова нет.
</details>

### Applications and Use Cases of Tries

<details>
<summary>What are some Practical Applications of a Trie?</summary>

### What are some Practical Applications of a Trie?

**Definition:**

Trie используют там, где следующий символ сужает множество строк.

**How it works:**

- Автодополнение и проверка орфографии идут по префиксу и затем обходят поддерево.
- Самое длинное совпадение префикса в маршрутизаторе идёт по битам адреса до самого глубокого помеченного префикса.
- Словарь в словесной игре проверяет префикс, прежде чем удлинять путь.
- T9 и некоторые токенизаторы используют то же дерево символов. Точный поиск случайных UUID обычно нет.
</details>

<details>
<summary>Describe how a Trie can be used for implementing autocomplete functionality.</summary>

### Describe how a Trie can be used for implementing autocomplete functionality.

**Definition:**

Автодополнение проходит уже набранные символы, затем собирает флаги конца слова в этом поддереве, обычно первые k в отсортированном порядке.

**How it works:**

- Если проход умирает на отсутствующем ребре, подсказок нет.
- Обход детей в глубину в алфавитном порядке даёт подсказки по словарю. Остановка после k попаданий.
- Частота в конечном узле позволяет держать маленькую кучу лучших k вместо алфавитных k.
- Проход — O(L + вывод). Заранее посчитанные лучшие подсказки на каждом узле ускоряют запрос и замедляют обновление.

**Examples:**

Словарь `car`, `card`, `cat`. Префикс `ca` садится на общий узел. Обход находит `car`, `card` и `cat`.
</details>

<details>
<summary>Explain the use of a Trie in IP Routing to match IP prefixes.</summary>

### Explain the use of a Trie in IP Routing to match IP prefixes.

**Definition:**

Trie маршрутизации идёт по битам адреса назначения и помнит самый глубокий префикс, помеченный как маршрут.

**How it works:**

- Каждое ребро — бит или шаг из нескольких битов. Помеченный узел хранит следующий прыжок для этого префикса.
- Поиск не останавливается на первой пометке. Более длинный совпавший префикс перекрывает более короткий. Последняя пометка на проходе — ответ.
- Если проход не может продолжиться, а пометка была выше, этот более короткий префикс всё ещё совпадает.
- Сжатое radix-дерево (Patricia) схлопывает цепочки из одного ребёнка. Так таблицы пересылки остаются маленькими.

**Examples:**

Маршруты `10.0.0.0/8` и `10.1.0.0/16`. Адрес `10.1.2.3` проходит обе пометки и берёт `/16`. Адрес `10.2.2.3` не может идти по `/16` и сохраняет `/8`.
</details>

<details>
<summary>How is a Trie used in text spell-checking and correction systems?</summary>

### How is a Trie used in text spell-checking and correction systems?

**Definition:**

Словарь — это trie. Слово верно, если проход кончается на флаге слова. Подсказки — слова в маленьком расстоянии редактирования от пути, который оборвался.

**How it works:**

- Точная проверка — один проход длины L.
- Исправление пробует удаления, вставки, замены и иногда перестановки и отсекает ветку, когда оставшегося бюджета правок не хватит до слова.
- Общие префиксы значат, что неверный хвост не начинает поиск заново для каждого слова словаря.
- Частота в конечном узле ставит `teh` → `the` выше редкого слова на том же расстоянии.
</details>

### Implementation and Operations in Tries

<details>
<summary>Name some Trie Implementation strategies.</summary>

### Name some Trie Implementation strategies.

**Definition:**

Карта детей — это выбор реализации. Алгоритм прохода остаётся тем же.

**How it works:**

- Фиксированный массив по символу самый быстрый для маленького алфавита и самый расточительный, когда большинство слотов пусты.
- Хеш-карта на узел компактна для разреженного Unicode и добавляет хеширование на каждом шаге.
- Отсортированный вектор детей компактен и делает упорядоченные обходы естественными. Поиск внутри узла логарифмичен по числу детей.
- Radix-дерево сжимает цепочки из одного ребёнка в одно ребро с подписью-строкой. Троичное дерево поиска хранит один символ и три ссылки.
</details>

<details>
<summary>Write the code to insert a word into a Trie.</summary>

### Write the code to insert a word into a Trie.

**Definition:**

Начинают от корня и для каждого символа создают ребёнка, если его нет, затем переходят к нему. Последний узел помечают как слово.

**How it works:**

- Создание отсутствующих рёбер выделяет путь при первой вставке префикса.
- Вторая вставка того же слова только снова ставит флаг конца.
- Промежуточные узлы не помечают, если более короткую строку тоже не вставляли.
- Время — O(L) обращений к детям, умноженное на цену карты.

**Examples:**

```text
def insert(root, word):
    node = root
    for ch in word:
        node = node.children.setdefault(ch, Node())
    node.is_word = True
```
</details>

<details>
<summary>Implement a Search function to determine if a word is included in a Trie.</summary>

### Implement a Search function to determine if a word is included in a Trie.

**Definition:**

Идут по символам. Если какого-то ребра нет, слова нет. Если проход закончился, узел должен быть помечен как слово, а не просто как префикс.

**How it works:**

- `startsWith` возвращает истину в конце прохода, даже когда флаг конца ложен.
- Поиск возвращает ложь для собственного префикса вставленного слова.
- Пустое слово есть, только если помечен сам корень. Эту политику надо решить.
- Проход — O(L).

**Examples:**

```text
def search(root, word):
    node = root
    for ch in word:
        node = node.children.get(ch)
        if node is None:
            return False
    return node.is_word
```

`car` находится. `ca` проходит успешно и возвращает ложь, если вставляли только `car`.
</details>

<details>
<summary>Write a script to Delete a word from a Trie.</summary>

### Write a script to Delete a word from a Trie.

**Definition:**

Снимают пометку конечного узла, затем на обратном пути удаляют узлы, пока у них нет детей и они не являются концом другого слова.

**How it works:**

- Если слово — только префикс более длинного, снятия флага достаточно. Узлы остаются, потому что более длинное слово ими пользуется.
- Если у узла ещё есть другие дети, обрезку там останавливают.
- Если слово не вставляли, проход не удаётся и trie не меняется.
- Рекурсивное удаление возвращает, был ли ребёнок удалён, чтобы родитель выкинул эту запись карты.

**Examples:**

```text
def delete(node, word, i=0):
    if i == len(word):
        if not node.is_word:
            return False
        node.is_word = False
        return len(node.children) == 0
    ch = word[i]
    child = node.children.get(ch)
    if child is None or not delete(child, word, i + 1):
        return False
    del node.children[ch]
    return not node.is_word and len(node.children) == 0
```
</details>

### Trie Variants and Comparison with Other Data Structures

<details>
<summary>Compare Trie vs. Binary Search Tree.</summary>

### Compare Trie vs. Binary Search Tree.

**Definition:**

Trie ветвится по следующему символу. BST ветвится по сравнению целого ключа.

**How it works:**

- Поиск в trie — O(L). Поиск в BST — O(L · высота), если каждое сравнение сканирует строку, или O(высота), если ключи интернированы.
- Trie даёт запросы по префиксу даром. BST целых строк даёт предшественника и преемника полного ключа, а запросы по префиксу требуют дополнительной заботы.
- У сбалансированного BST высота логарифмична от числа ключей. Глубина trie равна самому длинному ключу, и это может быть больше или меньше log n.
- Trie тратит память на символы. BST тратит память на указатели ключей и поля баланса.
</details>

<details>
<summary>How to choose between a Hash Table and a Trie?</summary>

### How to choose between a Hash Table and a Trie?

**Definition:**

Хеш-таблицу выбирают для точного поиска непрозрачных ключей. Trie — когда запрос сам состоит из символов, особенно из префиксов.

**How it works:**

- Поиск в хеше — ожидаемые O(L) на хеширование ключа плюс O(1) в таблице, с хвостом столкновений. Поиск в trie — O(L) без хвоста столкновений и с большей константой, если карта широкая.
- Автодополнение, самый длинный префикс и перечисление по словарю указывают на trie.
- Случайные идентификаторы, ключи кэша и записи по первичному ключу указывают на хеш-таблицу.
- Radix или Patricia — компромисс, когда нужны префиксы без узла на каждый символ.
</details>

<details>
<summary>What is a Suffix Trie, and how does it differ from a standard Trie?</summary>

### What is a Suffix Trie, and how does it differ from a standard Trie?

**Definition:**

Суффиксное trie вставляет каждый суффикс одного текста, поэтому любая подстрока является префиксом какого-то суффикса и находится проходом.

**How it works:**

- Обычное trie хранит словарь отдельных слов. Суффиксное trie хранит суффиксы одной строки, часто с индексом, где этот суффикс начинается.
- В наивном виде узлов O(n²). Суффиксное дерево сжимает унарные пути и имеет O(n) узлов. Суффиксный массив хранит отсортированные суффиксы в O(n) целых.
- Поиск образца длины m — O(m) в trie или дереве после построения и сообщает каждое вхождение через листья под этим узлом.
- Используйте его для многих запросов к фиксированному тексту. Для одного поиска КМП — меньше механизма.

**Examples:**

Текст `banana`. Суффикс `ana` вставлен, поэтому образец `ana` идёт по этому пути и может сообщить начальные индексы 1 и 3.
</details>

<details>
<summary>How does a Compressed Trie or Radix Tree improve on a standard Trie structure?</summary>

### How does a Compressed Trie or Radix Tree improve on a standard Trie structure?

**Definition:**

</details>

### Advanced Operations in Tries

<details>
<summary>Find the longest common prefix among a set of strings using a Trie.</summary>

### Find the longest common prefix among a set of strings using a Trie.

**Definition:**

</details>

<details>
<summary>Implement an algorithm to count the total number of words stored in a Trie.</summary>

### Implement an algorithm to count the total number of words stored in a Trie.

**Definition:**

</details>

<details>
<summary>List all words with a given prefix stored in a Trie.</summary>

### List all words with a given prefix stored in a Trie.

**Definition:**

</details>

<details>
<summary>Write an algorithm for the word search in a matrix grid using a Trie.</summary>

### Write an algorithm for the word search in a matrix grid using a Trie.

**Definition:**

</details>

### Optimization and Efficiency

<details>
<summary>How can using a Trie reduce the time complexity of searching for a word in a dataset?</summary>

### How can using a Trie reduce the time complexity of searching for a word in a dataset?

**Definition:**

</details>

<details>
<summary>Discuss the space optimizations that can be made in a Trie.</summary>

### Discuss the space optimizations that can be made in a Trie.

**Definition:**

</details>

<details>
<summary>What is Memory Pooling, and how can it make Trie operations more efficient?</summary>

### What is Memory Pooling, and how can it make Trie operations more efficient?

**Definition:**

</details>

### Implementation Challenges

<details>
<summary>How would you serialize and deserialize a trie?</summary>

### How would you serialize and deserialize a trie?

**Definition:**

</details>

<details>
<summary>Implement a Trie that supports wildcard characters ‘?’ and ‘*’ for pattern matching.</summary>

### Implement a Trie that supports wildcard characters ‘?’ and ‘*’ for pattern matching.

**Definition:**

</details>

<details>
<summary>Implement a Trie backed Subsequence Indexing system for a rapid text searching.</summary>

### Implement a Trie backed Subsequence Indexing system for a rapid text searching.

**Definition:**

</details>

<details>
<summary>Design a Trie that supports insert, search, and startsWith operations efficiently.</summary>

### Design a Trie that supports insert, search, and startsWith operations efficiently.

**Definition:**

</details>

<details>
<summary>How can a Balanced Trie be achieved, and what are the factors affecting the balance?</summary>

### How can a Balanced Trie be achieved, and what are the factors affecting the balance?

**Definition:**

</details>
