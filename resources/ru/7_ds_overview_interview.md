# Data Structures — собеседование

Ответы в этом конспекте заполнены.
[← К обзору](./7_special_data_structures.md)

### Related docs

- [Data Structures — собеседование](./7_ds_overview_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/).

### Arrays and Strings

<details>
<summary>Explain how you would reverse an array in place.</summary>

### Explain how you would reverse an array in place.

**Definition:**

Обратная перестановка на месте изменяет исходный массив без использования дополнительного пространства.

**Examples:**

Вот реализация общего назначения:

Пример кода: Обратный порядок массива

Вот код на Python:

```python
def reverse_array(arr):
    start, end = 0, len(arr) - 1
    while start < end:
        arr[start], arr[end] = arr[end], arr[start]
        start, end = start + 1, end - 1
        
my_array = [1, 2, 3, 4, 5]
print("Original Array:", my_array)
reverse_array(my_array)
print("Reversed Array:", my_array)
```

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>What is the difference between an array and a linked list?</summary>

### What is the difference between an array and a linked list?

**Definition:**

Позвольте мне поставить два основных типа списков, массивы и связанные списки, в перспективу.

**How it works:**

Ключевые отличия

Организация данных

- **Массив**: Использует последовательное размещение в памяти, и каждый элемент имеет уникальный индекс.
- **Связанный список**: Элементы разбросаны в памяти и к ним осуществляется последовательный доступ через ссылки (указатели).

Управление памятью

- **Массив**: Обычно требует одного непрерывного блока памяти.
- **Связанный список**: Выделение памяти динамическое и не является смежным.

Анализ сложности

| Операция | Массив | Связанный список |
| --- | --- | --- |
| Доступ | `O(1)` (с индексом) | `O(n)` |
| Массовая вставка | `O(n) или O(1)` | `O(1)` |
| Удаление | `O(n) до O(1)` | `O(1)` |

**When to use:**

Когда использовать каждый

Массивы предпочтительнее, когда:

Есть необходимость в прямом или случайном доступе, как в таблицах поиска.
Данные останутся относительно неизменными, и производительность при доступе к элементам имеет приоритет над частыми вставками или удалениями.

Связанные списки более подходят, когда:

Ожидаются частые вставки и удаления, особенно в середине.
Точный размер списка заранее неизвестен, и вы хотите, чтобы память использовалась гибко.
Основные операции являются последовательными, такими как итерация от начала до конца.

**Examples:**

Пример кода: массив против связного списка

Вот код на Python:

Массив

```python
# Define array
my_array = [10, 20, 30, 40, 50]

# Access element by index
print(my_array[2])  # Output: 30

# Bulk insertion at the beginning
my_array = [5, 6, 7] + my_array
print(my_array)  # Output: [5, 6, 7, 10, 20, 30, 40, 50]

# Deletion from the middle
del my_array[4]
print(my_array)  # Output: [5, 6, 7, 10, 30, 40, 50]
```

Связанный список

```python
# Define linked list nodes (in reality, you'd have a LinkedList class)
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

# Create linked list
head = Node(10)
node1 = Node(20)
node2 = Node(30)
head.next = node1
node1.next = node2

# Bulk insertion at the beginning
new_node1 = Node(5)
new_node2 = Node(6)
new_node3 = Node(7)
new_node3.next = head
head = new_node1
new_node1.next = new_node2
print_nodes(head)  # Output: 5, 6, 7, 10, 20, 30

# Deletion from the middle
new_node1.next = new_node3
# Now, just print_nodes(head) will output: 5, 6, 7, 20, 30
```

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>How would you check for duplicates in an array without using extra space?</summary>

### How would you check for duplicates in an array without using extra space?

**Definition:**

Проверка массива на дубликаты без использования дополнительной памяти является распространённой задачей с решениями, использующими хэш-функции, сортировку и математические вычисления.

**How it works:**

Метод грубой силы

Код проверяет наличие дубликатов на основе числового повторения.

Анализ сложности

Временная сложность: `O(n^2)`

Пространственная сложность: `O(1)`

Подход к сортировке

Этот метод включает сортировку массива с использованием алгоритма сортировки на основе сравнения, такого как быстрая сортировка. Если два соседних элемента одинаковы, значит, в массиве есть дубликаты.

Анализ сложности

Временная сложность: Лучший/Худший: `O(n log n)`

- **Пространственная сложность**: `O(1) или O(n)` в зависимости от алгоритма сортировки

Математический подход

Для этого метода вычисляется сумма чисел в массиве. Математически, если дубликатов нет, сумма последовательных натуральных чисел может быть вычислена для сравнения с фактической суммой.

Если

`actual sum − sum of numbers in the array = 0`
, дубликатов нет.

**Examples:**

Реализация кода

Вот код на Python:

```python
def has_duplicates(arr):
    n = len(arr)
    for i in range(n):
        for j in range(i+1, n):
            if arr[i] == arr[j]:
                return True
    return False

arr = [1, 2, 3, 4, 3]
print(has_duplicates(arr))  # Output: True
```

Реализация кода

Вот код на Python:

```python
def has_duplicates_sorted(arr):
    arr.sort()
    n = len(arr)
    for i in range(n - 1):
        if arr[i] == arr[i+1]:
            return True
    return False

arr = [1, 2, 3, 4, 3]
print(has_duplicates_sorted(arr))  # Output: True
```

Реализация кода

Вот код на Python:

```python
def has_duplicates_math(arr):
    array_sum = sum(arr)
    n = len(arr)
    expected_sum = (n * (n-1)) // 2  # Sum of first (n-1) natural numbers
    return array_sum - expected_sum != 0

arr = [1, 2, 3, 4, 5, 5]
print(has_duplicates_math(arr))  # Output: True
```

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>Can you explain how to perform a binary search on a sorted array?</summary>

### Can you explain how to perform a binary search on a sorted array?

**Definition:**

Давайте рассмотрим стратегию высокого уровня за бинарным поиском, а затем пройдем пошаговый пример.

**How it works:**

Стратегия бинарного поиска

- **Разделяй и властвуй**: Начните с всего отсортированного массива и уточняйте диапазон поиска на каждом шаге.
- **Сравнение**: Используйте средний элемент, чтобы определить следующий диапазон поиска.
- **Повторение**: Продолжайте делить массив, пока не будет найден целевой элемент или пока диапазон поиска не станет пустым.

Пошаговый пример

Рассмотрим следующий массив с целевым значением 17:

```text
[1, 3, 6, 7, 9, 12, 15, 17, 20, 21]
```

- **Начальные указатели**: Начинаем с всего массива.

```text
[1, 3, 6, 7, 9, 12, 15, 17, 20, 21]
^                               ^
Low                             High
```

- **Среднее**: (Низ + Выс) / 2 = 5
Это определяет среднее число как 12.

- **Сравнение**: Поскольку среднее число меньше целевого значения 17, мы можем отбросить левую часть массива.

```text
[15, 17, 20, 21]
^           ^
Low        High
```

- **Обновленные указатели**: Теперь у нас есть уменьшенный массив для поиска.

Средний = 7
```text
^      ^
Low   High
```

Итоговое сравнение:

Поскольку среднее число теперь является целью, 17, поиск успешно завершен.

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>How would you rotate a two-dimensional array by 90 degrees?</summary>

### How would you rotate a two-dimensional array by 90 degrees?

**Definition:**

Вращение 2D массива на

`90°` можно визуально понять как транспонирование, за которым следует обратный порядок строк или столбцов.

Алгоритм: Транспонировать и Обратить

- **Транспонировать**: Обменять каждый элемент `A[i][j]` с его аналогом `A[j][i]`

Обратить строки (для `90°` CW) или столбцы (для `90°` CCW)

Анализ сложности

- **Временная сложность**: Оба шага выполняются за время `O(n^2)`.
- **Пространственная сложность**: Поскольку мы выполняем поворот на месте, она `O(1)`.

**Examples:**

Пример кода: Поворот матрицы

Вот код на Python:

```python
def rotate_2d_clockwise(matrix):
    n = len(matrix)
    # Transpose
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Reverse Rows
    for i in range(n):
        for j in range(n//2):
            matrix[i][j], matrix[i][n-j-1] = matrix[i][n-j-1], matrix[i][j]

    return matrix

def rotate_matrix_ccw(matrix):
    n = len(matrix)
    # Transpose
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Reverse Columns
    for i in range(n):
        for j in range(n//2):
            matrix[j][i], matrix[n-j-1][i] = matrix[n-j-1][i], matrix[j][i]

    return matrix

# Test 
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print(rotate_2d_clockwise(matrix))
# Output: [[7, 4, 1], [8, 5, 2], [9, 6, 3]]
```

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>Describe an algorithm to compress a string such as “aabbccc” to “a2b2c3”.</summary>

### Describe an algorithm to compress a string such as “aabbccc” to “a2b2c3”.

**Definition:**

Вы можете сжать строку, подсчитав количество каждого символа. Например, "aabbccc" становится "a2b2c3".

**How it works:**

Временная сложность

Этот алгоритм имеет временную сложность

`O(n)`, так как он обрабатывает каждый символ входной строки ровно один раз.

Пространственная сложность

Пространственная сложность равна

`O(k)`

, где
к
это длина сжатой строки. Это потому, что выходная строка хранится в памяти.

**Examples:**

Код на Python для этого алгоритма:

```python
def compress_string(input_string):
    # Initialize
    current_char = input_string[0]
    char_count = 1
    output = current_char

    # Iterate through the string
    for char in input_string[1:]:
        # If the character matches the current one, increment count
        if char == current_char:
            char_count += 1
        else:  # Append the count to the output and reset for the new character
            output += str(char_count) + char
            current_char = char
            char_count = 1

    # Append the last character's count
    output += str(char_count)

    # If the compressed string is shorter than the original string, return it
    return output if len(output) < len(input_string) else input_string
```

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>What is an array slice and how is it implemented in programming languages?</summary>

### What is an array slice and how is it implemented in programming languages?

**Definition:**

Давайте посмотрим, что такое срез массива и как он реализован в некоторых языках программирования.

Что такое срез массива?
Срез массива — это представление существующего массива, которое действует как меньший массив. Срез ссылается на непрерывный участок исходного массива, что позволяет эффективно получать доступ к данным и их обрабатывать.

Фрагменты массивов часто используются в языках, таких как Python, Rust и Go.

**How it works:**

Ключевые операции

- **Чтение**: Доступ к элементам среза.
- **Запись**: Изменяйте элементы внутри среза.
- **Увеличить/Уменьшить**: Изменить размер среза, часто с амортизированной стратегией DWARF.
- **Итерация**: Переберите элементы в срезе.

Основной механизм

Обычно ломтик содержит:

Указатель на начало среза.
Длина среза (количество элементов в срезе).
Вместимость среза (максимальное количество элементов, которое срез может содержать).

Преимущество использования

- **Нет накладных расходов на копирование**: Срезы не дублируют исходные данные; они просто являются ссылками. Это делает их эффективными и экономящими память.
- **Гибкость**: Срезы могут адаптироваться по мере изменения размера массива.
- **Безопасность**: Языки, такие как Rust, используют срезы для обеспечения мер безопасности, предотвращая выход за границы и проблемы с памятью.

Популярные реализации

- **Python**: Использует срезы списков, с синтаксисом типа my_list[2:5]. Это создаёт новый список.

- **Go Lang**: Широко использует срезы и, возможно, является самым ориентированным на срезы языком программирования.

- **Rust**: Подобно Go, это язык, сильно ориентированный на безопасность памяти, и срезы в этом отношении являются фундаментальными.

**Examples:**

Пример кода: нарезка массива

Вот код на Python:

```python
original_list = [1, 2, 3, 4, 5]
my_slice = original_list[1:4]  # Creates a new list: [2, 3, 4]
```

Вот код на Rust:

```rust
let original_vec = vec![1, 2, 3, 4, 5];
let my_slice = &original_vec[1..4];  // References a slice: [2, 3, 4]
```

А вот и код на Go:

```go
originalArray := [5]int{1, 2, 3, 4, 5}
mySlice := originalArray[1:4]  // References the originalArray from index 1 to 3
```

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>Can you discuss the time complexity of array insertion and deletion?</summary>

### Can you discuss the time complexity of array insertion and deletion?

**Definition:**

И вставка, и удаление элементов массива имеют временную сложность

`O(n)` из-за возможной необходимости перестановки данных.

Вставка в массив

- **Начало**: `O(n)` если массив полный; `1` для сдвига.
- **Средний**: `O(n)`, чтобы освободить место и вставить.
- **Конец**: `O(1)` в среднем для добавления.

Удаление массива

- **Начало**: `O(n)` часто требуется из-за перераспределения.
- **Средний**: `O(n)`, так как это включает сдвиг.
- **Конец**: `O(1)` в большинстве случаев, но `O(n)`, когда требуется динамическое изменение размера.

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>What are some ways to merge two sorted arrays into one sorted array?</summary>

### What are some ways to merge two sorted arrays into one sorted array?

**Definition:**

Объединение двух отсортированных массивов в новый отсортированный массив можно выполнить с помощью различных хорошо зарекомендовавших себя методов.

**How it works:**

Методы слияния отсортированных массивов

Использование дополнительного пространства:

Создайте новый массив и добавьте элементы из обоих массивов, используя два указателя, затем верните объединенный список.
- **Временная сложность**: `O(n + m)` - где `n and m` — это количество элементов в каждом массиве. Этот подход простой и интуитивно понятный.

Использование минимальной кучи:

Выберите наименьший элемент из обоих массивов, используя мин-кучу, и вставьте его в новый массив.

Временная сложность: `O((n + m)log(n + m))`

- **Пространственная сложность**: `O(n + m)` - Куча может содержать все элементы.
Этот подход полезен, когда массивы слишком большие, чтобы поместиться в памяти.

Слияние на месте:

Реализуйте слияние, подобное тому, которое используется в сортировке слиянием, непосредственно внутри входного массива.
- **Временная сложность**: `O(n ⋅ m)` - где `n and m` это количество элементов в каждом массиве.
Слияние на месте становится неэффективным по мере увеличения числа вставок.

Использование бинарного поиска:

Продолжайте делить больший массив на две части и использовать бинарный поиск, чтобы найти правильное место для элементов в меньшем массиве.

Временная сложность: `O(m log n)`

Метод двух указателей:

Инициализируйте два указателя, по одному для каждого массива, и сравните их, чтобы определить следующий элемент в объединённом массиве.

Временная сложность: `O(n + m)`

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>How do you find the kth largest element in an unsorted array?</summary>

### How do you find the kth largest element in an unsorted array?

**Definition:**

Найти

`kth` крупнейший элемент в неотсортированном массиве, вы можете использовать кучи или быструю сортировку.

Алгоритм Quickselect

- **Идея**: Разделите массив, используя опорный элемент (аналогично быстрой сортировке), и делите на подмассивы до тех пор, пока индекс разбиения не станет `kth` крупнейшим элементом.

