"use client";

export function NavCautionBadge({
  label,
  tip,
}: {
  label: string;
  tip: string;
}) {
  return (
    <span
      className="nav-caution"
      data-tip={tip}
      title={tip}
      tabIndex={0}
      role="note"
      aria-label={tip}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <span aria-hidden="true" className="nav-caution__mark">
        !
      </span>
      <span className="sr-only">{label}: </span>
      <span className="sr-only">{tip}</span>
    </span>
  );
}
