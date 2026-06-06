import { describe, expect, it } from "vitest";
import { makeShapeLayer } from "./layerFactory";
import { pickLayerAt, pickLayerInteractionAt } from "./hitTest";

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
});
