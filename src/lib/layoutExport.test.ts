import { describe, expect, it } from "vitest";
import { layersToCsv, layersToHtml } from "./layoutExport";
import { makeImageLayer, makeShapeLayer, makeTextLayer } from "./layerFactory";

describe("layoutExport", () => {
  it("exports current layers to CSV", () => {
    const csv = layersToCsv([
      makeImageLayer({ name: "BG", imageKey: "sample-bg", effects: { grayscale: 0, blur: 2, brightness: 100, contrast: 110, mosaic: 0 } }),
      makeTextLayer({ name: "Title", text: 'Hello, "Creator"', fontSize: 80 }),
    ]);

    expect(csv).toContain("type,name,x,y,width");
    expect(csv).toContain("blur=2;contrast=110");
    expect(csv).toContain('"Hello, ""Creator"""');
  });

  it("exports current layers to HTML data-layer markup", () => {
    const html = layersToHtml([
      makeTextLayer({
        name: "Title",
        text: "LIVE <NOW>",
        fontSize: 80,
        groupId: "g1",
        groupName: "Brand",
        layerBlur: 2,
        edgeBlur: -6,
        edgeBlurStroke: true,
        letterSpacing: 5,
        fillOpacity: 0.8,
        writingMode: "vertical",
        animation: {
          type: "slide",
          startMs: 200,
          durationMs: 1200,
          easing: "easeOutQuad",
          loop: true,
          direction: "up",
          distance: 90,
        },
      }),
      makeShapeLayer({ name: "Rule", shape: "line", lineStyle: "wave", strokeWidth: 12, cornerRadius: 4 }),
    ]);

    expect(html).toContain('data-layer="text"');
    expect(html).toContain("LIVE &lt;NOW&gt;");
    expect(html).toContain('data-group-id="g1"');
    expect(html).toContain('data-edge-blur="-6"');
    expect(html).toContain('data-edge-blur-stroke="true"');
    expect(html).toContain('data-writing-mode="vertical"');
    expect(html).toContain('data-letter-spacing="5"');
    expect(html).toContain('data-animation-type="slide"');
    expect(html).toContain('data-animation-loop="true"');
    expect(html).toContain('data-line-style="wave"');
  });
});
