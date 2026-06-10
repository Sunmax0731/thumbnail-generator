export interface PaletteColor {
  id: string;
  name: string;
  value: string;
  target: PaletteTarget;
  alpha: number;
}

export type PaletteTarget = "fill" | "stroke";
export const palettePrinciples = ["order", "proximity", "similarity", "clarity"] as const;
export type PalettePrinciple = (typeof palettePrinciples)[number];
type LegacyHarmonyMode = "analogous" | "complementary" | "split" | "triad" | "square" | "compound" | "shades" | "monochromatic";
export type HarmonyMode =
  | LegacyHarmonyMode
  | "identity"
  | "intermediate"
  | "diod"
  | "opponent"
  | "split-complementary"
  | "tetrad"
  | "pentad"
  | "hexad"
  | "rectangular"
  | "complex-harmony"
  | "natural-harmony"
  | "dominant-color"
  | "tone-on-tone"
  | "dominant-tone"
  | "tone-in-tone"
  | "tonal-color"
  | "camaieu"
  | "faux-camaieu"
  | "tricolor"
  | "bicolor";

export const paletteModesByPrinciple: Readonly<Record<PalettePrinciple, readonly HarmonyMode[]>> = {
  order: [
    "identity",
    "analogous",
    "intermediate",
    "diod",
    "opponent",
    "split-complementary",
    "triad",
    "tetrad",
    "pentad",
    "hexad",
    "rectangular",
  ],
  proximity: ["complex-harmony", "natural-harmony"],
  similarity: [
    "dominant-color",
    "tone-on-tone",
    "dominant-tone",
    "tone-in-tone",
    "tonal-color",
    "camaieu",
    "faux-camaieu",
  ],
  clarity: ["tricolor", "bicolor"],
};

export function resolveHarmonyMode(mode: HarmonyMode): HarmonyMode {
  switch (mode) {
    case "complementary":
      return "opponent";
    case "split":
      return "split-complementary";
    case "square":
      return "tetrad";
    case "compound":
      return "complex-harmony";
    case "shades":
      return "natural-harmony";
    case "monochromatic":
      return "tonal-color";
    default:
      return mode;
  }
}

export function getHarmonyPrinciple(mode: HarmonyMode): PalettePrinciple {
  const resolved = resolveHarmonyMode(mode);
  if (paletteModesByPrinciple.order.includes(resolved)) return "order";
  if (paletteModesByPrinciple.proximity.includes(resolved)) return "proximity";
  if (paletteModesByPrinciple.similarity.includes(resolved)) return "similarity";
  if (paletteModesByPrinciple.clarity.includes(resolved)) return "clarity";
  return "order";
}

export const colorPaletteStorageKey = "thumbnail-generator.colorPalette.v1";
export const savedColorPaletteStorageKey = "thumbnail-generator.savedColorPalettes.v1";

export interface SavedColorPalette {
  id: string;
  name: string;
  mode: HarmonyMode;
  baseColor: string;
  colors: string[];
  createdAt: string;
}

export const defaultPaletteColors: PaletteColor[] = [
  { id: "palette-white", name: "White", value: "#ffffff", target: "fill", alpha: 1 },
  { id: "palette-ink", name: "Ink", value: "#111827", target: "stroke", alpha: 1 },
  { id: "palette-coral", name: "Coral", value: "#ff4f5f", target: "fill", alpha: 1 },
  { id: "palette-cyan", name: "Cyan", value: "#10b6d7", target: "fill", alpha: 1 },
  { id: "palette-yellow", name: "Yellow", value: "#ffd166", target: "fill", alpha: 1 },
  { id: "palette-purple", name: "Purple", value: "#7c3aed", target: "fill", alpha: 1 },
];

export interface AddPaletteColorInput {
  value: string;
  name?: string;
  target?: PaletteTarget;
  alpha?: number;
}

export function normalizeColor(input: string): string | null {
  const value = input.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const [, r, g, b] = value;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return null;
}

