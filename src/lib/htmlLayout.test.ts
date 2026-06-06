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
});

