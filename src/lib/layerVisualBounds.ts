import type { ThumbnailLayer } from "./types";

export interface LocalLayerBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export function getLayerVisualLocalBounds(layer: ThumbnailLayer): LocalLayerBounds {
  if (layer.type !== "text" || layer.writingMode !== "vertical") {
    return defaultLayerBounds(layer);
  }

  const columns = layer.text.split(/\r?\n/);
  const columnCount = Math.max(1, columns.length);
  const maxCharacterCount = Math.max(1, ...columns.map((column) => Array.from(column).length));
  const charAdvance = Math.max(1, layer.fontSize * layer.lineHeight);
  const columnWidth = Math.max(1, layer.fontSize + Math.max(0, layer.letterSpacing));
  const totalWidth = columnCount * columnWidth;
  const totalHeight = maxCharacterCount * charAdvance;
  const startX =
    layer.align === "right"
      ? layer.width / 2 - totalWidth + columnWidth / 2
      : layer.align === "center"
        ? -totalWidth / 2 + columnWidth / 2
        : -layer.width / 2 + columnWidth / 2;
  const strokePad = Math.max(0, layer.strokeWidth / 2);

  return {
    left: startX - columnWidth / 2 - strokePad,
    right: startX + (columnCount - 1) * columnWidth + columnWidth / 2 + strokePad,
    top: -totalHeight / 2 - strokePad,
    bottom: totalHeight / 2 + strokePad,
  };
}

export function getLayerVisualLocalCorners(layer: ThumbnailLayer): Array<{ x: number; y: number }> {
  const bounds = getLayerVisualLocalBounds(layer);
  return [
    { x: bounds.left, y: bounds.top },
    { x: bounds.right, y: bounds.top },
    { x: bounds.right, y: bounds.bottom },
    { x: bounds.left, y: bounds.bottom },
  ];
}

export function getLayerVisualLocalCenter(layer: ThumbnailLayer): { x: number; y: number } {
  const bounds = getLayerVisualLocalBounds(layer);
  return {
    x: (bounds.left + bounds.right) / 2,
    y: (bounds.top + bounds.bottom) / 2,
  };
}

function defaultLayerBounds(layer: ThumbnailLayer): LocalLayerBounds {
  return {
    left: -layer.width / 2,
    top: -layer.height / 2,
    right: layer.width / 2,
    bottom: layer.height / 2,
  };
}
