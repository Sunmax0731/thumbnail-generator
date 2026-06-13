import { makeLayerId, normalizeLayer } from "./layerFactory";
import { sanitizeTemplateName, sanitizeTemplateTags } from "./templates";
import type { GroupObjectAsset, ImageAsset, ThumbnailLayer } from "./types";

export const groupObjectStorageKey = "thumbnail-generator.groupObjects.v1";

export function createGroupObjectAsset(
  name: string,
  layers: ThumbnailLayer[],
  assets: ImageAsset[],
  now = new Date(),
  tags: string[] = [],
): GroupObjectAsset {
  const timestamp = now.toISOString();
  return {
    id: `group-object-${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: sanitizeTemplateName(name || "Group object"),
    tags: sanitizeTemplateTags(tags),
    createdAt: timestamp,
    updatedAt: timestamp,
    layers: structuredClone(layers),
    assets: structuredClone(assets),
  };
}

export function readGroupObjects(storage: Pick<Storage, "getItem"> = window.localStorage): GroupObjectAsset[] {
  const raw = storage.getItem(groupObjectStorageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isGroupObjectAsset).map(normalizeGroupObject);
  } catch {
    return [];
  }
}

export function writeGroupObjects(
  groupObjects: GroupObjectAsset[],
  storage: Pick<Storage, "setItem"> = window.localStorage,
): void {
  storage.setItem(groupObjectStorageKey, JSON.stringify(groupObjects));
}

export function addGroupObjectAsset(
  groupObjects: GroupObjectAsset[],
  groupObject: GroupObjectAsset,
): GroupObjectAsset[] {
  return [groupObject, ...groupObjects];
}

export function updateGroupObjectAssetTags(
  groupObjects: GroupObjectAsset[],
  id: string,
  tags: string[],
  now = new Date(),
): GroupObjectAsset[] {
  const normalizedTags = sanitizeTemplateTags(tags);
  return groupObjects.map((groupObject) =>
    groupObject.id === id ? { ...groupObject, tags: normalizedTags, updatedAt: now.toISOString() } : groupObject,
  );
}

export function removeGroupObjectAsset(groupObjects: GroupObjectAsset[], id: string): GroupObjectAsset[] {
  return groupObjects.filter((groupObject) => groupObject.id !== id);
}

export function instantiateGroupObject(
  groupObject: GroupObjectAsset,
  offsetX = 32,
  offsetY = 32,
): { layers: ThumbnailLayer[]; assets: ImageAsset[]; selectedIds: string[] } {
  const groupId = `group-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const groupName = groupObject.name;
  const layers = groupObject.layers.map((layer) =>
    normalizeLayer({
      ...layer,
      id: makeLayerId(layer.type),
      name: layer.name,
      x: layer.x + offsetX,
      y: layer.y + offsetY,
      groupId,
      groupName,
      selectable: layer.selectable !== false,
    } as ThumbnailLayer),
  );
  return {
    layers,
    assets: structuredClone(groupObject.assets),
    selectedIds: layers.map((layer) => layer.id),
  };
}

function normalizeGroupObject(groupObject: GroupObjectAsset): GroupObjectAsset {
  return {
    ...groupObject,
    tags: sanitizeTemplateTags(Array.isArray(groupObject.tags) ? groupObject.tags : []),
    layers: groupObject.layers.map((layer) => normalizeLayer({ ...layer, selectable: layer.selectable !== false })),
    assets: Array.isArray(groupObject.assets) ? groupObject.assets.map(normalizeAssetTags) : [],
  };
}

function normalizeAssetTags(asset: ImageAsset): ImageAsset {
  return {
    ...asset,
    tags: sanitizeTemplateTags(Array.isArray(asset.tags) ? asset.tags : []),
  };
}

function isGroupObjectAsset(value: unknown): value is GroupObjectAsset {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<GroupObjectAsset>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string" &&
    Array.isArray(candidate.layers) &&
    Array.isArray(candidate.assets)
  );
}
