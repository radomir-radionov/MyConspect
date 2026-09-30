import { CardGrid } from "./CardGrid";
import type { BrowseCard } from "@/lib/catalog";

type ClusterSection = {
  readonly cluster: {
    readonly id: string;
    readonly title: string;
    readonly blurb: string;
  };
  readonly items: readonly BrowseCard[];
};

function isCompactSectionList(sections: readonly ClusterSection[]) {
  return (
    sections.length > 0 &&
    sections.every((section) => section.items.length === 1)
  );
}

function compactSectionItems(sections: readonly ClusterSection[]) {
  return sections.map(({ cluster, items }) => ({
    ...items[0],
    id: cluster.id,
  }));
}

function ClusterBlocks({ sections }: { sections: readonly ClusterSection[] }) {
  if (isCompactSectionList(sections)) {
    return <CardGrid items={compactSectionItems(sections)} />;
  }

  return (
    <>
      {sections.map(({ cluster, items }) => (
        <section key={cluster.id} id={cluster.id} className="scroll-mt-24">
          {items.length === 1 ? null : (
            <>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {cluster.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {cluster.blurb}
              </p>
            </>
          )}
          <div className={items.length === 1 ? undefined : "mt-4"}>
            <CardGrid items={items} />
          </div>
        </section>
      ))}
    </>
  );
}

export function ClusterCardSections({
  sections,
  groupedSections,
}: {
  sections?: readonly ClusterSection[];
  groupedSections?: readonly {
    readonly section: { readonly id: string; readonly title: string };
    readonly clusters: readonly ClusterSection[];
  }[];
}) {
  if (groupedSections?.length) {
    return (
      <div className="mt-8 space-y-8 sm:space-y-12">
        {groupedSections.map(({ section, clusters }) => (
          <div
            key={section.id}
            id={section.id}
            className="scroll-mt-24 space-y-6 sm:space-y-10"
          >
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {section.title}
            </h2>
            <ClusterBlocks sections={clusters} />
          </div>
        ))}
      </div>
    );
  }

  const flatSections = sections ?? [];
  const compact = isCompactSectionList(flatSections);

  return (
    <div className={compact ? "mt-8" : "mt-8 space-y-6 sm:space-y-10"}>
      <ClusterBlocks sections={flatSections} />
    </div>
  );
}
