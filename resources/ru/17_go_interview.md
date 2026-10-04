# Go — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

### Related docs

- [Go — собеседование](./17_go_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Golang](https://devinterview.io/questions/web-and-mobile-development/golang-interview-questions/).

### Golang Fundamentals

<details>
<summary>What is Go and why was it created?</summary>

### What is Go and why was it created?

**Definition:**

Go — статически типизированный компилируемый язык, спроектированный в Google и открытый в 2009 году. Цель — небольшой язык, который быстро компилируется, эффективно выполняется и делает параллелизм обычным делом.

**How it works:**

- Синтаксис маленький: нет классов, нет иерархий наследования, сборка мусора вместо ручного `free`.
- Типы проверяются при компиляции. Короткое объявление может вывести тип из правой части.
- Горутины и каналы — средства языка, а не библиотека, прикрученная потом.
- Команда `go` форматирует, тестирует, собирает и качает модули. Сборка даёт бинарник под выбранные ОС и архитектуру.
- Исходники в UTF-8. Экспортируемые имена начинаются с заглавной буквы.
- Язык берут для сетевых сервисов, CLI и инфраструктурных инструментов, где важны быстрый старт и один бинарник.

**Sources:**

- [Go — Documentation](https://go.dev/doc/)
</details>

<details>
<summary>Explain the workspace architecture in Go.</summary>

### Explain the workspace architecture in Go.

**Definition:**

Современный проект Go — это модуль: каталог с файлом `go.mod`, который задаёт путь модуля и зависимости. Старое дерево GOPATH (`src`, `pkg`, `bin` под одним корнем) — раскладка до модулей.

**How it works:**

- В режиме GOPATH путь импорта был папкой под `$GOPATH/src`, объекты сборки попадали в `pkg`, а команды — в `bin`.
- `go get` раньше клонировал репозиторий в это дерево `src`. С модулями команда добавляет требование в `go.mod` и скачивает модуль в кэш.
- Режим модулей включён по умолчанию с Go 1.16. Проект может лежать в любом каталоге.
- Файл `go.work` (Go 1.18+) перечисляет несколько локальных модулей, чтобы собирать их вместе без публикации.
- `GOPATH` по-прежнему по умолчанию указывает на каталог вроде `~/go`. `go install` кладёт бинарники в `$GOPATH/bin`, а кэш модулей живёт в `$GOPATH/pkg/mod`.
- Зависимости держите в `go.mod` и `go.sum`, а не копируйте их в репозиторий вручную.

**Examples:**

```text
notes/
  go.mod
  go.sum
  cmd/notes/main.go
  internal/store/store.go
```

**Sources:**

- [Go — Managing dependencies](https://go.dev/doc/modules/managing-dependencies)
</details>

<details>
<summary>How is the GOPATH environment variable used?</summary>

### How is the GOPATH environment variable used?

**Definition:**

`GOPATH` — место по умолчанию для установленных команд и кэша скачанных модулей. Это больше не каталог, где обязан лежать исходный код проекта.

**How it works:**

- До модулей каждый путь импорта был каталогом под `$GOPATH/src`, и сборка ломалась, если код лежал в другом месте.
- `go env GOPATH` печатает путь. Если переменная не задана, инструмент берёт значение вроде `$HOME/go`.
- `go install` пишет исполняемые файлы в `$GOPATH/bin`. Этот каталог в `PATH` делает установленные команды доступными.
- Скачанные модули кэшируются в `$GOPATH/pkg/mod`. `go mod download` заполняет кэш из `go.mod`.
- `GO111MODULE=off` возвращает старый режим. Новым проектам стоит оставаться на модулях.

**Examples:**

```bash
go env GOPATH
go install golang.org/x/tools/gopls@latest
```

**Sources:**

- [Go — GOPATH](https://go.dev/wiki/GOPATH)
</details>

<details>
<summary>What are Go's key features compared to other programming languages?</summary>

### What are Go's key features compared to other programming languages?

**Definition:**

Go меняет размер языка на быстрый компилятор, сборщик мусора и параллелизм в стандартном наборе. Он стоит между системным языком вроде C и более тяжёлым управляемым языком вроде Java.

**How it works:**

- По сравнению с C и C++ вы не управляете каждым выделением, и система типов меньше. Теряется и тонкий ручной контроль раскладки.
- По сравнению с Java или C# нет классов, дженерики появились поздно (Go 1.18) и остаются простыми, а исключения — не путь для ошибок. Обычный путь — значения и явный возврат `error`.
- Горутину дешевле запустить, чем поток ОС на каждую задачу. Каналы — обычный способ передать данные между ними.
- Компиляция достаточно быстрая, чтобы большой сервис пересобирался за секунды, а результат — один бинарник вместе со средой выполнения.
- Интерфейсы выполняются неявно: у типа есть методы, отдельная оговорка `implements` не нужна.
- Форматировщик `gofmt` снимает большинство споров о стиле.

**Sources:**

- [Go — Documentation](https://go.dev/doc/)
</details>

<details>
<summary>Describe how packages are structured in a Go program.</summary>

### Describe how packages are structured in a Go program.

**Definition:**

Программа на Go — набор пакетов. Один пакет собирается из файлов `.go` в одном каталоге, а `main` — пакет, из которого получается команда.

**How it works:**

- Каждый файл начинается с `package name`. Файлы одного каталога делят это имя.
- Имя с заглавной буквы экспортируется импортёрам. Имя со строчной остаётся внутри пакета.
- Путь импорта — путь модуля плюс каталог, а не произвольный относительный путь.
- Имена пакетов короткие, в нижнем регистре и обычно из одного слова (`http`, `store`). Имя импорта может отличаться от последнего элемента пути, но это редкость.
- Каталоги `internal/` может импортировать только дерево, которое их содержит.
- Тесты лежат в `*_test.go` и могут использовать `package store` или `package store_test` для взгляда снаружи.

**Examples:**

```go
package store

func Put(key, value string) error {
    return nil
}
```

**Sources:**

- [Go — Organizing a Go module](https://go.dev/doc/modules/layout)
</details>

<details>
<summary>What are slices in Go, and how do they differ from arrays?</summary>

### What are slices in Go, and how do they differ from arrays?

**Definition:**

Массив — значение фиксированной длины, и размер входит в тип. Слайс — небольшой заголовок (указатель, длина и ёмкость), который смотрит на кусок массива-основы и может расти через `append`.

**How it works:**

- `[4]int` и `[5]int` — разные типы. Присваивание массива копирует каждый элемент.
- Присваивание слайса копирует заголовок, поэтому два слайса могут делить один массив. Запись элемента через один видна через другой, пока `append` не выделит новый массив.
- Срез (`s[1:3]`) не копирует элементы. Он сдвигает указатель, длину и ёмкость.
- `append` использует запас ёмкости, когда он есть, и выделяет память с копированием, когда запаса нет.
- `len` — сколько элементов можно индексировать. `cap` — сколько поместится до следующего роста.
- Индекс вне диапазона вызывает панику. У nil-слайса длина 0, и к нему можно делать `append`.

**Examples:**

```go
nums := []int{1, 2, 3}
left := nums[:2]
left[0] = 9
more := append(nums, 4)
```

**Sources:**

- [Go — Slice internals](https://go.dev/blog/slices-intro)
</details>

<details>
<summary>Could you explain what a goroutine is?</summary>

### Could you explain what a goroutine is?

**Definition:**

Горутина — функция, которая выполняется конкурентно с другими горутинами. Среда выполнения Go сажает их на меньший набор потоков операционной системы.

**How it works:**

- Оператор `go` запускает одну: `go fetch(url)`. Вызывающий не ждёт.
- Среда выполнения мультиплексирует много горутин на `GOMAXPROCS` потоков, поэтому горутина — не взаимно однозначный поток ОС.
- Стеки начинаются маленькими и растут. Поэтому тысячи горутин — норма, а миллион потоков ОС — нет.
- У строки `go` нет возвращаемого значения. Результат приходит через канал, либо вызывающий ждёт `WaitGroup`.
- Утечка горутины — это горутина, навсегда заблокированная на канале или мьютексе, который никто не отпустит.
- Делитесь памятью через общение. Если горутины всё же делят данные, защитите их мьютексом или оставьте одной горутине.

**Examples:**

```go
go func() {
    ch <- compute()
}()
result := <-ch
```

**Sources:**

- [Go — Effective Go: concurrency](https://go.dev/doc/effective_go#concurrency)
</details>

<details>
<summary>How does Go handle memory management?</summary>

### How does Go handle memory management?

**Definition:**

Go выделяет объект в куче, когда значение переживает функцию, которая его создала. Конкурентный сборщик мусора забирает объекты, до которых больше нельзя дойти.

**How it works:**

- Анализ побега решает, стек это или куча. `malloc` и `free` вы не вызываете.
- Сборщик — конкурентный mark-sweep. Горутины-мутаторы продолжают работать большую часть цикла, с короткими паузами stop-the-world.
- Финализатор (`runtime.SetFinalizer`) — не деструктор. Не используйте его для немедленного освобождения ресурса. Файлы и соединения закрывайте через `defer`.
- Слайс огромного массива или забытая горутина держат память, потому что она всё ещё достижима.
- `GOGC` задаёт, сколько нового выделения допустимо до следующего цикла. Меньшие значения собирают чаще и держат меньше кучи.

**Examples:**

```go
func message() *string {
    s := "ok"
    return &s // s escapes to the heap
}
```

**Sources:**

- [Go — A guide to the Go garbage collector](https://go.dev/doc/gc-guide)
</details>

<details>
<summary>Can you list and explain the basic data types in Go?</summary>

### Can you list and explain the basic data types in Go?

**Definition:**

Базовые типы Go — логические значения, числа и строки. Составные типы — массивы, слайсы, карты, структуры, указатели, функции, каналы и интерфейсы — строятся из них.

**How it works:**

- `bool` — это `true` или `false`. Целые включают `int`, `int8`–`int64` и беззнаковые формы. `byte` — это `uint8`, `rune` — `int32`.
- `float32`, `float64` и два размера `complex` покрывают нецелые числа.
- `string` — неизменяемая последовательность байтов, обычно UTF-8. Индексация даёт байт, не символ. `range` даёт руны.
- У массива фиксированная длина. Слайс, карта и канал — заголовки, похожие на ссылки, и могут быть nil.
- Структура группирует именованные поля. Указатель хранит адрес. Значение интерфейса хранит конкретный тип и значение.
- Функции — значения первого класса. Канал переносит значения одного типа элемента между горутинами.

**Examples:**

```go
type Point struct{ X, Y int }

var ready bool
label := "notes"
scores := map[string]int{"ada": 10}
```

**Sources:**

- [Go — Language specification: types](https://go.dev/ref/spec#Types)
</details>

<details>
<summary>What is the zero value of a variable in Go?</summary>

### What is the zero value of a variable in Go?

**Definition:**

Переменная, которую объявили и ещё не присвоили, хранит нулевое значение своего типа. Это значение можно использовать; это не мусор из неинициализированной памяти.

**How it works:**

- `false` для `bool`, `0` для чисел, `""` для `string`.
- `nil` для указателей, слайсов, карт, каналов, функций и интерфейсов.
- Массив или структура обнуляются по полям, поэтому структура из целых начинается с нулей.
- К nil-слайсу можно делать `append`, длина у него 0. В nil-карту писать нельзя; её создают через `make` или составной литерал.
- Nil-интерфейс — не то же самое, что интерфейс с nil-указателем внутри. У второго есть конкретный тип, и он не равен nil.

**Examples:**

```go
var n int
var s []string
var p *int
// n == 0, s == nil, p == nil
```

**Sources:**

- [Go — Zero value](https://go.dev/tour/basics/12)
</details>

<details>
<summary>How do you manage error handling in Go?</summary>

### How do you manage error handling in Go?

**Definition:**

Функции Go возвращают значение `error` рядом с результатом. Вызывающий его проверяет. `panic` — для сломанного инварианта, а не для обычного сбоя вроде отсутствующего файла.

**How it works:**

- `errors.New` и `fmt.Errorf` создают ошибки. `fmt.Errorf("read config: %w", err)` оборачивает причину, чтобы `errors.Is` и `errors.As` всё ещё могли её узнать.
- Ошибку проверяют на месте вызова. Подстановка `_` прячет сбой.
- И сигнальные ошибки (`var ErrNotFound = errors.New(...)`), и свои типы с методом `Error() string` — нормальный приём.
- `panic` раскручивает горутину. `recover` внутри `defer` может остановить эту раскрутку. Библиотеки должны возвращать ошибки; сервер может восстановиться на границе запроса.
- Логируйте один раз, на краю, который обрабатывает ошибку, чтобы один сбой не печатался на каждом слое.

**Examples:**

```go
f, err := os.Open(path)
if err != nil {
    return fmt.Errorf("open %s: %w", path, err)
}
defer f.Close()
```

**Sources:**

- [Go — Error handling](https://go.dev/doc/effective_go#errors)
</details>

<details>
<summary>Can you convert between different data types in Go? How?</summary>

### Can you convert between different data types in Go? How?

**Definition:**

Go не преобразует числовые типы неявно. Преобразование пишут явно: `T(v)`. Достать конкретное значение из интерфейса — это утверждение типа, другая операция.

**How it works:**

- `int32(n)` преобразует число, если типы совместимы. Усечение и переполнение — ваша забота.
- Строка и срез байтов преобразуются через `string(b)` и `[]byte(s)`. Это копирование. `rune` — кодовая точка, не синоним `string`.
- `strconv.Atoi` и `strconv.Itoa` разбирают и форматируют десятичный текст. Обычное преобразование не разбирает `"42"`.
- `v.(Widget)` утверждает, что интерфейс `v` содержит `Widget`. Форма с двумя результатами, `w, ok := v.(Widget)`, не паникует при неверном типе.
- Переключатель типа (`switch x := v.(type)`) ветвится по конкретному типу.

**Examples:**

```go
n := int(uint32(7))
text := strconv.Itoa(n)
value, ok := box.(string)
```

**Sources:**

- [Go — Conversions](https://go.dev/ref/spec#Conversions)
</details>

<details>
<summary>What is a channel in Go, and when would you use one?</summary>

### What is a channel in Go, and when would you use one?

**Definition:**

Канал — типизированный канал между горутинами. Отправка и приём синхронизируют стороны, а значения выходят в том порядке, в каком их отправили.

**How it works:**

- `make(chan int)` без буфера: отправка ждёт, пока другая горутина примет значение. `make(chan int, 4)` буферизует четыре значения, прежде чем отправка заблокируется.
- Тип элемента фиксирован. `chan int` не переносит строки.
- Закрывает канал только отправитель, чтобы сообщить, что значений больше не будет. Приём из закрытого канала даёт нулевое значение и `ok == false`.
- `select` ждёт несколько операций и выполняет ту, которая готова.
- Канал нужен, когда данные должны перейти к горутине, которая владеет следующим шагом. Мьютекс нужен, когда несколько горутин правят одну структуру на месте.

**Examples:**

```go
jobs := make(chan int)
go func() {
    for n := range jobs {
        fmt.Println(n)
    }
}()
jobs <- 1
close(jobs)
```

**Sources:**

- [Go — Channels](https://go.dev/tour/concurrency/2)
</details>

<details>
<summary>Explain concurrency in Go and how it compares to parallelism.</summary>

### Explain concurrency in Go and how it compares to parallelism.

**Definition:**

Конкурентность — это устройство программы как независимо продвигающихся задач. Параллелизм — это когда такие задачи действительно идут в один момент на нескольких ядрах. Go упрощает первое и использует второе, когда машина и `GOMAXPROCS` это позволяют.

**How it works:**

- Много горутин могут быть в работе на одном ядре, уступая на вводе-выводе, операциях канала и вызовах функций. Это конкурентность без параллелизма.
- Среда выполнения одновременно ведёт до `GOMAXPROCS` горутин, поэтому набор, упёршийся в CPU, может занять несколько ядер.
- Обычный стиль — «не общайтесь, разделяя память; делитесь памятью, общаясь»: передавайте значения по каналам вместо блокировки каждого поля.
- Гонка данных всё ещё возможна, если две горутины пишут одну переменную. Детектор гонок (`go test -race`) их находит.
- Запуск горутин сам по себе программу не ускоряет. Координация и последовательная часть по-прежнему ограничивают выигрыш.

**Sources:**

- [Go — Effective Go: concurrency](https://go.dev/doc/effective_go#concurrency)
</details>

<details>
<summary>What does the range keyword do?</summary>

### What does the range keyword do?

**Definition:**

`range` обходит коллекцию в цикле `for` и выдаёт индекс и значение, ключ и значение или очередное принятое значение — в зависимости от типа.

**How it works:**

- Для массива или слайса `for i, v := range s` даёт индекс и копию элемента. `for i := range s` даёт только индекс. `for _, v := range s` отбрасывает индекс.
- Для строки индекс — смещение в байтах, а значение — руна, поэтому индекс прыгает на размер UTF-8.
- Для карты порядок специально случайный. На него нельзя опираться.
- Для канала `for v := range ch` принимает значения, пока канал не закроют. Обход открытого канала без новых отправок блокируется навсегда.
- В современном Go (1.22+) переменная итерации новая на каждом шаге. Старые компиляторы переиспользовали одну переменную, и замыкания из-за этого удивляли.

**Examples:**

```go
for i, word := range []string{"a", "b"} {
    fmt.Println(i, word)
}
```

**Sources:**

- [Go — For statements](https://go.dev/ref/spec#For_range)
</details>

<details>
<summary>What is defer and when would you use it?</summary>

### What is defer and when would you use it?

**Definition:**

</details>

<details>
<summary>Describe the select statement in Go.</summary>

### Describe the select statement in Go.

**Definition:**

</details>

<details>
<summary>What are anonymous functions and closures in Go?</summary>

### What are anonymous functions and closures in Go?

**Definition:**

</details>

<details>
<summary>How do you write a unit test in Go?</summary>

### How do you write a unit test in Go?

**Definition:**

</details>

<details>
<summary>Can you explain what pointers are and how Go handles them?</summary>

### Can you explain what pointers are and how Go handles them?

**Definition:**

</details>

### Intermediate Golang Concepts

<details>
<summary>Explain Go's interface type and how it differs from other types.</summary>

### Explain Go's interface type and how it differs from other types.

**Definition:**

</details>

<details>
<summary>What are map and how do you manage them?</summary>

### What are map and how do you manage them?

**Definition:**

</details>

<details>
<summary>Describe the blank identifier (_) and its use cases in Go.</summary>

### Describe the blank identifier (\_) and its use cases in Go.

**Definition:**

</details>

<details>
<summary>How does Go handle method overloading?</summary>

### How does Go handle method overloading?

**Definition:**

</details>

<details>
<summary>What is type embedding in Go, and when would you use it?</summary>

### What is type embedding in Go, and when would you use it?

**Definition:**

</details>

<details>
<summary>What is the purpose of the init() function?</summary>

### What is the purpose of the init() function?

**Definition:**

</details>

<details>
<summary>How does Go's garbage collector work?</summary>

### How does Go's garbage collector work?

**Definition:**

</details>

<details>
<summary>Can you describe how Go's type assertion works?</summary>

### Can you describe how Go's type assertion works?

**Definition:**

</details>

<details>
<summary>What are struct types in Go and how do you use them?</summary>

### What are struct types in Go and how do you use them?

**Definition:**

</details>

<details>
<summary>Describe the concept of package aliasing and when it would be used.</summary>

### Describe the concept of package aliasing and when it would be used.

**Definition:**

</details>

<details>
<summary>How do you manage package versioning in Go modules?</summary>

### How do you manage package versioning in Go modules?

**Definition:**

</details>

<details>
<summary>Explain how to create and import custom packages in Go.</summary>

### Explain how to create and import custom packages in Go.

**Definition:**

</details>

<details>
<summary>Describe cross-compiling in Go.</summary>

### Describe cross-compiling in Go.

**Definition:**

</details>

<details>
<summary>What is reflection in Go and why is it useful?</summary>

### What is reflection in Go and why is it useful?

**Definition:**

</details>

<details>
<summary>How does Go handle immutable strings?</summary>

### How does Go handle immutable strings?

**Definition:**

</details>

<details>
<summary>What is the syntax to create a variable that is not exported outside of a package?</summary>

### What is the syntax to create a variable that is not exported outside of a package?

**Definition:**

</details>

<details>
<summary>How do you implement an enum in Go?</summary>

### How do you implement an enum in Go?

**Definition:**

</details>

<details>
<summary>What are some ways to manage state in a concurrent Go program?</summary>

### What are some ways to manage state in a concurrent Go program?

**Definition:**

</details>

<details>
<summary>How does Go's panic and recover mechanism work?</summary>

### How does Go's panic and recover mechanism work?

**Definition:**

</details>

<details>
<summary>What is the purpose of the context package in Go?</summary>

### What is the purpose of the context package in Go?

**Definition:**

</details>

### Advanced Golang Concepts

<details>
<summary>How does Go implement object-oriented programming concepts?</summary>

### How does Go implement object-oriented programming concepts?

**Definition:**

</details>

<details>
<summary>Explain the difference between concurrency and parallelism in Go, with examples.</summary>

### Explain the difference between concurrency and parallelism in Go, with examples.

**Definition:**

</details>

<details>
<summary>What is the Go memory model?</summary>

### What is the Go memory model?

**Definition:**

</details>

<details>
<summary>Can you manually trigger garbage collection in Go?</summary>

### Can you manually trigger garbage collection in Go?

**Definition:**

</details>

<details>
<summary>Describe the Go race detector and when you would use it.</summary>

### Describe the Go race detector and when you would use it.

**Definition:**

</details>

<details>
<summary>How can you manage dependencies in a Go project?</summary>

### How can you manage dependencies in a Go project?

**Definition:**

</details>

<details>
<summary>What optimizations does Go employ for its compiler?</summary>

### What optimizations does Go employ for its compiler?

**Definition:**

</details>

<details>
<summary>How does Go handle JSON encoding and decoding?</summary>

### How does Go handle JSON encoding and decoding?

**Definition:**

</details>

<details>
<summary>Explain the use of build tags in Go.</summary>

### Explain the use of build tags in Go.

**Definition:**

</details>

<details>
<summary>How do you create a custom error type in Go?</summary>

### How do you create a custom error type in Go?

**Definition:**

</details>

<details>
<summary>Discuss the use of Go routines and thread safety.</summary>

### Discuss the use of Go routines and thread safety.

**Definition:**

</details>

<details>
<summary>Explain how reflection is used to manipulate objects in Go.</summary>

### Explain how reflection is used to manipulate objects in Go.

**Definition:**

</details>

<details>
<summary>How do you use third-party packages in Go?</summary>

### How do you use third-party packages in Go?

**Definition:**

</details>

<details>
<summary>Discuss the benefits and challenges of using channels for IPC in Go.</summary>

### Discuss the benefits and challenges of using channels for IPC in Go.

**Definition:**

</details>

<details>
<summary>How would you avoid deadlocks in concurrent programming in Go?</summary>

### How would you avoid deadlocks in concurrent programming in Go?

**Definition:**

</details>

<details>
<summary>What is the Stringer interface and why is it important?</summary>

### What is the Stringer interface and why is it important?

**Definition:**

</details>

<details>
<summary>How do you manage database connections in Go?</summary>

### How do you manage database connections in Go?

**Definition:**

</details>

<details>
<summary>Describe the http package in Go for web programming.</summary>

### Describe the http package in Go for web programming.

**Definition:**

</details>

<details>
<summary>What is cgo and when would you use it?</summary>

### What is cgo and when would you use it?

**Definition:**

</details>

<details>
<summary>Explain the difference between iota and const in Go.</summary>

### Explain the difference between iota and const in Go.

**Definition:**

</details>

### Go Tools, Testing, and Performance

<details>
<summary>What is go vet and when would you use it?</summary>

### What is go vet and when would you use it?

**Definition:**

</details>

<details>
<summary>Describe the purpose of Go's benchmarking tools.</summary>

### Describe the purpose of Go's benchmarking tools.

**Definition:**

</details>

<details>
<summary>How do you profile Go applications?</summary>

### How do you profile Go applications?

**Definition:**

</details>

<details>
<summary>Discuss the process of writing unit tests in Go and the use of the testing package.</summary>

### Discuss the process of writing unit tests in Go and the use of the testing package.

**Definition:**

</details>

<details>
<summary>What is the httptest package in Go, and why is it useful?</summary>

### What is the httptest package in Go, and why is it useful?

**Definition:**

</details>

<details>
<summary>How do you perform static code analysis in Go?</summary>

### How do you perform static code analysis in Go?

**Definition:**

</details>

<details>
<summary>How can you improve the performance of Go code?</summary>

### How can you improve the performance of Go code?

**Definition:**

</details>

<details>
<summary>Explain how to use go doc to document Go code.</summary>

### Explain how to use go doc to document Go code.

**Definition:**

</details>

<details>
<summary>What are the best practices for logging in Go?</summary>

### What are the best practices for logging in Go?

**Definition:**

</details>

<details>
<summary>Describe code coverage in Go and how to measure it.</summary>

### Describe code coverage in Go and how to measure it.

**Definition:**

</details>

### Go Patterns and Best Practices

<details>
<summary>What design patterns are commonly used in Go?</summary>

### What design patterns are commonly used in Go?

**Definition:**

</details>

<details>
<summary>Describe a use case for the factory pattern in Go.</summary>

### Describe a use case for the factory pattern in Go.

**Definition:**

</details>

<details>
<summary>When would you use the decorator pattern in Go?</summary>

### When would you use the decorator pattern in Go?

**Definition:**

</details>

<details>
<summary>Explain the importance of Go's fmt package.</summary>

### Explain the importance of Go's fmt package.

**Definition:**

</details>

<details>
<summary>What are the recommended practices for error handling in Go?</summary>

### What are the recommended practices for error handling in Go?

**Definition:**

</details>

<details>
<summary>How do you avoid and detect memory leaks in Go?</summary>

### How do you avoid and detect memory leaks in Go?

**Definition:**

</details>

<details>
<summary>What is idiomatic Go code and how do you ensure it?</summary>

### What is idiomatic Go code and how do you ensure it?

**Definition:**

</details>

<details>
<summary>Discuss the singleton pattern in Go.</summary>

### Discuss the singleton pattern in Go.

**Definition:**

</details>

<details>
<summary>What are the best practices for structuring Go projects?</summary>

### What are the best practices for structuring Go projects?

**Definition:**

</details>

<details>
<summary>How do Go routines affect the design and structure of a Go program?</summary>

### How do Go routines affect the design and structure of a Go program?

**Definition:**

</details>

### Go Networking and Protocols

<details>
<summary>How does Go handle HTTP/2?</summary>

### How does Go handle HTTP/2?

**Definition:**

</details>

<details>
<summary>Describe TCP/UDP network programming in Go.</summary>

### Describe TCP/UDP network programming in Go.

**Definition:**

</details>

<details>
<summary>Explain what RPC is and how Go supports it.</summary>

### Explain what RPC is and how Go supports it.

**Definition:**

</details>

<details>
<summary>How do you implement RESTful services in Go?</summary>

### How do you implement RESTful services in Go?

**Definition:**

</details>

<details>
<summary>Discuss Go's support for WebSocket protocols.</summary>

### Discuss Go's support for WebSocket protocols.

**Definition:**

</details>

<details>
<summary>What is protobuf and how is it used in Go?</summary>

### What is protobuf and how is it used in Go?

**Definition:**

</details>

<details>
<summary>Explain how to perform file uploads and downloads using Go.</summary>

### Explain how to perform file uploads and downloads using Go.

**Definition:**

</details>

<details>
<summary>How do you secure web applications in Go?</summary>

### How do you secure web applications in Go?

**Definition:**

</details>

<details>
<summary>What is a middleware in Go's HTTP server and how do you use it?</summary>

### What is a middleware in Go's HTTP server and how do you use it?

**Definition:**

</details>

<details>
<summary>How can Go be used to build microservices architecture?</summary>

### How can Go be used to build microservices architecture?

**Definition:**

</details>

### Go Frameworks, Libraries, and Interoperability

<details>
<summary>What are some popular frameworks for web development in Go, and how do you decide which one to use?</summary>

### What are some popular frameworks for web development in Go, and how do you decide which one to use?

**Definition:**

</details>

<details>
<summary>Can Go interact with other programming languages, and if so, how?</summary>

### Can Go interact with other programming languages, and if so, how?

**Definition:**

</details>

<details>
<summary>Discuss the use of GraphQL in Go applications.</summary>

### Discuss the use of GraphQL in Go applications.

**Definition:**

</details>

<details>
<summary>What are some use cases for the Go mobile library?</summary>

### What are some use cases for the Go mobile library?

**Definition:**

</details>

<details>
<summary>How does Go integrate with cloud services?</summary>

### How does Go integrate with cloud services?

**Definition:**

</details>

<details>
<summary>What libraries are available for building GUI applications in Go?</summary>

### What libraries are available for building GUI applications in Go?

**Definition:**

</details>

<details>
<summary>How would you integrate a Go application with a message queue?</summary>

### How would you integrate a Go application with a message queue?

**Definition:**

</details>

<details>
<summary>What options are there for ORM in Go?</summary>

### What options are there for ORM in Go?

**Definition:**

</details>

<details>
<summary>Discuss how to use Docker with Go applications.</summary>

### Discuss how to use Docker with Go applications.

**Definition:**

</details>

<details>
<summary>Explain the role of WebAssembly with Go.</summary>

### Explain the role of WebAssembly with Go.

**Definition:**

</details>
