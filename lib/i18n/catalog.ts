import type { Locale } from "./locales";

/** Russian UI copy for catalog blurbs (EN catalog stays source of truth). */
const RU_BLURBS: Readonly<Record<string, string>> = {
  "2024+ CSS features and advanced phase-2 topics.":
    "Возможности CSS 2024+ и продвинутые темы phase-2.",
  "AAA, the test pyramid, doubles, and Jest.":
    "AAA, пирамида тестов, doubles и Jest.",
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
  "App types and security.": "Типы приложений и безопасность.",
  "Architecture, libraries, performance, and legacy.":
    "Архитектура, библиотеки, производительность и legacy.",
  "Architecture, patterns, and scaling.":
    "Архитектура, паттерны и масштабирование.",
  "Arrays, trees, graphs, heaps, and structure selection.":
    "Массивы, деревья, графы, кучи и выбор структуры.",
  "AuthN/AuthZ, sessions, JWT, OAuth, cookies, and storage.":
    "AuthN/AuthZ, сессии, JWT, OAuth, cookies и storage.",
  "Big O and algorithm fundamentals.": "Big O и основы алгоритмов.",
  "Big O, common algorithms, and interview patterns.":
    "Big O, типовые алгоритмы и паттерны для собеседований.",
  "Branches, merges, remotes, and collaboration.":
    "Ветки, merge, remote и совместная работа.",
  "Branches, remotes, and team practices.":
    "Ветки, remote и командные практики.",
  "Browser security, Core Web Vitals, and integrations.":
    "Безопасность браузера, Core Web Vitals и интеграции.",
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
  "Document, events, and extra browser APIs.":
    "Document, события и дополнительные браузерные API.",
  "DOM tree, querying, mutation, BOM, and script loading.":
    "DOM-дерево, поиск, мутации, BOM и загрузка скриптов.",
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
  "Framework model, App Router, rendering, and streaming.":
    "Модель фреймворка, App Router, рендеринг и стриминг.",
  "Framework model, rendering, and streaming.":
    "Модель фреймворка, рендеринг и стриминг.",
  "Generics, type operators, and utility types.":
    "Дженерики, type operators и utility types.",
  "Git, tooling, and adjacent topics.": "Git, тулинг и смежные темы.",
  "GoF creational, structural, and behavioral patterns.":
    "Порождающие, структурные и поведенческие паттерны GoF.",
  "Handlers, bubbling, capturing, delegation, and custom events.":
    "Обработчики, bubbling, capturing, делегирование и custom events.",
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
  "HTML, CSS, JavaScript, React, Next.js, TypeScript, Web APIs, Vue, and Nuxt.":
    "HTML, CSS, JavaScript, React, Next.js, TypeScript, Web API, Vue и Nuxt.",
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
  "Interfaces, object types, classes, and OOP.":
    "Интерфейсы, object types, классы и ООП.",
  "Internet stack and HTTP.": "Интернет-стек и HTTP.",
  "Internet, DNS, and how the web stack fits together.":
    "Интернет, DNS и как складывается веб-стек.",
  "Interview Q&A and coding tasks for HTML.":
    "Вопросы/ответы и задачи по HTML.",
  "Interview Q&A and coding tasks for JavaScript.":
    "Вопросы/ответы и задачи по JavaScript.",
  "Interview Q&A and coding tasks.": "Вопросы/ответы и задачи по коду.",
  "Interview Q&A and quick-fix cases.": "Вопросы/ответы и быстрые кейсы.",
  "Interview Q&A and shell appendix.": "Вопросы/ответы и shell-приложение.",
  "Interview Q&A and type challenges.": "Вопросы/ответы и type challenges.",
  "Interview Q&A for build and CI.": "Вопросы/ответы по build и CI.",
  "Interview Q&A for databases.": "Вопросы/ответы по базам данных.",
  "Interview Q&A for HTTP and Web APIs.": "Вопросы/ответы по HTTP и Web API.",
  "Interview Q&A for Node.js.": "Вопросы/ответы по Node.js.",
  "Interview Q&A for system design.": "Вопросы/ответы по system design.",
  "Intl, RegExp, Signals (TC39), and eval.":
    "Intl, RegExp, Signals (TC39) и eval.",
  "Intl, RegExp, Signals, and other extras.":
    "Intl, RegExp, Signals и другие дополнения.",
  "Landmarks, headings, lists, and phrasing elements that carry meaning.":
    "Landmarks, заголовки, списки и phrasing-элементы со смыслом.",
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
  "MongoDB, Redis, Elasticsearch, and store selection.":
    "MongoDB, Redis, Elasticsearch и выбор хранилища.",
  "Nine patterns for assigning responsibilities to objects.":
    "Девять паттернов назначения ответственности объектам.",
  "Node.js and databases.": "Node.js и базы данных.",
  "NoSQL, ORM, and query builders.": "NoSQL, ORM и query builders.",
  "Objects, classes, generics, and utilities.":
    "Объекты, классы, дженерики и утилиты.",
  "Objects, commits, and everyday workflow.":
    "Объекты, коммиты и повседневный workflow.",
  "OOP pillars and the five SOLID principles for modules and APIs.":
    "Столпы ООП и пять принципов SOLID для модулей и API.",
  "OOP, SOLID, DRY, KISS, YAGNI, and GRASP.":
    "ООП, SOLID, DRY, KISS, YAGNI и GRASP.",
  "Optimizations, proxy, config, Vercel, migration, and debugging.":
    "Оптимизации, proxy, config, Vercel, миграция и отладка.",
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
  "Sorting, search, and graph algorithms.":
    "Сортировка, поиск и алгоритмы на графах.",
  "Sorting, search, graph traversal, and classic algorithm choices.":
    "Сортировка, поиск, обход графа и классический выбор алгоритмов.",
  "SQL language, schema, joins, objects, indexes, and PostgreSQL.":
    "Язык SQL, схема, joins, объекты, индексы и PostgreSQL.",
  "SQL, NoSQL, ORMs, and production data patterns.":
    "SQL, NoSQL, ORM и продакшен-паттерны работы с данными.",
  "Static typing, tsconfig, and everyday types.":
    "Статическая типизация, tsconfig и повседневные типы.",
  "Static typing, tsconfig, narrowing, and functions.":
    "Статическая типизация, tsconfig, сужение типов и функции.",
  "Storage, CORS, observers, History, URL, files, and UI timing.":
    "Storage, CORS, observers, History, URL, файлы и UI timing.",
  "Structure, semantics, forms, and media.":
    "Структура, семантика, формы и медиа.",
  "Styles, app structure, design patterns, data, and infra.":
    "Стили, структура приложения, паттерны, данные и инфра.",
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
  "Working with coding agents and docs tools.":
    "Работа с кодинг-агентами и инструментами документации.",
};

/** Return localized catalog blurb; falls back to English when RU is missing. */
export function catalogBlurb(locale: Locale, english: string): string {
  if (locale === "en") {
    return english;
  }
  return RU_BLURBS[english] ?? english;
}
