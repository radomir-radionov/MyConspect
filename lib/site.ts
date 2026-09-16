export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) {
    return `https://${vercel.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

export const SITE_NAME = "MyConspect";
export const SITE_DESCRIPTION =
  "A browse-only study handbook of frontend, backend, system design, algorithms, AI, and related concepts.";

