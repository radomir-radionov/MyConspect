"use client";

import { createContext, useContext } from "react";

export const SearchQueryContext = createContext("");

export function useSearchQuery() {
  return useContext(SearchQueryContext);
}
