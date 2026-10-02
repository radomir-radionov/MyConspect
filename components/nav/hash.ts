import { splitHref } from "@/lib/nav";

export function hashIdFrom(hash: string): string {
  return decodeURIComponent(hash.replace(/^#/, ""));
}

export function subscribeHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

export function getHash() {
  return window.location.hash;
}

export function getServerHash() {
  return "";
}

export function dispatchHashChange(scroll?: boolean) {
  if (scroll === undefined) {
    window.dispatchEvent(new Event("hashchange"));
    return;
  }
  window.dispatchEvent(new CustomEvent("hashchange", { detail: { scroll } }));
}

type PendingPathHash = {
  readonly pathname: string;
  readonly hash: string;
};

let pendingPathHash: PendingPathHash | null = null;
const pendingPathListeners = new Set<() => void>();

function notifyPendingPathListeners() {
  for (const listener of pendingPathListeners) {
    listener();
  }
}

export function subscribePendingPath(onStoreChange: () => void) {
  pendingPathListeners.add(onStoreChange);
  return () => pendingPathListeners.delete(onStoreChange);
}

export function getPendingPathname() {
  return pendingPathHash?.pathname ?? "";
}

export function getServerPendingPathname() {
  return "";
}

export function applySameDocumentHref(
  nextPath: string,
  nextHash: string,
  currentPath: string,
): boolean {
  const currentHash = window.location.hash;
  if (nextPath === currentPath && nextHash === currentHash) {
    dispatchHashChange();
    return true;
  }
  if (nextPath === currentPath) {
    window.history.replaceState(
      window.history.state,
      "",
      `${nextPath}${nextHash}`,
    );
    dispatchHashChange();
    return true;
  }
  return false;
}

export function queueHandbookHref(href: string): void {
  const { pathname, hash } = splitHref(href);
  pendingPathHash = { pathname, hash };
  notifyPendingPathListeners();
}

export function followHandbookHref(
  href: string,
  currentPath: string,
  push: (pathname: string) => void,
): void {
  const { pathname, hash } = splitHref(href);
  if (applySameDocumentHref(pathname, hash, currentPath)) {
    return;
  }
  queueHandbookHref(href);
  push(pathname);
}

export function takePendingHashForPath(pathname: string): string | null {
  if (!pendingPathHash) {
    return null;
  }
  if (pendingPathHash.pathname !== pathname) {
    pendingPathHash = null;
    notifyPendingPathListeners();
    return null;
  }
  const { hash } = pendingPathHash;
  pendingPathHash = null;
  notifyPendingPathListeners();
  return hash;
}

export function setHashOnPath(pathname: string, id: string, scroll = true) {
  const next = `#${id}`;
  if (window.location.hash !== next) {
    window.history.replaceState(window.history.state, "", `${pathname}${next}`);
  }
  dispatchHashChange(scroll);
}

export function setHashIfChanged(id: string, scroll = true) {
  const next = `#${id}`;
  if (window.location.hash === next) {
    return false;
  }
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.search}${next}`,
  );
  dispatchHashChange(scroll);
  return true;
}

export function replacePathHash(pathname: string, hash: string) {
  window.history.replaceState(window.history.state, "", `${pathname}${hash}`);
  dispatchHashChange();
}

export function clearConceptHash(scroll = false) {
  const next = `${window.location.pathname}${window.location.search}`;
  if (`${next}${window.location.hash}` !== next) {
    window.history.replaceState(window.history.state, "", next);
  }
  dispatchHashChange(scroll);
}

export function shouldScrollFromHashEvent(event?: Event): boolean {
  if (event == null) {
    return true;
  }
  if (event instanceof CustomEvent) {
    const detail = event.detail as { scroll?: boolean } | undefined;
    return detail?.scroll !== false;
  }
  return true;
}
