export type LayerType = "image" | "text" | "shape";
export type ShapeKind = "rect" | "ellipse" | "triangle";
export type TextAlign = "left" | "center" | "right";
export type ExportFormat = "png" | "jpeg" | "webp";

export interface ImageEffects {
  grayscale: number;
  blur: number;
  brightness: number;
  contrast: number;
  mosaic: number;
}

export interface BaseLayer {
  id: string;
  type: LayerType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  selectable: boolean;
}

export interface ImageLayer extends BaseLayer {
  type: "image";
  imageKey: string;
  effects: ImageEffects;
}

export interface TextLayer extends BaseLayer {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  align: TextAlign;
  lineHeight: number;
}

export interface ShapeLayer extends BaseLayer {
  type: "shape";
  shape: ShapeKind;
  fill: string;
  strokeColor: string;
  strokeWidth: number;
}

export type ThumbnailLayer = ImageLayer | TextLayer | ShapeLayer;

export interface ImageAsset {
  key: string;
  name: string;
  src: string;
  width?: number;
  height?: number;
}

export interface OutputPreset {
  id: string;
  label: string;
  width: number;
  height: number;
}

export interface OutputSettings {
  presetId: string;
  width: number;
  height: number;
  format: ExportFormat;
  quality: number;
  background: string;
}

export interface LayoutParseOptions {
  baseWidth: number;
  baseHeight: number;
  existingImageKeys?: string[];
}

export interface LayoutParseResult {
  layers: ThumbnailLayer[];
  warnings: string[];
}
