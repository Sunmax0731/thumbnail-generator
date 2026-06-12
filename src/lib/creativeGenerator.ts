import { makeImageLayer, makeShapeLayer, makeTextLayer } from "./layerFactory";
import { defaultOutputSettings } from "./presets";
import type { LayerAnimation, OutputSettings, ShapeLayer, TextLayer, ThumbnailLayer } from "./types";

export type CreativeGeneratorKind = "youtube-waiting" | "video-thumbnail" | "stream-waiting";
export type VideoThumbnailVariant = "standard" | "vertical" | "cutout";
export type CreativeGeneratorTone = "bold" | "clean" | "neon";

export interface CreativeGeneratorRequest {
  kind: CreativeGeneratorKind;
  variant: VideoThumbnailVariant;
  tone: CreativeGeneratorTone;
  title: string;
  subtitle: string;
  label: string;
  fontFamily: string;
  fontWeight: string;
  titleFontSize: number;
  subtitleFontSize: number;
  backgroundColor: string;
  surfaceColor: string;
  accentColor: string;
  secondaryColor: string;
  textColor: string;
  groupLayers: boolean;
  includeImageSlot: boolean;
  animated: boolean;
}

export interface BuiltCreativeTemplate {
  name: string;
  settings: OutputSettings;
  layers: ThumbnailLayer[];
}

interface CreativeContext {
  request: CreativeGeneratorRequest;
  settings: OutputSettings;
  width: number;
  height: number;
  groupId: string;
  groupName: string;
}

const loopFade: LayerAnimation = {
  type: "fade",
  startMs: 0,
  durationMs: 1600,
  easing: "easeInOutSine",
  loop: true,
  direction: "none",
  distance: 0,
};

const loopPulse: LayerAnimation = {
  type: "pulse",
  startMs: 0,
  durationMs: 1400,
  easing: "easeInOutSine",
  loop: true,
  direction: "none",
  distance: 0,
};

const loopDrift: LayerAnimation = {
  type: "drift",
  startMs: 0,
  durationMs: 4200,
  easing: "easeInOutSine",
  loop: true,
  direction: "right",
  distance: 42,
};

export function createDefaultCreativeDraft(kind: CreativeGeneratorKind): CreativeGeneratorRequest {
  if (kind === "youtube-waiting") {
    return baseDraft(kind, {
      title: "STARTING SOON",
      subtitle: "YouTube Live",
      label: "PLEASE WAIT",
      tone: "neon",
      animated: true,
    });
  }
  if (kind === "stream-waiting") {
    return baseDraft(kind, {
      title: "STREAM STARTS SOON",
      subtitle: "Chat is open",
      label: "LIVE",
      tone: "bold",
      animated: true,
    });
  }
  return baseDraft(kind, {
    title: "BIG UPDATE",
    subtitle: "What changed and why it matters",
    label: "NEW VIDEO",
    tone: "bold",
    animated: false,
  });
}

export function buildCreativeTemplate(
  request: CreativeGeneratorRequest,
  currentSettings: OutputSettings = defaultOutputSettings,
): BuiltCreativeTemplate {
  const normalized = sanitizeCreativeRequest(request);
  const settings = resolveCreativeSettings(normalized, currentSettings);
  const name = buildCreativeName(normalized);
  const context: CreativeContext = {
    request: normalized,
    settings,
    width: settings.width,
    height: settings.height,
    groupId: `${normalized.kind}-${Date.now().toString(36)}`,
    groupName: name,
  };
  const layers =
    normalized.kind === "video-thumbnail"
      ? createVideoThumbnailLayers(context)
      : createWaitingScreenLayers(context, normalized.kind === "youtube-waiting" ? "youtube" : "stream");
  return { name, settings, layers };
}

function baseDraft(
  kind: CreativeGeneratorKind,
  overrides: Partial<CreativeGeneratorRequest>,
): CreativeGeneratorRequest {
  return {
    kind,
    variant: "standard",
    tone: "bold",
    title: "",
    subtitle: "",
    label: "",
    fontFamily: "'Noto Sans JP', 'Yu Gothic', 'Meiryo', Arial, sans-serif",
    fontWeight: "900",
    titleFontSize: 92,
    subtitleFontSize: 34,
    backgroundColor: "#111827",
    surfaceColor: "#ffffff",
    accentColor: "#10b6d7",
    secondaryColor: "#ff4f5f",
    textColor: "#ffffff",
    groupLayers: true,
    includeImageSlot: true,
    animated: false,
    ...overrides,
  };
}

