import Link from "next/link";

export type CardItem = {
  readonly href: string;
  readonly title: string;
  readonly description: string;
};

export function CardGrid({ items }: { items: readonly CardItem[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="block h-full rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
          >
            <h2 className="text-lg font-semibold text-zinc-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{item.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
