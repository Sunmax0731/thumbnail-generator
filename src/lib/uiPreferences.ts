export const uiPreferenceStoragePrefix = "thumbnail-generator.uiPreferences.v1";

export function readUiBooleanPreference(
  key: string,
  fallback: boolean,
  storage: Pick<Storage, "getItem"> | undefined = typeof window === "undefined" ? undefined : window.localStorage,
): boolean {
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(storageKey(key));
    if (raw === null) return fallback;
    if (raw !== "true" && raw !== "false") return fallback;
    return raw === "true";
  } catch {
    return fallback;
  }
}

export function writeUiBooleanPreference(
  key: string,
  value: boolean,
  storage: Pick<Storage, "setItem"> | undefined = typeof window === "undefined" ? undefined : window.localStorage,
): void {
  if (!storage) return;
  storage.setItem(storageKey(key), String(value));
}

export function readUiNumberPreference(
  key: string,
  fallback: number,
  range: { min: number; max: number },
  storage: Pick<Storage, "getItem"> | undefined = typeof window === "undefined" ? undefined : window.localStorage,
): number {
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(storageKey(key));
    if (raw === null) return fallback;
    const parsed = Number.parseFloat(raw);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(range.max, Math.max(range.min, Math.round(parsed)));
  } catch {
    return fallback;
  }
}

export function writeUiNumberPreference(
  key: string,
  value: number,
  storage: Pick<Storage, "setItem"> | undefined = typeof window === "undefined" ? undefined : window.localStorage,
): void {
  if (!storage) return;
  storage.setItem(storageKey(key), String(Math.round(value)));
}

function storageKey(key: string): string {
  return `${uiPreferenceStoragePrefix}.${key}`;
}
