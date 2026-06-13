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
    expect(zoom).toBeGreaterThanOrEqual(0.1);
  });

  it("allows narrow preview areas to fit portrait templates below 25 percent", () => {
    expect(
      calculateCanvasFitZoom({
        containerWidth: 724,
        containerHeight: 392,
        documentWidth: 1080,
        documentHeight: 1920,
        previewPadding: 0,
      }),
    ).toBe(0.2);
  });

  it("shrinks landscape presets by the visible width when needed", () => {
    expect(
      calculateCanvasFitZoom({
        containerWidth: 960,
        containerHeight: 640,
        documentWidth: 1280,
        documentHeight: 720,
        previewPadding: 88,
      }),
    ).toBe(0.75);
  });

  it("rounds fit zoom down so the canvas does not spill past the container", () => {
    expect(
      calculateCanvasFitZoom({
        containerWidth: 840,
        containerHeight: 668,
        documentWidth: 1280,
        documentHeight: 720,
        previewPadding: 0,
      }),
    ).toBe(0.65);
  });

  it("keeps smaller documents at the preferred fit when both axes allow it", () => {
    expect(
      calculateCanvasFitZoom({
        containerWidth: 960,
        containerHeight: 640,
        documentWidth: 640,
        documentHeight: 360,
        previewPadding: 40,
      }),
    ).toBe(0.94);
  });
});
