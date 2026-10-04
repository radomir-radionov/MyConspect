# Bit Manipulation — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./7_special_algorithms.md)

### Related docs

- [Bit Manipulation — собеседование](./7_algo_bits_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Bit Manipulation](https://devinterview.io/questions/data-structures-and-algorithms/bit-manipulation-interview-questions/).

### Bit Manipulation Fundamentals

<details>
<summary>What is a Bit?</summary>

### What is a Bit?

**Definition:**

Бит — одна двоичная цифра, наименьшая единица информации в цифровом компьютере. Он равен либо 0, либо 1.

**How it works:**

- Название сокращено от binary digit. Как булево значение это ложь или истина.
- Разряды — степени двойки, не десяти. Бит в позиции `i`, считая от 0 справа, стоит `2^i`.
- Четыре бита — ниббл: 16 комбинаций, одна шестнадцатеричная цифра от `0` до `F`. Восемь бит — байт: 256 комбинаций, от 0 до 255.
- Десятичное 5 — это байт `00000101`, потому что `4 + 1 = 5`.
- Побитовые операторы действуют на эти биты напрямую. AND, OR, XOR, NOT и сдвиги — одиночные операции АЛУ над машинным словом.
- Знаковое целое обычно в дополнительном коде. Фиксированное 64-битное знаковое значение покрывает от `-2^63` до `2^63 − 1`. Язык с целыми произвольной точности, например Python, растит битовую строку вместо переполнения слова.
- Машинное слово — ширина, которую процессор берёт в один регистр, 64 бита на нынешних процессорах общего назначения. Более широкие SIMD-регистры применяют ту же побитовую идею сразу к нескольким словам.

**Examples:**

`42 & 12` — это `00101010` AND `00001100`, то есть `00001000`, или 8.
</details>

<details>
<summary>What is a Byte?</summary>

### What is a Byte?

**Definition:**

Байт — группа из 8 бит, её же называют октетом. В ней 256 различных комбинаций, беззнаковые значения от 0 до 255.

**How it works:**

- Биты нумеруют от 0 справа, младший бит, до 7 слева, старший бит. Бит `i` даёт `b_i * 2^i`.
- Веса разрядов: 1, 2, 4, 8, 16, 32, 64 и 128. Все восемь бит установлены — это 255.
- На обычных архитектурах байт — наименьшая адресуемая единица. Большие целые — последовательности байт, которые читают с учётом порядка байт.
- `int(bit_string, 2)` разбирает двоичный текст. Сборка левым сдвигом делает то же без разбора строки: начать с 0 и для каждого следующего бита выполнить `(value << 1) | bit`.
- Сырые байты — другой объект, чем двоичная строка. `int.from_bytes(b"\xff", "big")` читает байт из всех единиц как 255.
- SIMD-код часто двигает 16, 32 или 64 байта одной инструкцией. Байт остаётся единицей, из которой собраны эти векторы.

**Examples:**

```text
value = 0
for bit in [1, 0, 1, 1, 0, 0, 0, 0]:  # сначала старший бит
    value = (value << 1) | bit
# value == 176
```
</details>

<details>
<summary>Explain what is a Bitwise Operation.</summary>

### Explain what is a Bitwise Operation.

**Definition:**

Побитовая операция сочетает отдельные биты одного или двух целых. Арифметико-логическое устройство процессора делает это одной инструкцией над машинным словом.

**How it works:**

- AND (`&`) равен 1 только там, где оба бита равны 1. Им вырезают поля. `5 & 3` — это `0101 & 0011 = 0001`.
- OR (`|`) равен 1 там, где хотя бы один бит равен 1. Им устанавливают биты. `5 | 3` — это `0111`, то есть 7.
- XOR (`^`) равен 1 там, где биты различаются. Им переключают и проверяют чётность. `5 ^ 3` — это `0110`, то есть 6.
- NOT (`~`) переворачивает каждый бит. В дополнительном коде `~x` равно `-(x + 1)`, поэтому `~5` — это `-6`.
- Левый сдвиг `x << k` двигает биты к старшему концу и заполняет нули, умножая на `2^k`, если ничего не выдвинулось. `5 << 2` равно 20.
- Арифметический правый сдвиг `x >> k` двигает биты к младшему концу. На неотрицательном значении это деление нацело на `2^k`. `5 >> 2` равно 1.
- Логический правый сдвиг (`>>>` в Java и JavaScript) заполняет старший конец нулями. В Python нет `>>>`; замаскируйте до нужной ширины и сдвиньте.
- Отрицание в дополнительном коде — «перевернуть биты и прибавить 1». Population count — число единичных битов; Python показывает его как `int.bit_count()`.
- Типичные применения: упаковать флаги в одно слово, принадлежность в фильтре Блума, биты прав и разрезать 32-битный цвет на 8-битные каналы.

**Examples:**

```text
READ, WRITE, EXEC = 1, 2, 4
perms = READ | WRITE          # 0b011
can_exec = perms & EXEC       # 0
perms ^= EXEC                 # переключить execute -> 0b111
```
</details>

<details>
<summary>What are some real-world applications of Bitwise Operators?</summary>

### What are some real-world applications of Bitwise Operators?

**Definition:**

Побитовые операторы упаковывают, маскируют и перемешивают биты внутри слова. Они появляются там, где программа говорит с плотной двоичной раскладкой, а не с отдельной переменной на каждый флаг.

**How it works:**

- Сжатие дописывает коды переменной длины, как в кодировании Хаффмана, сдвигая биты в байтовый поток. Упаковка битов кладёт несколько маленьких полей, например 10-битные каналы, в одно целое, чтобы они делили строку кэша.
- Симметричные шифры вроде AES и ChaCha20 перемешивают состояние через XOR и вращения. Контрольные суммы вроде CRC используют XOR и сдвиги, чтобы поймать перевёрнутый бит.
- Проверка подсети — это `ip & mask`. Маска оставляет префикс сети и очищает биты хоста.
- Регистры устройства обновляют на месте: `reg |= 1 << k` ставит бит, `reg &= ~(1 << k)` снимает его, `reg ^= 1 << k` переключает.
- `n > 0 and (n & (n - 1)) == 0` проверяет степень двойки. Битовое множество хранит булев массив по одному биту на флаг, примерно в восемь раз плотнее массива байтов.
- Графический код использует сдвиги вместо деления на степень двойки и маски, чтобы выделить цветовые каналы.
- Бит чётности или `bit_count() & 1` ловит однобитовую ошибку. Фильтр Блума делает OR индексов хеша в битовый массив.

**Examples:**

```text
READ, WRITE = 1 << 0, 1 << 1
state = READ | WRITE
can_write = bool(state & WRITE)
state ^= (1 << 3)             # переключить флаг шифрования
```
</details>

<details>
<summary>What is a bitwise AND operation and how can it be used to check if a number is odd or even?</summary>

### What is a bitwise AND operation and how can it be used to check if a number is odd or even?

**Definition:**

Побитовое AND пишет 1 только в тех позициях, где оба входа имеют 1. AND с единицей выделяет младший бит, а это чётность целого.

**How it works:**

- Каждый более старший бит — положительная степень двойки, поэтому он чётный. Бит весом `2^0` — единственный, который может сделать число нечётным.
- `n & 1` равно 0, когда `n` чётно, и 1, когда `n` нечётно.
- Тот же оператор — это маска. `n & mask` очищает каждый бит, который в маске равен 0, и оставляет биты, которые равны 1 в обоих.
- На слове фиксированной ширины операция — одна инструкция. Компилятор часто переписывает `n % 2` в эту проверку, когда делитель — константа 2.
- Это работает и для отрицательных значений в дополнительном коде: младший бит всё ещё остаток по модулю 2.

**Examples:**

```text
is_odd = (n & 1) == 1
is_even = (n & 1) == 0
```

`6 & 1` равно 0. `7 & 1` равно 1.
</details>

<details>
<summary>Explain the bitwise OR operation with an example.</summary>

### Explain the bitwise OR operation with an example.

**Definition:**

Побитовое OR пишет 1 в каждой позиции, где хотя бы один из двух входов имеет 1. Это оператор, который включает бит, не трогая остальные.

**How it works:**

- `0 | 0` равно 0. Любая пара, где есть 1, даёт 1. OR не может снять бит: единица в любом входе остаётся единицей.
- `n | (1 << k)` принудительно включает бит `k` и оставляет каждый другой бит `n` как был.
- OR двух масок — их объединение. Слово прав собирают, делая OR флагов, которые должны присутствовать.
- Включающее OR отличается от XOR. OR сохраняет 1, когда обе стороны равны 1. XOR выключил бы эту позицию.

**Examples:**

`0b1010 | 0b0100` равно `0b1110`. В десятичной записи `10 | 4` равно 14. `0b1010 | 0b0010` остаётся `0b1010`, потому что этот бит уже был установлен.
</details>

<details>
<summary>How does the bitwise XOR operation work, and what is it commonly used for?</summary>

### How does the bitwise XOR operation work, and what is it commonly used for?

**Definition:**

XOR пишет 1 там, где два бита различаются, и 0 там, где они совпадают. Он обратен сам себе, поэтому появляется в обменах, контрольных суммах и в задаче «найти единственный элемент».

**How it works:**

- `0 ^ 0` и `1 ^ 1` равны 0. `0 ^ 1` и `1 ^ 0` равны 1.
- `a ^ a` равно 0, `a ^ 0` равно `a`, и `a ^ b ^ b` равно `a`. Операция коммутативна и ассоциативна.
- XOR массива, в котором каждое значение встречается дважды, гасит эти пары и оставляет значение, которое встречается один раз.
- Три XOR меняют две переменные: `a ^= b; b ^= a; a ^= b`. Это ломается, если `a` и `b` — один и тот же объект.
- Внутри сумматора XOR — сумма двух битов без переноса. Перенос — это AND, сдвинутый влево.
- Переворот любого входного бита переворачивает бегущий XOR, поэтому однобитовое изменение видно в контроле чётности.
- `n ^ (1 << k)` переключает бит `k` и не трогает остальное слово.

**Examples:**

`5 ^ 3` — это `0101 ^ 0011 = 0110`, то есть 6. XOR с 3 ещё раз возвращает 5.
</details>

<details>
<summary>Demonstrate how to set, toggle, and clear a specific bit in a number using bitwise operators.</summary>

### Demonstrate how to set, toggle, and clear a specific bit in a number using bitwise operators.

**Definition:**

Строят маску из одного бита `1 << k` и сочетают её со словом. OR ставит бит, XOR переключает его, а AND с перевёрнутой маской снимает его.

**How it works:**

- Биты нумеруют от 0 с младшего конца. `mask = 1 << k` имеет установленным только бит `k`.
- Поставить: `n | mask`. Единица в маске принудительно включает эту позицию.
- Переключить: `n ^ mask`. Позиции, где маска равна 0, не меняются, а бит `k` переворачивается.
- Снять: `n & ~mask`. Дополнение имеет 0 только в бите `k`, поэтому AND сохраняет каждый другой бит и выключает бит `k`.
- Проверить: `(n & mask) != 0`.
- На знаковом слове фиксированной ширины у `~mask` старшие биты установлены. Для снятия бита это и нужно. В языке с бесконечными знаковыми битами замаскируйте дополнение до используемой ширины.

**Examples:**

```text
mask = 1 << 2          # 0b100
n = 0b1001
set    = n | mask      # 0b1101
toggle = n ^ mask      # 0b1101
clear  = set & ~mask   # 0b1001
```
</details>

<details>
<summary>What is bit masking, and how would you create a mask to isolate the nth bit?</summary>

### What is bit masking, and how would you create a mask to isolate the nth bit?

**Definition:**

Маска — целое, у которого единичные биты отмечают позиции, которые нужно прочитать или изменить. Выделить бит `n` значит сделать AND с маской, у которой установлен только этот бит.

**How it works:**

- `mask = 1 << n`. Тогда `value & mask` равно либо 0, либо `mask`.
- Сдвиньте результат вправо на `n`, если бит нужен как 0 или 1: `(value >> n) & 1`.
- Поле от бита `lo` до бита `hi` использует ряд единиц, `((1 << (hi - lo + 1)) - 1) << lo`, затем AND.
- Маски складываются. OR объединяет их, AND пересекает, XOR переворачивает ровно отмеченные биты.
- Снятие использует дополнение маски. Установка использует OR. Сама маска не содержит биты данных.

**Examples:**

```text
выделить бит 3 у 0b11010:
  0b11010 & (1 << 3)     # 0b01000
  (0b11010 >> 3) & 1     # 1
```
</details>

<details>
<summary>Explain how left and right shifts (`<<` and `>>`) work in bit manipulation.</summary>

### Explain how left and right shifts (`<<` and `>>`) work in bit manipulation.

**Definition:**

Сдвиг двигает каждый бит на одно и то же число позиций. Биты, которые покидают слово, пропадают, а освободившийся конец заполняется битом-заполнителем.

**How it works:**

- `n << k` двигает биты к старшему концу и заполняет младший конец нулями. Когда результат ещё влезает, это умножение на `2^k`. `5 << 2` — это `10100`, то есть 20.
- Логический правый сдвиг двигает биты к младшему концу и заполняет старший конец нулями. На беззнаковом значении это деление нацело на `2^k`.
- Арифметический правый сдвиг копирует знаковый бит в освободившиеся позиции, поэтому отрицательное значение в дополнительном коде остаётся отрицательным. Для неотрицательного значения он совпадает с логическим сдвигом. `5 >> 2` равно 1.
- На одних архитектурах счётчик сдвига берут по модулю ширины слова, на других счётчик вне `0 .. width-1` не определён. Уменьшите `k` сами, если язык этого не делает.
- Сдвиг в знаковый бит или выдвиг единицы из знакового слова фиксированной ширины — это место, где видно переполнение. Целые произвольной точности просто растут.

**Examples:**

`0b001101 << 1` равно `0b011010`. `0b001101 >> 1` равно `0b000110`. Бит, упавший справа, пропал; вращение сохранило бы его.
</details>

<details>
<summary>What is the difference between `>>` and `>>>` operators?</summary>

### What is the difference between `>>` and `>>>` operators?

**Definition:**

`>>` — арифметический правый сдвиг: освободившиеся старшие биты заполняются копией знакового бита. `>>>` — логический правый сдвиг: эти биты заполняются нулями.

**How it works:**

- На неотрицательном значении операторы совпадают, потому что знаковый бит и так 0.
- На отрицательном значении в дополнительном коде `>>` сохраняет результат отрицательным. `>>>` в конце даёт неотрицательный битовый рисунок, потому что слева входят нули.
- Java определяет `>>>` для `int` и `long`. JavaScript сначала приводит операнд к 32-битному целому: знаковому для `>>`, беззнаковому для `>>>`.
- В Python нет `>>>`. Тот же эффект на рисунке ширины `w` — это `(n & ((1 << w) - 1)) >> k`.
- Используйте `>>>` или беззнаковую маску, когда сдвигаете битовое поле и нельзя размазать знаковый бит по данным. Используйте `>>`, когда имеется в виду деление знакового целого нацело на степень двойки.

**Examples:**

В 32-битном слове `-8 >> 1` остаётся отрицательным (`-4`). `-8 >>> 1` — большое положительное значение, потому что знаковый бит сдвинулся вправо, а его место занял ноль.
</details>

<details>
<summary>Explain how to perform left and right bit rotations.</summary>

### Explain how to perform left and right bit rotations.

**Definition:**

Вращение двигает биты как сдвиг, а затем возвращает биты, выпавшие с одного конца, на другой конец. Число единичных битов в слове не меняется.

**How it works:**

- Для слова ширины `w` вращение влево на `k` — это `((n << k) | (n >> (w - k)))`, замаскированное до `w` бит. Сначала берут `k` по модулю `w`.
- Правый сдвиг в этой формуле должен быть логическим. Арифметический скопировал бы знаковый бит вместо битов, которые перешли по кругу.
- Вращение вправо на `k` — это вращение влево на `w - k`, или та же формула с переставленными расстояниями.
- Обычный сдвиг уничтожает биты и заполняет нули. Вращение обратимо: вращение назад на то же расстояние восстанавливает слово.
- Хеши и шифры используют вращения, потому что они перемешивают старшие биты в младшие без нулевого заполнения сдвига.

**Examples:**

```text
def rotl(n, k, w=8):
    k %= w
    n &= (1 << w) - 1
    return ((n << k) | (n >> (w - k))) & ((1 << w) - 1)
```

`rotl(0b10000001, 1)` равно `0b00000011`.
</details>

### Bitwise Problem Solving and Algorithms

<details>
<summary>Write a function that counts the number of set bits (1s) in an integer.</summary>

### Write a function that counts the number of set bits (1s) in an integer.

**Definition:**

Population count — это число единичных битов. Цикл Кернигана снимает один установленный бит за итерацию, поэтому он идёт по разу на единичный бит, а не по разу на бит ширины.

**How it works:**

- `n & (n - 1)` выключает младший установленный бит. Вычитание единицы переворачивает этот бит и каждый ноль ниже него; AND сохраняет более старшие единицы.
- Повторяют, пока `n` не станет 0, и считают итерации.
- Слово фиксированной ширины может использовать аппаратный popcount или параллельную сумму, которая складывает соседние группы битов несколькими масками и сдвигами. На 32- или 64-битном слове этот параллельный метод — константное число операций.
- `int.bit_count()` в Python — библиотечная форма. На целом произвольной точности стоимость следует числу разрядов, а не одной инструкции.
- Результат — целое от 0 до ширины, его же называют весом Хэмминга.

**Examples:**

```text
def popcount(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count
```

`popcount(0b10110)` равно 3.
</details>

<details>
<summary>Determine if a number is a power of two using bit manipulation.</summary>

### Determine if a number is a power of two using bit manipulation.

**Definition:**

Положительная степень двойки имеет ровно один установленный бит. `n > 0 and n & (n - 1) == 0` ловит этот рисунок.

**How it works:**

- `8` — это `1000`. `7` — это `0111`. Их AND равен 0.
- Любой другой положительный рисунок имеет хотя бы два единичных бита, поэтому снятие младшего всё ещё оставляет 1, и AND не равен 0.
- Ноль не является положительной степенью двойки, а `0 & -1` был бы 0, поэтому проверка `n > 0` обязательна.
- Отрицательные значения вне этого теста. В дополнительном коде у них нет рисунка одной положительной степени двойки.
- Проверка — одна инструкция после сравнения. Цикл, который делит на два, тоже работает и делает Θ(log n) шагов.

**Examples:**

```text
def is_pow2(n):
    return n > 0 and (n & (n - 1)) == 0
```

`is_pow2(16)` истинно. `is_pow2(12)` ложно. `is_pow2(0)` ложно.
</details>

<details>
<summary>Design a function that adds two numbers without using the ‘+’ operator.</summary>

### Design a function that adds two numbers without using the ‘+’ operator.

**Definition:**

XOR — сумма двух битов без переноса, а AND, сдвинутый влево, — этот перенос. Повторяют, пока слово переноса не станет нулём.

**How it works:**

- `sum_bits = a ^ b` складывает каждый разряд и отбрасывает перенос.
- `carry = (a & b) << 1` — единица в следующем разряде там, где оба бита были 1.
- Заменяют `a` на `sum_bits` и `b` на `carry` и повторяют. Когда `b` равно 0, переносить больше нечего, и `a` — сумма.
- Это сумматор со сквозным переносом, записанный циклом. На слове фиксированной ширины перенос выдвигается в пределах этой ширины, поэтому цикл кончается.
- Вычитание — та же процедура над `a` и дополнительным кодом `b` (`~b` с прибавлением 1). Если запрещён только знак `+` в исходнике, единицу можно получить тем же циклом переноса.
- Переполнение на знаковом слове фиксированной ширины — это перенос в знаковый бит, как при обычном сложении.

**Examples:**

```text
def add(a, b):
    while b:
        carry = (a & b) << 1
        a = a ^ b
        b = carry
    return a
```

`add(5, 3)` гоняет перенос, пока не вернёт 8.
</details>

<details>
<summary>Implement a function that swaps the values of two variables without using extra space.</summary>

### Implement a function that swaps the values of two variables without using extra space.

**Definition:**

</details>

<details>
<summary>Find the only non-repeating element in an array where each element repeats twice, using bitwise operations.</summary>

### Find the only non-repeating element in an array where each element repeats twice, using bitwise operations.

**Definition:**

</details>

<details>
<summary>Given a list of numbers where every number appears three times except for one, find the single non-repeated number.</summary>

### Given a list of numbers where every number appears three times except for one, find the single non-repeated number.

**Definition:**

</details>

<details>
<summary>Implement a bit manipulation algorithm to find and clear the lowest set bit in a number.</summary>

### Implement a bit manipulation algorithm to find and clear the lowest set bit in a number.

**Definition:**

</details>

<details>
<summary>Write a function that would generate the next higher number with the same number of set bits as the given positive integer.</summary>

### Write a function that would generate the next higher number with the same number of set bits as the given positive integer.

**Definition:**

</details>

<details>
<summary>Reverse the bits of an unsigned integer.</summary>

### Reverse the bits of an unsigned integer.

**Definition:**

</details>

<details>
<summary>Calculate the absolute value of an integer using bit manipulation.</summary>

### Calculate the absolute value of an integer using bit manipulation.

**Definition:**

</details>

<details>
<summary>Multiply and divide a number by two using bit manipulation.</summary>

### Multiply and divide a number by two using bit manipulation.

**Definition:**

</details>

<details>
<summary>Determine the log base 2 of an integer using bitwise operations.</summary>

### Determine the log base 2 of an integer using bitwise operations.

**Definition:**

</details>

### Advanced Bit Manipulation Techniques

<details>
<summary>How can you detect and handle integer overflow and underflow while using bit manipulation for arithmetic operations?</summary>

### How can you detect and handle integer overflow and underflow while using bit manipulation for arithmetic operations?

**Definition:**

</details>

<details>
<summary>Explain the significance of setting flags and checking bits in the implementation of a bitmap or bitset.</summary>

### Explain the significance of setting flags and checking bits in the implementation of a bitmap or bitset.

**Definition:**

</details>

<details>
<summary>How can bit manipulation be used to perform efficient matrix multiplication of binary matrices?</summary>

### How can bit manipulation be used to perform efficient matrix multiplication of binary matrices?

**Definition:**

</details>

<details>
<summary>Design an algorithm to perform endian conversion (big endian to little endian and vice versa) using bit manipulation.</summary>

### Design an algorithm to perform endian conversion (big endian to little endian and vice versa) using bit manipulation.

**Definition:**

</details>

### Bit Manipulation in Computing and Data Processing

<details>
<summary>Give an example of how to use bitwise operations to implement a simple compression algorithm.</summary>

### Give an example of how to use bitwise operations to implement a simple compression algorithm.

**Definition:**

</details>

<details>
<summary>Can bitwise operations be used to efficiently encode and decode data? Illustrate with an example.</summary>

### Can bitwise operations be used to efficiently encode and decode data? Illustrate with an example.

**Definition:**

</details>

<details>
<summary>How are bitwise operations used in Huffman coding or other compression algorithms?</summary>

### How are bitwise operations used in Huffman coding or other compression algorithms?

**Definition:**

</details>

<details>
<summary>Explain the role of bit manipulation in encoding and decoding data, like Base64.</summary>

### Explain the role of bit manipulation in encoding and decoding data, like Base64.

**Definition:**

</details>

<details>
<summary>Discuss how bitmasking can manage the state of multiple boolean flags in a single byte.</summary>

### Discuss how bitmasking can manage the state of multiple boolean flags in a single byte.

**Definition:**

</details>

<details>
<summary>Explain the use of bit manipulation in network programming, specifically in creating and interpreting network packets.</summary>

### Explain the use of bit manipulation in network programming, specifically in creating and interpreting network packets.

**Definition:**

</details>

### Bit Manipulation Challenges and Creative Use Cases

<details>
<summary>Implement a modular exponentiation algorithm using bit manipulation.</summary>

### Implement a modular exponentiation algorithm using bit manipulation.

**Definition:**

</details>

<details>
<summary>Find the XOR of all numbers within a given range.</summary>

### Find the XOR of all numbers within a given range.

**Definition:**

</details>

<details>
<summary>Generate all possible subsets of a set using bit manipulation.</summary>

### Generate all possible subsets of a set using bit manipulation.

**Definition:**

</details>

<details>
<summary>Determine if a binary representation of an integer is a palindrome.</summary>

### Determine if a binary representation of an integer is a palindrome.

**Definition:**

</details>

<details>
<summary>Find the minimum and maximum of two integers without using comparisons.</summary>

### Find the minimum and maximum of two integers without using comparisons.

**Definition:**

</details>

<details>
<summary>Check if two integers have opposite signs using bit manipulation.</summary>

### Check if two integers have opposite signs using bit manipulation.

**Definition:**

</details>
