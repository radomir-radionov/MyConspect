export const TRACK_IDS = ["frontend", "backend", "other"] as const;

export type TrackId = (typeof TRACK_IDS)[number];

export type Track = {
  readonly id: TrackId;
  readonly title: string;
  readonly description: string;
};

export type Topic = {
  readonly slug: string;
  readonly file: string;
  readonly title: string;
  readonly blurb: string;
  readonly track: TrackId;
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
    id: "other",
    title: "Other",
    description: "Git, system design, tooling, and adjacent topics.",
  },
];

export const TOPICS: readonly Topic[] = [
  {
    slug: "html",
    file: "1_html.md",
    title: "HTML",
    blurb: "Document structure, rendering, semantics, forms, a11y, and SEO.",
    track: "frontend",
  },
  {
    slug: "css",
    file: "2_css.md",
    title: "CSS",
    blurb: "Selectors, cascade, layout, and CSS APIs.",
    track: "frontend",
  },
  {
    slug: "js-core",
    file: "3_js_core.md",
    title: "JavaScript core",
    blurb: "Language, types, and runtime — not the DOM.",
    track: "frontend",
  },
  {
    slug: "js-oop",
    file: "3_js_oop.md",
    title: "JavaScript objects",
    blurb: "Prototypes, classes, and object patterns.",
    track: "frontend",
  },
  {
    slug: "js-browser",
    file: "3_js_browser.md",
    title: "JavaScript in the browser",
    blurb: "DOM, BOM, events, and browser storage.",
    track: "frontend",
  },
  {
    slug: "js-async",
    file: "3_js_async.md",
    title: "JavaScript async",
    blurb: "Event loop, promises, and fetch.",
    track: "frontend",
  },
  {
    slug: "react",
    file: "4_react.md",
    title: "React",
    blurb: "Components, hooks, rendering, and ecosystem patterns.",
    track: "frontend",
  },
  {
    slug: "nextjs",
    file: "4_nextjs.md",
    title: "Next.js",
    blurb: "App Router, rendering, and the Next.js platform.",
    track: "frontend",
  },
  {
    slug: "typescript",
    file: "5_ts.md",
    title: "TypeScript",
    blurb: "Types, tooling, and typing JavaScript.",
    track: "frontend",
  },
  {
    slug: "web-api",
    file: "6_web_api.md",
    title: "Web APIs",
    blurb: "HTTP, REST, browser Web APIs, and PWA.",
    track: "frontend",
  },
  {
    slug: "nodejs",
    file: "8_nodejs.md",
    title: "Node.js",
    blurb: "Runtime, modules, and server-side JavaScript.",
    track: "backend",
  },
  {
    slug: "database",
    file: "9_database.md",
    title: "Databases",
    blurb: "SQL, ORM, and data modeling.",
    track: "backend",
  },
  {
    slug: "git",
    file: "0_git.md",
    title: "Git",
    blurb: "Version control, history, and collaboration.",
    track: "other",
  },
  {
    slug: "system-design",
    file: "0_system_design.md",
    title: "System design",
    blurb: "Architecture, patterns, and scaling.",
    track: "other",
  },
  {
    slug: "special",
    file: "7_special.md",
    title: "Paradigms & security",
    blurb: "OOP, SOLID, algorithms, testing, and web attacks.",
    track: "other",
  },
  {
    slug: "build",
    file: "10_build.md",
    title: "Build & CI",
    blurb: "Bundlers, CI, Docker, and delivery.",
    track: "other",
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
    title: "AI-assisted workflow",
    blurb: "Working with coding agents and docs tools.",
    track: "other",
  },
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

export function isTrackId(value: string): value is TrackId {
  return (TRACK_IDS as readonly string[]).includes(value);
}

export function getTrack(id: string): Track | undefined {
  return TRACKS.find((track) => track.id === id);
}

export function topicsForTrack(track: TrackId): readonly Topic[] {
  return TOPICS.filter((topic) => topic.track === track);
}

export function getTopic(track: string, slug: string): Topic | undefined {
  return TOPICS.find((topic) => topic.track === track && topic.slug === slug);
}

export function hrefForFile(filename: string): string | undefined {
  const topic = TOPIC_BY_FILE.get(filename.toLowerCase());
  if (!topic) {
    return undefined;
  }
  return `/${topic.track}/${topic.slug}`;
}

export function topicHref(topic: Topic): string {
  return `/${topic.track}/${topic.slug}`;
}
