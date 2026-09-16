"use client";

import { createContext, useContext } from "react";
import type { SearchMode } from "@/lib/nav";

export type SearchQueryValue = {
  readonly query: string;
  readonly mode: SearchMode;
};

export const SearchQueryContext = createContext<SearchQueryValue>({
  query: "",
  mode: "titles",
});

export function useSearchQuery() {
  return useContext(SearchQueryContext).query;
}

export function useSearchMode() {
  return useContext(SearchQueryContext).mode;
}
