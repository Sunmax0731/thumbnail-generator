import { makeImageLayer, makeShapeLayer, makeTextLayer } from "./layerFactory";
import { defaultOutputSettings } from "./presets";
import type { LayerAnimation, OutputSettings, ShapeLayer, TextLayer, ThumbnailLayer } from "./types";

export type CreativeGeneratorKind = "standard-thumbnail" | "vertical-thumbnail" | "stream-waiting";
export type CreativeLayoutPattern = "pattern-1" | "pattern-2" | "pattern-3" | "pattern-4" | "pattern-5";
export type CreativeGeneratorTone = "bold" | "clean" | "neon";

export interface CreativeGeneratorRequest {
  kind: CreativeGeneratorKind;
  tone: CreativeGeneratorTone;
  title: string;
  subtitle: string;
  label: string;
  layoutPattern: CreativeLayoutPattern;
  fontFamily: string;
  fontWeight: string;
  letterSpacing: number;
  titleFontSize: number;
  titleStrokeWidth: number;
  titleAlign: TextLayer["align"];
  subtitleFontSize: number;
  subtitleStrokeWidth: number;
  subtitleAlign: TextLayer["align"];
  labelFontSize: number;
  labelStrokeWidth: number;
  labelAlign: TextLayer["align"];
  labelCornerRadius: number;
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
  if (kind === "stream-waiting") {
    return baseDraft(kind, {
      title: "STREAM STARTS SOON",
      subtitle: "Chat is open",
      label: "LIVE",
      tone: "bold",
      animated: true,
    });
  }
  if (kind === "vertical-thumbnail") {
    return baseDraft(kind, {
      title: "SHORT CLIP",
      subtitle: "Best moment from the stream",
      label: "VERTICAL",
      tone: "clean",
      animated: false,
      titleAlign: "center",
      subtitleAlign: "center",
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
    normalized.kind === "stream-waiting" ? createWaitingScreenLayers(context) : createVideoThumbnailLayers(context);
  return { name, settings, layers };
}

function baseDraft(
  kind: CreativeGeneratorKind,
  overrides: Partial<CreativeGeneratorRequest>,
): CreativeGeneratorRequest {
  return {
    kind,
    tone: "bold",
    title: "",
    subtitle: "",
    label: "",
    layoutPattern: "pattern-1",
    fontFamily: "'Noto Sans JP', 'Yu Gothic', 'Meiryo', Arial, sans-serif",
    fontWeight: "900",
    letterSpacing: 0,
    titleFontSize: 92,
    titleStrokeWidth: 9,
    titleAlign: "left",
    subtitleFontSize: 34,
    subtitleStrokeWidth: 0,
    subtitleAlign: "left",
    labelFontSize: 28,
    labelStrokeWidth: 0,
    labelAlign: "center",
    labelCornerRadius: 14,
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

function createWaitingScreenLayers(context: CreativeContext): ThumbnailLayer[] {
  const { request, width, height } = context;
  const scale = width / 1280;
  const yScale = height / 720;
  const layout = waitingLayout(request.layoutPattern);
  const title = request.title.trim() || "STREAM STARTS SOON";
  const subtitle = request.subtitle.trim() || "Chat is open";
  const label = request.label.trim() || "LIVE";
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
    shape(context, "Top signal line", width * layout.topLineX, height * layout.topLineY, width * layout.topLineW, Math.max(8, 16 * yScale), request.accentColor, 999, request.accentColor, 0, 0.95, accentAnimation),
    shape(context, "Bottom signal line", width * layout.bottomLineX, height * layout.bottomLineY, width * layout.bottomLineW, Math.max(8, 16 * yScale), request.secondaryColor, 999, request.secondaryColor, 0, 0.9, accentAnimation),
    shape(context, "Status badge", width * layout.labelX, height * layout.labelY, width * layout.labelW, height * layout.labelH, request.secondaryColor, request.labelCornerRadius * scale, request.secondaryColor, 0, 1, request.animated ? [loopFade] : undefined),
    text(context, "Status badge text", width * (layout.labelX + 0.012), height * (layout.labelY + 0.018), width * Math.max(0.08, layout.labelW - 0.024), height * Math.max(0.03, layout.labelH - 0.03), label, request.labelFontSize * scale, "#ffffff", request.labelAlign, request.labelStrokeWidth * scale),
    text(context, "Waiting title", width * layout.titleX, height * layout.titleY, width * layout.titleW, height * layout.titleH, title, request.titleFontSize * scale, request.textColor, request.titleAlign, request.titleStrokeWidth * scale, titleAnimation),
    text(context, "Waiting subtitle", width * layout.subtitleX, height * layout.subtitleY, width * layout.subtitleW, height * layout.subtitleH, subtitle, request.subtitleFontSize * scale, request.textColor, request.subtitleAlign, request.subtitleStrokeWidth * scale),
    shape(context, "Waiting circle", width * layout.circleX, height * layout.circleY, width * 0.16, width * 0.16, request.accentColor, 999, request.surfaceColor, 8 * scale, 0.9, request.animated ? [loopPulse] : undefined, "ellipse"),
    shape(context, "Waiting small circle", width * layout.smallCircleX, height * layout.smallCircleY, width * 0.08, width * 0.08, request.secondaryColor, 999, request.secondaryColor, 0, 0.78, request.animated ? [loopFade] : undefined, "ellipse"),
  ];
}

function createVideoThumbnailLayers(context: CreativeContext): ThumbnailLayer[] {
  const { request, width, height } = context;
  const vertical = request.kind === "vertical-thumbnail";
  const scale = width / (vertical ? 1080 : 1280);
  const layout = thumbnailLayout(request.layoutPattern, vertical);
  const toneStyle = thumbnailToneStyle(request.tone);
  const title = request.title.trim() || (vertical ? "SHORT CLIP" : "BIG UPDATE");
  const subtitle = request.subtitle.trim() || (vertical ? "Best moment from the stream" : "What changed and why it matters");
  const label = request.label.trim() || (vertical ? "VERTICAL" : "NEW VIDEO");

  return [
    shape(context, "Thumbnail background", 0, 0, width, height, request.backgroundColor, 0, request.backgroundColor, 0),
    ...(request.includeImageSlot
      ? [
          makeImageLayer({
            name: vertical ? "Vertical source image" : "Video background image",
            imageKey: "sample-bg",
            x: width * layout.imageX,
            y: height * layout.imageY,
            width: width * layout.imageW,
            height: height * layout.imageH,
            opacity: Math.min(1, layout.imageOpacity * toneStyle.imageOpacityMultiplier),
            effects: {
              grayscale: layout.imageFocused ? toneStyle.focusedImageGrayscale : toneStyle.backgroundImageGrayscale,
              blur: layout.imageFocused ? toneStyle.focusedImageBlur : toneStyle.backgroundImageBlur,
              brightness: layout.imageFocused ? toneStyle.focusedImageBrightness : toneStyle.backgroundImageBrightness,
              contrast: toneStyle.imageContrast,
              mosaic: 0,
            },
            cornerRadius: layout.imageFocused ? 28 * scale : 0,
            groupId: groupId(context),
            groupName: groupName(context),
          }),
        ]
      : []),
    shape(context, "Title plate", width * layout.titlePlateX, height * layout.titlePlateY, width * layout.titlePlateW, height * layout.titlePlateH, request.surfaceColor, 22 * scale, request.accentColor, 8 * scale, toneStyle.titlePlateOpacity),
    shape(context, "Accent slash", width * layout.accentX, height * layout.accentY, width * layout.accentW, Math.max(22, height * layout.accentH), request.secondaryColor, 8 * scale, request.secondaryColor, 0, toneStyle.accentOpacity),
    shape(context, "Label badge", width * layout.labelX, height * layout.labelY, width * layout.labelW, height * layout.labelH, request.accentColor, request.labelCornerRadius * scale, request.accentColor, 0),
    text(context, "Label text", width * (layout.labelX + 0.012), height * (layout.labelY + 0.023), width * Math.max(0.08, layout.labelW - 0.024), height * Math.max(0.03, layout.labelH - 0.04), label, request.labelFontSize * scale, "#ffffff", request.labelAlign, request.labelStrokeWidth * scale),
    text(context, "Thumbnail title", width * layout.titleX, height * layout.titleY, width * layout.titleW, height * layout.titleH, title, request.titleFontSize * scale, request.textColor, request.titleAlign, request.titleStrokeWidth * scale),
    text(context, "Thumbnail subtitle", width * layout.subtitleX, height * layout.subtitleY, width * layout.subtitleW, height * layout.subtitleH, subtitle, request.subtitleFontSize * scale, request.textColor, request.subtitleAlign, request.subtitleStrokeWidth * scale),
    ...(layout.imageFocused
      ? [
          shape(context, "Image halo", width * Math.max(0, layout.imageX - 0.02), height * Math.max(0, layout.imageY - 0.02), width * Math.min(1, layout.imageW + 0.04), height * Math.min(1, layout.imageH + 0.04), request.accentColor, 42 * scale, request.secondaryColor, 10 * scale, toneStyle.haloOpacity),
          shape(context, "Image floor", width * layout.imageX, height * Math.min(0.94, layout.imageY + layout.imageH + 0.02), width * layout.imageW, height * 0.055, request.secondaryColor, 999, request.secondaryColor, 0, toneStyle.floorOpacity),
        ]
      : [
          shape(context, "Thumbnail side block", width * layout.blockX, height * layout.blockY, width * layout.blockW, height * layout.blockH, request.accentColor, 24 * scale, request.surfaceColor, 7 * scale, toneStyle.blockOpacity),
        ]),
  ];
}

interface ThumbnailToneStyle {
  imageOpacityMultiplier: number;
  backgroundImageGrayscale: number;
  backgroundImageBlur: number;
  backgroundImageBrightness: number;
  focusedImageGrayscale: number;
  focusedImageBlur: number;
  focusedImageBrightness: number;
  imageContrast: number;
  titlePlateOpacity: number;
  accentOpacity: number;
  blockOpacity: number;
  haloOpacity: number;
  floorOpacity: number;
}

function thumbnailToneStyle(tone: CreativeGeneratorTone): ThumbnailToneStyle {
  if (tone === "clean") {
    return {
      imageOpacityMultiplier: 0.78,
      backgroundImageGrayscale: 0.05,
      backgroundImageBlur: 1,
      backgroundImageBrightness: 92,
      focusedImageGrayscale: 0,
      focusedImageBlur: 0,
      focusedImageBrightness: 108,
      imageContrast: 110,
      titlePlateOpacity: 0.98,
      accentOpacity: 0.82,
      blockOpacity: 0.62,
      haloOpacity: 0.12,
      floorOpacity: 0.72,
    };
  }
  if (tone === "neon") {
    return {
      imageOpacityMultiplier: 1.08,
      backgroundImageGrayscale: 0.42,
      backgroundImageBlur: 2,
      backgroundImageBrightness: 68,
      focusedImageGrayscale: 0.15,
      focusedImageBlur: 0,
      focusedImageBrightness: 114,
      imageContrast: 150,
      titlePlateOpacity: 0.72,
      accentOpacity: 1,
      blockOpacity: 0.94,
      haloOpacity: 0.34,
      floorOpacity: 0.95,
    };
  }
  return {
    imageOpacityMultiplier: 1,
    backgroundImageGrayscale: 0.18,
    backgroundImageBlur: 3,
    backgroundImageBrightness: 72,
    focusedImageGrayscale: 0,
    focusedImageBlur: 0,
    focusedImageBrightness: 106,
    imageContrast: 122,
    titlePlateOpacity: 0.9,
    accentOpacity: 1,
    blockOpacity: 0.86,
    haloOpacity: 0.2,
    floorOpacity: 0.86,
  };
}

function resolveCreativeSettings(request: CreativeGeneratorRequest, currentSettings: OutputSettings): OutputSettings {
  if (request.kind === "stream-waiting") {
    return { ...currentSettings, presetId: "fullhd", width: 1920, height: 1080 };
  }
  if (request.kind === "vertical-thumbnail") {
    return { ...currentSettings, presetId: "portrait", width: 1080, height: 1920 };
  }
  return { ...currentSettings, presetId: "youtube-720", width: 1280, height: 720 };
}

function sanitizeCreativeRequest(request: CreativeGeneratorRequest): CreativeGeneratorRequest {
  return {
    ...request,
    layoutPattern: isLayoutPattern(request.layoutPattern) ? request.layoutPattern : "pattern-1",
    letterSpacing: clamp(request.letterSpacing, -8, 24),
    titleFontSize: clamp(request.titleFontSize, 24, 180),
    titleStrokeWidth: clamp(request.titleStrokeWidth, 0, 20),
    titleAlign: sanitizeAlign(request.titleAlign, "left"),
    subtitleFontSize: clamp(request.subtitleFontSize, 12, 96),
    subtitleStrokeWidth: clamp(request.subtitleStrokeWidth, 0, 14),
    subtitleAlign: sanitizeAlign(request.subtitleAlign, "left"),
    labelFontSize: clamp(request.labelFontSize, 10, 72),
    labelStrokeWidth: clamp(request.labelStrokeWidth, 0, 12),
    labelAlign: sanitizeAlign(request.labelAlign, "center"),
    labelCornerRadius: clamp(request.labelCornerRadius, 0, 42),
    fontWeight: ["600", "700", "800", "900"].includes(request.fontWeight) ? request.fontWeight : "900",
    tone: request.tone === "clean" || request.tone === "neon" ? request.tone : "bold",
  };
}

function buildCreativeName(request: CreativeGeneratorRequest): string {
  if (request.kind === "stream-waiting") return "Stream Waiting Screen";
  if (request.kind === "vertical-thumbnail") return "Vertical Thumbnail";
  return "Standard Thumbnail";
}

interface ThumbnailLayout {
  imageX: number;
  imageY: number;
  imageW: number;
  imageH: number;
  imageOpacity: number;
  imageFocused: boolean;
  titlePlateX: number;
  titlePlateY: number;
  titlePlateW: number;
  titlePlateH: number;
  titleX: number;
  titleY: number;
  titleW: number;
  titleH: number;
  subtitleX: number;
  subtitleY: number;
  subtitleW: number;
  subtitleH: number;
  labelX: number;
  labelY: number;
  labelW: number;
  labelH: number;
  accentX: number;
  accentY: number;
  accentW: number;
  accentH: number;
  blockX: number;
  blockY: number;
  blockW: number;
  blockH: number;
}

function thumbnailLayout(pattern: CreativeLayoutPattern, vertical: boolean): ThumbnailLayout {
  const layouts: Record<CreativeLayoutPattern, ThumbnailLayout> = vertical
    ? {
        "pattern-1": { imageX: 0, imageY: 0, imageW: 1, imageH: 1, imageOpacity: 0.44, imageFocused: false, titlePlateX: 0.08, titlePlateY: 0.44, titlePlateW: 0.84, titlePlateH: 0.2, titleX: 0.12, titleY: 0.48, titleW: 0.76, titleH: 0.13, subtitleX: 0.14, subtitleY: 0.68, subtitleW: 0.72, subtitleH: 0.06, labelX: 0.12, labelY: 0.14, labelW: 0.4, labelH: 0.065, accentX: 0.12, accentY: 0.78, accentW: 0.76, accentH: 0.035, blockX: 0.18, blockY: 0.24, blockW: 0.64, blockH: 0.16 },
        "pattern-2": { imageX: 0.12, imageY: 0.12, imageW: 0.76, imageH: 0.38, imageOpacity: 0.82, imageFocused: true, titlePlateX: 0.08, titlePlateY: 0.56, titlePlateW: 0.84, titlePlateH: 0.18, titleX: 0.12, titleY: 0.59, titleW: 0.76, titleH: 0.12, subtitleX: 0.14, subtitleY: 0.77, subtitleW: 0.72, subtitleH: 0.055, labelX: 0.1, labelY: 0.05, labelW: 0.38, labelH: 0.055, accentX: 0.18, accentY: 0.86, accentW: 0.64, accentH: 0.03, blockX: 0.62, blockY: 0.08, blockW: 0.24, blockH: 0.22 },
        "pattern-3": { imageX: 0, imageY: 0, imageW: 1, imageH: 1, imageOpacity: 0.38, imageFocused: false, titlePlateX: 0.08, titlePlateY: 0.18, titlePlateW: 0.84, titlePlateH: 0.2, titleX: 0.12, titleY: 0.22, titleW: 0.76, titleH: 0.13, subtitleX: 0.14, subtitleY: 0.42, subtitleW: 0.72, subtitleH: 0.055, labelX: 0.3, labelY: 0.78, labelW: 0.4, labelH: 0.06, accentX: 0.18, accentY: 0.12, accentW: 0.64, accentH: 0.03, blockX: 0.2, blockY: 0.56, blockW: 0.6, blockH: 0.14 },
        "pattern-4": { imageX: 0.1, imageY: 0.5, imageW: 0.8, imageH: 0.36, imageOpacity: 0.84, imageFocused: true, titlePlateX: 0.06, titlePlateY: 0.12, titlePlateW: 0.88, titlePlateH: 0.24, titleX: 0.1, titleY: 0.16, titleW: 0.8, titleH: 0.16, subtitleX: 0.12, subtitleY: 0.38, subtitleW: 0.76, subtitleH: 0.055, labelX: 0.12, labelY: 0.88, labelW: 0.42, labelH: 0.055, accentX: 0.26, accentY: 0.45, accentW: 0.5, accentH: 0.03, blockX: 0.62, blockY: 0.12, blockW: 0.22, blockH: 0.2 },
        "pattern-5": { imageX: 0.54, imageY: 0.08, imageW: 0.34, imageH: 0.78, imageOpacity: 0.84, imageFocused: true, titlePlateX: 0.08, titlePlateY: 0.2, titlePlateW: 0.5, titlePlateH: 0.34, titleX: 0.11, titleY: 0.25, titleW: 0.44, titleH: 0.2, subtitleX: 0.11, subtitleY: 0.6, subtitleW: 0.42, subtitleH: 0.08, labelX: 0.11, labelY: 0.11, labelW: 0.34, labelH: 0.055, accentX: 0.12, accentY: 0.74, accentW: 0.34, accentH: 0.03, blockX: 0.1, blockY: 0.72, blockW: 0.34, blockH: 0.12 },
      }
    : {
        "pattern-1": { imageX: 0, imageY: 0, imageW: 1, imageH: 1, imageOpacity: 0.45, imageFocused: false, titlePlateX: 0.06, titlePlateY: 0.14, titlePlateW: 0.58, titlePlateH: 0.25, titleX: 0.09, titleY: 0.18, titleW: 0.52, titleH: 0.155, subtitleX: 0.09, subtitleY: 0.56, subtitleW: 0.46, subtitleH: 0.07, labelX: 0.07, labelY: 0.1, labelW: 0.2, labelH: 0.08, accentX: 0.08, accentY: 0.72, accentW: 0.54, accentH: 0.045, blockX: 0.7, blockY: 0.18, blockW: 0.22, blockH: 0.36 },
        "pattern-2": { imageX: 0.58, imageY: 0.1, imageW: 0.32, imageH: 0.68, imageOpacity: 0.82, imageFocused: true, titlePlateX: 0.06, titlePlateY: 0.26, titlePlateW: 0.5, titlePlateH: 0.3, titleX: 0.09, titleY: 0.3, titleW: 0.44, titleH: 0.19, subtitleX: 0.09, subtitleY: 0.62, subtitleW: 0.42, subtitleH: 0.07, labelX: 0.07, labelY: 0.12, labelW: 0.18, labelH: 0.08, accentX: 0.08, accentY: 0.78, accentW: 0.42, accentH: 0.045, blockX: 0.64, blockY: 0.12, blockW: 0.26, blockH: 0.2 },
        "pattern-3": { imageX: 0, imageY: 0, imageW: 1, imageH: 1, imageOpacity: 0.38, imageFocused: false, titlePlateX: 0.15, titlePlateY: 0.24, titlePlateW: 0.7, titlePlateH: 0.28, titleX: 0.19, titleY: 0.29, titleW: 0.62, titleH: 0.17, subtitleX: 0.22, subtitleY: 0.58, subtitleW: 0.56, subtitleH: 0.07, labelX: 0.39, labelY: 0.12, labelW: 0.22, labelH: 0.08, accentX: 0.22, accentY: 0.72, accentW: 0.56, accentH: 0.045, blockX: 0.7, blockY: 0.16, blockW: 0.16, blockH: 0.24 },
        "pattern-4": { imageX: 0.04, imageY: 0.08, imageW: 0.42, imageH: 0.72, imageOpacity: 0.82, imageFocused: true, titlePlateX: 0.42, titlePlateY: 0.18, titlePlateW: 0.5, titlePlateH: 0.34, titleX: 0.46, titleY: 0.23, titleW: 0.42, titleH: 0.2, subtitleX: 0.46, subtitleY: 0.58, subtitleW: 0.4, subtitleH: 0.07, labelX: 0.47, labelY: 0.1, labelW: 0.18, labelH: 0.08, accentX: 0.48, accentY: 0.74, accentW: 0.34, accentH: 0.045, blockX: 0.7, blockY: 0.12, blockW: 0.18, blockH: 0.24 },
        "pattern-5": { imageX: 0, imageY: 0, imageW: 1, imageH: 1, imageOpacity: 0.42, imageFocused: false, titlePlateX: 0.08, titlePlateY: 0.46, titlePlateW: 0.76, titlePlateH: 0.26, titleX: 0.12, titleY: 0.5, titleW: 0.68, titleH: 0.15, subtitleX: 0.12, subtitleY: 0.76, subtitleW: 0.46, subtitleH: 0.07, labelX: 0.08, labelY: 0.18, labelW: 0.2, labelH: 0.08, accentX: 0.32, accentY: 0.18, accentW: 0.48, accentH: 0.045, blockX: 0.68, blockY: 0.22, blockW: 0.22, blockH: 0.24 },
      };
  return layouts[pattern];
}

interface WaitingLayout {
  titleX: number;
  titleY: number;
  titleW: number;
  titleH: number;
  subtitleX: number;
  subtitleY: number;
  subtitleW: number;
  subtitleH: number;
  labelX: number;
  labelY: number;
  labelW: number;
  labelH: number;
  topLineX: number;
  topLineY: number;
  topLineW: number;
  bottomLineX: number;
  bottomLineY: number;
  bottomLineW: number;
  circleX: number;
  circleY: number;
  smallCircleX: number;
  smallCircleY: number;
}

function waitingLayout(pattern: CreativeLayoutPattern): WaitingLayout {
  const layouts: Record<CreativeLayoutPattern, WaitingLayout> = {
    "pattern-1": { titleX: 0.08, titleY: 0.38, titleW: 0.68, titleH: 0.19, subtitleX: 0.08, subtitleY: 0.61, subtitleW: 0.54, subtitleH: 0.08, labelX: 0.08, labelY: 0.27, labelW: 0.22, labelH: 0.075, topLineX: 0.08, topLineY: 0.17, topLineW: 0.52, bottomLineX: 0.4, bottomLineY: 0.79, bottomLineW: 0.48, circleX: 0.76, circleY: 0.26, smallCircleX: 0.71, smallCircleY: 0.54 },
    "pattern-2": { titleX: 0.26, titleY: 0.34, titleW: 0.48, titleH: 0.2, subtitleX: 0.28, subtitleY: 0.6, subtitleW: 0.44, subtitleH: 0.08, labelX: 0.39, labelY: 0.2, labelW: 0.22, labelH: 0.075, topLineX: 0.24, topLineY: 0.16, topLineW: 0.52, bottomLineX: 0.24, bottomLineY: 0.76, bottomLineW: 0.52, circleX: 0.08, circleY: 0.22, smallCircleX: 0.82, smallCircleY: 0.58 },
    "pattern-3": { titleX: 0.14, titleY: 0.18, titleW: 0.58, titleH: 0.2, subtitleX: 0.14, subtitleY: 0.43, subtitleW: 0.48, subtitleH: 0.08, labelX: 0.14, labelY: 0.63, labelW: 0.22, labelH: 0.075, topLineX: 0.14, topLineY: 0.78, topLineW: 0.42, bottomLineX: 0.5, bottomLineY: 0.58, bottomLineW: 0.34, circleX: 0.7, circleY: 0.18, smallCircleX: 0.78, smallCircleY: 0.52 },
    "pattern-4": { titleX: 0.38, titleY: 0.38, titleW: 0.5, titleH: 0.2, subtitleX: 0.42, subtitleY: 0.63, subtitleW: 0.4, subtitleH: 0.08, labelX: 0.66, labelY: 0.25, labelW: 0.22, labelH: 0.075, topLineX: 0.12, topLineY: 0.2, topLineW: 0.46, bottomLineX: 0.18, bottomLineY: 0.78, bottomLineW: 0.42, circleX: 0.12, circleY: 0.32, smallCircleX: 0.27, smallCircleY: 0.58 },
    "pattern-5": { titleX: 0.1, titleY: 0.5, titleW: 0.62, titleH: 0.18, subtitleX: 0.1, subtitleY: 0.73, subtitleW: 0.42, subtitleH: 0.07, labelX: 0.1, labelY: 0.15, labelW: 0.2, labelH: 0.075, topLineX: 0.36, topLineY: 0.18, topLineW: 0.44, bottomLineX: 0.12, bottomLineY: 0.38, bottomLineW: 0.46, circleX: 0.74, circleY: 0.42, smallCircleX: 0.66, smallCircleY: 0.68 },
  };
  return layouts[pattern];
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
    letterSpacing: context.request.letterSpacing,
    groupId: groupId(context),
    groupName: groupName(context),
    animations,
  });
}

function isLayoutPattern(value: unknown): value is CreativeLayoutPattern {
  return value === "pattern-1" || value === "pattern-2" || value === "pattern-3" || value === "pattern-4" || value === "pattern-5";
}

function sanitizeAlign(value: unknown, fallback: TextLayer["align"]): TextLayer["align"] {
  return value === "left" || value === "center" || value === "right" ? value : fallback;
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
