import type { ImageAsset, OutputSettings, ThumbnailLayer } from "./types";

export type QualityWarningCode =
  | "many-layers"
  | "large-export"
  | "storage-size"
  | "text-length"
  | "low-contrast"
  | "safe-area"
  | "hidden-important"
  | "large-asset";

export interface QualityWarning {
  code: QualityWarningCode;
  message: string;
}

export interface QualityCheckInput {
  layers: ThumbnailLayer[];
  assets: ImageAsset[];
  settings: OutputSettings;
  estimatedStorageBytes?: number;
}

export function evaluateThumbnailWarnings({
  layers,
  assets,
  settings,
  estimatedStorageBytes = 0,
}: QualityCheckInput): QualityWarning[] {
  const warnings: QualityWarning[] = [];

  if (layers.length >= 28) {
    warnings.push({ code: "many-layers", message: "Many layers may slow editing and export." });
  }

  if (settings.width * settings.height >= 3840 * 2160) {
    warnings.push({ code: "large-export", message: "4K export can take longer; keep the tab open until download starts." });
  }

  if (estimatedStorageBytes >= 4_500_000) {
    warnings.push({ code: "storage-size", message: "Saved state is large; export JSON before relying on browser storage." });
  }

  for (const layer of layers) {
    if (!layer.visible && /title|headline|logo|brand|cta|date|text/i.test(layer.name)) {
      warnings.push({ code: "hidden-important", message: `${layer.name} is hidden.` });
    }

    if (layer.type === "text") {
      const plainText = layer.text.replace(/\s+/g, "");
      if (plainText.length > 46) {
        warnings.push({ code: "text-length", message: `${layer.name} has long text; mobile preview may be hard to read.` });
      }
      if (layer.strokeWidth === 0 && contrastRatio(layer.color, settings.background) < 3) {
        warnings.push({ code: "low-contrast", message: `${layer.name} has low contrast against the background.` });
      }
    }

    if (layer.visible && touchesSafeArea(layer, settings)) {
      warnings.push({ code: "safe-area", message: `${layer.name} is close to the edge; check platform safe areas.` });
    }
  }

  if (assets.some((asset) => asset.src.length > 2_200_000 || (asset.width ?? 0) * (asset.height ?? 0) >= 8_000_000)) {
    warnings.push({ code: "large-asset", message: "Large image assets can increase memory and browser storage use." });
  }

  return dedupeWarnings(warnings);
}

export function estimateProjectStorageBytes(value: unknown): number {
  try {
    return new Blob([JSON.stringify(value)]).size;
  } catch {
    return 0;
  }
}

export function contrastRatio(foreground: string, background: string): number {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  if (fg === null || bg === null) return 21;
  const light = Math.max(fg, bg);
  const dark = Math.min(fg, bg);
  return (light + 0.05) / (dark + 0.05);
}

function touchesSafeArea(layer: ThumbnailLayer, settings: OutputSettings): boolean {
  const marginX = settings.width * 0.035;
  const marginY = settings.height * 0.045;
  return (
    layer.x < marginX ||
    layer.y < marginY ||
    layer.x + layer.width > settings.width - marginX ||
    layer.y + layer.height > settings.height - marginY
  );
}

function relativeLuminance(hex: string): number | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const channels = [normalized.slice(1, 3), normalized.slice(3, 5), normalized.slice(5, 7)].map((part) => {
    const value = Number.parseInt(part, 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function normalizeHex(value: string): string | null {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`.toLowerCase();
  }
  return null;
}

function dedupeWarnings(warnings: QualityWarning[]): QualityWarning[] {
  const seen = new Set<QualityWarningCode>();
  return warnings.filter((warning) => {
    if (seen.has(warning.code)) return false;
    seen.add(warning.code);
    return true;
  });
}
