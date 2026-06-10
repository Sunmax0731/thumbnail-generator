import { describe, expect, it } from "vitest";
import {
  addHarmonyColors,
  addPaletteColor,
  addSavedColorPalette,
  getHarmonyPrinciple,
  derivePaletteBaseFromSchemeColor,
  generateHarmonyColors,
  generatePaletteSchemeColors,
  hexToRgbChannels,
  paletteModesByPrinciple,
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
    expect(paletteModesByPrinciple.order).toEqual([
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
    ]);
    expect(paletteModesByPrinciple.proximity).toEqual(["complex-harmony", "natural-harmony"]);
    expect(paletteModesByPrinciple.similarity).toEqual([
      "dominant-color",
      "tone-on-tone",
      "dominant-tone",
      "tone-in-tone",
      "tonal-color",
      "camaieu",
      "faux-camaieu",
    ]);
    expect(paletteModesByPrinciple.clarity).toEqual(["tricolor", "bicolor"]);
    expect(getHarmonyPrinciple("identity")).toBe("order");
    expect(getHarmonyPrinciple("complementary")).toBe("order");
    expect(getHarmonyPrinciple("split")).toBe("order");
    expect(getHarmonyPrinciple("complex-harmony")).toBe("proximity");
    expect(getHarmonyPrinciple("shades")).toBe("proximity");
    expect(getHarmonyPrinciple("dominant-color")).toBe("similarity");
    expect(getHarmonyPrinciple("camaieu")).toBe("similarity");
    expect(getHarmonyPrinciple("tricolor")).toBe("clarity");
    expect(generatePaletteSchemeColors("#00ff00", "identity")).toHaveLength(3);
    expect(generatePaletteSchemeColors("#ff0000", "tricolor")).toHaveLength(3);
    expect(generatePaletteSchemeColors("#ff0000", "intermediate")).toHaveLength(2);
    expect(generatePaletteSchemeColors("#ff0000", "opponent")).toHaveLength(2);
    expect(generatePaletteSchemeColors("#ff0000", "diod")).toHaveLength(2);
    expect(generatePaletteSchemeColors("#ff0000", "rectangular")).toHaveLength(4);
    expect(generatePaletteSchemeColors("#ff0000", "hexad")).toHaveLength(6);

    expect(generatePaletteSchemeColors("#ff0000", "complementary")).toHaveLength(2);
    expect(generatePaletteSchemeColors("#ff0000", "square")).toHaveLength(4);
    expect(generatePaletteSchemeColors("#ff0000", "shades")).toHaveLength(5);
    expect(generatePaletteSchemeColors("#ff0000", "monochromatic")).toHaveLength(5);
    expect(generatePaletteSchemeColors("#ff0000", "complex-harmony")).toHaveLength(5);

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
    expect(derivePaletteBaseFromSchemeColor(generatePaletteSchemeColors("#00ff00", "intermediate")[1], 1, "intermediate")).toBe(
      "#00ff00",
    );
    expect(
      generatePaletteSchemeColors(
        derivePaletteBaseFromSchemeColor(generatePaletteSchemeColors("#00ff00", "intermediate")[1], 1, "intermediate") ?? "",
        "intermediate",
      )[1],
    ).toBe(generatePaletteSchemeColors("#00ff00", "intermediate")[1]);
    expect(derivePaletteBaseFromSchemeColor(generatePaletteSchemeColors("#00ff00", "opponent")[1], 1, "opponent")).toBe("#00ff00");
    expect(generatePaletteSchemeColors(derivePaletteBaseFromSchemeColor("#808080", 0, "square") ?? "", "square")[0]).toBe(
      "#808080",
    );
    expect(generatePaletteSchemeColors(derivePaletteBaseFromSchemeColor("#6c6c6c", 1, "shades") ?? "", "shades")[1]).toBe(
      "#6c6c6c",
    );
    const naturalPalette = generatePaletteSchemeColors("#ffcc66", "natural-harmony");
    expect(generatePaletteSchemeColors(derivePaletteBaseFromSchemeColor(naturalPalette[2], 2, "natural-harmony") ?? "", "natural-harmony")[2]).toBe(
      naturalPalette[2],
    );
    const complexPalette = generatePaletteSchemeColors("#ffcc66", "complex-harmony");
    expect(generatePaletteSchemeColors(derivePaletteBaseFromSchemeColor(complexPalette[2], 2, "complex-harmony") ?? "", "complex-harmony")[2]).toBe(
      complexPalette[2],
    );
    const identityPalette = generatePaletteSchemeColors("#ffcc66", "identity");
    expect(generatePaletteSchemeColors(derivePaletteBaseFromSchemeColor(identityPalette[1], 1, "identity") ?? "", "identity")[1]).toBe(
      identityPalette[1],
    );
  });

  it("maps similarity principle drag points to readable inverse profiles", () => {
    const similarityModes = [
      "dominant-color",
      "tone-on-tone",
      "dominant-tone",
      "tone-in-tone",
      "tonal-color",
      "camaieu",
      "faux-camaieu",
    ] as const;
    const base = "#ffcc66";
    const colorDelta = (left: string, right: string): number => {
      const lhs = hexToRgbChannels(left);
      const rhs = hexToRgbChannels(right);
      if (!lhs || !rhs) return Number.MAX_SAFE_INTEGER;
      return Math.max(Math.abs(lhs.r - rhs.r), Math.abs(lhs.g - rhs.g), Math.abs(lhs.b - rhs.b));
    };

    for (const mode of similarityModes) {
      const palette = generatePaletteSchemeColors(base, mode);
      expect(palette).toHaveLength(5);
      expect(new Set(palette).size).toBeGreaterThan(1);
      for (let index = 0; index < palette.length; index++) {
        const point = palette[index];
        const linkedBase = derivePaletteBaseFromSchemeColor(point, index, mode);
        expect(linkedBase).not.toBeNull();
        if (!linkedBase) continue;
        const roundTrip = generatePaletteSchemeColors(linkedBase, mode)[index];
        expect(colorDelta(roundTrip, point)).toBeLessThanOrEqual(4);
      }
    }
  });
});
