import { describe, expect, it } from "vitest";
import { makeShapeLayer } from "./layerFactory";
import { selectIndividualLayerId, selectLayerIdsAfterDelete, selectLayerIdsForLayer, selectTopSelectableLayerIds } from "./layerOperations";

describe("layerOperations", () => {
  it("clears selection when the deleted layer was the only selection", () => {
    const layers = [
      makeShapeLayer({ id: "bottom", name: "Bottom" }),
      makeShapeLayer({ id: "locked-top", name: "Locked top", selectable: false }),
      makeShapeLayer({ id: "top", name: "Top" }),
    ];

    expect(selectLayerIdsAfterDelete(layers, ["deleted"], "deleted")).toEqual([]);
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

  it("selects all editable group members when a grouped layer is selected", () => {
    const layers = [
      makeShapeLayer({ id: "outside" }),
      makeShapeLayer({ id: "group-a", groupId: "g1", groupName: "Folder" }),
      makeShapeLayer({ id: "group-b", groupId: "g1", groupName: "Folder" }),
      makeShapeLayer({ id: "locked-group", groupId: "g1", groupName: "Folder", selectable: false }),
    ];

    expect(selectLayerIdsForLayer(layers, [], "group-b")).toEqual(["group-a", "group-b"]);
  });

  it("toggles whole groups additively without disturbing earlier selected layers", () => {
    const layers = [
      makeShapeLayer({ id: "outside" }),
      makeShapeLayer({ id: "group-a", groupId: "g1", groupName: "Folder" }),
      makeShapeLayer({ id: "group-b", groupId: "g1", groupName: "Folder" }),
    ];

    expect(selectLayerIdsForLayer(layers, ["outside"], "group-a", true)).toEqual(["outside", "group-a", "group-b"]);
    expect(selectLayerIdsForLayer(layers, ["outside", "group-a", "group-b"], "group-b", true)).toEqual(["outside"]);
  });

  it("can select one editable grouped layer without expanding to the whole group", () => {
    const layers = [
      makeShapeLayer({ id: "group-a", groupId: "g1", groupName: "Folder" }),
      makeShapeLayer({ id: "group-b", groupId: "g1", groupName: "Folder" }),
      makeShapeLayer({ id: "locked", groupId: "g1", groupName: "Folder", selectable: false }),
    ];

    expect(selectIndividualLayerId(layers, "group-b")).toEqual(["group-b"]);
    expect(selectIndividualLayerId(layers, "locked")).toEqual([]);
  });
});
