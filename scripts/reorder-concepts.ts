import { writeFile } from "node:fs/promises";
import path from "node:path";
import { TOPICS, isTrackId, type TrackId } from "../lib/catalog";
import { auditTopicOrder, reorderTopicMarkdown } from "../lib/order";
import { DEFAULT_LOCALE, isLocale, type Locale } from "../lib/i18n/locales";
import { collectConceptBlocks, readTopicFile, resourcesDir } from "../lib/parse";

type CliOptions = {
  readonly track?: TrackId;
  readonly file?: string;
  readonly dryRun: boolean;
  readonly locale: Locale;
};

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const topics = TOPICS.filter((topic) => {
    if (options.file && topic.file !== options.file) {
      return false;
    }
    if (options.track && topic.track !== options.track) {
      return false;
    }
    return true;
  });

  let changedFiles = 0;
  for (const topic of topics) {
    const current = readTopicFile(topic.file, options.locale);
    const result = reorderTopicMarkdown(topic, current);
    const afterAudit = auditTopicOrder(topic, result.markdown);
    const beforeCount = collectConceptBlocks(current).length;
    const afterCount = collectConceptBlocks(result.markdown).length;
    if (afterCount < beforeCount) {
      process.stderr.write(
        `\n${topic.file}\n  - skipped write: would drop concepts (${beforeCount} → ${afterCount})\n`,
      );
      continue;
    }
    if (!result.changed) {
      continue;
    }
    changedFiles += 1;
    process.stderr.write(`\n${topic.file}\n`);
    for (const change of result.changes) {
      process.stderr.write(`  - ${change}\n`);
    }
    if (afterAudit.issues.length > 0) {
      process.stderr.write(`  remaining issues: ${afterAudit.issues.length}\n`);
    }
    if (!options.dryRun) {
      const target = path.join(resourcesDir(options.locale), topic.file);
      await writeFile(target, result.markdown, "utf8");
    }
  }

  process.stdout.write(
    `${options.dryRun ? "Would update" : "Updated"} ${changedFiles} / ${topics.length} topic files.\n`,
  );
}

function parseArgs(argv: string[]): CliOptions {
  let track: TrackId | undefined;
  let file: string | undefined;
  let dryRun = false;
  let locale: Locale = DEFAULT_LOCALE;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--track": {
        const value = argv[i + 1];
        i += 1;
        if (!value || !isTrackId(value)) {
          throw new Error(`--track must be a valid track id`);
        }
        track = value;
        break;
      }
      case "--file": {
        const value = argv[i + 1];
        i += 1;
        if (!value) {
          throw new Error(`--file requires a resources filename`);
        }
        file = value;
        break;
      }
      case "--locale": {
        const value = argv[i + 1];
        i += 1;
        if (!value || !isLocale(value)) {
          throw new Error(`--locale must be a valid locale`);
        }
        locale = value;
        break;
      }
      case "--dry-run":
        dryRun = true;
        break;
      case "--help":
      case "-h":
        process.stdout.write(`Reorder concepts in catalog topic markdown files.

Usage:
  npx tsx scripts/reorder-concepts.ts [options]

Options:
  --track <id>     Limit to one handbook track
  --file <name>    Limit to one resources/*.md file
  --locale <code>  en | ru (default: en)
  --dry-run        Print changes without writing files
  -h, --help
`);
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return { track, file, dryRun, locale };
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
