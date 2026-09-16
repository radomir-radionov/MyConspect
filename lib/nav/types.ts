import type { TrackId } from "@/lib/catalog";

export type NavConcept = {
  readonly id: string;
  readonly title: string;
  readonly searchText?: string;
};

export type NavTopic = {
  readonly slug: string;
  readonly href: string;
  readonly title: string;
  readonly blurb: string;
  readonly concepts: readonly NavConcept[];
};

export type NavGroup = {
  readonly id: TrackId;
  readonly title: string;
  readonly href: string;
  readonly topics: readonly NavTopic[];
};

export type ChromeCopy = {
  readonly searchPlaceholder: string;
  readonly searchEmpty: string;
  readonly clearSearch: string;
  readonly topicsNav: string;
  readonly openMenu: string;
  readonly closeMenu: string;
  readonly instructions: string;
};
