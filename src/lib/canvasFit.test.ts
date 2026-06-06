import { describe, expect, it } from "vitest";
import { calculateCanvasFitZoom } from "./canvasFit";

describe("canvas fit zoom", () => {
  it("shrinks portrait presets to fit the visible canvas area", () => {
    const zoom = calculateCanvasFitZoom({
      containerWidth: 720,
      containerHeight: 520,
      documentWidth: 1080,
      documentHeight: 1920,
      previewPadding: 88,
    });

    expect(zoom).toBeLessThan(0.94);
    expect(zoom).toBeGreaterThanOrEqual(0.25);
  });

  it("keeps landscape presets at the preferred fit when height allows it", () => {
    expect(
      calculateCanvasFitZoom({
        containerWidth: 960,
        containerHeight: 640,
        documentWidth: 1280,
        documentHeight: 720,
        previewPadding: 88,
      }),
    ).toBe(0.94);
  });
});
