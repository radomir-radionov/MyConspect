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

export type NavCluster = {
  readonly id: string;
  readonly title: string;
  readonly href: string;
  readonly topics: readonly NavTopic[];
};

export type NavSubject = {
  readonly slug: string;
  readonly href: string;
  readonly title: string;
  readonly blurb: string;
  readonly clusters: readonly NavCluster[];
};

export type NavEntry =
  | { readonly kind: "topic"; readonly topic: NavTopic }
  | { readonly kind: "subject"; readonly subject: NavSubject }
  | {
      readonly kind: "cluster";
      readonly subjectHref: string;
      readonly cluster: NavCluster;
    };

export type NavGroup = {
  readonly id: TrackId;
  readonly title: string;
  readonly href: string;
  readonly entries: readonly NavEntry[];
  readonly leafTopic?: NavTopic;
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
