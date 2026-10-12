import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const RESOURCES_DIR = path.join(process.cwd(), "resources");
const EN_DIR = path.join(RESOURCES_DIR, "en");

function enHasCatalogMarkdown(): boolean {
  if (!fs.existsSync(EN_DIR)) return false;
  return fs
    .readdirSync(EN_DIR)
    .some((name) => name.endsWith(".md") && name !== "0_me.md");
}

function authenticatedCloneUrl(url: string, token: string | undefined): string {
  if (!token) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return url;
    parsed.username = "x-access-token";
    parsed.password = token;
    return parsed.toString();
  } catch {
    return url;
  }
}

function resolveResourcesRoot(cloneRoot: string): string {
  const nested = path.join(cloneRoot, "resources", "en");
  if (fs.existsSync(nested)) return path.join(cloneRoot, "resources");
  const atRoot = path.join(cloneRoot, "en");
  if (fs.existsSync(atRoot)) return cloneRoot;
  throw new Error(
    `Cloned repository has no resources layout (expected resources/en/ or en/ at repo root).`,
  );
}

function fetchFromGit(): void {
  const url = process.env.RESOURCES_GIT_URL?.trim();
  if (!url) {
    throw new Error(
      "Missing study notes: resources/en/ is empty and RESOURCES_GIT_URL is not set.\n" +
        "For local dev, keep resources/ on disk (gitignored on the public repo).\n" +
        "For Vercel/CI, set RESOURCES_GIT_URL (+ RESOURCES_GIT_TOKEN for a private repo). See README § CI/CD.",
    );
  }

  const ref = process.env.RESOURCES_GIT_REF?.trim() || "main";
  const token = process.env.RESOURCES_GIT_TOKEN?.trim();
  const cloneUrl = authenticatedCloneUrl(url, token);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "myconspect-resources-"));

  try {
    execFileSync(
      "git",
      ["clone", "--depth", "1", "--branch", ref, cloneUrl, tmp],
      { stdio: "inherit" },
    );
    const sourceRoot = resolveResourcesRoot(tmp);
    fs.rmSync(RESOURCES_DIR, { recursive: true, force: true });
    fs.cpSync(sourceRoot, RESOURCES_DIR, { recursive: true });
    console.log(`ensure-resources: fetched ${ref} from ${url}`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  if (!enHasCatalogMarkdown()) {
    throw new Error(
      `Fetched repository did not produce catalog markdown under resources/en/.`,
    );
  }
}

function main(): void {
  if (enHasCatalogMarkdown()) {
    console.log("ensure-resources: using local resources/");
    return;
  }
  fetchFromGit();
}

main();
