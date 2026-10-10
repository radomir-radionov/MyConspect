"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { NavGroup } from "@/lib/nav";

const HandbookNavGroupsContext = createContext<readonly NavGroup[] | null>(
  null,
);

export function HandbookNavGroupsProvider({
  groups,
  children,
}: {
  groups: readonly NavGroup[];
  children: ReactNode;
}) {
  return (
    <HandbookNavGroupsContext.Provider value={groups}>
      {children}
    </HandbookNavGroupsContext.Provider>
  );
}

export function useHandbookNavGroups(): readonly NavGroup[] | null {
  return useContext(HandbookNavGroupsContext);
}
