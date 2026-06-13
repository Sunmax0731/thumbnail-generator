import { describe, expect, it } from "vitest";
import { createGroupObjectAsset, instantiateGroupObject } from "./groupObjects";
import { makeShapeLayer, makeTextLayer } from "./layerFactory";

describe("groupObjects", () => {
  it("stores sanitized tags with grouped layers", () => {
    const groupObject = createGroupObjectAsset(
      "  Lower third  ",
      [makeShapeLayer({ id: "a", groupId: "g1" }), makeTextLayer({ id: "b", groupId: "g1" })],
      [],
      new Date("2026-06-13T00:00:00.000Z"),
      [" stream ", "Stream", "lower third"],
    );

    expect(groupObject.name).toBe("Lower third");
    expect(groupObject.tags).toEqual(["stream", "lower third"]);
    expect(groupObject.layers).toHaveLength(2);
  });

  it("instantiates layers with new ids and shared group metadata", () => {
    const groupObject = createGroupObjectAsset(
      "Bug badge",
      [makeShapeLayer({ id: "shape-1", x: 10, y: 20 }), makeTextLayer({ id: "text-1", x: 30, y: 40 })],
      [],
      new Date("2026-06-13T00:00:00.000Z"),
    );

    const instance = instantiateGroupObject(groupObject, 8, 12);

    expect(instance.layers).toHaveLength(2);
    expect(instance.layers.map((layer) => layer.id)).not.toContain("shape-1");
    expect(new Set(instance.layers.map((layer) => layer.groupId)).size).toBe(1);
    expect(instance.layers.map((layer) => [layer.x, layer.y])).toEqual([
      [18, 32],
      [38, 52],
    ]);
    expect(instance.selectedIds).toEqual(instance.layers.map((layer) => layer.id));
  });
});
