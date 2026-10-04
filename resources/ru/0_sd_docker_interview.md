# Docker — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Docker — собеседование](./0_sd_docker_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Docker](https://devinterview.io/questions/software-architecture-and-system-design/docker-interview-questions/).

### Docker Fundamentals

<details>
<summary>What is Docker, and how is it different from virtual machines?</summary>

### What is Docker, and how is it different from virtual machines?

**Definition:**

Docker запускает приложение в контейнере: изолированный процесс, который делит ядро хоста. Виртуальная машина запускает полную гостевую ОС на виртуальном железе.

**How it works:**

- Движок — это демон плюс клиент. Образы лежат в реестре. Dockerfile — рецепт, образ — пакет, контейнер — запущенный экземпляр.
- У ВМ есть гостевое ядро, поэтому она тяжелее стартует и ест долю CPU и памяти даже в простое.
- Контейнер стартует как процесс. Изоляцию дают пространства имён Linux и лимиты ресурсов, а не второе ядро.
- Образы собираются слоями, поэтому изменение часто переиспользует нижние слои.
- Один и тот же образ идёт на любом хосте с совместимым движком, поэтому сборка и продакшен могут совпасть.
- Изоляция слабее, чем у ВМ: контейнеры делят ядро, и ошибка ядра общая.
- Оркестраторы вроде Swarm или Kubernetes планируют много контейнеров. Сам Docker — runtime, не менеджер кластера.

**Examples:**

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm ci --omit=dev
COPY server.js ./
CMD ["node", "server.js"]
```
</details>

<details>
<summary>Can you explain what a Docker image is?</summary>

### Can you explain what a Docker image is?

**Definition:**

Образ Docker — неизменяемый пакет: файлы, runtime и команда старта, нужные чтобы запустить контейнер. Сам по себе он не работает.

**How it works:**

- Контейнер — процесс, стартовавший из этого образа, плюс записываемый слой для изменений на ходу.
- Образ — стопка слоёв. Каждая инструкция Dockerfile добавляет слой, и неизменные слои берутся из кэша.
- Базовый слой часто маленький дистрибутив или distroless-образ, где только приложение и его библиотеки.
- Реестры хранят образы и теги, чтобы другая машина стянула те же байты.
- Выигрыш — переносимость и повторяемый старт. Риск — толстый образ, в который попали секреты или инструменты сборки.

**Examples:**

```dockerfile
FROM python:3.12-slim
WORKDIR /srv
COPY app.py .
CMD ["python", "app.py"]
```
`docker build -t demo:1 .` создаёт образ. Ничего не слушает, пока из него не создан контейнер.
</details>

<details>
<summary>How does a Docker container differ from a Docker image?</summary>

### How does a Docker container differ from a Docker image?

**Definition:**

Образ — шаблон только для чтения. Контейнер — запущенный или остановленный экземпляр этого образа, со своим записываемым слоем и состоянием процесса.

**How it works:**

- Из одного образа можно стартовать много контейнеров. Они делят слои образа и различаются записываемым слоем.
- Образ не меняется, когда контейнер пишет файл. Запись попадает в слой контейнера и исчезает вместе с ним, если её не положили на volume.
- Диск контейнера — это образ плюс этот записываемый слой, поэтому логи внутри контейнера растят контейнер, не образ.
- Удаление контейнера не удаляет образ. Удаление образа не проходит, пока контейнер ещё на него ссылается.

**Examples:**

`docker run --name a demo:1` и `docker run --name b demo:1` — два процесса из одного образа. Файл, записанный в `a`, не виден в `b`.
</details>

<details>
<summary>What is the Docker Hub, and what is it used for?</summary>

### What is the Docker Hub, and what is it used for?

**Definition:**

Docker Hub — размещённый реестр, куда образы отправляют и откуда забирают, публично или в приватный репозиторий.

**How it works:**

- Тег именует версию, поэтому можно забрать `app:1.4`, а не то, что собрали в прошлый вторник.
- Команды делят один репозиторий. Автосборки могут пересобрать образ, когда меняется связанный исходник.
- Webhooks могут запустить конвейер, когда пришёл push. Сканирование может отметить известные уязвимые пакеты в образе.
- Публичные образы — так распространяют базовые, вроде `postgres` и `node`. Приватные репозитории — для образов, которые не должны быть в открытом интернете.
- Hub — один реестр. Компания может поднять другой или взять облачный, теми же командами push и pull на другой хост.

**Examples:**

`docker pull postgres:16` забирает публичный образ. `docker push registry.example.com/billing:1.4` публикует ваш.
</details>

<details>
<summary>Explain the Dockerfile and its significance in Docker.</summary>

### Explain the Dockerfile and its significance in Docker.

**Definition:**

Dockerfile — текстовый рецепт сборки образа. Это воспроизводимый путь; commit запущенного контейнера — нет.

**How it works:**

- FROM выбирает базу. RUN выполняет команду и записывает изменение файловой системы слоем.
- COPY и ADD кладут файлы из контекста сборки в образ. ENV задаёт переменные. EXPOSE документирует порт. Он его не публикует.
- CMD — процесс по умолчанию. ENTRYPOINT — фиксируемый исполняемый файл, CMD — его аргументы по умолчанию.
- Многостадийный файл собирает на одной стадии и копирует в тонкую финальную только артефакт.
- Неизменные инструкции кэшируются. Изменённый COPY сбрасывает каждый слой после себя, поэтому установку зависимостей ставят до копирования исходников.
- Предпочитают тонкую базу, связывают связанные команды и не оставляют кэш пакетов в слое.

**Examples:**

```dockerfile
FROM golang:1.23 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/api

