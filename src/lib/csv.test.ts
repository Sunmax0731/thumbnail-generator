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

  it("reads layer effects, grouping, kerning, opacity, radius, animation, and line styles", () => {
    const result = parseCsvLayout(
      `type,name,x,y,width,height,groupId,groupName,layerBlur,edgeBlur,edgeBlurStroke,cornerRadius,shadowColor,shadowOpacity,shadowBlur,shadowDistance,shadowAngle,rotateX,rotateY,bevelSize,bevelOpacity,animationType,animationStartMs,animationDurationMs,animationEasing,animationLoop,animationDirection,animationDistance,text,letterSpacing,fillOpacity,strokeOpacity,writingMode,shape,lineStyle,strokeWidth
text,Title,0,0,400,120,g1,Brand,3,-4,true,0,#112233,0.6,12,18,45,12,-8,5,0.7,slide,200,1200,easeOut,true,up,90,HELLO,6,0.8,0.5,vertical,,,`,
      { baseWidth: 1280, baseHeight: 720 },
    );
    const shapeResult = parseCsvLayout(
      `type,name,x,y,width,height,groupId,groupName,layerBlur,edgeBlur,edgeBlurStroke,cornerRadius,shape,lineStyle,strokeWidth
shape,Wave,10,20,500,20,g1,Brand,2,6,false,14,line,wave,12`,
      { baseWidth: 1280, baseHeight: 720 },
    );

    expect(result.layers[0]).toMatchObject({
      type: "text",
      groupId: "g1",
      groupName: "Brand",
      layerBlur: 3,
      edgeBlur: -4,
      edgeBlurStroke: true,
      letterSpacing: 6,
      fillOpacity: 0.8,
      strokeOpacity: 0.5,
      writingMode: "vertical",
      animation: {
        type: "slide",
        startMs: 200,
        durationMs: 1200,
        easing: "easeOutQuad",
        loop: true,
        direction: "up",
        distance: 90,
      },
    });
    expect(shapeResult.layers[0]).toMatchObject({
      type: "shape",
      shape: "line",
      lineStyle: "wave",
      cornerRadius: 14,
      strokeWidth: 12,
    });
    expect(result.layers[0]).toMatchObject({
      shadowColor: "#112233",
      shadowOpacity: 0.6,
      shadowBlur: 12,
      shadowDistance: 18,
      shadowAngle: 45,
      rotateX: 12,
      rotateY: -8,
      bevelSize: 5,
      bevelOpacity: 0.7,
    });
  });

  it("accepts expanded shape kinds", () => {
    const result = parseCsvLayout(
      `type,name,shape
shape,Star,star
shape,Diamond,diamond
shape,Pentagon,pentagon
shape,Hexagon,hexagon`,
      { baseWidth: 1280, baseHeight: 720 },
    );

    expect(result.layers.map((layer) => (layer.type === "shape" ? layer.shape : ""))).toEqual(["star", "diamond", "pentagon", "hexagon"]);
  });
});
