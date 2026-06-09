import { describe, expect, it } from "vitest";
import { parseHtmlLayout } from "./htmlLayout";

describe("parseHtmlLayout", () => {
  it("reads data-layer elements", () => {
    const result = parseHtmlLayout(
      `<section>
        <img data-layer="image" data-name="BG" data-image="sample-bg" data-width="1280" data-height="720" data-effect="blur=2" />
        <div data-layer="text" data-name="Title" data-x="80" data-y="90" data-font-size="96" data-color="#fff">LIVE</div>
        <div data-layer="shape" data-name="Accent" data-shape="ellipse" data-fill="#10b6d7"></div>
      </section>`,
      { baseWidth: 1280, baseHeight: 720, existingImageKeys: ["sample-bg"] },
    );

    expect(result.warnings).toEqual([]);
    expect(result.layers).toHaveLength(3);
    expect(result.layers[0]).toMatchObject({ type: "image", imageKey: "sample-bg" });
    expect(result.layers[1]).toMatchObject({ type: "text", text: "LIVE", fontSize: 96 });
    expect(result.layers[2]).toMatchObject({ type: "shape", shape: "ellipse" });
  });

  it("reads advanced layer and text attributes", () => {
    const result = parseHtmlLayout(
      `<section>
        <div data-layer="text" data-group-id="g1" data-group-name="Brand" data-layer-blur="2" data-edge-blur="-3" data-edge-blur-stroke="true" data-writing-mode="vertical" data-letter-spacing="5" data-fill-opacity="0.7" data-stroke-opacity="0.4" data-animation-type="fade" data-animation-duration-ms="900" data-animation-loop="true">TIGHT</div>
        <div data-layer="shape" data-shape="line" data-line-style="dotted" data-corner-radius="18" data-stroke-width="9"></div>
      </section>`,
      { baseWidth: 1280, baseHeight: 720 },
    );

    expect(result.layers[0]).toMatchObject({
      type: "text",
      groupId: "g1",
      groupName: "Brand",
      layerBlur: 2,
      edgeBlur: -3,
      edgeBlurStroke: true,
      writingMode: "vertical",
      letterSpacing: 5,
      fillOpacity: 0.7,
      strokeOpacity: 0.4,
      animation: {
        type: "fade",
        durationMs: 900,
        loop: true,
      },
    });
    expect(result.layers[1]).toMatchObject({ type: "shape", shape: "line", lineStyle: "dotted", cornerRadius: 18 });
  });
});
