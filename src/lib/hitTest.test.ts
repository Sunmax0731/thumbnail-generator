import { describe, expect, it } from "vitest";
import { makeShapeLayer, makeTextLayer } from "./layerFactory";
import { pickLayerAt, pickLayerInteractionAt, pickLayersInRect } from "./hitTest";

describe("hit testing", () => {
  it("picks the topmost visible selectable layer in overlapping bounds", () => {
    const bottom = makeShapeLayer({ id: "bottom", x: 0, y: 0, width: 160, height: 160 });
    const top = makeShapeLayer({ id: "top", x: 40, y: 40, width: 160, height: 160 });

    expect(pickLayerAt([bottom, top], 80, 80)?.id).toBe("top");
  });

  it("routes selected body clicks through z-order before moving", () => {
    const bottom = makeShapeLayer({ id: "bottom", x: 0, y: 0, width: 160, height: 160 });
    const top = makeShapeLayer({ id: "top", x: 40, y: 40, width: 160, height: 160 });

    expect(pickLayerInteractionAt([bottom, top], { x: 80, y: 80 }, bottom)).toMatchObject({
      layer: top,
      mode: "move",
    });
  });

  it("keeps selected resize handles active outside the layer body", () => {
    const selected = makeShapeLayer({ id: "selected", x: 20, y: 20, width: 120, height: 120 });

    expect(pickLayerInteractionAt([selected], { x: 20, y: 20 }, selected)).toMatchObject({
      layer: selected,
      mode: "resize-nw",
    });
  });

  it("uses the configured vertical text display bounds for selection", () => {
    const vertical = makeTextLayer({
      id: "vertical",
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

    expect(pickLayerAt([vertical], 120, 160)?.id).toBe("vertical");
    expect(pickLayerAt([vertical], 300, 160)?.id).toBe("vertical");
    expect(pickLayerAt([vertical], 90, 160)).toBeUndefined();
  });

  it("picks visible selectable layers intersecting a dragged selection rectangle", () => {
    const inside = makeShapeLayer({ id: "inside", x: 20, y: 20, width: 80, height: 60 });
    const crossing = makeShapeLayer({ id: "crossing", x: 140, y: 40, width: 80, height: 80 });
    const outside = makeShapeLayer({ id: "outside", x: 320, y: 40, width: 80, height: 80 });
    const locked = makeShapeLayer({ id: "locked", x: 60, y: 80, width: 80, height: 80, selectable: false });

    expect(
      pickLayersInRect([inside, crossing, outside, locked], {
        left: 10,
        top: 10,
        right: 180,
        bottom: 110,
      }).map((layer) => layer.id),
    ).toEqual(["inside", "crossing"]);
  });
});
