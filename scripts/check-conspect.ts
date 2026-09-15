import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { isTrackId, type TrackId } from "../lib/content/catalog";
import {
  buildAuditReport,
  collectConceptAudits,
  formatAuditMarkdown,
  topicsForAudit,
  uniqueSourceUrls,
  type UrlCheck,
  type UrlCheckStatus,
} from "../lib/content/audit";
import { readTopicFile } from "../lib/content/load";

type CliOptions = {
  readonly track?: TrackId;
  readonly out?: string;
  readonly json: boolean;
  readonly strict: boolean;
  readonly concurrency: number;
};

const USER_AGENT =
  "MyConspect-check-conspect/0.1 (+https://github.com; docs source audit)";

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const topics = topicsForAudit(options.track);
  const rows = collectConceptAudits(topics, readTopicFile);
  const urls = uniqueSourceUrls(rows);
  const urlResults = await checkUrls(urls, options.concurrency);
  const report = buildAuditReport({
    generatedAt: new Date().toISOString(),
    trackFilter: options.track ?? "all",
    rows,
    urlResults,
  });

  const markdown = formatAuditMarkdown(report);
  process.stdout.write(`${markdown}\n`);

  if (options.out) {
    const outPath = path.resolve(options.out);
    await mkdir(path.dirname(outPath), { recursive: true });
    const payload = options.json ? `${JSON.stringify(report, null, 2)}\n` : markdown;
    await writeFile(outPath, payload, "utf8");
    process.stderr.write(`Wrote ${outPath}\n`);
  }

  if (options.strict && report.summary.urlDead > 0) {
    process.exitCode = 1;
  }
}

function parseArgs(argv: string[]): CliOptions {
  let track: TrackId | undefined;
  let out: string | undefined;
  let json = false;
  let strict = false;
  let concurrency = 8;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--track": {
        const value = argv[i + 1];
        i += 1;
        if (!value || !isTrackId(value)) {
          throw new Error(`--track must be frontend, backend, or other`);
        }
        track = value;
        break;
      }
      case "--out": {
        const value = argv[i + 1];
        i += 1;
        if (!value) {
          throw new Error(`--out requires a path`);
        }
        out = value;
        break;
      }
      case "--json":
        json = true;
        break;
      case "--strict":
        strict = true;
        break;
      case "--concurrency": {
        const value = Number(argv[i + 1]);
        i += 1;
        if (!Number.isInteger(value) || value < 1) {
          throw new Error(`--concurrency must be a positive integer`);
        }
        concurrency = value;
        break;
      }
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return { track, out, json, strict, concurrency };
}

function printHelp(): void {
  process.stdout.write(`Check **Source:** URLs in catalog topic files. Does not edit notes.

Usage:
  npx tsx scripts/check-conspect.ts [options]

Options:
  --track frontend|backend|other  Limit to one handbook track
  --out <path>                    Write report (markdown, or JSON with --json)
  --json                          Write JSON when --out is set
  --strict                        Exit 1 if any concept is url-dead
  --concurrency <n>               Parallel URL checks (default 8)
  -h, --help
`);
}

async function checkUrls(
  urls: readonly string[],
  concurrency: number,
): Promise<Map<string, UrlCheck>> {
  const results = new Map<string, UrlCheck>();
  const checks = await mapPool(urls, concurrency, probeUrl);
  for (const check of checks) {
    results.set(check.url, check);
  }
  return results;
}

async function probeUrl(url: string): Promise<UrlCheck> {
  const first = await probeOnce(url);
  if (first.status === "dead" && first.error && first.httpStatus === undefined) {
    return probeOnce(url);
  }
  return first;
}

async function probeOnce(url: string): Promise<UrlCheck> {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "User-Agent": USER_AGENT,
      },
      signal: AbortSignal.timeout(12_000),
    });
    try {
      await response.body?.cancel();
    } catch {
      // Some runtimes close the body when the status is already read.
    }
    return {
      url,
      status: classifyHttp(response.status),
      httpStatus: response.status,
    };
  } catch (error) {
    return {
      url,
      status: "dead",
      error: error instanceof Error ? error.message : "request failed",
    };
  }
}

function classifyHttp(status: number): UrlCheckStatus {
  if (status >= 200 && status < 400) {
    return "ok";
  }
  if (status === 404 || status === 410) {
    return "dead";
  }
  return "warn";
}

async function mapPool<T, R>(
  items: readonly T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function worker(): Promise<void> {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await fn(items[index]);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
