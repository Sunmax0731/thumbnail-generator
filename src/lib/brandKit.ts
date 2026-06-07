import { customFontToOption, type CustomFont } from "./customFonts";
import { defaultPaletteColors } from "./colorPalette";
import { fontOptions } from "./fonts";
import type { BrandKit, ThumbnailLayer } from "./types";

export const brandKitStorageKey = "thumbnail-generator.brandKit.v1";

export const defaultBrandKit: BrandKit = {
  channelName: "Creator Channel",
  primaryColor: "#ff4f5f",
  accentColor: "#10b6d7",
  fontFamily: "Arial Black, Arial, sans-serif",
  shadowColor: "#111827",
};

export function createBrandKitFromCurrentState(
  layers: ThumbnailLayer[],
  customFonts: CustomFont[] = [],
  current: BrandKit = defaultBrandKit,
): BrandKit {
  const textLayer = layers.find((layer) => layer.type === "text");
  const shapeLayer = layers.find((layer) => layer.type === "shape");
  const fontChoices = [...fontOptions, ...customFonts.map((font) => customFontToOption(font))];
  const fontFamily =
    textLayer?.type === "text" && fontChoices.some((option) => option.value === textLayer.fontFamily)
      ? textLayer.fontFamily
      : current.fontFamily;

  return {
    channelName: current.channelName.trim() || defaultBrandKit.channelName,
    primaryColor: textLayer?.type === "text" ? textLayer.color : shapeLayer?.type === "shape" ? shapeLayer.fill : current.primaryColor,
    accentColor: shapeLayer?.type === "shape" ? shapeLayer.strokeColor : current.accentColor,
    fontFamily,
    shadowColor: textLayer?.type === "text" ? textLayer.strokeColor : current.shadowColor,
    logoAssetKey: current.logoAssetKey,
  };
}

export function applyBrandKitToLayers(layers: ThumbnailLayer[], selectedIds: string[], brandKit: BrandKit): ThumbnailLayer[] {
  const targetIds = new Set(selectedIds);
  if (targetIds.size === 0) return layers;

  return layers.map((layer) => {
    if (!targetIds.has(layer.id) || !layer.selectable) return layer;
    if (layer.type === "text") {
      return {
        ...layer,
        fontFamily: brandKit.fontFamily,
        color: brandKit.primaryColor,
        strokeColor: brandKit.shadowColor,
      };
    }
    if (layer.type === "shape") {
      return {
        ...layer,
        fill: brandKit.primaryColor,
        strokeColor: brandKit.accentColor,
      };
    }
    return layer;
  });
}

export function brandKitPaletteColors(brandKit: BrandKit) {
  return [
    { id: "brand-primary", name: "Brand primary", value: brandKit.primaryColor, target: "fill" as const, alpha: 1 },
    { id: "brand-accent", name: "Brand accent", value: brandKit.accentColor, target: "fill" as const, alpha: 1 },
    { id: "brand-shadow", name: "Brand shadow", value: brandKit.shadowColor, target: "stroke" as const, alpha: 1 },
    ...defaultPaletteColors,
  ];
}

export function readBrandKit(storage: Pick<Storage, "getItem"> = window.localStorage): BrandKit {
  const raw = storage.getItem(brandKitStorageKey);
  if (!raw) return defaultBrandKit;
  try {
    const parsed = JSON.parse(raw);
    return normalizeBrandKit(parsed);
  } catch {
    return defaultBrandKit;
  }
}

export function writeBrandKit(brandKit: BrandKit, storage: Pick<Storage, "setItem"> = window.localStorage): void {
  storage.setItem(brandKitStorageKey, JSON.stringify(normalizeBrandKit(brandKit)));
}

export function normalizeBrandKit(value: unknown): BrandKit {
  if (!value || typeof value !== "object") return defaultBrandKit;
  const candidate = value as Partial<BrandKit>;
  return {
    channelName: typeof candidate.channelName === "string" && candidate.channelName.trim() ? candidate.channelName.trim() : defaultBrandKit.channelName,
    primaryColor: normalizeHex(candidate.primaryColor) ?? defaultBrandKit.primaryColor,
    accentColor: normalizeHex(candidate.accentColor) ?? defaultBrandKit.accentColor,
    fontFamily: typeof candidate.fontFamily === "string" && candidate.fontFamily.trim() ? candidate.fontFamily : defaultBrandKit.fontFamily,
    shadowColor: normalizeHex(candidate.shadowColor) ?? defaultBrandKit.shadowColor,
    logoAssetKey: typeof candidate.logoAssetKey === "string" && candidate.logoAssetKey ? candidate.logoAssetKey : undefined,
  };
}

function normalizeHex(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^#[0-9a-f]{6}$/i.test(trimmed)) return null;
  return trimmed.toLowerCase();
}
