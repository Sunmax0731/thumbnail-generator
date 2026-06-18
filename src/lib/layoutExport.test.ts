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
        shadowColor: "#112233",
        shadowOpacity: 0.6,
        shadowBlur: 12,
        shadowDistance: 18,
        shadowAngle: 45,
        rotateX: 12,
        rotateY: -8,
        bevelSize: -5,
        bevelOpacity: 0.7,
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
          textAnimation: "wave",
          effectAnimation: "glow",
          effectIntensity: 70,
        },
      }),
      makeShapeLayer({ name: "Rule", shape: "sector", lineStyle: "wave", strokeWidth: 12, cornerRadius: 4, sectorStartAngle: -45, sectorEndAngle: 135, sectorInnerRadius: 25 }),
    ]);

    expect(html).toContain('data-layer="text"');
    expect(html).toContain("LIVE &lt;NOW&gt;");
    expect(html).toContain('data-group-id="g1"');
    expect(html).toContain('data-edge-blur="-6"');
    expect(html).toContain('data-edge-blur-stroke="true"');
    expect(html).toContain('data-shadow-color="#112233"');
    expect(html).toContain('data-shadow-opacity="0.6"');
    expect(html).toContain('data-rotate-x="12"');
    expect(html).toContain('data-bevel-size="-5"');
    expect(html).toContain('data-writing-mode="vertical"');
    expect(html).toContain('data-letter-spacing="5"');
    expect(html).toContain('data-animation-type="slide"');
    expect(html).toContain('data-animation-loop="true"');
    expect(html).toContain('data-animation-text="wave"');
    expect(html).toContain('data-animation-effect="glow"');
    expect(html).toContain('data-animation-effect-intensity="70"');
    expect(html).toContain('data-line-style="wave"');
    expect(html).toContain('data-shape="sector"');
    expect(html).toContain('data-sector-start-angle="-45"');
    expect(html).toContain('data-sector-end-angle="135"');
    expect(html).toContain('data-sector-inner-radius="25"');
  });
});