function createWaitingScreenLayers(context: CreativeContext, flavor: "youtube" | "stream"): ThumbnailLayer[] {
  const { request, width, height } = context;
  const scale = width / 1280;
  const yScale = height / 720;
  const title = request.title.trim() || (flavor === "youtube" ? "STARTING SOON" : "STREAM STARTS SOON");
  const subtitle = request.subtitle.trim() || (flavor === "youtube" ? "YouTube Live" : "Chat is open");
  const label = request.label.trim() || (flavor === "youtube" ? "PLEASE WAIT" : "LIVE");
  const titleAnimation = request.animated ? [loopPulse] : undefined;
  const accentAnimation = request.animated ? [loopDrift] : undefined;

  return [
    shape(context, "Waiting background", 0, 0, width, height, request.backgroundColor, 0, request.backgroundColor, 0),
    ...(request.includeImageSlot
      ? [
          makeImageLayer({
            name: "Atmosphere image",
            imageKey: "sample-bg",
            x: 0,
            y: 0,
            width,
            height,
            opacity: request.tone === "clean" ? 0.18 : 0.32,
            effects: { grayscale: request.tone === "neon" ? 0.45 : 0.1, blur: 5, brightness: 72, contrast: 128, mosaic: 0 },
            groupId: groupId(context),
            groupName: groupName(context),
          }),
        ]
      : []),
    shape(context, "Accent wash", width * 0.04, height * 0.1, width * 0.92, height * 0.78, request.surfaceColor, 24 * scale, request.accentColor, 2 * scale, request.tone === "clean" ? 0.18 : 0.1),
    shape(context, "Top signal line", width * 0.08, height * 0.17, width * 0.52, Math.max(8, 16 * yScale), request.accentColor, 999, request.accentColor, 0, 0.95, accentAnimation),
    shape(context, "Bottom signal line", width * 0.4, height * 0.79, width * 0.48, Math.max(8, 16 * yScale), request.secondaryColor, 999, request.secondaryColor, 0, 0.9, accentAnimation),
    shape(context, "Status badge", width * 0.08, height * 0.27, width * 0.22, height * 0.075, request.secondaryColor, 12 * scale, request.secondaryColor, 0, 1, request.animated ? [loopFade] : undefined),
    text(context, "Status badge text", width * 0.095, height * 0.288, width * 0.19, height * 0.04, label, 25 * scale, "#ffffff", "center", 0),
    text(context, "Waiting title", width * 0.08, height * 0.38, width * 0.68, height * 0.19, title, request.titleFontSize * scale, request.textColor, "left", 8 * scale, titleAnimation),
    text(context, "Waiting subtitle", width * 0.08, height * 0.61, width * 0.54, height * 0.08, subtitle, request.subtitleFontSize * scale, request.textColor, "left", 0),
    shape(context, "Waiting circle", width * 0.76, height * 0.26, width * 0.16, width * 0.16, request.accentColor, 999, request.surfaceColor, 8 * scale, 0.9, request.animated ? [loopPulse] : undefined, "ellipse"),
    shape(context, "Waiting small circle", width * 0.71, height * 0.54, width * 0.08, width * 0.08, request.secondaryColor, 999, request.secondaryColor, 0, 0.78, request.animated ? [loopFade] : undefined, "ellipse"),
  ];
}

function createVideoThumbnailLayers(context: CreativeContext): ThumbnailLayer[] {
  const { request, width, height } = context;
  const portrait = request.variant === "vertical";
  const cutout = request.variant === "cutout";
  const scale = width / (portrait ? 1080 : 1280);
  const title = request.title.trim() || (portrait ? "SHORT CLIP" : "BIG UPDATE");
  const subtitle = request.subtitle.trim() || "What changed and why it matters";
  const label = request.label.trim() || (cutout ? "CUTOUT" : "NEW VIDEO");
  const titleY = portrait ? height * 0.48 : height * 0.18;
  const titleHeight = portrait ? height * 0.22 : height * 0.25;

  return [
    shape(context, "Thumbnail background", 0, 0, width, height, request.backgroundColor, 0, request.backgroundColor, 0),
    ...(request.includeImageSlot
      ? [
          makeImageLayer({
            name: cutout ? "Cutout source image" : "Video background image",
            imageKey: "sample-bg",
            x: cutout ? width * 0.58 : 0,
            y: cutout ? height * 0.12 : 0,
            width: cutout ? width * 0.32 : width,
            height: cutout ? height * 0.65 : height,
            opacity: cutout ? 0.78 : 0.45,
            effects: { grayscale: cutout ? 0 : 0.18, blur: cutout ? 0 : 3, brightness: cutout ? 105 : 72, contrast: 122, mosaic: 0 },
            cornerRadius: cutout ? 28 : 0,
            groupId: groupId(context),
            groupName: groupName(context),
          }),
        ]
      : []),
    shape(context, "Title plate", portrait ? width * 0.08 : width * 0.06, titleY - height * 0.04, portrait ? width * 0.84 : width * 0.58, titleHeight, request.surfaceColor, 22 * scale, request.accentColor, 8 * scale, request.tone === "clean" ? 0.96 : 0.9),
    shape(context, "Accent slash", portrait ? width * 0.12 : width * 0.08, portrait ? height * 0.76 : height * 0.72, portrait ? width * 0.76 : width * 0.54, Math.max(22, height * 0.045), request.secondaryColor, 8 * scale, request.secondaryColor, 0, 1),
    shape(context, "Label badge", portrait ? width * 0.12 : width * 0.07, portrait ? height * 0.16 : height * 0.1, portrait ? width * 0.42 : width * 0.2, portrait ? height * 0.065 : height * 0.08, request.accentColor, 14 * scale, request.accentColor, 0),
    text(context, "Label text", portrait ? width * 0.14 : width * 0.085, portrait ? height * 0.18 : height * 0.123, portrait ? width * 0.38 : width * 0.17, portrait ? height * 0.034 : height * 0.035, label, portrait ? 34 * scale : 29 * scale, "#ffffff", "center", 0),
    text(context, "Thumbnail title", portrait ? width * 0.12 : width * 0.09, titleY, portrait ? width * 0.76 : width * 0.52, titleHeight * 0.62, title, request.titleFontSize * scale, request.textColor, portrait ? "center" : "left", 9 * scale),
    text(context, "Thumbnail subtitle", portrait ? width * 0.14 : width * 0.09, portrait ? height * 0.67 : height * 0.56, portrait ? width * 0.72 : width * 0.46, portrait ? height * 0.06 : height * 0.07, subtitle, request.subtitleFontSize * scale, request.textColor, portrait ? "center" : "left", 0),
    ...(cutout
      ? [
          shape(context, "Cutout halo", width * 0.55, height * 0.1, width * 0.38, height * 0.7, request.accentColor, 42 * scale, request.secondaryColor, 10 * scale, 0.2),
          shape(context, "Cutout floor", width * 0.54, height * 0.77, width * 0.36, height * 0.08, request.secondaryColor, 999, request.secondaryColor, 0, 0.86),
        ]
      : [
          shape(context, "Thumbnail side block", portrait ? width * 0.18 : width * 0.7, portrait ? height * 0.25 : height * 0.18, portrait ? width * 0.64 : width * 0.22, portrait ? height * 0.16 : height * 0.36, request.accentColor, 24 * scale, request.surfaceColor, 7 * scale, 0.86),
        ]),
  ];
}

