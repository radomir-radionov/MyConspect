# Concurrency — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Concurrency — собеседование](./0_sd_concurrency_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Concurrency](https://devinterview.io/questions/software-architecture-and-system-design/concurrency-interview-questions/).

### Concurrency Fundamentals

<details>
<summary>What is concurrency in programming and how does it differ from parallelism?</summary>

### What is concurrency in programming and how does it differ from parallelism?

**Definition:**

Конкурентность — это устройство работы так, чтобы несколько задач были в процессе одновременно, даже если машина выполняет только одну в каждый момент. Параллелизм — это реальное выполнение больше чем одной задачи в одно и то же мгновение.

**How it works:**

- Конкурентная программа на одном ядре чередует задачи: планировщик переключается, или код уступает управление на блокирующем вызове. Продвижение перекрывается во времени. Выполнение — нет.
- Параллелизму нужно железо, которое может выполнять эти задачи вместе, обычно несколько ядер. Задачи могут быть и конкурентными, но одно параллельное разрезание одной работы не обязано иметь независимые времена жизни.
- Сервер на одном ядре, обслуживающий много сокетов, конкурентен и не параллелен. Умножение матриц, разложенное по ядрам, может быть параллельным. Пул потоков на многих ядрах — и то и другое.
- Общая память тогда нуждается в правиле, чтобы перекрывающиеся задачи её не портили: блокировки, атомарные операции, транзакционная память, неизменяемые данные или сообщения, которые копируют данные вместо совместного доступа.

**Examples:**

```python
# concurrent: two tasks in flight; on one core they take turns
t1 = threading.Thread(target=read_socket)
t2 = threading.Thread(target=read_socket)
t1.start(); t2.start()
```

На машине с двумя ядрами эти потоки могут ещё и выполняться параллельно. На одном ядре они всё равно перекрывают свои ожидания.
</details>

<details>
<summary>Can you explain race conditions and provide an example where one might occur?</summary>

### Can you explain race conditions and provide an example where one might occur?

**Definition:**

Состояние гонки — ошибка, чей результат зависит от того, как по времени пересеклись задачи с общим состоянием. Одни и те же входы могут дать разные выходы, потому что шаги перемежаются.

**How it works:**

- Нужны общее изменяемое состояние и хотя бы одно обновление, которое не атомарно: чтение, изменение и запись, между которыми может вклиниться другая задача.
- Окно также появляется вокруг ввода-вывода и сети, где «проверить, затем сделать» занимает больше одной инструкции.
- Типичные исходы: потерянное обновление, двойная продажа одного билета или разорванная запись.
- Окно закрывают блокировкой вокруг всего чтения-изменения-записи, атомарной инструкцией, неизменяемыми снимками или тем, что у каждой задачи своя копия, а слияние позже.
- Тест, прошедший один раз, не доказывает, что гонки нет. Перемежение нужно вызвать специально или убрать общее обновление.

**Examples:**

Два потока оба читают `seats == 1`, оба решают продать, оба пишут `seats = 0`. Два покупателя получают одно место. Мьютекс вокруг чтения и уменьшения или атомарный compare-and-swap с 1 на 0 позволяет удаться только одной продаже.
</details>

<details>
<summary>What is a critical section in the context of concurrent programming?</summary>

### What is a critical section in the context of concurrent programming?

**Definition:**

Критическая секция — участок кода, который трогает общее состояние и не должен выполняться больше чем в одной задаче одновременно.

**How it works:**

- Цель — взаимное исключение: одна задача внутри, остальные ждут, и ждущая задача в конце концов входит.
- Общие данные остаются согласованными, потому что чтение-изменение-запись заканчивается до того, как кто-то другой его начнёт.
- Секция должна быть короткой. Длинная сериализует программу и может морить голодом другие задачи.
- Блокировки, семафоры и мониторы — обычный способ войти. Забыть выйти или взять две блокировки в разном порядке — взаимная блокировка. Две задачи, бесконечно уступающие друг другу, — livelock. Задача, которая всегда проигрывает гонку, голодает.
- Корректность здесь не бесплатная производительность. Измеряйте время удержания. Если секция только публикует неизменяемое значение, блокировка может быть не нужна.

**Examples:**

```text
lock(mu)
  balance = balance - amount   # critical section
unlock(mu)
```

Два списания больше не могут оба прочитать старый баланс и оба записать его обратно.
</details>

