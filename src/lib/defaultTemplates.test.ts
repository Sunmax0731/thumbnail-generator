import { describe, expect, it } from "vitest";
import { defaultTemplates } from "./defaultTemplates";
import { layersToCsv, layersToHtml } from "./layoutExport";

describe("defaultTemplates", () => {
  it("provides multiple use-case templates with renderable layers", () => {
    expect(defaultTemplates).toHaveLength(38);
    expect(new Set(defaultTemplates.map((template) => template.id)).size).toBe(defaultTemplates.length);
    expect(countByCategory()).toEqual({
      cutout: 5,
      motion: 10,
      schedule: 8,
      shorts: 5,
      stream: 5,
      youtube: 5,
    });

    for (const template of defaultTemplates) {
      const layers = template.createLayers();
      expect(template.name).not.toEqual("");
      expect(template.description).not.toEqual("");
      expect(["youtube", "shorts", "stream", "cutout", "schedule", "motion"]).toContain(template.category);
      expect(template.previewColors).toHaveLength(3);
      expect(template.settings.width).toBeGreaterThan(0);
      expect(template.settings.height).toBeGreaterThan(0);
      expect(layers.length).toBeGreaterThan(0);
      expect(layers.every((layer) => layer.visible)).toBe(true);
      expect(layers.every((layer) => ["image", "text", "shape"].includes(layer.type))).toBe(true);
      expect(
        layers.every((layer) => layer.type !== "shape" || ["rect", "ellipse", "triangle", "diamond", "pentagon", "hexagon", "star", "line"].includes(layer.shape)),
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
      "before-after-reveal",
      "music-premiere",
      "vertical-tip",
      "reaction-clip",
      "daily-vlog",
      "fitness-challenge",
      "profile-cutout",
      "product-cutout",
      "food-cutout",
      "fashion-cutout",
      "motion-eyecatch-neon-pulse",
      "motion-eyecatch-pop-title",
      "motion-eyecatch-news-flash",
      "motion-eyecatch-countdown",
      "motion-eyecatch-product-reveal",
      "motion-waiting-stream-start",
      "motion-waiting-chat-lobby",
      "motion-waiting-countdown",
      "motion-waiting-calm-screen",
      "motion-waiting-game-room",
      "schedule-year-landscape",
      "schedule-year-portrait",
      "schedule-month-landscape",
      "schedule-month-portrait",
      "schedule-week-landscape",
      "schedule-week-portrait",
      "schedule-day-landscape",
      "schedule-day-portrait",
    ]);
  });

  it("adds eight editable schedule templates for year, month, week, and day in both orientations", () => {
    const scheduleTemplates = defaultTemplates.filter((template) => template.category === "schedule");
    expect(scheduleTemplates.map((template) => template.id)).toEqual([
      "schedule-year-landscape",
      "schedule-year-portrait",
      "schedule-month-landscape",
      "schedule-month-portrait",
      "schedule-week-landscape",
      "schedule-week-portrait",
      "schedule-day-landscape",
      "schedule-day-portrait",
    ]);
    expect(scheduleTemplates.filter((template) => template.settings.width === 1280 && template.settings.height === 720)).toHaveLength(4);
    expect(scheduleTemplates.filter((template) => template.settings.width === 1080 && template.settings.height === 1920)).toHaveLength(4);
    for (const template of scheduleTemplates) {
      expect(template.createLayers().every((layer) => layer.type === "text" || layer.type === "shape")).toBe(true);
    }
  });

  it("keeps weekly schedule templates Sunday-start", () => {
    const expectedDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    for (const templateId of ["schedule-week-landscape", "schedule-week-portrait"]) {
      const template = defaultTemplates.find((entry) => entry.id === templateId);
      expect(template).toBeDefined();
      const dayLabels = template
        ?.createLayers()
        .filter((layer) => layer.type === "text" && layer.name.startsWith("Week day ") && layer.name.endsWith(" label"))
        .map((layer) => (layer.type === "text" ? layer.text : ""));
      expect(dayLabels).toEqual(expectedDays);
    }
  });

  it("adds ten animated eyecatch and waiting templates", () => {
    const motionTemplates = defaultTemplates.filter((template) => template.category === "motion");
    expect(motionTemplates.map((template) => template.id)).toEqual([
      "motion-eyecatch-neon-pulse",
      "motion-eyecatch-pop-title",
      "motion-eyecatch-news-flash",
      "motion-eyecatch-countdown",
      "motion-eyecatch-product-reveal",
      "motion-waiting-stream-start",
      "motion-waiting-chat-lobby",
      "motion-waiting-countdown",
      "motion-waiting-calm-screen",
      "motion-waiting-game-room",
    ]);
    for (const template of motionTemplates) {
      expect(template.createLayers().some((layer) => layer.animation && layer.animation.type !== "none")).toBe(true);
    }
  });
});

function countByCategory() {
  return defaultTemplates.reduce<Record<string, number>>((counts, template) => {
    counts[template.category] = (counts[template.category] ?? 0) + 1;
    return counts;
  }, {});
}
