export const TRACK_IDS = [
  "frontend",
  "backend",
  "system-design",
  "algorithms",
  "data-structures",
  "ai",
  "other",
] as const;

export type TrackId = (typeof TRACK_IDS)[number];

export type Track = {
  readonly id: TrackId;
  readonly title: string;
  readonly description: string;
};

export type TopicGrouping = {
  readonly subject: string;
  readonly cluster: string;
};

export type Topic = {
  readonly slug: string;
  readonly file: string;
  readonly title: string;
  readonly blurb: string;
  readonly track: TrackId;
  readonly grouping?: TopicGrouping;
};

export type TopicCluster = {
  readonly id: string;
  readonly title: string;
  readonly blurb: string;
};

export type Subject = {
  readonly slug: string;
  readonly title: string;
  readonly blurb: string;
  readonly track: TrackId;
  readonly clusters: readonly TopicCluster[];
};

export type BrowseCard = {
  readonly href: string;
  readonly title: string;
  readonly description: string;
};

export const TRACKS: readonly Track[] = [
  {
    id: "frontend",
    title: "Frontend",
    description: "HTML, CSS, JavaScript, React, TypeScript, and browser APIs.",
  },
  {
    id: "backend",
    title: "Backend",
    description: "Node.js and databases.",
  },
  {
    id: "system-design",
    title: "System design",
    description: "Architecture, patterns, and scaling.",
  },
  {
    id: "algorithms",
    title: "Algorithms",
    description: "Big O, common algorithms, and interview patterns.",
  },
  {
    id: "data-structures",
    title: "Data Structures",
    description: "Arrays, trees, graphs, heaps, and structure selection.",
  },
  {
    id: "ai",
    title: "AI",
    description: "Working with coding agents and docs tools.",
  },
  {
    id: "other",
    title: "Other",
    description: "Git, tooling, and adjacent topics.",
  },
];

