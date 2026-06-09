import { describe, expect, it } from "vitest";
import { alignLayers } from "./alignment";
import { makeShapeLayer } from "./layerFactory";

describe("alignment", () => {
  it("aligns a single layer to the canvas", () => {
    const layer = makeShapeLayer({ id: "a", x: 40, y: 50, width: 100, height: 80 });
    const [aligned] = alignLayers([layer], ["a"], { width: 500, height: 300 }, "right");

    expect(aligned.x).toBe(400);
  });

  it("aligns multiple layers to the selection bounds", () => {
    const layers = [
      makeShapeLayer({ id: "a", x: 40, y: 50, width: 100, height: 80 }),
      makeShapeLayer({ id: "b", x: 260, y: 100, width: 50, height: 40 }),
    ];
    const aligned = alignLayers(layers, ["a", "b"], { width: 500, height: 300 }, "center");

    expect(aligned[0].x).toBe(125);
    expect(aligned[1].x).toBe(150);
  });

  it("does not align locked layers", () => {
    const layer = makeShapeLayer({ id: "a", x: 40, selectable: false });
    const [aligned] = alignLayers([layer], ["a"], { width: 500, height: 300 }, "left");

    expect(aligned.x).toBe(40);
  });

  it("distributes selected layers evenly by horizontal centers", () => {
    const layers = [
      makeShapeLayer({ id: "a", x: 20, y: 20, width: 40, height: 40 }),
      makeShapeLayer({ id: "b", x: 80, y: 20, width: 40, height: 40 }),
      makeShapeLayer({ id: "c", x: 260, y: 20, width: 40, height: 40 }),
    ];
    const distributed = alignLayers(layers, ["a", "b", "c"], { width: 500, height: 300 }, "distribute-horizontal");

    expect(distributed.map((layer) => layer.x)).toEqual([20, 140, 260]);
  });

  it("distributes selected layers evenly by vertical centers", () => {
    const layers = [
      makeShapeLayer({ id: "a", x: 20, y: 20, width: 40, height: 40 }),
      makeShapeLayer({ id: "b", x: 20, y: 80, width: 40, height: 40 }),
      makeShapeLayer({ id: "c", x: 20, y: 260, width: 40, height: 40 }),
    ];
    const distributed = alignLayers(layers, ["a", "b", "c"], { width: 500, height: 300 }, "distribute-vertical");

    expect(distributed.map((layer) => layer.y)).toEqual([20, 140, 260]);
  });
});