Временная сложность:

- **Худший случай**: `O(n^2)` - Это происходит, когда мы сталкиваемся с наименее оптимизированным сценарием, что снижает
н
только одним элементом на каждый шаг стежка.
- **Средний случай**: `O(n)` - Средняя производительность высокая, что делает ожидаемую временную сложность линейной.

Метод кучи

Построить максимальную кучу

`O(n)` - Это занимает линейное время, делая

`O(n) + O(k log n) = O(n + k log n)`.

Извлечь максимальный элемент

к
раз (каждый раз повторно упорядочивая оставшиеся элементы в кучу).

**Examples:**

Пример кода: Python

```python
import random

def quickselect(arr, k):
    if arr:
        pivot = random.choice(arr)
        left = [x for x in arr if x < pivot]
        right = [x for x in arr if x > pivot]
        equal = [x for x in arr if x == pivot]
        if k < len(left):
            return quickselect(left, k)
        elif k < len(left) + len(equal):
            return pivot
        else:
            return quickselect(right, k - len(left) - len(equal))
```

Пример кода: Python

```python
import heapq

def kth_largest_heap(arr, k):
    if k > len(arr): return None
    neg_nums = [-i for i in arr]
    heapq.heapify(neg_nums)
    k_largest = [heapq.heappop(neg_nums) for _ in range(k)]
    return -k_largest[-1]
```

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

### Linked Lists

<details>
<summary>Explain how a singly linked list differs from a doubly linked list.</summary>

### Explain how a singly linked list differs from a doubly linked list.

**Definition:**

Односвязные и двусвязные списки различаются тем, как они управляют отношениями между узлами.

**How it works:**

Структура

- **Односвязный список**: Каждый узел указывает на следующий узел.

- **Двусвязный список**: Указаны как предыдущий, так и следующий узлы.

Визуальное представление

Односвязный список

Односвязный список

Двусвязный список

Двусвязный список

Ключевые отличия

- **Направление доступа**: Односвязные списки облегчают однонаправленный обход, тогда как двусвязные списки поддерживают двунаправленный обход.

- **Движения головы и хвоста**: Односвязные списки работают только с головой, в то время как двусвязные списки могут манипулировать головой и хвостом.

- **Эффективность обратного обхода**: Из-за своей структуры однонаправленные списки могут быть менее эффективны при обратном обходе.

- **Требование к памяти**: Двусвязные списки используют больше памяти, так как каждый узел содержит дополнительный указатель.

**Examples:**

Пример кода: Односвязный список

Вот код на Java:

```java
public class SinglyLinkedList {
    
    private static class Node {
        private int data;
        private Node next;

        public Node(int data) {
            this.data = data;
            this.next = null;
        }
    }

    private Node head;

    public void insertFirst(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
    }

    public void display() {
        Node current = head;
        while (current != null) {
            System.out.println(current.data);
            current = current.next;
        }
    }
}
```

Пример кода: Двусвязный список

Вот код на Java:

```java
public class DoublyLinkedList {
    
    private static class Node {
        private int data;
        private Node previous;
        private Node next;

        public Node(int data) {
            this.data = data;
            this.previous = null;
            this.next = null;
        }
    }

    private Node head;
    private Node tail;

    public void insertFirst(int data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
            tail = newNode;
        } else {
            head.previous = newNode;
            newNode.next = head;
            head = newNode;
        }
    }

    public void display() {
        Node current = head;
        while (current != null) {
            System.out.println(current.data);
            current = current.next;
        }
    }

    public void displayBackward() {
        Node current = tail;
        while (current != null) {
            System.out.println(current.data);
            current = current.previous;
        }
    }
}
```

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>How would you detect a cycle in a linked list?</summary>

### How would you detect a cycle in a linked list?

**Definition:**

Обнаружение циклов в связном списке является фундаментальным алгоритмом, который использует указатели для определения, содержит ли связанный список повторяющуюся последовательность.

**How it works:**

Алгоритм Флойда «Черепаха и Заяц»

Алгоритм Флойда использует два указателя:

«Черепаха» движется на один шаг за каждую итерацию.
«Заяц» делает два шага.
Если связанный список не содержит цикла, заяц либо достигнет конца (или null) раньше черепахи, либо наоборот. Однако, если цикл есть, два указателя гарантированно встретятся внутри цикла.

Шаги алгоритма

Инициализируйте оба указателя в начале связанного списка.
Двигай черепаху на один шаг, а зайца на два шага.

Непрерывно продвигайте указатели на их соответствующих шагах:

Если черепаха догонит зайца (точку столкновения), верните эту точку.
Если любой из указателей достигает конца (null), делаем вывод, что цикла нет.

Визуальное представление

Алгоритм Флойда

Анализ сложности

Временная сложность: `O(n)` где

н
является количеством узлов в связном списке, так как каждый указатель посещает каждый узел только один раз.
- **Пространственная сложность**: `O(1)`, так как алгоритм использует только постоянное количество дополнительной памяти.

**Examples:**

Пример кода: обнаружение цикла алгоритмом Флойда

Вот код на Python:

```python
def has_cycle(head):
    tortoise = head
    hare = head

    while hare and hare.next:
        tortoise = tortoise.next
        hare = hare.next.next

        if tortoise == hare:
            return True

    return False
```

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>What are the major operations you can perform on a linked list, and their time complexities?</summary>

### What are the major operations you can perform on a linked list, and their time complexities?

**Definition:**

Давайте рассмотрим основные операции, которые можно выполнять с односвязным списком, и их соответствующую временную сложность:

**How it works:**

Операции и временные сложности

Доступ (Чтение/Запись)

`O(n)`

- **Голова**: Постоянное время: `O(1)`.
- **Хвост**: `O(n)` без указателя на хвост, но постоянный с указателем на хвост.
- **Средний или k-й элемент**: `n^2` находится около среднего узла; получение k-го элемента требует `O(k)`.

Поиск

`O(n)`

- **Неупорядоченный**: Может потребоваться просмотр всего списка. Худший случай: `O(n)`.
- **Упорядочено**: Вы можете остановиться, как только значение превысит то, что вы ищете.

Вставка

`O(1)` без указателя конца,

`O(n)` с хвостовым указателем

Голова: `O(1)`

- **Хвост**: `O(1)` с указателем на хвост, иначе `O(n)`.
- **Средний**: `O(1)` с указателем на конец и поиском позиции за время `O(1)`; в противном случае это `O(n)`.

Удаление

`O(1)` для Головы и Хвоста,

`O(n)` в противном случае

Голова: `O(1)`

- **Хвост**: `O(n)`, потому что нужно найти узел перед хвостом для разворота указателя за один проход.
- **Средний**: `O(n)`, так как вам нужно найти узел перед тем, который нужно удалить.

Длина

`O(n)`

- **Наивный**: Требуется полный обход. Каждое добавление или удаление требует этого обхода.
- **Вести подсчет**: Поддерживайте отдельный счетчик, обновляя его при каждом добавлении или удалении.

**Examples:**

Пример кода: базовые операции односвязного списка

Вот код на Python:

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):  # O(n) without tail pointer
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        last_node = self.head
        while last_node.next:
            last_node = last_node.next
        last_node.next = new_node
    
    def delete(self, data):  # O(n) only if element is not at head
        current_node = self.head
        if current_node.data == data:
            self.head = current_node.next
            current_node = None
            return
        while current_node:
            if current_node.data == data:
                break
            prev = current_node
            current_node = current_node.next
        if current_node is None:
            return
        prev.next = current_node.next
        current_node = None

    def get_middle(self):  # O(n)
        slow, fast = self.head, self.head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow

    def get_kth(self, k):  # O(k)
        current_node, count = self.head, 0
        while current_node:
            count += 1
            if count == k:
                return current_node
            current_node = current_node.next
        return None

    # Other methods: display, length, etc.
```

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>Can you describe an in-place algorithm to reverse a linked list?</summary>

### Can you describe an in-place algorithm to reverse a linked list?

**Definition:**

Алгоритмы на месте изменяют структуры данных с постоянным количеством дополнительной рабочей памяти `O(1)`.

Односвязный список представляет собой простой пример структуры данных на месте, хорошо подходящей для алгоритмов обращения на месте.

**How it works:**

Разворачивание связанного списка: основная концепция

Алгоритму реверса нужно просто обновить ссылку next каждого узла так, чтобы она указывала на предыдущий узел. Несколько ключевых шагов достигают этого:

- **Инициализировать**: Отслеживайте три ключевых узла: предыдущий, текущий и следующий.
- **Обратные ссылки**: Обновите каждый узел так, чтобы он указывал на предыдущий в цепочке.
- **Переместить указатели**: Сдвиньте предыдущий, текущий и следующий узлы на одну позицию для следующей итерации.
Этот процесс продолжается итеративно, пока current не достигнет конца, т.е. NULL.

Анализ сложности

- **Временная сложность**: Алгоритм демонстрирует линейную временную сложность `O(n)`, так как посещает каждый узел один раз.
- **Пространственная сложность**: Так как алгоритм работает на месте, требуется только постоянное количество дополнительной памяти (для указателей на узлы): `O(1)`.

**Examples:**

Пример кода: Обратный порядок списка на месте

Вот код на Python:

```python
class Node:
    def __init__(self, data=None):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        last_node = self.head
        while last_node.next:
            last_node = last_node.next
        last_node.next = new_node

    def reverse_inplace(self):
        previous = None
        current = self.head
        while current:
            next_node = current.next
            current.next = previous
            previous = current
            current = next_node
        self.head = previous

    def display(self):
        elements = []
        current = self.head
        while current:
            elements.append(current.data)
            current = current.next
        print(" -> ".join(str(data) for data in elements))

# Populate the linked list
llist = LinkedList()
values = [4, 2, 8, 3, 1, 9]
for value in values:
    llist.append(value)

# Display original
print("Original Linked List:")
llist.display()

# Reverse in-place and display
llist.reverse_inplace()
print("\nAfter Reversal:")
llist.display()
```

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>Explain how you would find the middle element of a linked list in one pass.</summary>

### Explain how you would find the middle element of a linked list in one pass.

**Definition:**

Нахождение среднего элемента связанного списка является распространенной задачей с несколькими эффективными подходами, такими как метод двух указателей (или «бегун»).

**How it works:**

Метод двух указателей

Объяснение

Метод двух указателей использует два указателя, часто называемых медленным и быстрым, чтобы пройти по списку. Пока быстрый перемещается на два положения за раз, медленный отстаёт, проходя по одному положению за ход. Когда быстрый достигнет конца, медленный будет находиться на среднем элементе.

Пример

- **Дан связанный список**: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7

Указатели будут перемещаться следующим образом:

(1) медленно: 1; быстро: 2
(2) медленно: 2; быстро: 4
(3) медленно: 3; быстро: 6
(4) медленно: 4; быстро: конец
На (4) медленный указатель достиг средней точки.

Анализ сложности

- **Временная сложность**: `O(N)` -- Для каждого из N узлов мы проверяем каждый узел один раз.
- **Пространственная сложность**: `O(1)` -- Мы используем только указатели; дополнительные структуры данных не задействованы.

**Examples:**

Пример кода: техника двух указателей (бегун)

Вот реализация на Python:

```python
def find_middle_node(head):
    if not head:
        return None

    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
```

**Sources:**

- [Devinterview.io — Data Structures](https://devinterview.io/questions/data-structures-and-algorithms/data-structures-interview-questions/)
</details>

<details>
<summary>What are the advantages and disadvantages of using a linked list over an array?</summary>

### What are the advantages and disadvantages of using a linked list over an array?

**Definition:**

Связный список хранит каждый элемент в своём узле со ссылкой на следующий. Массив хранит элементы в одном непрерывном блоке и обращается к ним по индексу.

**How it works:**

GeeksforGeeks формулирует обмен так. Если узел уже есть, вставка или удаление меняет ссылку и стоит O(1); массив сдвигает элементы, и середина стоит O(n). Список растёт по одному узлу. Плата — доступ O(n), лишняя память на ссылку и плохая локальность кэша, потому что узлы не лежат подряд. Массив читает индекс i за O(1) и сканируется быстрее: соседи попадают в одну строку кэша.

**When to use:**

Список — когда вставляют и удаляют у известного узла и редко нужен индекс. Массив — когда нужен произвольный доступ или плотный проход.

**Examples:**

```python
# index 2 is one address calculation
value = items[2]
# the third node is two hops
node = head.next.next
```

**Sources:**

- [Linked List vs Array](https://www.geeksforgeeks.org/dsa/linked-list-vs-array/)
</details>

<details>
<summary>How can you implement a queue using linked lists?</summary>

### How can you implement a queue using linked lists?

**Definition:**

Очередь — FIFO. Односвязный список с указателями на голову и хвост ставит элемент в хвост и снимает с головы, оба за O(1).

**How it works:**

Начало очереди — головной узел. `enqueue` создаёт узел, цепляет его к текущему хвосту и сдвигает хвост. У пустой очереди новый узел — и голова, и хвост. `dequeue` возвращает значение головы и сдвигает голову. Когда уходит последний узел, хвост тоже становится пустым. Сдвигов элементов нет.

**Examples:**

```python
def enqueue(self, value):
    node = Node(value)
    if self.tail is None:
        self.head = self.tail = node
    else:
        self.tail.next = node
        self.tail = node

def dequeue(self):
    if self.head is None:
        raise IndexError("underflow")
    value = self.head.value
    self.head = self.head.next
    if self.head is None:
        self.tail = None
    return value
```

**Sources:**

- [Queue using Linked List](https://www.geeksforgeeks.org/dsa/queue-linked-list-implementation/)
</details>

<details>
<summary>Discuss how a linked list can be used to implement a stack.</summary>

### Discuss how a linked list can be used to implement a stack.

**Definition:**

Стек — LIFO. Push и pop у головы односвязного списка оба стоят O(1), и стек растёт, пока есть память.

**How it works:**

Вершина — голова. `push` вставляет новый узел перед текущей головой. `pop` снимает голову и возвращает значение. `peek` читает голову, не отцепляя её. Пустая голова — опустошение. В отличие от массива фиксированного размера, такой стек не переполняется на заранее заданной ёмкости.

**Examples:**

```python
def push(self, value):
    self.head = Node(value, self.head)

def pop(self):
    if self.head is None:
        raise IndexError("underflow")
    value = self.head.value
    self.head = self.head.next
    return value
```

**Sources:**

- [Stack using Linked List](https://www.geeksforgeeks.org/dsa/implement-a-stack-using-singly-linked-list/)
</details>

<details>
<summary>How would you remove a given node from a linked list without head pointer?</summary>

### How would you remove a given node from a linked list without head pointer?

**Definition:**

Если узел есть и это не последний узел, копируют данные следующего узла в этот и отцепляют следующий. Это O(1) и голова не нужна.

**How it works:**

В односвязном списке нельзя пойти назад, поэтому указатель предыдущего узла не изменить. Запись `node.next` в этот узел заставляет список перескочить исходного преемника. У последнего узла нет преемника для копирования, поэтому хвост так не удалить. Двусвязный список может отцепить данный узел напрямую, если есть указатель назад.

**Examples:**

```python
def delete_node(node):
    if node is None or node.next is None:
        raise ValueError("need a non-tail node")
    node.value = node.next.value
    node.next = node.next.next
