import { describe, expect, it } from "vitest";
import {
  addHarmonyColors,
  addPaletteColor,
  addSavedColorPalette,
  derivePaletteBaseFromSchemeColor,
  generateHarmonyColors,
  generatePaletteSchemeColors,
  hexToRgbChannels,
  normalizeColor,
  normalizePaletteName,
  parseRgbColorInput,
  readColorPalette,
  readSavedColorPalettes,
  removePaletteColor,
  removeSavedColorPalette,
  rgbChannelsToHex,
  updatePaletteColor,
} from "./colorPalette";

describe("colorPalette", () => {
  it("normalizes hex colors", () => {
    expect(normalizeColor("#ABC")).toBe("#aabbcc");
    expect(normalizeColor("#12abef")).toBe("#12abef");
    expect(normalizeColor("red")).toBeNull();
  });

  it("converts HEX and RGB input for numeric palette controls", () => {
    expect(hexToRgbChannels("#58a0ed")).toEqual({ r: 88, g: 160, b: 237 });
    expect(rgbChannelsToHex(88, 160, 237)).toBe("#58a0ed");
    expect(rgbChannelsToHex(300, -4, 12.4)).toBe("#ff000c");
    expect(parseRgbColorInput("rgb(88, 160, 237)")).toBe("#58a0ed");
    expect(parseRgbColorInput("88 160 237")).toBe("#58a0ed");
    expect(parseRgbColorInput("88 160")).toBeNull();
  });

  it("adds unique colors and removes by id", () => {
    const colors = addPaletteColor([], { value: "#ff4f5f", name: "Action coral", target: "fill" }, 1);
    expect(colors).toEqual([{ id: "palette-1", name: "Action coral", value: "#ff4f5f", target: "fill", alpha: 1 }]);
    expect(addPaletteColor(colors, "#ff4f5f", 2)).toHaveLength(1);
    expect(addPaletteColor(colors, { value: "#00ff00", target: "stroke" }, 2)).toEqual([
      { id: "palette-2", name: "Color #00ff00", value: "#00ff00", target: "stroke", alpha: 1 },
      { id: "palette-1", name: "Action coral", value: "#ff4f5f", target: "fill", alpha: 1 },
    ]);
    expect(removePaletteColor(colors, "palette-1")).toHaveLength(0);
  });

  it("normalizes palette names and migrates legacy storage entries", () => {
    expect(normalizePaletteName("  Campaign blue  ", "Fallback")).toBe("Campaign blue");
    expect(normalizePaletteName("", "Fallback")).toBe("Fallback");

    const colors = readColorPalette({
      getItem: () => JSON.stringify([{ id: "legacy-blue", value: "#123ABC" }]),
    });
    expect(colors).toEqual([{ id: "legacy-blue", name: "Fill #123abc", value: "#123abc", target: "fill", alpha: 1 }]);
  });

  it("updates colors, ignores legacy group metadata, and generates harmony colors", () => {
    const colors = [
      { id: "fill", name: "Fill", value: "#ff0000", target: "fill" as const, alpha: 0.8, groupName: "Brand" },
      { id: "stroke", name: "Stroke", value: "#111111", target: "stroke" as const, alpha: 1, groupName: "Brand" },
    ] as unknown as Parameters<typeof updatePaletteColor>[0];

    expect(updatePaletteColor(colors, "fill", { value: "#00ff00", name: "Green", alpha: 0.5 })[0]).toMatchObject({
      name: "Green",
      value: "#00ff00",
      alpha: 0.5,
    });
    expect(generateHarmonyColors("#ff0000", "triad")).toEqual(["#00ff00", "#0000ff"]);
    expect(addHarmonyColors([], { value: "#ff0000", target: "fill" }, "complementary", 10)).toHaveLength(1);

    const read = readColorPalette({
      getItem: () => JSON.stringify(colors),
    });
    expect(read).toEqual([
      { id: "fill", name: "Fill", value: "#ff0000", target: "fill", alpha: 0.8 },
      { id: "stroke", name: "Stroke", value: "#111111", target: "stroke", alpha: 1 },
    ]);
  });

  it("creates and reads saved palette units with multiple harmony modes", () => {
    expect(generatePaletteSchemeColors("#ff0000", "complementary")).toHaveLength(2);
    expect(generatePaletteSchemeColors("#ff0000", "square")).toHaveLength(4);
    expect(generatePaletteSchemeColors("#ff0000", "shades")).toHaveLength(5);
    expect(generatePaletteSchemeColors("#ff0000", "monochromatic")).toHaveLength(3);

    const now = new Date("2026-06-07T00:00:00.000Z");
    const palettes = addSavedColorPalette([], { name: "Stream set", baseColor: "#ff0000", mode: "triad" }, now);
    expect(palettes[0]).toMatchObject({
      name: "Stream set",
      mode: "triad",
      baseColor: "#ff0000",
      colors: ["#ff0000", "#00ff00", "#0000ff"],
    });

    const read = readSavedColorPalettes({
      getItem: () => JSON.stringify(palettes),
    });
    expect(read).toEqual(palettes);
    expect(removeSavedColorPalette(palettes, palettes[0].id)).toEqual([]);
  });

  it("derives a linked palette base from a dragged scheme point", () => {
    expect(derivePaletteBaseFromSchemeColor("#00ff00", 1, "triad")).toBe("#ff0000");
    expect(generatePaletteSchemeColors(derivePaletteBaseFromSchemeColor("#00ff00", 1, "triad") ?? "", "triad")[1]).toBe(
      "#00ff00",
    );
    expect(generatePaletteSchemeColors(derivePaletteBaseFromSchemeColor("#808080", 0, "square") ?? "", "square")[0]).toBe(
      "#808080",
    );
    expect(generatePaletteSchemeColors(derivePaletteBaseFromSchemeColor("#6c6c6c", 1, "shades") ?? "", "shades")[1]).toBe(
      "#6c6c6c",
    );
  });
});