export const SUBJECTS: readonly Subject[] = [
  {
    slug: "html",
    title: "HTML",
    blurb: "Document structure, semantics, rendering, forms, a11y, and SEO.",
    track: "frontend",
    clusters: [
      { id: "core", title: "Core", blurb: "Structure, semantics, forms, and media." },
      { id: "browser", title: "Browser", blurb: "Rendering pipeline and performance." },
      { id: "additional", title: "Additional", blurb: "Accessibility, SEO, and advanced APIs." },
      { id: "interview", title: "Interview", blurb: "Q&A and coding tasks." },
    ],
  },
  {
    slug: "css",
    title: "CSS",
    blurb: "Cascade, layout, visual design, and CSS architecture.",
    track: "frontend",
    clusters: [
      { id: "core", title: "Core", blurb: "Cascade, selectors, and the box model." },
      { id: "layout", title: "Layout", blurb: "Flexbox, grid, and responsive design." },
      { id: "additional", title: "Additional", blurb: "Visual, motion, modern CSS, and architecture." },
      { id: "interview", title: "Interview", blurb: "Q&A and coding tasks." },
    ],
  },
  {
    slug: "javascript",
    title: "JavaScript",
    blurb: "Language, browser APIs, and extra runtime topics.",
    track: "frontend",
    clusters: [
      { id: "core", title: "Core", blurb: "Language, data types & variables, operators, arrays, functions, and classes." },
      { id: "browser", title: "Browser", blurb: "Document, events, and extra browser APIs." },
      { id: "async", title: "Async", blurb: "Event loop, promises, and fetch." },
      { id: "additional", title: "Additional", blurb: "Intl, RegExp, Signals, and other extras." },
      { id: "interview", title: "Interview", blurb: "Q&A and coding tasks." },
    ],
  },
  {
    slug: "react",
    title: "React",
    blurb: "Components, hooks, server rendering, and ecosystem.",
    track: "frontend",
    clusters: [
      { id: "core", title: "Core", blurb: "Library model, rendering, JSX, state, and hooks." },
      { id: "react-19", title: "React 19", blurb: "React 19, SSR, and React Server Components." },
      { id: "ecosystem", title: "Ecosystem", blurb: "Architecture, libraries, performance, and legacy." },
      { id: "interview", title: "Interview", blurb: "Q&A and coding tasks." },
    ],
  },
  {
    slug: "nextjs",
    title: "Next.js",
    blurb: "App Router, data, routing, and the Next.js platform.",
    track: "frontend",
    clusters: [
      { id: "core", title: "Core", blurb: "Framework model, rendering, and streaming." },
      { id: "data", title: "Data", blurb: "Fetching, caching, and Server Actions." },
      { id: "additional", title: "Additional", blurb: "Routing and platform." },
      { id: "interview", title: "Interview", blurb: "Q&A and coding tasks." },
    ],
  },
  {
    slug: "typescript",
    title: "TypeScript",
    blurb: "Types, compiler, generics, and typing JavaScript.",
    track: "frontend",
    clusters: [
      { id: "core", title: "Core", blurb: "Static typing, tsconfig, narrowing, and functions." },
      { id: "types", title: "Types", blurb: "Objects, classes, generics, and utilities." },
      { id: "additional", title: "Additional", blurb: "Language reference." },
      { id: "interview", title: "Interview", blurb: "Q&A and type challenges." },
    ],
  },
  {
    slug: "web-api",
    title: "Web APIs",
    blurb: "HTTP, REST, auth, real-time, and browser security.",
    track: "frontend",
    clusters: [
      { id: "core", title: "Core", blurb: "Internet stack and HTTP." },
      { id: "protocols", title: "Protocols", blurb: "REST, RPC, auth, and storage." },
      { id: "additional", title: "Additional", blurb: "App types and security." },
      { id: "interview", title: "Interview", blurb: "Q&A for HTTP and Web APIs." },
    ],
  },
  {
    slug: "nodejs",
    title: "Node.js",
    blurb: "Runtime, HTTP servers, and process management.",
    track: "backend",
    clusters: [
      { id: "core", title: "Core", blurb: "V8, streams, and runtime fundamentals." },
      { id: "modules", title: "Modules", blurb: "Packages, CommonJS/ESM, and built-in APIs." },
      { id: "http", title: "HTTP", blurb: "Express, NestJS, auth, and validation." },
      { id: "additional", title: "Additional", blurb: "Process management." },
      { id: "interview", title: "Interview", blurb: "Q&A for Node.js." },
    ],
  },
  {
    slug: "database",
    title: "Database",
    blurb: "SQL, NoSQL, ORMs, and production data patterns.",
    track: "backend",
    clusters: [
      { id: "core", title: "Core", blurb: "Foundations and SQL." },
      { id: "data", title: "Data", blurb: "NoSQL, ORM, and query builders." },
      { id: "additional", title: "Additional", blurb: "Production patterns." },
      { id: "interview", title: "Interview", blurb: "Q&A for databases." },
    ],
  },
  {
    slug: "git",
    title: "Git",
    blurb: "Version control, history, and collaboration.",
    track: "other",
    clusters: [
      { id: "core", title: "Core", blurb: "Objects, commits, and everyday workflow." },
      { id: "collaboration", title: "Collaboration", blurb: "Branches, remotes, and team practices." },
      { id: "interview", title: "Interview", blurb: "Q&A and shell appendix." },
    ],
  },
  {
    slug: "system-design",
    title: "System design",
    blurb: "Architecture, patterns, and scaling.",
    track: "system-design",
    clusters: [
      { id: "core", title: "Core", blurb: "Foundations and distributed systems." },
      { id: "architecture", title: "Architecture", blurb: "Styles, app structure, design patterns, data, and infra." },
      { id: "principles", title: "Principles", blurb: "OOP, SOLID, DRY, KISS, YAGNI, and GRASP." },
      { id: "interview", title: "Interview", blurb: "Q&A for system design." },
    ],
  },
  {
    slug: "algorithms",
    title: "Algorithms",
    blurb: "Big O, common algorithms, and interview patterns.",
    track: "algorithms",
    clusters: [
      { id: "core", title: "Core", blurb: "Big O and algorithm fundamentals." },
      { id: "algorithms", title: "Algorithms", blurb: "Sorting, search, and graph algorithms." },
      { id: "patterns", title: "Patterns", blurb: "Two pointers, sliding window, and greedy vs DP." },
    ],
  },
  {
    slug: "build",
    title: "Build & CI",
    blurb: "Bundlers, CI, Docker, and delivery.",
    track: "other",
    clusters: [
      { id: "core", title: "Core", blurb: "CI/CD, packages, and bundlers." },
      { id: "delivery", title: "Delivery", blurb: "Docker and infrastructure." },
      { id: "interview", title: "Interview", blurb: "Q&A for build and CI." },
    ],
  },
  {
    slug: "cursor",
    title: "Cursor",
    blurb: "Core tips, skills, rules, plugins, slash commands, and questions.",
    track: "ai",
    clusters: [
      { id: "core", title: "Core", blurb: "Shortcuts, Run Modes, verification loops, and Cursor Directory." },
      { id: "skills", title: "Skills", blurb: "Agent Skills: SKILL.md, auto vs slash, and built-ins." },
      { id: "rules", title: "Rules", blurb: "Project, user, team rules, and AGENTS.md." },
      { id: "plugins", title: "Plugins", blurb: "Cursor and Agent plugin formats and marketplaces." },
      {
        id: "slash",
        title: "Slash commands",
        blurb: "How `/` works and the most-used built-ins.",
      },
      { id: "questions", title: "Questions", blurb: "Q&A for Cursor skills, rules, plugins, and slash." },
    ],
  },
];