export function hexToRgbChannels(hex: string): { r: number; g: number; b: number } | null {
  const normalized = normalizeColor(hex);
  if (!normalized) return null;
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

export function rgbChannelsToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((channel) => clampByte(channel).toString(16).padStart(2, "0")).join("")}`;
}

export function parseRgbColorInput(input: string): string | null {
  const parts = input
    .trim()
    .replace(/^rgb\(/i, "")
    .replace(/\)$/, "")
    .split(/[,\s]+/)
    .filter(Boolean);
  if (parts.length !== 3) return null;
  const channels = parts.map((part) => Number.parseInt(part, 10));
  if (channels.some((channel) => !Number.isFinite(channel) || channel < 0 || channel > 255)) return null;
  return rgbChannelsToHex(channels[0], channels[1], channels[2]);
}

export function normalizePaletteName(input: string | undefined, fallback: string): string {
  const value = input?.trim() ?? "";
  return value.length > 0 ? value.slice(0, 48) : fallback;
}

export function addPaletteColor(
  colors: PaletteColor[],
  input: AddPaletteColorInput | string,
  now = Date.now(),
): PaletteColor[] {
  const draft = typeof input === "string" ? { value: input } : input;
  const normalized = normalizeColor(draft.value);
  if (!normalized) return colors;
  const target = draft.target ?? "fill";
  if (colors.some((color) => color.value === normalized)) return colors;
  const fallbackName = `Color ${normalized}`;
  return [
    {
      id: `palette-${now.toString(36)}`,
      name: normalizePaletteName(draft.name, fallbackName),
      value: normalized,
      target,
      alpha: clampAlpha(draft.alpha),
    },
    ...colors,
  ];
}

export function updatePaletteColor(colors: PaletteColor[], id: string, input: AddPaletteColorInput): PaletteColor[] {
  const normalized = normalizeColor(input.value);
  if (!normalized) return colors;
  return colors.map((color) =>
    color.id === id
      ? {
          ...color,
          name: normalizePaletteName(input.name, color.name),
          value: normalized,
          target: input.target ?? color.target,
          alpha: clampAlpha(input.alpha),
        }
      : color,
  );
}

export function removePaletteColor(colors: PaletteColor[], id: string): PaletteColor[] {
  return colors.filter((color) => color.id !== id);
}

export function generateHarmonyColors(baseColor: string, mode: HarmonyMode): string[] {
  const [, ...companions] = generatePaletteSchemeColors(baseColor, mode);
  return companions;
}

export function generatePaletteSchemeColors(baseColor: string, mode: HarmonyMode): string[] {
  const normalized = normalizeColor(baseColor);
  if (!normalized) return [];
  const hsl = hexToHsl(normalized);
  const resolvedMode = resolveHarmonyMode(mode);
  if (resolvedMode === "identity") {
    return [
      normalized,
      hslToHex({ ...hsl, s: clampUnit(hsl.s * 0.65), l: clampUnit(hsl.l * 0.62) }),
      hslToHex({ ...hsl, s: clampUnit(hsl.s * 1.25), l: clampUnit(hsl.l * 1.2) }),
    ];
  }
  if (
    resolvedMode === "dominant-color" ||
    resolvedMode === "tone-on-tone" ||
    resolvedMode === "dominant-tone" ||
    resolvedMode === "tone-in-tone" ||
    resolvedMode === "tonal-color"
  ) {
    return [
      hslToHex({ ...hsl, s: clampUnit(hsl.s * 0.55), l: clampUnit(hsl.l * 0.82) }),
      normalized,
      hslToHex({ ...hsl, s: clampUnit(Math.min(1, hsl.s * 1.2)), l: clampUnit(hsl.l + (1 - hsl.l) * 0.28) }),
    ];
  }
  if (resolvedMode === "natural-harmony") {
    return getNaturalHarmonyProfileForHue(hsl.h).map((entry) =>
      hslToHex({
        h: normalizeHue(hsl.h + entry.offset),
        s: clampUnit(hsl.s * entry.saturationScale),
        l: clampUnit(hsl.l * entry.lightnessScale),
      }),
    );
  }
  if (resolvedMode === "complex-harmony") {
    return getComplexHarmonyProfileForHue(hsl.h).map((entry) =>
      hslToHex({
        h: normalizeHue(hsl.h + entry.offset),
        s: clampUnit(hsl.s * entry.saturationScale),
        l: clampUnit(hsl.l * entry.lightnessScale),
      }),
    );
  }
  if (resolvedMode === "camaieu" || resolvedMode === "faux-camaieu") {
    return [
      hslToHex({ ...hsl, l: clampUnit(hsl.l * 0.42) }),
      hslToHex({ ...hsl, l: clampUnit(hsl.l * 0.68) }),
      normalized,
      hslToHex({ ...hsl, l: clampUnit(hsl.l + (1 - hsl.l) * 0.34) }),
      hslToHex({ ...hsl, l: clampUnit(hsl.l + (1 - hsl.l) * 0.58) }),
    ];
  }
  const offsets = paletteHueOffsets(resolvedMode);
  if (!offsets) return [normalized];
  return offsets.map((offset) => hslToHex({ ...hsl, h: normalizeHue(hsl.h + offset) }));
}

export function derivePaletteBaseFromSchemeColor(
  schemeColor: string,
  pointIndex: number,
  mode: HarmonyMode,
): string | null {
  const normalized = normalizeColor(schemeColor);
  if (!normalized) return null;
  if (pointIndex <= 0) return normalized;

  const colorHsl = hexToHsl(normalized);
  const resolvedMode = resolveHarmonyMode(mode);
  if (resolvedMode === "identity") {
    if (pointIndex === 1) return hslToHex({ h: colorHsl.h, s: clampUnit(colorHsl.s / 0.65), l: clampUnit(colorHsl.l / 0.62) });
    if (pointIndex === 2) {
      return hslToHex({
        h: colorHsl.h,
        s: clampUnit(colorHsl.s / 1.25),
        l: clampUnit(colorHsl.l / 1.2),
      });
    }
    return normalized;
  }
  if (
    resolvedMode === "dominant-color" ||
    resolvedMode === "tone-on-tone" ||
    resolvedMode === "dominant-tone" ||
    resolvedMode === "tone-in-tone" ||
    resolvedMode === "tonal-color"
  ) {
    if (pointIndex === 0) {
      return hslToHex({ h: colorHsl.h, s: clampUnit(colorHsl.s / 0.55), l: clampUnit(colorHsl.l / 0.82) });
    }
    if (pointIndex === 1) return normalized;
    if (pointIndex === 2) {
      return hslToHex({
        h: colorHsl.h,
        s: clampUnit(colorHsl.s / 1.2),
        l: clampUnit((colorHsl.l - (1 - colorHsl.l) * 0.28) / 0.72),
      });
    }
    return normalized;
  }

  if (resolvedMode === "natural-harmony") {
    const profile = getNaturalHarmonyProfileForHue(colorHsl.h)[pointIndex];
    if (!profile) return normalized;
    const baseHue = normalizeHue(colorHsl.h - profile.offset);
    return hslToHex({
      h: baseHue,
      s: clampUnit(colorHsl.s / profile.saturationScale),
      l: clampUnit(colorHsl.l / profile.lightnessScale),
    });
  }
  if (resolvedMode === "complex-harmony") {
    const profile = getComplexHarmonyProfileForHue(colorHsl.h)[pointIndex];
    if (!profile) return normalized;
    const baseHue = normalizeHue(colorHsl.h - profile.offset);
    return hslToHex({
      h: baseHue,
      s: clampUnit(colorHsl.s / profile.saturationScale),
      l: clampUnit(colorHsl.l / profile.lightnessScale),
    });
  }
  if (resolvedMode === "camaieu" || resolvedMode === "faux-camaieu") {
    const lightnessByIndex = [colorHsl.l / 0.42, colorHsl.l / 0.68, colorHsl.l, (colorHsl.l - 0.34) / 0.66, (colorHsl.l - 0.58) / 0.42];
    return hslToHex({
      h: colorHsl.h,
      s: colorHsl.s,
      l: clampUnit(lightnessByIndex[pointIndex] ?? colorHsl.l),
    });
  }

  const offsets = paletteHueOffsets(resolvedMode);
  if (offsets?.[pointIndex] !== undefined) {
    return hslToHex({
      h: normalizeHue(colorHsl.h - offsets[pointIndex]),
      s: colorHsl.s,
      l: colorHsl.l,
    });
  }

  return normalized;
}

function generateHueIntervalOffsets(count: number): readonly number[] {
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, index) => (360 / count) * index);
}

function paletteHueOffsets(mode: HarmonyMode): readonly number[] | undefined {
  const resolvedMode = resolveHarmonyMode(mode);
  if (resolvedMode === "identity") return [0];
  if (resolvedMode === "analogous") return [0, 330, 30];
  if (resolvedMode === "intermediate") return [0, 90];
  if (resolvedMode === "diod" || resolvedMode === "bicolor") return [0, 180];
  if (resolvedMode === "opponent") return [0, 135];
  if (resolvedMode === "split-complementary") return [0, 150, 210];
  if (resolvedMode === "triad" || resolvedMode === "tricolor") return [0, 120, 240];
  if (resolvedMode === "tetrad" || resolvedMode === "rectangular") return [0, 90, 180, 270];
  if (resolvedMode === "pentad") return generateHueIntervalOffsets(5);
  if (resolvedMode === "hexad") return generateHueIntervalOffsets(6);
  return undefined;
}

interface HarmonyProfile {
  offset: number;
  lightnessScale: number;
  saturationScale: number;
}

function getNaturalHarmonyProfileForHue(hue: number): readonly HarmonyProfile[] {
  return getHarmonyProfileForHue(hue, "natural-harmony");
}

function getComplexHarmonyProfileForHue(hue: number): readonly HarmonyProfile[] {
  return getHarmonyProfileForHue(hue, "complex-harmony");
}

function getHarmonyProfileForHue(hue: number, mode: "natural-harmony" | "complex-harmony"): readonly HarmonyProfile[] {
  const offsets = [-45, -22, 0, 22, 45];
  const isNatural = mode === "natural-harmony";
  return offsets.map((offset) => {
    const sampledHue = normalizeHue(hue + offset);
    const warmth = hueTemperatureBias(sampledHue);
    const effectiveWarmth = isNatural ? warmth : 1 - warmth;
    return {
      offset,
      saturationScale: 0.76 + 0.24 * effectiveWarmth,
      lightnessScale: 0.72 + 0.28 * effectiveWarmth,
    };
  });
}

function hueTemperatureBias(hue: number): number {
  const warmDistance = hueDistance(hue, 60);
  const coolDistance = hueDistance(hue, 270);
  return clampUnit((coolDistance - warmDistance) / 180 + 0.5);
}

function hueDistance(first: number, second: number): number {
  const normalizedFirst = normalizeHue(first);
  const normalizedSecond = normalizeHue(second);
  const delta = Math.abs(normalizedFirst - normalizedSecond);
  return Math.min(delta, 360 - delta);
}

export function addHarmonyColors(
  colors: PaletteColor[],
  input: AddPaletteColorInput,
  mode: HarmonyMode,
  now = Date.now(),
): PaletteColor[] {
  return generateHarmonyColors(input.value, mode).reduce((current, value, index) => {
    return addPaletteColor(
      current,
      {
        ...input,
        value,
        name: `${capitalize(mode)} ${index + 1}`,
      },
      now + index + 1,
    );
  }, colors);
}

export function readColorPalette(storage: Pick<Storage, "getItem"> = window.localStorage): PaletteColor[] {
  const raw = storage.getItem(colorPaletteStorageKey);
  if (!raw) return defaultPaletteColors;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultPaletteColors;
    const colors = parsed.flatMap((value) => {
      const color = coercePaletteColor(value);
      return color ? [color] : [];
    });
    return colors.length > 0 ? colors : defaultPaletteColors;
  } catch {
    return defaultPaletteColors;
  }
}

export function writeColorPalette(colors: PaletteColor[], storage: Pick<Storage, "setItem"> = window.localStorage): void {
  storage.setItem(colorPaletteStorageKey, JSON.stringify(colors));
}

export function addSavedColorPalette(
  palettes: SavedColorPalette[],
  input: { name?: string; baseColor: string; mode: HarmonyMode; colors?: string[] },
  now = new Date(),
): SavedColorPalette[] {
  const baseColor = normalizeColor(input.baseColor);
  if (!baseColor) return palettes;
  const colors = (input.colors ?? generatePaletteSchemeColors(baseColor, input.mode))
    .map((color) => normalizeColor(color))
    .filter((color): color is string => Boolean(color));
  if (colors.length === 0) return palettes;
  return [
    {
      id: `saved-palette-${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      name: normalizePaletteName(input.name, `${capitalize(input.mode)} palette`),
      mode: input.mode,
      baseColor,
      colors,
      createdAt: now.toISOString(),
    },
    ...palettes,
  ];
}

