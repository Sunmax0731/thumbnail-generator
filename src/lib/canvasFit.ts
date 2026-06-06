export interface CanvasFitInput {
  containerWidth: number;
  containerHeight: number;
  documentWidth: number;
  documentHeight: number;
  previewPadding: number;
  maxZoom?: number;
  minZoom?: number;
}

export function calculateCanvasFitZoom({
  containerWidth,
  containerHeight,
  documentWidth,
  documentHeight,
  previewPadding,
  maxZoom = 0.94,
  minZoom = 0.25,
}: CanvasFitInput): number {
  const frameWidth = Math.max(1, documentWidth + previewPadding * 2);
  const frameHeight = Math.max(1, documentHeight + previewPadding * 2);
  const availableWidth = Math.max(1, containerWidth);
  const availableHeight = Math.max(1, containerHeight);
  const fitByHeight = (availableHeight * frameWidth) / (availableWidth * frameHeight);
  const next = Math.min(maxZoom, fitByHeight);

  if (!Number.isFinite(next)) return maxZoom;
  return round(clamp(next, minZoom, maxZoom), 2);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals: number): number {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}
