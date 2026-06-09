import { describe, expect, it } from "vitest";
import { applyLayerAnimation } from "./animation";
import { makeTextLayer } from "./layerFactory";
import { evaluateEasing } from "./easings";

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
        easing: "easeOutQuad",
        loop: false,
        direction: "up",
        distance: 80,
      },
    });

    const animated = applyLayerAnimation(layer, 1200);

    expect(animated.width).toBe(200);
    expect(animated.height).toBe(100);
  });

  it("supports easings.net style easing functions", () => {
    expect(evaluateEasing(0, "easeOutBounce")).toBe(0);
    expect(evaluateEasing(1, "easeOutBounce")).toBe(1);
    expect(evaluateEasing(0.5, "easeInOutSine")).toBeCloseTo(0.5);
  });

  it("keeps distance-based movement inert when direction is none", () => {
    const layer = makeTextLayer({
      x: 100,
      y: 200,
      animation: {
        type: "slide",
        startMs: 0,
        durationMs: 1000,
        easing: "linear",
        loop: false,
        direction: "none",
        distance: 100,
      },
    });

    const animated = applyLayerAnimation(layer, 250);

    expect(animated.x).toBe(100);
    expect(animated.y).toBe(200);
  });

  it("applies new zoom and spin animation types", () => {
    const zoom = applyLayerAnimation(
      makeTextLayer({
        width: 200,
        height: 100,
        animation: {
          type: "zoom",
          startMs: 0,
          durationMs: 1000,
          easing: "linear",
          loop: false,
          direction: "none",
          distance: 0,
        },
      }),
      500,
    );
    const spin = applyLayerAnimation(
      makeTextLayer({
        rotation: 10,
        animation: {
          type: "spin",
          startMs: 0,
          durationMs: 1000,
          easing: "linear",
          loop: false,
          direction: "none",
          distance: 0,
        },
      }),
      500,
    );

    expect(zoom.width).toBeCloseTo(190);
    expect(zoom.height).toBeCloseTo(95);
    expect(spin.rotation).toBeCloseTo(2);
  });

  it("applies multiple animations in sequence on one layer", () => {
    const layer = makeTextLayer({
      x: 100,
      y: 200,
      opacity: 0.8,
      animations: [
        {
          type: "fade",
          startMs: 0,
          durationMs: 1000,
          easing: "linear",
          loop: false,
          direction: "none",
          distance: 0,
        },
        {
          type: "slide",
          startMs: 0,
          durationMs: 1000,
          easing: "linear",
          loop: false,
          direction: "left",
          distance: 100,
        },
      ],
    });

    const animated = applyLayerAnimation(layer, 500);

    expect(animated.opacity).toBeCloseTo(0.4);
    expect(animated.x).toBe(50);
    expect(animated.y).toBe(200);
  });
});
