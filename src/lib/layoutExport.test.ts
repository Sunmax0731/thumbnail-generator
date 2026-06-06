import { describe, expect, it } from "vitest";
import { layersToCsv, layersToHtml } from "./layoutExport";
import { makeImageLayer, makeTextLayer } from "./layerFactory";

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
    const html = layersToHtml([makeTextLayer({ name: "Title", text: "LIVE <NOW>", fontSize: 80 })]);

    expect(html).toContain('data-layer="text"');
    expect(html).toContain("LIVE &lt;NOW&gt;");
  });
});

