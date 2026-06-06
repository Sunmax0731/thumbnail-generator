export interface PaletteColor {
  id: string;
  name: string;
  value: string;
  target: PaletteTarget;
}

export type PaletteTarget = "fill" | "stroke";

export const colorPaletteStorageKey = "thumbnail-generator.colorPalette.v1";

export const defaultPaletteColors: PaletteColor[] = [
  { id: "palette-white", name: "White fill", value: "#ffffff", target: "fill" },
  { id: "palette-ink", name: "Ink stroke", value: "#111827", target: "stroke" },
  { id: "palette-coral", name: "Coral fill", value: "#ff4f5f", target: "fill" },
  { id: "palette-cyan", name: "Cyan fill", value: "#10b6d7", target: "fill" },
  { id: "palette-yellow", name: "Yellow fill", value: "#ffd166", target: "fill" },
  { id: "palette-purple", name: "Purple fill", value: "#7c3aed", target: "fill" },
];

export interface AddPaletteColorInput {
  value: string;
  name?: string;
  target?: PaletteTarget;
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
    },
    ...colors,
  ];
}

export function removePaletteColor(colors: PaletteColor[], id: string): PaletteColor[] {
  return colors.filter((color) => color.id !== id);
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
  };
}