<details>
<summary>How does an operating system ensure mutual exclusion in concurrent processes?</summary>

### How does an operating system ensure mutual exclusion in concurrent processes?

**Definition:**

Ядро даёт задачам способ ждать, чтобы критическую секцию выполняла только одна из них, опираясь на аппаратные атомарные операции.

**How it works:**

- У мьютекса или двоичного семафора два состояния. `lock` ждёт, если он занят, и затем помечает его занятым. `unlock` будит одного ожидающего.
- Процессор даёт атомарный test-and-set или compare-and-swap, чтобы два ядра не могли оба увидеть блокировку свободной и оба её взять.
- Если блокировка занята, ядро усыпляет поток, а не крутится вечно, и планировщик запускает кого-то ещё.
- Запрет прерываний исключает другой код на одном ядре. Другое ядро он не останавливает, поэтому ядра многопроцессорных систем используют атомики.
- Инструменты уровнем выше сидят на той же идее: futex в Linux, critical section в Windows и языковые блокировки, которые их вызывают.
- ОС не знает ваш инвариант данных. Она гарантирует только протокол блокировки. Программа всё равно должна запирать каждый путь, который трогает данные, в согласованном порядке.

**Examples:**

```cpp
std::mutex mu;
void withdraw(int amount) {
  std::lock_guard<std::mutex> hold(mu);
  balance -= amount;
}
```

`lock_guard` захватывает блокировку в конструкторе и отпускает в деструкторе, в том числе если функция бросает исключение.
</details>

<details>
<summary>Can you describe the concept of atomicity in relation to concurrency?</summary>

### Can you describe the concept of atomicity in relation to concurrency?

**Definition:**

Атомарная операция заканчивается целиком или никак, с точки зрения других задач. Никто не видит наполовину обновлённое значение.

**How it works:**

- Запись машинного слова часто атомарна в железе. Чтение-изменение-запись баланса — нет, если не использовать атомарную инструкцию или блокировку.
- Атомики покрывают счётчики, флаги и циклы compare-and-swap, которые публикуют новый указатель, только когда старый ещё актуален.
- Неатомарное обновление может порваться: другая задача читает смесь старых и новых байтов или теряет своё обновление.
- Атомарность одной инструкции — не транзакция. Несколько атомарных шагов всё ещё могут перемежаться, если их не сгруппировать.
- Изоляция и устойчивость — отдельно. Атомарная запись в память может сидеть в кэше и пропасть при отключении питания. Фиксация в базе — более сильное обещание.
- Модели памяти железа решают, когда другие ядра увидят запись. Языковой atomic также вставляет нужный порядок. Обычная запись может этого не делать.

**Examples:**

`count++` у общего `int` может терять приращения: оба ядра читают 7 и оба пишут 8. `std::atomic<int>::fetch_add(1)` делает приращение одним шагом, и два вызывающих заканчивают на 9.
</details>

<details>
<summary>How does a deadlock occur and what are common strategies to prevent it?</summary>

### How does a deadlock occur and what are common strategies to prevent it?

**Definition:**

Взаимная блокировка — набор задач, каждая из которых держит ресурс, нужный другим, и не отпускает его. Ни одна не может выполняться.

**How it works:**

- Нужны четыре условия вместе: исключительное использование, удержание и ожидание, нет вытеснения и цикл ожиданий.
- Классическая форма: поток A держит блокировку 1 и хочет 2, поток B держит 2 и хочет 1.
- Цикл ломают, всегда захватывая блокировки в одном глобальном порядке.
- Удержание-и-ожидание ломают через `try_lock`: если вторая блокировка занята, отпустить первую и повторить, лучше с паузой, чтобы обе стороны не крутились в такт.
- Таймауты превращают застрявшее ожидание в ошибку, которую вызывающий может откатить.
- Детектор может построить граф ожиданий и прервать одну задачу. Предотвращение проще, когда порядок блокировок под вашим контролем.
- Не вызывайте неизвестный код, держа блокировку. Этот код может взять другую блокировку, которую вы не учли.

**Examples:**

```text
# deadlocks if the other thread takes b then a
lock(a); lock(b); transfer(); unlock(b); unlock(a)

# both threads sort the addresses and lock the lower one first
```

Если каждый перевод запирает два счёта в порядке адресов, цикл не может образоваться.
</details>

<details>
<summary>What is a livelock and how is it different from a deadlock?</summary>

### What is a livelock and how is it different from a deadlock?

**Definition:**

