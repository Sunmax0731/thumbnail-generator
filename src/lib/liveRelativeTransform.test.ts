import { describe, expect, it } from "vitest";
import {
  emptyLiveRelativeTransformState,
  hasLiveRelativeTransformDelta,
  updateLiveRelativeTransformState,
} from "./liveRelativeTransform";

describe("liveRelativeTransform", () => {
  it("turns live movement values into incremental deltas", () => {
    const first = updateLiveRelativeTransformState(emptyLiveRelativeTransformState, "moveX", 12);
    const second = updateLiveRelativeTransformState(first.nextState, "moveX", 5);
    const third = updateLiveRelativeTransformState(second.nextState, "moveY", -8);

    expect(first.transform).toEqual({ deltaX: 12 });
    expect(second.transform).toEqual({ deltaX: -7 });
    expect(third.transform).toEqual({ deltaY: -8 });
  });

  it("turns live rotation values into incremental deltas", () => {
    const first = updateLiveRelativeTransformState(emptyLiveRelativeTransformState, "rotation", 15);
    const second = updateLiveRelativeTransformState(first.nextState, "rotation", -10);

    expect(first.transform).toEqual({ deltaRotation: 15 });
    expect(second.transform).toEqual({ deltaRotation: -25 });
  });

  it("reports whether a live transform changed layer values", () => {
    expect(hasLiveRelativeTransformDelta({ deltaX: 0 })).toBe(false);
    expect(hasLiveRelativeTransformDelta({ deltaRotation: 1 })).toBe(true);
  });
});
