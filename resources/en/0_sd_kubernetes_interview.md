# Kubernetes — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [Kubernetes — Interview](./0_sd_kubernetes_interview.md)

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

Kubernetes is a control plane that runs containers across a cluster and keeps them at the state you declared. Callers use a stable name while Pods are rescheduled, restarted, or replaced.

**How it works:**

- A Pod is the thing that gets scheduled: one or more containers that share a network namespace and volumes. Deployments and ReplicaSets keep a chosen number of those Pods running.
- Each Pod has its own IP. Services, Ingress, and NetworkPolicy sit above that so clients do not track Pod addresses.
- PersistentVolumes, claims, and StorageClasses attach disks that outlive a Pod, including disks created on demand.
- The Horizontal Pod Autoscaler changes the replica count from CPU or memory. A cluster autoscaler adds or removes nodes.
- ResourceQuota and LimitRange cap CPU and memory for a namespace or a container.
- Jobs and CronJobs run a batch to completion instead of staying up as a server.
- Rolling updates swap Pods in batches. A PodDisruptionBudget limits how many may be down during maintenance.
- A failed liveness probe restarts a container. A failed readiness probe keeps traffic off that Pod.
- Secrets and ConfigMaps inject credentials and settings without baking them into the image.
- Labels select groups of objects. Annotations carry extra metadata that selectors ignore.
- Custom controllers can watch the API and reconcile kinds you define yourself.
- The same API runs on a laptop, on premises, or in a cloud. A tool such as KubeFed can push shared configuration to more than one cluster.
- Packing work onto nodes cuts spare capacity, and the same manifests deploy in every environment.

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

The API container and the log shipper are placed together and share localhost.
</details>

<details>
<summary>Describe the roles of master and worker nodes in the Kubernetes architecture.</summary>

### Describe the roles of master and worker nodes in the Kubernetes architecture.

**Definition:**

The cluster splits into a control plane that decides what should run, and worker nodes that run the containers.

**How it works:**

- The control plane, still often called the master, runs the API server, the scheduler, and the controller manager. etcd stores cluster state and is often its own highly available set.
- The API server is the only front door. kubectl and every controller talk to it.
- The scheduler picks a worker with enough CPU, memory, and matching constraints.
- Controllers watch live objects and create or delete Pods until the cluster matches the spec.
- Several control-plane machines can run those processes. User containers usually stay off them.
- Each worker runs kubelet, which starts the containers for assigned Pods, and kube-proxy, which programs Service forwarding.
- The container runtime on the worker (containerd or CRI-O) is what creates the processes.
- Some clusters add machines only for storage or ingress. Those are optional, not a third required role.

**Examples:**

`kubectl get nodes` marks control-plane machines with a control-plane taint and leaves the rest as workers. A new Pod is stored by the API server, placed by the scheduler, and started by kubelet on the chosen worker.
</details>

<details>
<summary>How do Pods facilitate the management of containers in Kubernetes?</summary>

### How do Pods facilitate the management of containers in Kubernetes?

**Definition:**

A Pod is the unit the scheduler places on a node. It wraps one or more containers that must run together and share a network and volumes.

**How it works:**

- Containers in the Pod share one IP, one hostname, and one network namespace, so they reach each other on localhost.
- The Pod is scheduled as a whole: all of its containers land on the same node, or none do.
- Volumes declared on the Pod can be mounted into every container in it.
- Each container still has its own image, command, and CPU or memory request.
- A single-container Pod is the usual case for a process that stands alone.
- Extra containers are sidecars: a proxy, a log collector, or a file sync next to the main process.
- kubelet can restart a container under the Pod’s restart policy. The Pod identity stays until the Pod itself is replaced.
- Deployments, Jobs, and DaemonSets do not schedule containers directly. They stamp out Pods from a template.

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

The exporter calls nginx at `127.0.0.1:80` because both containers share the Pod network.
</details>

<details>
<summary>What types of Services exist in Kubernetes, and how do they facilitate pod communication?</summary>

### What types of Services exist in Kubernetes, and how do they facilitate pod communication?

**Definition:**

A Service gives a stable name and address for a changing set of Pods. The type decides who can use that address.

**How it works:**

