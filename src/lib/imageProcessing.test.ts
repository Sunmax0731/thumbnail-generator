import { describe, expect, it } from "vitest";
import { applyChromaKey, cropBoundsFor, type ImageProcessOptions } from "./imageProcessing";

describe("imageProcessing", () => {
  it("turns chroma-key pixels transparent", () => {
    const data = new Uint8ClampedArray([0, 255, 0, 255]);
    const context = {
      getImageData: () => ({ data }),
      putImageData: () => undefined,
    } as unknown as CanvasRenderingContext2D;

    applyChromaKey(context, 1, 1, "#00ff00", 1);
    expect(data[3]).toBe(0);
  });

  it("computes polygon crop bounds", () => {
    const options: ImageProcessOptions = {
      chromaKeyEnabled: false,
      chromaKeyColor: "#00ff00",
      chromaKeyTolerance: 20,
      cropMode: "polygon",
      cropRect: { x: 0, y: 0, width: 100, height: 100 },
      polygonPoints: [
        { x: 10, y: 20 },
        { x: 80, y: 30 },
        { x: 60, y: 90 },
      ],
    };

    expect(cropBoundsFor(options, 200, 200)).toEqual({ x: 10, y: 20, width: 70, height: 70 });
  });
});
