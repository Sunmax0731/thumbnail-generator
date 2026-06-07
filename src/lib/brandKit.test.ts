import { describe, expect, it } from "vitest";
import { applyBrandKitToLayers, createBrandKitFromCurrentState, normalizeBrandKit } from "./brandKit";
import { makeShapeLayer, makeTextLayer } from "./layerFactory";

describe("brandKit", () => {
  it("captures reusable style from current text and shape layers", () => {
    const text = makeTextLayer({ color: "#ffffff", strokeColor: "#111827", fontFamily: "Arial Black, Arial, sans-serif" });
    const shape = makeShapeLayer({ fill: "#ff4f5f", strokeColor: "#10b6d7" });

    const kit = createBrandKitFromCurrentState([text, shape]);

    expect(kit.primaryColor).toBe("#ffffff");
    expect(kit.accentColor).toBe("#10b6d7");
    expect(kit.shadowColor).toBe("#111827");
  });

  it("applies brand colors and font to selected editable layers", () => {
    const text = makeTextLayer({ id: "text", color: "#000000" });
    const shape = makeShapeLayer({ id: "shape", fill: "#000000" });

    const next = applyBrandKitToLayers([text, shape], ["text", "shape"], {
      channelName: "Channel",
      primaryColor: "#ff4f5f",
      accentColor: "#10b6d7",
      fontFamily: "Anton, sans-serif",
      shadowColor: "#111827",
    });

    expect(next[0]).toMatchObject({ color: "#ff4f5f", strokeColor: "#111827", fontFamily: "Anton, sans-serif" });
    expect(next[1]).toMatchObject({ fill: "#ff4f5f", strokeColor: "#10b6d7" });
  });

  it("normalizes invalid stored brand kit data", () => {
    expect(normalizeBrandKit({ channelName: "  My Channel  ", primaryColor: "bad" })).toMatchObject({
      channelName: "My Channel",
      primaryColor: "#ff4f5f",
    });
  });
});