const HUB_HREFS: Readonly<Record<string, string>> = {
  "3_js.md": "/frontend/javascript",
  "1_html.md": "/frontend/html",
  "2_css.md": "/frontend/css",
  "4_react.md": "/frontend/react",
  "4_nextjs.md": "/frontend/nextjs",
  "5_ts.md": "/frontend/typescript",
  "6_web_api.md": "/frontend/web-api",
  "8_nodejs.md": "/backend/nodejs",
  "9_database.md": "/backend/database",
  "0_git.md": "/other/git",
  "0_system_design.md": "/system-design",
  "7_special_algorithms.md": "/algorithms",
  "7_special_data_structures.md": "/data-structures",
  "7_special.md": "/other/computer-science",
  "10_build.md": "/other/build",
};

function grouped(
  slug: string,
  file: string,
  title: string,
  blurb: string,
  track: TrackId,
  subject: string,
  cluster: string,
): Topic {
  return { slug, file, title, blurb, track, grouping: { subject, cluster } };
}

export const TOPICS: readonly Topic[] = [
  grouped("html-structure", "1_html_structure.md", "Structure", "Document skeleton, metadata, elements, and attributes.", "frontend", "html", "core"),
  grouped("html-semantics", "1_html_semantics.md", "Semantics", "Landmarks, headings, lists, and phrasing elements that carry meaning.", "frontend", "html", "core"),
  grouped("html-forms", "1_html_forms.md", "Forms", "Form controls, validation, dialog, and accessible form patterns.", "frontend", "html", "core"),
  grouped("html-media", "1_html_media.md", "Media", "Images, picture, audio, video, canvas, and SVG.", "frontend", "html", "core"),
  grouped("html-rendering", "1_html_rendering.md", "Rendering", "URL to pixels: parse, CSSOM, render tree, layout, paint, composite.", "frontend", "html", "browser"),
  grouped("html-performance", "1_html_performance.md", "Performance", "Script loading, resource hints, Core Web Vitals, and FOUC.", "frontend", "html", "browser"),
  grouped("html-a11y", "1_html_a11y.md", "Accessibility", "POUR, names, landmarks, forms, and images.", "frontend", "html", "additional"),
  grouped("html-seo", "1_html_seo.md", "SEO", "Crawlability, metadata, and structured data.", "frontend", "html", "additional"),
  grouped("html-advanced", "1_html_advanced.md", "Advanced", "Web components, shadow DOM, and newer HTML APIs.", "frontend", "html", "additional"),
  grouped("html-interview", "1_html_interview.md", "Interview", "Interview Q&A and coding tasks for HTML.", "frontend", "html", "interview"),
  grouped("css-core", "2_css_core.md", "Core", "How CSS is added, cascade, selectors, and the box model.", "frontend", "css", "core"),
  grouped("css-layout", "2_css_layout.md", "Layout", "Flexbox, grid, positioning, responsive design, and mobile viewport.", "frontend", "css", "layout"),
  grouped("css-visual", "2_css_visual.md", "Visual", "Typography, color, decoration, form styling, and print.", "frontend", "css", "additional"),
  grouped("css-motion", "2_css_motion.md", "Motion", "Transforms, transitions, animations, and visual effects.", "frontend", "css", "additional"),
  grouped("css-modern", "2_css_modern.md", "Modern", "2024+ CSS features and advanced phase-2 topics.", "frontend", "css", "additional"),
  grouped("css-architecture", "2_css_architecture.md", "Architecture", "Methodologies, tooling, and rendering performance.", "frontend", "css", "additional"),
  grouped("css-interview", "2_css_interview.md", "Interview", "Interview Q&A and quick-fix cases.", "frontend", "css", "interview"),

  {
    slug: "js-core",
    file: "3_js_core.md",
    title: "Language",
    blurb: "Runtime and modules — types, bindings, and control flow live in sibling Core topics.",
    track: "frontend",
    grouping: { subject: "javascript", cluster: "core" },
  },
  {
    slug: "js-variables",
    file: "3_js_variables.md",
    title: "Data Types & Variables",
    blurb: "Primitives, coercion, stack/heap, collections, JSON, bindings, scope, and closures.",
    track: "frontend",
    grouping: { subject: "javascript", cluster: "core" },
  },
  {
    slug: "js-operators",
    file: "3_js_operators.md",
    title: "Operators & Loops",
    blurb: "Expressions, operators, comparisons, control flow, try/catch, and iterators.",
    track: "frontend",
    grouping: { subject: "javascript", cluster: "core" },
  },
  {
    slug: "js-array",
    file: "3_js_array.md",
    title: "Arrays",
    blurb: "Indexed collections and array methods — map, filter, reduce.",
    track: "frontend",
    grouping: { subject: "javascript", cluster: "core" },
  },
  {
    slug: "js-functions",
    file: "3_js_functions.md",
    title: "Functions",
    blurb: "Declarations, arrows, this, higher-order functions, and bind.",
    track: "frontend",
    grouping: { subject: "javascript", cluster: "core" },
  },
  {
    slug: "js-oop",
    file: "3_js_oop.md",
    title: "Classes & Objects",
    blurb: "Prototypes, classes, and object patterns.",
    track: "frontend",
    grouping: { subject: "javascript", cluster: "core" },
  },
  {
    slug: "js-browser",
    file: "3_js_browser.md",
    title: "Document",
    blurb: "DOM tree, querying, mutation, BOM, and script loading.",
    track: "frontend",
    grouping: { subject: "javascript", cluster: "browser" },
  },
  {
    slug: "js-events",
    file: "3_js_events.md",
    title: "Events",
    blurb: "Handlers, bubbling, capturing, delegation, and custom events.",
    track: "frontend",
    grouping: { subject: "javascript", cluster: "browser" },
  },
  {
    slug: "js-browser-extra",
    file: "3_js_browser_extra.md",
    title: "Browser APIs",
    blurb: "Storage, CORS, observers, History, URL, files, and UI timing.",
    track: "frontend",
    grouping: { subject: "javascript", cluster: "browser" },
  },
  {
    slug: "js-async",
    file: "3_js_async.md",
    title: "Async",
    blurb: "Event loop, promises, and fetch.",
    track: "frontend",
    grouping: { subject: "javascript", cluster: "async" },
  },
  {
    slug: "js-extra",
    file: "3_js_extra.md",
    title: "Additional",
    blurb: "Intl, RegExp, Signals (TC39), and eval.",
    track: "frontend",
    grouping: { subject: "javascript", cluster: "additional" },
  },
  grouped("js-interview", "3_js_interview.md", "Interview", "Interview Q&A and coding tasks for JavaScript.", "frontend", "javascript", "interview"),
  grouped("react-core", "4_react_core.md", "Basics", "Library model, rendering, JSX, and state.", "frontend", "react", "core"),
  grouped("react-hooks", "4_react_hooks.md", "Hooks", "Hooks reference and escape hatches.", "frontend", "react", "core"),
  grouped("react-server", "4_react_server.md", "React 19", "React 19 APIs, SSR, and React Server Components.", "frontend", "react", "react-19"),
  grouped("react-ecosystem", "4_react_ecosystem.md", "Ecosystem", "Architecture, libraries, performance, and legacy.", "frontend", "react", "ecosystem"),
  grouped("react-interview", "4_react_interview.md", "Interview", "Interview Q&A and coding tasks.", "frontend", "react", "interview"),
  grouped("nextjs-core", "4_nextjs_core.md", "Core", "Framework model, App Router, rendering, and streaming.", "frontend", "nextjs", "core"),
  grouped("nextjs-data", "4_nextjs_data.md", "Data", "Fetching, caching, revalidation, Server Actions, and Route Handlers.", "frontend", "nextjs", "data"),
  grouped("nextjs-routing", "4_nextjs_routing.md", "Routing", "File-based routes, special files, navigation, metadata, and SEO.", "frontend", "nextjs", "additional"),
  grouped("nextjs-platform", "4_nextjs_platform.md", "Platform", "Optimizations, proxy, config, Vercel, migration, and debugging.", "frontend", "nextjs", "additional"),
  grouped("nextjs-interview", "4_nextjs_interview.md", "Interview", "Interview Q&A and coding tasks.", "frontend", "nextjs", "interview"),
  grouped("ts-basics", "5_ts_core.md", "Basics", "Static typing, tsconfig, and everyday types.", "frontend", "typescript", "core"),
  grouped("ts-narrowing", "5_ts_narrowing.md", "Narrowing", "Control-flow analysis and type guards.", "frontend", "typescript", "core"),
  grouped("ts-functions", "5_ts_functions.md", "Functions", "Call signatures, overloads, and this typing.", "frontend", "typescript", "core"),
  grouped("ts-objects", "5_ts_objects.md", "Objects", "Interfaces, object types, classes, and OOP.", "frontend", "typescript", "types"),
  grouped("ts-generics", "5_ts_generics.md", "Generics", "Generics, type operators, and utility types.", "frontend", "typescript", "types"),
  grouped("ts-reference", "5_ts_reference.md", "Reference", "Language reference and advanced topics.", "frontend", "typescript", "additional"),
  grouped("ts-interview", "5_ts_interview.md", "Interview", "Interview Q&A and type challenges.", "frontend", "typescript", "interview"),
  grouped("web-api-core", "6_web_api_core.md", "Internet", "Internet, DNS, and how the web stack fits together.", "frontend", "web-api", "core"),
  grouped("web-api-http", "6_web_api_http.md", "HTTP", "HTTP, HTTPS, TLS, caching, CORS, and URL anatomy.", "frontend", "web-api", "core"),
  grouped("web-api-rest", "6_web_api_rest.md", "API styles", "REST, XML, SOAP, RPC, tRPC, and how they differ.", "frontend", "web-api", "protocols"),
  grouped("web-api-auth", "6_web_api_auth.md", "Auth & storage", "AuthN/AuthZ, sessions, JWT, OAuth, cookies, and storage.", "frontend", "web-api", "protocols"),
  grouped("web-api-apps", "6_web_api_apps.md", "Apps", "Protocols, real-time, and types of web apps.", "frontend", "web-api", "additional"),
  grouped("web-api-security", "6_web_api_security.md", "Security", "Browser security, Core Web Vitals, and integrations.", "frontend", "web-api", "additional"),
  grouped("web-api-interview", "6_web_api_interview.md", "Interview", "Interview Q&A for HTTP and Web APIs.", "frontend", "web-api", "interview"),
  grouped("nodejs-core", "8_nodejs_core.md", "Core", "V8, event loop, streams, buffers, and runtime fundamentals.", "backend", "nodejs", "core"),
  grouped("nodejs-modules", "8_nodejs_modules.md", "Modules", "Package managers, CommonJS/ESM, and built-in modules.", "backend", "nodejs", "modules"),
  grouped("nodejs-http", "8_nodejs_http.md", "HTTP", "Express, auth, validation, Koa, NestJS, and runtime choice.", "backend", "nodejs", "http"),
  grouped("nodejs-additional", "8_nodejs_process.md", "Additional", "child_process, cluster, workers, and real-time servers.", "backend", "nodejs", "additional"),
  grouped("nodejs-interview", "8_nodejs_interview.md", "Interview", "Interview Q&A for Node.js.", "backend", "nodejs", "interview"),
  grouped("database-foundations", "9_database_core.md", "Foundations", "ACID, CAP, transactions, and normalization.", "backend", "database", "core"),
  grouped("database-sql", "9_database_sql.md", "SQL", "SQL language, schema, joins, objects, indexes, and PostgreSQL.", "backend", "database", "core"),
  grouped("database-nosql", "9_database_nosql.md", "NoSQL", "MongoDB, Redis, Elasticsearch, and store selection.", "backend", "database", "data"),
  grouped("database-orm", "9_database_orm.md", "ORM", "Prisma, Sequelize, Knex, Drizzle, and query builders.", "backend", "database", "data"),
  grouped("database-production", "9_database_production.md", "Production", "Replication, sharding, caching, and OLTP scaling.", "backend", "database", "additional"),
  grouped("database-interview", "9_database_interview.md", "Interview", "Interview Q&A for databases.", "backend", "database", "interview"),
  grouped("git-core", "0_git_core.md", "Core", "Objects, commits, and everyday workflow.", "other", "git", "core"),
  grouped("git-branching", "0_git_branching.md", "Branching", "Branches, merges, remotes, and collaboration.", "other", "git", "collaboration"),
  grouped("git-team", "0_git_team.md", "Team", "Recovery, team practices, hooks, and advanced Git.", "other", "git", "collaboration"),
  grouped("git-interview", "0_git_interview.md", "Interview", "Interview Q&A and shell appendix.", "other", "git", "interview"),
  {
    slug: "special-testing",
    file: "7_special_testing.md",
    title: "Testing",
    blurb: "AAA, the test pyramid, doubles, and Jest.",
    track: "other",
  },
  {
    slug: "special-sdlc",
    file: "7_special_sdlc.md",
    title: "SDLC",
    blurb: "Waterfall, Agile, Scrum, and Kanban.",
    track: "other",
  },
  {
    slug: "special-security",
    file: "7_special_security.md",
    title: "Web security",
    blurb: "Security model and common web attacks.",
    track: "other",
  },
  {
    slug: "computer-science",
    file: "7_special_cs.md",
    title: "Computer science",
    blurb: "What computation is, plus programming paradigms and logic programming.",
    track: "other",
  },
  {
    slug: "special-interview",
    file: "7_special_interview.md",
    title: "Interview leftovers",
    blurb: "Q&A and leftover tooling notes that still sit outside subject interviews.",
    track: "other",
  },
  grouped("build-ci", "10_build_ci.md", "CI", "CI/CD, package managers, and task runners.", "other", "build", "core"),
  grouped("build-bundlers", "10_build_bundlers.md", "Bundlers", "Transpilers, bundling concepts, bundlers, and code quality.", "other", "build", "core"),
  grouped("build-docker", "10_build_docker.md", "Docker", "Images, containers, Compose, and container lifecycle.", "other", "build", "delivery"),
  grouped("build-infra", "10_build_infra.md", "Infra", "Delivery architecture, Nginx, brokers, and DX tools.", "other", "build", "delivery"),
  grouped("build-interview", "10_build_interview.md", "Interview", "Interview Q&A for build and CI.", "other", "build", "interview"),
  grouped("sd-core", "0_system_design_core.md", "Core", "Foundations and distributed-systems basics.", "system-design", "system-design", "core"),
  grouped("sd-architecture", "0_system_design_architecture.md", "Styles", "Deploy topology and where HTML is built.", "system-design", "system-design", "architecture"),
  grouped("special-architecture", "7_special_architecture.md", "Architecture patterns", "Composition, MVC, layers/DDD, data flow, and frontend structure.", "system-design", "system-design", "architecture"),
  grouped("special-patterns", "7_special_patterns.md", "Design patterns", "GoF creational, structural, and behavioral patterns.", "system-design", "system-design", "architecture"),
  grouped("sd-data", "0_system_design_data.md", "Data", "Data, caching, and infrastructure building blocks.", "system-design", "system-design", "architecture"),
  grouped("solid", "7_special_engineering.md", "OOP & SOLID", "OOP pillars and the five SOLID principles for modules and APIs.", "system-design", "system-design", "principles"),
  grouped("sd-principles", "0_system_design_principles.md", "DRY, KISS, YAGNI", "Don't Repeat Yourself, Keep It Simple, You Aren't Gonna Need It.", "system-design", "system-design", "principles"),
  grouped("sd-grasp", "0_system_design_grasp.md", "GRASP", "Nine patterns for assigning responsibilities to objects.", "system-design", "system-design", "principles"),
  grouped("sd-interview", "0_system_design_interview.md", "Interview", "Interview Q&A for system design.", "system-design", "system-design", "interview"),
  grouped(
    "algorithms-core",
    "7_special_algorithms_core.md",
    "Big O",
    "Algorithm basics and complexity analysis.",
    "algorithms",
    "algorithms",
    "core",
  ),
  grouped(
    "algorithms-common",
    "7_special_algorithms_common.md",
    "Algorithms",
    "Sorting, search, graph traversal, and classic algorithm choices.",
    "algorithms",
    "algorithms",
    "algorithms",
  ),
  grouped(
    "algorithms-patterns",
    "7_special_algorithms_patterns.md",
    "Patterns",
    "Two pointers, sliding window, and greedy vs DP decisions.",
    "algorithms",
    "algorithms",
    "patterns",
  ),
  {
    slug: "data-structures",
    file: "7_special_algorithms_data.md",
    title: "Data Structures",
    blurb: "Arrays, trees, graphs, heaps, and structure selection.",
    track: "data-structures",
  },
  {
    slug: "vscode-devtools",
    file: "11_vsc_browser.md",
    title: "VS Code & DevTools",
    blurb: "Editor and browser developer tools.",
    track: "other",
  },
  {
    slug: "devops",
    file: "15_devops.md",
    title: "DevOps",
    blurb: "Processes, SSH, Unix jobs, and OpenTelemetry.",
    track: "other",
  },
  {
    slug: "ai",
    file: "0_ai.md",
    title: "Workflow",
    blurb: "AI-first vs augmented, editors, Context7/Ref, and RTK.",
    track: "ai",
  },
  grouped(
    "cursor-core",
    "0_ai_cursor_core.md",
    "Core",
    "Shortcuts, Run Modes, verification loops, and Cursor Directory.",
    "ai",
    "cursor",
    "core",
  ),
  grouped(
    "cursor-skills",
    "0_ai_cursor_skills.md",
    "Skills",
    "Agent Skills: SKILL.md, auto vs slash, paths, and built-ins.",
    "ai",
    "cursor",
    "skills",
  ),
  grouped(
    "cursor-rules",
    "0_ai_cursor_rules.md",
    "Rules",
    "Project, user, team rules, AGENTS.md, and apply modes.",
    "ai",
    "cursor",
    "rules",
  ),
  grouped(
    "cursor-plugins",
    "0_ai_cursor_plugins.md",
    "Plugins",
    "Cursor and Agent plugin formats, MCP, and marketplaces.",
    "ai",
    "cursor",
    "plugins",
  ),
  grouped(
    "cursor-slash",
    "0_ai_cursor_slash.md",
    "Slash commands",
    "How `/` works, custom commands, and the most-used built-ins.",
    "ai",
    "cursor",
    "slash",
  ),
  grouped(
    "cursor-questions",
    "0_ai_cursor_questions.md",
    "Questions",
    "Q&A for Cursor skills, rules, plugins, and slash commands.",
    "ai",
    "cursor",
    "questions",
  ),
  {
    slug: "mvp",
    file: "0_mvp.md",
    title: "MVP & product",
    blurb: "Product judgment versus architecture.",
    track: "other",
  },
  {
    slug: "python",
    file: "13_python.md",
    title: "Python",
    blurb: "Python language notes.",
    track: "other",
  },
];

