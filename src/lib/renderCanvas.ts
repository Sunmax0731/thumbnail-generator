import { rotateHandleOffset, selectionHandleRadius, type CanvasInteractionMode } from "./canvasInteraction";
import type { ImageAsset, ImageEffects, OutputSettings, ShapeLayer, TextLayer, ThumbnailLayer } from "./types";

const imageCache = new Map<string, Promise<HTMLImageElement>>();

export interface RenderOptions {
  selectedLayerId?: string | null;
  selectedLayerIds?: string[];
  drawSelection?: boolean;
  previewPadding?: number;
  hoverInteractionMode?: CanvasInteractionMode | null;
  activeInteractionMode?: CanvasInteractionMode | null;
}

export async function renderThumbnailToCanvas(
  canvas: HTMLCanvasElement,
  layers: ThumbnailLayer[],
  assets: ImageAsset[],
  settings: OutputSettings,
  options: RenderOptions = {},
): Promise<void> {
  const previewPadding = options.previewPadding ?? 0;
  canvas.width = settings.width + previewPadding * 2;
  canvas.height = settings.height + previewPadding * 2;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2D context is not available.");
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  if (previewPadding > 0) {
    drawPreviewBackdrop(context, canvas.width, canvas.height);
  }
  context.fillStyle = settings.background;
  context.fillRect(previewPadding, previewPadding, settings.width, settings.height);

  if (previewPadding > 0) {
    context.strokeStyle = "rgba(17, 24, 39, 0.28)";
    context.lineWidth = 2;
    context.strokeRect(previewPadding, previewPadding, settings.width, settings.height);
  }

  context.save();
  context.translate(previewPadding, previewPadding);

  const sortedLayers = layers.filter((layer) => layer.visible);
  for (const layer of sortedLayers) {
    await drawLayer(context, layer, assets);
  }

  if (options.drawSelection) {
    const selectedIds = options.selectedLayerIds ?? (options.selectedLayerId ? [options.selectedLayerId] : []);
    const selectedLayers = selectedIds
      .map((id) => layers.find((layer) => layer.id === id))
      .filter((layer): layer is ThumbnailLayer => Boolean(layer));
    for (const selected of selectedLayers) {
      drawSelection(context, selected, selectedLayers.length === 1, {
        hoverMode: options.hoverInteractionMode ?? null,
        activeMode: options.activeInteractionMode ?? null,
      });
    }
  }

  context.restore();
}

function drawPreviewBackdrop(context: CanvasRenderingContext2D, width: number, height: number): void {
  context.fillStyle = "#dfe7ee";
  context.fillRect(0, 0, width, height);
  const size = 24;
  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      if ((x / size + y / size) % 2 === 0) {
        context.fillStyle = "rgba(255, 255, 255, 0.48)";
        context.fillRect(x, y, size, size);
      }
    }
  }
}

async function drawLayer(context: CanvasRenderingContext2D, layer: ThumbnailLayer, assets: ImageAsset[]) {
  context.save();
  context.globalAlpha = layer.opacity;
  context.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
  context.rotate((layer.rotation * Math.PI) / 180);

  if (layer.type === "image") {
    const asset = assets.find((candidate) => candidate.key === layer.imageKey || candidate.name === layer.imageKey);
    if (asset) {
      const image = await loadImage(asset.src);
      drawImageLayer(context, image, layer.width, layer.height, layer.effects);
    } else {
      drawMissingImage(context, layer.width, layer.height);
    }
  }

  if (layer.type === "shape") {
    drawShapeLayer(context, layer);
  }

  if (layer.type === "text") {
    drawTextLayer(context, layer);
  }

  context.restore();
}

function drawImageLayer(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  effects: ImageEffects,
) {
  context.save();
  context.filter = buildFilter(effects);

  if (effects.mosaic > 0) {
    const block = Math.max(2, Math.round(effects.mosaic));
    const smallWidth = Math.max(1, Math.round(width / block));
    const smallHeight = Math.max(1, Math.round(height / block));
    const offscreen = document.createElement("canvas");
    offscreen.width = smallWidth;
    offscreen.height = smallHeight;
    const offscreenContext = offscreen.getContext("2d");
    if (offscreenContext) {
      offscreenContext.drawImage(image, 0, 0, smallWidth, smallHeight);
      context.imageSmoothingEnabled = false;
      context.drawImage(offscreen, -width / 2, -height / 2, width, height);
      context.imageSmoothingEnabled = true;
      context.restore();
      return;
    }
  }

  context.drawImage(image, -width / 2, -height / 2, width, height);
  context.restore();
}

function buildFilter(effects: ImageEffects): string {
  const filters = [
    `grayscale(${effects.grayscale})`,
    `blur(${effects.blur}px)`,
    `brightness(${effects.brightness}%)`,
    `contrast(${effects.contrast}%)`,
  ];
  return filters.join(" ");
}

