import Link from "next/link";

export type CardItem = {
  readonly href: string;
  readonly title: string;
  readonly description: string;
  readonly id?: string;
  sdffdsfs;
};

export function CardGrid({ items }: { items: readonly CardItem[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2 sm:gap-4">
      {items.map((item) => (
        <li
          key={item.href}
          id={item.id}
          className={item.id ? "scroll-mt-24" : undefined}
        >
          <Link
            href={item.href}
            className="block h-full rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {item.title}
            </h2>
            {item.description ? (
              <p className="mt-1.5 text-sm leading-6 text-zinc-600 sm:mt-2 dark:text-zinc-400">
                {item.description}
              </p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
