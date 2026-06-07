import { describe, expect, it } from "vitest";
import { contrastRatio, evaluateThumbnailWarnings, estimateProjectStorageBytes } from "./qualityChecks";
import { makeImageLayer, makeTextLayer } from "./layerFactory";
import { defaultOutputSettings } from "./presets";

describe("qualityChecks", () => {
  it("flags long text, low contrast, and safe-area risks", () => {
    const warnings = evaluateThumbnailWarnings({
      layers: [
        makeTextLayer({
          name: "Headline",
          x: 0,
          y: 0,
          width: 400,
          height: 120,
          text: "THIS IS A VERY LONG STREAM TITLE THAT WILL BE HARD TO READ ON MOBILE",
          color: "#111111",
          strokeWidth: 0,
        }),
      ],
      assets: [],
      settings: { ...defaultOutputSettings, background: "#111111" },
    });

    expect(warnings.map((warning) => warning.code)).toEqual(expect.arrayContaining(["text-length", "low-contrast", "safe-area"]));
  });

  it("flags large exports, many layers, large storage, and large assets", () => {
    const warnings = evaluateThumbnailWarnings({
      layers: Array.from({ length: 28 }, (_, index) => makeImageLayer({ id: `layer-${index}`, imageKey: "big" })),
      assets: [{ key: "big", name: "Big", src: "x".repeat(2_300_000), width: 4096, height: 2160 }],
      settings: { ...defaultOutputSettings, width: 3840, height: 2160 },
      estimatedStorageBytes: 4_600_000,
    });

    expect(warnings.map((warning) => warning.code)).toEqual(
      expect.arrayContaining(["many-layers", "large-export", "storage-size", "large-asset"]),
    );
  });

  it("estimates JSON storage size and contrast ratio", () => {
    expect(estimateProjectStorageBytes({ value: "abc" })).toBeGreaterThan(0);
    expect(contrastRatio("#ffffff", "#000000")).toBeGreaterThan(20);
  });
});