При livelock задачи не застряли в ожидании. Они продолжают реагировать друг на друга и всё равно не продвигаются. Взаимная блокировка — противоположность: все ждут, и никто не выполняется.

**How it works:**

- Deadlock: потоки спят на блокировках и никогда не проснутся, потому что каждое пробуждение зависит от кого-то из того же набора.
- Livelock: потоки работают, бросают удержанное и пробуют снова, бесконечно, часто в такт.
- Это появляется при вежливом повторе. Две задачи обе видят столкновение, обе отступают одинаково, обе сталкиваются снова.
- Загрузка CPU остаётся высокой — так это отличают от deadlock в трассе. Deadlock выглядит простаивающим.
- Симметрию ломают случайной паузой, очередью или правилом, что одна сторона идёт, а другая ждёт.

**Examples:**

Два человека в узком коридоре каждый шагают влево, всё ещё лицом друг к другу, и снова шагают влево. Они двигаются и никогда не расходятся. Один стоит, пока другой проходит, — это исправление. В коде два потока, которые делают `try_lock`, терпят неудачу, отпускают блокировку и повторяют с тем же таймингом, делают то же самое. Случайная пауза между повторами позволяет одному из них победить.
</details>

<details>
<summary>Can you explain the producer-consumer problem and how can it be addressed using concurrency mechanisms?</summary>

### Can you explain the producer-consumer problem and how can it be addressed using concurrency mechanisms?

**Definition:**

Производители кладут элементы в общий буфер. Потребители забирают их. Буфер не должен переполниться, опустеть ниже нуля или обновляться двумя задачами сразу.

**How it works:**

- У буфера фиксированная ёмкость. Производитель ждёт, когда он полон. Потребитель ждёт, когда он пуст.
- Мьютекс защищает слоты, чтобы два производителя не записали один и тот же индекс.
- Два сигнала покрывают ожидания: один считает пустые слоты, другой — заполненные. Пара условных переменных делает ту же работу: ждать, изменить буфер, оповестить.
- Блокировку не держат, пока производитель готовит элемент или потребитель его использует. Её держат только вокруг обновления слота.
- Ядовитая пилюля или флаг закрытия позволяют потребителям выйти, когда производство закончено.
- Это шаблон очередей пула потоков и конвейеров логов.

**Examples:**

```text
empty = capacity; filled = 0; mutex = free
produce: wait empty; lock; push; unlock; signal filled
consume: wait filled; lock; pop; unlock; signal empty
```

При ёмкости 1 потребитель не может забрать элемент до помещения, а производитель не может положить дважды без извлечения.
</details>

### Thread Management

<details>
<summary>What is the difference between a process and a thread?</summary>

### What is the difference between a process and a thread?

**Definition:**

Процесс — изолированное выполнение со своим адресным пространством. Поток — планируемый поток управления внутри процесса, делящий это адресное пространство с соседними потоками.

**How it works:**

- У каждого процесса своя виртуальная память, таблица файловых дескрипторов и хотя бы один поток. Один процесс не может читать кучу другого, если они специально не настроили общую память.
- Потоки одного процесса делят код, кучу и открытые файлы. У каждого свой стек, регистры и счётчик команд.
- Создание процесса тяжелее: ядро копирует или помечает адресное пространство. Создание потока в основном добавляет стек и запись планировщика.
- Сбой в потоке может уронить весь процесс, потому что память общая. Сбой в процессе остаётся внутри него.
- Переключение контекста между процессами сбрасывает больше состояния (адресное пространство), чем переключение между потоками одного процесса.
- Процессы берут, чтобы изолировать сбои и привилегии. Потоки — чтобы дёшево делить данные и перекрывать работу, и тогда этот общий доступ нужно синхронизировать.

**Examples:**

Браузер использует процесс на сайт, чтобы один крах не прочитал память другого сайта. Внутри рендерера потоки делят DOM и должны его запирать. `fork` даёт потомку отдельное адресное пространство. `pthread_create` — нет.
</details>

<details>
<summary>How are threads typically created and managed in modern operating systems?</summary>

### How are threads typically created and managed in modern operating systems?

**Definition:**

Поток начинается как объект ядра, который планировщик может запустить, заблокировать и уничтожить. Библиотеки различаются тем, сколько таких ядерных потоков стоит под потоками, которые видит программа.

**How it works:**

