import { describe, expect, it } from "vitest";
import {
  readUiBooleanPreference,
  readUiNumberPreference,
  uiPreferenceStoragePrefix,
  writeUiBooleanPreference,
  writeUiNumberPreference,
} from "./uiPreferences";

describe("uiPreferences", () => {
  it("persists boolean UI preferences", () => {
    const storage = createMemoryStorage();

    expect(readUiBooleanPreference("panel.open", true, storage)).toBe(true);
    writeUiBooleanPreference("panel.open", false, storage);

    expect(storage.getItem(`${uiPreferenceStoragePrefix}.panel.open`)).toBe("false");
    expect(readUiBooleanPreference("panel.open", true, storage)).toBe(false);
  });

  it("persists clamped number UI preferences", () => {
    const storage = createMemoryStorage();

    writeUiNumberPreference("timeline.height", 999, storage);
    expect(readUiNumberPreference("timeline.height", 170, { min: 120, max: 640 }, storage)).toBe(640);
  });
});

function createMemoryStorage(): Pick<Storage, "getItem" | "setItem"> {
  const records = new Map<string, string>();
  return {
    getItem: (key) => records.get(key) ?? null,
    setItem: (key, value) => records.set(key, value),
  };
}
