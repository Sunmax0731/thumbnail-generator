import { rotateHandleOffset, selectionHandleRadius, type CanvasInteractionMode } from "./canvasInteraction";
import type { ImageAsset, ImageEffects, OutputSettings, ShapeLayer, TextLayer, ThumbnailLayer } from "./types";

const imageCache = new Map<string, Promise<HTMLImageElement>>();
const edgeShadowOffset = 10000;

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

  if (layer.edgeBlur !== 0) {
    await drawLayerEdgeBlur(context, layer, assets);
  }
  await drawLayerContent(context, layer, assets, {
    includeFill: true,
    includeStroke: true,
    layerBlur: layer.layerBlur,
  });
  context.restore();
}

async function drawLayerEdgeBlur(context: CanvasRenderingContext2D, layer: ThumbnailLayer, assets: ImageAsset[]) {
  const amount = Math.abs(layer.edgeBlur);
  if (amount <= 0) return;
  context.save();
  if (layer.edgeBlur < 0) {
    clipLayerBounds(context, layer);
  }
  context.shadowBlur = amount;
  context.shadowColor = "rgba(15, 23, 42, 0.36)";
  context.shadowOffsetX = edgeShadowOffset;
  context.translate(-edgeShadowOffset, 0);
  await drawLayerContent(context, layer, assets, {
    includeFill: true,
    includeStroke: shouldIncludeStrokeForEdgeBlur(layer),
    layerBlur: 0,
  });
  context.restore();
}

async function drawLayerContent(
  context: CanvasRenderingContext2D,
  layer: ThumbnailLayer,
  assets: ImageAsset[],
  options: { includeFill: boolean; includeStroke: boolean; layerBlur: number },
) {
  if (layer.type === "image") {
    const asset = assets.find((candidate) => candidate.key === layer.imageKey || candidate.name === layer.imageKey);
    if (asset) {
      const image = await loadImage(asset.src);
      drawImageLayer(context, image, layer.width, layer.height, layer.effects, layer.cornerRadius, options.layerBlur);
    } else {
      drawMissingImage(context, layer.width, layer.height);
    }
  }

  if (layer.type === "shape") {
    context.save();
    context.filter = options.layerBlur > 0 ? `blur(${options.layerBlur}px)` : "none";
    drawShapeLayer(context, layer, options);
    context.restore();
  }

  if (layer.type === "text") {
    context.save();
    context.filter = options.layerBlur > 0 ? `blur(${options.layerBlur}px)` : "none";
    drawTextLayer(context, layer, options);
    context.restore();
  }
}