- Many-to-one: несколько пользовательских «зелёных» потоков делят один поток ядра. Переключение дёшево, но один блокирующий вызов останавливает всех, и они не могут использовать лишние ядра.
- One-to-one: каждый поток программы — поток ядра. Это обычная модель (потоки POSIX в Linux через NPTL, потоки Windows). Они реально параллельны и блокируются независимо. Цена — запись планирования ядра на каждый поток.
- Many-to-many: набор пользовательских потоков мультиплексируется на меньший набор потоков ядра. Это пытается сохранить и дешёвое переключение, и параллелизм. Это труднее построить, поэтому меньше систем берут это по умолчанию.
- Ядро сохраняет регистры и указатель стека, выбирает готовый поток и возобновляет его. Библиотеки вроде pthreads дают сверху create, join и detach.
- Detach значит, что его никто не будет `join`. Join ждёт завершения и забирает результат. Поток, который не присоединили и не отсоединили, течёт управляющим блоком.

**Examples:**

```c
pthread_t t;
pthread_create(&t, NULL, worker, arg);
pthread_join(t, NULL);
```

`pthread_create` просит у ядра поток, который выполняет `worker`. `pthread_join` блокируется, пока этот поток не вернётся.
</details>

<details>
<summary>What is a thread pool and why might you use one?</summary>

### What is a thread pool and why might you use one?

**Definition:**

Пул потоков — фиксированный набор рабочих потоков, которые забирают задачи из очереди. Потоки переиспользуют, а не создают по одному на задачу.

**How it works:**

- Создание потока выделяет стек и говорит с ядром. Делать это на каждый короткий запрос дороже самой работы.
- Пул ограничивает, сколько задач выполняется сразу, чтобы всплеск не запустил десятки тысяч потоков и не исчерпал память.
- Вызывающие отправляют замыкание или задачу. Свободный рабочий её берёт. Если все заняты, задача ждёт в очереди.
- Тот же пул обслуживает обработчики запросов, куски пакетов и фоновые задачи.
- Слишком маленький пул копит задержку в очереди. Слишком большой тратит машину на переключения контекста. Для работы на CPU размер около числа ядер, для работы, которая в основном ждёт ввод-вывод, выше.
- Пул гасят, закрывая очередь и присоединяя рабочих, чтобы задачи не бросали на середине.

**Examples:**

```python
with ThreadPoolExecutor(max_workers=4) as pool:
    pool.map(resize_image, paths)
```

Четыре потока изменяют размер всего списка. Программа не запускает поток на каждый файл.
</details>

<details>
<summary>Can you explain the concept of a context switch and how it affects concurrency?</summary>

### Can you explain the concept of a context switch and how it affects concurrency?

**Definition:**

Переключение контекста — это ядро, сохраняющее состояние процессора одного потока и восстанавливающее состояние другого, чтобы ядро процессора выполняло второй поток.

**How it works:**

- Сохраняют регистры, указатель стека и счётчик команд, плюс то, что ядру нужно, чтобы возобновить адресное пространство.
- Планировщик делает это, когда поток блокируется, когда кончается его квант или когда готов поток с более высоким приоритетом.
- Переключение потоков одного процесса дешевле переключения процессов, потому что таблицы страниц могут остаться.
- Это всё равно не бесплатно: кэши и TLB держат строки предыдущего потока, конвейеры осушаются, и работает ядро.
- Слишком много готовых к выполнению потоков заставляют ядро процессора тратить больше времени на переключения, чем на работу. Поэтому пул ограничивает конкурентность.
- Добровольные переключения на блокирующем вводе-выводе полезны: ядро процессора выполняет кого-то ещё во время ожидания. Принудительные переключения в плотном цикле на CPU — чистые накладные расходы.

**Examples:**

Поток вызывает `read` на пустом сокете. Ядро сохраняет его регистры, помечает его ждущим и запускает другой поток на этом ядре. Когда пакет приходит, ждущий поток помечается готовым и его переключат обратно.
</details>

<details>
<summary>What are the benefits and disadvantages of using many small threads vs. a few large threads?</summary>

### What are the benefits and disadvantages of using many small threads vs. a few large threads?

**Definition:**

Много короткоживущих потоков соответствуют многим маленьким задачам. Меньше долгоживущих потоков соответствуют тяжёлой работе и пулу. Компромисс — накладные расходы против простоя.

**How it works:**

