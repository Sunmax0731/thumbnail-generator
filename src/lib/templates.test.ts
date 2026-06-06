import { describe, expect, it } from "vitest";
import { createTemplateSnapshot, sanitizeTemplateName, upsertTemplate } from "./templates";
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

  it("replaces an existing template with the same name", () => {
    const older = createTemplateSnapshot("A", [makeTextLayer({ text: "OLD" })], [], defaultOutputSettings);
    const newer = createTemplateSnapshot("A", [makeTextLayer({ text: "NEW" })], [], defaultOutputSettings);
    const templates = upsertTemplate([older], newer);

    expect(templates).toHaveLength(1);
    expect(templates[0].id).toBe(older.id);
    expect(templates[0].csv).toContain("NEW");
  });
});

