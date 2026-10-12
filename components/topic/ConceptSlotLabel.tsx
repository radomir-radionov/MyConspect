import type { SlotKind } from "@/lib/parse";

export function ConceptSlotLabel({
  kind,
  label,
}: {
  kind: SlotKind;
  label: string;
}) {
  if (kind === "intro") {
    return null;
  }

  if (kind === "tradeoffs") {
    return (
      <h4 className="concept-slot__heading concept-slot__heading--tradeoffs">
        <span
          className="concept-slot__badge concept-slot__badge--pro"
          aria-hidden="true"
        >
          +
        </span>
        <span className="concept-slot__title">{label}</span>
        <span
          className="concept-slot__badge concept-slot__badge--con"
          aria-hidden="true"
        >
          −
        </span>
      </h4>
    );
  }

  if (kind === "key" || kind === "advices" || kind === "traps") {
    return (
      <h4 className={`concept-slot__heading concept-slot__heading--${kind}`}>
        <span className="concept-slot__title">{label}</span>
      </h4>
    );
  }

  return (
    <h4 className="concept-slot__heading">
      <span className="concept-slot__title">{label}</span>
    </h4>
  );
}
