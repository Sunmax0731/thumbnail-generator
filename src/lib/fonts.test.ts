import { describe, expect, it } from "vitest";
import indexHtml from "../../index.html?raw";
import { fontLabelFor, fontOptions, hostedGoogleFontFamilies } from "./fonts";

describe("font options", () => {
  it("keeps dropdown labels unique", () => {
    const labels = fontOptions.map((option) => option.label);

    expect(new Set(labels).size).toBe(labels.length);
  });

  it("exposes expanded hosted Google Fonts choices", () => {
    expect(fontOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Dela Gothic One (Google Fonts)" }),
        expect.objectContaining({ label: "M PLUS Rounded 1c 900 (Google Fonts)" }),
        expect.objectContaining({ label: "Mochiy Pop One (Google Fonts)" }),
        expect.objectContaining({ label: "Montserrat 900 (Google Fonts)" }),
        expect.objectContaining({ label: "Poppins 900 (Google Fonts)" }),
        expect.objectContaining({ label: "Rampart One (Google Fonts)" }),
        expect.objectContaining({ label: "Zen Kaku Gothic New 900 (Google Fonts)" }),
      ]),
    );
  });

  it("loads every hosted dropdown family from index.html", () => {
    for (const family of hostedGoogleFontFamilies) {
      expect(indexHtml).toContain(`family=${family.replaceAll(" ", "+")}`);
    }
  });

  it("labels unknown layer fonts as imported fonts", () => {
    expect(fontLabelFor("'CustomFont', sans-serif")).toBe("Imported font");
  });
});
