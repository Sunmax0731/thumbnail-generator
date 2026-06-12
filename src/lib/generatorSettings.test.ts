import { describe, expect, it } from "vitest";
import { readGeneratorSettings, writeGeneratorSettings } from "./generatorSettings";

describe("generatorSettings", () => {
  it("round-trips generator settings by key", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };

    writeGeneratorSettings("schedule", { title: "June plan", actionsPerDay: 4 }, storage);
    expect(readGeneratorSettings("schedule", { title: "", actionsPerDay: 1 }, storage)).toEqual({
      title: "June plan",
      actionsPerDay: 4,
    });
  });

  it("falls back when stored JSON is invalid", () => {
    const storage = {
      getItem: () => "{not json",
    };

    expect(readGeneratorSettings("broken", { title: "fallback" }, storage)).toEqual({ title: "fallback" });
  });
});
