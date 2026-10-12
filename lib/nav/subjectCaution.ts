import type { Locale } from "@/lib/i18n/locales";

const SUBJECT_CAUTION_SLUGS = new Set(["vue-nuxt"]);

const TOOLTIPS: Record<Locale, string> = {
  en: "Notes here may be wrong.",
  ru: "Заметки здесь могут быть неточными.",
};

const LABELS: Record<Locale, string> = {
  en: "Caution",
  ru: "Внимание",
};

export function subjectHasCaution(slug: string): boolean {
  return SUBJECT_CAUTION_SLUGS.has(slug);
}

export function subjectCautionTooltip(
  locale: Locale,
  slug: string,
): string | undefined {
  if (!subjectHasCaution(slug)) {
    return undefined;
  }
  return TOOLTIPS[locale];
}

export function subjectCautionLabel(locale: Locale): string {
  return LABELS[locale];
}
