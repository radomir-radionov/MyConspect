import type { ChromeCopy } from "./types";

export const INSTRUCTIONS_HREF = "/instructions";

export const CHROME: ChromeCopy = {
  searchPlaceholder: "Search topics and concepts…",
  searchNotesPlaceholder: "Search in notes…",
  searchEmpty: "No topics or concepts match that search.",
  searchNotesEmpty: "No notes match that search.",
  searchMode: "Search mode",
  searchModeTitles: "Topics",
  searchModeNotes: "Notes",
  inNotes: "In notes",
  clearSearch: "Clear search",
  topicsNav: "Topics",
  openMenu: "Open topics",
  closeMenu: "Close topics",
  instructions: "Instructions",
  back: "Back",
};

export function backToLabel(title: string): string {
  return `Back to ${title}`;
}
