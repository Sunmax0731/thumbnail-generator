import type { FontOption } from "./fonts";

export const customFontStorageKey = "thumbnail-generator.customFonts.v1";
export const acceptedFontFileTypes = ".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf";

export type CustomFontFormat = "woff2" | "woff" | "truetype" | "opentype";

export interface CustomFont {
  id: string;
  name: string;
  family: string;
  sourceName: string;
  dataUrl: string;
  format: CustomFontFormat;
  createdAt: string;
}

const loadedFontIdsByDocument = new WeakMap<Document, Set<string>>();

export function customFontToOption(font: CustomFont): FontOption {
  return {
    label: `${font.name} (custom)`,
    value: `${font.family}, sans-serif`,
  };
}

export function readCustomFonts(storage: Pick<Storage, "getItem"> = window.localStorage): CustomFont[] {
  const raw = storage.getItem(customFontStorageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCustomFont);
  } catch {
    return [];
  }
}

export function writeCustomFonts(
  fonts: CustomFont[],
  storage: Pick<Storage, "setItem"> = window.localStorage,
): void {
  storage.setItem(customFontStorageKey, JSON.stringify(fonts));
}

export function mergeCustomFonts(current: CustomFont[], incoming: CustomFont[]): CustomFont[] {
  const seen = new Set(current.map(fontFingerprint));
  const uniqueIncoming = incoming.filter((font) => {
    const fingerprint = fontFingerprint(font);
    if (seen.has(fingerprint)) return false;
    seen.add(fingerprint);
    return true;
  });
  return [...uniqueIncoming, ...current];
}

export function findMatchingCustomFont(fonts: CustomFont[], font: CustomFont): CustomFont | undefined {
  const fingerprint = fontFingerprint(font);
  return fonts.find((candidate) => fontFingerprint(candidate) === fingerprint);
}

export async function readCustomFontFile(file: File, now = new Date()): Promise<CustomFont> {
  const format = fontFormatForFile(file.name, file.type);
  if (!format) {
    throw new Error("Unsupported font file. Use WOFF2, WOFF, TTF, or OTF.");
  }

  const dataUrl = await readFileAsDataUrl(file);
  const name = sanitizeFontName(file.name.replace(/\.[^.]+$/, ""));
  const id = `custom-font-${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    name,
    family: `TGFont-${id.replace(/[^a-zA-Z0-9-]/g, "-")}`,
    sourceName: file.name,
    dataUrl,
    format,
    createdAt: now.toISOString(),
  };
}

export async function loadCustomFonts(fonts: CustomFont[], targetDocument: Document = document): Promise<string[]> {
  const errors: string[] = [];
  for (const font of fonts) {
    try {
      await loadCustomFont(font, targetDocument);
    } catch (error) {
      errors.push(`${font.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return errors;
}

export async function loadCustomFont(font: CustomFont, targetDocument: Document = document): Promise<void> {
  const FontFaceConstructor = targetDocument.defaultView?.FontFace ?? (typeof FontFace === "undefined" ? undefined : FontFace);
  if (!FontFaceConstructor || !targetDocument.fonts) return;
  const loadedFontIds = loadedFontIdsByDocument.get(targetDocument) ?? new Set<string>();
  if (loadedFontIds.has(font.id)) return;

  const face = new FontFaceConstructor(font.family, `url(${font.dataUrl}) format("${font.format}")`);
  const loaded = await face.load();
  targetDocument.fonts.add(loaded);
  loadedFontIds.add(font.id);
  loadedFontIdsByDocument.set(targetDocument, loadedFontIds);
}

export function fontFormatForFile(name: string, type = ""): CustomFontFormat | undefined {
  const lowerName = name.toLowerCase();
  const lowerType = type.toLowerCase();
  if (lowerName.endsWith(".woff2") || lowerType === "font/woff2") return "woff2";
  if (lowerName.endsWith(".woff") || lowerType === "font/woff") return "woff";
  if (lowerName.endsWith(".ttf") || lowerType === "font/ttf" || lowerType === "application/x-font-ttf") {
    return "truetype";
  }
  if (lowerName.endsWith(".otf") || lowerType === "font/otf" || lowerType === "application/x-font-otf") {
    return "opentype";
  }
  return undefined;
}

export function sanitizeFontName(name: string): string {
  const sanitized = name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w .'-]/g, "")
    .slice(0, 64);
  return sanitized || "Custom font";
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read font file."));
    reader.readAsDataURL(file);
  });
}

function isCustomFont(value: unknown): value is CustomFont {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CustomFont>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.family === "string" &&
    typeof candidate.sourceName === "string" &&
    typeof candidate.dataUrl === "string" &&
    isCustomFontFormat(candidate.format) &&
    typeof candidate.createdAt === "string"
  );
}

function isCustomFontFormat(value: unknown): value is CustomFontFormat {
  return value === "woff2" || value === "woff" || value === "truetype" || value === "opentype";
}

function fontFingerprint(font: CustomFont): string {
  return `${font.sourceName}:${font.dataUrl}`;
}
