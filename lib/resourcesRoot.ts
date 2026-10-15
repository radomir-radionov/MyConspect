import path from "node:path";

/** Bundled study notes under the app root (CI/Vercel). Keep path literals for Turbopack tracing. */
export function bundledResourcesRoot(): string {
  return path.join(process.cwd(), "resources");
}

/**
 * Study notes root: directory containing `en/` and `ru/` (or legacy flat `*.md`).
 * Default: `<app>/resources` (CI/Vercel clone). Dev workspace: `MYCONSPECT_NOTES_ROOT=../mc-content`.
 */
export function resourcesRoot(): string {
  const raw = process.env.MYCONSPECT_NOTES_ROOT?.trim();
  if (raw) {
    return path.resolve(/* turbopackIgnore: true */ process.cwd(), raw);
  }
  return bundledResourcesRoot();
}
