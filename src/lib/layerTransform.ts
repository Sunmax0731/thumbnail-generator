import type { ThumbnailLayer } from "./types";

export interface RelativeLayerTransform {
  deltaX?: number;
  deltaY?: number;
  deltaRotation?: number;
}

export function applyRelativeLayerTransform(
  layers: ThumbnailLayer[],
  selectedIds: string[],
  transform: RelativeLayerTransform,
): ThumbnailLayer[] {
  const selected = new Set(selectedIds);
  const deltaX = finiteOrZero(transform.deltaX);
  const deltaY = finiteOrZero(transform.deltaY);
  const deltaRotation = finiteOrZero(transform.deltaRotation);

  return layers.map((layer) => {
    if (!selected.has(layer.id) || !layer.selectable) return layer;
    return {
      ...layer,
      x: round(layer.x + deltaX),
      y: round(layer.y + deltaY),
      rotation: normalizeDegrees(layer.rotation + deltaRotation),
    };
  });
}

export function matchSelectedLayerRotation(layers: ThumbnailLayer[], selectedIds: string[]): ThumbnailLayer[] {
  const selected = new Set(selectedIds);
  const reference = selectedIds
    .map((id) => layers.find((layer) => layer.id === id && layer.selectable))
    .find((layer): layer is ThumbnailLayer => Boolean(layer));
  if (!reference) return layers;

  return layers.map((layer) => {
    if (!selected.has(layer.id) || !layer.selectable || layer.id === reference.id) return layer;
    return { ...layer, rotation: reference.rotation };
  });
}

function finiteOrZero(value: number | undefined): number {
  return Number.isFinite(value) ? Number(value) : 0;
}

function normalizeDegrees(value: number): number {
  let next = value;
  while (next > 180) next -= 360;
  while (next < -180) next += 360;
  return round(next);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
