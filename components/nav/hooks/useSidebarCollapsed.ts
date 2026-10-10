"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getServerSidebarCollapsed,
  readSidebarCollapsed,
  readUi,
  subscribeUi,
  writeUi,
} from "./uiStorage";

export function useSidebarCollapsed() {
  const collapsed = useSyncExternalStore(
    subscribeUi,
    readSidebarCollapsed,
    getServerSidebarCollapsed,
  );

  const expandSidebar = useCallback(() => {
    if (readUi().sidebarCollapsed) {
      writeUi({ sidebarCollapsed: false });
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    writeUi({ sidebarCollapsed: !readUi().sidebarCollapsed });
  }, []);

  return { collapsed, expandSidebar, toggleSidebar };
}
