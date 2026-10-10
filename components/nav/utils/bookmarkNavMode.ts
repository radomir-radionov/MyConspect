let bookmarkNavMode = false;
const listeners = new Set<() => void>();

function emitBookmarkNavMode() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeBookmarkNavMode(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function getBookmarkNavMode() {
  return bookmarkNavMode;
}

export function getServerBookmarkNavMode() {
  return false;
}

export function setBookmarkNavMode(active: boolean) {
  if (bookmarkNavMode === active) {
    return;
  }
  bookmarkNavMode = active;
  emitBookmarkNavMode();
}
