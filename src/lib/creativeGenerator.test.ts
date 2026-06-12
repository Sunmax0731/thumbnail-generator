import { describe, expect, it } from "vitest";
import { buildCreativeTemplate, createDefaultCreativeDraft } from "./creativeGenerator";
import { defaultOutputSettings } from "./presets";

describe("creativeGenerator", () => {
  it("builds animated stream waiting screen layers", () => {
    const result = buildCreativeTemplate(createDefaultCreativeDraft("stream-waiting"), defaultOutputSettings);

    expect(result.name).toBe("Stream Waiting Screen");
    expect(result.settings.width).toBe(1920);
    expect(result.settings.height).toBe(1080);
    expect(result.layers.some((layer) => layer.animations?.some((animation) => animation.loop))).toBe(true);
    expect(result.layers.some((layer) => layer.type === "text" && layer.text === "STREAM STARTS SOON")).toBe(true);
  });

  it("builds split thumbnail generators with expected output sizes and label typography", () => {
    const standard = buildCreativeTemplate({ ...createDefaultCreativeDraft("standard-thumbnail"), labelFontSize: 42 }, defaultOutputSettings);
    const horizontal = buildCreativeTemplate(createDefaultCreativeDraft("horizontal-thumbnail"), defaultOutputSettings);

    expect(standard.name).toBe("Standard Thumbnail");
    expect(standard.settings).toMatchObject({ width: 1280, height: 720 });
    expect(horizontal.name).toBe("Horizontal Thumbnail");
    expect(horizontal.settings).toMatchObject({ width: 1280, height: 720 });
    expect(horizontal.layers.some((layer) => layer.name === "Wide source image")).toBe(true);
    expect(standard.layers.some((layer) => layer.type === "text" && layer.name === "Label text" && layer.fontSize === 42)).toBe(true);
  });

  it("can generate ungrouped stream waiting layers", () => {
    const result = buildCreativeTemplate(
      { ...createDefaultCreativeDraft("stream-waiting"), groupLayers: false, animated: false },
      defaultOutputSettings,
    );

    expect(result.name).toBe("Stream Waiting Screen");
    expect(result.layers.every((layer) => !layer.groupId && !layer.groupName)).toBe(true);
    expect(result.layers.every((layer) => !layer.animations?.length)).toBe(true);
  });
});