- Много маленьких потоков могут держать ядро занятым, пока другие ждут ввод-вывод, и изолируют медленную задачу в одном потоке. Их создание и переключение стоят памяти стека и времени планировщика, а ошибки общих данных множатся.
- Несколько больших потоков меньше тратят на переключения, и о них проще рассуждать. Блокирующий вызов в одном из них останавливает большую долю программы, а всплеск маленьких задач встаёт в очередь за длинными.
- Работа, упирающаяся в CPU, редко выигрывает от потоков больше, чем ядер. Работа, упирающаяся во ввод-вывод, часто выигрывает, пока не начнут доминировать память и переключения.
- Предпочтительнее пул долгоживущих рабочих и очередь маленьких задач. Вы получаете мелкие единицы работы без потока на единицу.
- Неограниченный поток на запрос падает, когда трафик подскакивает. Фиксированный пул уводит всплеск в очередь, от которой можно отказаться.

**Examples:**

Изменение размера 10_000 фотографий с потоком на фото может выделить гигабайты стеков до того, как закончится хоть одно изображение. Восемь рабочих в пуле и очередь путей используют восемь стеков и заканчивают тот же список.
</details>

### Synchronization Mechanisms

<details>
<summary>What is a mutex and how does it work?</summary>

### What is a mutex and how does it work?

**Definition:**

Мьютекс (блокировка взаимного исключения) позволяет держать его только одному потоку. Держатель — единственный поток, который может выполнять секцию, которую мьютекс защищает.

**How it works:**

- `lock` возвращается сразу, если мьютекс свободен, иначе блокируется, пока держатель не отпустит.
- `unlock` должен делать владелец. Обычный мьютекс — не счётчик, который может сигналить кто угодно.
- `try_lock` возвращается сразу, если захватить не удалось. Блокировка с таймером ждёт только до срока.
- Реентерабельный (рекурсивный) мьютекс позволяет владельцу захватить его снова, не блокируя сам себя. Обычный мьютекс входит в deadlock, если владелец захватывает дважды.
- Ловушки: захват A затем B в одном потоке и B затем A в другом даёт deadlock. Держатель с низким приоритетом может блокировать ожидающего с высоким (инверсия приоритета), если протокол не повышает держателя. При конкуренции потоки тратят время на ожидание, а не на работу.
- Держите захват коротким и отпускайте на каждом пути, включая исключения. Обёртки RAII делают это.

**Examples:**

```python
with lock:          # lock on enter, unlock on exit
    inventory[sku] -= 1
```

Второй поток останавливается на `with lock`, пока первый блок не закончится.
</details>

<details>
<summary>What are semaphores and how do they differ from mutexes?</summary>

### What are semaphores and how do they differ from mutexes?

**Definition:**

Семафор — счётчик, которого задачи ждут и который сигналят. Мьютекс — блокировка с владельцем, предназначенная для одного потока в критической секции.

**How it works:**

- Мьютекс двоичный и с владельцем. Поток, который его захватил, и должен отпустить. Он защищает код и данные.
- Семафор начинается с N. `wait` (P) уменьшает и блокируется, если счётчик ушёл бы в минус. `signal` (V) увеличивает и будит ожидающего. Владельца нет: одна задача может сигналить то, чего ждала другая.
- Двоичный семафор похож на мьютекс, но владельца всё равно нет, и он не привязан к «этот поток может войти».
- Мьютекс — для исключительного доступа к структуре. Считающий семафор — для пула из N одинаковых ресурсов или для счётчиков пустых и полных слотов в буфере производитель-потребитель.
- Семафоры сами по себе не помнят, какой поток внутри. Они также не предотвращают инверсию приоритета так, как это делают некоторые протоколы мьютексов.
- Сочетать их нормально: мьютекс защищает индексы буфера, а два семафора следят за пустыми и заполненными слотами.

**Examples:**

```text
licenses = Semaphore(3)   # three seats
licenses.wait()           # take one; block if zero
use_tool()
licenses.signal()         # return it; any thread may do this
```

Мьютекс здесь был бы неверен: поток, который освобождает место, может быть не тем, кто его занял, и три пользователя могут держать место одновременно.
</details>

<details>
<summary>Can you explain what a monitor is in the context of concurrency?</summary>

### Can you explain what a monitor is in the context of concurrency?

**Definition:**

</details>

<details>
<summary>How do condition variables contribute to thread synchronization?</summary>

### How do condition variables contribute to thread synchronization?

**Definition:**

</details>

<details>
<summary>What is a read-write lock and when is it advantageous to use one?</summary>

