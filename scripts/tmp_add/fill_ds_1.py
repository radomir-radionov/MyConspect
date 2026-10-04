# Temporary filler. Deleted after the notes are updated.
ANSWERS = {}

ANSWERS["7_ds_arrays_interview.md"] = [
"""An array stores elements in one contiguous block, so the address of index i is the base address plus i times the element size. Random access is O(1). Searching an unsorted array is O(n), and inserting or deleting in the middle is O(n) because neighbors must shift. Most languages use zero-based indexes and a single element width.""",
"""Массив хранит элементы в одном непрерывном блоке, поэтому адрес индекса i — это базовый адрес плюс i, умноженное на размер элемента. Случайный доступ — O(1). Поиск в неотсортированном массиве — O(n), а вставка и удаление в середине — O(n), потому что соседей приходится сдвигать. В большинстве языков индексы с нуля и одна ширина элемента.""",

"""A dynamic array keeps a contiguous buffer together with a length and a capacity. When an append does not fit, it allocates a larger buffer, often about twice as big, copies the old elements, and continues. Indexed access stays O(1). One resize is O(n), but a series of appends is amortized O(1). Inserts and deletes in the middle are still O(n).""",
"""Динамический массив хранит непрерывный буфер, длину и ёмкость. Если элемент не помещается в конец, выделяется больший буфер, часто примерно вдвое, старые элементы копируются, и запись продолжается. Доступ по индексу остаётся O(1). Одно расширение стоит O(n), но серия добавлений амортизируется до O(1). Вставки и удаления в середине по-прежнему O(n).""",

"""An associative array, also called a dictionary or map, stores values under unique keys and looks them up by key rather than by position. Writing an existing key replaces its value. A hash table does this in expected O(1) and can fall to O(n) if every key hits one bucket. A balanced search tree stays at O(log n). A list of pairs is only O(n).""",
"""Ассоциативный массив, или словарь, хранит значения по уникальным ключам и ищет их по ключу, а не по позиции. Запись существующего ключа заменяет значение. Хеш-таблица делает это за ожидаемые O(1) и может упасть до O(n), если все ключи попали в одну корзину. Сбалансированное дерево поиска держит O(log n). Список пар даёт только O(n).""",

"""Dimensionality is the number of indexes needed to name one element. One index is a sequence, two indexes are a grid of rows and columns, and three indexes are a stack of grids. The element count is the product of the axis sizes. In memory the data is still flat, or an array of arrays: several indexes collapse to one offset using each dimension's length.""",
"""Размерность — сколько индексов нужно, чтобы назвать один элемент. Один индекс — последовательность, два — сетка строк и столбцов, три — стопка сеток. Число элементов равно произведению размеров осей. В памяти данные всё равно плоские либо это массив массивов: несколько индексов сводятся к одному смещению по длине каждого измерения.""",

"""- **Advantages:** O(1) access by index, and a contiguous layout that sequential scans use the CPU cache for.
- **Disadvantages:** fixed capacity unless the array grows, and O(n) inserts or deletes in the middle because elements must move.

Prefer an array when the size is known or index access dominates. Prefer a linked list or a hash table when the middle of the collection changes constantly or lookup is by an arbitrary key.""",
"""- **Плюсы:** доступ по индексу за O(1) и непрерывная раскладка, которую последовательный обход хорошо кладёт в кэш процессора.
- **Минусы:** фиксированная ёмкость, если массив не растёт, и вставка или удаление в середине за O(n), потому что элементы приходится двигать.

Массив лучше, когда размер известен или преобладает доступ по индексу. Связный список или хеш-таблица лучше, когда середина коллекции постоянно меняется или поиск идёт по произвольному ключу.""",

"""A dense array allocates every slot, including zeros and other defaults. A sparse array stores only the entries that differ from the default, plus their indexes, as a map, a coordinate list, or a compressed layout such as CSR. That saves memory when almost every cell is empty, as in term-document matrices, sparse linear systems, and high-dimensional feature vectors. Lookup then searches an index instead of computing an offset, so it can be slower than a dense array.""",
"""Плотный массив выделяет каждую ячейку, включая нули и другие значения по умолчанию. Разреженный массив хранит только элементы, отличные от значения по умолчанию, вместе с индексами — как отображение, список координат или сжатую раскладку вроде CSR. Это экономит память, когда почти все ячейки пустые: матрицы «термин–документ», разреженные линейные системы, векторы признаков большой размерности. Поиск тогда идёт по индексу, а не по вычисленному смещению, поэтому может быть медленнее плотного массива.""",

"""- **Advantages:** binary search in O(log n), plus cheap successor, predecessor, and range queries, with good cache behavior.
- **Disadvantages:** an insert or delete must shift elements to keep the order, so those updates are O(n). Resizing and concurrent edits are awkward.

A sorted array fits data that is searched often and changed rarely.""",
"""- **Плюсы:** двоичный поиск за O(log n), а также дешёвые запросы соседа и диапазона при хорошей работе с кэшем.
- **Минусы:** вставка или удаление сдвигают элементы, чтобы сохранить порядок, поэтому обновления стоят O(n). Изменение размера и параллельные правки неудобны.

Отсортированный массив подходит данным, которые часто ищут и редко меняют.""",

"""A binary heap keeps only a parent-child order, so the minimum or maximum sits at the root in O(1), and insert or delete-extreme is O(log n). A sorted array also exposes the extreme in O(1), but every insert or delete is O(n) because the full order is restored by shifting. Use a heap when the set changes often and you only need the current extreme, as in a priority queue. Use a sorted array when you need binary search anywhere, not only at the end.""",
"""Двоичная куча хранит только порядок «родитель–ребёнок», поэтому минимум или максимум лежит в корне за O(1), а вставка и удаление экстремума — O(log n). В отсортированном массиве экстремум тоже доступен за O(1), но каждая вставка или удаление стоят O(n), потому что полный порядок восстанавливается сдвигом. Куча нужна, когда множество часто меняется и нужен только текущий экстремум, как в очереди с приоритетом. Отсортированный массив нужен, когда двоичный поиск требуется в любом месте, а не только на краю.""",

"""Indexing names an element by its position, usually 0 through n−1. Equal-sized elements in one block make the address of index i equal to base + i × element size, so access does not scan. A multi-dimensional index is flattened the same way. In row-major order the offset is row × row length + column; column-major order swaps those roles.""",
"""Индексация называет элемент его позицией, обычно от 0 до n−1. Одинаковые по размеру элементы в одном блоке дают адрес индекса i как база + i × размер элемента, поэтому доступ ничего не сканирует. Многомерный индекс сплющивается так же. При построчном порядке смещение равно строка × длина строки + столбец; при постолбцовом эти роли меняются.""",

"""Walk both sorted inputs with one index each. At each step append the smaller current value; if they are equal, append both and advance both indexes. When one input ends, copy the rest of the other. The merge takes O(n + m) time and O(n + m) extra space for the output. This is the combine step of mergesort.""",
"""Идите по двум отсортированным входам, держа по одному индексу. На каждом шаге дописывайте меньшее текущее значение; если они равны, допишите оба и сдвиньте оба индекса. Когда один вход кончился, скопируйте хвост другого. Слияние занимает O(n + m) времени и O(n + m) дополнительной памяти под результат. Это шаг объединения в сортировке слиянием.""",

"""Give each stack a fixed third of the array and its own top index inside that range. Push and pop then stay O(1), but one stack can fill up while another range is still empty. A tighter layout stores every stack as a linked list of slots in the same array, plus a free list of unused indexes, so any stack can grow until the whole array is full. Push and pop remain O(1); each slot stores an extra index.""",
"""Отдайте каждому стеку фиксированную треть массива и свой индекс вершины внутри этого участка. Push и pop тогда остаются O(1), но один стек может заполниться, пока другой участок ещё пуст. Более плотная раскладка хранит каждый стек как список ячеек в том же массиве плюс список свободных индексов, поэтому любой стек растёт, пока не заполнится весь массив. Push и pop по-прежнему O(1); в каждой ячейке лежит лишний индекс.""",

"""A left rotation by k moves the first k elements to the end; a right rotation does the reverse. Do it in place with three reversals: reverse the first k elements, reverse the remainder, then reverse the whole array (a right rotation reverses the whole array first). Time is O(n) and extra memory is O(1). The same idea appears in circular buffers, rotating an image row, and testing whether one string is a rotation of another.""",
"""Поворот влево на k переносит первые k элементов в конец, поворот вправо — наоборот. На месте это три разворота: разверните первые k элементов, разверните остаток, затем разверните весь массив (правый поворот сначала разворачивает весь массив). Время O(n), дополнительная память O(1). Та же идея есть в кольцевых буферах, при повороте строки изображения и при проверке, является ли одна строка поворотом другой.""",

"""Point one index at the first element and another at the last. Swap them, then move the indexes toward the center until they meet. About n/2 swaps run in O(n) time with O(1) extra memory, and the original array is overwritten. Copy first if the old order must survive.""",
"""Поставьте один индекс на первый элемент, другой на последний. Поменяйте их местами и сдвигайте индексы к центру, пока они не встретятся. Около n/2 обменов выполняются за O(n) при O(1) дополнительной памяти, и исходный массив перезаписывается. Сначала скопируйте его, если старый порядок должен сохраниться.""",

"""Sorted duplicates sit side by side, so two indexes are enough. Keep a write index i and a read index j. Whenever the value at j differs from the value at i, advance i and copy that value into the new slot. The unique prefix then has length i + 1. The scan is O(n) and uses O(1) extra memory. Slots past the new length are leftovers and should be ignored.""",
"""В отсортированном массиве дубликаты стоят рядом, поэтому хватает двух индексов. Держите индекс записи i и индекс чтения j. Когда значение в j отличается от значения в i, увеличьте i и скопируйте это значение в новую ячейку. Длина уникального префикса тогда равна i + 1. Проход O(n) и использует O(1) дополнительной памяти. Ячейки после новой длины — остаток, их нужно игнорировать.""",

"""Store the queue in a fixed array with a front index and a rear index, and treat the buffer as circular: the next slot is (index + 1) modulo capacity. Enqueue writes at the rear and advances it; dequeue reads the front and advances it. Both are O(1). The queue is full when the next rear would land on the front, and empty when a size counter is zero or both indexes mark the empty state. Without wrap-around, dequeued slots at the front are wasted. Space is proportional to the capacity.""",
"""Храните очередь в фиксированном массиве с индексами начала и конца и считайте буфер кольцевым: следующая ячейка — (индекс + 1) по модулю ёмкости. Enqueue пишет в конец и сдвигает его, dequeue читает начало и сдвигает его. Оба действия O(1). Очередь полна, когда следующий конец совпал бы с началом, и пуста, когда счётчик размера нулевой или оба индекса помечают пустое состояние. Без перехода через край ячейки перед началом после извлечений пропадают. Память пропорциональна ёмкости.""",
]