- ClusterIP, the default, allocates a virtual IP inside the cluster and balances across ready Pods that match the selector.
- NodePort also opens that port on every node, so traffic can enter from outside and is forwarded to those Pods.
- LoadBalancer asks the cloud or a controller for an external balancer in front of the Service.
- ExternalName publishes a CNAME to a DNS name outside the cluster and does not select Pods.
- A headless Service (`clusterIP: None`) returns the Pod IPs themselves. StatefulSets use that for stable per-Pod DNS.
- The selector fills an EndpointSlice. Pods that fail readiness drop out, so clients keep one address while membership changes.

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

Callers use `http://payments` and never store a Pod IP.
</details>

<details>
<summary>Explain the functionality of Namespaces in Kubernetes.</summary>

### Explain the functionality of Namespaces in Kubernetes.

**Definition:**

A Namespace is a naming and policy boundary inside one cluster, so teams or environments can share the machines without name collisions.

**How it works:**

- Names of Pods, Services, and most other objects only need to be unique inside the Namespace. `api` in `dev` and `api` in `prod` are different objects.
- ResourceQuota caps total CPU, memory, and object counts. LimitRange supplies default requests when a container omits them.
- Role bindings can be limited to one Namespace, and NetworkPolicy can restrict which Namespaces may talk.
- DNS includes the Namespace (`api.dev.svc.cluster.local`). The short name `api` resolves only in the same Namespace.
- A Namespace does not split nodes or the physical network by itself. Quotas and policies are what make the boundary real.
- Nodes and PersistentVolumes are cluster-scoped and do not live in a Namespace.

**Examples:**

`kubectl create namespace staging` and then `kubectl -n staging apply -f app.yaml` keeps those objects out of `default`. A quota of 4 CPU in `staging` rejects the next Pod that would exceed it.
</details>

### Kubernetes Objects and Workloads

<details>
<summary>Differentiate between Deployments, StatefulSets, and DaemonSets.</summary>

### Differentiate between Deployments, StatefulSets, and DaemonSets.

**Definition:**

Deployments, StatefulSets, and DaemonSets all keep Pods running. They differ in identity, storage, and where the Pods are placed.

**How it works:**

- A Deployment owns a ReplicaSet of interchangeable Pods. Any replica can serve any request, storage is usually external, and a rollout replaces Pods in batches. Peers talk through a Service, not through stable Pod names.
- A StatefulSet gives each Pod a stable ordinal (`db-0`, `db-1`) and usually its own volume via `volumeClaimTemplates`. It creates and deletes them in order. Headless DNS keeps those names across restarts.
- A DaemonSet runs one Pod on every selected node, including nodes that join later. There is no replica count to scale, and the Pods rarely need to find each other. Node agents such as log collectors fit this.
- Pick a Deployment for stateless replicas, a StatefulSet when identity and disk must survive reschedule, and a DaemonSet when the work is per node.
- A one-shot task is a Job, not one of these three.

**Examples:**

Three web replicas are a Deployment. A database where `db-0` is primary is a StatefulSet. A log collector on every machine is a DaemonSet.
</details>

<details>
<summary>How do ReplicaSets ensure pod availability?</summary>

### How do ReplicaSets ensure pod availability?

**Definition:**

A ReplicaSet keeps the number of running Pods equal to a declared count by creating replacements from a Pod template.

**How it works:**

- The template is the Pod spec copied for every new replica, including labels and the container image.
- A controller compares Pods that match the selector with `spec.replicas`.
- If a Pod disappears or its node is lost, the controller creates another from the template.
- Raising or lowering `replicas` scales the set up or down.
- A Deployment creates a fresh ReplicaSet for each rollout and moves replicas from the old set to the new one, which is what makes rollback a scale operation.
- The selector must match the template labels. Otherwise the controller will not adopt the Pods it creates.

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

Delete one Pod and a new `redis:7` Pod appears without a manual restart.
</details>

<details>
<summary>What are Jobs in Kubernetes, and when is it suitable to use them?</summary>

### What are Jobs in Kubernetes, and when is it suitable to use them?

**Definition:**

A Job runs Pods until a set number finish successfully, then stops. It fits batch work, not a process that should stay up.

**How it works:**

