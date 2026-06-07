export interface PaletteColor {
  id: string;
  name: string;
  value: string;
  target: PaletteTarget;
  alpha: number;
  groupName?: string;
}

export type PaletteTarget = "fill" | "stroke";
export type HarmonyMode = "analogous" | "complementary" | "split" | "triad";

export const colorPaletteStorageKey = "thumbnail-generator.colorPalette.v1";

export const defaultPaletteColors: PaletteColor[] = [
  { id: "palette-white", name: "White fill", value: "#ffffff", target: "fill", alpha: 1, groupName: "Starter" },
  { id: "palette-ink", name: "Ink stroke", value: "#111827", target: "stroke", alpha: 1, groupName: "Starter" },
  { id: "palette-coral", name: "Coral fill", value: "#ff4f5f", target: "fill", alpha: 1, groupName: "Action" },
  { id: "palette-cyan", name: "Cyan fill", value: "#10b6d7", target: "fill", alpha: 1, groupName: "Action" },
  { id: "palette-yellow", name: "Yellow fill", value: "#ffd166", target: "fill", alpha: 1, groupName: "Accent" },
  { id: "palette-purple", name: "Purple fill", value: "#7c3aed", target: "fill", alpha: 1, groupName: "Accent" },
];

export interface AddPaletteColorInput {
  value: string;
  name?: string;
  target?: PaletteTarget;
  alpha?: number;
  groupName?: string;
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
  if (colors.some((color) => color.value === normalized && color.target === target)) return colors;
  const fallbackName = `${target === "fill" ? "Fill" : "Stroke"} ${normalized}`;
  return [
    {
      id: `palette-${target}-${now.toString(36)}`,
      name: normalizePaletteName(draft.name, fallbackName),
      value: normalized,
      target,
      alpha: clampAlpha(draft.alpha),
      groupName: normalizeOptionalGroupName(draft.groupName),
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
          groupName: normalizeOptionalGroupName(input.groupName),
        }
      : color,
  );
}

export function removePaletteColor(colors: PaletteColor[], id: string): PaletteColor[] {
  return colors.filter((color) => color.id !== id);
}

export function paletteGroups(colors: PaletteColor[]): Array<{ name: string; fill?: PaletteColor; stroke?: PaletteColor }> {
  const grouped = new Map<string, { name: string; fill?: PaletteColor; stroke?: PaletteColor }>();
  for (const color of colors) {
    const name = normalizeOptionalGroupName(color.groupName);
    if (!name) continue;
    const group = grouped.get(name) ?? { name };
    if (color.target === "fill" && !group.fill) group.fill = color;
    if (color.target === "stroke" && !group.stroke) group.stroke = color;
    grouped.set(name, group);
  }
  return Array.from(grouped.values()).filter((group) => group.fill || group.stroke);
}

export function generateHarmonyColors(baseColor: string, mode: HarmonyMode): string[] {
  const normalized = normalizeColor(baseColor);
  if (!normalized) return [];
  const hsl = hexToHsl(normalized);
  const offsets: Record<HarmonyMode, number[]> = {
    analogous: [-30, 30],
    complementary: [180],
    split: [150, 210],
    triad: [120, 240],
  };
  return offsets[mode].map((offset) => hslToHex({ ...hsl, h: normalizeHue(hsl.h + offset) }));
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
    groupName: normalizeOptionalGroupName(candidate.groupName),
  };
}

function clampAlpha(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? 1));
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(1, Math.max(0, parsed));
}

function normalizeOptionalGroupName(input: unknown): string | undefined {
  if (typeof input !== "string") return undefined;
  const trimmed = input.trim().replace(/\s+/g, " ").slice(0, 48);
  return trimmed || undefined;
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

function capitalize(value: string): string {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}