```

**Sources:**

- [Delete a node without the head pointer](https://www.geeksforgeeks.org/dsa/delete-a-node-from-linked-list-without-head-pointer/)
</details>

<details>
<summary>Can you explain the concept of a sentinel node in a linked list?</summary>

### Can you explain the concept of a sentinel node in a linked list?

**Definition:**

Страж — постоянный пустой узел, который не хранит элемент списка. Он убирает особые случаи пустого списка и концов из вставки и удаления.

**How it works:**

GeeksforGeeks показывает двусвязный список с одним стражем в начале и одним в конце. Каждая настоящая вставка происходит между двумя уже существующими узлами, поэтому одно и то же сцепление обновляет четыре указателя. Список пуст, когда следующий узел головного стража — хвостовой страж. Заголовочный узел — односвязная форма той же идеи: `start.next is None` значит пусто.

**When to use:**

Стражи нужны, когда один и тот же код вставки и удаления должен работать на обоих концах. Без них обходятся, когда лишние узлы не окупаются в крошечном списке.

**Examples:**

```python
class List:
    def __init__(self):
        self.head = Node(None)
        self.tail = Node(None)
        self.head.next = self.tail
        self.tail.prev = self.head
```

**Sources:**

- [Doubly Linked List using Sentinel Nodes](https://www.geeksforgeeks.org/dsa/doubly-linked-list-using-sentinel-nodes/)
- [Header Linked List](https://www.geeksforgeeks.org/dsa/header-linked-list-in-c/)
</details>

### Stacks and Queues

<details>
<summary>What operations are performed by a stack data structure?</summary>

### What operations are performed by a stack data structure?

**Definition:**

Стек — коллекция LIFO. Основные операции — push, pop и peek (top), плюс проверка пустоты.

**How it works:**

Push кладёт элемент на вершину. Pop снимает и возвращает вершину. Peek читает вершину, не снимая её. У стека на связном списке каждая из них — O(1). У фиксированного массива push не проходит, когда массив полон (переполнение), а pop — когда он пуст (опустошение). Size — число хранимых элементов.

**Examples:**

```python
stack.append(1)   # push
top = stack[-1]   # peek
value = stack.pop()
```

**Sources:**

- [Stack Data Structure](https://www.geeksforgeeks.org/dsa/stack-data-structure/)
</details>

<details>
<summary>How would you evaluate an arithmetic expression using stacks?</summary>

### How would you evaluate an arithmetic expression using stacks?

**Definition:**

Стек вычисляет постфиксное выражение за один проход слева направо. Операнды кладут в стек. Оператор снимает аргументы, применяет операцию и кладёт результат.

**How it works:**

Для `2 3 1 * + 9 -` кладут 2, 3 и 1. `*` снимает 1 и 3 и кладёт 3. `+` снимает 3 и 2 и кладёт 5. `-` снимает 9 и 5 и кладёт -4. В конце в стеке одно значение. Инфикс переводят в постфикс вторым стеком операторов с учётом приоритета, затем считают так же. Один проход по n токенам — O(n).

**Examples:**

```python
def eval_postfix(tokens):
    stack = []
    for token in tokens:
        if token in {"+", "-", "*"}:
            right, left = stack.pop(), stack.pop()
            stack.append(eval(f"{left}{token}{right}"))
        else:
            stack.append(int(token))
    return stack[-1]
```

**Sources:**

- [Evaluation of Postfix Expression](https://www.geeksforgeeks.org/dsa/evaluation-of-postfix-expression/)
</details>

<details>
<summary>Can you create a queue using two stacks? If so, describe how.</summary>

### Can you create a queue using two stacks? If so, describe how.

**Definition:**

Да. Два стека изображают очередь FIFO. Один принимает новые элементы. Второй отдаёт начало. Перекладывание меняет порядок и превращает LIFO в FIFO.

**How it works:**

GeeksforGeeks держит входной и выходной стеки. `enqueue` кладёт во входной стек, O(1). `dequeue` снимает с выходного, если он не пуст, O(1). Когда выходной пуст, все входные элементы перекладывают в выходной, O(n) для этого вызова. Каждый элемент перекладывают не больше одного раза, поэтому последовательность операций в среднем O(1) на операцию.

**Examples:**

```python
def dequeue(self):
    if not self.output:
        while self.input:
            self.output.append(self.input.pop())
    if not self.output:
        raise IndexError("underflow")
    return self.output.pop()
```

**Sources:**

- [Queue using Stacks](https://www.geeksforgeeks.org/dsa/queue-using-stacks/)
</details>

<details>
<summary>Describe how you would implement a stack using queues.</summary>

### Describe how you would implement a stack using queues.

**Definition:**

Стек можно собрать из очередей, если держать самый новый элемент в начале одной очереди: pop и top читают это начало.

**How it works:**

GeeksforGeeks даёт две формы. С двумя очередями push кладёт элемент в пустого помощника, переносит все старые элементы за него и меняет имена местами: push стоит O(n), pop — O(1). Другая форма делает push за O(1), а на pop переносит элементы, пока не останется один. Одна очередь тоже может вращаться: после enqueue прежние элементы снимают и ставят обратно, чтобы новый оказался впереди. Тогда push — O(n), pop и top — O(1).

**When to use:**

Платят O(n) на push, если pop чаще. Платят O(n) на pop, если push чаще.

**Examples:**

```python
def push(self, value):
    self.q.append(value)
    for _ in range(len(self.q) - 1):
        self.q.append(self.q.popleft())
```

**Sources:**

- [Implement Stack using Queues](https://www.geeksforgeeks.org/dsa/implement-stack-using-queue/)
</details>

<details>
<summary>How would you distinguish a stack overflow from an underflow?</summary>

### How would you distinguish a stack overflow from an underflow?

**Definition:**

Переполнение значит, что push попросили, когда стек не может принять ещё элемент. Опустошение значит, что pop или peek попросили, когда элемента нет.

**How it works:**

Стек на фиксированном массиве переполняется при `top == capacity - 1`. Он опустошается, если `top == -1` перед pop. Стек на списке не упирается в заданную ёмкость, поэтому переполнение там — нехватка памяти, а опустошение — по-прежнему пустая голова. Перед pop проверяют пустоту. Рост массива — отдельная политика динамического массива, а не успешный push в полный фиксированный буфер.

**Examples:**

```python
def push(self, value):
    if self.top + 1 == len(self.data):
        raise OverflowError("overflow")
    self.top += 1
    self.data[self.top] = value
```

**Sources:**

- [Stack using Array](https://www.geeksforgeeks.org/dsa/implement-stack-using-array/)
- [Stack Data Structure](https://www.geeksforgeeks.org/dsa/stack-data-structure/)
</details>

<details>
<summary>What is a priority queue and how can it be implemented?</summary>

### What is a priority queue and how can it be implemented?

**Definition:**

Очередь с приоритетом снимает элемент с лучшим приоритетом, а не самый старый. Обычная реализация — двоичная куча.

**How it works:**

Min-heap хранит наименьший ключ в корне. Вставка просеивает новый ключ вверх. Удаление минимума ставит на место корня последний лист и просеивает вниз. В двоичной куче оба действия — O(log n). Несортированный массив делает вставку O(1) и удаление минимума O(n). Сортированный массив меняет эти цены местами. Алгоритм Дейкстры поэтому использует min-heap пар (расстояние, вершина).

**When to use:**

Двоичная куча — когда и вставка, и снятие минимума должны быть логарифмическими. Сортированный список — только когда одна из этих операций редкая.

**Examples:**

```python
import heapq
heap = []
heapq.heappush(heap, (2, "b"))
heapq.heappush(heap, (1, "a"))
print(heapq.heappop(heap))  # (1, "a")
```

**Sources:**

- [Priority Queue](https://www.geeksforgeeks.org/dsa/priority-queue-set-1-introduction/)
- [Dijkstra's Algorithm](https://www.geeksforgeeks.org/dsa/dijkstras-shortest-path-algorithm-greedy-algo-7/)
</details>

<details>
<summary>Explain the difference between a LIFO and a FIFO data structure.</summary>

### Explain the difference between a LIFO and a FIFO data structure.

**Definition:**

LIFO возвращает сначала самый новый элемент. FIFO возвращает сначала самый старый. Стек — LIFO. Очередь — FIFO.

**How it works:**

Push и pop стека делят один конец, поэтому последний push — следующий pop. Enqueue и dequeue очереди используют разные концы, поэтому первый enqueue — следующий dequeue. Очередь с приоритетом — ни то ни другое: она отдаёт по ключу. Неверный порядок ломает разборщики (им нужен LIFO) и буферы задач (им нужен FIFO).

**Examples:**

```python
stack = []
stack.append("a"); stack.append("b")
stack.pop()  # "b", LIFO

from collections import deque
q = deque(["a", "b"])
q.popleft()  # "a", FIFO
```

**Sources:**

- [Stack Data Structure](https://www.geeksforgeeks.org/dsa/stack-data-structure/)
- [Queue using Linked List](https://www.geeksforgeeks.org/dsa/queue-linked-list-implementation/)
</details>

<details>
<summary>Can you describe a scenario in which a circular queue would be useful?</summary>

### Can you describe a scenario in which a circular queue would be useful?

**Definition:**

Кольцевая очередь заново использует пустые ячейки в начале фиксированного массива и не сдвигает элементы после каждого dequeue.

**How it works:**

Голова и хвост идут вперёд по `index % capacity`. Очередь полна, когда следующая ячейка хвоста — это голова, поэтому одну ячейку часто оставляют пустой либо счётчик размера отличает полную очередь от пустой. GeeksforGeeks показывает эту форму массива для ограниченного буфера. Производитель и потребитель с общим фиксированным блоком памяти, например буфер клавиатуры или окно потока, работают без узла на каждый элемент.

**When to use:**

Нужна для буфера фиксированной ёмкости с частыми enqueue и dequeue. Связная очередь — когда граница неизвестна.

**Examples:**

```python
def enqueue(self, value):
    nxt = (self.tail + 1) % self.capacity
    if nxt == self.head:
        raise OverflowError("full")
    self.data[self.tail] = value
    self.tail = nxt
```

**Sources:**

- [Circular Queue](https://www.geeksforgeeks.org/dsa/circular-queue-set-1-introduction-array-implementation/)
</details>

<details>
<summary>How would you design a stack that supports a special operation that retrieves the minimum element in constant time?</summary>

### How would you design a stack that supports a special operation that retrieves the minimum element in constant time?

**Definition:**

К стеку значений добавляют второй стек, который хранит минимум на текущей высоте и ниже. Тогда push, pop и getMin все стоят O(1).

**How it works:**

При push кладут значение и ещё `min(value, текущий минимум)` в стек минимумов. При pop снимают оба стека. getMin читает вершину стека минимумов. GeeksforGeeks описывает эту дополнительную память O(n) как способ держать getMin за O(1). Один стек пар `(value, min_so_far)` — та же идея.

**Examples:**

```python
def push(self, value):
    current = value if not self.mins else min(value, self.mins[-1])
    self.values.append(value)
    self.mins.append(current)

def get_min(self):
    return self.mins[-1]
```

**Sources:**

- [Design a stack with getMin in O(1)](https://www.geeksforgeeks.org/dsa/design-a-stack-that-supports-getmin-in-o1-time-and-o1-extra-space/)
</details>

<details>
<summary>Discuss the potential problems you might encounter when using dynamic arrays for stacks.</summary>

### Discuss the potential problems you might encounter when using dynamic arrays for stacks.

**Definition:**

Стек на динамическом массиве добавляет элемент в среднем за O(1), но рост копирует все элементы в больший буфер, а сжатие может сделать то же в обратную сторону.

**How it works:**

Когда `size == capacity`, выделение нового массива стоит O(n) и старые индексы перестают быть верны. Удвоение ёмкости делает последовательность push в среднем O(1), но один push всё ещё может остановиться. Неиспользуемая ёмкость тратит память после волны pop, если не сжимать, а слишком охотное сжатие молотит, если размер колеблется у порога. Массив — один непрерывный блок, поэтому большой resize может не пройти, даже когда свободной памяти хватило бы на стек из узлов.

**Examples:**

```python
def push(self, value):
    if len(self.data) == self.capacity:
        self.data = self.data + [None] * self.capacity
        self.capacity *= 2
    self.data[self.size] = value
    self.size += 1
```

**Sources:**

- [Stack using Array](https://www.geeksforgeeks.org/dsa/implement-stack-using-array/)
- [Linked List vs Array](https://www.geeksforgeeks.org/dsa/linked-list-vs-array/)
</details>

### Trees

<details>
<summary>Describe a binary tree and its properties.</summary>

### Describe a binary tree and its properties.

**Definition:**

Двоичное дерево — корневое дерево, в котором у каждого узла не больше двух детей, обычно левого и правого.

**How it works:**

Узел хранит значение и две ссылки на детей. Глубина корня — 0. Высота — число рёбер на самом длинном пути от корня до листа. Идеальное двоичное дерево высоты h имеет 2^(h+1) - 1 узлов. Полное в узком смысле (full) имеет у каждого узла 0 или 2 детей. Завершённое (complete) заполняет все уровни, кроме, возможно, последнего, который заполнен слева. Между любыми двумя узлами ровно один путь, потому что в дереве нет циклов.

**Examples:**

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right
```

**Sources:**

