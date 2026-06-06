import { describe, expect, it } from "vitest";
import { applyPreset, defaultOutputSettings, extensionForFormat, mimeForFormat } from "./presets";

describe("output presets", () => {
  it("applies common preset dimensions", () => {
    expect(applyPreset(defaultOutputSettings, "full-hd")).toMatchObject({
      width: 1920,
      height: 1080,
      presetId: "full-hd",
    });
  });

  it("maps export formats", () => {
    expect(mimeForFormat("png")).toBe("image/png");
    expect(mimeForFormat("jpeg")).toBe("image/jpeg");
    expect(extensionForFormat("jpeg")).toBe("jpg");
  });
});