function resolveCreativeSettings(request: CreativeGeneratorRequest, currentSettings: OutputSettings): OutputSettings {
  if (request.kind === "video-thumbnail" && request.variant === "vertical") {
    return { ...currentSettings, presetId: "portrait", width: 1080, height: 1920 };
  }
  if (request.kind === "youtube-waiting" || request.kind === "stream-waiting") {
    return { ...currentSettings, presetId: "fullhd", width: 1920, height: 1080 };
  }
  return { ...currentSettings, presetId: "youtube-720", width: 1280, height: 720 };
}

function sanitizeCreativeRequest(request: CreativeGeneratorRequest): CreativeGeneratorRequest {
  return {
    ...request,
    variant: request.kind === "video-thumbnail" ? request.variant : "standard",
    titleFontSize: clamp(request.titleFontSize, 24, 180),
    subtitleFontSize: clamp(request.subtitleFontSize, 12, 96),
    fontWeight: ["600", "700", "800", "900"].includes(request.fontWeight) ? request.fontWeight : "900",
    tone: request.tone === "clean" || request.tone === "neon" ? request.tone : "bold",
  };
}

function buildCreativeName(request: CreativeGeneratorRequest): string {
  if (request.kind === "youtube-waiting") return "YouTube Waiting Screen";
  if (request.kind === "stream-waiting") return "Stream Waiting Screen";
  if (request.variant === "vertical") return "Vertical Video Thumbnail";
  if (request.variant === "cutout") return "Cutout Video Thumbnail";
  return "Video Thumbnail";
}

function shape(
  context: CreativeContext,
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  cornerRadius: number,
  strokeColor: string,
  strokeWidth: number,
  opacity = 1,
  animations?: LayerAnimation[],
  shapeKind: ShapeLayer["shape"] = "rect",
): ShapeLayer {
  return makeShapeLayer({
    name,
    x,
    y,
    width,
    height,
    fill,
    cornerRadius,
    strokeColor,
    strokeWidth,
    opacity,
    shape: shapeKind,
    groupId: groupId(context),
    groupName: groupName(context),
    animations,
  });
}

function text(
  context: CreativeContext,
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  value: string,
  fontSize: number,
  color: string,
  align: TextLayer["align"],
  strokeWidth: number,
  animations?: LayerAnimation[],
): TextLayer {
  return makeTextLayer({
    name,
    x,
    y,
    width,
    height,
    text: value,
    fontSize,
    fontFamily: context.request.fontFamily,
    fontWeight: context.request.fontWeight,
    color,
    strokeColor: context.request.backgroundColor,
    strokeWidth,
    align,
    lineHeight: 0.92,
    groupId: groupId(context),
    groupName: groupName(context),
    animations,
  });
}

function groupId(context: CreativeContext): string | undefined {
  return context.request.groupLayers ? context.groupId : undefined;
}

function groupName(context: CreativeContext): string | undefined {
  return context.request.groupLayers ? context.groupName : undefined;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}
