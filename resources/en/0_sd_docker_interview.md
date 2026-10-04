# Docker — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [Docker — Interview](./0_sd_docker_interview.md)

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

Docker runs an application in a container: an isolated process that shares the host kernel. A virtual machine runs a full guest operating system on virtual hardware.

**How it works:**

- The engine is a daemon plus a client. Images live in a registry. A Dockerfile is the recipe, an image is the package, a container is a running instance.
- A VM includes a guest kernel, so it is heavier to boot and costs a slice of CPU and RAM even when idle.
- A container starts as a process. Isolation comes from Linux namespaces and resource limits, not from a second kernel.
- Images are built as layers, so a change often reuses the layers underneath.
- The same image runs on any host with a compatible engine, which is why build and production can match.
- Isolation is weaker than a VM: containers share the kernel, so a kernel bug is shared.
- Orchestrators such as Swarm or Kubernetes schedule many containers. Docker itself is the runtime, not the cluster manager.

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

A Docker image is an immutable package: the files, the runtime, and the start command needed to launch a container. It does not run by itself.

**How it works:**

- A container is a process started from that image, plus a writable layer for changes made while it runs.
- The image is a stack of layers. Each instruction in the Dockerfile adds a layer, and unchanged layers are reused from cache.
- The base layer is often a small distribution, or a distroless image that ships only the app and its libraries.
- Registries store images and tags so another machine can pull the same bytes.
- The payoff is portability and a repeatable start. The risk is a fat image that copies secrets or build tools into the final layer.

**Examples:**

```dockerfile
FROM python:3.12-slim
WORKDIR /srv
COPY app.py .
CMD ["python", "app.py"]
```
`docker build -t demo:1 .` produces the image. Nothing is listening until you create a container from it.
</details>

<details>
<summary>How does a Docker container differ from a Docker image?</summary>

### How does a Docker container differ from a Docker image?

**Definition:**

An image is a read-only template. A container is a running (or stopped) instance of that image, with its own writable layer and process state.

**How it works:**

- You can start many containers from one image. They share the image layers and differ in the writable layer.
- The image does not change when a container writes a file. The write lands in the container’s layer and disappears with the container unless you put it on a volume.
- Disk for a container is the image plus that writable layer, so logs left inside the container grow the container, not the image.
- Deleting the container does not delete the image. Deleting the image fails while a container still references it.

**Examples:**

`docker run --name a demo:1` and `docker run --name b demo:1` are two processes from one image. A file written in `a` is invisible in `b`.
</details>

<details>
<summary>What is the Docker Hub, and what is it used for?</summary>

### What is the Docker Hub, and what is it used for?

**Definition:**

Docker Hub is a hosted registry where you push and pull images, publicly or in a private repository.

**How it works:**

- A tag names a version, so you can pull `app:1.4` instead of whatever was built last Tuesday.
- Teams share one repository. Automated builds can rebuild an image when the linked source changes.
- Webhooks can kick a pipeline when a push lands. Scanning can flag known vulnerable packages in the image.
- Public images are how base images such as `postgres` and `node` are distributed. Private repositories are for images you do not want on the open internet.
- Hub is one registry. A company can run another, or use a cloud registry, with the same push and pull commands pointed at a different host.

**Examples:**

`docker pull postgres:16` fetches a public image. `docker push registry.example.com/billing:1.4` publishes your own.
</details>

<details>
<summary>Explain the Dockerfile and its significance in Docker.</summary>

### Explain the Dockerfile and its significance in Docker.

**Definition:**

A Dockerfile is the text recipe that builds an image. It is the reproducible path; committing a running container is not.

**How it works:**

- FROM chooses the base. RUN executes a command and records the filesystem change as a layer.
- COPY and ADD put files from the build context into the image. ENV sets variables. EXPOSE documents a port. It does not publish it.
- CMD is the default process. ENTRYPOINT is the fixed executable, with CMD as its default arguments.
- A multi-stage file builds in one stage and copies only the artifact into a slim final stage.
- Unchanged instructions are cached. A changed COPY invalidates every layer after it, so dependency installs belong before the source copy.
- Prefer a small base, chain related commands, and do not leave package caches in the layer.

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

Each Dockerfile instruction that changes the filesystem adds a layer. The image is those layers stacked by a union filesystem, and a container adds one writable layer on top.

**How it works:**

- Lower layers are read-only and shared by every container started from the image.
- A build cache hits when the instruction and its inputs match a previous build, so that layer is not rebuilt.
- A change invalidates that layer and every layer after it. Order the file so stable steps come first.
- Deleting a file in a later layer does not shrink the earlier layer that added it. The bytes are still in the image.

**Examples:**

```text
layer 1  FROM alpine
layer 2  RUN apk add --no-cache curl
layer 3  COPY app /app
container writable layer  (logs, temp files)
```
</details>

<details>
<summary>What’s the difference between the `COPY` and `ADD` commands in a Dockerfile?</summary>

### What’s the difference between the `COPY` and `ADD` commands in a Dockerfile?

**Definition:**

COPY puts files from the build context into the image. ADD does that and also unpacks a local tar archive and can fetch a remote URL. Prefer COPY unless you need the extra behavior.

**How it works:**

- COPY is explicit: what you name is what lands in the image.
- ADD extracts a local archive such as `app.tar.gz` into the destination directory.
- ADD can download an HTTP URL at build time. That hides a network dependency in the build and is a supply-chain risk.
- Both invalidate the cache when the copied source changes.
- For a URL, download it in a RUN step you control, or COPY a file already in the context.

**Examples:**

