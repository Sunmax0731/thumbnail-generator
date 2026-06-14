import type { ThumbnailLayer } from "./types";
import { getLayerInteractionAt, type CanvasInteractionMode, type CanvasPoint } from "./canvasInteraction";
import { getLayerSelectionLocalBounds } from "./layerVisualBounds";

export interface LayerInteractionPick {
  layer: ThumbnailLayer;
  mode: CanvasInteractionMode;
}

export interface SelectionRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
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
    const bounds = getLayerSelectionLocalBounds(layer);
    if (
      localX >= bounds.left &&
      localX <= bounds.right &&
      localY >= bounds.top &&
      localY <= bounds.bottom
    ) {
      return layer;
    }
  }
  return undefined;
}

export function pickLayersInRect(layers: ThumbnailLayer[], rect: SelectionRect): ThumbnailLayer[] {
  const normalized = normalizeRect(rect);
  const selectedGroupIds = new Set<string>();
  const picked: ThumbnailLayer[] = [];

  for (const layer of layers) {
    if (!layer.visible || !layer.selectable) continue;
    if (layer.groupId) {
      if (selectedGroupIds.has(layer.groupId)) continue;
      const groupLayers = layers.filter((candidate) => candidate.visible && candidate.selectable && candidate.groupId === layer.groupId);
      const groupBounds = mergeRects(groupLayers.map(getLayerWorldBounds));
      if (groupBounds && rectContainsRect(normalized, groupBounds)) {
        selectedGroupIds.add(layer.groupId);
        picked.push(...groupLayers);
      }
      continue;
    }
    if (rectContainsRect(normalized, getLayerWorldBounds(layer))) picked.push(layer);
  }

  return picked;
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

function normalizeRect(rect: SelectionRect): SelectionRect {
  return {
    left: Math.min(rect.left, rect.right),
    top: Math.min(rect.top, rect.bottom),
    right: Math.max(rect.left, rect.right),
    bottom: Math.max(rect.top, rect.bottom),
  };
}

function getLayerWorldBounds(layer: ThumbnailLayer): SelectionRect {
  const bounds = getLayerSelectionLocalBounds(layer);
  const centerX = layer.x + layer.width / 2;
  const centerY = layer.y + layer.height / 2;
  const radians = (layer.rotation * Math.PI) / 180;
  const corners = [
    { x: bounds.left, y: bounds.top },
    { x: bounds.right, y: bounds.top },
    { x: bounds.right, y: bounds.bottom },
    { x: bounds.left, y: bounds.bottom },
  ].map((point) => ({
    x: centerX + point.x * Math.cos(radians) - point.y * Math.sin(radians),
    y: centerY + point.x * Math.sin(radians) + point.y * Math.cos(radians),
  }));
  return {
    left: Math.min(...corners.map((point) => point.x)),
    top: Math.min(...corners.map((point) => point.y)),
    right: Math.max(...corners.map((point) => point.x)),
    bottom: Math.max(...corners.map((point) => point.y)),
  };
}

function mergeRects(rects: SelectionRect[]): SelectionRect | null {
  if (rects.length === 0) return null;
  return {
    left: Math.min(...rects.map((rect) => rect.left)),
    top: Math.min(...rects.map((rect) => rect.top)),
    right: Math.max(...rects.map((rect) => rect.right)),
    bottom: Math.max(...rects.map((rect) => rect.bottom)),
  };
}

function rectContainsRect(outer: SelectionRect, inner: SelectionRect): boolean {
  return outer.left <= inner.left && outer.top <= inner.top && outer.right >= inner.right && outer.bottom >= inner.bottom;
}
