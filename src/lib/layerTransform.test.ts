import { describe, expect, it } from "vitest";
import { makeShapeLayer } from "./layerFactory";
import { applyRelativeLayerTransform, matchSelectedLayerRotation } from "./layerTransform";

describe("layerTransform", () => {
  it("applies the same position and rotation deltas to selected editable layers", () => {
    const first = makeShapeLayer({ id: "first", x: 10, y: 20, rotation: 12 });
    const second = makeShapeLayer({ id: "second", x: 30, y: 40, rotation: -8 });
    const third = makeShapeLayer({ id: "third", x: 50, y: 60, rotation: 0 });

    const result = applyRelativeLayerTransform([first, second, third], ["first", "second"], {
      deltaX: 15,
      deltaY: -5,
      deltaRotation: 20,
    });

    expect(result[0]).toMatchObject({ x: 25, y: 15, rotation: 32 });
    expect(result[1]).toMatchObject({ x: 45, y: 35, rotation: 12 });
    expect(result[2]).toMatchObject({ x: 50, y: 60, rotation: 0 });
  });

  it("keeps locked selected layers unchanged and normalizes rotation", () => {
    const editable = makeShapeLayer({ id: "editable", rotation: 175 });
    const locked = makeShapeLayer({ id: "locked", selectable: false, rotation: 175 });

    const result = applyRelativeLayerTransform([editable, locked], ["editable", "locked"], {
      deltaRotation: 20,
    });

    expect(result[0].rotation).toBe(-165);
    expect(result[1].rotation).toBe(175);
  });

  it("matches selected layer rotations to the first editable selection", () => {
    const first = makeShapeLayer({ id: "first", rotation: 14 });
    const second = makeShapeLayer({ id: "second", rotation: -42 });
    const locked = makeShapeLayer({ id: "locked", selectable: false, rotation: 90 });
    const outside = makeShapeLayer({ id: "outside", rotation: 8 });

    const result = matchSelectedLayerRotation([first, second, locked, outside], ["first", "second", "locked"]);

    expect(result[0].rotation).toBe(14);
    expect(result[1].rotation).toBe(14);
    expect(result[2].rotation).toBe(90);
    expect(result[3].rotation).toBe(8);
  });
});
