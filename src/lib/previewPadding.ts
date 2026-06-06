import { rotateHandleOffset, selectionHandleRadius } from "./canvasInteraction";
import type { OutputSettings, ThumbnailLayer } from "./types";

export interface PreviewPaddingOptions {
  minimum?: number;
  margin?: number;
  maximum?: number;
}

export function calculatePreviewPadding(
  layers: ThumbnailLayer[],
  settings: Pick<OutputSettings, "width" | "height">,
  options: PreviewPaddingOptions = {},
): number {
  const minimum = options.minimum ?? 88;
  const margin = options.margin ?? 36;
  const maximum = options.maximum ?? Math.max(360, Math.min(1600, Math.max(settings.width, settings.height)));
  const visibleLayers = layers.filter((layer) => layer.visible);
  if (visibleLayers.length === 0) return minimum;

  let left = 0;
  let top = 0;
  let right = settings.width;
  let bottom = settings.height;

  for (const layer of visibleLayers) {
    const bounds = transformedLayerBounds(layer);
    left = Math.min(left, bounds.left);
    top = Math.min(top, bounds.top);
    right = Math.max(right, bounds.right);
    bottom = Math.max(bottom, bounds.bottom);
  }

  const required = Math.ceil(
    Math.max(minimum, -left + margin, -top + margin, right - settings.width + margin, bottom - settings.height + margin),
  );
  return Math.min(maximum, required);
}

function transformedLayerBounds(layer: ThumbnailLayer): { left: number; top: number; right: number; bottom: number } {
  const corners = [
    { x: -layer.width / 2, y: -layer.height / 2 },
    { x: layer.width / 2, y: -layer.height / 2 },
    { x: layer.width / 2, y: layer.height / 2 },
    { x: -layer.width / 2, y: layer.height / 2 },
    { x: 0, y: -layer.height / 2 - rotateHandleOffset - selectionHandleRadius },
  ].map((point) => fromLayerLocalPoint(layer, point));

  return {
    left: Math.min(...corners.map((point) => point.x)),
    top: Math.min(...corners.map((point) => point.y)),
    right: Math.max(...corners.map((point) => point.x)),
    bottom: Math.max(...corners.map((point) => point.y)),
  };
}

function fromLayerLocalPoint(layer: ThumbnailLayer, point: { x: number; y: number }): { x: number; y: number } {
  const center = {
    x: layer.x + layer.width / 2,
    y: layer.y + layer.height / 2,
  };
  const radians = (layer.rotation * Math.PI) / 180;
  return {
    x: center.x + point.x * Math.cos(radians) - point.y * Math.sin(radians),
    y: center.y + point.x * Math.sin(radians) + point.y * Math.cos(radians),
  };
}
