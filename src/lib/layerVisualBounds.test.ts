import { describe, expect, it } from "vitest";
import { makeTextLayer } from "./layerFactory";
import { getLayerSelectionLocalBounds, getLayerVisualLocalBounds } from "./layerVisualBounds";

describe("layerVisualBounds", () => {
  it("keeps horizontal text selection on the configured layer box", () => {
    const layer = makeTextLayer({ width: 300, height: 120, writingMode: "horizontal" });

    expect(getLayerVisualLocalBounds(layer)).toEqual({
      left: -150,
      top: -60,
      right: 150,
      bottom: 60,
    });
  });

  it("keeps vertical text content dimensions available for render padding", () => {
    const layer = makeTextLayer({
      width: 300,
      height: 120,
      text: "ABCD\nEF",
      fontSize: 40,
      lineHeight: 1.2,
      letterSpacing: 8,
      strokeWidth: 6,
      writingMode: "vertical",
      align: "left",
    });

    expect(getLayerVisualLocalBounds(layer)).toEqual({
      left: -153,
      top: -99,
      right: -51,
      bottom: 99,
    });
  });

  it("uses the configured layer box as the vertical text editing bounds", () => {
    const layer = makeTextLayer({
      width: 300,
      height: 120,
      text: "ABCD\nEF",
      fontSize: 40,
      lineHeight: 1.2,
      letterSpacing: 8,
      strokeWidth: 6,
      writingMode: "vertical",
      align: "left",
    });

    expect(getLayerSelectionLocalBounds(layer)).toEqual({
      left: -150,
      top: -60,
      right: 150,
      bottom: 60,
    });
  });
});
