import type { ThumbnailLayer } from "./types";
import { getLayerVisualLocalBounds, getLayerVisualLocalCenter } from "./layerVisualBounds";

export type CanvasInteractionMode =
  | "move"
  | "rotate"
  | "resize-nw"
  | "resize-ne"
  | "resize-se"
  | "resize-sw";

export interface CanvasPoint {
  x: number;
  y: number;
}

export const selectionHandleRadius = 16;
export const rotateHandleOffset = 54;
const minLayerSize = 24;

export function pointToCanvas(canvas: HTMLCanvasElement, clientX: number, clientY: number, previewPadding = 0): CanvasPoint {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * canvas.width - previewPadding,
    y: ((clientY - rect.top) / rect.height) * canvas.height - previewPadding,
  };
}

export function getLayerInteractionAt(layer: ThumbnailLayer, point: CanvasPoint): CanvasInteractionMode | null {
  const local = toLayerLocalPoint(layer, point);
  const bounds = getLayerVisualLocalBounds(layer);
  const center = getLayerVisualLocalCenter(layer);
  const handles: Array<[CanvasInteractionMode, CanvasPoint]> = [
    ["resize-nw", { x: bounds.left, y: bounds.top }],
    ["resize-ne", { x: bounds.right, y: bounds.top }],
    ["resize-se", { x: bounds.right, y: bounds.bottom }],
    ["resize-sw", { x: bounds.left, y: bounds.bottom }],
    ["rotate", { x: center.x, y: bounds.top - rotateHandleOffset }],
  ];

  for (const [mode, handle] of handles) {
    if (distance(local, handle) <= selectionHandleRadius * (mode === "rotate" ? 1.25 : 1)) {
      return mode;
    }
  }

  if (
    local.x >= bounds.left &&
    local.x <= bounds.right &&
    local.y >= bounds.top &&
    local.y <= bounds.bottom
  ) {
    return "move";
  }

  return null;
}

export function moveLayer(layer: ThumbnailLayer, start: CanvasPoint, current: CanvasPoint): ThumbnailLayer {
  return {
    ...layer,
    x: layer.x + current.x - start.x,
    y: layer.y + current.y - start.y,
  };
}

export function rotateLayer(layer: ThumbnailLayer, start: CanvasPoint, current: CanvasPoint): ThumbnailLayer {
  const center = layerCenter(layer);
  const startAngle = angleBetween(center, start);
  const currentAngle = angleBetween(center, current);
  return {
    ...layer,
    rotation: normalizeDegrees(layer.rotation + radiansToDegrees(currentAngle - startAngle)),
  };
}

export function resizeLayer(
  layer: ThumbnailLayer,
  mode: Exclude<CanvasInteractionMode, "move" | "rotate">,
  current: CanvasPoint,
): ThumbnailLayer {
  const dragged = toLayerLocalPoint(layer, current);
  const opposite = getOppositeLocalCorner(layer, mode);
  const width = Math.max(minLayerSize, Math.abs(dragged.x - opposite.x));
  const height = Math.max(minLayerSize, Math.abs(dragged.y - opposite.y));
  const localCenter = {
    x: (dragged.x + opposite.x) / 2,
    y: (dragged.y + opposite.y) / 2,
  };
  const worldCenter = fromLayerLocalPoint(layer, localCenter);

  return {
    ...layer,
    x: worldCenter.x - width / 2,
    y: worldCenter.y - height / 2,
    width,
    height,
  };
}

export function toLayerLocalPoint(layer: ThumbnailLayer, point: CanvasPoint): CanvasPoint {
  const center = layerCenter(layer);
  const radians = (-layer.rotation * Math.PI) / 180;
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: dx * Math.cos(radians) - dy * Math.sin(radians),
    y: dx * Math.sin(radians) + dy * Math.cos(radians),
  };
}

export function fromLayerLocalPoint(layer: ThumbnailLayer, point: CanvasPoint): CanvasPoint {
  const center = layerCenter(layer);
  const radians = (layer.rotation * Math.PI) / 180;
  return {
    x: center.x + point.x * Math.cos(radians) - point.y * Math.sin(radians),
    y: center.y + point.x * Math.sin(radians) + point.y * Math.cos(radians),
  };
}

function getOppositeLocalCorner(
  layer: ThumbnailLayer,
  mode: Exclude<CanvasInteractionMode, "move" | "rotate">,
): CanvasPoint {
  const corners: Record<Exclude<CanvasInteractionMode, "move" | "rotate">, CanvasPoint> = {
    "resize-nw": { x: layer.width / 2, y: layer.height / 2 },
    "resize-ne": { x: -layer.width / 2, y: layer.height / 2 },
    "resize-se": { x: -layer.width / 2, y: -layer.height / 2 },
    "resize-sw": { x: layer.width / 2, y: -layer.height / 2 },
  };
  return corners[mode];
}

function layerCenter(layer: ThumbnailLayer): CanvasPoint {
  return {
    x: layer.x + layer.width / 2,
    y: layer.y + layer.height / 2,
  };
}

function angleBetween(center: CanvasPoint, point: CanvasPoint): number {
  return Math.atan2(point.y - center.y, point.x - center.x);
}

function radiansToDegrees(value: number): number {
  return (value * 180) / Math.PI;
}

function normalizeDegrees(value: number): number {
  let next = value;
  while (next > 180) next -= 360;
  while (next < -180) next += 360;
  return Math.round(next * 100) / 100;
}

function distance(a: CanvasPoint, b: CanvasPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
