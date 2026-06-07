import type { TextLayer } from "./types";

export interface TextFitOptions {
  minFontSize?: number;
  maxFontSize?: number;
  measureTextWidth?: (text: string, fontSize: number, layer: TextLayer) => number;
}

export function fitTextLayerToBounds(layer: TextLayer, options: TextFitOptions = {}): TextLayer {
  return {
    ...layer,
    fontSize: calculateFittedFontSize(layer, options),
  };
}

export function calculateFittedFontSize(layer: TextLayer, options: TextFitOptions = {}): number {
  const minFontSize = options.minFontSize ?? 8;
  const maxFontSize = options.maxFontSize ?? Math.max(240, Math.ceil(Math.min(layer.width, layer.height) * 1.6));
  const lines = layer.text.split(/\r?\n/).map((line) => (line.length > 0 ? line : " "));
  const availableWidth = Math.max(1, layer.width - layer.strokeWidth * 2);
  const availableHeight = Math.max(1, layer.height - layer.strokeWidth * 2);

  let low = minFontSize;
  let high = Math.max(minFontSize, maxFontSize);
  let best = minFontSize;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (doesTextFit(layer, lines, mid, availableWidth, availableHeight, options.measureTextWidth)) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return best;
}

export function createCanvasTextMeasurer(): TextFitOptions["measureTextWidth"] | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return undefined;

  return (text, fontSize, layer) => {
    context.font = `${layer.fontWeight} ${fontSize}px ${layer.fontFamily}`;
    return context.measureText(text).width;
  };
}

function doesTextFit(
  layer: TextLayer,
  lines: string[],
  fontSize: number,
  availableWidth: number,
  availableHeight: number,
  measureTextWidth: TextFitOptions["measureTextWidth"],
): boolean {
  if (layer.writingMode === "vertical") {
    const columnWidth = fontSize + Math.max(0, layer.letterSpacing);
    const requiredWidth = lines.length * columnWidth;
    if (requiredWidth > availableWidth) return false;
    return lines.every((line) => {
      const chars = Array.from(line);
      const totalHeight = chars.length * fontSize * layer.lineHeight;
      return totalHeight <= availableHeight;
    });
  }

  const totalHeight = lines.length * fontSize * layer.lineHeight;
  if (totalHeight > availableHeight) return false;

  return lines.every((line) => {
    const measured = measureTextWidth ? measureTextWidth(line, fontSize, layer) : estimateTextWidth(line, fontSize);
    const spacing = Math.max(0, line.length - 1) * layer.letterSpacing;
    return measured + spacing <= availableWidth;
  });
}

function estimateTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.62;
}
