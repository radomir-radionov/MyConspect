import Link from "next/link";

export default function NotFound() {
  return (
    <main className="w-full max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900">Page not found</h1>
      <p className="mt-3 text-zinc-600">That track or topic is not in the handbook.</p>
      <Link className="mt-6 inline-block text-sm font-medium underline" href="/">
        Back to tracks
      </Link>
    </main>
  );
}