const TOPIC_BY_FILE = new Map(
  TOPICS.map((topic) => [topic.file.toLowerCase(), topic]),
);

function assertCatalogGroupings() {
  const topicSlugs = new Set(TOPICS.map((topic) => `${topic.track}/${topic.slug}`));
  for (const subject of SUBJECTS) {
    if (topicSlugs.has(`${subject.track}/${subject.slug}`)) {
      throw new Error(`Subject slug collides with a topic: ${subject.slug}`);
    }
  }
  for (const topic of TOPICS) {
    if (!topic.grouping) {
      continue;
    }
    const subject = SUBJECTS.find(
      (item) => item.slug === topic.grouping?.subject && item.track === topic.track,
    );
    if (!subject) {
      throw new Error(`Unknown subject for topic ${topic.slug}: ${topic.grouping.subject}`);
    }
    const cluster = subject.clusters.find((item) => item.id === topic.grouping?.cluster);
    if (!cluster) {
      throw new Error(`Unknown cluster for topic ${topic.slug}: ${topic.grouping.cluster}`);
    }
  }
}

assertCatalogGroupings();

export function isTrackId(value: string): value is TrackId {
  return (TRACK_IDS as readonly string[]).includes(value);
}

export function getTrack(id: string): Track | undefined {
  return TRACKS.find((track) => track.id === id);
}

