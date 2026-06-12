import { describe, expect, it } from "vitest";
import { createTemplateSnapshot, sanitizeTemplateName, sanitizeTemplateTags, upsertTemplate } from "./templates";
import { defaultOutputSettings } from "./presets";
import { makeTextLayer } from "./layerFactory";

describe("templates", () => {
  it("sanitizes names", () => {
    expect(sanitizeTemplateName("  Stream   opener  ")).toBe("Stream opener");
    expect(sanitizeTemplateName("")).toBe("Untitled template");
  });

  it("creates a snapshot with generated CSV and HTML", () => {
    const template = createTemplateSnapshot(
      "My template",
      [makeTextLayer({ text: "TITLE" })],
      [],
      defaultOutputSettings,
      new Date("2026-06-06T00:00:00Z"),
    );

    expect(template.name).toBe("My template");
    expect(template.csv).toContain("TITLE");
    expect(template.html).toContain("TITLE");
  });

  it("stores sanitized browser template tags", () => {
    const template = createTemplateSnapshot(
      "Tagged template",
      [makeTextLayer({ text: "TITLE" })],
      [],
      defaultOutputSettings,
      new Date("2026-06-06T00:00:00Z"),
      ["  stream   ", "Stream", "weekly"],
    );

    expect(template.tags).toEqual(["stream", "weekly"]);
    expect(sanitizeTemplateTags(["", " Shorts ", "shorts"])).toEqual(["Shorts"]);
  });

  it("keeps multiple templates even when names match", () => {
    const older = createTemplateSnapshot("A", [makeTextLayer({ text: "OLD" })], [], defaultOutputSettings);
    const newer = createTemplateSnapshot("A", [makeTextLayer({ text: "NEW" })], [], defaultOutputSettings);
    const templates = upsertTemplate([older], newer);

    expect(templates).toHaveLength(2);
    expect(templates[0].id).toBe(newer.id);
    expect(templates[0].csv).toContain("NEW");
  });
});
