export type LayerType = "image" | "text" | "shape";
export type ShapeKind = "rect" | "ellipse" | "triangle" | "diamond" | "pentagon" | "hexagon" | "star" | "line";
export type LineStyle = "solid" | "dotted" | "dashed" | "wave";
export type TextAlign = "left" | "center" | "right";
export type TextWritingMode = "horizontal" | "vertical";
export type ExportFormat = "png" | "jpeg" | "webp";
export type LayerAnimationType =
  | "none"
  | "fade"
  | "slide"
  | "pop"
  | "pulse"
  | "blink"
  | "drift"
  | "zoom"
  | "spin"
  | "sway"
  | "shake"
  | "breathe";
export type LayerTextAnimation = "none" | "typewriter" | "lineReveal" | "wave";
export type LayerEffectAnimation = "none" | "glow" | "blur" | "shine";
export type LayerAnimationEasing =
  | "linear"
  | "easeInSine"
  | "easeOutSine"
  | "easeInOutSine"
  | "easeInQuad"
  | "easeOutQuad"
  | "easeInOutQuad"
  | "easeInCubic"
  | "easeOutCubic"
  | "easeInOutCubic"
  | "easeInQuart"
  | "easeOutQuart"
  | "easeInOutQuart"
  | "easeInQuint"
  | "easeOutQuint"
  | "easeInOutQuint"
  | "easeInExpo"
  | "easeOutExpo"
  | "easeInOutExpo"
  | "easeInCirc"
  | "easeOutCirc"
  | "easeInOutCirc"
  | "easeInBack"
  | "easeOutBack"
  | "easeInOutBack"
  | "easeInElastic"
  | "easeOutElastic"
  | "easeInOutElastic"
  | "easeInBounce"
  | "easeOutBounce"
  | "easeInOutBounce";
export type LayerAnimationDirection = "none" | "left" | "right" | "up" | "down";

export interface ImageEffects {
  grayscale: number;
  blur: number;
  brightness: number;
  contrast: number;
  mosaic: number;
}

export interface LayerAnimation {
  type: LayerAnimationType;
  startMs: number;
  durationMs: number;
  easing: LayerAnimationEasing;
  loop: boolean;
  direction: LayerAnimationDirection;
  distance: number;
  textAnimation?: LayerTextAnimation;
  effectAnimation?: LayerEffectAnimation;
  effectIntensity?: number;
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
  groupId?: string;
  groupName?: string;
  layerBlur: number;
  edgeBlur: number;
  edgeBlurStroke: boolean;
  cornerRadius: number;
  shadowColor: string;
  shadowOpacity: number;
  shadowBlur: number;
  shadowDistance: number;
  shadowAngle: number;
  rotateX: number;
  rotateY: number;
  bevelSize: number;
  bevelOpacity: number;
  animation?: LayerAnimation;
  animations?: LayerAnimation[];
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
  strokeOpacity: number;
  align: TextAlign;
  writingMode: TextWritingMode;
  lineHeight: number;
  letterSpacing: number;
  fillOpacity: number;
}

export interface ShapeLayer extends BaseLayer {
  type: "shape";
  shape: ShapeKind;
  fill: string;
  fillOpacity: number;
  strokeColor: string;
  strokeWidth: number;
  strokeOpacity: number;
  lineStyle: LineStyle;
}

export type ThumbnailLayer = ImageLayer | TextLayer | ShapeLayer;

export interface ImageAsset {
  key: string;
  name: string;
  src: string;
  width?: number;
  height?: number;
  tags?: string[];
}

export interface GroupObjectAsset {
  id: string;
  name: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  layers: ThumbnailLayer[];
  assets: ImageAsset[];
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

export interface BrandKit {
  channelName: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  shadowColor: string;
  logoAssetKey?: string;
}

export type BrandKitColorRole = "primaryColor" | "accentColor" | "shadowColor";

export interface LayoutParseOptions {
  baseWidth: number;
  baseHeight: number;
  existingImageKeys?: string[];
}

export interface LayoutParseResult {
  layers: ThumbnailLayer[];
  warnings: string[];
}
