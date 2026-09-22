import type { ChromeCopy } from "@/lib/nav/types";
import type { Locale } from "./locales";

const EN: ChromeCopy = {
  searchPlaceholder: "Search topics…",
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
  collapseSidebar: "Collapse topics",
  expandSidebar: "Expand topics",
  instructions: "Instructions",
  home: "Home",
  breadcrumbs: "Breadcrumb",
  lastUpdated: "Last updated",
  scrollToTop: "Scroll to top",
};

const RU: ChromeCopy = {
  searchPlaceholder: "Поиск тем…",
  searchNotesPlaceholder: "Поиск по заметкам…",
  searchEmpty: "Нет тем или концептов по этому запросу.",
  searchNotesEmpty: "Нет заметок по этому запросу.",
  searchMode: "Режим поиска",
  searchModeTitles: "Темы",
  searchModeNotes: "Заметки",
  inNotes: "В заметках",
  clearSearch: "Очистить поиск",
  topicsNav: "Темы",
  openMenu: "Открыть темы",
  closeMenu: "Закрыть темы",
  collapseSidebar: "Свернуть темы",
  expandSidebar: "Развернуть темы",
  instructions: "Инструкции",
  home: "Главная",
  breadcrumbs: "Навигация",
  lastUpdated: "Обновлено",
  scrollToTop: "Наверх",
};

const BY_LOCALE: Record<Locale, ChromeCopy> = {
  en: EN,
  ru: RU,
};

export function chromeFor(locale: Locale): ChromeCopy {
  return BY_LOCALE[locale];
}

export const FALLBACK_NOTE_BADGE: Record<Locale, string> = {
  en: "English — not translated yet",
  ru: "English — ещё нет перевода",
};