export function topicsForTrack(track: TrackId): readonly Topic[] {
  return TOPICS.filter((topic) => topic.track === track);
}

export function leafTopicForTrack(track: TrackId): Topic | undefined {
  const topics = topicsForTrack(track);
  if (topics.length !== 1 || topics[0].grouping) {
    return undefined;
  }
  return topics[0];
}

export function isLeafTopic(topic: Topic): boolean {
  return leafTopicForTrack(topic.track)?.slug === topic.slug;
}

export function isInterviewTopic(topic: Pick<Topic, "slug" | "title">): boolean {
  return topic.slug.endsWith("-interview") || topic.title === "Interview";
}

export function getTopic(track: string, slug: string): Topic | undefined {
  return TOPICS.find((topic) => topic.track === track && topic.slug === slug);
}

export function getSubject(track: string, slug: string): Subject | undefined {
  return SUBJECTS.find((subject) => subject.track === track && subject.slug === slug);
}

export function subjectForTrack(track: TrackId): Subject | undefined {
  const subjects = SUBJECTS.filter((subject) => subject.track === track);
  const ungrouped = topicsForTrack(track).filter((topic) => !topic.grouping);
  if (subjects.length === 1 && ungrouped.length === 0) {
    return subjects[0];
  }
  return undefined;
}

