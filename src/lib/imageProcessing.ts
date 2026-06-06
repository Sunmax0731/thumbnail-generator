import type { ImageAsset } from "./types";

export type CropMode = "none" | "rect" | "ellipse" | "polygon";

export interface RectSelection {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImagePoint {
  x: number;
  y: number;
}

export interface ImageProcessOptions {
  chromaKeyEnabled: boolean;
  chromaKeyColor: string;
  chromaKeyTolerance: number;
  cropMode: CropMode;
  cropRect: RectSelection;
  polygonPoints: ImagePoint[];
}

export async function processImageAsset(asset: ImageAsset, options: ImageProcessOptions): Promise<ImageAsset> {
  const image = await loadImage(asset.src);
  const source = document.createElement("canvas");
  source.width = image.naturalWidth || image.width;
  source.height = image.naturalHeight || image.height;
  const sourceContext = contextFor(source);
  sourceContext.drawImage(image, 0, 0, source.width, source.height);

  if (options.chromaKeyEnabled) {
    applyChromaKey(sourceContext, source.width, source.height, options.chromaKeyColor, options.chromaKeyTolerance);
  }

  const cropBounds = cropBoundsFor(options, source.width, source.height);
  const output = document.createElement("canvas");
  output.width = Math.max(1, Math.round(cropBounds.width));
  output.height = Math.max(1, Math.round(cropBounds.height));
  const outputContext = contextFor(output);
  applyCropPath(outputContext, options, cropBounds);
  outputContext.drawImage(source, -cropBounds.x, -cropBounds.y);

  return {
    key: `processed-${Date.now().toString(36)}`,
    name: `${asset.name} processed`,
    src: output.toDataURL("image/png"),
    width: output.width,
    height: output.height,
  };
}

export function applyChromaKey(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  tolerance: number,
): void {
  const target = hexToRgb(color);
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let index = 0; index < data.length; index += 4) {
    const distance = Math.hypot(data[index] - target.r, data[index + 1] - target.g, data[index + 2] - target.b);
    if (distance <= tolerance) {
      data[index + 3] = 0;
    }
  }
  context.putImageData(imageData, 0, 0);
}

export function cropBoundsFor(options: ImageProcessOptions, imageWidth: number, imageHeight: number): RectSelection {
  if (options.cropMode === "polygon" && options.polygonPoints.length >= 3) {
    const x = Math.min(...options.polygonPoints.map((point) => point.x));
    const y = Math.min(...options.polygonPoints.map((point) => point.y));
    const right = Math.max(...options.polygonPoints.map((point) => point.x));
    const bottom = Math.max(...options.polygonPoints.map((point) => point.y));
    return clampRect({ x, y, width: right - x, height: bottom - y }, imageWidth, imageHeight);
  }

  if (options.cropMode === "rect" || options.cropMode === "ellipse") {
    return clampRect(options.cropRect, imageWidth, imageHeight);
  }

  return { x: 0, y: 0, width: imageWidth, height: imageHeight };
}

function applyCropPath(context: CanvasRenderingContext2D, options: ImageProcessOptions, bounds: RectSelection): void {
  if (options.cropMode === "none" || options.cropMode === "rect") return;

  context.beginPath();
  if (options.cropMode === "ellipse") {
    context.ellipse(bounds.width / 2, bounds.height / 2, bounds.width / 2, bounds.height / 2, 0, 0, Math.PI * 2);
  } else if (options.polygonPoints.length >= 3) {
    const [first, ...rest] = options.polygonPoints;
    context.moveTo(first.x - bounds.x, first.y - bounds.y);
    rest.forEach((point) => context.lineTo(point.x - bounds.x, point.y - bounds.y));
    context.closePath();
  }
  context.clip();
}

function clampRect(rect: RectSelection, imageWidth: number, imageHeight: number): RectSelection {
  const x = clamp(Math.min(rect.x, rect.x + rect.width), 0, imageWidth - 1);
  const y = clamp(Math.min(rect.y, rect.y + rect.height), 0, imageHeight - 1);
  const right = clamp(Math.max(rect.x, rect.x + rect.width), x + 1, imageWidth);
  const bottom = clamp(Math.max(rect.y, rect.y + rect.height), y + 1, imageHeight);
  return { x, y, width: right - x, height: bottom - y };
}

function hexToRgb(value: string): { r: number; g: number; b: number } {
  const normalized = value.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;
  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load image: ${src}`));
    image.src = src;
  });
}

function contextFor(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context is not available.");
  return context;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
