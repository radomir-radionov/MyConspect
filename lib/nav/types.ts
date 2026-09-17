import type { TrackId } from "@/lib/catalog";

export type SearchMode = "titles" | "notes";

export type InterviewSection = "questions" | "tasks";

export type NavConcept = {
  readonly id: string;
  readonly title: string;
  readonly searchText?: string;
  readonly titleSearchText?: string;
  readonly interviewSection?: InterviewSection;
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
  readonly searchNotesPlaceholder: string;
  readonly searchEmpty: string;
  readonly searchNotesEmpty: string;
  readonly searchMode: string;
  readonly searchModeTitles: string;
  readonly searchModeNotes: string;
  readonly inNotes: string;
  readonly clearSearch: string;
  readonly topicsNav: string;
  readonly openMenu: string;
  readonly closeMenu: string;
  readonly instructions: string;
  readonly back: string;
};
