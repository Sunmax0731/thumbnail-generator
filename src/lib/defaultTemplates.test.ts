import { describe, expect, it } from "vitest";
import { defaultTemplates } from "./defaultTemplates";
import { layersToCsv, layersToHtml } from "./layoutExport";

describe("defaultTemplates", () => {
  it("provides multiple use-case templates with renderable layers", () => {
    expect(defaultTemplates).toHaveLength(10);
    expect(new Set(defaultTemplates.map((template) => template.id)).size).toBe(defaultTemplates.length);

    for (const template of defaultTemplates) {
      const layers = template.createLayers();
      expect(template.name).not.toEqual("");
      expect(template.description).not.toEqual("");
      expect(["youtube", "shorts", "stream", "cutout"]).toContain(template.category);
      expect(template.previewColors).toHaveLength(3);
      expect(template.settings.width).toBeGreaterThan(0);
      expect(template.settings.height).toBeGreaterThan(0);
      expect(layers.length).toBeGreaterThan(0);
      expect(layers.every((layer) => layer.visible)).toBe(true);
      expect(layers.every((layer) => ["image", "text", "shape"].includes(layer.type))).toBe(true);
      expect(
        layers.every((layer) => layer.type !== "shape" || ["rect", "ellipse", "triangle", "line"].includes(layer.shape)),
      ).toBe(true);
      expect(layersToCsv(layers)).toContain("type,name,x,y");
      expect(layersToHtml(layers)).toContain('data-thumbnail-layout="thumbnail-generator"');
    }
  });

  it("includes distinct layout intents for default template selection", () => {
    expect(defaultTemplates.map((template) => template.id)).toEqual([
      "creator-live",
      "product-review",
      "tutorial-steps",
      "shorts-quote",
      "breaking-news",
      "versus-comparison",
      "gaming-highlight",
      "podcast-guest",
      "event-countdown",
      "minimal-launch",
    ]);
  });
});