export function removeSavedColorPalette(palettes: SavedColorPalette[], id: string): SavedColorPalette[] {
  return palettes.filter((palette) => palette.id !== id);
}

export function readSavedColorPalettes(storage: Pick<Storage, "getItem"> = window.localStorage): SavedColorPalette[] {
  const raw = storage.getItem(savedColorPaletteStorageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((value) => {
      const palette = coerceSavedColorPalette(value);
      return palette ? [palette] : [];
    });
  } catch {
    return [];
  }
}

export function writeSavedColorPalettes(
  palettes: SavedColorPalette[],
  storage: Pick<Storage, "setItem"> = window.localStorage,
): void {
  storage.setItem(savedColorPaletteStorageKey, JSON.stringify(palettes));
}

function coercePaletteColor(value: unknown): PaletteColor | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<PaletteColor>;
  if (typeof candidate.id !== "string" || typeof candidate.value !== "string") return null;
  const normalized = normalizeColor(candidate.value);
  if (!normalized) return null;
  const target = candidate.target === "stroke" ? "stroke" : "fill";
  return {
    id: candidate.id,
    name: normalizePaletteName(candidate.name, `${target === "fill" ? "Fill" : "Stroke"} ${normalized}`),
    value: normalized,
    target,
    alpha: clampAlpha(candidate.alpha),
  };
}

