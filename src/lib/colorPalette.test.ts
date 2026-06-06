import { describe, expect, it } from "vitest";
import { addPaletteColor, normalizeColor, removePaletteColor } from "./colorPalette";

describe("colorPalette", () => {
  it("normalizes hex colors", () => {
    expect(normalizeColor("#ABC")).toBe("#aabbcc");
    expect(normalizeColor("#12abef")).toBe("#12abef");
    expect(normalizeColor("red")).toBeNull();
  });

  it("adds unique colors and removes by id", () => {
    const colors = addPaletteColor([], "#ff4f5f", 1);
    expect(colors).toEqual([{ id: "palette-1", value: "#ff4f5f" }]);
    expect(addPaletteColor(colors, "#ff4f5f", 2)).toHaveLength(1);
    expect(removePaletteColor(colors, "palette-1")).toHaveLength(0);
  });
});
