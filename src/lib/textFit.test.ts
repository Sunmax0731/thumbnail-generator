import { describe, expect, it } from "vitest";
import { makeTextLayer } from "./layerFactory";
import { calculateFittedFontSize, fitTextLayerToBounds } from "./textFit";

const measure = (text: string, fontSize: number) => text.length * fontSize * 0.5;

describe("textFit", () => {
  it("finds the largest font size that fits width and height", () => {
    const layer = makeTextLayer({
      width: 240,
      height: 80,
      text: "FIT TEXT",
      strokeWidth: 0,
      lineHeight: 1,
    });

    const size = calculateFittedFontSize(layer, {
      minFontSize: 8,
      maxFontSize: 100,
      measureTextWidth: measure,
    });

    expect(size).toBe(60);
  });

  it("updates only the font size on a text layer", () => {
    const layer = makeTextLayer({
      text: "TWO\nLINES",
      width: 200,
      height: 100,
      fontSize: 20,
      lineHeight: 1,
      color: "#ffffff",
    });

    const fitted = fitTextLayerToBounds(layer, {
      minFontSize: 8,
      maxFontSize: 200,
      measureTextWidth: measure,
    });

    expect(fitted.fontSize).toBeGreaterThan(layer.fontSize);
    expect(fitted.color).toBe(layer.color);
    expect(fitted.text).toBe(layer.text);
  });
});
