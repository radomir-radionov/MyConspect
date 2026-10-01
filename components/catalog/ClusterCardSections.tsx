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
  rootSections,
}: {
  sections?: readonly ClusterSection[];
  rootSections?: readonly ClusterSection[];
  groupedSections?: readonly {
    readonly section: {
      readonly id: string;
      readonly title: string;
      readonly defaultOpen?: boolean;
    };
    readonly clusters: readonly ClusterSection[];
  }[];
}) {
  if (groupedSections?.length || rootSections?.length) {
    return (
      <div className="catalog-sections mt-8 space-y-4">
        {rootSections?.length ? (
          <div className="space-y-6 sm:space-y-10">
            <ClusterBlocks sections={rootSections} />
          </div>
        ) : null}
        {groupedSections?.map(({ section, clusters }) => (
          <details
            key={section.id}
            id={section.id}
            className="catalog-section scroll-mt-24 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            open={section.defaultOpen ?? true}
          >
            <summary className="cursor-pointer px-4 py-3 text-left text-xl font-semibold tracking-tight text-zinc-900 sm:px-5 sm:py-4 dark:text-zinc-50">
              {section.title}
            </summary>
            <div className="space-y-6 border-t border-zinc-200 px-4 pt-4 pb-5 sm:space-y-10 sm:px-5 sm:pb-6 dark:border-zinc-800">
              {clusters.length === 0 ? (
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  No topics yet.
                </p>
              ) : (
                <ClusterBlocks sections={clusters} />
              )}
            </div>
          </details>
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
