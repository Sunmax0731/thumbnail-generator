import { describe, expect, it } from "vitest";
import { addPaletteColor, normalizeColor, normalizePaletteName, readColorPalette, removePaletteColor } from "./colorPalette";

describe("colorPalette", () => {
  it("normalizes hex colors", () => {
    expect(normalizeColor("#ABC")).toBe("#aabbcc");
    expect(normalizeColor("#12abef")).toBe("#12abef");
    expect(normalizeColor("red")).toBeNull();
  });

  it("adds unique colors and removes by id", () => {
    const colors = addPaletteColor([], { value: "#ff4f5f", name: "Action coral", target: "fill" }, 1);
    expect(colors).toEqual([{ id: "palette-fill-1", name: "Action coral", value: "#ff4f5f", target: "fill" }]);
    expect(addPaletteColor(colors, "#ff4f5f", 2)).toHaveLength(1);
    expect(addPaletteColor(colors, { value: "#ff4f5f", target: "stroke" }, 2)).toEqual([
      { id: "palette-stroke-2", name: "Stroke #ff4f5f", value: "#ff4f5f", target: "stroke" },
      { id: "palette-fill-1", name: "Action coral", value: "#ff4f5f", target: "fill" },
    ]);
    expect(removePaletteColor(colors, "palette-fill-1")).toHaveLength(0);
  });

  it("normalizes palette names and migrates legacy storage entries", () => {
    expect(normalizePaletteName("  Campaign blue  ", "Fallback")).toBe("Campaign blue");
    expect(normalizePaletteName("", "Fallback")).toBe("Fallback");

    const colors = readColorPalette({
      getItem: () => JSON.stringify([{ id: "legacy-blue", value: "#123ABC" }]),
    });
    expect(colors).toEqual([{ id: "legacy-blue", name: "Fill #123abc", value: "#123abc", target: "fill" }]);
  });
});