function drawShapeLayer(context: CanvasRenderingContext2D, layer: ShapeLayer) {
  context.beginPath();
  if (layer.shape === "ellipse") {
    context.ellipse(0, 0, layer.width / 2, layer.height / 2, 0, 0, Math.PI * 2);
  } else if (layer.shape === "triangle") {
    context.moveTo(0, -layer.height / 2);
    context.lineTo(layer.width / 2, layer.height / 2);
    context.lineTo(-layer.width / 2, layer.height / 2);
    context.closePath();
  } else {
    context.roundRect(-layer.width / 2, -layer.height / 2, layer.width, layer.height, 12);
  }

  context.fillStyle = layer.fill;
  context.fill();
  if (layer.strokeWidth > 0) {
    context.lineWidth = layer.strokeWidth;
    context.strokeStyle = layer.strokeColor;
    context.stroke();
  }
}

function drawTextLayer(context: CanvasRenderingContext2D, layer: TextLayer) {
  const lines = layer.text.split(/\r?\n/);
  const lineHeightPx = layer.fontSize * layer.lineHeight;
  const totalHeight = lineHeightPx * lines.length;
  context.font = `${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
  context.textAlign = layer.align;
  context.textBaseline = "middle";
  context.lineJoin = "round";

  const x = layer.align === "center" ? 0 : layer.align === "right" ? layer.width / 2 : -layer.width / 2;
  let y = -totalHeight / 2 + lineHeightPx / 2;
  for (const line of lines) {
    if (layer.strokeWidth > 0) {
      context.lineWidth = layer.strokeWidth;
      context.strokeStyle = layer.strokeColor;
      context.strokeText(line, x, y, layer.width);
    }
    context.fillStyle = layer.color;
    context.fillText(line, x, y, layer.width);
    y += lineHeightPx;
  }
}

function drawMissingImage(context: CanvasRenderingContext2D, width: number, height: number) {
  context.fillStyle = "#1f2937";
  context.fillRect(-width / 2, -height / 2, width, height);
  context.strokeStyle = "#f97316";
  context.lineWidth = 8;
  context.strokeRect(-width / 2 + 8, -height / 2 + 8, width - 16, height - 16);
  context.fillStyle = "#ffffff";
  context.font = "700 28px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("missing image", 0, 0);
}

function drawSelection(
  context: CanvasRenderingContext2D,
  layer: ThumbnailLayer,
  drawHandles: boolean,
  state: { hoverMode: CanvasInteractionMode | null; activeMode: CanvasInteractionMode | null },
) {
  context.save();
  context.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
  context.rotate((layer.rotation * Math.PI) / 180);
  context.strokeStyle = "#10b6d7";
  context.lineWidth = 4;
  context.setLineDash([16, 10]);
  context.strokeRect(-layer.width / 2, -layer.height / 2, layer.width, layer.height);
  context.setLineDash([]);
  if (drawHandles) {
    const rotateHot = state.activeMode === "rotate" || state.hoverMode === "rotate";
    context.beginPath();
    context.moveTo(0, -layer.height / 2);
    context.lineTo(0, -layer.height / 2 - rotateHandleOffset);
    context.strokeStyle = rotateHot ? "#ff4f5f" : "#10b6d7";
    context.lineWidth = rotateHot ? 5 : 4;
    context.stroke();
    for (const [x, y] of [
      [-layer.width / 2, -layer.height / 2],
      [layer.width / 2, -layer.height / 2],
      [layer.width / 2, layer.height / 2],
      [-layer.width / 2, layer.height / 2],
    ]) {
      drawResizeHandle(context, x, y);
    }
    drawRotationHandle(context, 0, -layer.height / 2 - rotateHandleOffset, rotateHot, state.activeMode === "rotate");
  }
  context.restore();
}

function drawResizeHandle(context: CanvasRenderingContext2D, x: number, y: number): void {
  context.beginPath();
  context.fillStyle = "#10b6d7";
  context.strokeStyle = "#ffffff";
  context.lineWidth = 3;
  context.arc(x, y, selectionHandleRadius, 0, Math.PI * 2);
  context.fill();
  context.stroke();
}

function drawRotationHandle(context: CanvasRenderingContext2D, x: number, y: number, hot: boolean, active: boolean): void {
  const radius = hot ? selectionHandleRadius + 6 : selectionHandleRadius + 2;
  context.save();
  context.translate(x, y);
  context.fillStyle = active ? "#ff4f5f" : hot ? "#ffffff" : "#ffffff";
  context.strokeStyle = hot ? "#ff4f5f" : "#10b6d7";
  context.lineWidth = hot ? 5 : 4;
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.strokeStyle = active ? "#ffffff" : hot ? "#ff4f5f" : "#10b6d7";
  context.fillStyle = context.strokeStyle;
  context.lineWidth = 4;
  context.beginPath();
  context.arc(0, 0, radius - 9, -0.6 * Math.PI, 0.75 * Math.PI);
  context.stroke();
  context.beginPath();
  context.moveTo(-radius + 9, 1);
  context.lineTo(-radius + 18, -4);
  context.lineTo(-radius + 16, 7);
  context.closePath();
  context.fill();
  context.restore();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached) return cached;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load image: ${src}`));
    image.src = src;
  });
  imageCache.set(src, promise);
  return promise;
}