- `completions` is how many successful Pods you need. `parallelism` is how many may run at once.
- A Pod that exits 0 is not restarted. A failed Pod can be retried up to `backoffLimit`.
- Finished Pods remain until a history limit or a TTL controller removes them.
- `completions: 1` and `parallelism: 1` is a single run, such as a schema migration.
- Higher numbers run independent chunks in parallel, such as compiling packages or processing files.
- A work-queue Job lets workers pull tasks until the queue is drained, often with indexed completion so each index is a distinct item.
- A CronJob creates a Job on a schedule for backups and other recurring batches.

**Examples:**

A nightly export is a CronJob whose template sets `completions: 1`. An import of 20 shards uses `completions: 20` and `parallelism: 4`, so four workers run until twenty have succeeded.
</details>

<details>
<summary>How do Labels and Selectors work together in Kubernetes?</summary>

### How do Labels and Selectors work together in Kubernetes?

**Definition:**

Labels are key-value tags on objects. Selectors are queries that find objects by those tags, so a Service or controller does not hard-code Pod names.

**How it works:**

- Labels such as `app` or `env` identify a group. They are not free-form notes.
- `matchLabels` requires every listed pair. Set-based selectors add `In`, `NotIn`, and `Exists`.
- Services, ReplicaSets, Deployments, DaemonSets, Jobs, StatefulSets, and NetworkPolicies all select Pods this way.
- A Service selector fills EndpointSlices. Ingress routes to Services, not by Pod label directly.
- Changing a label moves an object into or out of a group without editing the consumer.
- Annotations hold extra data that selectors ignore.
- A Service with no selector does not build endpoints automatically. An empty selector is not “match everything.”

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

A Deployment, a Service, and a NetworkPolicy can share that pair.
</details>

<details>
<summary>What would you consider when performing a rolling update in Kubernetes?</summary>

### What would you consider when performing a rolling update in Kubernetes?

**Definition:**

A rolling update replaces old Pods with new ones in small batches so some capacity stays up the whole time.

**How it works:**

- The Deployment creates a new ReplicaSet and scales it up while it scales the previous one down.
- `maxUnavailable` is how far the ready count may fall below the desired count. `maxSurge` is how many extra Pods may exist during the swap.
- A new Pod receives traffic only after its readiness probe succeeds.
- A failing liveness probe restarts that container. If the new ReplicaSet never becomes ready, the rollout pauses and you can scale back to the previous ReplicaSet.
- `kubectl rollout status` shows progress. A PodDisruptionBudget can also refuse voluntary eviction when too many Pods would be down.
- Both versions serve at once, so the new release has to tolerate the old one still running.

**Examples:**

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0
    maxSurge: 1
```

With three replicas, Kubernetes starts one new Pod, waits until it is ready, then removes one old Pod.
</details>

### Kubernetes Networking

<details>
<summary>How do Services route traffic to pods in Kubernetes?</summary>

### How do Services route traffic to pods in Kubernetes?

**Definition:**

A Service does not forward packets to a label. It keeps a list of ready Pod addresses, and the node redirects the Service IP to one of those addresses.

**How it works:**

- The selector matches Pod labels. The control plane writes the ready Pod IPs and ports into an EndpointSlice.
- kube-proxy, or another data plane, installs iptables, IPVS, or nftables rules so the ClusterIP is translated to a backend.
- Pods that fail readiness leave the list, so traffic stops before the process is deleted.
- `sessionAffinity: ClientIP` sticks a client address to one Pod for a timeout. `None`, the default, may pick a different backend per connection. This is address affinity, not a cookie.
- ClusterIP, NodePort, and LoadBalancer all use that endpoint list. ExternalName only returns a DNS CNAME.
- `port` is what clients use on the Service. `targetPort` is the container port.

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

A connection to the ClusterIP on port 80 lands on port 8080 of one ready Pod labeled `app=shop`.
</details>

<details>
<summary>Describe the purpose of Ingress and its key components.</summary>

### Describe the purpose of Ingress and its key components.

**Definition:**

Ingress describes HTTP and HTTPS routing from outside the cluster to Services, matched by host and path. The object does nothing until a controller implements it.

**How it works:**

- The Ingress resource lists hosts, paths, backend Services, and optional TLS Secrets.
- An Ingress controller (NGINX, Traefik, or a cloud controller) watches those objects and programs a layer-7 proxy or load balancer.
- Many Services can share one external address and one certificate.
- A rule can send `shop.example` `/api` to one Service and `/` to another.
- It fits clusters that expose several HTTP services through one entry. Non-HTTP traffic still uses a LoadBalancer or NodePort Service.
- The Gateway API is a newer model for the same job, with clearer roles and room for traffic splitting.

**Examples:**

One host, two paths: `/` goes to `web:80` and `/pay` goes to `payments:80`, with TLS from a Secret named `shop-tls`. Clients use `https://shop.example` and never see the ClusterIPs.
</details>

