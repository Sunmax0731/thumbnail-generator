import type { ThumbnailLayer } from "./types";

export function pickLayerAt(layers: ThumbnailLayer[], x: number, y: number): ThumbnailLayer | undefined {
  for (const layer of [...layers].reverse()) {
    if (!layer.visible) continue;
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

