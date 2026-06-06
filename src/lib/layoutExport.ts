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
  "text",
  "fontSize",
  "fontFamily",
  "fontWeight",
  "color",
  "strokeColor",
  "strokeWidth",
  "align",
  "lineHeight",
  "shape",
  "fill",
  "effect",
  "image",
] as const;

type HtmlAttribute = [string, string | number];

export function layersToCsv(layers: ThumbnailLayer[]): string {
  const rows = layers.map((layer) => csvColumns.map((column) => valueForCsvColumn(layer, column)));
  return [csvColumns.join(","), ...rows.map((row) => row.map(escapeCsv).join(","))].join("\n");
}

export function layersToHtml(layers: ThumbnailLayer[]): string {
  const body = layers.map((layer) => `  ${layerToHtml(layer)}`).join("\n");
  return `<section data-thumbnail-layout="thumbnail-generator">\n${body}\n</section>`;
}

function valueForCsvColumn(layer: ThumbnailLayer, column: (typeof csvColumns)[number]): string | number {
  const common: Record<string, string | number> = {
    type: layer.type,
    name: layer.name,
    x: round(layer.x),
    y: round(layer.y),
    width: round(layer.width),
    height: round(layer.height),
    rotation: round(layer.rotation),
    opacity: round(layer.opacity),
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
    strokeColor: layer.strokeColor,
    strokeWidth: round(layer.strokeWidth),
    align: layer.align,
    lineHeight: round(layer.lineHeight),
  };
  return map[column] ?? "";
}

function shapeCsvValue(layer: ShapeLayer, column: string): string | number {
  const map: Record<string, string | number> = {
    shape: layer.shape,
    fill: layer.fill,
    strokeColor: layer.strokeColor,
    strokeWidth: round(layer.strokeWidth),
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
  ];

  if (layer.type === "image") {
    return `<img ${attrs([...common, ["data-image", layer.imageKey], ["data-effect", effectsToString(layer)]])} />`;
  }

  if (layer.type === "shape") {
    return `<div ${attrs([
      ...common,
      ["data-shape", layer.shape],
      ["data-fill", layer.fill],
      ["data-stroke-color", layer.strokeColor],
      ["data-stroke-width", round(layer.strokeWidth)],
    ])}></div>`;
  }

  return `<div ${attrs([
    ...common,
    ["data-font-size", round(layer.fontSize)],
    ["data-font-family", layer.fontFamily],
    ["data-font-weight", layer.fontWeight],
    ["data-color", layer.color],
    ["data-stroke-color", layer.strokeColor],
    ["data-stroke-width", round(layer.strokeWidth)],
    ["data-align", layer.align],
    ["data-line-height", round(layer.lineHeight)],
  ])}>${escapeHtml(layer.text)}</div>`;
}

function attrs(items: Array<[string, string | number]>): string {
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

function escapeCsv(value: string | number): string {
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

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
