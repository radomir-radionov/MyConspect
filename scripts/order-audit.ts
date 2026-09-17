import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { isTrackId, type TrackId } from "../lib/catalog";
import { topicsForAudit } from "../lib/audit";
import {
  auditTopicOrder,
  countOrderIssues,
  formatOrderAuditMarkdown,
} from "../lib/order";
import { readTopicFile } from "../lib/parse";

type CliOptions = {
  readonly track?: TrackId;
  readonly out?: string;
  readonly json: boolean;
  readonly strict: boolean;
};

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const topics = topicsForAudit(options.track);
  const rows = topics.map((topic) => auditTopicOrder(topic, readTopicFile(topic.file)));
  const markdown = formatOrderAuditMarkdown(rows);
  process.stdout.write(`${markdown}\n`);

  if (options.out) {
    const outPath = path.resolve(options.out);
    await mkdir(path.dirname(outPath), { recursive: true });
    const payload = options.json ? `${JSON.stringify(rows, null, 2)}\n` : markdown;
    await writeFile(outPath, payload, "utf8");
    process.stderr.write(`Wrote ${outPath}\n`);
  }

  if (options.strict && countOrderIssues(rows) > 0) {
    process.exitCode = 1;
  }
}

function parseArgs(argv: string[]): CliOptions {
  let track: TrackId | undefined;
  let out: string | undefined;
  let json = false;
  let strict = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--track": {
        const value = argv[i + 1];
        i += 1;
        if (!value || !isTrackId(value)) {
          throw new Error(`--track must be one of: frontend, backend, system-design, algorithms, ai, other`);
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
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return { track, out, json, strict };
}

function printHelp(): void {
  process.stdout.write(`Audit concept order in catalog topic files.

Usage:
  npx tsx scripts/order-audit.ts [options]

Options:
  --track <id>   Limit to one handbook track
  --out <path>   Write report (markdown, or JSON with --json)
  --json         Write JSON when --out is set
  --strict       Exit 1 if any ordering issue is found
  -h, --help
`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