### What is a read-write lock and when is it advantageous to use one?

**Definition:**

</details>

### Concurrency Patterns

<details>
<summary>Can you describe the fork/join parallelism pattern and its use cases?</summary>

### Can you describe the fork/join parallelism pattern and its use cases?

**Definition:**

</details>

<details>
<summary>What is a barrier and how is it used in concurrent programming?</summary>

### What is a barrier and how is it used in concurrent programming?

**Definition:**

</details>

<details>
<summary>Describe an instance where a message queue might be used in a concurrent system.</summary>

### Describe an instance where a message queue might be used in a concurrent system.

**Definition:**

</details>

<details>
<summary>How might event-driven programming help in handling concurrency?</summary>

### How might event-driven programming help in handling concurrency?

**Definition:**

</details>

<details>
<summary>Can you illustrate usage of the publish-subscribe pattern in a concurrent system?</summary>

### Can you illustrate usage of the publish-subscribe pattern in a concurrent system?

**Definition:**

</details>

### Concurrency in Practice

<details>
<summary>How does one typically handle exceptions in a concurrently executing thread?</summary>

### How does one typically handle exceptions in a concurrently executing thread?

**Definition:**

</details>

<details>
<summary>What is the advantage of using non-blocking algorithms in a multi-threaded application?</summary>

### What is the advantage of using non-blocking algorithms in a multi-threaded application?

**Definition:**

</details>

<details>
<summary>Can you describe a scenario where you would use atomic operations?</summary>

### Can you describe a scenario where you would use atomic operations?

**Definition:**

</details>

<details>
<summary>How would you go about debugging a concurrency issue like a deadlock in a system?</summary>

### How would you go about debugging a concurrency issue like a deadlock in a system?

**Definition:**

</details>

<details>
<summary>What measures would you take to ensure thread-safety in a method that mutates shared data?</summary>

### What measures would you take to ensure thread-safety in a method that mutates shared data?

**Definition:**

</details>

### Performance and Scalability

<details>
<summary>How can the use of concurrency affect the scalability of an application?</summary>

### How can the use of concurrency affect the scalability of an application?

**Definition:**

</details>

<details>
<summary>What approaches can be taken to balance load effectively between threads?</summary>

### What approaches can be taken to balance load effectively between threads?

**Definition:**

</details>

<details>
<summary>Can you discuss strategies to reduce contention for shared resources in a concurrent program?</summary>

### Can you discuss strategies to reduce contention for shared resources in a concurrent program?

**Definition:**

</details>

<details>
<summary>How does the concept of concurrency relate to application throughput and latency?</summary>

### How does the concept of concurrency relate to application throughput and latency?

**Definition:**

</details>

### Advanced Topics

<details>
<summary>What is software transactional memory (STM) and how can it be used to manage concurrency?</summary>

### What is software transactional memory (STM) and how can it be used to manage concurrency?

**Definition:**

</details>

<details>
<summary>Explain the role of lock-free and wait-free algorithms in concurrent programming.</summary>

### Explain the role of lock-free and wait-free algorithms in concurrent programming.

**Definition:**

</details>

<details>
<summary>How does the actor model address concurrency, and what are its benefits?</summary>

### How does the actor model address concurrency, and what are its benefits?

**Definition:**

</details>

<details>
<summary>What are some challenges in testing concurrent applications, and how can they be mitigated?</summary>

### What are some challenges in testing concurrent applications, and how can they be mitigated?

**Definition:**

</details>

### Hardware and Concurrency

<details>
<summary>How does the hardware architecture of a CPU relate to the way concurrency is implemented in software?</summary>

### How does the hardware architecture of a CPU relate to the way concurrency is implemented in software?

**Definition:**

</details>

<details>
<summary>Can you explain the role of cache coherency in multi-processor or multi-core systems in the context of concurrency?</summary>

### Can you explain the role of cache coherency in multi-processor or multi-core systems in the context of concurrency?

**Definition:**

</details>

<details>
<summary>What are the potential impacts of hardware-level parallelism on software concurrency models?</summary>

### What are the potential impacts of hardware-level parallelism on software concurrency models?

**Definition:**

</details>

### Modern Trends and Best Practices

<details>
<summary>In the context of modern multi-core processors, how have high-level concurrency abstractions evolved to simplify concurrent programming?</summary>

### In the context of modern multi-core processors, how have high-level concurrency abstractions evolved to simplify concurrent programming?

**Definition:**

</details>
