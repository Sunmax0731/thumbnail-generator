import { layersToCsv, layersToHtml } from "./layoutExport";
import { normalizeLayer } from "./layerFactory";
import type { ImageAsset, OutputSettings, ThumbnailLayer } from "./types";

export const editStateStorageKey = "thumbnail-generator.editState.v1";
export const editStatePreferenceStorageKey = "thumbnail-generator.editState.preferences.v1";

export interface SavedEditState {
  version: 1;
  updatedAt: string;
  settings: OutputSettings;
  layers: ThumbnailLayer[];
  assets: ImageAsset[];
  csv: string;
  html: string;
  templateName: string;
}

export interface EditStatePreferences {
  autoSaveEnabled: boolean;
}

export function createEditStateSnapshot(
  layers: ThumbnailLayer[],
  assets: ImageAsset[],
  settings: OutputSettings,
  csv: string,
  html: string,
  templateName: string,
  now = new Date(),
): SavedEditState {
  return {
    version: 1,
    updatedAt: now.toISOString(),
    settings: structuredClone(settings),
    layers: structuredClone(layers),
    assets: structuredClone(assets),
    csv: csv || layersToCsv(layers),
    html: html || layersToHtml(layers),
    templateName: templateName.trim() || "My thumbnail template",
  };
}

export function readSavedEditState(storage: Pick<Storage, "getItem"> = window.localStorage): SavedEditState | null {
  const raw = storage.getItem(editStateStorageKey);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return isSavedEditState(parsed) ? normalizeSavedEditState(parsed) : null;
  } catch {
    return null;
  }
}

export function writeSavedEditState(
  state: SavedEditState,
  storage: Pick<Storage, "setItem"> = window.localStorage,
): void {
  storage.setItem(editStateStorageKey, JSON.stringify(state));
}

export function readEditStatePreferences(
  storage: Pick<Storage, "getItem"> = window.localStorage,
): EditStatePreferences {
  const raw = storage.getItem(editStatePreferenceStorageKey);
  if (!raw) return { autoSaveEnabled: false };
  try {
    const parsed = JSON.parse(raw);
    return { autoSaveEnabled: Boolean(parsed?.autoSaveEnabled) };
  } catch {
    return { autoSaveEnabled: false };
  }
}

export function writeEditStatePreferences(
  preferences: EditStatePreferences,
  storage: Pick<Storage, "setItem"> = window.localStorage,
): void {
  storage.setItem(editStatePreferenceStorageKey, JSON.stringify(preferences));
}

function normalizeSavedEditState(state: SavedEditState): SavedEditState {
  return {
    ...state,
    layers: state.layers.map((layer) => normalizeLayer({ ...layer, selectable: layer.selectable !== false })),
  };
}

function isSavedEditState(value: unknown): value is SavedEditState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SavedEditState>;
  return (
    candidate.version === 1 &&
    typeof candidate.updatedAt === "string" &&
    Boolean(candidate.settings) &&
    Array.isArray(candidate.layers) &&
    Array.isArray(candidate.assets) &&
    typeof candidate.csv === "string" &&
    typeof candidate.html === "string" &&
    typeof candidate.templateName === "string"
  );
}
