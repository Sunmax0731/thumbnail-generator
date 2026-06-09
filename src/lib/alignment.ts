import type { OutputSettings, ThumbnailLayer } from "./types";

export type AlignmentMode = "left" | "center" | "right" | "top" | "middle" | "bottom" | "distribute-horizontal" | "distribute-vertical";

interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export function alignLayers(
  layers: ThumbnailLayer[],
  selectedIds: string[],
  settings: Pick<OutputSettings, "width" | "height">,
  mode: AlignmentMode,
): ThumbnailLayer[] {
  const selected = layers.filter((layer) => selectedIds.includes(layer.id) && layer.selectable);
  if (selected.length === 0) return layers;
  if (mode === "distribute-horizontal" || mode === "distribute-vertical") return distributeLayers(layers, selectedIds, mode);

  const anchor =
    selected.length === 1
      ? { left: 0, top: 0, right: settings.width, bottom: settings.height, width: settings.width, height: settings.height }
      : boundsFor(selected);

  return layers.map((layer) => {
    if (!selectedIds.includes(layer.id) || !layer.selectable) return layer;
    return alignLayer(layer, anchor, mode);
  });
}

function distributeLayers(layers: ThumbnailLayer[], selectedIds: string[], mode: "distribute-horizontal" | "distribute-vertical"): ThumbnailLayer[] {
  const selected = layers.filter((layer) => selectedIds.includes(layer.id) && layer.selectable);
  if (selected.length < 3) return layers;

  const axis = mode === "distribute-horizontal" ? "x" : "y";
  const sizeKey = mode === "distribute-horizontal" ? "width" : "height";
  const sorted = [...selected].sort((left, right) => {
    const leftCenter = left[axis] + left[sizeKey] / 2;
    const rightCenter = right[axis] + right[sizeKey] / 2;
    return leftCenter - rightCenter;
  });
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const firstCenter = first[axis] + first[sizeKey] / 2;
  const lastCenter = last[axis] + last[sizeKey] / 2;
  const step = (lastCenter - firstCenter) / (sorted.length - 1);
  if (!Number.isFinite(step) || step === 0) return layers;

  const nextPositions = new Map<string, number>();
  sorted.forEach((layer, index) => {
    nextPositions.set(layer.id, firstCenter + step * index - layer[sizeKey] / 2);
  });

  return layers.map((layer) => {
    const position = nextPositions.get(layer.id);
    if (position === undefined) return layer;
    return mode === "distribute-horizontal" ? { ...layer, x: position } : { ...layer, y: position };
  });
}

export function boundsFor(layers: ThumbnailLayer[]): Bounds {
  const left = Math.min(...layers.map((layer) => layer.x));
  const top = Math.min(...layers.map((layer) => layer.y));
  const right = Math.max(...layers.map((layer) => layer.x + layer.width));
  const bottom = Math.max(...layers.map((layer) => layer.y + layer.height));
  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}

function alignLayer(layer: ThumbnailLayer, anchor: Bounds, mode: AlignmentMode): ThumbnailLayer {
  if (mode === "left") return { ...layer, x: anchor.left };
  if (mode === "center") return { ...layer, x: anchor.left + (anchor.width - layer.width) / 2 };
  if (mode === "right") return { ...layer, x: anchor.right - layer.width };
  if (mode === "top") return { ...layer, y: anchor.top };
  if (mode === "middle") return { ...layer, y: anchor.top + (anchor.height - layer.height) / 2 };
  return { ...layer, y: anchor.bottom - layer.height };
}
