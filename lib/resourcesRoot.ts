import path from "node:path";

/**
 * Study notes root: directory containing `en/` and `ru/` (or legacy flat `*.md`).
 * Default: `<app>/resources` (CI/Vercel clone). Dev workspace: `MYCONSPECT_NOTES_ROOT=../MyConspect-dev/notes`.
 */
export function resourcesRoot(): string {
  const raw = process.env.MYCONSPECT_NOTES_ROOT?.trim();
  if (raw) {
    return path.resolve(process.cwd(), raw);
  }
  return path.join(process.cwd(), "resources");
}
