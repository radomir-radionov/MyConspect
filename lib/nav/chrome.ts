import type { ChromeCopy } from "./types";
import { chromeFor } from "@/lib/i18n/chrome";

/** Unlocalized path; use `instructionsHref(locale)` for links. */
export const INSTRUCTIONS_HREF = "/instructions";

/** @deprecated Prefer chromeFor(locale) */
export const CHROME: ChromeCopy = chromeFor("en");