FROM gcr.io/distroless/static
COPY --from=build /out/api /api
ENTRYPOINT ["/api"]
```
</details>

<details>
<summary>How does Docker use layers to build images?</summary>

### How does Docker use layers to build images?

**Definition:**

Каждая инструкция Dockerfile, которая меняет файловую систему, добавляет слой. Образ — эти слои, сложенные union-файловой системой, а контейнер добавляет сверху один записываемый слой.

**How it works:**

- Нижние слои только для чтения, и их делят все контейнеры, стартовавшие из образа.
- Кэш сборки срабатывает, когда инструкция и её входы совпали с прошлой сборкой, и слой не пересобирается.
- Изменение сбрасывает этот слой и все после него. Файл упорядочивают так, чтобы устойчивые шаги шли первыми.
- Удаление файла на позднем слое не уменьшает ранний слой, который его добавил. Байты всё ещё в образе.

**Examples:**

```text
слой 1  FROM alpine
слой 2  RUN apk add --no-cache curl
слой 3  COPY app /app
записываемый слой контейнера  (логи, временные файлы)
```
</details>

<details>
<summary>What’s the difference between the `COPY` and `ADD` commands in a Dockerfile?</summary>

### What’s the difference between the `COPY` and `ADD` commands in a Dockerfile?

**Definition:**

COPY кладёт файлы из контекста сборки в образ. ADD делает то же и ещё распаковывает локальный tar и может скачать URL. Предпочитайте COPY, если дополнительное поведение не нужно.

**How it works:**

- COPY явный: что назвали, то и попадает в образ.
- ADD распаковывает локальный архив вроде `app.tar.gz` в каталог назначения.
- ADD может скачать HTTP URL на сборке. Это прячет сетевую зависимость в сборку и это риск цепочки поставок.
- Оба сбрасывают кэш, когда меняется копируемый источник.
- URL скачивают в контролируемом шаге RUN или копируют файл, который уже лежит в контексте.

**Examples:**

```dockerfile
COPY ./static /var/www/static
# ADD ещё и распакует этот архив; COPY сохранит сам .tar
ADD bundle.tar /opt/app
```
</details>

<details>
<summary>What’s the purpose of the `.dockerignore` file?</summary>

### What’s the purpose of the `.dockerignore` file?

**Definition:**

`.dockerignore` перечисляет пути, которые нельзя отправлять в контекст сборки. Эти файлы не доходят до демона и не могут попасть в образ.

**How it works:**

- Клиент отправляет контекст до первой инструкции. Огромные `.git` или `node_modules` делают эту отправку медленной.
- Игнорирование также не пускает секреты, локальные env и тесты в неосторожный `COPY . .`.
- Изменение игнорируемого файла не сбрасывает кэш, потому что он не был входом.
- Синтаксис похож на gitignore: шаблоны и `!` в начале, чтобы включить снова.

**Examples:**

```text
.git
node_modules
*.env
dist
```
</details>

<details>
<summary>How would you go about creating a Docker image from an existing container?</summary>

### How would you go about creating a Docker image from an existing container?

**Definition:**

Контейнер можно снять командой `docker commit`, и обычно вместо этого стоит пересобрать из Dockerfile. Commit фиксирует всё, что успело разъехаться внутри контейнера.

**How it works:**

- `docker commit` превращает записываемый слой контейнера плюс образ под ним в новый образ.
- У результата нет рецепта. Следующий человек не видит, какие пакеты поставили руками.
- Устойчивый путь — записать эти шаги в Dockerfile и снова сделать `docker build`.
- Commit годится для разового отладочного снимка, не как способ производить образы.

**Examples:**

```text
docker commit web web:debug
# лучше:
docker build -t web:1.5 .
```
</details>

<details>
<summary>In practice, how do you reduce the size of Docker images?</summary>

### In practice, how do you reduce the size of Docker images?

**Definition:**

Размер образа падает, когда финальная стадия содержит только файлы runtime и когда ранние слои не хранят кэш пакетов.

**How it works:**

- Начинают FROM с маленькой базы или distroless-образа, а не с полного десктопного дистрибутива.
- Многостадийная сборка: компиляторы остаются на стадии сборки, финальная копирует бинарник.
- Мусор перечисляют в `.dockerignore`, чтобы его не отправляли и не копировали.
- Установку и очистку соединяют в одном RUN. Поздний RUN, который удаляет кэш, не убирает байты из раннего слоя.
- Копируют только файлы, нужные процессу, а не весь репозиторий.

**Examples:**

```dockerfile
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*
```
</details>

<details>
<summary>What command is used to run a Docker container from an image?</summary>

### What command is used to run a Docker container from an image?

**Definition:**

`docker run` создаёт контейнер из образа и запускает его процесс. Если образа нет локально, клиент сначала его скачивает.

**How it works:**

- `docker create` только создаёт. `docker start` только запускает существующий контейнер. `docker run` делает оба шага.
- Флаги публикуют порты (`-p`), задают переменные (`-e`), именуют контейнер (`--name`) и монтируют хранилище (`-v`).
- `-d` отсоединяет. Без него stdout контейнера остаётся на вашем терминале.
- `--rm` удаляет контейнер, когда процесс завершается.
- Политика перезапуска вроде `unless-stopped` поднимает его после перезапуска демона. Это отдельно от создания.

**Examples:**

`docker run -d --name api -p 8080:8080 -e APP_ENV=prod api:1.5`
</details>

<details>
<summary>Can you explain what a Docker namespace is and its benefits?</summary>

### Can you explain what a Docker namespace is and its benefits?

**Definition:**

Docker изолирует контейнер пространствами имён Linux: у контейнера свой вид процессов, сети, монтирований, имени хоста и межпроцессного взаимодействия. Потолки ресурсов — отдельный механизм, cgroups.

**How it works:**

- Пространство PID значит, что процесс 1 контейнера — не процесс 1 хоста, и он не видит процессы других контейнеров.
- Сетевое пространство даёт свои интерфейсы и порты. Пространство монтирования даёт свой корень файловой системы.
- Пространство UTS даёт своё имя хоста. Пространство IPC изолирует разделяемую память. Пользовательское пространство может отобразить root контейнера на непривилегированного пользователя хоста.
- Эта изоляция позволяет многим контейнерам делить одно ядро, не деля процессы и файлы друг друга.
- Имена и id образов — как ссылаться на объекты. Это не та возможность namespace, которая изолирует процесс.

**Examples:**

Два контейнера могут оба слушать порт 80 внутри своего сетевого пространства. На хосте это два разных адреса, опубликованных через `-p`, если их нужно достать снаружи.
</details>

<details>
<summary>What is a Docker volume, and when would you use it?</summary>

### What is a Docker volume, and when would you use it?

**Definition:**

Volume — хранилище, которое переживает контейнер. Его берут для всего, что должно пережить пересоздание: файлы базы, загрузки или конфиг, который не хотите запекать в образ.

**How it works:**

- Именованный volume ведёт Docker и монтирует в контейнер по выбранному пути.
- Bind mount отображает каталог хоста. В разработке это удобно и привязывает вас к раскладке этого хоста.
- Монтирование tmpfs держит данные в памяти и сбрасывает их, когда контейнер останавливается.
- Записываемый слой контейнера — плохое место для базы: `docker rm` его выбрасывает.
- Volume — ещё и способ двум контейнерам делить каталог, не коммитя эти данные в образ.

**Examples:**

`docker run -v pgdata:/var/lib/postgresql/data postgres:16` сохраняет каталог данных, когда этот контейнер заменяют.
</details>

<details>
<summary>Explain the use and significance of the `docker-compose` tool.</summary>

### Explain the use and significance of the `docker-compose` tool.

**Definition:**

Compose поднимает группу контейнеров из одного файла: их образы, сети, тома и порядок старта. Так многопроцессное приложение описывают как одну единицу.

**How it works:**

- Каждый service — определение контейнера: образ или сборка, порты, окружение и зависимости.
- Compose создаёт сеть для файла, и сервисы достают друг друга по имени сервиса.
- Тома, объявленные в файле, переживают `docker compose down`, если вы не попросили их удалить.
- Тот же файл запускает коллега, поэтому стек на ноутбуке совпадает с описанным.
- `docker compose up` собирает и стартует. `down` останавливает и удаляет контейнеры.

**Examples:**

```yaml
services:
  web:
    build: .
    ports: ["8080:8080"]
    depends_on: [db]
  db:
    image: postgres:16
    volumes: ["pgdata:/var/lib/postgresql/data"]
