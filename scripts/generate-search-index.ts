import "./load-env";
import fs from "node:fs";
import path from "node:path";
import { TRACKS, type TrackId } from "@/lib/catalog";
import { LOCALES, type Locale } from "@/lib/i18n/locales";
import { handbookNavForTrack } from "@/lib/nav/handbook";

const OUTPUT_ROOT = path.join(process.cwd(), "public", "search-index");

function writeTrackIndex(locale: Locale, trackId: TrackId): number {
  const groups = handbookNavForTrack(locale, trackId);
  if (groups.length === 0) {
    return 0;
  }
  const dir = path.join(OUTPUT_ROOT, locale);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${trackId}.json`);
  const payload = JSON.stringify(groups);
  fs.writeFileSync(file, payload, "utf8");
  return payload.length;
}

function main() {
  if (fs.existsSync(OUTPUT_ROOT)) {
    fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
  }

  let files = 0;
  let bytes = 0;

  for (const locale of LOCALES) {
    const trackIds: TrackId[] = [];
    for (const track of TRACKS) {
      const size = writeTrackIndex(locale, track.id);
      if (size === 0) {
        continue;
      }
      trackIds.push(track.id);
      files += 1;
      bytes += size;
    }
    const manifestDir = path.join(OUTPUT_ROOT, locale);
    fs.mkdirSync(manifestDir, { recursive: true });
    fs.writeFileSync(
      path.join(manifestDir, "manifest.json"),
      JSON.stringify({ tracks: trackIds }),
      "utf8",
    );
  }

  console.log(
    `search-index: ${files} track files (${(bytes / 1024 / 1024).toFixed(2)} MB)`,
  );
}

main();
