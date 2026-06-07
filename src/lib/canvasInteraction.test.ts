import { describe, expect, it } from "vitest";
import { getLayerInteractionAt, moveLayer, resizeLayer, rotateLayer } from "./canvasInteraction";
import { makeShapeLayer, makeTextLayer } from "./layerFactory";

describe("canvasInteraction", () => {
  it("detects move and resize handles", () => {
    const layer = makeShapeLayer({ x: 100, y: 100, width: 200, height: 100 });

    expect(getLayerInteractionAt(layer, { x: 150, y: 130 })).toBe("move");
    expect(getLayerInteractionAt(layer, { x: 100, y: 100 })).toBe("resize-nw");
    expect(getLayerInteractionAt(layer, { x: 200, y: 46 })).toBe("rotate");
  });

  it("moves layers by pointer delta", () => {
    const layer = makeShapeLayer({ x: 100, y: 100, width: 200, height: 100 });
    expect(moveLayer(layer, { x: 120, y: 120 }, { x: 150, y: 170 })).toMatchObject({ x: 130, y: 150 });
  });

  it("resizes from a dragged corner", () => {
    const layer = makeShapeLayer({ x: 100, y: 100, width: 200, height: 100 });
    const resized = resizeLayer(layer, "resize-se", { x: 360, y: 260 });
    expect(resized.width).toBe(260);
    expect(resized.height).toBe(160);
  });

  it("rotates around layer center", () => {
    const layer = makeShapeLayer({ x: 100, y: 100, width: 200, height: 100 });
    const rotated = rotateLayer(layer, { x: 200, y: 50 }, { x: 300, y: 150 });
    expect(rotated.rotation).toBeGreaterThan(80);
  });

  it("detects vertical text interactions from visual text bounds", () => {
    const layer = makeTextLayer({
      x: 100,
      y: 100,
      width: 300,
      height: 120,
      text: "ABCD\nEF",
      fontSize: 40,
      lineHeight: 1.2,
      letterSpacing: 8,
      strokeWidth: 6,
      writingMode: "vertical",
      align: "left",
    });

    expect(getLayerInteractionAt(layer, { x: 120, y: 160 })).toBe("move");
    expect(getLayerInteractionAt(layer, { x: 300, y: 160 })).toBeNull();
  });
});
