import type { ThumbnailLayer } from "./types";

export function selectTopSelectableLayerIds(layers: ThumbnailLayer[]): string[] {
  const top = [...layers].reverse().find((layer) => layer.selectable);
  return top ? [top.id] : [];
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
