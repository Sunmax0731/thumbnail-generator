import type {
  ImageEffects,
  ImageLayer,
  LayerAnimation,
  LayerAnimationDirection,
  LayerAnimationEasing,
  LayerAnimationType,
  ShapeKind,
  ShapeLayer,
  TextAlign,
  TextLayer,
  TextWritingMode,
  ThumbnailLayer,
} from "./types";

export const defaultEffects: ImageEffects = {
  grayscale: 0,
  blur: 0,
  brightness: 100,
  contrast: 100,
  mosaic: 0,
};

export const defaultAnimation: LayerAnimation = {
  type: "none",
  startMs: 0,
  durationMs: 900,
  easing: "easeOut",
  loop: false,
  direction: "up",
  distance: 80,
};

let layerCounter = 0;

export function makeLayerId(prefix = "layer"): string {
  layerCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${layerCounter.toString(36)}`;
}

export function makeImageLayer(partial: Partial<ImageLayer> = {}): ImageLayer {
  return {
    id: partial.id ?? makeLayerId("image"),
    type: "image",
    name: partial.name ?? "Image layer",
    x: partial.x ?? 0,
    y: partial.y ?? 0,
    width: partial.width ?? 640,
    height: partial.height ?? 360,
    rotation: partial.rotation ?? 0,
    opacity: partial.opacity ?? 1,
    visible: partial.visible ?? true,
    selectable: partial.selectable ?? true,
    groupId: partial.groupId,
    groupName: partial.groupName,
    layerBlur: partial.layerBlur ?? 0,
    edgeBlur: partial.edgeBlur ?? 0,
    edgeBlurStroke: partial.edgeBlurStroke ?? false,
    cornerRadius: partial.cornerRadius ?? 0,
    animation: normalizeAnimation(partial.animation),
    imageKey: partial.imageKey ?? "sample-bg",
    effects: { ...defaultEffects, ...partial.effects },
  };
}

export function makeTextLayer(partial: Partial<TextLayer> = {}): TextLayer {
  return {
    id: partial.id ?? makeLayerId("text"),
    type: "text",
    name: partial.name ?? "Text layer",
    x: partial.x ?? 80,
    y: partial.y ?? 80,
    width: partial.width ?? 720,
    height: partial.height ?? 160,
    rotation: partial.rotation ?? 0,
    opacity: partial.opacity ?? 1,
    visible: partial.visible ?? true,
    selectable: partial.selectable ?? true,
    groupId: partial.groupId,
    groupName: partial.groupName,
    layerBlur: partial.layerBlur ?? 0,
    edgeBlur: partial.edgeBlur ?? 0,
    edgeBlurStroke: partial.edgeBlurStroke ?? false,
    cornerRadius: partial.cornerRadius ?? 0,
    animation: normalizeAnimation(partial.animation),
    text: partial.text ?? "NEW THUMBNAIL",
    fontSize: partial.fontSize ?? 88,
    fontFamily: partial.fontFamily ?? "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
    fontWeight: partial.fontWeight ?? "800",
    color: partial.color ?? "#ffffff",
    strokeColor: partial.strokeColor ?? "#111827",
    strokeWidth: partial.strokeWidth ?? 8,
    strokeOpacity: partial.strokeOpacity ?? 1,
    align: (partial.align as TextAlign) ?? "left",
    writingMode: (partial.writingMode as TextWritingMode) ?? "horizontal",
    lineHeight: partial.lineHeight ?? 1,
    letterSpacing: partial.letterSpacing ?? 0,
    fillOpacity: partial.fillOpacity ?? 1,
  };
}

export function makeShapeLayer(partial: Partial<ShapeLayer> = {}): ShapeLayer {
  return {
    id: partial.id ?? makeLayerId("shape"),
    type: "shape",
    name: partial.name ?? "Shape layer",
    x: partial.x ?? 100,
    y: partial.y ?? 100,
    width: partial.width ?? 260,
    height: partial.height ?? 120,
    rotation: partial.rotation ?? 0,
    opacity: partial.opacity ?? 1,
    visible: partial.visible ?? true,
    selectable: partial.selectable ?? true,
    groupId: partial.groupId,
    groupName: partial.groupName,
    layerBlur: partial.layerBlur ?? 0,
    edgeBlur: partial.edgeBlur ?? 0,
    edgeBlurStroke: partial.edgeBlurStroke ?? false,
    cornerRadius: partial.cornerRadius ?? 12,
    animation: normalizeAnimation(partial.animation),
    shape: (partial.shape as ShapeKind) ?? "rect",
    fill: partial.fill ?? "#10b6d7",
    fillOpacity: partial.fillOpacity ?? 1,
    strokeColor: partial.strokeColor ?? "#ffffff",
    strokeWidth: partial.strokeWidth ?? 0,
    strokeOpacity: partial.strokeOpacity ?? 1,
    lineStyle: partial.lineStyle ?? "solid",
  };
}

export function cloneLayer(layer: ThumbnailLayer): ThumbnailLayer {
  if (layer.type === "image") {
    return makeImageLayer({ ...layer, id: makeLayerId("image"), name: `${layer.name} copy`, groupId: undefined, groupName: undefined });
  }
  if (layer.type === "text") {
    return makeTextLayer({ ...layer, id: makeLayerId("text"), name: `${layer.name} copy`, groupId: undefined, groupName: undefined });
  }
  return makeShapeLayer({ ...layer, id: makeLayerId("shape"), name: `${layer.name} copy`, groupId: undefined, groupName: undefined });
}

export function normalizeLayer(layer: ThumbnailLayer): ThumbnailLayer {
  if (layer.type === "image") return makeImageLayer(layer);
  if (layer.type === "text") return makeTextLayer(layer);
  return makeShapeLayer(layer);
}

export function normalizeAnimation(animation: Partial<Record<keyof LayerAnimation, unknown>> | undefined): LayerAnimation | undefined {
  if (!animation || animation.type === "none") return undefined;
  const type = parseAnimationType(animation.type);
  if (type === "none") return undefined;
  return {
    type,
    startMs: clampNumber(animation.startMs, 0, 60000, defaultAnimation.startMs),
    durationMs: clampNumber(animation.durationMs, 100, 60000, defaultAnimation.durationMs),
    easing: parseAnimationEasing(animation.easing),
    loop: Boolean(animation.loop),
    direction: parseAnimationDirection(animation.direction),
    distance: clampNumber(animation.distance, 0, 4000, defaultAnimation.distance),
  };
}

function parseAnimationType(value: unknown): LayerAnimationType {
  if (value === "fade" || value === "slide" || value === "pop" || value === "pulse" || value === "blink" || value === "drift") {
    return value;
  }
  return "none";
}

function parseAnimationEasing(value: unknown): LayerAnimationEasing {
  if (value === "linear" || value === "easeIn" || value === "easeOut" || value === "easeInOut") return value;
  return defaultAnimation.easing;
}

function parseAnimationDirection(value: unknown): LayerAnimationDirection {
  if (value === "left" || value === "right" || value === "up" || value === "down") return value;
  return defaultAnimation.direction;
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}
