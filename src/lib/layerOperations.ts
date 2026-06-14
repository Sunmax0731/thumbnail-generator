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

export function expandLayerIdsForSelection(layers: ThumbnailLayer[], layerIds: string[]): string[] {
  return layerIds.reduce((selectedIds, layerId) => selectLayerIdsForLayer(layers, selectedIds, layerId, true), [] as string[]);
}

export function mergeLayerIdsForRangeSelection(
  layers: ThumbnailLayer[],
  currentSelectedIds: string[],
  rangeLayerIds: string[],
  mode: "replace" | "add" | "subtract",
): string[] {
  const validCurrent = currentSelectedIds.filter((id) => layers.some((layer) => layer.id === id && layer.selectable));
  const rangeIds = expandLayerIdsForSelection(layers, rangeLayerIds);
  if (mode === "replace") return rangeIds;
  if (mode === "subtract") {
    const rangeSet = new Set(rangeIds);
    return validCurrent.filter((id) => !rangeSet.has(id));
  }
  const selected = new Set(validCurrent);
  return [...validCurrent, ...rangeIds.filter((id) => !selected.has(id))];
}

export function selectIndividualLayerId(layers: ThumbnailLayer[], layerId: string): string[] {
  return layers.some((layer) => layer.id === layerId && layer.selectable) ? [layerId] : [];
}

export function selectLayerIdsAfterDelete(
  layers: ThumbnailLayer[],
  selectedIds: string[],
  deletedId: string,
): string[] {
  const selectableIds = new Set(layers.filter((layer) => layer.selectable).map((layer) => layer.id));
  return selectedIds.filter((id) => id !== deletedId && selectableIds.has(id));
}
