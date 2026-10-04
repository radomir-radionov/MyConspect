# Kubernetes — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./0_system_design.md)

### Related docs

- [Kubernetes — собеседование](./0_sd_kubernetes_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Kubernetes](https://devinterview.io/questions/software-architecture-and-system-design/kubernetes-interview-questions/).

### Kubernetes Basics

<details>
<summary>What is Kubernetes, and why is it used for container orchestration?</summary>

### What is Kubernetes, and why is it used for container orchestration?

**Definition:**

Kubernetes — это управляющий слой, который запускает контейнеры на кластере и держит их в объявленном состоянии. Клиенты ходят по стабильному имени, пока поды переносятся, перезапускаются или заменяются.

**How it works:**

- Планируется Pod: один или несколько контейнеров с общим сетевым пространством и томами. Deployment и ReplicaSet держат заданное число таких подов.
- У каждого пода свой IP. Service, Ingress и NetworkPolicy стоят над этим, чтобы клиенты не следили за адресами подов.
- PersistentVolume, claim и StorageClass подключают диски, которые живут дольше пода, в том числе созданные по запросу.
- Horizontal Pod Autoscaler меняет число реплик по CPU или памяти. Cluster autoscaler добавляет или убирает узлы.
- ResourceQuota и LimitRange ограничивают CPU и память для пространства имён или контейнера.
- Job и CronJob доводят пакетную задачу до конца, а не держат её как сервер.
- Rolling update меняет поды пачками. PodDisruptionBudget ограничивает, сколько их может быть недоступно во время обслуживания.
- Проваленный liveness probe перезапускает контейнер. Проваленный readiness probe убирает под из трафика.
- Secret и ConfigMap передают секреты и настройки, не зашивая их в образ.
- Метки выбирают группы объектов. Аннотации несут дополнительные данные, которые селекторы не читают.
- Свои контроллеры могут следить за API и приводить к нужному виду объявленные вами типы.
- Тот же API работает на ноутбуке, в своём дата-центре и в облаке. Инструмент вроде KubeFed может разослать общую конфигурацию на несколько кластеров.
- Уплотнение нагрузки на узлах снижает запас простаивающих ресурсов, а одни и те же манифесты выкатываются в любой среде.

**Examples:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: checkout
spec:
  containers:
    - name: api
      image: checkout:1.4
    - name: logs
      image: log-shipper:2
```

Контейнер API и сборщик логов ставятся вместе и видят друг друга на localhost.
</details>

<details>
<summary>Describe the roles of master and worker nodes in the Kubernetes architecture.</summary>

### Describe the roles of master and worker nodes in the Kubernetes architecture.

**Definition:**

Кластер делится на управляющий слой, который решает, что должно работать, и рабочие узлы, на которых работают контейнеры.

**How it works:**

- Управляющий слой, его всё ещё часто называют master, запускает API server, scheduler и controller manager. etcd хранит состояние кластера и часто живёт отдельным отказоустойчивым набором.
- API server — единственная входная дверь. С ним говорят kubectl и все контроллеры.
- Scheduler выбирает рабочий узел, где хватает CPU, памяти и совпадают ограничения.
- Контроллеры смотрят на живые объекты и создают или удаляют поды, пока кластер не совпадёт со спецификацией.
- Эти процессы можно держать на нескольких машинах управляющего слоя. Пользовательские контейнеры обычно туда не ставят.
- На каждом рабочем узле работают kubelet, который запускает контейнеры назначенных подов, и kube-proxy, который настраивает пересылку Service.
- Среда исполнения на узле (containerd или CRI-O) и создаёт процессы.
- Иногда выделяют машины только под хранилище или ingress. Это дополнение, а не обязательная третья роль.

**Examples:**

`kubectl get nodes` помечает машины управляющего слоя taint control-plane, остальные остаются рабочими. Новый под сохраняет API server, размещает scheduler и запускает kubelet на выбранном узле.
</details>

<details>
<summary>How do Pods facilitate the management of containers in Kubernetes?</summary>

### How do Pods facilitate the management of containers in Kubernetes?

**Definition:**

Pod — единица, которую планировщик ставит на узел. Он объединяет один или несколько контейнеров, которые должны работать вместе и делить сеть и тома.

**How it works:**

- Контейнеры в поде делят один IP, одно имя хоста и одно сетевое пространство, поэтому достучаться друг до друга можно через localhost.
- Под планируется целиком: все его контейнеры попадают на один узел или не попадает ни один.
- Тома, объявленные на поде, можно смонтировать в каждый его контейнер.
- У каждого контейнера всё равно свой образ, команда и запрос CPU или памяти.
- Под с одним контейнером — обычный случай для самостоятельного процесса.
- Дополнительные контейнеры — sidecar: прокси, сборщик логов или синхронизация файлов рядом с основным процессом.
- kubelet может перезапустить контейнер по политике перезапуска пода. Идентичность пода сохраняется, пока не заменят сам под.
- Deployment, Job и DaemonSet не планируют контейнеры напрямую. Они штампуют поды из шаблона.

**Examples:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
    - name: metrics
      image: exporter:1
```

Экспортёр обращается к nginx по `127.0.0.1:80`, потому что оба контейнера делят сеть пода.
</details>

<details>
<summary>What types of Services exist in Kubernetes, and how do they facilitate pod communication?</summary>

### What types of Services exist in Kubernetes, and how do they facilitate pod communication?

**Definition:**

Service даёт стабильное имя и адрес для меняющегося набора подов. Тип решает, кто может пользоваться этим адресом.

**How it works:**

- ClusterIP, тип по умолчанию, выделяет виртуальный IP внутри кластера и балансирует по готовым подам, которые совпали с селектором.
- NodePort дополнительно открывает этот порт на каждом узле, чтобы трафик снаружи попадал внутрь и уходил на эти поды.
- LoadBalancer просит облако или контроллер поставить внешний балансировщик перед Service.
- ExternalName публикует CNAME на DNS-имя вне кластера и не выбирает поды.
- Headless Service (`clusterIP: None`) возвращает IP самих подов. StatefulSet использует это для стабильного DNS каждого пода.
- Селектор заполняет EndpointSlice. Поды, не прошедшие readiness, выпадают из списка, и клиенты держат один адрес, пока состав меняется.

**Examples:**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: payments
spec:
  type: ClusterIP
  selector:
    app: payments
  ports:
    - port: 80
      targetPort: 8080
```

Клиенты ходят на `http://payments` и не запоминают IP пода.
</details>

<details>
<summary>Explain the functionality of Namespaces in Kubernetes.</summary>

### Explain the functionality of Namespaces in Kubernetes.

**Definition:**

Namespace — граница имён и политик внутри одного кластера, чтобы команды или среды делили машины без столкновения имён.

**How it works:**

- Имена подов, Service и большинства других объектов должны быть уникальны только внутри Namespace. `api` в `dev` и `api` в `prod` — разные объекты.
- ResourceQuota ограничивает суммарные CPU, память и число объектов. LimitRange подставляет запросы по умолчанию, если контейнер их не указал.
- Привязки ролей можно ограничить одним Namespace, а NetworkPolicy — тем, какие пространства имён могут общаться.
- DNS включает Namespace (`api.dev.svc.cluster.local`). Короткое имя `api` разрешается только в том же Namespace.
- Само по себе пространство имён не делит узлы и физическую сеть. Границу делают квоты и политики.
- Node и PersistentVolume относятся ко всему кластеру и не живут в Namespace.

**Examples:**

`kubectl create namespace staging`, затем `kubectl -n staging apply -f app.yaml` держит эти объекты вне `default`. Квота в 4 CPU в `staging` отклонит следующий под, который её превысит.
</details>

### Kubernetes Objects and Workloads

<details>
<summary>Differentiate between Deployments, StatefulSets, and DaemonSets.</summary>

### Differentiate between Deployments, StatefulSets, and DaemonSets.

**Definition:**

Deployment, StatefulSet и DaemonSet все поддерживают поды запущенными. Они различаются идентичностью, хранилищем и тем, куда ставятся поды.

**How it works:**

- Deployment владеет ReplicaSet из взаимозаменяемых подов. Любая реплика может обслужить любой запрос, хранилище обычно внешнее, а выкат заменяет поды пачками. Соседи общаются через Service, а не через стабильные имена подов.
- StatefulSet даёт каждому поду стабильный порядковый номер (`db-0`, `db-1`) и обычно свой том через `volumeClaimTemplates`. Он создаёт и удаляет их по порядку. Headless DNS сохраняет эти имена после перезапуска.
- DaemonSet запускает один под на каждом выбранном узле, включая узлы, которые присоединились позже. Числа реплик для масштабирования нет, и подам редко нужно находить друг друга. Так ставят агентов узла, например сборщики логов.
- Deployment — для реплик без состояния, StatefulSet — когда идентичность и диск должны пережить перенос, DaemonSet — когда работа нужна на каждом узле.
- Разовая задача — это Job, а не один из этих трёх.

**Examples:**

Три реплики веба — Deployment. База, где `db-0` основной, — StatefulSet. Сборщик логов на каждой машине — DaemonSet.
</details>

<details>
<summary>How do ReplicaSets ensure pod availability?</summary>

### How do ReplicaSets ensure pod availability?

**Definition:**

ReplicaSet держит число работающих подов равным объявленному, создавая замены из шаблона пода.

**How it works:**

- Шаблон — это спецификация пода, которую копируют для каждой новой реплики, включая метки и образ контейнера.
- Контроллер сравнивает поды, совпавшие с селектором, с `spec.replicas`.
- Если под исчез или его узел потерян, контроллер создаёт другой из шаблона.
- Увеличение или уменьшение `replicas` масштабирует набор.
- Deployment создаёт новый ReplicaSet на каждый выкат и переносит реплики со старого набора на новый. Откат — это то же масштабирование в обратную сторону.
- Селектор должен совпадать с метками шаблона. Иначе контроллер не примет поды, которые сам создал.

**Examples:**

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: cache
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cache
  template:
    metadata:
      labels:
        app: cache
    spec:
      containers:
        - name: redis
          image: redis:7
```

Удалите один под — появится новый под `redis:7` без ручного перезапуска.
</details>

<details>
<summary>What are Jobs in Kubernetes, and when is it suitable to use them?</summary>

### What are Jobs in Kubernetes, and when is it suitable to use them?

**Definition:**

Job запускает поды, пока заданное число не завершится успешно, и затем останавливается. Он подходит для пакетной работы, а не для процесса, который должен жить постоянно.

**How it works:**

- `completions` — сколько успешных подов нужно. `parallelism` — сколько может работать одновременно.
- Под, вышедший с кодом 0, не перезапускается. Упавший под можно повторить до `backoffLimit`.
- Завершённые поды остаются, пока лимит истории или TTL-контроллер их не удалит.
- `completions: 1` и `parallelism: 1` — один запуск, например миграция схемы.
- Большие числа гоняют независимые куски параллельно: сборку пакетов или обработку файлов.
- Job с очередью позволяет воркерам забирать задачи, пока очередь не опустеет. Часто используют индексы, чтобы каждый индекс был отдельным элементом.
- CronJob создаёт Job по расписанию для резервных копий и другой повторяющейся пакетной работы.

**Examples:**

Ночной экспорт — CronJob, в шаблоне которого `completions: 1`. Импорт из 20 частей: `completions: 20` и `parallelism: 4`, четыре воркера работают, пока двадцать не завершатся успешно.
</details>

<details>
<summary>How do Labels and Selectors work together in Kubernetes?</summary>

### How do Labels and Selectors work together in Kubernetes?

**Definition:**

Метки — пары ключ-значение на объектах. Селекторы — запросы, которые находят объекты по этим меткам, поэтому Service или контроллер не зашивает имена подов.

**How it works:**

- Метки вроде `app` или `env` обозначают группу. Это не произвольные заметки.
- `matchLabels` требует каждую перечисленную пару. Селекторы по множеству добавляют `In`, `NotIn` и `Exists`.
- Service, ReplicaSet, Deployment, DaemonSet, Job, StatefulSet и NetworkPolicy выбирают поды именно так.
- Селектор Service заполняет EndpointSlice. Ingress направляет на Service, а не прямо по метке пода.
- Смена метки перемещает объект в группу или из неё без правки потребителя.
- Аннотации держат дополнительные данные, которые селекторы игнорируют.
- Service без селектора не собирает endpoints сам. Пустой селектор не значит «совпасть со всем».

**Examples:**

```yaml
metadata:
  labels:
    app: shop
    env: prod
---
spec:
  selector:
    matchLabels:
      app: shop
      env: prod
```

Deployment, Service и NetworkPolicy могут использовать одну и ту же пару.
</details>

<details>
<summary>What would you consider when performing a rolling update in Kubernetes?</summary>

### What would you consider when performing a rolling update in Kubernetes?

**Definition:**

Rolling update заменяет старые поды новыми небольшими порциями, чтобы часть мощности оставалась доступной всё время.

**How it works:**

- Deployment создаёт новый ReplicaSet и наращивает его, одновременно уменьшая предыдущий.
- `maxUnavailable` — насколько число готовых подов может опуститься ниже желаемого. `maxSurge` — сколько лишних подов допустимо во время замены.
- Новый под получает трафик только после успешного readiness probe.
- Проваленный liveness probe перезапускает этот контейнер. Если новый ReplicaSet так и не станет готовым, выкат останавливается, и можно вернуть масштаб предыдущему ReplicaSet.
- `kubectl rollout status` показывает прогресс. PodDisruptionBudget тоже может отказать в добровольном выселении, если слишком много подов окажется недоступно.
- Обе версии обслуживают сразу, поэтому новый релиз должен терпеть ещё работающую старую версию.

**Examples:**

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0
    maxSurge: 1
```

При трёх репликах Kubernetes сначала поднимает один новый под, ждёт готовности и только потом убирает один старый.
</details>

### Kubernetes Networking

<details>
<summary>How do Services route traffic to pods in Kubernetes?</summary>

### How do Services route traffic to pods in Kubernetes?

**Definition:**

Service не отправляет пакеты на метку. Он хранит список адресов готовых подов, а узел перенаправляет IP Service на один из этих адресов.

**How it works:**

- Селектор совпадает с метками подов. Управляющий слой записывает IP и порты готовых подов в EndpointSlice.
- kube-proxy или другой data plane ставит правила iptables, IPVS или nftables, чтобы ClusterIP транслировался на бэкенд.
- Поды, не прошедшие readiness, выходят из списка, и трафик прекращается до удаления процесса.
- `sessionAffinity: ClientIP` привязывает адрес клиента к одному поду на время таймаута. `None`, значение по умолчанию, может выбрать другой бэкенд на каждое соединение. Это привязка по адресу, а не cookie.
- ClusterIP, NodePort и LoadBalancer используют один и тот же список endpoints. ExternalName только возвращает DNS CNAME.
- `port` — то, чем пользуются клиенты на Service. `targetPort` — порт контейнера.

**Examples:**

```yaml
spec:
  selector:
    app: shop
  sessionAffinity: ClientIP
  ports:
    - port: 80
      targetPort: 8080
```

Соединение с ClusterIP на порт 80 попадает на порт 8080 одного готового пода с меткой `app=shop`.
</details>

<details>
<summary>Describe the purpose of Ingress and its key components.</summary>

### Describe the purpose of Ingress and its key components.

**Definition:**

Ingress описывает маршрутизацию HTTP и HTTPS снаружи кластера на Service по хосту и пути. Объект ничего не делает, пока его не реализует контроллер.

**How it works:**

- Ресурс Ingress перечисляет хосты, пути, бэкенд-Service и при необходимости TLS Secret.
- Ingress-контроллер (NGINX, Traefik или облачный контроллер) следит за этими объектами и настраивает прокси или балансировщик седьмого уровня.
- Много Service могут делить один внешний адрес и один сертификат.
- Правило может отправить `shop.example` `/api` на один Service, а `/` на другой.
- Это подходит кластерам, которые отдают несколько HTTP-сервисов через один вход. Трафик не HTTP по-прежнему идёт через Service типа LoadBalancer или NodePort.
- Gateway API — более новая модель той же задачи, с более ясными ролями и местом для разделения трафика.

**Examples:**

Один хост, два пути: `/` идёт на `web:80`, `/pay` на `payments:80`, TLS берётся из Secret `shop-tls`. Клиенты ходят на `https://shop.example` и не видят ClusterIP.
</details>

<details>
<summary>Explain Kubernetes DNS resolution for services.</summary>

### Explain Kubernetes DNS resolution for services.

**Definition:**

В кластере работает DNS-сервер, обычно CoreDNS, который сопоставляет имена Service и подов с адресами, чтобы нагрузки звали друг друга по имени.

**How it works:**

- Ранние кластеры использовали kube-dns. Его сменил CoreDNS, который включает возможности плагинами.
- Service `api` в Namespace `shop` — это `api.shop.svc.cluster.local`. Внутри этого Namespace достаточно короткого имени `api`.
- Поды с `dnsPolicy: ClusterFirst` отправляют кластерные имена в CoreDNS, а остальные — выше по цепочке. `dnsConfig` добавляет домены поиска или дополнительные серверы.
- Обычный Service разрешается в свой ClusterIP. Headless Service разрешается в IP подов.
- CoreDNS следит за API, поэтому запись следует за сменой адреса.
- То же короткое имя в другом Namespace — другой Service. Вызов через границу использует полное имя.
- Имён между кластерами из коробки нет. Их дают внешний DNS, Ingress или mesh.

**Examples:**

Из пода в `shop` команда `nslookup api` возвращает ClusterIP. `nslookup api.billing.svc.cluster.local` попадает в billing. Headless-имя StatefulSet `db-0.db.shop.svc.cluster.local` возвращает IP этого пода.
</details>

<details>
<summary>What is the Container Network Interface (CNI), and how does it integrate with Kubernetes?</summary>

### What is the Container Network Interface (CNI), and how does it integrate with Kubernetes?

**Definition:**

CNI — интерфейс плагина, через который kubelet подключает под к сети. Саму сеть подов Kubernetes не реализует. Это делает установленный плагин.

**How it works:**

- Когда среда исполнения создаёт песочницу пода, kubelet вызывает бинарник CNI, настроенный в `/etc/cni/net.d`.
- Плагин выдаёт IP, подключает veth или аналог и прописывает маршруты. При удалении он их снимает.
- Calico, Cilium и Flannel — частые плагины. Они различаются оверлеем и маршрутизируемой сетью и тем, применяют ли они NetworkPolicy.
- Плагин обычно ставят как DaemonSet, чтобы он работал на каждом узле.
- Контейнеры одного пода уже делят пространство имён. CNI соединяет это пространство с остальным кластером.
- Multus — необязательный мета-плагин, который может добавить интерфейсы через NetworkAttachmentDefinition. Обычный путь — один интерфейс.
- Service и Ingress стоят над сетью подов. CNI даёт достижимость. NetworkPolicy решает, какие потоки разрешены.

**Examples:**

Когда под в состоянии Running, `kubectl get pod -o wide` показывает IP, который выдал плагин. Если DaemonSet CNI лежит, новые поды остаются в ContainerCreating с ошибкой сетевого плагина.
</details>

<details>
<summary>How do you implement Network Policies, and what are their benefits?</summary>

### How do you implement Network Policies, and what are their benefits?

**Definition:**

NetworkPolicy выбирает поды и перечисляет, какие соседи, порты и протоколы могут подключаться. Она ограничивает боковое движение, когда контроллер реально её применяет.

**How it works:**

- `podSelector` выбирает поды. Правила ingress перечисляют, кто может подключиться внутрь. Правила egress — куда эти поды могут подключаться наружу.
- Сосед может быть другими подами по метке, другим Namespace или блоком IP. Порты и протоколы сужают совпадение.
- В основном API, как только политика выбирает под для направления, это направление становится списком разрешений. Трафик, который ни одна политика не разрешила, отбрасывается. Поды без политики остаются открытыми.
- Объекты ничего не делают, пока плагин вроде Calico или Cilium их не применяет.
- Эти плагины добавляют и более богатые правила, включая явный запрет. Cilium может сопоставлять идентичность приложения, а не только IP и порты.
- Правила добавляют маленькими шагами и проверяют. Политика ingress без разрешающего правила запирает под.
- Политики фиксируют ожидаемые потоки и дают ревью конкретный список разрешений.

**Examples:**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-in
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes: [Ingress]
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: web
      ports:
        - protocol: TCP
          port: 8080
```

Только поды с меткой `app=web` могут открыть TCP 8080 к `app=api`. Остальной входящий трафик запрещён.
</details>

### Kubernetes Storage

<details>
<summary>How do PersistentVolumes (PVs) and PersistentVolumeClaims (PVCs) interact in Kubernetes?</summary>

### How do PersistentVolumes (PVs) and PersistentVolumeClaims (PVCs) interact in Kubernetes?

**Definition:**

</details>

<details>
<summary>Explain dynamic provisioning in relation to StorageClasses.</summary>

### Explain dynamic provisioning in relation to StorageClasses.

**Definition:**

</details>

<details>
<summary>What strategies exist for handling persistent data when a pod’s lifecycle ends?</summary>

### What strategies exist for handling persistent data when a pod’s lifecycle ends?

**Definition:**

</details>

### Kubernetes Cluster Management

<details>
<summary>Describe the process for initializing a Kubernetes cluster.</summary>

### Describe the process for initializing a Kubernetes cluster.

**Definition:**

</details>

<details>
<summary>What factors need to be considered when adding new nodes to a Kubernetes cluster?</summary>

### What factors need to be considered when adding new nodes to a Kubernetes cluster?

**Definition:**

</details>

<details>
<summary>How does draining a node affect the running applications, and when should you perform this action?</summary>

### How does draining a node affect the running applications, and when should you perform this action?

**Definition:**

</details>

<details>
<summary>In what scenarios would you scale a Kubernetes deployment, and what tools would you use?</summary>

### In what scenarios would you scale a Kubernetes deployment, and what tools would you use?

**Definition:**

</details>

### Kubernetes Security

<details>
<summary>Explain Role-Based Access Control (RBAC) in Kubernetes.</summary>

### Explain Role-Based Access Control (RBAC) in Kubernetes.

**Definition:**

</details>

<details>
<summary>Describe how to securely manage Secrets in Kubernetes.</summary>

### Describe how to securely manage Secrets in Kubernetes.

**Definition:**

</details>

<details>
<summary>What is a security context, and how does it apply to pod security?</summary>

### What is a security context, and how does it apply to pod security?

**Definition:**

</details>

<details>
<summary>How do NetworkPolicies contribute to pod security, and how would you implement them?</summary>

### How do NetworkPolicies contribute to pod security, and how would you implement them?

**Definition:**

</details>

### Observability and Monitoring

<details>
<summary>Describe the role and capabilities of the Metrics Server in a Kubernetes cluster.</summary>

### Describe the role and capabilities of the Metrics Server in a Kubernetes cluster.

**Definition:**

</details>

<details>
<summary>How can Prometheus be configured to monitor Kubernetes components?</summary>

### How can Prometheus be configured to monitor Kubernetes components?

**Definition:**

</details>

<details>
<summary>Discuss the integration of Grafana for Kubernetes observability.</summary>

### Discuss the integration of Grafana for Kubernetes observability.

**Definition:**

</details>

### Kubernetes Scheduling and Scalability

<details>
<summary>How can you use Node Selectors and Affinity rules to influence pod placement?</summary>

### How can you use Node Selectors and Affinity rules to influence pod placement?

**Definition:**

</details>

<details>
<summary>Explain Horizontal Pod Autoscaling (HPA) and its triggers within Kubernetes.</summary>

### Explain Horizontal Pod Autoscaling (HPA) and its triggers within Kubernetes.

**Definition:**

</details>

### Kubernetes Troubleshooting and Debugging

<details>
<summary>What steps would you take to troubleshoot a pod that is not starting?</summary>

### What steps would you take to troubleshoot a pod that is not starting?

**Definition:**

</details>

<details>
<summary>How would you diagnose network issues in Kubernetes?</summary>

### How would you diagnose network issues in Kubernetes?

**Definition:**

</details>

### Advanced Kubernetes Features

<details>
<summary>Define Custom Resource Definitions (CRDs) and their utility in Kubernetes.</summary>

### Define Custom Resource Definitions (CRDs) and their utility in Kubernetes.

**Definition:**

</details>

<details>
<summary>Discuss the functionalities provided by a Service Mesh like Istio in Kubernetes.</summary>

### Discuss the functionalities provided by a Service Mesh like Istio in Kubernetes.

**Definition:**

</details>

<details>
<summary>What are the use cases for Kubernetes Federation?</summary>

### What are the use cases for Kubernetes Federation?

**Definition:**

</details>

### Kubernetes Ecosystem and Tools

<details>
<summary>How does Helm enhance application management within Kubernetes?</summary>

### How does Helm enhance application management within Kubernetes?

**Definition:**

</details>

<details>
<summary>Explain the role of Kustomize in Kubernetes configuration management.</summary>

### Explain the role of Kustomize in Kubernetes configuration management.

**Definition:**

</details>

<details>
<summary>Describe the importance of a Container Registry in a Kubernetes environment.</summary>

### Describe the importance of a Container Registry in a Kubernetes environment.

**Definition:**

</details>

### Best Practices in Kubernetes

<details>
<summary>What best practices would you follow for high availability in Kubernetes deployments?</summary>

### What best practices would you follow for high availability in Kubernetes deployments?

**Definition:**

</details>

<details>
<summary>How do ConfigMaps and Secrets improve configuration management?</summary>

### How do ConfigMaps and Secrets improve configuration management?

**Definition:**

</details>

<details>
<summary>Describe multitenancy considerations for resource utilization in Kubernetes.</summary>

### Describe multitenancy considerations for resource utilization in Kubernetes.

**Definition:**

</details>
