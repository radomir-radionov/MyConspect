import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

type Crumb = { href?: string; label: string };

export function SiteHeader({ crumbs }: { crumbs?: readonly Crumb[] }) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-900">
          {SITE_NAME}
        </Link>
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="text-sm text-zinc-600">
            <ol className="flex flex-wrap items-center gap-1">
              {crumbs.map((crumb, index) => (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                  {index > 0 ? <span aria-hidden="true">/</span> : null}
                  {crumb.href ? (
                    <Link className="underline-offset-2 hover:underline" href={crumb.href}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-zinc-900">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
