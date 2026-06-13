import { sanitizeTemplateTag } from "./templates";

export type TagCategory = "common" | "images" | "groupObjects" | "templates";

export interface TagRegistry {
  common: string[];
  images: string[];
  groupObjects: string[];
  templates: string[];
}

export const tagRegistryStorageKey = "thumbnail-generator.tagRegistry.v1";

export const emptyTagRegistry: TagRegistry = {
  common: [],
  images: [],
  groupObjects: [],
  templates: [],
};

export function readTagRegistry(storage: Pick<Storage, "getItem"> = window.localStorage): TagRegistry {
  const raw = storage.getItem(tagRegistryStorageKey);
  if (!raw) return emptyTagRegistry;
  try {
    return normalizeTagRegistry(JSON.parse(raw));
  } catch {
    return emptyTagRegistry;
  }
}

export function writeTagRegistry(
  registry: TagRegistry,
  storage: Pick<Storage, "setItem"> = window.localStorage,
): void {
  storage.setItem(tagRegistryStorageKey, JSON.stringify(normalizeTagRegistry(registry)));
}

export function normalizeTagRegistry(value: unknown): TagRegistry {
  const candidate = value && typeof value === "object" ? (value as Partial<TagRegistry>) : {};
  return {
    common: mergeTags(candidate.common ?? []),
    images: mergeTags(candidate.images ?? []),
    groupObjects: mergeTags(candidate.groupObjects ?? []),
    templates: mergeTags(candidate.templates ?? []),
  };
}

export function mergeTags(...sources: string[][]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const source of sources) {
    for (const tag of source) {
      const normalized = sanitizeTemplateTag(tag);
      const key = normalized.toLocaleLowerCase();
      if (!normalized || seen.has(key)) continue;
      seen.add(key);
      result.push(normalized);
    }
  }
  return result.sort((a, b) => a.localeCompare(b));
}

export function removeTag(tags: string[], tag: string): string[] {
  const key = sanitizeTemplateTag(tag).toLocaleLowerCase();
  return tags.filter((candidate) => sanitizeTemplateTag(candidate).toLocaleLowerCase() !== key);
}
