import type { RelativeLayerTransform } from "./layerTransform";

export type LiveRelativeTransformAxis = "moveX" | "moveY" | "rotation";

export interface LiveRelativeTransformState {
  moveX: number;
  moveY: number;
  rotation: number;
}

export const emptyLiveRelativeTransformState: LiveRelativeTransformState = {
  moveX: 0,
  moveY: 0,
  rotation: 0,
};

export function updateLiveRelativeTransformState(
  current: LiveRelativeTransformState,
  axis: LiveRelativeTransformAxis,
  value: number,
): { nextState: LiveRelativeTransformState; transform: RelativeLayerTransform } {
  const nextValue = round(finiteOrZero(value));
  const previousValue = finiteOrZero(current[axis]);
  const delta = round(nextValue - previousValue);
  const nextState = { ...current, [axis]: nextValue };

  if (axis === "moveX") return { nextState, transform: { deltaX: delta } };
  if (axis === "moveY") return { nextState, transform: { deltaY: delta } };
  return { nextState, transform: { deltaRotation: delta } };
}

export function hasLiveRelativeTransformDelta(transform: RelativeLayerTransform): boolean {
  return Boolean(transform.deltaX || transform.deltaY || transform.deltaRotation);
}

function finiteOrZero(value: number): number {
  return Number.isFinite(value) ? Number(value) : 0;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
