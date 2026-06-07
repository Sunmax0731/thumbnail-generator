import { describe, expect, it } from "vitest";
import {
  createEditStateSnapshot,
  deleteSavedEditState,
  editStatePreferenceStorageKey,
  editStateStorageKey,
  parseEditStateJson,
  readEditStatePreferences,
  readSavedEditState,
  serializeEditState,
  writeEditStatePreferences,
  writeSavedEditState,
} from "./editState";
import { makeTextLayer } from "./layerFactory";
import { defaultOutputSettings } from "./presets";

describe("editState", () => {
  it("creates a restorable browser edit state snapshot", () => {
    const snapshot = createEditStateSnapshot(
      [makeTextLayer({ text: "SAVED" })],
      [],
      defaultOutputSettings,
      "",
      "",
      "  Work in progress  ",
      new Date("2026-06-07T00:00:00Z"),
    );

    expect(snapshot.updatedAt).toBe("2026-06-07T00:00:00.000Z");
    expect(snapshot.templateName).toBe("Work in progress");
    expect(snapshot.csv).toContain("SAVED");
    expect(snapshot.html).toContain("SAVED");
  });

  it("reads and writes edit state and autosave preferences", () => {
    const storage = createMemoryStorage();
    const snapshot = createEditStateSnapshot(
      [makeTextLayer({ text: "RESTORE", selectable: false })],
      [],
      defaultOutputSettings,
      "csv",
      "html",
      "Draft",
    );

    writeSavedEditState(snapshot, storage);
    writeEditStatePreferences({ autoSaveEnabled: true }, storage);

    expect(storage.getItem(editStateStorageKey)).toContain("RESTORE");
    expect(storage.getItem(editStatePreferenceStorageKey)).toContain("true");
    expect(readSavedEditState(storage)?.layers[0].selectable).toBe(false);
    expect(readEditStatePreferences(storage).autoSaveEnabled).toBe(true);
  });

  it("falls back when stored records are invalid", () => {
    const storage = createMemoryStorage();
    storage.setItem(editStateStorageKey, "{bad");
    storage.setItem(editStatePreferenceStorageKey, "{bad");

    expect(readSavedEditState(storage)).toBeNull();
    expect(readEditStatePreferences(storage).autoSaveEnabled).toBe(false);
  });

  it("serializes, parses, and deletes saved edit state JSON", () => {
    const storage = createMemoryStorage();
    const snapshot = createEditStateSnapshot(
      [makeTextLayer({ text: "PORTABLE" })],
      [],
      defaultOutputSettings,
      "csv",
      "html",
      "Portable",
    );

    const parsed = parseEditStateJson(serializeEditState(snapshot));
    expect(parsed?.templateName).toBe("Portable");

    writeSavedEditState(snapshot, storage);
    deleteSavedEditState(storage);
    expect(storage.getItem(editStateStorageKey)).toBeNull();
  });
});

function createMemoryStorage(): Pick<Storage, "getItem" | "setItem" | "removeItem"> {
  const records = new Map<string, string>();
  return {
    getItem: (key) => records.get(key) ?? null,
    setItem: (key, value) => records.set(key, value),
    removeItem: (key) => records.delete(key),
  };
}
