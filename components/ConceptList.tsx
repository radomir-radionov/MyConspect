import type { Concept } from "@/lib/content/parse";

export function ConceptList({ concepts }: { concepts: readonly Concept[] }) {
  if (concepts.length === 0) {
    return <p className="text-zinc-600">No concepts were parsed from this topic.</p>;
  }

  return (
    <div className="concept-list divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
      {concepts.map((concept) => (
        <details key={concept.id} id={concept.id} className="group px-4">
          <summary className="cursor-pointer py-3 text-left text-base font-medium text-zinc-900">
            {concept.title}
          </summary>
          <div
            className="concept-body pb-5 pt-1"
            dangerouslySetInnerHTML={{ __html: concept.html }}
          />
        </details>
      ))}
    </div>
  );
}
