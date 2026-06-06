export interface PaletteColor {
  id: string;
  value: string;
}

export const colorPaletteStorageKey = "thumbnail-generator.colorPalette.v1";

export const defaultPaletteColors: PaletteColor[] = [
  { id: "palette-white", value: "#ffffff" },
  { id: "palette-ink", value: "#111827" },
  { id: "palette-coral", value: "#ff4f5f" },
  { id: "palette-cyan", value: "#10b6d7" },
  { id: "palette-yellow", value: "#ffd166" },
  { id: "palette-purple", value: "#7c3aed" },
];

export function normalizeColor(input: string): string | null {
  const value = input.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const [, r, g, b] = value;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return null;
}

export function addPaletteColor(colors: PaletteColor[], value: string, now = Date.now()): PaletteColor[] {
  const normalized = normalizeColor(value);
  if (!normalized) return colors;
  if (colors.some((color) => color.value === normalized)) return colors;
  return [{ id: `palette-${now.toString(36)}`, value: normalized }, ...colors];
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
    const colors = parsed.filter(isPaletteColor);
    return colors.length > 0 ? colors : defaultPaletteColors;
  } catch {
    return defaultPaletteColors;
  }
}

export function writeColorPalette(colors: PaletteColor[], storage: Pick<Storage, "setItem"> = window.localStorage): void {
  storage.setItem(colorPaletteStorageKey, JSON.stringify(colors));
}

function isPaletteColor(value: unknown): value is PaletteColor {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PaletteColor>;
  return typeof candidate.id === "string" && typeof candidate.value === "string" && Boolean(normalizeColor(candidate.value));
}
