export type ThemeMode = "system" | "light" | "dark";
export type EffectiveTheme = "light" | "dark";

export const themeStorageKey = "thumbnail-generator.theme.v1";

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

export function readThemeMode(storage: Pick<Storage, "getItem"> = localStorage): ThemeMode {
  const stored = storage.getItem(themeStorageKey);
  return isThemeMode(stored) ? stored : "system";
}

export function writeThemeMode(mode: ThemeMode, storage: Pick<Storage, "setItem"> = localStorage): void {
  storage.setItem(themeStorageKey, mode);
}

export function resolveThemeMode(mode: ThemeMode, prefersDark: boolean): EffectiveTheme {
  if (mode === "system") return prefersDark ? "dark" : "light";
  return mode;
}
