import { describe, expect, it } from "vitest";
import { parseCsvLayout, parseCsvRows, parseEffects } from "./csv";

describe("parseCsvRows", () => {
  it("handles quoted commas and escaped quotes", () => {
    const rows = parseCsvRows('type,text\ntext,"Hello, ""Creator"""');
    expect(rows).toEqual([
      ["type", "text"],
      ["text", 'Hello, "Creator"'],
    ]);
  });
});

describe("parseEffects", () => {
  it("parses supported effects with clamping", () => {
    const effects = parseEffects("grayscale=2;blur=4;mosaic=12;brightness=90;contrast=120");
    expect(effects.grayscale).toBe(1);
    expect(effects.blur).toBe(4);
    expect(effects.mosaic).toBe(12);
    expect(effects.brightness).toBe(90);
    expect(effects.contrast).toBe(120);
  });
});

describe("parseCsvLayout", () => {
  it("creates text, image, and shape layers", () => {
    const result = parseCsvLayout(
      `type,name,x,y,width,height,text,fontSize,shape,fill,effect,image
image,BG,0,0,1280,720,,,,contrast=110,sample-bg
text,Title,40,60,500,120,"A, B",80,,,,
shape,Plate,10,500,600,80,,0,rect,#ff0000,,`,
      { baseWidth: 1280, baseHeight: 720, existingImageKeys: ["sample-bg"] },
    );

    expect(result.warnings).toEqual([]);
    expect(result.layers).toHaveLength(3);
    expect(result.layers[0].type).toBe("image");
    expect(result.layers[1]).toMatchObject({ type: "text", text: "A, B", fontSize: 80 });
    expect(result.layers[2]).toMatchObject({ type: "shape", fill: "#ff0000" });
  });
});

