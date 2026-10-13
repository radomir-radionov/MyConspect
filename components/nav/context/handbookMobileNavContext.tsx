"use client";

import { createContext, useContext } from "react";

const HandbookMobileNavOpenContext = createContext(false);

export function HandbookMobileNavProvider({
  navOpen,
  children,
}: {
  navOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <HandbookMobileNavOpenContext.Provider value={navOpen}>
      {children}
    </HandbookMobileNavOpenContext.Provider>
  );
}

export function useHandbookMobileNavOpen() {
  return useContext(HandbookMobileNavOpenContext);
}
