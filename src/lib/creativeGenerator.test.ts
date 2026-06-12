import { describe, expect, it } from "vitest";
import { buildCreativeTemplate, createDefaultCreativeDraft } from "./creativeGenerator";
import { defaultOutputSettings } from "./presets";

describe("creativeGenerator", () => {
  it("builds animated YouTube waiting screen layers", () => {
    const result = buildCreativeTemplate(createDefaultCreativeDraft("youtube-waiting"), defaultOutputSettings);

    expect(result.name).toBe("YouTube Waiting Screen");
    expect(result.settings.width).toBe(1920);
    expect(result.settings.height).toBe(1080);
    expect(result.layers.some((layer) => layer.animations?.some((animation) => animation.loop))).toBe(true);
    expect(result.layers.some((layer) => layer.type === "text" && layer.text === "STARTING SOON")).toBe(true);
  });

  it("builds all video thumbnail variants with expected output sizes", () => {
    const standard = buildCreativeTemplate({ ...createDefaultCreativeDraft("video-thumbnail"), variant: "standard" }, defaultOutputSettings);
    const vertical = buildCreativeTemplate({ ...createDefaultCreativeDraft("video-thumbnail"), variant: "vertical" }, defaultOutputSettings);
    const cutout = buildCreativeTemplate({ ...createDefaultCreativeDraft("video-thumbnail"), variant: "cutout" }, defaultOutputSettings);

    expect(standard.settings).toMatchObject({ width: 1280, height: 720 });
    expect(vertical.settings).toMatchObject({ width: 1080, height: 1920 });
    expect(cutout.settings).toMatchObject({ width: 1280, height: 720 });
    expect(cutout.layers.some((layer) => layer.name === "Cutout source image")).toBe(true);
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
