import { describe, expect, it } from "vitest";
import { mergeTags, normalizeTagRegistry, readTagRegistry, removeTag, writeTagRegistry } from "./tagRegistry";

describe("tagRegistry", () => {
  it("normalizes category tags independently", () => {
    expect(
      normalizeTagRegistry({
        common: ["shared", "Shared", "  "],
        images: ["photo"],
        groupObjects: ["lower-third"],
        templates: ["stream"],
      }),
    ).toEqual({
      common: ["shared"],
      images: ["photo"],
      groupObjects: ["lower-third"],
      templates: ["stream"],
    });
  });

  it("merges tags case-insensitively while preserving the first spelling", () => {
    expect(mergeTags(["Shared", "photo"], ["shared", "Photo", "group"])).toEqual(["group", "photo", "Shared"]);
  });

  it("removes a tag case-insensitively", () => {
    expect(removeTag(["Shared", "photo", "group"], "shared")).toEqual(["photo", "group"]);
  });

  it("reads and writes normalized tags from storage", () => {
    const storage = new MemoryStorage();
    writeTagRegistry(
      {
        common: ["shared"],
        images: ["photo"],
        groupObjects: ["group"],
        templates: ["template"],
      },
      storage,
    );

    expect(readTagRegistry(storage)).toEqual({
      common: ["shared"],
      images: ["photo"],
      groupObjects: ["group"],
      templates: ["template"],
    });
  });
});

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}
