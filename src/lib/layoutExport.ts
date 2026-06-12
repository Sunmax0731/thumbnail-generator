import type { ImageLayer, ShapeLayer, TextLayer, ThumbnailLayer } from "./types";

const csvColumns = [
  "type",
  "name",
  "x",
  "y",
  "width",
  "height",
  "rotation",
  "opacity",
  "visible",
  "selectable",
  "groupId",
  "groupName",
  "layerBlur",
  "edgeBlur",
  "edgeBlurStroke",
  "cornerRadius",
  "shadowColor",
  "shadowOpacity",
  "shadowBlur",
  "shadowDistance",
  "shadowAngle",
  "rotateX",
  "rotateY",
  "bevelSize",
  "bevelOpacity",
  "animationType",
  "animationStartMs",
  "animationDurationMs",
  "animationEasing",
  "animationLoop",
  "animationDirection",
  "animationDistance",
  "text",
  "fontSize",
  "fontFamily",
  "fontWeight",
  "color",
  "fillOpacity",
  "strokeColor",
  "strokeWidth",
  "strokeOpacity",
  "align",
  "writingMode",
  "lineHeight",
  "letterSpacing",
  "shape",
  "fill",
  "lineStyle",
  "effect",
  "image",
] as const;

type LayoutValue = string | number | boolean;
type HtmlAttribute = [string, LayoutValue];

export function layersToCsv(layers: ThumbnailLayer[]): string {
  const rows = layers.map((layer) => csvColumns.map((column) => valueForCsvColumn(layer, column)));
  return [csvColumns.join(","), ...rows.map((row) => row.map(escapeCsv).join(","))].join("\n");
}

export function layersToHtml(layers: ThumbnailLayer[]): string {
  const body = layers.map((layer) => `  ${layerToHtml(layer)}`).join("\n");
  return `<section data-thumbnail-layout="thumbnail-generator">\n${body}\n</section>`;
}

function valueForCsvColumn(layer: ThumbnailLayer, column: (typeof csvColumns)[number]): LayoutValue {
  const common: Record<string, LayoutValue> = {
    type: layer.type,
    name: layer.name,
    x: round(layer.x),
    y: round(layer.y),
    width: round(layer.width),
    height: round(layer.height),
    rotation: round(layer.rotation),
    opacity: round(layer.opacity),
    visible: layer.visible,
    selectable: layer.selectable,
    groupId: layer.groupId ?? "",
    groupName: layer.groupName ?? "",
    layerBlur: round(layer.layerBlur ?? 0),
    edgeBlur: round(layer.edgeBlur ?? 0),
    edgeBlurStroke: layer.edgeBlurStroke ?? false,
    cornerRadius: round(layer.cornerRadius ?? 0),
    shadowColor: layer.shadowColor ?? "#000000",
    shadowOpacity: round(layer.shadowOpacity ?? 0, 2),
    shadowBlur: round(layer.shadowBlur ?? 0),
    shadowDistance: round(layer.shadowDistance ?? 0),
    shadowAngle: round(layer.shadowAngle ?? 135),
    rotateX: round(layer.rotateX ?? 0),
    rotateY: round(layer.rotateY ?? 0),
    bevelSize: round(layer.bevelSize ?? 0),
    bevelOpacity: round(layer.bevelOpacity ?? 0, 2),
    animationType: layer.animation?.type ?? "",
    animationStartMs: layer.animation ? round(layer.animation.startMs) : "",
    animationDurationMs: layer.animation ? round(layer.animation.durationMs) : "",
    animationEasing: layer.animation?.easing ?? "",
    animationLoop: layer.animation?.loop ?? "",
    animationDirection: layer.animation?.direction ?? "",
    animationDistance: layer.animation ? round(layer.animation.distance) : "",
  };
  if (column in common) return common[column];

  if (layer.type === "image") return imageCsvValue(layer, column);
  if (layer.type === "text") return textCsvValue(layer, column);
  return shapeCsvValue(layer, column);
}

function imageCsvValue(layer: ImageLayer, column: string): string | number {
  if (column === "effect") return effectsToString(layer);
  if (column === "image") return layer.imageKey;
  return "";
}

function textCsvValue(layer: TextLayer, column: string): string | number {
  const map: Record<string, string | number> = {
    text: layer.text,
    fontSize: round(layer.fontSize),
    fontFamily: layer.fontFamily,
    fontWeight: layer.fontWeight,
    color: layer.color,
    fillOpacity: round(layer.fillOpacity),
    strokeColor: layer.strokeColor,
    strokeWidth: round(layer.strokeWidth),
    strokeOpacity: round(layer.strokeOpacity),
    align: layer.align,
    writingMode: layer.writingMode,
    lineHeight: round(layer.lineHeight),
    letterSpacing: round(layer.letterSpacing),
  };
  return map[column] ?? "";
}

