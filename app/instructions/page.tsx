import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ConceptSlotLabel } from "@/components/ConceptSlotLabel";
import type { SlotKind } from "@/lib/content/concept-slots";

export const metadata: Metadata = {
  title: "Instructions",
  description: "How concept sections are structured in the MyConspect study handbook.",
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
