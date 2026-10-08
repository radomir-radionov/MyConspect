"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Concept } from "@/lib/parse";

const TopicNavConceptsContext = createContext<readonly Concept[] | null>(null);

export function TopicNavConceptsProvider({
  concepts,
  children,
}: {
  concepts: readonly Concept[];
  children: ReactNode;
}) {
  return (
    <TopicNavConceptsContext.Provider value={concepts}>
      {children}
    </TopicNavConceptsContext.Provider>
  );
}

export function useTopicNavConcepts(): readonly Concept[] | null {
  return useContext(TopicNavConceptsContext);
}