<details>
<summary>Explain Kubernetes DNS resolution for services.</summary>

### Explain Kubernetes DNS resolution for services.

**Definition:**

The cluster runs a DNS server, usually CoreDNS, that maps Service and Pod names to addresses so workloads call each other by name.

**How it works:**

- Early clusters used kube-dns. CoreDNS replaced it and turns features on as plugins.
- A Service `api` in Namespace `shop` is `api.shop.svc.cluster.local`. Inside that Namespace the short name `api` is enough.
- Pods with `dnsPolicy: ClusterFirst` send cluster names to CoreDNS and other names upstream. `dnsConfig` adds search domains or extra servers.
- An ordinary Service resolves to its ClusterIP. A headless Service resolves to the Pod IPs.
- CoreDNS watches the API, so the record follows address changes.
- The same short name in another Namespace is a different Service. Cross-namespace callers use the qualified name.
- Names across clusters are not built in. You add external DNS, Ingress, or a mesh.

**Examples:**

From a Pod in `shop`, `nslookup api` returns the ClusterIP. `nslookup api.billing.svc.cluster.local` reaches billing. A StatefulSet headless name `db-0.db.shop.svc.cluster.local` returns that Pod’s IP.
</details>

<details>
<summary>What is the Container Network Interface (CNI), and how does it integrate with Kubernetes?</summary>

### What is the Container Network Interface (CNI), and how does it integrate with Kubernetes?

**Definition:**

CNI is the plugin interface kubelet uses to attach a Pod to the network. Kubernetes does not ship the Pod network itself. The installed plugin does.

**How it works:**

- When the runtime creates a Pod sandbox, kubelet invokes the CNI binary configured under `/etc/cni/net.d`.
- The plugin assigns an IP, connects a veth or equivalent, and installs routes. On delete it removes them.
- Calico, Cilium, and Flannel are common plugins. They differ in overlay versus routed fabrics and in whether they enforce NetworkPolicy.
- The plugin is usually a DaemonSet, so every node runs it.
- Containers inside one Pod already share a namespace. CNI connects that namespace to the rest of the cluster.
- Multus is an optional meta-plugin that can add extra interfaces through NetworkAttachmentDefinitions. The default path is still one interface.
- Services and Ingress sit above the Pod network. CNI provides reachability. NetworkPolicy decides which flows are allowed.

**Examples:**

After a Pod is Running, `kubectl get pod -o wide` shows the IP the plugin assigned. If the CNI DaemonSet is down, new Pods stay in ContainerCreating with a network plugin error.
</details>

<details>
<summary>How do you implement Network Policies, and what are their benefits?</summary>

### How do you implement Network Policies, and what are their benefits?

**Definition:**

A NetworkPolicy selects Pods and lists which peers, ports, and protocols may connect. It limits lateral movement once a controller actually enforces it.

**How it works:**

- `podSelector` chooses the Pods. Ingress rules list who may connect in. Egress rules list where those Pods may connect out.
- A peer can be other Pods by label, another Namespace, or an IP block. Ports and protocols narrow the match.
- In the core API, once a policy selects a Pod for a direction, that direction becomes an allow list. Traffic no policy allows is dropped. Pods with no policy stay open.
- The objects do nothing until a plugin such as Calico or Cilium enforces them.
- Those plugins also add richer rules, including explicit deny. Cilium can match on application identity, not only IPs and ports.
- Add rules in small steps and test them. An ingress policy with no allow rule locks the Pod out.
- The policies document expected flows and give a review a concrete allow list.

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

Only Pods labeled `app=web` may open TCP 8080 to `app=api`. Other ingress is denied.
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
