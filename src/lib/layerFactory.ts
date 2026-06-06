import type {
  ImageEffects,
  ImageLayer,
  ShapeKind,
  ShapeLayer,
  TextAlign,
  TextLayer,
  ThumbnailLayer,
} from "./types";

export const defaultEffects: ImageEffects = {
  grayscale: 0,
  blur: 0,
  brightness: 100,
  contrast: 100,
  mosaic: 0,
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
    text: partial.text ?? "NEW THUMBNAIL",
    fontSize: partial.fontSize ?? 88,
    fontFamily: partial.fontFamily ?? "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
    fontWeight: partial.fontWeight ?? "800",
    color: partial.color ?? "#ffffff",
    strokeColor: partial.strokeColor ?? "#111827",
    strokeWidth: partial.strokeWidth ?? 8,
    align: (partial.align as TextAlign) ?? "left",
    lineHeight: partial.lineHeight ?? 1,
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
    shape: (partial.shape as ShapeKind) ?? "rect",
    fill: partial.fill ?? "#10b6d7",
    strokeColor: partial.strokeColor ?? "#ffffff",
    strokeWidth: partial.strokeWidth ?? 0,
  };
}

export function cloneLayer(layer: ThumbnailLayer): ThumbnailLayer {
  if (layer.type === "image") {
    return makeImageLayer({ ...layer, id: makeLayerId("image"), name: `${layer.name} copy` });
  }
  if (layer.type === "text") {
    return makeTextLayer({ ...layer, id: makeLayerId("text"), name: `${layer.name} copy` });
  }
  return makeShapeLayer({ ...layer, id: makeLayerId("shape"), name: `${layer.name} copy` });
}
