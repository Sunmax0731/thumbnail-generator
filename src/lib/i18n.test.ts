import { describe, expect, it } from "vitest";
import { createTranslator, detectInitialLanguage, normalizeLanguageTag } from "./i18n";

describe("i18n", () => {
  it("detects supported browser language tags", () => {
    expect(detectInitialLanguage(["ja-JP", "en-US"])).toBe("ja");
    expect(detectInitialLanguage(["en-GB", "ja-JP"])).toBe("en");
  });

  it("falls back to English for unsupported languages", () => {
    expect(normalizeLanguageTag("fr-FR")).toBeUndefined();
    expect(detectInitialLanguage(["fr-FR"])).toBe("en");
  });

  it("translates keys with simple interpolation", () => {
    const t = createTranslator("ja");
    expect(t("selection.multiple", { count: 3 })).toBe("3 件のオブジェクトを選択中");
  });
});