```dockerfile
COPY ./static /var/www/static
# ADD would also unpack this archive; COPY would store the .tar itself
ADD bundle.tar /opt/app
```
</details>

<details>
<summary>What’s the purpose of the `.dockerignore` file?</summary>

### What’s the purpose of the `.dockerignore` file?

**Definition:**

`.dockerignore` lists paths that must not be sent as part of the build context. Those files never reach the daemon and cannot be copied into the image.

**How it works:**

- The client sends the context before the first instruction runs. A huge `.git` or `node_modules` makes that upload slow.
- Ignoring them also keeps secrets, local env files, and tests out of a careless `COPY . .`.
- A changed ignored file does not bust the cache, because it was not an input.
- The syntax is similar to gitignore: patterns, and a leading `!` to re-include.

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

You can snapshot a container with `docker commit`, and you should usually rebuild from a Dockerfile instead. A commit captures whatever happened to drift inside the container.

**How it works:**

- `docker commit` turns the container’s writable layer plus the image under it into a new image.
- The result has no recipe. The next person cannot see which packages were installed by hand.
- The durable path is to write those steps into a Dockerfile and `docker build` again.
- Use commit for a one-off debug snapshot, not as the way images are produced.

**Examples:**

```text
docker commit web web:debug
# prefer:
docker build -t web:1.5 .
```
</details>

<details>
<summary>In practice, how do you reduce the size of Docker images?</summary>

### In practice, how do you reduce the size of Docker images?

**Definition:**

Image size drops when the final stage contains only the runtime files, and when earlier layers do not keep package caches.

**How it works:**

- Start FROM a small base, or a distroless image, instead of a full desktop distribution.
- Use a multi-stage build: compilers stay in the build stage, the final stage copies the binary.
- List junk in `.dockerignore` so it is never sent or copied.
- Combine install and cleanup in one RUN. A later RUN that deletes the cache does not remove the bytes from the earlier layer.
- Copy only the files the process needs, not the whole repository.

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

`docker run` creates a container from an image and starts its process. If the image is not local, the client pulls it first.

**How it works:**

- `docker create` only creates. `docker start` only starts an existing container. `docker run` does both.
- Flags publish ports (`-p`), set variables (`-e`), name the container (`--name`), and mount storage (`-v`).
- `-d` detaches. Without it, the container’s stdout stays attached to your terminal.
- `--rm` deletes the container when the process exits.
- A restart policy such as `unless-stopped` brings it back after a daemon restart. That is separate from creating it.

**Examples:**

`docker run -d --name api -p 8080:8080 -e APP_ENV=prod api:1.5`
</details>

<details>
<summary>Can you explain what a Docker namespace is and its benefits?</summary>

### Can you explain what a Docker namespace is and its benefits?

**Definition:**

Docker isolates a container with Linux namespaces: each container gets its own view of processes, network, mounts, hostname, and inter-process communication. Resource caps are a separate mechanism, cgroups.

**How it works:**

- The PID namespace means the container’s process 1 is not the host’s process 1, and it does not see other containers’ processes.
- The network namespace gives it its own interfaces and ports. The mount namespace gives it its own filesystem root.
- The UTS namespace gives it its own hostname. The IPC namespace isolates shared memory. A user namespace can map container root to an unprivileged host user.
- That isolation is what lets many containers share one kernel without sharing each other’s processes and files.
- Names and image ids are how you refer to objects. They are not the namespace feature that isolates the process.

**Examples:**

Two containers can both listen on port 80 inside their own network namespace. On the host those are two different addresses, published with `-p` if you want them reachable.
</details>

<details>
<summary>What is a Docker volume, and when would you use it?</summary>

### What is a Docker volume, and when would you use it?

**Definition:**

A volume is storage that outlives the container. Use it for anything that must survive a recreate: database files, uploads, or config you do not want baked into the image.

**How it works:**

- A named volume is managed by Docker and mounted into the container at a path you choose.
- A bind mount maps a host directory in. It is convenient in development and ties you to that host’s layout.
- A tmpfs mount keeps data in memory and drops it when the container stops.
- The container’s writable layer is the wrong place for a database: `docker rm` throws it away.
- Volumes are also how two containers share a directory without committing that data into an image.

**Examples:**

`docker run -v pgdata:/var/lib/postgresql/data postgres:16` keeps the data directory when this container is replaced.
</details>

<details>
<summary>Explain the use and significance of the `docker-compose` tool.</summary>

### Explain the use and significance of the `docker-compose` tool.

**Definition:**

Compose starts a group of containers from one file: their images, networks, volumes, and start order. It is how a multi-process app is described as one unit.

**How it works:**

- Each service is a container definition: image or build, ports, environment, and dependencies.
- Compose creates a network for the file, and services reach each other by service name.
- Volumes declared in the file survive `docker compose down` unless you ask to remove them.
- The same file is what a teammate runs, so the laptop stack matches the documented one.
- `docker compose up` builds and starts. `down` stops and removes the containers.

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

Yes. Containers on the default bridge can reach each other by IP address. They do not get automatic DNS names on that network.

**How it works:**

- The daemon attaches a new container to the `bridge` network unless you pick another.
- Each container has an address on that bridge, so `curl` to the other container’s IP works.
- Name lookup on the default bridge is not provided. The old `--link` flag did that and is obsolete.
- A user-defined bridge does DNS: one container calls the other by its container name.
- Publishing `-p` is for the host and the outside world. Containers on the same Docker network do not need published ports to talk to each other.

**Examples:**

```text
docker network create appnet
docker run -d --name api --network appnet api:1
docker run -d --name web --network appnet web:1
# inside web: curl http://api:8080
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
