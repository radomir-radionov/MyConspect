import { CardGrid } from "./CardGrid";
import type { BrowseCard } from "@/lib/catalog";

export function ClusterCardSections({
  sections,
}: {
  sections: readonly {
    readonly cluster: { readonly id: string; readonly title: string; readonly blurb: string };
    readonly items: readonly BrowseCard[];
  }[];
}) {
  return (
    <div className="mt-8 space-y-10">
      {sections.map(({ cluster, items }) => (
        <section key={cluster.id} id={cluster.id} className="scroll-mt-24">
          {items.length === 1 ? null : (
            <>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{cluster.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">{cluster.blurb}</p>
            </>
          )}
          <div className={items.length === 1 ? undefined : "mt-4"}>
            <CardGrid items={items} />
          </div>
        </section>
      ))}
    </div>
  );
}
