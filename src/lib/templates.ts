import { layersToCsv, layersToHtml } from "./layoutExport";
import { normalizeLayer } from "./layerFactory";
import type { ImageAsset, OutputSettings, ThumbnailLayer } from "./types";

export const templateStorageKey = "thumbnail-generator.savedTemplates.v1";

export interface SavedTemplate {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  settings: OutputSettings;
  layers: ThumbnailLayer[];
  assets: ImageAsset[];
  csv: string;
  html: string;
}

export function createTemplateSnapshot(
  name: string,
  layers: ThumbnailLayer[],
  assets: ImageAsset[],
  settings: OutputSettings,
  now = new Date(),
): SavedTemplate {
  const timestamp = now.toISOString();
  return {
    id: `template-${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: sanitizeTemplateName(name),
    createdAt: timestamp,
    updatedAt: timestamp,
    settings: structuredClone(settings),
    layers: structuredClone(layers),
    assets: structuredClone(assets),
    csv: layersToCsv(layers),
    html: layersToHtml(layers),
  };
}

export function sanitizeTemplateName(name: string): string {
  const trimmed = name.trim().replace(/\s+/g, " ");
  return trimmed || "Untitled template";
}

export function readSavedTemplates(storage: Pick<Storage, "getItem"> = window.localStorage): SavedTemplate[] {
  const raw = storage.getItem(templateStorageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedTemplate).map(normalizeTemplate);
  } catch {
    return [];
  }
}

export function writeSavedTemplates(
  templates: SavedTemplate[],
  storage: Pick<Storage, "setItem"> = window.localStorage,
): void {
  storage.setItem(templateStorageKey, JSON.stringify(templates));
}

export function upsertTemplate(templates: SavedTemplate[], template: SavedTemplate): SavedTemplate[] {
  return [template, ...templates];
}

function normalizeTemplate(template: SavedTemplate): SavedTemplate {
  return {
    ...template,
    layers: template.layers.map((layer) => normalizeLayer({ ...layer, selectable: layer.selectable !== false })),
  };
}

function isSavedTemplate(value: unknown): value is SavedTemplate {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SavedTemplate>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string" &&
    Array.isArray(candidate.layers) &&
    Array.isArray(candidate.assets) &&
    typeof candidate.csv === "string" &&
    typeof candidate.html === "string" &&
    Boolean(candidate.settings)
  );
}