function coerceSavedColorPalette(value: unknown): SavedColorPalette | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<SavedColorPalette>;
  if (typeof candidate.id !== "string" || typeof candidate.baseColor !== "string") return null;
  const baseColor = normalizeColor(candidate.baseColor);
  if (!baseColor || !isHarmonyMode(candidate.mode)) return null;
  const colors = Array.isArray(candidate.colors)
    ? candidate.colors.map((color) => normalizeColor(String(color))).filter((color): color is string => Boolean(color))
    : generatePaletteSchemeColors(baseColor, candidate.mode);
  if (colors.length === 0) return null;
  return {
    id: candidate.id,
    name: normalizePaletteName(candidate.name, `${capitalize(candidate.mode)} palette`),
    mode: candidate.mode,
    baseColor,
    colors,
    createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : new Date(0).toISOString(),
  };
}

function clampAlpha(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? 1));
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(1, Math.max(0, parsed));
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const h =
    max === r
      ? ((g - b) / delta + (g < b ? 6 : 0)) * 60
      : max === g
        ? ((b - r) / delta + 2) * 60
        : ((r - g) / delta + 4) * 60;
  return { h, s, l };
}

function hslToHex({ h, s, l }: { h: number; s: number; l: number }): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return `#${[r, g, b]
    .map((channel) => Math.round((channel + m) * 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

function normalizeHue(value: number): number {
  return ((value % 360) + 360) % 360;
}

function clampUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function clampByte(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(255, Math.max(0, Math.round(value)));
}

function capitalize(value: string): string {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

function isHarmonyMode(value: unknown): value is HarmonyMode {
  return (
    value === "identity" ||
    value === "analogous" ||
    value === "complementary" ||
    value === "intermediate" ||
    value === "diod" ||
    value === "opponent" ||
    value === "split" ||
    value === "split-complementary" ||
    value === "triad" ||
    value === "tetrad" ||
    value === "pentad" ||
    value === "hexad" ||
    value === "rectangular" ||
    value === "square" ||
    value === "complex-harmony" ||
    value === "natural-harmony" ||
    value === "dominant-color" ||
    value === "tone-on-tone" ||
    value === "dominant-tone" ||
    value === "tone-in-tone" ||
    value === "tonal-color" ||
    value === "camaieu" ||
    value === "faux-camaieu" ||
    value === "tricolor" ||
    value === "bicolor" ||
    value === "compound" ||
    value === "shades" ||
    value === "monochromatic"
  );
}
