import { defaultEffects, makeImageLayer, makeShapeLayer, makeTextLayer, normalizeAnimation } from "./layerFactory";
import type {
  ImageEffects,
  LayoutParseOptions,
  LayoutParseResult,
  LineStyle,
  TextAlign,
  TextWritingMode,
  ThumbnailLayer,
} from "./types";

const requiredColumns = ["type"];

export function parseCsvLayout(csvText: string, options: LayoutParseOptions): LayoutParseResult {
  const warnings: string[] = [];
  const rows = parseCsvRows(csvText).filter((row) => row.some((cell) => cell.trim().length > 0));
  if (rows.length === 0) {
    return { layers: [], warnings: ["CSV is empty."] };
  }

  const header = rows[0].map((cell) => cell.trim());
  for (const column of requiredColumns) {
    if (!header.includes(column)) {
      return { layers: [], warnings: [`Missing required CSV column: ${column}`] };
    }
  }

  const layers: ThumbnailLayer[] = rows.slice(1).flatMap((row, index): ThumbnailLayer[] => {
    const record = Object.fromEntries(header.map((key, cellIndex) => [key, row[cellIndex] ?? ""]));
    const type = record.type?.trim().toLowerCase();
    const base = {
      name: record.name?.trim() || `${type || "layer"} ${index + 1}`,
      x: numberOr(record.x, 0),
      y: numberOr(record.y, 0),
      width: numberOr(record.width, options.baseWidth),
      height: numberOr(record.height, options.baseHeight),
      rotation: numberOr(record.rotation, 0),
      opacity: clamp(numberOr(record.opacity, 1), 0, 1),
      visible: boolOr(record.visible, true),
      selectable: boolOr(record.selectable, true),
      groupId: record.groupId?.trim() || undefined,
      groupName: record.groupName?.trim() || undefined,
      layerBlur: numberOr(record.layerBlur, 0),
      edgeBlur: numberOr(record.edgeBlur, 0),
      edgeBlurStroke: boolOr(record.edgeBlurStroke, false),
      cornerRadius: numberOr(record.cornerRadius, 0),
      shadowColor: record.shadowColor?.trim() || "#000000",
      shadowOpacity: clamp(numberOr(record.shadowOpacity, 0), 0, 1),
      shadowBlur: numberOr(record.shadowBlur, 0),
      shadowDistance: numberOr(record.shadowDistance, 0),
      shadowAngle: numberOr(record.shadowAngle, 135),
      rotateX: numberOr(record.rotateX, 0),
      rotateY: numberOr(record.rotateY, 0),
      bevelSize: numberOr(record.bevelSize, 0),
      bevelOpacity: clamp(numberOr(record.bevelOpacity, 0), 0, 1),
      animation: normalizeAnimation({
        type: record.animationType?.trim(),
        startMs: numberOr(record.animationStartMs, 0),
        durationMs: numberOr(record.animationDurationMs, 900),
        easing: record.animationEasing?.trim(),
        loop: boolOr(record.animationLoop, false),
        direction: record.animationDirection?.trim(),
        distance: numberOr(record.animationDistance, 80),
        textAnimation: record.animationText?.trim(),
        effectAnimation: record.animationEffect?.trim(),
        effectIntensity: numberOr(record.animationEffectIntensity, 40),
      }),
    };

    if (type === "image") {
      const imageKey = record.image?.trim() || record.src?.trim() || "sample-bg";
      if (options.existingImageKeys?.length && !options.existingImageKeys.includes(imageKey)) {
        warnings.push(`Row ${index + 2}: image key "${imageKey}" is not imported; sample or broken image fallback may show.`);
      }
      return [
        makeImageLayer({
          ...base,
          imageKey,
          effects: parseEffects(record.effect),
        }),
      ];
    }

    if (type === "text") {
      return [
        makeTextLayer({
          ...base,
          text: record.text ?? "",
          fontSize: numberOr(record.fontSize, 72),
          fontFamily: record.fontFamily?.trim() || "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
          fontWeight: record.fontWeight?.trim() || "800",
          color: record.color?.trim() || "#ffffff",
          strokeColor: record.strokeColor?.trim() || "#111827",
          strokeWidth: numberOr(record.strokeWidth, 6),
          strokeOpacity: clamp(numberOr(record.strokeOpacity, 1), 0, 1),
          align: parseAlign(record.align),
          writingMode: parseWritingMode(record.writingMode),
          lineHeight: numberOr(record.lineHeight, 1),
          letterSpacing: numberOr(record.letterSpacing, 0),
          fillOpacity: clamp(numberOr(record.fillOpacity, 1), 0, 1),
        }),
      ];
    }

    if (type === "shape") {
      return [
        makeShapeLayer({
          ...base,
          shape: parseShape(record.shape),
          fill: record.fill?.trim() || record.color?.trim() || "#10b6d7",
          fillOpacity: clamp(numberOr(record.fillOpacity, 1), 0, 1),
          strokeColor: record.strokeColor?.trim() || "#ffffff",
          strokeWidth: numberOr(record.strokeWidth, 0),
          strokeOpacity: clamp(numberOr(record.strokeOpacity, 1), 0, 1),
          lineStyle: parseLineStyle(record.lineStyle),
          sectorStartAngle: numberOr(record.sectorStartAngle, -90),
          sectorEndAngle: numberOr(record.sectorEndAngle, 30),
          sectorInnerRadius: clamp(numberOr(record.sectorInnerRadius, 0), 0, 95),
        }),
      ];
    }

    warnings.push(`Row ${index + 2}: unsupported layer type "${record.type}".`);
    return [];
  });

  return { layers, warnings };
}

export function parseCsvRows(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  row.push(value);
  rows.push(row);
  return rows;
}

export function parseEffects(input = ""): ImageEffects {
  const effects = { ...defaultEffects };
  input
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const [rawKey, rawValue] = part.split("=");
      const key = rawKey?.trim() as keyof ImageEffects;
      const value = Number.parseFloat(rawValue);
      if (Number.isNaN(value)) return;
      if (key === "grayscale") effects.grayscale = clamp(value, 0, 1);
      if (key === "blur") effects.blur = Math.max(0, value);
      if (key === "brightness") effects.brightness = Math.max(0, value);
      if (key === "contrast") effects.contrast = Math.max(0, value);
      if (key === "mosaic") effects.mosaic = Math.max(0, value);
    });
  return effects;
}

export function numberOr(input: string | undefined, fallback: number): number {
  const parsed = Number.parseFloat(input ?? "");
  return Number.isFinite(parsed) ? parsed : fallback;
}

function boolOr(input: string | undefined, fallback: boolean): boolean {
  if (!input) return fallback;
  return !["false", "0", "no", "hidden"].includes(input.trim().toLowerCase());
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function parseAlign(input = ""): TextAlign {
  if (input === "center" || input === "right") return input;
  return "left";
}

function parseWritingMode(input = ""): TextWritingMode {
  if (input === "vertical") return "vertical";
  return "horizontal";
}

function parseShape(input = "") {
  if (
    input === "ellipse" ||
    input === "sector" ||
    input === "triangle" ||
    input === "diamond" ||
    input === "pentagon" ||
    input === "hexagon" ||
    input === "star" ||
    input === "line"
  ) {
    return input;
  }
  return "rect";
}

function parseLineStyle(input = ""): LineStyle {
  if (input === "dotted" || input === "dashed" || input === "wave") return input;
  return "solid";
}
