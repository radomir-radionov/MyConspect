import fs from "node:fs";
import path from "node:path";
import { TOPICS, getTopic, type Topic } from "@/lib/catalog";
import {
  parseTopicMarkdown,
  parseTopicOutline,
  type ConceptOutline,
  type ParsedTopic,
} from "./parse";

const RESOURCES_DIR = path.join(process.cwd(), "resources");

export function resourcesDir(): string {
  return RESOURCES_DIR;
}

export function readTopicFile(file: string): string {
  const resolved = path.resolve(RESOURCES_DIR, file);
  if (!resolved.startsWith(path.resolve(RESOURCES_DIR))) {
    throw new Error(`Refusing to read outside resources/: ${file}`);
  }
  if (!fs.existsSync(resolved)) {
    throw new Error(`Missing topic file in resources/: ${file}`);
  }
  return fs.readFileSync(resolved, "utf8");
}

export function loadTopicOutline(topic: Topic): readonly ConceptOutline[] {
  return parseTopicOutline(readTopicFile(topic.file));
}

export async function loadParsedTopic(topic: Topic): Promise<ParsedTopic> {
  return parseTopicMarkdown(readTopicFile(topic.file));
}

export async function loadTopicPage(
  track: string,
  slug: string,
): Promise<
  | {
      topic: Topic;
      parsed: ParsedTopic;
    }
  | undefined
> {
  const topic = getTopic(track, slug);
  if (!topic) {
    return undefined;
  }
  return { topic, parsed: await loadParsedTopic(topic) };
}

export function assertCatalogFilesExist(): void {
  for (const topic of TOPICS) {
    readTopicFile(topic.file);
  }
}
