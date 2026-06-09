import { describe, expect, it } from "vitest";
import { applyLayerAnimation } from "./animation";
import { makeTextLayer } from "./layerFactory";

describe("animation", () => {
  it("applies fade without mutating the source layer", () => {
    const layer = makeTextLayer({
      opacity: 0.8,
      animation: {
        type: "fade",
        startMs: 0,
        durationMs: 1000,
        easing: "linear",
        loop: false,
        direction: "up",
        distance: 80,
      },
    });

    const animated = applyLayerAnimation(layer, 500);

    expect(animated.opacity).toBeCloseTo(0.4);
    expect(layer.opacity).toBe(0.8);
  });

  it("slides from the configured direction toward the original position", () => {
    const layer = makeTextLayer({
      x: 100,
      y: 200,
      animation: {
        type: "slide",
        startMs: 0,
        durationMs: 1000,
        easing: "linear",
        loop: false,
        direction: "up",
        distance: 100,
      },
    });

    const animated = applyLayerAnimation(layer, 250);

    expect(animated.x).toBe(100);
    expect(animated.y).toBe(125);
  });

  it("keeps completed one-shot entrance animations at their final state", () => {
    const layer = makeTextLayer({
      width: 200,
      height: 100,
      animation: {
        type: "pop",
        startMs: 0,
        durationMs: 800,
        easing: "easeOut",
        loop: false,
        direction: "up",
        distance: 80,
      },
    });

    const animated = applyLayerAnimation(layer, 1200);

    expect(animated.width).toBe(200);
    expect(animated.height).toBe(100);
  });
});
