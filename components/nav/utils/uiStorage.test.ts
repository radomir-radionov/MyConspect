import assert from "node:assert/strict";
import test from "node:test";
import { UI_STORAGE_KEY } from "@/constants";
import { readUi, writeUi } from "./uiStorage";

test("readUi falls back to defaults after localStorage is cleared", () => {
  const previous = globalThis.localStorage;
  const previousWindow = globalThis.window;
  const store = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: localStorage,
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { ...globalThis, localStorage },
  });

  try {
    writeUi({ mode: "notes", query: "useState" });
    assert.equal(readUi().mode, "notes");

    store.delete(UI_STORAGE_KEY);
    assert.equal(readUi().mode, "titles");
    assert.equal(readUi().query, "");
  } finally {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: previous,
    });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: previousWindow,
    });
  }
});
