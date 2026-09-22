# Database — NoSQL

MongoDB, Redis, Elasticsearch и выбор хранилища.

[ ← Вернуться в хаб](./9_database.md)

### Related docs

* [БД — Основы](./9_database_core.md) · [БД — SQL](./9_database_sql.md) · [БД — NoSQL](./9_database_nosql.md) · [БД — ORM](./9_database_orm.md) · [БД — Производство](./9_database_production.md) · [БД — Интервью](./9_database_interview.md)

### Sections

- [NoSQL](#nosql)

---

## NoSQL

<details>
  <summary>NoSQL (concept)</summary>

### NoSQL (concept)

**Definition:** Нереляционные базы данных, оптимизированные для гибких схем, горизонтального масштабирования или специализированных шаблонов доступа — документ, ключ-значение, столбец, график.

**When to use:** Быстро развивающиеся документы, высокая пропускная способность записи, встроенные данные, уровни кэша/сессии — не замена Postgres по умолчанию.

**Pluses and minuses:**

| + | − |
| ------------------------------------- | ------------------------------------------------ |
| Гибкость схемы, быстрая итерация | Более слабые гарантии согласованности по умолчанию |
| Горизонтальное масштабирование встроено | Нет универсального языка запросов || Хорошо подходит для вложенных/иерархических данных | Объединения и транзакции между документами стали сложнее |

**Examples:** Каталог продуктов электронной коммерции с различными атрибутами для каждой категории — хранилище документов позволяет избежать редких столбцов.

**Thoughts:** «Без схемы» означает, что схема находится **в коде приложения** — недокументирована и ее труднее реализовать. В любом случае определите схемы (Мангуст, Зод).

**Sources:**

[MongoDB — моделирование данных](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/)

---

</details>

<details>
  <summary>MongoDB</summary>

### MongoDB

**Definition:** Документо-ориентированная база данных, хранящая документы BSON (двоичный JSON) в коллекциях.

**When to use:** Управление контентом, каталоги с переменными полями, конвейеры аналитики в реальном времени, мобильная синхронизация со встроенными документами.

**Pluses and minuses:**

| + | − |
| --------------------------------- | ------------------------------------------------- |
| Гибкие вложенные документы | Ограничение размера документа (16 МБ) |
| Горизонтальный шардинг, наборы реплик | Многодокументный ACID только начиная с версии 4.0 (с оговорками) || Богатый конвейер агрегации | Использование памяти для больших агрегатов |

**Examples:**

```js
// Aggregation pipeline
db.orders.aggregate([
  {
    $match: { status: "completed", createdAt: { $gte: ISODate("2025-01-01") } },
  },
  {
    $group: { _id: "$userId", total: { $sum: "$amount" }, count: { $sum: 1 } },
  },
  { $sort: { total: -1 } },
  { $limit: 10 },
]);
```

**Thoughts:**

- **Набор реплик** — первичный + вторичный, автоматическое переключение при сбое.
- **Шардинг** — разделение по шард-ключу; тщательно выбирайте ключ (избегайте монотонности `_id` горячие точки).
- Внедрение или ссылка: встраивание для совместного чтения данных; эталон неограниченного роста.

**Sources:**

[Руководство MongoDB](https://www.mongodb.com/docs/manual/)

---

</details>

<details>
  <summary>Mongoose</summary>

### Mongoose

**Definition:** ODM (Object Document Mapper) для MongoDB в Node.js — схемы, проверка, промежуточное программное обеспечение, заполнение.

**When to use:** Приложения Node.js с MongoDB, требующие проверки, перехватчиков и типизированных моделей.

**Pluses and minuses:**

| + | − |
| --------------------------------- | ----------------------------------------------- |
| Применение схемы в гибкой базе данных | Утечки абстракций — знайте язык запросов MongoDB |
| Перехватчики промежуточного программного обеспечения (до/после сохранения) | `populate()` может вызвать N+1 |
| Поддержка TypeScript через дженерики | Тяжелые модели для простых CRUD |

**Examples:**

```ts
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  // hash password, normalize email, etc.
});

const User = model("User", userSchema);
await User.findOne({ email }).populate("orders");
```

**Thoughts:** Использовать `.lean()` для запросов только для чтения (простые объекты, быстрее). Индексные поля, используемые в `find()` и `sort()`.

**Sources:**

[Документация Mongoose](https://mongoosejs.com/docs/guide.html)

---

</details>

<details>
  <summary>Redis</summary>

### Redis

**Definition:** Хранилище структур данных в памяти — строки, хэши, списки, наборы, отсортированные наборы, потоки — с дополнительным сохранением и кластеризацией.

**When to use:** Кэш, хранилище сеансов, ограничение скорости, публикация/подписка, очереди заданий (с Bull/BullMQ), таблицы лидеров в реальном времени.

**Pluses and minuses:**

| + | − |
| -------------------------------------------- | ------------------------------------------------ |
| Задержка менее миллисекунды | Данные преимущественно в оперативной памяти — стоимость в масштабе |
| Богатые примитивы (TTL, паб/подписка, таблицы лидеров) | Не является основной базой данных для хранения надежных бизнес-данных || Простая репликация и кластеризация | Режимы постоянства меняют долговечность на скорость |

**Examples:**

```js
async function getUser(id) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await db.user.findUnique({ where: { id } });
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user));
  return user;
}
```

**Thoughts:**

— Установите TTL для ключей кэша — неограниченные ключи = нехватка памяти.
- `KEYS *` производство блоков — использование `SCAN`.
- `FLUSHALL` в производстве = инцидент. Ограничить доступ к CLI.

#### Redis CLI commands

### Redis CLI commands

```
TTL mykey          -- seconds until expiry (-1 = no expiry, -2 = missing)
SCAN 0 MATCH user:* COUNT 100
DEL mykey
```

```bash
docker exec -it <container> redis-cli
```

**Sources:** [Документация Redis](https://redis.io/docs/)

---

</details>

<a name="elasticsearch"></a>

<details>
  <summary>Elasticsearch</summary>

### Elasticsearch

**Definition:** Распределенная система поиска/аналитики (Lucene + JSON REST). Индексируйте документы JSON, а затем делайте запросы с использованием релевантности, фильтров и анализаторов. Сгруппировано с помощью NoSQL, но задача — **поиск**, а не OLTP.

**How it works:**

- **Кластер/узел/индекс/осколок.** Индекс разбивается на **первичные сегменты**; **реплики** копируют их. Координаторы маршрута; кластер перебалансируется. `GET http://localhost:9200` (HTTPS, если включена безопасность).
- **Почти в реальном времени.** Доступен для поиска после обновления (по умолчанию ~1 с). Сила `refresh` только в тестах.
- **Анализатор** (индекс + поиск): фильтры символов → **токенизатор** → фильтры токенов (`lowercase`, стоп, стеммер, шингл н-грамм).
- **Сопоставление:** `text` = проанализирован полнотекстовый вариант; `keyword` = точный (идентификаторы, фильтры, сортировки). Мультиполя могут быть обоими.

`match` (проанализировано); `match_phrase` + **`slop`**; `bool` (`must` / `should` / `filter` / `must_not`); **`boost`**; `function_score` только если вам нужны функции оценки. Масса: `client.bulk`.

**When to use:**

Поиск по каталогу, логи ELK, автозаполнение, гео + полнотекстовый — при Postgres `LIKE '%x%'` / ФНС слишком слаба.

**Пример** (`@elastic/elasticsearch` v8 — `mappings` / `document` на верхнем уровне, а не вложенном `body`):

```js
import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: "https://localhost:9200",
  auth: { username: "elastic", password: process.env.ES_PASSWORD },
});

await client.indices.create({
  index: "products",
  mappings: {
    properties: {
      id: { type: "keyword" },
      name: { type: "text" },
    },
  },
});

await client.index({
  index: "products",
  refresh: true, // tests only
  document: { id: "1", name: "Apple iPhone 12" },
});

const { hits } = await client.search({
  index: "products",
  query: {
    bool: {
      should: [
        { match: { name: "iPhone" } },
        { match_phrase: { name: { query: "iPhone Pro", slop: 3, boost: 10 } } },
      ],
    },
  },
});
console.log(hits.hits); // [{ _id, _score, _source }]
```

#### Common pitfalls

v7 `body: { query }` против v8 сглаженных полей. Картирование липкое — планируйте `text` vs `keyword`. Поиск перед обновлением → 0 обращений. Двойная запись/исходящие сообщения из Postgres/Mongo; ES — это **поисковая реплика**.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Актуальность, морфология, масштаб, реплики | Возможная согласованность по сравнению с основной БД |
| Запрос DSL + официальный JS-клиент | Ops, изменения в картографии, а не деньги SoT |

**Thoughts:** Токенизация во время индексации, оценка по инвертированному индексу — хранение денег/заказов в OLTP.

**Sources:**

[Elasticsearch 8.19 — анализ текста](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/anasis.html) · [match_phrase](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/query-dsl-match-query-phrase.html) · [elasticsearch-js](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)

---

</details>
<details>
  <summary>DB selection matrix</summary>

### DB selection matrix

**Definition:**

Руководство по принятию решений по выбору хранилища данных для каждой рабочей нагрузки.

| Нужна | Выбрать | Избегайте |
| ------------------------------------- | -------------------------------------------------- | ------------------------------------- || Транзакции, объединения, отчетность | **PostgreSQL** | Mongo для реляционных данных |
| Гибкие вложенные документы | **МонгоБД** | Postgres JSONB, если запросы остаются простыми |
| Кэш, сеансы, ограничения скорости | **Редис** | Postgres для «горячих» эфемерных данных || Полнотекстовый поиск в масштабе | **[Elasticsearch](#elasticsearch)** / Postgres FTS | `LIKE '%x%'` на миллионах строк |
| Асинхронная служба связи | **Кафка** / **RabbitMQ** | База данных как шина сообщений |
| Обходы графа (друзья друзей) | **Neo4j** | Рекурсивный SQL на глубоких деревьях || Метрики временных рядов | **TimescaleDB** / **InfluxDB** | Обычный Postgres без секционирования |

**Thoughts:** Стек по умолчанию для большинства приложений Node: **Postgres + Redis + (необязательно) очередь**. Добавляйте Mongo только тогда, когда модель документа значительно выигрывает.

**Sources:**

[ByteByteGo — типы баз данных](https://blog.bytebytego.com/p/understanding-database-types)

---

</details>

<a name="orm"></a>
