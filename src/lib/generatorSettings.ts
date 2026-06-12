export const generatorSettingsStoragePrefix = "thumbnail-generator.generatorSettings.v1";

export function readGeneratorSettings<T>(
  key: string,
  fallback: T,
  storage: Pick<Storage, "getItem"> | undefined = typeof window === "undefined" ? undefined : window.localStorage,
): T {
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(storageKey(key));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? ({ ...fallback, ...parsed } as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeGeneratorSettings<T>(
  key: string,
  settings: T,
  storage: Pick<Storage, "setItem"> | undefined = typeof window === "undefined" ? undefined : window.localStorage,
): void {
  if (!storage) return;
  storage.setItem(storageKey(key), JSON.stringify(settings));
}

function storageKey(key: string): string {
  return `${generatorSettingsStoragePrefix}.${key}`;
}