volumes:
  pgdata:
```
</details>

<details>
<summary>Can Docker containers running on the same host communicate with each other by default? If so, how?</summary>

### Can Docker containers running on the same host communicate with each other by default? If so, how?

**Definition:**

Да. Контейнеры на мосте по умолчанию достают друг друга по IP-адресу. Автоматических DNS-имён в этой сети у них нет.

**How it works:**

- Демон подключает новый контейнер к сети `bridge`, если вы не выбрали другую.
- У каждого контейнера есть адрес на этом мосте, поэтому `curl` на IP другого контейнера работает.
- Поиска имён на мосте по умолчанию нет. Старый флаг `--link` это делал и устарел.
- Пользовательский мост даёт DNS: один контейнер зовёт другой по имени контейнера.
- Публикация `-p` — для хоста и внешнего мира. Контейнерам в одной сети Docker опубликованные порты, чтобы говорить друг с другом, не нужны.

**Examples:**

```text
docker network create appnet
docker run -d --name api --network appnet api:1
docker run -d --name web --network appnet web:1
# внутри web: curl http://api:8080
```
</details>

### Docker Networking

<details>
<summary>Describe the different types of networks in Docker.</summary>

### Describe the different types of networks in Docker.

**Definition:**

</details>

<details>
<summary>How do you create a Docker network?</summary>

### How do you create a Docker network?

**Definition:**

</details>

<details>
<summary>How could you connect a container to a specific network?</summary>

### How could you connect a container to a specific network?

**Definition:**

</details>

<details>
<summary>Can you explain how Docker’s default bridge network differs from a user-defined bridge network?</summary>

### Can you explain how Docker’s default bridge network differs from a user-defined bridge network?

**Definition:**

</details>

<details>
<summary>How would you enable communication between Docker containers on different hosts?</summary>

### How would you enable communication between Docker containers on different hosts?

**Definition:**

</details>

### Docker Performance & Security

<details>
<summary>How can resource constraints be applied to containers in Docker?</summary>

### How can resource constraints be applied to containers in Docker?

**Definition:**

</details>

<details>
<summary>What are Docker security profiles, and how do they work?</summary>

### What are Docker security profiles, and how do they work?

**Definition:**

</details>

<details>
<summary>Explain how you would scan a Docker image for vulnerabilities.</summary>

### Explain how you would scan a Docker image for vulnerabilities.

**Definition:**

</details>

<details>
<summary>What is the purpose of a Docker Healthcheck?</summary>

### What is the purpose of a Docker Healthcheck?

**Definition:**

</details>

<details>
<summary>Describe how you would handle sensitive data with Docker.</summary>

### Describe how you would handle sensitive data with Docker.

**Definition:**

</details>

### Docker Orchestration

<details>
<summary>What is Docker Swarm, and when would you use it?</summary>

### What is Docker Swarm, and when would you use it?

**Definition:**

</details>

<details>
<summary>Can you explain the difference between Docker Swarm and Kubernetes?</summary>

### Can you explain the difference between Docker Swarm and Kubernetes?

**Definition:**

</details>

<details>
<summary>What is a Docker Stack?</summary>

### What is a Docker Stack?

**Definition:**

</details>

<details>
<summary>How do you deploy an application stack in Docker Swarm?</summary>

### How do you deploy an application stack in Docker Swarm?

**Definition:**

</details>

<details>
<summary>How does Docker manage service replication and load balancing?</summary>

### How does Docker manage service replication and load balancing?

**Definition:**

</details>

### Docker CLI & API

<details>
<summary>What command would you use to list all running containers?</summary>

### What command would you use to list all running containers?

**Definition:**

</details>

<details>
<summary>How can you stop all containers running on a host using a single command?</summary>

### How can you stop all containers running on a host using a single command?

**Definition:**

</details>

<details>
<summary>Can you describe how you would execute a command inside a running container?</summary>

### Can you describe how you would execute a command inside a running container?

**Definition:**

</details>

<details>
<summary>What command would you use to display the logs of a container?</summary>

### What command would you use to display the logs of a container?

**Definition:**

</details>

<details>
<summary>Explain how to copy files from a container to the local file system.</summary>

### Explain how to copy files from a container to the local file system.

**Definition:**

</details>

<details>
<summary>How can you inspect the details of a specific container via the CLI?</summary>

### How can you inspect the details of a specific container via the CLI?

**Definition:**

</details>

<details>
<summary>Describe how to use Docker’s REST API to start a container.</summary>

### Describe how to use Docker’s REST API to start a container.

**Definition:**

</details>

### Docker Best Practices

<details>
<summary>Explain the importance of minimizing the number of layers in a Dockerfile.</summary>

### Explain the importance of minimizing the number of layers in a Dockerfile.

**Definition:**

</details>

<details>
<summary>Discuss the best practices for tagging Docker images.</summary>

### Discuss the best practices for tagging Docker images.

**Definition:**

</details>

<details>
<summary>When should you use a `.dockerignore` file?</summary>

### When should you use a `.dockerignore` file?

**Definition:**

</details>

<details>
<summary>Why is it advised to run only one process per container?</summary>

### Why is it advised to run only one process per container?

**Definition:**

</details>

<details>
<summary>How should you handle logging in Docker containers?</summary>

### How should you handle logging in Docker containers?

**Definition:**

</details>

### Docker Troubleshooting & Optimization

<details>
<summary>How would you diagnose high CPU or memory usage in a container?</summary>

### How would you diagnose high CPU or memory usage in a container?

**Definition:**

</details>

<details>
<summary>What steps would you take if a container consistently fails shortly after starting?</summary>

### What steps would you take if a container consistently fails shortly after starting?

**Definition:**

</details>

<details>
<summary>In what scenarios would you prune Docker objects, and how?</summary>

### In what scenarios would you prune Docker objects, and how?

**Definition:**

</details>

<details>
<summary>How can you monitor the performance of Docker containers?</summary>

### How can you monitor the performance of Docker containers?

**Definition:**

</details>

<details>
<summary>What common issues might arise when working with Docker in a CI/CD pipeline?</summary>

### What common issues might arise when working with Docker in a CI/CD pipeline?

**Definition:**

</details>

### Docker Deployment & Integration

<details>
<summary>How do you define a multi-container application with `docker-compose`?</summary>

### How do you define a multi-container application with `docker-compose`?

**Definition:**

</details>

<details>
<summary>What considerations must be made when deploying Docker containers in a production environment?</summary>

### What considerations must be made when deploying Docker containers in a production environment?

**Definition:**

</details>

<details>
<summary>Explain the process of integrating Docker with a continuous integration system.</summary>

### Explain the process of integrating Docker with a continuous integration system.

**Definition:**

</details>

<details>
<summary>How would you migrate a traditional on-premise application to a Dockerized environment?</summary>

### How would you migrate a traditional on-premise application to a Dockerized environment?

**Definition:**

</details>

<details>
<summary>Describe how to automate the deployment of Docker containers using a CI/CD pipeline.</summary>

### Describe how to automate the deployment of Docker containers using a CI/CD pipeline.

**Definition:**

</details>

### Docker Storage & Persistence

<details>
<summary>When would you use a bind mount over a volume?</summary>

### When would you use a bind mount over a volume?

**Definition:**

</details>

<details>
<summary>How do you create a Docker volume, and what is its lifecycle?</summary>

### How do you create a Docker volume, and what is its lifecycle?

**Definition:**

</details>

<details>
<summary>What strategies would you use for data persistence in Docker clusters?</summary>

### What strategies would you use for data persistence in Docker clusters?

**Definition:**

</details>
