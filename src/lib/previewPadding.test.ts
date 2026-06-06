import { describe, expect, it } from "vitest";
import { makeShapeLayer } from "./layerFactory";
import { calculatePreviewPadding } from "./previewPadding";

describe("previewPadding", () => {
  it("keeps the minimum padding when layers remain inside the canvas", () => {
    const padding = calculatePreviewPadding(
      [makeShapeLayer({ x: 100, y: 100, width: 200, height: 100 })],
      { width: 1280, height: 720 },
      { minimum: 88 },
    );

    expect(padding).toBe(88);
  });

  it("expands padding for layers that extend outside the canvas", () => {
    const padding = calculatePreviewPadding(
      [makeShapeLayer({ x: -180, y: 80, width: 220, height: 140 })],
      { width: 1280, height: 720 },
      { minimum: 88, margin: 40 },
    );

    expect(padding).toBeGreaterThanOrEqual(220);
  });
});
