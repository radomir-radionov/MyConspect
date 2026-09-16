import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ConceptSlotLabel } from "@/components/topic";
import type { SlotKind } from "@/lib/parse";

export const metadata: Metadata = {
  title: "Instructions",
  description:
    "How MyConspect splits tracks, topics, and concepts, and how each concept section is structured.",
};

const CONCEPT_SECTIONS: {
  kind: SlotKind;
  label: string;
  body: string | ReactNode;
}[] = [
  {
    kind: "definition",
    label: "Definition",
    body:
      "React is a JavaScript library for building user interfaces from reusable components. It manages the view layer only — routing, data fetching, and global conventions come from frameworks or third-party libraries.",
  },
  {
    kind: "how",
    label: "How it works",
    body: (
      <ul>
        <li>You describe UI as a function of state; React reconciles the virtual DOM and commits updates to the host (e.g. the browser via React DOM).</li>
        <li>Components re-render when state or props change; hooks encapsulate state and side effects.</li>
        <li>The renderer (<code>react-dom</code>, React Native, etc.) is separate from the core <code>react</code> package.</li>
      </ul>
    ),
  },
  {
    kind: "cases",
    label: "When to use",
    body: (
      <p>
        SPAs, design systems, embeddable widgets (<code>createRoot</code> on a node), Next.js / React
        Router apps, React Native / Expo. Skip for static pages with no interactivity — plain HTML
        or a lighter library may be enough.
      </p>
    ),
  },
  {
    kind: "tradeoffs",
    label: "Pluses and minuses",
    body: (
      <div className="pros-cons">
        <ul className="pros-cons__list pros-cons__list--pro">
          <li className="pros-cons__item">Component model scales from widgets to full apps.</li>
          <li className="pros-cons__item">Large ecosystem, DevTools, and hiring pool.</li>
        </ul>
        <ul className="pros-cons__list pros-cons__list--con">
          <li className="pros-cons__item">Not batteries-included — router and data layer are extra choices.</li>
          <li className="pros-cons__item">Learning curve: hooks, concurrent features, RSC mental model.</li>
        </ul>
      </div>
    ),
  },
  {
    kind: "example",
    label: "Examples",
    body: (
      <pre>
        <code>{`import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

createRoot(document.getElementById('root')!).render(<Counter />);`}</code>
      </pre>
    ),
  },
  {
    kind: "thoughts",
    label: "Thoughts",
    body:
      "Treat React as a UI runtime, not a full framework — that framing helps in system-design and “React vs Next” interview questions.",
  },
  {
    kind: "sources",
    label: "Sources",
    body: (
      <p>
        <a href="https://react.dev/">react.dev</a>
      </p>
    ),
  },
];

export default function InstructionsPage() {
  return (
    <main className="w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Instructions</h1>

      <p className="mt-4 text-base leading-7 text-zinc-600">
        The sidebar does not invent splits. One markdown file is one topic page. Large subjects
        such as HTML, CSS, JavaScript, and React use Core and other cluster groups. Use the
        levels below so new notes land in the right place.
      </p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-zinc-900">
        How to split topics
      </h2>
      <p className="mt-3 text-base leading-7 text-zinc-600">
        Tracks group the sidebar. A topic is a study unit you would open and scroll. A concept is
        one interview-sized idea inside that unit.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-700">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="py-2 pr-4 font-semibold">Level</th>
              <th className="py-2 pr-4 font-semibold">What it is</th>
              <th className="py-2 font-semibold">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-100">
              <td className="py-2 pr-4 font-medium">Track</td>
              <td className="py-2 pr-4">Coarse job area</td>
              <td className="py-2">Frontend, Backend, Other, System design, Algorithms, AI</td>
            </tr>
            <tr className="border-b border-zinc-100">
              <td className="py-2 pr-4 font-medium">Subject</td>
              <td className="py-2 pr-4">Optional nest of related topics</td>
              <td className="py-2">HTML, JavaScript, React</td>
            </tr>
            <tr className="border-b border-zinc-100">
              <td className="py-2 pr-4 font-medium">Cluster</td>
              <td className="py-2 pr-4">Group inside a subject</td>
              <td className="py-2">Core, Browser, Additional</td>
            </tr>
            <tr className="border-b border-zinc-100">
              <td className="py-2 pr-4 font-medium">Topic</td>
              <td className="py-2 pr-4">
                One <code>resources/*_*.md</code> file and one catalog row
              </td>
              <td className="py-2">Structure, Language, Hooks</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium">Concept</td>
              <td className="py-2 pr-4">
                One <code>&lt;details&gt;</code> accordion on that page
              </td>
              <td className="py-2">flexbox, Promise, useEffect</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-base leading-7 text-zinc-600">
        Large subjects follow the JavaScript model: one subject, a few clusters, and a topic page
        per markdown file — not four tracks, and not hundreds of tiny pages.
      </p>
      <p className="mt-3 text-base leading-7 text-zinc-600">
        Keep a concept in the same topic when it shares the same runtime, interview bucket, and
        canonical owner. Overlap is fine: one full essay, a short pointer plus link in siblings.
      </p>
      <p className="mt-3 text-base leading-7 text-zinc-600">
        Split into a new file (and catalog row) when several of these are true: unrelated mental
        models in one file, no honest one-line blurb, duplicated essays across files, or a section
        you would study as its own sitting. Do not split because one accordion grew long, two APIs
        are related, or the sidebar would look nicer.
      </p>
      <p className="mt-3 text-base leading-7 text-zinc-600">
        Test: if you studied only that page for 20 minutes, would the title still be honest? If
        yes, add a <code>&lt;details&gt;</code> in the owner file. If the title would have to list
        several layers, make a new topic.
      </p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-zinc-900">
        Concept sections
      </h2>
      <p className="mt-3 text-base leading-7 text-zinc-600">
        Every concept answer follows this structure. <strong>Definition</strong> is required; all
        other sections are optional — include only the blocks that add value.
      </p>

      <div className="concept-body mt-8">
        {CONCEPT_SECTIONS.map((section) => (
          <section key={section.kind} className={`concept-slot slot-${section.kind}`}>
            <ConceptSlotLabel kind={section.kind} label={section.label} />
            <div className="concept-slot__body">
              {typeof section.body === "string" ? <p>{section.body}</p> : section.body}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
