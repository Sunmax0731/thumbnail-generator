import { describe, expect, it } from "vitest";
import { readThemeMode, resolveThemeMode, themeStorageKey, writeThemeMode } from "./theme";

describe("theme", () => {
  it("reads supported stored theme modes and falls back to system", () => {
    expect(readThemeMode({ getItem: () => "dark" })).toBe("dark");
    expect(readThemeMode({ getItem: () => "light" })).toBe("light");
    expect(readThemeMode({ getItem: () => "unknown" })).toBe("system");
  });

  it("writes the selected theme mode", () => {
    const written: Record<string, string> = {};
    writeThemeMode("dark", { setItem: (key, value) => { written[key] = value; } });
    expect(written[themeStorageKey]).toBe("dark");
  });

  it("resolves system theme from the preferred color scheme", () => {
    expect(resolveThemeMode("system", true)).toBe("dark");
    expect(resolveThemeMode("system", false)).toBe("light");
    expect(resolveThemeMode("light", true)).toBe("light");
    expect(resolveThemeMode("dark", false)).toBe("dark");
  });
});
