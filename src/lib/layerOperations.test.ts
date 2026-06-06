import { describe, expect, it } from "vitest";
import { makeShapeLayer } from "./layerFactory";
import { selectLayerIdsAfterDelete, selectTopSelectableLayerIds } from "./layerOperations";

describe("layerOperations", () => {
  it("selects the top selectable layer when the deleted layer was the only selection", () => {
    const layers = [
      makeShapeLayer({ id: "bottom", name: "Bottom" }),
      makeShapeLayer({ id: "locked-top", name: "Locked top", selectable: false }),
      makeShapeLayer({ id: "top", name: "Top" }),
    ];

    expect(selectLayerIdsAfterDelete(layers, ["deleted"], "deleted")).toEqual(["top"]);
  });

  it("retains other valid selected layers after one selected layer is deleted", () => {
    const layers = [makeShapeLayer({ id: "a" }), makeShapeLayer({ id: "b" }), makeShapeLayer({ id: "c" })];

    expect(selectLayerIdsAfterDelete(layers, ["a", "deleted", "c"], "deleted")).toEqual(["a", "c"]);
  });

  it("does not select locked layers as a fallback", () => {
    const layers = [makeShapeLayer({ id: "locked", selectable: false })];

    expect(selectTopSelectableLayerIds(layers)).toEqual([]);
    expect(selectLayerIdsAfterDelete(layers, ["deleted"], "deleted")).toEqual([]);
  });
});