- [Binary Tree](https://www.geeksforgeeks.org/dsa/binary-tree-data-structure/)
</details>

<details>
<summary>How do you perform an in-order tree traversal recursively?</summary>

### How do you perform an in-order tree traversal recursively?

**Definition:**

Симметричный обход посещает левое поддерево, затем узел, затем правое поддерево. У двоичного дерева поиска этот порядок отсортирован.

**How it works:**

Вызов сразу возвращается на пустом узле. Иначе он идёт влево, записывает узел и идёт вправо. Дерево из n узлов посещают один раз, время O(n). Стек вызовов — O(h): O(log n) у сбалансированного дерева и O(n) у цепочки.

**Examples:**

```python
def inorder(node, out):
    if node is None:
        return
    inorder(node.left, out)
    out.append(node.value)
    inorder(node.right, out)
```

**Sources:**

- [Tree Traversals](https://www.geeksforgeeks.org/dsa/tree-traversals-inorder-preorder-and-postorder/)
</details>

<details>
<summary>Can you write an algorithm for a non-recursive post-order traversal?</summary>

### Can you write an algorithm for a non-recursive post-order traversal?

**Definition:**

Обратный обход посещает левое поддерево, правое, затем узел. Явный стек хранит путь, чтобы узел выдали только после обоих детей.

**How it works:**

Идут влево, складывая узлы. Когда у узла нет непосещённого правого ребёнка, его снимают и выдают. Если правый ребёнок есть и его только что не выдали, узел кладут обратно и идут вправо. Указатель на предыдущий узел говорит, что правый ребёнок уже обработан. Время O(n). Дополнительная память O(h).

**Examples:**

```python
def postorder(root):
    out, stack, prev = [], [], None
    node = root
    while node or stack:
        while node:
            stack.append(node)
            node = node.left
        peek = stack[-1]
        if peek.right and prev is not peek.right:
            node = peek.right
        else:
            out.append(stack.pop().value)
            prev = peek
    return out
```

**Sources:**

- [Tree Traversals](https://www.geeksforgeeks.org/dsa/tree-traversals-inorder-preorder-and-postorder/)
</details>

<details>
<summary>What are the advantages of a balanced binary tree over an unbalanced one?</summary>

### What are the advantages of a balanced binary tree over an unbalanced one?

**Definition:**

Сбалансированное двоичное дерево держит высоту O(log n). Несбалансированное может стать цепочкой высоты n, и тогда поиск, вставка и удаление становятся O(n).

**How it works:**

AVL и красно-чёрные деревья восстанавливают баланс после обновлений, поэтому эти операции остаются O(log n). Дополнительная работа — несколько поворотов. Несбалансированное дерево поиска, построенное из отсортированного ввода, — связный список: каждое сравнение спускается на один узел, глубина рекурсии n. Баланс не меняет цену O(n) обхода всех узлов.

**When to use:**

Балансируют дерево, когда поиски и обновления смешаны и n велико. Обычного двоичного дерева хватает для иерархии, которую только обходят.

**Examples:**

```python
# sorted inserts without balance: height == n - 1
# balanced inserts: height is about log2(n)
```

**Sources:**

- [AVL Tree](https://www.geeksforgeeks.org/dsa/avl-tree-set-1-insertion/)
- [Red-Black Tree](https://www.geeksforgeeks.org/dsa/red-black-tree-set-1-introduction-2/)
</details>

<details>
<summary>Explain what a binary search tree (BST) is and how it’s different from other trees.</summary>

### Explain what a binary search tree (BST) is and how it’s different from other trees.

**Definition:**

Двоичное дерево поиска — двоичное дерево с порядком: каждый ключ в левом поддереве меньше узла, каждый ключ в правом больше.

**How it works:**

Поиск, вставка и удаление идут по одному пути, поэтому они O(h). Это O(log n), если дерево остаётся сбалансированным, и O(n), если нет. Симметричный обход выдаёт ключи по возрастанию. У обычного двоичного дерева такого порядка нет, поиск O(n). Куча упорядочивает только родителя и детей, поэтому минимум находится за O(1), но произвольный ключ за O(log n) не ищется.

**Examples:**

```python
def search(node, key):
    if node is None or node.value == key:
        return node
    if key < node.value:
        return search(node.left, key)
    return search(node.right, key)
```

**Sources:**

- [Binary Search Tree](https://www.geeksforgeeks.org/dsa/binary-search-tree-data-structure/)
</details>

<details>
<summary>How would you check if a binary tree is a BST?</summary>

### How would you check if a binary tree is a BST?

**Definition:**

Дерево является BST, когда симметричный обход строго возрастает или каждый узел лежит в диапазоне, унаследованном от предков.

**How it works:**

Метод диапазона передаёт нижнюю и верхнюю границы. Корень может быть любым. Левый ребёнок должен лежать в `(low, node.value)`, правый — в `(node.value, high)`. Пустой узел допустим. Время O(n), стек O(h). Сравнения узла только с родителем мало: внук всё ещё может нарушить границу предка.

**Examples:**

```python
def is_bst(node, low=float("-inf"), high=float("inf")):
    if node is None:
        return True
    if not (low < node.value < high):
        return False
    return is_bst(node.left, low, node.value) and is_bst(node.right, node.value, high)
```

**Sources:**

- [Check if a binary tree is BST](https://www.geeksforgeeks.org/dsa/a-program-to-check-if-a-binary-tree-is-bst-or-not/)
</details>

<details>
<summary>Discuss the method for finding the lowest common ancestor (LCA) in a BST.</summary>

### Discuss the method for finding the lowest common ancestor (LCA) in a BST.

**Definition:**

Наименьший общий предок двух узлов — самый глубокий узел, для которого оба являются потомками. В BST путь поиска находит его без полного обхода.

**How it works:**

Начинают с корня. Если оба ключа меньше, предок в левом поддереве. Если оба больше — в правом. Иначе этот узел — точка расхождения и предок. Проход стоит O(h). У обычного двоичного дерева такой проверки нет: используют указатели на родителя или обратный обход, который возвращается, когда обе стороны сообщили совпадение.

**Examples:**

```python
def lca(node, a, b):
    while node:
        if a < node.value and b < node.value:
            node = node.left
        elif a > node.value and b > node.value:
            node = node.right
        else:
            return node
```

**Sources:**

- [Lowest Common Ancestor in a BST](https://www.geeksforgeeks.org/dsa/lowest-common-ancestor-in-a-binary-search-tree/)
</details>

<details>
<summary>What are the use cases for a depth-first search versus a breadth-first search in a tree structure?</summary>

### What are the use cases for a depth-first search versus a breadth-first search in a tree structure?

**Definition:**

Поиск в глубину доходит по одной ветке до листа и только потом возвращается. Поиск в ширину заканчивает уровень перед следующим. Оба посещают n узлов и n - 1 рёбер, поэтому на дереве оба стоят O(n).

**How it works:**

DFS использует стек или рекурсию глубины O(h). Он подходит для задач о пути, условия от корня до листа и обходов preorder, inorder и postorder. BFS использует очередь ширины самого широкого уровня. Он находит кратчайший путь в невзвешенном дереве, потому что узел впервые достигается наименьшим числом рёбер. GeeksforGeeks отмечает, что BFS идёт по уровням, а DFS сначала уходит вглубь.

**When to use:**

BFS — для наименьшего числа рёбер. DFS — когда ответ это путь от корня до листа или симметричный список.

**Examples:**

```python
from collections import deque

def bfs(root):
    queue = deque([root])
    while queue:
        node = queue.popleft()
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
```

**Sources:**

- [BFS vs DFS](https://www.geeksforgeeks.org/dsa/difference-between-bfs-and-dfs/)
</details>

<details>
<summary>Describe how you would convert a binary tree into a doubly linked list.</summary>

### Describe how you would convert a binary tree into a doubly linked list.

**Definition:**

Симметричный обход может превратить те же узлы в двусвязный список. Левая ссылка становится предыдущей, правая — следующей, самый левый узел — головой.

**How it works:**

GeeksforGeeks держит `prev`, последний посещённый узел. Сначала левое поддерево. Если `prev` пуст, текущий узел — голова. Иначе `prev.right` указывает на текущий узел, а `current.left` — на `prev`. Затем `prev` становится текущим узлом, и обходят правое поддерево. Преобразование на месте, время O(n), стек рекурсии O(h). Новый узел для списка не выделяют.

**Examples:**

```python
def to_dll(node, state):
    if node is None:
        return
    to_dll(node.left, state)
    if state["prev"] is None:
        state["head"] = node
    else:
        state["prev"].right = node
        node.left = state["prev"]
    state["prev"] = node
    to_dll(node.right, state)
```

**Sources:**

- [Convert Binary Tree to Doubly Linked List](https://www.geeksforgeeks.org/dsa/convert-binary-tree-to-doubly-linked-list-using-inorder-traversal/)
</details>

<details>
<summary>How can you serialize and deserialize a binary tree?</summary>

### How can you serialize and deserialize a binary tree?

**Definition:**

Сериализация записывает дерево в список, из которого можно собрать ту же форму. Хватает прямого обхода с явной меткой пустого узла.

**How it works:**

Пишут значение узла, затем левое поддерево, затем правое. Для отсутствующего ребёнка пишут метку, например `None`. Десериализация читает следующий токен: пустая метка не создаёт узел; значение создаёт узел, затем из того же потока читают левого и правого ребёнка. Оба направления — O(n). Без меток пустоты форма неоднозначна.

**Examples:**

```python
def serialize(node):
    if node is None:
        return ["#"]
    return [str(node.value)] + serialize(node.left) + serialize(node.right)
```

**Sources:**

- [Serialize and Deserialize a Binary Tree](https://www.geeksforgeeks.org/dsa/serialize-deserialize-binary-tree/)
</details>

### Hash Tables

<details>
<summary>What is a hash table and how does it work internally?</summary>

### What is a hash table and how does it work internally?

**Definition:**

Хеш-таблица хранит ключи в массиве. Хеш-функция превращает ключ в индекс. Поиск, вставка и удаление в среднем O(1). Худший случай O(n), когда много ключей попадает в одну ячейку.

**How it works:**

Длина таблицы — m. Индекс — `hash(key) modulo m`. Два ключа с одним индексом сталкиваются. Метод цепочек хранит в ячейке список. Открытая адресация ищет другую ячейку. Коэффициент заполнения — n / m. Хорошая функция разбрасывает ключи, чтобы цепочки оставались короткими.

**Examples:**

```python
index = hash(key) % len(buckets)
buckets[index].append((key, value))
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
</details>

<details>
<summary>Can you explain collision resolution in hash tables?</summary>

### Can you explain collision resolution in hash tables?

**Definition:**

Столкновение — два ключа с одним индексом. Метод цепочек и открытая адресация — обычные способы его снять.

**How it works:**

Цепочки хранят в ячейке связный список или другую структуру. Вставка — в голову этого списка. Поиск идёт по цепочке. Открытая адресация держит один элемент в ячейке и пробует дальше: линейное пробирование шагает на 1, квадратичное — на квадраты, двойное хеширование использует вторую функцию. Цепочки тратят память на ссылки. Открытой адресации нужен коэффициент заполнения ниже 1, и она портится по мере заполнения.

**When to use:**

Цепочки — когда коэффициент заполнения может превысить 1. Открытая адресация — когда нужен один массив и таблицу можно держать частично пустой.

**Examples:**

```python
slot = buckets[hash(key) % len(buckets)]
for stored, value in slot:
    if stored == key:
        return value
```

**Sources:**

- [Separate Chaining](https://www.geeksforgeeks.org/dsa/hashing-set-2-separate-chaining/)
- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
</details>

<details>
<summary>What is a hash function and what makes a good hash function?</summary>

### What is a hash function and what makes a good hash function?

**Definition:**

Хеш-функция отображает ключ в целый индекс. Хорошая функция детерминирована, быстра и равномерно раскидывает ключи по таблице.

**How it works:**

Один и тот же ключ всегда даёт один и тот же хеш. Считать его должно быть дёшево рядом с остальной операцией. Равномерный разброс держит цепочки около коэффициента заполнения, а не сваливает ключи в одну ячейку. Для таблицы криптографический хеш не нужен. Для строк учебный выбор — полиномиальный скользящий хеш. Функция только от первого символа сбивает ключи с общим префиксом в кучу.

**Examples:**

```python
def hash_string(text, m):
    acc = 0
    for ch in text:
        acc = (acc * 31 + ord(ch)) % m
    return acc
```

**Sources:**

- [Choosing a hash function](https://www.geeksforgeeks.org/dsa/what-are-hash-functions-and-how-to-choose-a-good-hash-function/)
</details>

<details>
<summary>How would you design a data structure for an LRU cache?</summary>

### How would you design a data structure for an LRU cache?

**Definition:**

LRU-кэш выбрасывает давно не использованную запись, когда он полон. Хеш-таблица плюс двусвязный список делают get и put за O(1).

**How it works:**

Таблица указывает с ключа на узел списка. Список упорядочивает узлы от самого свежего к самому старому. При get узел переносят в начало. При put нового ключа на полной ёмкости отцепляют хвост и удаляют его из таблицы, затем вставляют новый узел в начало и записывают его в таблицу. Попадание обновляет значение и позицию. GeeksforGeeks использует эту пару структур для операций O(1).

**Examples:**

```python
def get(self, key):
    node = self.index.get(key)
    if node is None:
        return None
    self._move_front(node)
    return node.value
```

**Sources:**

- [LRU Cache](https://www.geeksforgeeks.org/dsa/lru-cache-implementation/)
</details>

<details>
<summary>Discuss the trade-offs between using an array versus a hash table.</summary>

### Discuss the trade-offs between using an array versus a hash table.

**Definition:**

Массив даёт доступ O(1) по плотному целому индексу и хранит элементы подряд. Хеш-таблица даёт средний доступ O(1) по произвольному ключу и тратит память на корзины и ссылки.

**How it works:**

Массив — когда ключи это компактный диапазон вроде 0..n-1: нет хеша, нет столкновений, проход дружелюбен к кэшу. Хеш-таблица — когда ключи это строки, id или редкое множество. Худший случай таблицы — O(n) при плохой функции или высоком коэффициенте заполнения. Порядок ключей она не хранит. Массив не заводит ячейку на отсутствующий ключ.

**When to use:**

Массив — для плотных индексов. Хеш-таблица — для редких или нецелых ключей.

**Examples:**

```python
present = [False] * (n + 1)   # dense ids
present = set()                # sparse ids
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
- [Linked List vs Array](https://www.geeksforgeeks.org/dsa/linked-list-vs-array/)
</details>

<details>
<summary>What are some common uses for a hash set data structure?</summary>

### What are some common uses for a hash set data structure?

**Definition:**

Хеш-множество хранит ключи без значения. Проверка, вставка и удаление в среднем O(1).

**How it works:**

Обычные применения — убрать дубликаты из потока, отметить посещённые вершины графа и проверить, встречалось ли дополнение вроде `target - x`. Порядка и индекса оно не даёт. Булев массив заменяет его, когда ключи — маленький целый диапазон.

**Examples:**

```python
seen = set()
if x not in seen:
    seen.add(x)
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
</details>

<details>
<summary>How can you count the frequency of words in a long piece of text efficiently?</summary>

### How can you count the frequency of words in a long piece of text efficiently?

**Definition:**

Один проход с хеш-таблицей считает каждое слово в среднем за O(1), поэтому весь текст из n слов в среднем O(n).

**How it works:**

Текст режут на слова. Для каждого слова прибавляют 1 к `counts[word]`, при первом появлении начиная с 0. Память пропорциональна числу разных слов, а не длине текста. Сортировка слов тоже считает серии, но это O(n log n). Trie считает и префиксы, и целые слова, когда нужны оба.

**Examples:**

```python
counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
</details>

<details>
<summary>What are the implications of a high load factor in a hash table?</summary>

### What are the implications of a high load factor in a hash table?

**Definition:**

Коэффициент заполнения — n / m, число ключей, делённое на число ячеек. Высокое значение значит больше столкновений и более медленные операции.

**How it works:**

При цепочках средняя длина цепочки равна коэффициенту заполнения, поэтому поиск замедляется с его ростом, а худшая цепочка может быть O(n). При открытой адресации последовательности проб удлиняются, когда таблица близка к полной, а вставка невозможна при коэффициенте 1. Таблицы перехешируют в больший массив, когда коэффициент переходит порог, часто около 0,75 для открытой адресации.

**Examples:**

```python
if len(keys) / len(buckets) > 0.75:
    rehash()
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
- [Separate Chaining](https://www.geeksforgeeks.org/dsa/hashing-set-2-separate-chaining/)
</details>

<details>
<summary>Explain how rehashing works and when it should be performed.</summary>

### Explain how rehashing works and when it should be performed.

**Definition:**

Перехеширование выделяет таблицу больше и заново вставляет каждый существующий ключ с новым модулем. Его запускают, когда коэффициент заполнения переходит порог таблицы.

**How it works:**

Создают массив корзин примерно вдвое больше. Для каждого ключа считают `hash(key) modulo new_m` и вставляют его в новые цепочки. Старые индексы после смены размера неверны, поэтому переезжает каждый ключ. Одно перехеширование — O(n). На серии удвоений цена копирования в среднем O(1) на вставку. Делают это до того, как открытая адресация почти полна, а не после каждой вставки.

**Examples:**

```python
def rehash(self):
    old = self.buckets
    self.buckets = [[] for _ in range(len(old) * 2)]
    for chain in old:
        for key, value in chain:
            self._insert_new(key, value)
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
</details>

<details>
<summary>Discuss the performance differences between hash tables and balanced trees.</summary>

### Discuss the performance differences between hash tables and balanced trees.

**Definition:**

Хеш-таблица в среднем O(1) на поиск, вставку и удаление и в худшем случае O(n). Сбалансированное BST, например красно-чёрное дерево, делает эти операции за O(log n) всегда и хранит ключи по порядку.

**How it works:**

Хеш-таблица — когда нужна только принадлежность или чтение по ключу и редкая длинная цепочка допустима. Сбалансированное дерево — когда нужны следующий ключ, запросы по диапазону или отсортированный обход. Дерево также не сваливает недоверенные ключи в одну корзину хешем. Пауз перехеширования у дерева нет. У дерева больше ссылок на узел и больше сравнений.

**When to use:**

Хеш-таблица — для доступа по ключу без порядка. Сбалансированное дерево — для упорядоченных ключей и гарантированных O(log n).

**Examples:**

```python
by_id[user_id] = user          # hash, average O(1)
ordered_names.add(user.name)   # tree, O(log n), sorted walk
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
- [Red-Black Tree](https://www.geeksforgeeks.org/dsa/red-black-tree-set-1-introduction-2/)
</details>

### Graphs

<details>
<summary>Define a graph and its representation in a computer’s memory.</summary>

### Define a graph and its representation in a computer’s memory.

**Definition:**

Граф — множество вершин и множество рёбер, которые соединяют пары вершин. Рёбра могут быть направленными и могут иметь вес.

**How it works:**

Матрица смежности — таблица V на V. Ребро u-v ставит `matrix[u][v]`. Память O(V^2). Проверка ребра — O(1). Список смежности хранит у каждой вершины список соседей. Память O(V + E). Обход соседей u пропорционален степени. GeeksforGeeks советует список для редких графов и матрицу для плотных графов или быстрой проверки ребра.

**When to use:**

Список смежности — когда E гораздо меньше V^2. Матрица — когда граф плотный или часто проверяют произвольные пары.

**Examples:**

```python
adj = [[] for _ in range(4)]
adj[0].append(1)
adj[1].append(2)
```

**Sources:**

- [Graph and its representations](https://www.geeksforgeeks.org/dsa/graph-and-its-representations/)
</details>

<details>
<summary>Explain how you would implement both depth-first search (DFS) and breadth-first search (BFS) on a graph.</summary>

### Explain how you would implement both depth-first search (DFS) and breadth-first search (BFS) on a graph.

**Definition:**

DFS идёт по одному соседу так далеко, как может, затем возвращается. BFS посещает вершины в порядке роста расстояния от источника. На списке смежности оба стоят O(V + E).

**How it works:**

BFS кладёт источник в очередь и множество посещённых. Каждая снятая вершина ставит в очередь непосещённых соседей. GeeksforGeeks считает каждую вершину один раз и каждое ребро константное число раз, это O(V + E). DFS использует стек или рекурсию и то же множество. На несвязном графе поиск начинают из каждой непосещённой вершины. Очередь или стек рекурсии занимают O(V).

**Examples:**

```python
from collections import deque

def bfs(adj, src):
    seen = {src}
    queue = deque([src])
    while queue:
        u = queue.popleft()
        for v in adj[u]:
            if v not in seen:
                seen.add(v)
                queue.append(v)
```

**Sources:**

- [BFS](https://www.geeksforgeeks.org/dsa/breadth-first-search-or-bfs-for-a-graph/)
- [DFS](https://www.geeksforgeeks.org/dsa/depth-first-search-or-dfs-for-a-graph/)
</details>

<details>
<summary>What is the shortest path problem in a graph, and how is it commonly solved?</summary>

### What is the shortest path problem in a graph, and how is it commonly solved?

**Definition:**

Задача кратчайшего пути из одной вершины просит минимальный суммарный вес от одной вершины до каждой другой.

**How it works:**

Если вес каждого ребра равен 1, BFS даёт наименьшее число рёбер, O(V + E). Если веса неотрицательны, Дейкстра с двоичной кучей стоит O((V + E) log V), и её нельзя использовать с отрицательными рёбрами. Если веса могут быть отрицательными и нет отрицательного цикла, Беллман-Форд ослабляет каждое ребро V - 1 раз, O(V * E), а ещё одно успешное ослабление сообщает об отрицательном цикле. DAG решается за O(V + E) после топологического порядка.

**When to use:**

BFS — для равных весов. Дейкстра — для неотрицательных весов. Беллман-Форд — когда возможно отрицательное ребро.

**Examples:**

```python
dist = bfs_unweighted(adj, src)       # weights are 1
dist = dijkstra(adj, src)             # weights >= 0
dist = bellman_ford(V, edges, src)    # negatives allowed
```

**Sources:**

- [Dijkstra's Algorithm](https://www.geeksforgeeks.org/dsa/dijkstras-shortest-path-algorithm-greedy-algo-7/)
- [Bellman-Ford](https://www.geeksforgeeks.org/dsa/bellman-ford-algorithm-dp-23/)
- [BFS](https://www.geeksforgeeks.org/dsa/breadth-first-search-or-bfs-for-a-graph/)
</details>

<details>
<summary>Discuss Dijkstra’s algorithm for finding the shortest path.</summary>

### Discuss Dijkstra’s algorithm for finding the shortest path.

**Definition:**

Дейкстра наращивает множество вершин, кратчайшее расстояние которых от источника уже окончательно. Она всегда раскрывает незакреплённую вершину с наименьшим предварительным расстоянием. Нужны неотрицательные веса рёбер.

**How it works:**

Ставят `dist[src] = 0`, остальные расстояния — бесконечность. Кладут `(0, src)` в min-heap. Снимают наименьшую пару. Если это расстояние хуже `dist[u]`, пару пропускают. Иначе ослабляют каждого соседа: если `dist[u] + w < dist[v]`, обновляют `dist[v]` и кладут её в кучу. GeeksforGeeks даёт сложность с двоичной кучей O((V + E) log V) и дополнительную память O(V + E). Отрицательное ребро может сделать закреплённую вершину неверной, потому что более поздний путь может оказаться дешевле.

**Examples:**

```python
import heapq
def dijkstra(adj, src):
    dist = [float("inf")] * len(adj)
    dist[src] = 0
    heap = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(heap, (dist[v], v))
    return dist
```

**Sources:**

- [Dijkstra's Algorithm](https://www.geeksforgeeks.org/dsa/dijkstras-shortest-path-algorithm-greedy-algo-7/)
</details>

<details>
<summary>Explain what a directed acyclic graph (DAG) is and give an example of where it might be used.</summary>

### Explain what a directed acyclic graph (DAG) is and give an example of where it might be used.

**Definition:**

DAG — ориентированный граф без ориентированного цикла. У каждого ребра есть направление, и по рёбрам нельзя вернуться в вершину.

**How it works:**

Граф пререквизитов курса — DAG: ребро A в B значит, что A должно быть раньше B, а цикл сделал бы требования невыполнимыми. Системы сборки и формулы таблиц имеют ту же форму. Топологический порядок ставит каждую вершину после её пререквизитов и существует только у DAG. Кратчайшие пути на DAG стоят O(V + E), если ослаблять рёбра в этом порядке.

**Examples:**

```python
# 0 -> 1 -> 3
# 0 -> 2 -> 3
prereq = {0: [1, 2], 1: [3], 2: [3], 3: []}
```

**Sources:**

- [Directed Acyclic Graph](https://www.geeksforgeeks.org/dsa/introduction-to-directed-acyclic-graph/)
- [Topological Sorting](https://www.geeksforgeeks.org/dsa/topological-sorting/)
</details>

<details>
<summary>How would you detect a cycle in a directed graph?</summary>

### How would you detect a cycle in a directed graph?

**Definition:**

Ориентированный цикл есть, когда путь DFS доходит до вершины, которая всё ещё лежит в текущем стеке рекурсии. Поиск стоит O(V + E).

**How it works:**

Красят вершину в белый, серый или чёрный. Серый значит, что она на активном пути. Серый сосед — обратное ребро и цикл. Чёрный значит, что поддерево закончено. DFS начинают из каждой белой вершины, чтобы покрыть несвязный граф. GeeksforGeeks описывает эту раскраску DFS. Цикл в неориентированном графе проверяют иначе: посещённый сосед, который не родитель.

**Examples:**

```python
def dfs(u):
    color[u] = GRAY
    for v in adj[u]:
        if color[v] == GRAY or (color[v] == WHITE and dfs(v)):
            return True
    color[u] = BLACK
    return False
```

**Sources:**

- [Detect Cycle in a Directed Graph](https://www.geeksforgeeks.org/dsa/detect-cycle-in-a-graph/)
</details>

<details>
<summary>Discuss the differences between a graph and a tree.</summary>

### Discuss the differences between a graph and a tree.

**Definition:**

Дерево — связный неориентированный граф без цикла. В нём ровно V - 1 рёбер. Обычный граф может быть несвязным, ориентированным, взвешенным и с циклами.

**How it works:**

Между любыми двумя вершинами дерева один путь. Одно новое ребро создаёт цикл. Удаление одного ребра разрывает дерево. В графе путей может быть много или ни одного. DFS и BFS на дереве могут не помечать посещённые вершины, если не возвращаться к родителю, а графу это нужно. GeeksforGeeks противопоставляет эти структурные правила.

**Examples:**

```python
is_tree = connected and len(edges) == len(vertices) - 1 and not directed
```

**Sources:**

- [Difference between Graph and Tree](https://www.geeksforgeeks.org/dsa/difference-between-graph-and-tree/)
</details>

<details>
<summary>What is topological sorting and where is it used?</summary>

### What is topological sorting and where is it used?

**Definition:**

Топологический порядок — линейный порядок DAG, в котором каждое ребро u в v ставит u раньше v. Он существует ровно тогда, когда в ориентированном графе нет цикла. Алгоритм Кана и DFS оба работают за O(V + E).

**How it works:**

Алгоритм Кана считает входящие рёбра. В очередь кладут каждую вершину с indegree 0. Снимают u, дописывают её и уменьшают счётчик каждого соседа. Сосед, дошедший до 0, входит в очередь. Если в результате меньше V вершин, был цикл. Этот порядок нужен сборщикам, планировщикам курсов и пересчёту таблиц.

**Examples:**

```python
from collections import deque
queue = deque(u for u in range(V) if indegree[u] == 0)
order = []
while queue:
    u = queue.popleft()
    order.append(u)
    for v in adj[u]:
        indegree[v] -= 1
        if indegree[v] == 0:
            queue.append(v)
```

**Sources:**

- [Topological Sorting](https://www.geeksforgeeks.org/dsa/topological-sorting/)
</details>

<details>
<summary>Can you explain Bellman-Ford’s algorithm and its time complexity?</summary>

### Can you explain Bellman-Ford’s algorithm and its time complexity?

**Definition:**

Беллман-Форд считает кратчайшие пути из одной вершины, когда рёбра могут быть отрицательными, и обнаруживает отрицательный цикл. GeeksforGeeks даёт время O(V * E) и память O(V).

**How it works:**

Ставят `dist[src] = 0`, остальное — метку бесконечности. Каждое ребро ослабляют V - 1 раз: если `dist[u] + w < dist[v]`, записывают `dist[v]`. У простого кратчайшего пути не больше V - 1 рёбер, поэтому этих проходов достаточно. Ещё один проход, который всё ещё ослабляет ребро, значит отрицательный цикл; реализация GeeksforGeeks возвращает в этом случае -1. Дейкстра быстрее, но неверна при отрицательном ребре.

**Examples:**

```python
def bellman_ford(V, edges, src):
    dist = [10**8] * V
    dist[src] = 0
    for i in range(V):
        for u, v, w in edges:
            if dist[u] != 10**8 and dist[u] + w < dist[v]:
                if i == V - 1:
                    return [-1]
                dist[v] = dist[u] + w
    return dist
```

**Sources:**

- [Bellman-Ford](https://www.geeksforgeeks.org/dsa/bellman-ford-algorithm-dp-23/)
</details>

<details>
<summary>How do you determine if a graph is bipartite?</summary>

### How do you determine if a graph is bipartite?

**Definition:**

Граф двудольный, когда вершины делятся на два множества и каждое ребро идёт между множествами. Двухцветная раскраска BFS или DFS проверяет это за O(V + E).

**How it works:**

Стартовую вершину красят в 0, каждого неокрашенного соседа — в другой цвет. Если сосед уже того же цвета, есть нечётный цикл и граф не двудольный. Повторяют для каждой непосещённой вершины, чтобы проверить несвязные компоненты. GeeksforGeeks даёт двухцветный BFS как O(V + E). Дерево всегда двудольно.

**Examples:**

```python
from collections import deque

def is_bipartite(adj):
    color = [-1] * len(adj)
    for start in range(len(adj)):
        if color[start] != -1:
            continue
        queue = deque([start])
        color[start] = 0
        while queue:
            u = queue.popleft()
            for v in adj[u]:
                if color[v] == -1:
                    color[v] = 1 - color[u]
                    queue.append(v)
                elif color[v] == color[u]:
                    return False
    return True
```

**Sources:**

- [Check whether a graph is bipartite](https://www.geeksforgeeks.org/dsa/bipartite-graph/)
</details>

### Sorting and Searching

<details>
<summary>Describe the quicksort algorithm and its average case time complexity.</summary>

### Describe the quicksort algorithm and its average case time complexity.

**Definition:**

Быстрая сортировка выбирает опорный элемент, раскладывает массив так, чтобы меньшие были слева, а большие справа, затем сортирует обе стороны. GeeksforGeeks даёт средний случай θ(n log n).

**How it works:**

Разбиение Ломуто из той статьи стоит O(n). Лучший случай, Ω(n log n), — опора делит массив пополам. Худший случай, O(n²), — опора всегда наименьший или наибольший элемент; так бывает на отсортированном массиве, если опора — первый или последний элемент. Дополнительный стек — O(log n) при ровных частях и O(n) при перекосе. Сортировка неустойчива. Случайная опора убирает шаблон отсортированного массива.

**Examples:**

```python
def quick_sort(arr, low, high):
    if low < high:
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if arr[j] < pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        quick_sort(arr, low, i)
        quick_sort(arr, i + 2, high)
```

**Sources:**

- [QuickSort](https://www.geeksforgeeks.org/dsa/quick-sort/)
</details>

<details>
<summary>Explain the difference between a depth-first search and a breadth-first search in a binary tree.</summary>

### Explain the difference between a depth-first search and a breadth-first search in a binary tree.

**Definition:**

На двоичном дереве оба поиска посещают каждый из n узлов один раз, поэтому оба стоят O(n). Они различаются порядком и вспомогательной структурой.

**How it works:**

DFS использует рекурсию или стек и заканчивает поддерево раньше соседа. Прямой, симметричный и обратный обходы — порядки DFS. Глубина стека — высота h. BFS использует очередь и выдаёт узлы по уровням. Когда BFS впервые доходит до узла, этот путь имеет наименьшее число рёбер. Очередь держит до самого широкого уровня. У дерева n - 1 рёбер, поэтому графовая оценка O(V + E) здесь равна O(n).

**Examples:**

```python
def dfs(node):
    if node is None:
        return
    dfs(node.left)
    dfs(node.right)
```

**Sources:**

- [BFS vs DFS](https://www.geeksforgeeks.org/dsa/difference-between-bfs-and-dfs/)
- [Tree Traversals](https://www.geeksforgeeks.org/dsa/tree-traversals-inorder-preorder-and-postorder/)
</details>

<details>
<summary>How would you use a binary search on a rotated sorted array?</summary>

### How would you use a binary search on a rotated sorted array?

**Definition:**

Повёрнутый отсортированный массив — отсортированный массив, у которого концы перенесли. Один двоичный поиск всё ещё находит ключ за O(log n) и с дополнительной памятью O(1).

**How it works:**

GeeksforGeeks сравнивает `arr[low]` с `arr[mid]`, чтобы увидеть, какая половина отсортирована. Если левая половина отсортирована и ключ в ней, ищут слева, иначе справа. Симметричная проверка обрабатывает отсортированную правую половину. Каждый шаг отбрасывает половину оставшегося диапазона. Сначала найти точку поворота, затем искать в одной отсортированной стороне — тоже O(log n).

**Examples:**

```python
def search(arr, key):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == key:
            return mid
        if arr[lo] <= arr[mid]:
            if arr[lo] <= key < arr[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        elif arr[mid] < key <= arr[hi]:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

**Sources:**

- [Search in a Rotated Sorted Array](https://www.geeksforgeeks.org/dsa/search-an-element-in-a-sorted-and-pivoted-array/)
</details>

<details>
<summary>What is the difference between merge sort and heap sort?</summary>

### What is the difference between merge sort and heap sort?

**Definition:**

Обе сортировки O(n log n) в лучшем, среднем и худшем случаях. Сортировка слиянием устойчива и требует O(n) дополнительной памяти. Пирамидальная сортировка обходится дополнительной памятью O(1) и неустойчива.

**How it works:**

Слияние делит массив пополам, сортирует половины и сливает их. Слияние копирует во вспомогательный массив, поэтому память O(n), и равные ключи могут сохранить исходный порядок. Пирамидальная сортировка строит max-heap за O(n), затем многократно меняет корень с последним неотсортированным элементом и просеивает вниз, O(n log n). Обмены не сохраняют порядок равных ключей. Быстрая сортировка часто быстрее на практике, но её худший случай O(n²).

**When to use:**

Слияние — когда равные ключи должны сохранить порядок или вход — связный список. Пирамидальная сортировка — когда дополнительной памяти мало и устойчивость не важна.

**Examples:**

```python
# merge: stable, O(n) extra buffer
# heap: not stable, swaps inside the same array
```

**Sources:**

- [Merge Sort](https://www.geeksforgeeks.org/dsa/merge-sort/)
- [Heap Sort](https://www.geeksforgeeks.org/dsa/heap-sort/)
</details>

<details>
<summary>Can you describe bucket sort and give an example of its use case?</summary>

### Can you describe bucket sort and give an example of its use case?

**Definition:**

Блочная сортировка раскладывает значения по упорядоченным корзинам, сортирует каждую корзину и склеивает их. Когда значения равномерны на диапазоне, среднее время O(n + k) для n элементов и k корзин.

**How it works:**

Каждое значение отображают в индекс корзины. Короткий список сортируют вставками. Худший случай O(n²), если все значения попали в одну корзину. Типичное применение — числа, равномерно размазанные по интервалу, например нормированные оценки на [0, 1). Сортировка подсчётом — родственный выбор, когда ключи — небольшие целые.

**When to use:**

Используют для равномерно распределённых чисел в известном диапазоне. Не используют для данных, которые могут заполнить одну корзину.

**Examples:**

```python
def bucket_sort(values, k=10):
    buckets = [[] for _ in range(k)]
    for value in values:
        buckets[min(k - 1, int(value * k))].append(value)
    out = []
    for bucket in buckets:
        out.extend(sorted(bucket))
    return out
```

**Sources:**

- [Bucket Sort](https://www.geeksforgeeks.org/dsa/bucket-sort-2/)
</details>

<details>
<summary>Discuss the advantages of quicksort over other sorting algorithms.</summary>

### Discuss the advantages of quicksort over other sorting algorithms.

**Definition:**

GeeksforGeeks называет быструю сортировку дружелюбной к кэшу и быстрой на больших массивах в памяти, когда устойчивость не нужна. Средний случай — θ(n log n), и сортировка работает в исходном массиве.

**How it works:**

Она не копирует данные во вспомогательный массив, как слияние, поэтому хорошо использует строки кэша. Случайная опора или медиана делает шаблон O(n²) маловероятным. Она плоха для маленьких массивов, неустойчива, а фиксированная опора на конце даёт O(n²) на отсортированном вводе. У пирамидальной сортировки более жёсткий худший случай O(n log n). Слияние — устойчивая замена.

**When to use:**

Быстрая сортировка — для большого массива простых значений, когда равные элементы можно переставить. Слияние — когда сортировка должна быть устойчивой.

**Examples:**

```python
import random
pivot_index = random.randrange(low, high + 1)
```

**Sources:**

- [QuickSort](https://www.geeksforgeeks.org/dsa/quick-sort/)
</details>

<details>
<summary>How does the insertion sort work and what is its time complexity?</summary>

### How does the insertion sort work and what is its time complexity?

**Definition:**

Сортировка вставками наращивает отсортированный префикс. Каждый следующий элемент вставляют на его место в этом префиксе. Лучший случай O(n), средний и худший — O(n²).

**How it works:**

Лучший случай — уже отсортированный массив: каждый элемент сравнивают один раз и не двигают. Худший случай — обратный порядок: i-й элемент сдвигает i элементов. Дополнительная память O(1). Сортировка устойчива. Ею обычно сортируют маленькую корзину, и она дёшева для почти отсортированных данных. Для большого случайного массива её не выбирают.

**Examples:**

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
```

**Sources:**

- [Insertion Sort](https://www.geeksforgeeks.org/dsa/insertion-sort/)
</details>

<details>
<summary>What is a stable sort and why might it be important in certain scenarios?</summary>

### What is a stable sort and why might it be important in certain scenarios?

**Definition:**

Устойчивая сортировка сохраняет исходный относительный порядок элементов, которые сравниваются как равные. Слияние и вставки устойчивы. Быстрая и пирамидальная — нет.

**How it works:**

Если записи сортируют по фамилии, а затем по имени, устойчивый второй проход сохраняет порядок имён внутри одной фамилии. Неустойчивая сортировка может поменять два равных ключа и уничтожить прежний ключ. GeeksforGeeks отмечает, что быстрая сортировка меняет элементы по позиции опоры и поэтому этот порядок не сохраняет. Устойчивость важна для записей с несколькими ключами. Она не важна для одного ключа без порядка полезной нагрузки.

**Examples:**

```python
# stable: ("Ann", 1) stays before ("Ann", 2) when the name is the key
records.sort(key=lambda row: row[0])  # Python's sort is stable
```

**Sources:**

- [Stability in Sorting](https://www.geeksforgeeks.org/dsa/stability-in-sorting-algorithms/)
- [QuickSort](https://www.geeksforgeeks.org/dsa/quick-sort/)
</details>

<details>
<summary>Can you explain the counting sort algorithm?</summary>

### Can you explain the counting sort algorithm?

**Definition:**

Сортировка подсчётом считает, сколько раз встречается каждое целое из небольшого диапазона, затем записывает значения обратно по порядку. Для n элементов и диапазона k это O(n + k).

**How it works:**

Выделяют массив счётчиков длины k. Для каждого элемента увеличивают `count[value]`. Префиксные суммы счётчиков дают последний выходной индекс каждого значения. Вход обходят справа и ставят каждое значение на этот индекс, уменьшая его: так сортировка остаётся устойчивой. Это не сортировка сравнениями. Она плоха, когда k гораздо больше n.

**Examples:**

```python
def counting_sort(arr, k):
    count = [0] * k
    for value in arr:
        count[value] += 1
    out = []
    for value, times in enumerate(count):
        out.extend([value] * times)
    return out
```

**Sources:**

- [Counting Sort](https://www.geeksforgeeks.org/dsa/counting-sort/)
</details>

<details>
<summary>How would you sort a linked list?</summary>

### How would you sort a linked list?

**Definition:**

Сортировка слиянием подходит связному списку, потому что ей не нужен произвольный доступ. Разрезание и слияние узлов стоит O(n log n), а слияние перецепляет указатели вместо массива на n элементов.

**How it works:**

Середину находят медленным и быстрым указателями, список делят, обе половины сортируют и сливают, всегда цепляя меньшую голову. GeeksforGeeks приводит слияние для списков по этой причине. Разбиение быстрой сортировки неудобно без индексов. Вставки — O(n²), но годятся для короткого списка. Слияние снизу вверх избегает стека рекурсии O(log n).

**Examples:**

```python
def merge(a, b):
    dummy = tail = Node(0)
    while a and b:
        if a.value <= b.value:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next
```

**Sources:**

- [Merge Sort for Linked List](https://www.geeksforgeeks.org/dsa/merge-sort-for-linked-list/)
</details>

### Advanced Data Structures

<details>
<summary>Describe a red-black tree and its properties.</summary>

### Describe a red-black tree and its properties.

**Definition:**

Красно-чёрное дерево — двоичное дерево поиска, узлы которого окрашены так, что высота остаётся O(log n). Поиск, вставка и удаление стоят O(log n).

**How it works:**

Каждый узел красный или чёрный. Корень чёрный. Каждый листовой страж чёрный. У красного узла дети чёрные. Каждый путь от узла до листа-потомка содержит одно и то же число чёрных узлов. Вставка и удаление восстанавливают эти правила перекраской и поворотами. Дерево сбалансировано менее строго, чем AVL, поэтому поиск может сделать на несколько сравнений больше, а обновления поворачивают реже.

**Examples:**

```python
# after insert, fix red-red parent/child by recolor or rotate
# black-height of every root-to-leaf path stays equal
```

**Sources:**

- [Red-Black Tree](https://www.geeksforgeeks.org/dsa/red-black-tree-set-1-introduction-2/)
</details>

<details>
<summary>Explain what a B-tree is and where it might be used.</summary>

### Explain what a B-tree is and where it might be used.

**Definition:**

B-дерево — сбалансированное дерево поиска с многими ключами и детьми в узле. Все листья на одном уровне. Это обычная индексная структура на диске.

**How it works:**

Узел хранит несколько отсортированных ключей и на один дочерний указатель больше, чем ключей. Поиск идёт в одного ребёнка, поэтому высота мала при большом ветвлении. Узел размером со страницу диска, так что поиск стоит нескольких чтений страниц и в целом O(log n). Базы и файловые системы используют B-деревья и B+ деревья из-за этого. Двоичному дереву для того же n понадобилось бы гораздо больше случайных чтений.

**When to use:**

B-дерево — когда данные лежат на страницах диска или SSD. Красно-чёрное дерево — для упорядоченного отображения в памяти.

**Examples:**

```python
# one disk page: keys [10, 20, 30] and four child page ids
```

**Sources:**

- [B-Tree](https://www.geeksforgeeks.org/dsa/introduction-of-b-tree-2/)
</details>

<details>
<summary>Discuss the concept of a segment tree and one of its practical applications.</summary>

### Discuss the concept of a segment tree and one of its practical applications.

**Definition:**

Дерево отрезков отвечает на запросы по диапазону и точечные обновления массива за O(log n). Построение — O(n).

**How it works:**

Корень покрывает весь массив. Каждый внутренний узел покрывает половину, листья — один индекс. Узел суммы хранит сумму своего отрезка. Запрос режет нужный диапазон на O(log n) непересекающихся узлов и складывает их. Обновление меняет лист и пересчитывает предков до корня, тоже O(log n). Практическое применение — сумма, минимум или максимум любого подотрезка, который со временем меняется.

**Examples:**

```python
def query(node, start, end, left, right):
    if right < start or end < left:
        return 0
    if left <= start and end <= right:
        return tree[node]
    mid = (start + end) // 2
    return query(2 * node, start, mid, left, right) + query(2 * node + 1, mid + 1, end, left, right)
```

**Sources:**

- [Segment Tree](https://www.geeksforgeeks.org/dsa/segment-tree-set-1-sum-of-given-range/)
</details>

<details>
<summary>What is a suffix tree and how is it used in substring search?</summary>

### What is a suffix tree and how is it used in substring search?

**Definition:**

Суффиксное дерево — сжатый trie всех суффиксов текста. После построения образец длины m ищется за O(m), независимо от длины текста.

**How it works:**

GeeksforGeeks описывает построение как взятие каждого суффикса и вставку этих суффиксов в сжатый trie. Проход, который поглощает образец, значит, что образец встречается. То же дерево отвечает на самую длинную повторяющуюся подстроку и самую длинную общую подстроку. Оно плохо подходит, когда текст часто меняется, например в редакторе: дерево пришлось бы строить заново. KMP ищет один образец за O(n + m) без предобработки всех суффиксов.

**Examples:**

```python
# text "banana$" suffixes share compressed edges
# search "nana" by walking those edges, O(len(pattern))
```

**Sources:**

- [Suffix tree overview](https://www.geeksforgeeks.org/dsa/overview-of-graph-trie-segment-tree-and-suffix-tree-data-structures/)
</details>

<details>
<summary>Can you explain what a trie is and when you might use one?</summary>

### Can you explain what a trie is and when you might use one?

**Definition:**

Trie — дерево символов. Каждое ребро — один символ, слово — путь от корня. Вставка и поиск слова длины m стоят O(m).

**How it works:**

Узлы не хранят ключ целиком. Конец слова помечают на узле, где путь остановился. Общие префиксы делят узлы, поэтому словарь слов с общим началом занимает меньше места, чем хеш полных строк, и может перечислить все слова с данным префиксом. Автодополнение и проверка префикса — обычные случаи. Хеш-таблица лучше, когда проверяют только точные ключи и префиксы не важны.

**When to use:**

Trie — для запросов по префиксу. Хеш-таблица — только для точного ключа.

**Examples:**

```python
def insert(root, word):
    node = root
    for ch in word:
        node = node.children.setdefault(ch, {})
    node["$"] = True
```

**Sources:**

- [Trie](https://www.geeksforgeeks.org/dsa/trie-insert-and-search/)
</details>

<details>
<summary>Discuss the use of a bloom filter and its advantages over a traditional hash table.</summary>

### Discuss the use of a bloom filter and its advantages over a traditional hash table.

**Definition:**

Фильтр Блума — битовый массив и несколько хеш-функций. Он отвечает, точно ли ключа нет или он, возможно, есть. Возможны ложные срабатывания и нет ложных пропусков.

**How it works:**

Вставка ставит k бит, по одному на хеш. Поиск проверяет эти k бит. Если хоть один бит 0, ключ не вставляли. Если все 1, ключ может быть вставлен или биты принадлежат другим ключам. Структура гораздо меньше хранения самих ключей. Вернуть ключ она не может, и обычный фильтр Блума не умеет удалять. Его ставят дешёвой проверкой перед настоящим хранилищем.

**When to use:**

Фильтр Блума — когда хватает компактной проверки «возможно, есть». Хеш-таблица — когда нужно хранить ключ и не сообщать ложное попадание.

**Examples:**

```python
def add(bits, key, hashes):
    for fn in hashes:
        bits[fn(key) % len(bits)] = 1
```

**Sources:**

- [Bloom Filters](https://www.geeksforgeeks.org/dsa/bloom-filters-introduction-and-python-implementation/)
</details>

<details>
<summary>Explain the concept of a disjoint-set and its use in network connectivity.</summary>

### Explain the concept of a disjoint-set and its use in network connectivity.

**Definition:**

Система непересекающихся множеств хранит элементы группами. `find` возвращает представителя группы. `union` сливает две группы. С объединением по рангу и сжатием путей обе операции в среднем почти O(1), обратная функция Аккермана от n.

**How it works:**

Каждый элемент начинает в своём множестве. `find` идёт по родителям к корню и затем направляет эти узлы прямо на корень. `union` подвешивает корень меньшего ранга к другому корню. В сети два узла связаны, когда `find(a) == find(b)`. Минимальное остовное дерево Краскала той же проверкой пропускает ребро, которое замкнуло бы цикл.

**Examples:**

```python
def find(parent, x):
    if parent[x] != x:
        parent[x] = find(parent, parent[x])
    return parent[x]
```

**Sources:**

- [Disjoint Set](https://www.geeksforgeeks.org/dsa/disjoint-set-data-structures/)
</details>

<details>
<summary>What is a Fenwick tree (or binary indexed tree) and when might it be used?</summary>

### What is a Fenwick tree (or binary indexed tree) and when might it be used?

**Definition:**

Дерево Фенвика хранит префиксные агрегаты массива, так что точечное обновление и запрос префикса оба стоят O(log n).

**How it works:**

Индекс i отвечает за диапазон, который кончается в i и длина которого — младший установленный бит i. Обновление прибавляет дельту к i и затем к i + lowbit(i), это O(log n) индексов. Сумма префикса многократно вычитает этот бит. Памяти меньше и код проще, чем у дерева отрезков, и само по себе оно не отвечает на произвольный минимум диапазона. Его берут для частот и префиксных сумм, которые меняются. Дерево отрезков — следующий шаг, когда запрос не префикс и не обратимый агрегат.

**When to use:**

Дерево Фенвика — для точечных обновлений и префиксных сумм. Дерево отрезков — для произвольных сочетаний диапазона, например минимума.

**Examples:**

```python
def add(bit, i, delta):
    while i < len(bit):
        bit[i] += delta
        i += i & -i
```

**Sources:**

- [Fenwick Tree](https://www.geeksforgeeks.org/dsa/binary-indexed-tree-or-fenwick-tree-2/)
</details>

<details>
<summary>Discuss the differences between AVL trees and red-black trees.</summary>

### Discuss the differences between AVL trees and red-black trees.

**Definition:**

Оба — сбалансированные двоичные деревья поиска с поиском, вставкой и удалением O(log n). AVL держит более строгий баланс высоты. Красно-чёрное дерево реже поворачивается при обновлении.

**How it works:**

Узел AVL хранит баланс -1, 0 или 1 — разность высот детей. После вставки он может повернуться, чтобы вернуть это. Красно-чёрное дерево требует только равную чёрную высоту и запрет двух красных подряд, поэтому оно может быть чуть выше. Поиск чуть быстрее на AVL. Вставки и удаления с перебалансировкой дешевле на красно-чёрном дереве. Упорядоченные отображения языков часто используют красно-чёрные деревья из-за этой цены обновления.

**When to use:**

AVL — когда преобладает поиск. Красно-чёрное дерево — когда часты вставки и удаления.

**Examples:**

```python
balance = height(node.left) - height(node.right)  # AVL keeps this in {-1, 0, 1}
```

**Sources:**

- [AVL Tree](https://www.geeksforgeeks.org/dsa/avl-tree-set-1-insertion/)
- [Red-Black Tree](https://www.geeksforgeeks.org/dsa/red-black-tree-set-1-introduction-2/)
</details>

<details>
<summary>How would you implement a rope data structure and what is its use case?</summary>

### How would you implement a rope data structure and what is its use case?

**Definition:**

Канат — двоичное дерево, листья которого хранят куски строки, а внутренние узлы — сколько символов лежит слева. Его используют для больших текстов, которые склеивают и правят.

**How it works:**

GeeksforGeeks показывает склейку как новый корень, дети которого — два каната; до балансировки это O(1). Счётчик слева позволяет найти i-й символ спуском, O(высота). Разрезание режет один путь. В отличие от одного непрерывного массива, маленькая правка не копирует всю строку. Буфер с разрывом — более простая структура редактора: локальная вставка у курсора в среднем O(1), и GeeksforGeeks отмечает, что редакторы часто предпочитают его, потому что он проще.

**When to use:**

Канат — когда склеивают много больших строк. Буфер с разрывом — когда один курсор редактора делает локальные вставки и удаления.

**Examples:**

```python
def concat(left, right):
    return Rope(left_count=left.length, left=left, right=right, text=None)
```

**Sources:**

- [Ropes](https://www.geeksforgeeks.org/dsa/ropes-data-structure-fast-string-concatenation/)
- [Gap Buffer](https://www.geeksforgeeks.org/dsa/gap-buffer-data-structure/)
</details>

### Design Questions

<details>
<summary>How would you design a system that requires efficient frequent updates and retrieval of data?</summary>

### How would you design a system that requires efficient frequent updates and retrieval of data?

**Definition:**

Разделяют шаблон доступа. Точечные чтения и записи произвольных ключей — хеш-таблица. Упорядоченные чтения диапазона с обновлениями — сбалансированное дерево или дерево отрезков.

**How it works:**

Хеш-таблица даёт средние get и put O(1) и не хранит порядок. Красно-чёрное дерево даёт get, put и следующий ключ за O(log n). Дерево отрезков или Фенвика даёт суммы диапазона с точечными обновлениями за O(log n). Если рабочий набор больше памяти, B-дерево держит высоту маленькой в страницах. Самые горячие ключи кэшируют в LRU-таблице перед долговечной структурой.

**When to use:**

Хеш-таблица — для поиска по ключу. Сбалансированное дерево или дерево отрезков — когда запрос это диапазон. B-дерево — когда данные на диске.

**Examples:**

```python
by_id[key] = value          # point read/write
index_by_time.add(stamp)    # ordered scan
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
- [Red-Black Tree](https://www.geeksforgeeks.org/dsa/red-black-tree-set-1-introduction-2/)
- [Segment Tree](https://www.geeksforgeeks.org/dsa/segment-tree-set-1-sum-of-given-range/)
</details>

<details>
<summary>Discuss how you might implement autocomplete functionality.</summary>

### Discuss how you might implement autocomplete functionality.

**Definition:**

Trie хранит словарь так, что все слова с набранным префиксом делят один путь. Подсказки — обход этого поддерева.

**How it works:**

Каждое слово вставляют за O(m). На каждое нажатие проходят префикс за O(m). Если узел есть, DFS или BFS обходит поддерево и собирает узлы, помеченные как конец слова, обычно останавливаясь после k подсказок. Хеш-множество отвечает только на точные слова. Отсортированный массив слов тоже может найти нижнюю границу префикса за O(log n) и просмотреть соседей — это удобно, когда словарь статичен.

**When to use:**

Trie — когда словарь меняется и запрос это префикс. Отсортированный массив — когда список слов статичен.

**Examples:**

```python
node = walk(root, prefix)
if node:
    suggestions = collect_words(node, limit=5)
```

**Sources:**

- [Trie](https://www.geeksforgeeks.org/dsa/trie-insert-and-search/)
</details>

<details>
<summary>Can you design a data structure that supports insert, delete, get random element operations in constant time?</summary>

### Can you design a data structure that supports insert, delete, get random element operations in constant time?

**Definition:**

Соединяют динамический массив с хеш-таблицей из значения в индекс. Тогда вставка, удаление и случайный доступ в среднем O(1).

**How it works:**

Массив хранит значения. Таблица хранит индекс каждого значения. Вставка дописывает элемент и записывает индекс. Удаление меняет жертву с последним элементом, обновляет индекс переехавшего элемента и снимает последнюю ячейку, поэтому нет сдвига O(n). Случайное чтение — `array[randrange(len(array))]`. Для дубликатов нужна таблица из значения в множество индексов.

**Examples:**

```python
def remove(self, value):
    i = self.index.pop(value)
    last = self.items[-1]
    self.items[i] = last
    self.index[last] = i
    self.items.pop()
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
- [Linked List vs Array](https://www.geeksforgeeks.org/dsa/linked-list-vs-array/)
</details>

<details>
<summary>Explain how to design a parking lot using object-oriented principles.</summary>

### Explain how to design a parking lot using object-oriented principles.

**Definition:**

Стоянку моделируют объектами с одной обязанностью: места, машины, билет и табло, которое ищет свободное место. Назначение машины на место — состояние, которое должно оставаться согласованным.

**How it works:**

`Spot` знает размер и свободен ли он. `Vehicle` знает нужный размер. `ParkingLot` держит места по размерам, например хеш-таблицу из размера в множество свободных id, чтобы занять место было в среднем O(1). Билет хранит id места, id машины и время въезда. Не просматривают каждое место при каждом въезде, если множество свободных уже отвечает.

**Examples:**

```python
spot_id = free_by_size[vehicle.size].pop()
tickets[vehicle.id] = Ticket(spot_id, now)
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
</details>

<details>
<summary>Describe a data structure that could efficiently store a sparse matrix.</summary>

### Describe a data structure that could efficiently store a sparse matrix.

**Definition:**

Разреженная матрица состоит в основном из нулей. Хранят только ненулевые записи в хеш-таблице с ключом (строка, столбец) или в сжатых списках по строкам.

**How it works:**

Таблица занимает память пропорционально числу ненулей, а не произведению строк на столбцы. Чтение ячейки в среднем O(1). Сложение двух разреженных матриц обходит объединение их ключей. Список троек координат прост, но медленнее для проверки. Сжатая строка хранит индексы столбцов и значения по строкам и обычна, когда умножают на вектор.

**When to use:**

Хеш-таблица — для случайных правок ячеек. Сжатые строки — когда матрица статична и читают целые строки.

**Examples:**

```python
cells = {(0, 2): 5, (3, 1): 9}
value = cells.get((i, j), 0)
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
</details>

<details>
<summary>How would you implement a file system directory structure in terms of data structures?</summary>

### How would you implement a file system directory structure in terms of data structures?

**Definition:**

Каталог — дерево узлов. Каждый узел — файл или каталог, а дети каталога — хеш-таблица из имени в узел.

**How it works:**

Разбор пути режет `/a/b` и идёт от корня, в среднем O(1) на компонент. Указатель на родителя поддерживает `..`. Форма дерева совпадает с графом, который является деревом: один родитель, без циклов, кроме специальных ссылок `.` и `..`. Если данные файла большие, inode хранит канат или список id блоков, а не один непрерывный массив.

**Examples:**

```python
class Dir:
    def __init__(self):
        self.children = {}
root.children["docs"] = Dir()
```

**Sources:**

- [Difference between Graph and Tree](https://www.geeksforgeeks.org/dsa/difference-between-graph-and-tree/)
- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
</details>

<details>
<summary>Discuss the implementation of a phone book which needs to be efficient for look-up, insert, delete, and modification operations.</summary>

### Discuss the implementation of a phone book which needs to be efficient for look-up, insert, delete, and modification operations.

**Definition:**

Точное имя ищут хеш-таблицей. Если книга ещё должна перечислять имена по порядку или по префиксу, рядом держат trie или сбалансированное дерево.

**How it works:**

Get, put и delete хеша в среднем O(1) и покрывают изменение как put нового номера. Отсортированную книгу они не дают. Trie отвечает на префикс за O(m) и может перечислить продолжения. Красно-чёрное дерево отвечает на точный поиск за O(log n) и на симметричный список. Хеш-таблицу выбирают, когда единственный запрос — полное имя.

**When to use:**

Хеш-таблица — для точных имён. Trie — когда пользователь набирает префикс. Сбалансированное дерево — когда нужен отсортированный список.

**Examples:**

```python
book["Ada Lovelace"] = "555-0100"
book["Ada Lovelace"] = "555-0199"  # modify
del book["Ada Lovelace"]
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
- [Trie](https://www.geeksforgeeks.org/dsa/trie-insert-and-search/)
</details>

<details>
<summary>Explain the necessary data structures for a text editor which supports insertion, deletion, and character retrieval operations efficiently.</summary>

### Explain the necessary data structures for a text editor which supports insertion, deletion, and character retrieval operations efficiently.

**Definition:**

Буфер с разрывом держит дыру у курсора внутри одного массива. Локальные вставка и удаление в среднем O(1). Канат — замена, когда правки разбросаны по огромному документу.

**How it works:**

GeeksforGeeks описывает перенос разрыва к курсору и запись в него. Рост буфера, когда разрыв пуст, стоит O(n) и амортизируется многими локальными правками. Чтение i-го символа перескакивает разрыв. Одна непрерывная строка делает каждую вставку в середину O(n). Канат склеивает куски за O(1) до балансировки и находит символ по левым счётчикам, что лучше одного массива для очень больших документов.

**When to use:**

Буфер с разрывом — для одного курсора и локальных правок. Канат — для огромных текстов и частой склейки.

**Examples:**

```python
buffer[gap_left] = ch
gap_left += 1
```

**Sources:**

- [Gap Buffer](https://www.geeksforgeeks.org/dsa/gap-buffer-data-structure/)
- [Ropes](https://www.geeksforgeeks.org/dsa/ropes-data-structure-fast-string-concatenation/)
</details>

<details>
<summary>How would you store a large dataset that allows for efficient range queries and updates?</summary>

### How would you store a large dataset that allows for efficient range queries and updates?

**Definition:**

Если данные помещаются в память и запросы — диапазоны с точечными обновлениями, берут дерево отрезков или Фенвика. Если не помещаются — B-дерево.

**How it works:**

Дерево Фенвика делает префиксные суммы и точечные обновления за O(log n) с маленькой константой. Дерево отрезков делает произвольные диапазоны, включая минимум, за O(log n), построение O(n). B-дерево держит упорядоченные ключи на диске с большим ветвлением, так что просмотр диапазона читает мало страниц. Хеш-таблица не отвечает на диапазон без просмотра каждого ключа.

**When to use:**

Фенвик — для префиксных сумм. Дерево отрезков — для общих диапазонов. B-дерево — когда набор больше памяти.

**Examples:**

```python
total = prefix(right) - prefix(left - 1)  # Fenwick, O(log n)
```

**Sources:**

- [Segment Tree](https://www.geeksforgeeks.org/dsa/segment-tree-set-1-sum-of-given-range/)
- [Fenwick Tree](https://www.geeksforgeeks.org/dsa/binary-indexed-tree-or-fenwick-tree-2/)
- [B-Tree](https://www.geeksforgeeks.org/dsa/introduction-of-b-tree-2/)
</details>

<details>
<summary>Suggest the appropriate data structure for developing a shared document editor that multiple users can edit simultaneously.</summary>

### Suggest the appropriate data structure for developing a shared document editor that multiple users can edit simultaneously.

**Definition:**

Документ хранят как канат или буфер с разрывом для локальных правок, а одновременные правки — как упорядоченный журнал операций, который каждый клиент сливает.

**How it works:**

Видимому тексту всё ещё нужны быстрые вставка и удаление у курсора — это дают буфер с разрывом или канат. Одновременные пользователи не могут делить один изменяемый индекс массива: две вставки в одно смещение расходятся. Каждому символу или операции дают устойчивый id и держат полный порядок, например сбалансированное дерево id, чтобы удалённая вставка встала без переписывания всех последующих индексов. Хеш-таблица из id в узел находит символ в среднем за O(1), когда применяют удалённое удаление.

**Examples:**

```python
ops.append(("insert", after_id, "x"))
text.insert_after(after_id, "x")
```

**Sources:**

- [Ropes](https://www.geeksforgeeks.org/dsa/ropes-data-structure-fast-string-concatenation/)
- [Gap Buffer](https://www.geeksforgeeks.org/dsa/gap-buffer-data-structure/)
</details>

### Real-world Applications and Miscellaneous

<details>
<summary>What data structure would you use for a web browser’s back and forward button implementation?</summary>

### What data structure would you use for a web browser’s back and forward button implementation?

**Definition:**

Два стека. Один хранит страницы позади текущей. Другой — страницы впереди. Текущая страница стоит между ними.

**How it works:**

Назад снимает со стека «назад» и кладёт текущую страницу в стек «вперёд». Вперёд делает наоборот. Новый переход очищает стек «вперёд», потому что это будущее больше не действительно, затем кладёт текущую страницу в стек «назад». Каждая кнопка — O(1). Один список с индексом тоже работает, но два стека прямо соответствуют истории LIFO.

**Examples:**

```python
def go_back(self):
    self.forward.append(self.current)
    self.current = self.back.pop()
```

**Sources:**

- [Stack Data Structure](https://www.geeksforgeeks.org/dsa/stack-data-structure/)
</details>

<details>
<summary>Can you create a data structure that dynamically adjusts to user load such that it expands and contracts based on activity?</summary>

### Can you create a data structure that dynamically adjusts to user load such that it expands and contracts based on activity?

**Definition:**

Динамический массив делает это для стека или буфера. Удваивают ёмкость, когда он полон, и сжимают, когда он редкий, чтобы последовательность операций оставалась в среднем O(1).

**How it works:**

Дописывание при `size == capacity` выделяет новый блок, часто вдвое больше, и копирует n элементов, O(n) для этого вызова. Ёмкость уменьшают вдвое, когда размер падает ниже четверти, а не половины, чтобы рост и сжатие не чередовались на каждой операции. Хеш-таблица использует ту же идею: перехеширование, когда коэффициент заполнения переходит порог. Связный список растёт по одному узлу и никогда не копирует, ценой доступа O(n).

**Examples:**

```python
if self.size == self.capacity:
    self._resize(self.capacity * 2)
elif self.capacity > 8 and self.size * 4 < self.capacity:
    self._resize(self.capacity // 2)
```

**Sources:**

- [Linked List vs Array](https://www.geeksforgeeks.org/dsa/linked-list-vs-array/)
- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
</details>

<details>
<summary>Discuss how a data structure can influence database indexing.</summary>

### Discuss how a data structure can influence database indexing.

**Definition:**

Индекс — структура поиска рядом с таблицей. Индекс на B-дереве отвечает на упорядоченный поиск и диапазоны за несколько страниц диска. Хеш-индекс отвечает на точный ключ и не умеет идти по диапазону.

**How it works:**

Узел B-дерева примерно равен странице и имеет большое ветвление, поэтому высота мала, а просмотр диапазона в B+ дереве идёт последовательно по листьям. Хеш-индекс считает корзину и читает эту страницу, в среднем O(1) на равенство, с цепочками или страницами переполнения, когда корзина горячая. Двоичное дерево поиска в памяти дало бы одно случайное чтение на уровень. Выбор следует запросу: равенство или диапазон.

**When to use:**

B-дерево — для диапазонов и порядка. Хеш-индекс — для равенства по ключу, который никогда не читают по порядку.

**Examples:**

```sql
-- equality: hash or B-tree
-- range: B-tree, not a hash index
```

**Sources:**

- [B-Tree](https://www.geeksforgeeks.org/dsa/introduction-of-b-tree-2/)
- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
</details>

<details>
<summary>Explain the choice of data structure for implementing a search engine index.</summary>

### Explain the choice of data structure for implementing a search engine index.

**Definition:**

Обратный индекс отображает слово в список документов, где оно есть. Словарь слов — хеш-таблица или trie. Список вхождений — отсортированный массив id документов.

**How it works:**

Слово запроса — средний поиск в хеше O(1) или проход trie O(m). Пересечение двух отсортированных списков вхождений — линейное слияние, та же идея, что слияние отсортированных массивов. Фильтр Блума перед словарём может отвергнуть слова, которых точно нет. Суффиксное дерево — для поиска подстроки в одном тексте, а не для корпуса документов по словам.

**Examples:**

```python
hits = posting[term]  # sorted document ids
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
- [Trie](https://www.geeksforgeeks.org/dsa/trie-insert-and-search/)
- [Bloom Filters](https://www.geeksforgeeks.org/dsa/bloom-filters-introduction-and-python-implementation/)
</details>

<details>
<summary>How would you store and retrieve high-frequency data with minimal latency?</summary>

### How would you store and retrieve high-frequency data with minimal latency?

**Definition:**

Горячие записи держат в хеш-таблице в памяти. Таблицу ограничивают LRU-списком, чтобы самая давно не использованная запись уходила, когда бюджет полон. И get, и put остаются в среднем O(1).

**How it works:**

Попадание в кэш не ходит на диск. Промах читает долговечное B-дерево или таблицу и вставляет запись в начало LRU-списка. Если кэш полон, сбрасывают хвост. На горячем пути не используют структуру с поиском O(n). Фильтр Блума может пропустить чтение диска, когда ключа точно нет.

**Examples:**

```python
value = cache.get(key)
if value is None:
    value = store.read(key)
    cache.put(key, value)
```

**Sources:**

- [LRU Cache](https://www.geeksforgeeks.org/dsa/lru-cache-implementation/)
- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
</details>

<details>
<summary>Discuss the data structures you would use to implement a social network feed.</summary>

### Discuss the data structures you would use to implement a social network feed.

**Definition:**

Посты пользователя хранят в структуре, которая быстро добавляет новый пост в начало, а граф друзей — списками смежности.

**How it works:**

Связный список или deque ставит пост в начало за O(1). Динамический массив ставит в начало за O(n), если только новые посты не дописывают в конец и ленту не читают с конца. Граф друзей редкий, поэтому списки смежности занимают O(V + E), а не матрицу. Домашняя лента обходит соседей пользователя и сливает их посты по времени — то же слияние, что у двух отсортированных списков. Хеш-таблица из id пользователя в голову его постов делает начало каждого списка в среднем O(1).

**Examples:**

```python
posts[user].appendleft(post)  # O(1) newest-first
for friend in adj[user]:
    merge(feed, posts[friend])
```

**Sources:**

- [Queue using Linked List](https://www.geeksforgeeks.org/dsa/queue-linked-list-implementation/)
- [Graph and its representations](https://www.geeksforgeeks.org/dsa/graph-and-its-representations/)
</details>

<details>
<summary>How can a leaderboard system in a gaming platform be implemented with regard to data structures?</summary>

### How can a leaderboard system in a gaming platform be implemented with regard to data structures?

**Definition:**

Сбалансированное дерево или двоичная куча держат игроков по очкам. Хеш-таблица находит текущий узел игрока, чтобы обновление не просматривало всю таблицу.

**How it works:**

Красно-чёрное дерево по очкам поддерживает вставку, удаление и соседний ранг за O(log n), а симметричный обход печатает таблицу. Обновление очков удаляет старый ключ и вставляет новый. Хеш-таблица из id игрока в очки делает этот поиск в среднем O(1) плюс O(log n) в дереве. Двоичная куча находит лучшего игрока за O(1), но не перечисляет ранги вокруг произвольного игрока так же дёшево. Дерево Фенвика или отрезков по частотам отвечает, сколько игроков имеют очки ниже x, за O(log S).

**When to use:**

Упорядоченное дерево — для полного списка рангов. Куча — когда нужен только лучший игрок. Дерево Фенвика по частотам очков — для ранга по числу игроков.

**Examples:**

```python
order.remove((old_score, player))
order.add((new_score, player))
scores[player] = new_score
```

**Sources:**

- [Red-Black Tree](https://www.geeksforgeeks.org/dsa/red-black-tree-set-1-introduction-2/)
- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
- [Fenwick Tree](https://www.geeksforgeeks.org/dsa/binary-indexed-tree-or-fenwick-tree-2/)
</details>

<details>
<summary>Discuss how GPS systems use data structures to find the shortest path effectively.</summary>

### Discuss how GPS systems use data structures to find the shortest path effectively.

**Definition:**

Дорожная сеть — взвешенный граф: перекрёстки — вершины, участки дорог — рёбра с неотрицательной ценой проезда. Путь считает Дейкстра или A* с тем же правилом ослабления.

**How it works:**

Список смежности подходит редкому дорожному графу, память O(V + E). Дейкстра с двоичной кучей стоит O((V + E) log V) и верна, потому что время в пути не отрицательно. GeeksforGeeks показывает min-heap пар (расстояние, вершина) и пропуск устаревших записей кучи. Сжатие или иерархия могут уменьшить граф, который видит Дейкстра, но ядро — по-прежнему кратчайшие пути без отрицательных рёбер. Беллман-Форд без отрицательных рёбер не нужен и стоит O(V * E).

**Examples:**

```python
dist, parent = dijkstra(roads, start)
path = restore(parent, goal)
```

**Sources:**

- [Dijkstra's Algorithm](https://www.geeksforgeeks.org/dsa/dijkstras-shortest-path-algorithm-greedy-algo-7/)
- [Graph and its representations](https://www.geeksforgeeks.org/dsa/graph-and-its-representations/)
</details>

<details>
<summary>What data structures are involved in the implementation of ride-sharing applications like Uber or Lyft?</summary>

### What data structures are involved in the implementation of ride-sharing applications like Uber or Lyft?

**Definition:**

Карта улиц — взвешенный граф. Ближайшие водители — пространственный индекс плюс хеш-таблица. Сопоставление — запрос кратчайшего пути на этом графе.

**How it works:**

Списки смежности хранят дорожный граф. Дейкстра ищет маршрут, потому что веса рёбер — неотрицательное время поездки. Хеш-таблица из id водителя в положение и статус обновляется в среднем за O(1). Хеш сетки или дерево по клеткам карты возвращает водителей рядом с пассажиром без просмотра каждого водителя. Открытая поездка может лежать в очереди. Положения водителей часто меняются, поэтому корзину пространства обновляют на каждом движении, а не строят заново.

**Examples:**

```python
cell = (lat // size, lng // size)
drivers_in[cell].add(driver_id)
route = dijkstra(roads, rider_cell, driver_cell)
```

**Sources:**

- [Graph and its representations](https://www.geeksforgeeks.org/dsa/graph-and-its-representations/)
- [Dijkstra's Algorithm](https://www.geeksforgeeks.org/dsa/dijkstras-shortest-path-algorithm-greedy-algo-7/)
- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
</details>

<details>
<summary>How would a recommendation system benefit from specific data structures to personalize content for users?</summary>

### How would a recommendation system benefit from specific data structures to personalize content for users?

**Definition:**

Хеш-таблица хранит историю пользователя и признаки предмета для среднего поиска O(1). Граф хранит, кто с чем взаимодействовал. Обратный индекс хранит, какие пользователи трогали предмет.

**How it works:**

Пользователь к предметам — хеш-таблица множеств, поэтому запись просмотра в среднем O(1). Предмет к пользователям — та же форма, что список вхождений поиска, и поддерживает «кто ещё это смотрел». Несколько шагов по этому двудольному графу находят соседей. Trie всё ещё помогает, когда рекомендация начинается с набранного префикса. Куча размера k держит лучшие подсказки без сортировки каждого кандидата. Ни одна из этих структур не заменяет функцию ранжирования; они делают поиск кандидатов дешёвым.

**Examples:**

```python
seen[user].add(item)
for other in viewers[item]:
    if other != user:
        candidates[other] += 1
top = heapq.nlargest(k, candidates, key=candidates.get)
```

**Sources:**

- [Hashing](https://www.geeksforgeeks.org/dsa/hashing-data-structure/)
- [Graph and its representations](https://www.geeksforgeeks.org/dsa/graph-and-its-representations/)
- [Priority Queue](https://www.geeksforgeeks.org/dsa/priority-queue-set-1-introduction/)
</details>
