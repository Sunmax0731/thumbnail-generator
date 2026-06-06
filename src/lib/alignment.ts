import type { OutputSettings, ThumbnailLayer } from "./types";

export type AlignmentMode = "left" | "center" | "right" | "top" | "middle" | "bottom";

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

  const anchor =
    selected.length === 1
      ? { left: 0, top: 0, right: settings.width, bottom: settings.height, width: settings.width, height: settings.height }
      : boundsFor(selected);

  return layers.map((layer) => {
    if (!selectedIds.includes(layer.id) || !layer.selectable) return layer;
    return alignLayer(layer, anchor, mode);
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
