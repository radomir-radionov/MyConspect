import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader crumbs={[{ href: "/", label: "Tracks" }, { label: "Not found" }]} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold text-zinc-900">Page not found</h1>
        <p className="mt-3 text-zinc-600">That track or topic is not in the handbook.</p>
        <Link className="mt-6 inline-block text-sm font-medium underline" href="/">
          Back to tracks
        </Link>
      </main>
    </>
  );
}
