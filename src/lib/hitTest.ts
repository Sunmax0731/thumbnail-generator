import type { ThumbnailLayer } from "./types";
import { getLayerInteractionAt, type CanvasInteractionMode, type CanvasPoint } from "./canvasInteraction";

export interface LayerInteractionPick {
  layer: ThumbnailLayer;
  mode: CanvasInteractionMode;
}

export function pickLayerAt(layers: ThumbnailLayer[], x: number, y: number): ThumbnailLayer | undefined {
  for (const layer of [...layers].reverse()) {
    if (!layer.visible || !layer.selectable) continue;
    const centerX = layer.x + layer.width / 2;
    const centerY = layer.y + layer.height / 2;
    const radians = (-layer.rotation * Math.PI) / 180;
    const dx = x - centerX;
    const dy = y - centerY;
    const localX = dx * Math.cos(radians) - dy * Math.sin(radians);
    const localY = dx * Math.sin(radians) + dy * Math.cos(radians);
    if (
      localX >= -layer.width / 2 &&
      localX <= layer.width / 2 &&
      localY >= -layer.height / 2 &&
      localY <= layer.height / 2
    ) {
      return layer;
    }
  }
  return undefined;
}

export function pickLayerInteractionAt(
  layers: ThumbnailLayer[],
  point: CanvasPoint,
  selectedLayer?: ThumbnailLayer,
): LayerInteractionPick | undefined {
  const selectedMode = selectedLayer ? getLayerInteractionAt(selectedLayer, point) : null;
  if (selectedLayer && selectedMode && selectedMode !== "move") {
    return { layer: selectedLayer, mode: selectedMode };
  }

  const picked = pickLayerAt(layers, point.x, point.y);
  if (picked) {
    return { layer: picked, mode: "move" };
  }

  if (selectedLayer && selectedMode === "move") {
    return { layer: selectedLayer, mode: "move" };
  }

  return undefined;
}
