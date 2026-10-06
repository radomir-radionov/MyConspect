import type { Locale } from "./locales";

/** Russian UI copy for catalog blurbs (EN catalog stays source of truth). */
const RU_BLURBS: Readonly<Record<string, string>> = {
  "2024+ CSS features and advanced phase-2 topics.":
    "Возможности CSS 2024+ и продвинутые темы phase-2.",
  "AAA and the test pyramid.": "AAA и пирамида тестов.",
  "AAA, pyramid, layers, practices, and tooling.":
    "AAA, пирамида, слои, практики и инструменты.",
  "AAA, the test pyramid, doubles, and Jest.":
    "AAA, пирамида тестов, doubles и Jest.",
  "AMQP exchanges, queues, routing, and task queues.":
    "AMQP exchanges, очереди, маршрутизация и task queues.",
  "Accessibility, SEO, and advanced APIs.":
    "Доступность, SEO и продвинутые API.",
  "ACID, CAP, transactions, and normalization.":
    "ACID, CAP, транзакции и нормализация.",
  "Agent Skills: SKILL.md, auto vs slash, and built-ins.":
    "Agent Skills: SKILL.md, auto vs slash и встроенные.",
  "Agent Skills: SKILL.md, auto vs slash, paths, and built-ins.":
    "Agent Skills: SKILL.md, auto vs slash, пути и встроенные.",
  "AI-first vs augmented, editors, Context7/Ref, and RTK.":
    "AI-first vs augmented, редакторы, Context7/Ref и RTK.",
  "Core tips, skills, rules, plugins, slash commands, and questions.":
    "Core tips, skills, rules, plugins, slash-команды и вопросы.",
  "Shortcuts, Run Modes, verification loops, and Cursor Directory.":
    "Шорткаты, Run Modes, циклы проверки и Cursor Directory.",
  "Algorithm basics and complexity analysis.":
    "Основы алгоритмов и анализ сложности.",
  "App Router, data, routing, and the Next.js platform.":
    "App Router, данные, маршрутизация и платформа Next.js.",
  "App Router, file-based routes, navigation, and metadata.":
    "App Router, файловые маршруты, навигация и metadata.",
  "App Router, file-based routes, navigation, metadata, and SEO.":
    "App Router, файловые маршруты, навигация, metadata и SEO.",
  "AWS, GCP, Azure, and managed infrastructure.":
    "AWS, GCP, Azure и managed-инфраструктура.",
  "AWS, GCP, and Azure.": "AWS, GCP и Azure.",
  "App types and security.": "Типы приложений и безопасность.",
  "Architecture, libraries, performance, and legacy.":
    "Архитектура, библиотеки, производительность и legacy.",
  "Architecture, patterns, and scaling.":
    "Архитектура, паттерны и масштабирование.",
  "Arrays, trees, graphs, heaps, and structure selection.":
    "Массивы, деревья, графы, кучи и выбор структуры.",
  "AuthN/AuthZ, sessions, JWT, OAuth, cookies, and storage.":
    "AuthN/AuthZ, сессии, JWT, OAuth, cookies и storage.",
  "Basic value types — string, number, boolean, arrays, any, null, undefined.":
    "Базовые типы значений — string, number, boolean, arrays, any, null, undefined.",
  "Best common type, contextual typing, and inference.":
    "Best common type, контекстная типизация и вывод типов.",
  "Big O and algorithm fundamentals.": "Big O и основы алгоритмов.",
  "Broker fundamentals and selection.":
    "Основы брокеров сообщений и выбор решения.",
  "Broker fundamentals, queue vs log, and broker selection.":
    "Основы брокеров, queue vs log и выбор брокера.",
  "Big O, common algorithms, and interview patterns.":
    "Big O, типовые алгоритмы и паттерны для собеседований.",
  "Binary trees, BFS/DFS traversal, graph representations, and tries for prefix search — including recursive vs iterative trade-offs.":
    "Бинарные деревья, обход BFS/DFS, представления графов и trie для поиска по префиксу — с recursive vs iterative подходами.",
  "Branches, merges, remotes, and collaboration.":
    "Ветки, merge, remote и совместная работа.",
  "Branches, remotes, and team practices.":
    "Ветки, remote и командные практики.",
  "Browser security, Core Web Vitals, and integrations.":
    "Безопасность браузера, Core Web Vitals и интеграции.",
  "Browser security and third-party integrations.":
    "Безопасность браузера и сторонние интеграции.",
  "Bundlers, CI, Docker, and delivery.": "Бандлеры, CI, Docker и доставка.",
  "Call signatures, overloads, and this typing.":
    "Сигнатуры вызова, перегрузки и типизация this.",
  "Cascade, layout, visual design, and CSS architecture.":
    "Каскад, вёрстка, визуальный дизайн и архитектура CSS.",
  "Cascade, selectors, and the box model.":
    "Каскад, селекторы и блочная модель.",
  "child_process, cluster, workers, and real-time servers.":
    "child_process, cluster, workers и realtime-серверы.",
  "CI/CD, package managers, and task runners.":
    "CI/CD, менеджеры пакетов и task runners.",
  "CI/CD, packages, and bundlers.": "CI/CD, пакеты и бандлеры.",
  "Cache, sessions, data structures, and TTL.":
    "Кэш, сессии, структуры данных и TTL.",
  "Cloud fundamentals and provider comparison.":
    "Основы облаков и сравнение провайдеров.",
  "Coding tasks and live-coding challenges.":
    "Задачи по коду и live-coding challenges.",
  "Column-store OLAP, analytics, and fast aggregates.":
    "Column-store OLAP, аналитика и быстрые агрегаты.",
  "Compiler directives, ambient declarations, and declare.":
    "Директивы компилятора, ambient declarations и declare.",
  "Compose classes from partial building blocks.":
    "Композиция классов из частичных building blocks.",
  "Compute Engine, Cloud Storage, Cloud SQL, Cloud Run, Pub/Sub.":
    "Compute Engine, Cloud Storage, Cloud SQL, Cloud Run и Pub/Sub.",
  "Components, hooks, server rendering, and ecosystem.":
    "Компоненты, хуки, серверный рендеринг и экосистема.",
  "Composition, MVC, layers/DDD, data flow, and frontend structure.":
    "Композиция, MVC, слои/DDD, поток данных и структура фронтенда.",
  "Control-flow analysis and type guards.":
    "Анализ потока управления и type guards.",
  "Crawlability, metadata, and structured data.":
    "Crawlability, метаданные и structured data.",
  "Cursor and Agent plugin formats and marketplaces.":
    "Форматы плагинов Cursor и Agent и маркетплейсы.",
  "Cursor and Agent plugin formats, MCP, and marketplaces.":
    "Форматы плагинов Cursor и Agent, MCP и маркетплейсы.",
  "Data, caching, and infrastructure building blocks.":
    "Данные, кэширование и строительные блоки инфраструктуры.",
  "Declarations, arrows, this, higher-order functions, and bind.":
    "Объявления, стрелки, this, функции высшего порядка и bind.",
  "Delivery architecture, Nginx, brokers, and DX tools.":
    "Архитектура доставки, Nginx, брокеры и DX-инструменты.",
  "Deploy topology and where HTML is built.":
    "Топология деплоя и где собирается HTML.",
  "Docker and infrastructure.": "Docker и инфраструктура.",
  "Document skeleton, metadata, elements, and attributes.":
    "Каркас документа, метаданные, элементы и атрибуты.",
  "Document structure, semantics, rendering, forms, a11y, and SEO.":
    "Структура документа, семантика, рендеринг, формы, a11y и SEO.",
  "Document structure, semantics, rendering, forms, a11y, UX/UI, and SEO.":
    "Структура документа, семантика, рендеринг, формы, a11y, UX/UI и SEO.",
  "Documents, aggregation, and Mongoose.": "Документы, агрегации и Mongoose.",
  "Document, events, and extra browser APIs.":
    "Document, события и дополнительные браузерные API.",
  "DOM tree, querying, mutation, BOM, and script loading.":
    "DOM-дерево, поиск, мутации, BOM и загрузка скриптов.",
  "EC2, S3, RDS, Lambda, SQS, and common AWS services.":
    "EC2, S3, RDS, Lambda, SQS и типовые сервисы AWS.",
  "ES modules, CommonJS, resolution, and module emit targets.":
    "ES modules, CommonJS, resolution и цели emit модулей.",
  "ES modules, import/export, and module resolution.":
    "ES modules, import/export и module resolution.",
  "Don't Repeat Yourself, Keep It Simple, You Aren't Gonna Need It.":
    "Не повторяйся, держи простоту, тебе это не понадобится (DRY, KISS, YAGNI).",
  "Editor and browser developer tools.":
    "Редактор и инструменты разработчика в браузере.",
  "Event loop, promises, and fetch.": "Event loop, промисы и fetch.",
  "Express, auth, validation, Koa, NestJS, and runtime choice.":
    "Express, auth, валидация, Koa, NestJS и выбор рантайма.",
  "Express, NestJS, auth, and validation.":
    "Express, NestJS, auth и валидация.",
  "Expressions, operators, comparisons, control flow, try/catch, and iterators.":
    "Выражения, операторы, сравнения, control flow, try/catch и итераторы.",
  "Fetching, caching, and Server Actions.":
    "Запросы, кэширование и Server Actions.",
  "Fetching, caching, revalidation, Server Actions, and Route Handlers.":
    "Запросы, кэш, revalidation, Server Actions и Route Handlers.",
  "File-based routes, special files, navigation, metadata, and SEO.":
    "Файловые маршруты, special files, навигация, metadata и SEO.",
  "Flexbox, grid, and responsive design.":
    "Flexbox, grid и адаптивная вёрстка.",
  "Flexbox, grid, positioning, responsive design, and mobile viewport.":
    "Flexbox, grid, позиционирование, адаптив и mobile viewport.",
  "Form controls, validation, dialog, and accessible form patterns.":
    "Элементы форм, валидация, dialog и доступные паттерны форм.",
  "Foundations and distributed systems.": "Основы и распределённые системы.",
  "Foundations and distributed-systems basics.":
    "Основы и база распределённых систем.",
  "Foundations and SQL.": "Основы и SQL.",
  "Fields, visibility, inheritance, implements, and abstract classes.":
    "Поля, видимость, наследование, implements и абстрактные классы.",
  "Framework model, App Router, and design principles.":
    "Модель фреймворка, App Router и принципы проектирования.",
  "Framework model, rendering, and streaming.":
    "Модель фреймворка, рендеринг и streaming.",
  "Function types, generics, parameters, overloads, and this.":
    "Типы функций, дженерики, параметры, перегрузки и this.",
  "Rendering strategies, Server/Client boundaries, and streaming.":
    "Стратегии рендеринга, границы Server/Client и потоковая передача.",
  "Framework model and design principles.":
    "Модель фреймворка и принципы проектирования.",
  "Generics, type operators, and utility types.":
    "Дженерики, type operators и utility types.",
  "Generics, keyof, typeof, conditional and mapped types.":
    "Дженерики, keyof, typeof, conditional и mapped types.",
  "Git, tooling, and adjacent topics.": "Git, тулинг и смежные темы.",
  "Handbook, language reference, and typing JavaScript.":
    "Справочник, language reference и типизация JavaScript.",
  "IaaS/PaaS/SaaS, regions, shared responsibility, and provider comparison.":
    "IaaS/PaaS/SaaS, регионы, shared responsibility и сравнение провайдеров.",
  "Integration, system, E2E, visual, performance, and security testing.":
    "Интеграционное, системное, E2E, визуальное, performance и security-тестирование.",
  "Integration, system, E2E, visual, performance, security.":
    "Интеграционное, системное, E2E, визуальное, performance и security.",
  "Interface, namespace, class, and enum merging.":
    "Слияние interface, namespace, class и enum.",
  "GoF creational, structural, and behavioral patterns.":
    "Порождающие, структурные и поведенческие паттерны GoF.",
  "Handlers, bubbling, capturing, delegation, and custom events.":
    "Обработчики, bubbling, capturing, делегирование и custom events.",
  "Hash tables for average O(1) lookup, binary heaps for dynamic min/max, and how the DOM maps to trees and node lists.":
    "Хеш-таблицы для среднего O(1) lookup, бинарные кучи для динамического min/max и как DOM сопоставляется с деревьями и node lists.",
  "Hooks reference and escape hatches.": "Справочник хуков и escape hatches.",
  "How `/` works and the most-used built-ins.":
    "Как работает `/` и самые частые встроенные команды.",
  "How `/` works, custom commands, and the most-used built-ins.":
    "Как работает `/`, кастомные команды и самые частые встроенные.",
  "How CSS is added, cascade, selectors, and the box model.":
    "Как подключают CSS, каскад, селекторы и блочная модель.",
  "Components, Composition API, reactivity, SSR, and ecosystem.":
    "Компоненты, Composition API, реактивность, SSR и экосистема.",
  "Composition API, composables, and script setup.":
    "Composition API, composables и script setup.",
  "File-based routing, data fetching, Nitro, and the Nuxt platform.":
    "Файловая маршрутизация, загрузка данных, Nitro и платформа Nuxt.",
  "File-based routes, layouts, middleware, and SEO.":
    "Файловые маршруты, layouts, middleware и SEO.",
  "HTML, CSS, JavaScript, React, Next.js, TypeScript, Web APIs, and Vue & Nuxt.":
    "HTML, CSS, JavaScript, React, Next.js, TypeScript, Web API и Vue & Nuxt.",
  "Vue library and Nuxt meta-framework: components, Composition API, SSR, routing, and Nitro.":
    "Библиотека Vue и meta-framework Nuxt: компоненты, Composition API, SSR, маршрутизация и Nitro.",
  "HTML, CSS, JavaScript, React, TypeScript, and browser APIs.":
    "HTML, CSS, JavaScript, React, TypeScript и браузерные API.",
  "Library model, templates, reactivity, and Composition API.":
    "Модель библиотеки, шаблоны, реактивность и Composition API.",
  "Library model, templates, reactivity, and state.":
    "Модель библиотеки, шаблоны, реактивность и state.",
  "Nitro, modules, config, deployment, and debugging.":
    "Nitro, модули, config, деплой и отладка.",
  "Router, Pinia, Vite, performance, and migration.":
    "Router, Pinia, Vite, производительность и миграция.",
  "Server rendering, hydration, and Vue 3.5+ features.":
    "Серверный рендеринг, гидратация и возможности Vue 3.5+.",
  "useFetch, useAsyncData, and server routes.":
    "useFetch, useAsyncData и server routes.",
  "useFetch, useAsyncData, caching, and server routes.":
    "useFetch, useAsyncData, кэширование и server routes.",
  "HTTP, HTTPS, TLS, caching, CORS, and URL anatomy.":
    "HTTP, HTTPS, TLS, кэширование, CORS и устройство URL.",
  "HTTP, REST, auth, real-time, and browser security.":
    "HTTP, REST, auth, realtime и безопасность в браузере.",
  "Images, containers, Compose, and container lifecycle.":
    "Образы, контейнеры, Compose и жизненный цикл контейнера.",
  "Images, picture, audio, video, canvas, and SVG.":
    "Images, picture, audio, video, canvas и SVG.",
  "Indexed collections and array methods — map, filter, reduce.":
    "Индексированные коллекции и методы массивов — map, filter, reduce.",
  "Index-based arrays, LIFO stacks, FIFO queues, unique sets, and key–value maps — with Big-O costs and JavaScript gotchas like O(n) array.shift().":
    "Массивы с индексным доступом, LIFO-стеки, FIFO-очереди, множества и key–value map — со сложностью Big-O и JS-подводными камнями вроде O(n) array.shift().",
  "Interfaces, object types, classes, and OOP.":
    "Интерфейсы, object types, классы и ООП.",
  "Internet stack and HTTP.": "Интернет-стек и HTTP.",
  "Internet, DNS, and how the web stack fits together.":
    "Интернет, DNS и как складывается веб-стек.",
  "HTML interview questions, answers not filled in.":
    "Вопросы по HTML, ответы не заполнены.",
  "CSS interview questions, answers not filled in.":
    "Вопросы по CSS, ответы не заполнены.",
  "JavaScript interview questions, answers not filled in.":
    "Вопросы по JavaScript, ответы не заполнены.",
  "Next.js interview questions, answers not filled in.":
    "Вопросы по Next.js, ответы не заполнены.",
  "React interview questions, answers not filled in.":
    "Вопросы по React, ответы не заполнены.",
  "TypeScript interview questions, answers not filled in.":
    "Вопросы по TypeScript, ответы не заполнены.",
  "Interview Q&A and coding tasks.": "Вопросы/ответы и задачи по коду.",
  "Git interview questions, answers not filled in.":
    "Вопросы по Git, ответы не заполнены.",
  "Testing interview questions, answers not filled in.":
    "Вопросы по тестированию, ответы не заполнены.",
  "WebSocket interview questions, answers not filled in.":
    "Вопросы по WebSockets, ответы не заполнены.",
  "PWA interview questions, answers not filled in.":
    "Вопросы по PWA, ответы не заполнены.",
  "Redux interview questions, answers not filled in.":
    "Вопросы по Redux, ответы не заполнены.",
  "Express.js interview questions, answers not filled in.":
    "Вопросы по Express.js, ответы не заполнены.",
  "OOP interview questions, answers not filled in.":
    "Вопросы по OOP, ответы не заполнены.",
  "Web security interview questions, answers not filled in.":
    "Вопросы по веб-безопасности, ответы не заполнены.",
  "Interview Q&A for build and CI.": "Вопросы/ответы по build и CI.",
  "SQL interview questions, answers not filled in.":
    "Вопросы по SQL, ответы не заполнены.",
  "Interview Q&A for HTTP and Web APIs.": "Вопросы/ответы по HTTP и Web API.",
  "Node.js interview questions, answers not filled in.":
    "Вопросы по Node.js, ответы не заполнены.",
  "Go interview questions, answers not filled in.":
    "Вопросы по Go, ответы не заполнены.",
  "DevOps interview questions, answers not filled in.":
    "Вопросы по DevOps, ответы не заполнены.",
  "API Design interview questions, answers not filled in.":
    "Вопросы по API Design, ответы не заполнены.",
  "Databases interview questions, answers not filled in.":
    "Вопросы по Databases, ответы не заполнены.",
  "Microservices interview questions, answers not filled in.":
    "Вопросы по Microservices, ответы не заполнены.",
  "Availability & Reliability interview questions, answers not filled in.":
    "Вопросы по Availability & Reliability, ответы не заполнены.",
  "Docker interview questions, answers not filled in.":
    "Вопросы по Docker, ответы не заполнены.",
  "NoSQL interview questions, answers not filled in.":
    "Вопросы по NoSQL, ответы не заполнены.",
  "Caching interview questions, answers not filled in.":
    "Вопросы по Caching, ответы не заполнены.",
  "Domain-Driven Design interview questions, answers not filled in.":
    "Вопросы по Domain-Driven Design, ответы не заполнены.",
  "Reactive Systems interview questions, answers not filled in.":
    "Вопросы по Reactive Systems, ответы не заполнены.",
  "CAP Theorem interview questions, answers not filled in.":
    "Вопросы по CAP Theorem, ответы не заполнены.",
  "Kubernetes interview questions, answers not filled in.":
    "Вопросы по Kubernetes, ответы не заполнены.",
  "SOA interview questions, answers not filled in.":
    "Вопросы по SOA, ответы не заполнены.",
  "Concurrency interview questions, answers not filled in.":
    "Вопросы по Concurrency, ответы не заполнены.",
  "Layering & Middleware interview questions, answers not filled in.":
    "Вопросы по Layering & Middleware, ответы не заполнены.",
  "Software Architecture interview questions, answers not filled in.":
    "Вопросы по Software Architecture, ответы не заполнены.",
  "Cryptography interview questions, answers not filled in.":
    "Вопросы по Cryptography, ответы не заполнены.",
  "Load Balancing interview questions, answers not filled in.":
    "Вопросы по Load Balancing, ответы не заполнены.",
  "XML interview questions, answers not filled in.":
    "Вопросы по XML, ответы не заполнены.",
  "Arrays interview questions, answers not filled in.":
    "Вопросы по Arrays, ответы не заполнены.",
  "Divide & Conquer interview questions, answers not filled in.":
    "Вопросы по Divide & Conquer, ответы не заполнены.",
  "Hash Tables interview questions, answers not filled in.":
    "Вопросы по Hash Tables, ответы не заполнены.",
  "Sorting Algorithms interview questions, answers not filled in.":
    "Вопросы по Sorting Algorithms, ответы не заполнены.",
  "Stacks interview questions, answers not filled in.":
    "Вопросы по Stacks, ответы не заполнены.",
  "Heaps and Maps interview questions, answers not filled in.":
    "Вопросы по Heaps and Maps, ответы не заполнены.",
  "Dynamic Programming interview questions, answers not filled in.":
    "Вопросы по Dynamic Programming, ответы не заполнены.",
  "Big-O Notation interview questions, answers not filled in.":
    "Вопросы по Big-O Notation, ответы не заполнены.",
  "Binary Tree interview questions, answers not filled in.":
    "Вопросы по Binary Tree, ответы не заполнены.",
  "Fibonacci Sequence interview questions, answers not filled in.":
    "Вопросы по Fibonacci Sequence, ответы не заполнены.",
  "Linked Lists interview questions, answers not filled in.":
    "Вопросы по Linked Lists, ответы не заполнены.",
  "Strings interview questions, answers not filled in.":
    "Вопросы по Strings, ответы не заполнены.",
  "Tree Data Structure interview questions, answers not filled in.":
    "Вопросы по Tree Data Structure, ответы не заполнены.",
  "Queues interview questions, answers not filled in.":
    "Вопросы по Queues, ответы не заполнены.",
  "Bit Manipulation interview questions, answers not filled in.":
    "Вопросы по Bit Manipulation, ответы не заполнены.",
  "Graph Theory interview questions, answers not filled in.":
    "Вопросы по Graph Theory, ответы не заполнены.",
  "Recursion interview questions, answers not filled in.":
    "Вопросы по Recursion, ответы не заполнены.",
  "Trie interview questions, answers not filled in.":
    "Вопросы по Trie, ответы не заполнены.",
  "Searching Algorithms interview questions, answers not filled in.":
    "Вопросы по Searching Algorithms, ответы не заполнены.",
  "Greedy Algorithms interview questions, answers not filled in.":
    "Вопросы по Greedy Algorithms, ответы не заполнены.",
  "Blockchain interview questions, answers not filled in.":
    "Вопросы по Blockchain, ответы не заполнены.",
  "Backtracking interview questions, answers not filled in.":
    "Вопросы по Backtracking, ответы не заполнены.",
  "Genetic Algorithms interview questions, answers not filled in.":
    "Вопросы по Genetic Algorithms, ответы не заполнены.",
  "Hadoop interview questions, answers not filled in.":
    "Вопросы по Hadoop, ответы не заполнены.",
  "Linear Algebra interview questions, answers not filled in.":
    "Вопросы по Linear Algebra, ответы не заполнены.",
  "Probability interview questions, answers not filled in.":
    "Вопросы по Probability, ответы не заполнены.",
  "Scala interview questions, answers not filled in.":
    "Вопросы по Scala, ответы не заполнены.",
  "Redis interview questions, answers not filled in.":
    "Вопросы по Redis, ответы не заполнены.",
  "React Native interview questions, answers not filled in.":
    "Вопросы по React Native, ответы не заполнены.",
  "Reactive Programming interview questions, answers not filled in.":
    "Вопросы по Reactive Programming, ответы не заполнены.",
  "Apache Spark interview questions, answers not filled in.":
    "Вопросы по Apache Spark, ответы не заполнены.",
  "Data Structures interview questions, answers not filled in.":
    "Вопросы по Data Structures, ответы не заполнены.",
  "Q&A for algorithms.": "Вопросы/ответы по алгоритмам.",
  "Q&A for data structures.": "Вопросы/ответы по структурам данных.",
  "Interview Q&A for system design.": "Вопросы/ответы по system design.",
  "Intl, RegExp, Signals (TC39), and eval.":
    "Intl, RegExp, Signals (TC39) и eval.",
  "JSX in .tsx, intrinsic elements, and component typing.":
    "JSX в .tsx, intrinsic elements и типизация компонентов.",
  "Jakob, Fitts, Hick, Miller, Postel, and related cognitive effects.":
    "Jakob, Fitts, Hick, Miller, Postel и связанные когнитивные эффекты.",
  "Jest, Vitest, RTL, MSW, and code coverage.":
    "Jest, Vitest, RTL, MSW и code coverage.",
  "Jest, Vitest, RTL, MSW, and coverage.": "Jest, Vitest, RTL, MSW и coverage.",
  "Intl, RegExp, Signals, and other extras.":
    "Intl, RegExp, Signals и другие дополнения.",
  "Kafka, RabbitMQ, NATS, and async messaging patterns.":
    "Kafka, RabbitMQ, NATS и паттерны асинхронного messaging.",
  "Kafka, RabbitMQ, and NATS.": "Kafka, RabbitMQ и NATS.",
  "Landmarks, headings, lists, and phrasing elements that carry meaning.":
    "Landmarks, заголовки, списки и phrasing-элементы со смыслом.",
  "Legacy namespace organization and ambient declarations.":
    "Legacy namespace organization и ambient declarations.",
  "Loading metrics, resource hints, and browser performance APIs.":
    "Метрики загрузки, resource hints и browser performance API.",
  "Language reference and advanced topics.":
    "Справочник по языку и продвинутые темы.",
  "Language reference.": "Справочник по языку.",
  "Language, browser APIs, and extra runtime topics.":
    "Язык, браузерные API и дополнительные темы рантайма.",
  "Language, data types & variables, operators, arrays, functions, and classes.":
    "Язык, типы данных и переменные, операторы, массивы, функции и классы.",
  "Library model, rendering, JSX, and state.":
    "Модель библиотеки, рендеринг, JSX и state.",
  "Library model, rendering, JSX, state, and hooks.":
    "Модель библиотеки, рендеринг, JSX, state и хуки.",
  "Methodologies, tooling, and rendering performance.":
    "Методологии, тулинг и производительность рендеринга.",
  "Match access patterns to the right structure, then study linear collections, trees and graphs, and hash-based lookup with heaps.":
    "Сопоставьте паттерны доступа со структурой, затем изучите линейные коллекции, деревья и графы, а также hash lookup и кучи.",
  "MongoDB, Redis, Elasticsearch, and store selection.":
    "MongoDB, Redis, Elasticsearch и выбор хранилища.",
  "MongoDB, Redis, and ClickHouse.": "MongoDB, Redis и ClickHouse.",
  "NoSQL types, selection matrix, and Elasticsearch.":
    "Типы NoSQL, матрица выбора и Elasticsearch.",
  "Numeric and string enums, const enums, and as const alternatives.":
    "Числовые и строковые enum, const enum и альтернативы as const.",
  "Nine patterns for assigning responsibilities to objects.":
    "Девять паттернов назначения ответственности объектам.",
  "Node.js and databases.": "Node.js и базы данных.",
  "Node.js, databases, message brokers, and cloud services.":
    "Node.js, базы данных, брокеры сообщений и облачные сервисы.",
  "NoSQL, ORM, and query builders.": "NoSQL, ORM и query builders.",
  "Object shapes, interfaces, optional properties, and tuples.":
    "Формы объектов, interfaces, optional properties и tuples.",
  "Object shapes, optional and readonly properties, index signatures, tuples.":
    "Формы объектов, optional и readonly properties, index signatures и tuples.",
  "Objects, classes, generics, and utilities.":
    "Объекты, классы, дженерики и утилиты.",
  "Partial, Pick, Omit, Record, ReturnType, and built-in utilities.":
    "Partial, Pick, Omit, Record, ReturnType и встроенные utility types.",
  "Objects, commits, and everyday workflow.":
    "Объекты, коммиты и повседневный workflow.",
  "OOP pillars and the five SOLID principles for modules and APIs.":
    "Столпы ООП и пять принципов SOLID для модулей и API.",
  "OOP, SOLID, DRY, KISS, YAGNI, and GRASP.":
    "ООП, SOLID, DRY, KISS, YAGNI и GRASP.",
  "Images, fonts, scripts, bundling, and Core Web Vitals.":
    "Изображения, шрифты, скрипты, бандлинг и Core Web Vitals.",
  "Proxy, config, Vercel, migration, and debugging.":
    "Прокси, конфиг, Vercel, миграция и отладка.",
  "Package managers, CommonJS/ESM, and built-in modules.":
    "Менеджеры пакетов, CommonJS/ESM и встроенные модули.",
  "Packages, CommonJS/ESM, and built-in APIs.":
    "Пакеты, CommonJS/ESM и встроенные API.",
  "POUR, names, landmarks, forms, and images.":
    "POUR, имена, landmarks, формы и изображения.",
  "Primitives, coercion, stack/heap, collections, JSON, bindings, scope, and closures.":
    "Примитивы, coercion, stack/heap, коллекции, JSON, bindings, scope и closures.",
  "Prisma, Sequelize, Knex, Drizzle, and query builders.":
    "Prisma, Sequelize, Knex, Drizzle и query builders.",
  "Process management.": "Управление процессами.",
  "Processes, SSH, Unix jobs, and OpenTelemetry.":
    "Процессы, SSH, Unix jobs и OpenTelemetry.",
  "Product judgment versus architecture.":
    "Продуктовое суждение versus архитектура.",
  "Production patterns.": "Продакшен-паттерны.",
  "Project, user, team rules, AGENTS.md, and apply modes.":
    "Project, user, team rules, AGENTS.md и режимы применения.",
  "Project, user, team rules, and AGENTS.md.":
    "Project, user, team rules и AGENTS.md.",
  "Protocols, real-time, and types of web apps.":
    "Протоколы, realtime и типы веб-приложений.",
  "Prototypes, classes, and object patterns.":
    "Прототипы, классы и объектные паттерны.",
  "Python language notes.": "Заметки по языку Python.",
  "Q&A and coding tasks.": "Вопросы/ответы и задачи по коду.",
  "Q&A and oral questions.": "Вопросы/ответы и устные вопросы.",
  "Quick-reference cards and interview memorization checklist.":
    "Карточки quick-reference и чеклист для запоминания на собеседовании.",
  "Q&A and leftover tooling notes that still sit outside subject interviews.":
    "Вопросы/ответы и оставшиеся заметки по тулингу вне subject-интервью.",
  "Q&A and shell appendix.": "Вопросы/ответы и shell-приложение.",
  "Q&A and type challenges.": "Вопросы/ответы и type challenges.",
  "Q&A for build and CI.": "Вопросы/ответы по build и CI.",
  "Q&A for Cursor skills, rules, plugins, and slash commands.":
    "Вопросы/ответы по Cursor skills, rules, плагинам и slash-командам.",
  "Q&A for Cursor skills, rules, plugins, and slash.":
    "Вопросы/ответы по Cursor skills, rules, плагинам и slash.",
  "Q&A for databases.": "Вопросы/ответы по базам данных.",
  "Q&A for HTTP and Web APIs.": "Вопросы/ответы по HTTP и Web API.",
  "Q&A for Node.js.": "Вопросы/ответы по Node.js.",
  "Q&A for system design.": "Вопросы/ответы по system design.",
  "React 19 APIs, SSR, and React Server Components.":
    "API React 19, SSR и React Server Components.",
  "Redux Toolkit, global client state, and RTK Query.":
    "Redux Toolkit, глобальный client state и RTK Query.",
  "Routing, libraries, performance, and legacy.":
    "Маршрутизация, библиотеки, производительность и legacy.",
  "React 19, SSR, and React Server Components.":
    "React 19, SSR и React Server Components.",
  "Recovery, team practices, hooks, and advanced Git.":
    "Восстановление, командные практики, hooks и продвинутый Git.",
  "Rendering pipeline and performance.":
    "Пайплайн рендеринга и производительность.",
  "Replication, sharding, caching, and OLTP scaling.":
    "Репликация, шардинг, кэширование и масштабирование OLTP.",
  "REST, RPC, auth, and storage.": "REST, RPC, auth и хранилище.",
  "REST, XML, SOAP, RPC, tRPC, and how they differ.":
    "REST, XML, SOAP, RPC, tRPC и чем они отличаются.",
  "Routing and platform.": "Маршрутизация и платформа.",
  "Runtime and modules — types, bindings, and control flow live in sibling Core topics.":
    "Рантайм и модули — типы, bindings и control flow в соседних темах Core.",
  "Runtime, HTTP servers, and process management.":
    "Рантайм, HTTP-серверы и управление процессами.",
  "Script loading, resource hints, Core Web Vitals, and FOUC.":
    "Загрузка скриптов, resource hints, Core Web Vitals и FOUC.",
  "Security model and common web attacks.":
    "Модель безопасности и типичные веб-атаки.",
  "Skills, rules, plugins, slash commands, and questions.":
    "Skills, rules, плагины, slash-команды и вопросы.",
  "Skills, rules, plugins, slash commands, and Cursor Q&A.":
    "Skills, rules, plugins, slash-команды и Q&A по Cursor.",
  "Soft-skill and HR interview questions with answer frameworks, traps, and sample answers.":
    "Soft-skill и HR-вопросы на собеседовании с фреймворками ответов, ловушками и примерами.",
  "Behavior questions": "Поведенческие вопросы",
  "Sorting, search, and graph algorithms.":
    "Сортировка, поиск и алгоритмы на графах.",
  "Sorting, search, graph traversal, and classic algorithm choices.":
    "Сортировка, поиск, обход графа и классический выбор алгоритмов.",
  "SQL language, schema, joins, objects, indexes, and PostgreSQL.":
    "Язык SQL, схема, joins, объекты, индексы и PostgreSQL.",
  "SQL, NoSQL, ORMs, and production data patterns.":
    "SQL, NoSQL, ORM и продакшен-паттерны работы с данными.",
  "Stage 2 and stage 3 decorators for classes and members.":
    "Stage 2 и stage 3 decorators для классов и членов.",
  "Static type-checking, compiler, tsconfig, and intro for JS programmers.":
    "Статическая проверка типов, компилятор, tsconfig и введение для JS-разработчиков.",
  "Static typing, tsconfig, and everyday types.":
    "Статическая типизация, tsconfig и повседневные типы.",
  "Structural subtyping, assignability, and variance.":
    "Структурная подтипизация, assignability и variance.",
  "Subjects, pub/sub, request-reply, and JetStream.":
    "Subjects, pub/sub, request-reply и JetStream.",
  "Symbol.iterator, iterables, generators, and for..of.":
    "Symbol.iterator, iterables, generators и for..of.",
  "Static typing, tsconfig, narrowing, and functions.":
    "Статическая типизация, tsconfig, сужение типов и функции.",
  "Storage, CORS, observers, History, URL, files, and UI timing.":
    "Storage, CORS, observers, History, URL, файлы и UI timing.",
  "Structure, semantics, forms, and media.":
    "Структура, семантика, формы и медиа.",
  "Styles, app structure, design patterns, data, and infra.":
    "Стили, структура приложения, паттерны, данные и инфра.",
  "TDD, BDD, doubles, and making tests easy.":
    "TDD, BDD, doubles и упрощение тестов.",
  "TDD, BDD, test doubles, and making tests easy.":
    "TDD, BDD, test doubles и упрощение тестов.",
  "TanStack Query, Router, Table, Virtual, Form, and ecosystem tools.":
    "TanStack Query, Router, Table, Virtual, Form и инструменты экосистемы.",
  "Topics, partitions, consumer groups, and event streaming.":
    "Topics, partitions, consumer groups и event streaming.",
  "Transforms, transitions, animations, and visual effects.":
    "Transforms, transitions, анимации и визуальные эффекты.",
  "Transpilers, bundling concepts, bundlers, and code quality.":
    "Транспилеры, идеи бандлинга, бандлеры и качество кода.",
  "Two pointers, sliding window, and greedy vs DP decisions.":
    "Two pointers, sliding window и решения greedy vs DP.",
  "Two pointers, sliding window, and greedy vs DP.":
    "Two pointers, sliding window и greedy vs DP.",
  "Types, compiler, generics, and typing JavaScript.":
    "Типы, компилятор, дженерики и типизация JavaScript.",
  "Unique primitive keys and unique symbol types.":
    "Уникальные примитивные ключи и unique symbol types.",
  "VMs, Blob Storage, Azure SQL, Functions, and Service Bus.":
    "VMs, Blob Storage, Azure SQL, Functions и Service Bus.",
  "Visual hierarchy, consistency, spacing, feedback, and accessibility.":
    "Визуальная иерархия, консистентность, отступы, feedback и доступность.",
  "Typography, color, decoration, form styling, and print.":
    "Типографика, цвет, декорация, стили форм и печать.",
  "URL to pixels: parse, CSSOM, render tree, layout, paint, composite.":
    "От URL к пикселям: parse, CSSOM, render tree, layout, paint, composite.",
  "V8, event loop, streams, buffers, and runtime fundamentals.":
    "V8, event loop, стримы, буферы и основы рантайма.",
  "V8, streams, and runtime fundamentals.": "V8, стримы и основы рантайма.",
  "Version control, history, and collaboration.":
    "Контроль версий, история и совместная работа.",
  "Visual, motion, modern CSS, and architecture.":
    "Визуал, motion, современный CSS и архитектура.",
  "Waterfall, Agile, Scrum, and Kanban.": "Waterfall, Agile, Scrum и Kanban.",
  "Web components, shadow DOM, and newer HTML APIs.":
    "Web components, shadow DOM и новые HTML API.",
  "What computation is, plus programming paradigms and logic programming.":
    "Что такое вычисления, парадигмы программирования и логическое программирование.",
  "When to use ES modules vs legacy namespaces.":
    "Когда использовать ES modules vs legacy namespaces.",
  "var vs let vs const and destructuring with types.":
    "var vs let vs const и деструктуризация с типами.",
  "Working with coding agents and docs tools.":
    "Работа с кодинг-агентами и инструментами документации.",
  Conspect: "Конспект",
  Interviews: "Собеседования",
};

/** Return localized catalog blurb; falls back to English when RU is missing. */
export function catalogBlurb(locale: Locale, english: string): string {
  if (locale === "en") {
    return english;
  }
  return RU_BLURBS[english] ?? english;
}