function shapeCsvValue(layer: ShapeLayer, column: string): string | number {
  const map: Record<string, string | number> = {
    shape: layer.shape,
    fill: layer.fill,
    fillOpacity: round(layer.fillOpacity),
    strokeColor: layer.strokeColor,
    strokeWidth: round(layer.strokeWidth),
    strokeOpacity: round(layer.strokeOpacity),
    lineStyle: layer.lineStyle,
  };
  return map[column] ?? "";
}

function layerToHtml(layer: ThumbnailLayer): string {
  const common: HtmlAttribute[] = [
    ["data-layer", layer.type],
    ["data-name", layer.name],
    ["data-x", round(layer.x)],
    ["data-y", round(layer.y)],
    ["data-width", round(layer.width)],
    ["data-height", round(layer.height)],
    ["data-rotation", round(layer.rotation)],
    ["data-opacity", round(layer.opacity)],
    ["data-visible", String(layer.visible)],
    ["data-selectable", String(layer.selectable)],
    ["data-group-id", layer.groupId ?? ""],
    ["data-group-name", layer.groupName ?? ""],
    ["data-layer-blur", round(layer.layerBlur ?? 0)],
    ["data-edge-blur", round(layer.edgeBlur ?? 0)],
    ["data-edge-blur-stroke", String(layer.edgeBlurStroke ?? false)],
    ["data-corner-radius", round(layer.cornerRadius ?? 0)],
    ["data-shadow-color", layer.shadowColor ?? "#000000"],
    ["data-shadow-opacity", round(layer.shadowOpacity ?? 0, 2)],
    ["data-shadow-blur", round(layer.shadowBlur ?? 0)],
    ["data-shadow-distance", round(layer.shadowDistance ?? 0)],
    ["data-shadow-angle", round(layer.shadowAngle ?? 135)],
    ["data-rotate-x", round(layer.rotateX ?? 0)],
    ["data-rotate-y", round(layer.rotateY ?? 0)],
    ["data-bevel-size", round(layer.bevelSize ?? 0)],
    ["data-bevel-opacity", round(layer.bevelOpacity ?? 0, 2)],
    ["data-animation-type", layer.animation?.type ?? ""],
    ["data-animation-start-ms", layer.animation ? round(layer.animation.startMs) : ""],
    ["data-animation-duration-ms", layer.animation ? round(layer.animation.durationMs) : ""],
    ["data-animation-easing", layer.animation?.easing ?? ""],
    ["data-animation-loop", layer.animation ? String(layer.animation.loop) : ""],
    ["data-animation-direction", layer.animation?.direction ?? ""],
    ["data-animation-distance", layer.animation ? round(layer.animation.distance) : ""],
  ];

  if (layer.type === "image") {
    return `<img ${attrs([...common, ["data-image", layer.imageKey], ["data-effect", effectsToString(layer)]])} />`;
  }

  if (layer.type === "shape") {
    return `<div ${attrs([
      ...common,
      ["data-shape", layer.shape],
      ["data-fill", layer.fill],
      ["data-fill-opacity", round(layer.fillOpacity)],
      ["data-stroke-color", layer.strokeColor],
      ["data-stroke-width", round(layer.strokeWidth)],
      ["data-stroke-opacity", round(layer.strokeOpacity)],
      ["data-line-style", layer.lineStyle],
    ])}></div>`;
  }

  return `<div ${attrs([
    ...common,
    ["data-font-size", round(layer.fontSize)],
    ["data-font-family", layer.fontFamily],
    ["data-font-weight", layer.fontWeight],
    ["data-color", layer.color],
    ["data-fill-opacity", round(layer.fillOpacity)],
    ["data-stroke-color", layer.strokeColor],
    ["data-stroke-width", round(layer.strokeWidth)],
    ["data-stroke-opacity", round(layer.strokeOpacity)],
    ["data-align", layer.align],
    ["data-writing-mode", layer.writingMode],
    ["data-line-height", round(layer.lineHeight)],
    ["data-letter-spacing", round(layer.letterSpacing)],
  ])}>${escapeHtml(layer.text)}</div>`;
}

function attrs(items: Array<[string, LayoutValue]>): string {
  return items
    .filter(([, value]) => value !== "")
    .map(([key, value]) => `${key}="${escapeHtml(String(value))}"`)
    .join(" ");
}

function effectsToString(layer: ImageLayer): string {
  const { effects } = layer;
  return [
    ["grayscale", effects.grayscale],
    ["blur", effects.blur],
    ["brightness", effects.brightness],
    ["contrast", effects.contrast],
    ["mosaic", effects.mosaic],
  ]
    .filter(([key, value]) => Number(value) !== (key === "brightness" || key === "contrast" ? 100 : 0))
    .map(([key, value]) => `${key}=${round(Number(value))}`)
    .join(";");
}

function escapeCsv(value: LayoutValue): string {
  const text = String(value);
  if (!/[",\r\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function round(value: number, decimals = 2): number {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}
