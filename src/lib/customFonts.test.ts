import { describe, expect, it } from "vitest";
import {
  customFontToOption,
  findMatchingCustomFont,
  fontFormatForFile,
  mergeCustomFonts,
  readCustomFonts,
  sanitizeFontName,
  type CustomFont,
} from "./customFonts";

const baseFont: CustomFont = {
  id: "font-a",
  name: "Stream Bold",
  family: "TGFont-font-a",
  sourceName: "stream-bold.woff2",
  dataUrl: "data:font/woff2;base64,AAAA",
  format: "woff2",
  createdAt: "2026-06-06T00:00:00.000Z",
};

describe("custom fonts", () => {
  it("detects accepted browser font formats", () => {
    expect(fontFormatForFile("headline.woff2")).toBe("woff2");
    expect(fontFormatForFile("headline.woff")).toBe("woff");
    expect(fontFormatForFile("headline.ttf")).toBe("truetype");
    expect(fontFormatForFile("headline.otf")).toBe("opentype");
    expect(fontFormatForFile("headline.txt")).toBeUndefined();
  });

  it("sanitizes display names and exposes dropdown options", () => {
    expect(sanitizeFontName("  Stream@@ Bold!!!  ")).toBe("Stream Bold");
    expect(sanitizeFontName("")).toBe("Custom font");
    expect(customFontToOption(baseFont)).toEqual({
      label: "Stream Bold (custom)",
      value: "TGFont-font-a, sans-serif",
    });
  });

  it("reads only valid stored custom font records", () => {
    const storage = {
      getItem: () => JSON.stringify([baseFont, { id: "broken" }]),
    };

    expect(readCustomFonts(storage)).toEqual([baseFont]);
  });

  it("deduplicates imported fonts by source file and data URL", () => {
    const duplicate = { ...baseFont, id: "font-b" };
    const fresh = { ...baseFont, id: "font-c", sourceName: "fresh.otf", dataUrl: "data:font/otf;base64,BBBB", format: "opentype" as const };

    const merged = mergeCustomFonts([baseFont], [duplicate, fresh]);

    expect(merged.map((font) => font.id)).toEqual(["font-c", "font-a"]);
    expect(findMatchingCustomFont(merged, duplicate)?.id).toBe("font-a");
  });
});
