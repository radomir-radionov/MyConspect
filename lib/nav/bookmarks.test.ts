import assert from "node:assert/strict";
import test from "node:test";
import { BOOKMARKS_STORAGE_KEY } from "@/constants";
import {
  bookmarkHref,
  clearAllBookmarks,
  isBookmarked,
  readBookmarks,
  removeBookmark,
  resetBookmarksCache,
  toggleBookmark,
} from "./bookmarks";

function installStorage() {
  const store = new Map<string, string>();
  const localStorage = {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage },
  });
}

test("bookmarks toggle topic and concept entries", () => {
  installStorage();
  resetBookmarksCache();

  assert.equal(
    toggleBookmark({
      href: "/en/frontend/react-hooks",
      title: "React Hooks",
    }),
    true,
  );
  assert.equal(isBookmarked("/en/frontend/react-hooks"), true);
  assert.equal(readBookmarks().length, 1);

  assert.equal(
    toggleBookmark({
      href: bookmarkHref("/en/frontend/react-hooks", "use-state"),
      title: "useState",
      conceptId: "use-state",
    }),
    true,
  );
  assert.equal(readBookmarks().length, 2);

  assert.equal(
    toggleBookmark({
      href: "/en/frontend/react-hooks",
      title: "React Hooks",
    }),
    false,
  );
  assert.equal(isBookmarked("/en/frontend/react-hooks"), false);
  assert.equal(readBookmarks().length, 1);

  removeBookmark("/en/frontend/react-hooks", "use-state");
  assert.equal(readBookmarks().length, 0);
  assert.equal(window.localStorage.getItem(BOOKMARKS_STORAGE_KEY), "[]");

  toggleBookmark({
    href: "/en/frontend/react-hooks",
    title: "React Hooks",
  });
  clearAllBookmarks();
  assert.equal(readBookmarks().length, 0);
});