export function getCluster(subject: Subject, clusterId: string): TopicCluster | undefined {
  return subject.clusters.find((cluster) => cluster.id === clusterId);
}

export function topicsForCluster(subject: Subject, clusterId: string): readonly Topic[] {
  return TOPICS.filter(
    (topic) =>
      topic.track === subject.track &&
      topic.grouping?.subject === subject.slug &&
      topic.grouping.cluster === clusterId,
  );
}

export function hrefForFile(filename: string): string | undefined {
  const topic = TOPIC_BY_FILE.get(filename.toLowerCase());
  if (topic) {
    return topicHref(topic);
  }
  return HUB_HREFS[filename.toLowerCase()];
}

export function topicHref(topic: Topic): string {
  if (isLeafTopic(topic)) {
    return `/${topic.track}`;
  }
  return `/${topic.track}/${topic.slug}`;
}

export function subjectHref(subject: Subject): string {
  if (subjectForTrack(subject.track)?.slug === subject.slug) {
    return trackHref(subject.track);
  }
  return `/${subject.track}/${subject.slug}`;
}

export function clusterHref(subject: Subject, cluster: TopicCluster): string {
  return `${subjectHref(subject)}#${cluster.id}`;
}

export function trackHref(track: TrackId): string {
  return `/${track}`;
}

