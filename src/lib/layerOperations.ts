import type { ThumbnailLayer } from "./types";

export function selectTopSelectableLayerIds(layers: ThumbnailLayer[]): string[] {
  const top = [...layers].reverse().find((layer) => layer.selectable);
  return top ? [top.id] : [];
}

export function selectLayerIdsForLayer(
  layers: ThumbnailLayer[],
  currentSelectedIds: string[],
  layerId: string,
  additive = false,
): string[] {
  const layer = layers.find((candidate) => candidate.id === layerId && candidate.selectable);
  if (!layer) return currentSelectedIds.filter((id) => layers.some((candidate) => candidate.id === id && candidate.selectable));

  const targetIds = layer.groupId
    ? layers
        .filter((candidate) => candidate.selectable && candidate.groupId === layer.groupId)
        .map((candidate) => candidate.id)
    : [layer.id];

  if (!additive) return targetIds;

  const validSelectedIds = currentSelectedIds.filter((id) =>
    layers.some((candidate) => candidate.id === id && candidate.selectable),
  );
  const selected = new Set(validSelectedIds);
  const allTargetsSelected = targetIds.every((id) => selected.has(id));

  if (allTargetsSelected) {
    targetIds.forEach((id) => selected.delete(id));
    return validSelectedIds.filter((id) => selected.has(id));
  }

  return [...validSelectedIds, ...targetIds.filter((id) => !selected.has(id))];
}

export function selectLayerIdsAfterDelete(
  layers: ThumbnailLayer[],
  selectedIds: string[],
  deletedId: string,
): string[] {
  const selectableIds = new Set(layers.filter((layer) => layer.selectable).map((layer) => layer.id));
  const retained = selectedIds.filter((id) => id !== deletedId && selectableIds.has(id));
  return retained.length > 0 ? retained : selectTopSelectableLayerIds(layers);
}
