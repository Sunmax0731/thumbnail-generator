import { parseEffects, numberOr } from "./csv";
import { makeImageLayer, makeShapeLayer, makeTextLayer } from "./layerFactory";
import type { LayoutParseOptions, LayoutParseResult, LineStyle, TextAlign, ThumbnailLayer } from "./types";

export function parseHtmlLayout(htmlText: string, options: LayoutParseOptions): LayoutParseResult {
  const warnings: string[] = [];
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  const nodes = Array.from(doc.querySelectorAll<HTMLElement>("[data-layer]"));

  if (nodes.length === 0) {
    return { layers: [], warnings: ["No elements with data-layer were found."] };
  }

  const layers: ThumbnailLayer[] = nodes.flatMap((node, index): ThumbnailLayer[] => {
    const type = attr(node, "layer").toLowerCase();
    const base = {
      name: attr(node, "name") || `${type || "layer"} ${index + 1}`,
      x: numberOr(attr(node, "x"), 0),
      y: numberOr(attr(node, "y"), 0),
      width: numberOr(attr(node, "width"), options.baseWidth),
      height: numberOr(attr(node, "height"), options.baseHeight),
      rotation: numberOr(attr(node, "rotation"), 0),
      opacity: clamp(numberOr(attr(node, "opacity"), 1), 0, 1),
      visible: attr(node, "visible") !== "false",
      selectable: attr(node, "selectable") !== "false",
      groupId: attr(node, "group-id") || undefined,
      groupName: attr(node, "group-name") || undefined,
      layerBlur: numberOr(attr(node, "layer-blur"), 0),
      edgeBlur: numberOr(attr(node, "edge-blur"), 0),
      cornerRadius: numberOr(attr(node, "corner-radius"), 0),
    };

    if (type === "image") {
      const imageKey = attr(node, "image") || attr(node, "src") || "sample-bg";
      if (options.existingImageKeys?.length && !options.existingImageKeys.includes(imageKey)) {
        warnings.push(`Element ${index + 1}: image key "${imageKey}" is not imported.`);
      }
      return [
        makeImageLayer({
          ...base,
          imageKey,
          effects: parseEffects(attr(node, "effect")),
        }),
      ];
    }

    if (type === "text") {
      return [
        makeTextLayer({
          ...base,
          text: node.textContent?.trim() || attr(node, "text") || "",
          fontSize: numberOr(attr(node, "font-size"), 72),
          fontFamily: attr(node, "font-family") || "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
          fontWeight: attr(node, "font-weight") || "800",
          color: attr(node, "color") || "#ffffff",
          strokeColor: attr(node, "stroke-color") || "#111827",
          strokeWidth: numberOr(attr(node, "stroke-width"), 6),
          strokeOpacity: clamp(numberOr(attr(node, "stroke-opacity"), 1), 0, 1),
          align: parseAlign(attr(node, "align")),
          lineHeight: numberOr(attr(node, "line-height"), 1),
          letterSpacing: numberOr(attr(node, "letter-spacing"), 0),
          fillOpacity: clamp(numberOr(attr(node, "fill-opacity"), 1), 0, 1),
        }),
      ];
    }

    if (type === "shape") {
      return [
        makeShapeLayer({
          ...base,
          shape: parseShape(attr(node, "shape")),
          fill: attr(node, "fill") || attr(node, "color") || "#10b6d7",
          fillOpacity: clamp(numberOr(attr(node, "fill-opacity"), 1), 0, 1),
          strokeColor: attr(node, "stroke-color") || "#ffffff",
          strokeWidth: numberOr(attr(node, "stroke-width"), 0),
          strokeOpacity: clamp(numberOr(attr(node, "stroke-opacity"), 1), 0, 1),
          lineStyle: parseLineStyle(attr(node, "line-style")),
        }),
      ];
    }

    warnings.push(`Element ${index + 1}: unsupported data-layer "${type}".`);
    return [];
  });

  return { layers, warnings };
}

function attr(node: HTMLElement, name: string): string {
  return node.dataset[toDatasetKey(name)] ?? node.getAttribute(`data-${name}`) ?? "";
}

function toDatasetKey(name: string): string {
  return name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function parseAlign(input = ""): TextAlign {
  if (input === "center" || input === "right") return input;
  return "left";
}

function parseShape(input = "") {
  if (input === "ellipse" || input === "triangle" || input === "line") return input;
  return "rect";
}

function parseLineStyle(input = ""): LineStyle {
  if (input === "dotted" || input === "dashed" || input === "wave") return input;
  return "solid";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