export function trackBrowseCards(track: TrackId): readonly BrowseCard[] {
  const seenSubjects = new Set<string>();
  const cards: BrowseCard[] = [];

  for (const topic of topicsForTrack(track)) {
    if (topic.grouping) {
      if (seenSubjects.has(topic.grouping.subject)) {
        continue;
      }
      seenSubjects.add(topic.grouping.subject);
      const subject = getSubject(topic.track, topic.grouping.subject);
      if (!subject) {
        continue;
      }
      cards.push({
        href: subjectHref(subject),
        title: subject.title,
        description: subject.blurb,
      });
      continue;
    }

    cards.push({
      href: topicHref(topic),
      title: topic.title,
      description: topic.blurb,
    });
  }

  return cards;
}

export function subjectClusterCards(subject: Subject): readonly {
  readonly cluster: TopicCluster;
  readonly items: readonly BrowseCard[];
}[] {
  return subject.clusters.flatMap((cluster) => {
    const topics = topicsForCluster(subject, cluster.id);
    if (topics.length === 0) {
      return [];
    }
    const items =
      topics.length === 1
        ? [
            {
              href: topicHref(topics[0]),
              title: cluster.title,
              description: cluster.blurb,
            },
          ]
        : topics.map((topic) => ({
            href: topicHref(topic),
            title: topic.title,
            description: topic.blurb,
          }));
    return [{ cluster, items }];
  });
}

export function topicRouteParams(): readonly { track: TrackId; topic: string }[] {
  return [
    ...TOPICS.filter((topic) => !isLeafTopic(topic)).map((topic) => ({
      track: topic.track,
      topic: topic.slug,
    })),
    ...SUBJECTS.filter((subject) => subjectHref(subject) !== trackHref(subject.track)).map(
      (subject) => ({ track: subject.track, topic: subject.slug }),
    ),
  ];
}