function drawImageLayer(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  effects: ImageEffects,
  cornerRadius: number,
  layerBlur: number,
) {
  context.save();
  context.filter = buildFilter(effects, layerBlur);
  clipRoundedRect(context, -width / 2, -height / 2, width, height, cornerRadius);

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

function buildFilter(effects: ImageEffects, layerBlur = 0): string {
  const filters = [
    `grayscale(${effects.grayscale})`,
    `blur(${effects.blur + layerBlur}px)`,
    `brightness(${effects.brightness}%)`,
    `contrast(${effects.contrast}%)`,
  ];
  return filters.join(" ");
}

function drawShapeLayer(
  context: CanvasRenderingContext2D,
  layer: ShapeLayer,
  options: { includeFill: boolean; includeStroke: boolean },
) {
  if (layer.shape === "line") {
    drawLineShape(context, layer, options);
    return;
  }

  context.beginPath();
  if (layer.shape === "ellipse") {
    context.ellipse(0, 0, layer.width / 2, layer.height / 2, 0, 0, Math.PI * 2);
  } else if (layer.shape === "triangle") {
    context.moveTo(0, -layer.height / 2);
    context.lineTo(layer.width / 2, layer.height / 2);
    context.lineTo(-layer.width / 2, layer.height / 2);
    context.closePath();
  } else {
    context.roundRect(-layer.width / 2, -layer.height / 2, layer.width, layer.height, layer.cornerRadius);
  }

  const baseAlpha = context.globalAlpha;
  if (options.includeFill) {
    context.fillStyle = layer.fill;
    context.globalAlpha = baseAlpha * layer.fillOpacity;
    context.fill();
  }
  if (options.includeStroke && layer.strokeWidth > 0) {
    context.globalAlpha = baseAlpha * layer.strokeOpacity;
    context.lineWidth = layer.strokeWidth;
    context.strokeStyle = layer.strokeColor;
    context.stroke();
  }
  context.globalAlpha = baseAlpha;
}

function drawTextLayer(
  context: CanvasRenderingContext2D,
  layer: TextLayer,
  options: { includeFill: boolean; includeStroke: boolean },
) {
  if (layer.writingMode === "vertical") {
    drawVerticalTextLayer(context, layer, options);
    return;
  }

  const lines = layer.text.split(/\r?\n/);
  const lineHeightPx = layer.fontSize * layer.lineHeight;
  const totalHeight = lineHeightPx * lines.length;
  context.font = `${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
  context.textAlign = layer.align;
  context.textBaseline = "middle";
  context.lineJoin = "round";

  const x = layer.align === "center" ? 0 : layer.align === "right" ? layer.width / 2 : -layer.width / 2;
  let y = -totalHeight / 2 + lineHeightPx / 2;
  const baseAlpha = context.globalAlpha;
  for (const line of lines) {
    if (options.includeStroke && layer.strokeWidth > 0) {
      context.globalAlpha = baseAlpha * layer.strokeOpacity;
      context.lineWidth = layer.strokeWidth;
      context.strokeStyle = layer.strokeColor;
      drawSpacedText(context, line, x, y, layer.width, layer.letterSpacing, "stroke");
    }
    if (options.includeFill) {
      context.globalAlpha = baseAlpha * layer.fillOpacity;
      context.fillStyle = layer.color;
      drawSpacedText(context, line, x, y, layer.width, layer.letterSpacing, "fill");
    }
    y += lineHeightPx;
  }
  context.globalAlpha = baseAlpha;
}

function drawVerticalTextLayer(
  context: CanvasRenderingContext2D,
  layer: TextLayer,
  options: { includeFill: boolean; includeStroke: boolean },
): void {
  const columns = layer.text.split(/\r?\n/);
  const charAdvance = layer.fontSize * layer.lineHeight;
  const columnWidth = layer.fontSize + Math.max(0, layer.letterSpacing);
  const totalWidth = columns.length * columnWidth;
  const startX =
    layer.align === "right"
      ? layer.width / 2 - totalWidth + columnWidth / 2
      : layer.align === "center"
        ? -totalWidth / 2 + columnWidth / 2
        : -layer.width / 2 + columnWidth / 2;

  context.font = `${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.lineJoin = "round";

  const baseAlpha = context.globalAlpha;
  columns.forEach((column, columnIndex) => {
    const chars = Array.from(column.length > 0 ? column : " ");
    const totalHeight = chars.length * charAdvance;
    const x = startX + columnIndex * columnWidth;
    let y = -totalHeight / 2 + charAdvance / 2;
    for (const char of chars) {
      if (options.includeStroke && layer.strokeWidth > 0) {
        context.globalAlpha = baseAlpha * layer.strokeOpacity;
        context.lineWidth = layer.strokeWidth;
        context.strokeStyle = layer.strokeColor;
        context.strokeText(char, x, y, layer.width);
      }
      if (options.includeFill) {
        context.globalAlpha = baseAlpha * layer.fillOpacity;
        context.fillStyle = layer.color;
        context.fillText(char, x, y, layer.width);
      }
      y += charAdvance;
    }
  });
  context.globalAlpha = baseAlpha;
}

function drawLineShape(
  context: CanvasRenderingContext2D,
  layer: ShapeLayer,
  options: { includeStroke: boolean },
): void {
  if (!options.includeStroke) return;
  const baseAlpha = context.globalAlpha;
  context.globalAlpha = baseAlpha * layer.strokeOpacity;
  context.strokeStyle = layer.strokeColor;
  context.lineWidth = Math.max(1, layer.strokeWidth || layer.height || 8);
  context.lineCap = "round";
  context.lineJoin = "round";
  if (layer.lineStyle === "dotted") context.setLineDash([1, context.lineWidth * 1.55]);
  if (layer.lineStyle === "dashed") context.setLineDash([context.lineWidth * 2.6, context.lineWidth * 1.25]);
  if (layer.lineStyle === "wave") {
    context.beginPath();
    const amplitude = Math.max(4, context.lineWidth * 0.8);
    const step = Math.max(12, context.lineWidth * 2);
    for (let x = -layer.width / 2; x <= layer.width / 2; x += step) {
      const y = Math.sin(((x + layer.width / 2) / step) * Math.PI * 2) * amplitude;
      if (x === -layer.width / 2) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  } else {
    context.beginPath();
    context.moveTo(-layer.width / 2, 0);
    context.lineTo(layer.width / 2, 0);
    context.stroke();
  }
  context.setLineDash([]);
  context.globalAlpha = baseAlpha;
}

function shouldIncludeStrokeForEdgeBlur(layer: ThumbnailLayer): boolean {
  if (layer.type === "image") return true;
  if (layer.type === "shape" && layer.shape === "line") return true;
  return layer.edgeBlurStroke;
}

function clipLayerBounds(context: CanvasRenderingContext2D, layer: ThumbnailLayer): void {
  context.beginPath();
  if (layer.type === "shape" && layer.shape === "ellipse") {
    context.ellipse(0, 0, layer.width / 2, layer.height / 2, 0, 0, Math.PI * 2);
  } else if (layer.type === "shape" && layer.shape === "triangle") {
    context.moveTo(0, -layer.height / 2);
    context.lineTo(layer.width / 2, layer.height / 2);
    context.lineTo(-layer.width / 2, layer.height / 2);
    context.closePath();
  } else if (layer.type === "shape" && layer.shape === "line") {
    const halfHeight = Math.max(layer.height / 2, layer.strokeWidth / 2, 1);
    context.rect(-layer.width / 2, -halfHeight, layer.width, halfHeight * 2);
  } else {
    context.roundRect(-layer.width / 2, -layer.height / 2, layer.width, layer.height, layer.cornerRadius);
  }
  context.clip();
}

function clipRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  cornerRadius: number,
): void {
  if (cornerRadius <= 0) return;
  context.beginPath();
  context.roundRect(x, y, width, height, Math.min(cornerRadius, width / 2, height / 2));
  context.clip();
}

function drawSpacedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  letterSpacing: number,
  mode: "fill" | "stroke",
): void {
  if (letterSpacing === 0 || text.length <= 1) {
    if (mode === "fill") context.fillText(text, x, y, maxWidth);
    else context.strokeText(text, x, y, maxWidth);
    return;
  }

  const chars = Array.from(text);
  const totalWidth =
    chars.reduce((sum, char) => sum + context.measureText(char).width, 0) + letterSpacing * Math.max(0, chars.length - 1);
  let currentX = x;
  if (context.textAlign === "center") currentX = x - totalWidth / 2;
  if (context.textAlign === "right" || context.textAlign === "end") currentX = x - totalWidth;

  for (const char of chars) {
    if (mode === "fill") context.fillText(char, currentX, y, maxWidth);
    else context.strokeText(char, currentX, y, maxWidth);
    currentX += context.measureText(char).width + letterSpacing;
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
