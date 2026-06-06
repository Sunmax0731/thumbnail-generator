import { makeImageLayer, makeShapeLayer, makeTextLayer } from "./layerFactory";
import type { ImageAsset, ThumbnailLayer } from "./types";

export const sampleCsv = `type,name,x,y,width,height,rotation,opacity,text,fontSize,fontFamily,fontWeight,color,strokeColor,strokeWidth,align,lineHeight,shape,fill,effect,image
image,Hero background,0,0,1280,720,0,1,,,,,,,,,,,,,contrast=112;brightness=96,sample-bg
shape,Coral title plate,64,514,840,92,-2,0.96,,,,,,,,,,rect,#ff3d5a,,
shape,Cyan slash,912,74,146,540,13,0.88,,,,,,,,,,rect,#10b6d7,,
text,Main title,78,82,760,230,-3,1,"LIVE TONIGHT",104,Impact,900,#ffffff,#101828,10,left,0.92,,,,
text,Subtitle,91,532,720,72,-2,1,"CSV + HTML THUMBNAILS",44,Arial Black,800,#fff4c7,#101828,5,left,1,,,,
text,Corner tag,890,568,280,96,8,1,"Twitch / NicoNico / YouTube",34,Arial,800,#111827,#ffffff,6,center,1.04,,,,`;

export const sampleHtml = `<section>
  <img data-layer="image" data-name="Hero background" data-image="sample-bg" data-x="0" data-y="0" data-width="1280" data-height="720" data-effect="contrast=112;brightness=96" />
  <div data-layer="shape" data-name="Coral title plate" data-shape="rect" data-x="64" data-y="514" data-width="840" data-height="92" data-rotation="-2" data-opacity="0.96" data-fill="#ff3d5a"></div>
  <div data-layer="shape" data-name="Cyan slash" data-shape="rect" data-x="912" data-y="74" data-width="146" data-height="540" data-rotation="13" data-opacity="0.88" data-fill="#10b6d7"></div>
  <div data-layer="text" data-name="Main title" data-x="78" data-y="82" data-width="760" data-height="230" data-rotation="-3" data-font-size="104" data-font-family="Impact" data-font-weight="900" data-color="#ffffff" data-stroke-color="#101828" data-stroke-width="10" data-line-height="0.92">LIVE TONIGHT</div>
  <div data-layer="text" data-name="Subtitle" data-x="91" data-y="532" data-width="720" data-height="72" data-rotation="-2" data-font-size="44" data-font-family="Arial Black" data-font-weight="800" data-color="#fff4c7" data-stroke-color="#101828" data-stroke-width="5">CSV + HTML THUMBNAILS</div>
</section>`;

export function initialAssets(baseUrl: string): ImageAsset[] {
  return [
    {
      key: "sample-bg",
      name: "sample-bg",
      src: `${baseUrl}assets/sample-stream-bg.png`,
    },
  ];
}

export function createInitialLayers(): ThumbnailLayer[] {
  return [
    makeImageLayer({
      name: "Hero background",
      x: 0,
      y: 0,
      width: 1280,
      height: 720,
      imageKey: "sample-bg",
      effects: { grayscale: 0, blur: 0, brightness: 96, contrast: 112, mosaic: 0 },
    }),
    makeShapeLayer({
      name: "Coral title plate",
      x: 64,
      y: 514,
      width: 840,
      height: 92,
      rotation: -2,
      opacity: 0.96,
      fill: "#ff3d5a",
      strokeWidth: 0,
    }),
    makeShapeLayer({
      name: "Cyan slash",
      x: 912,
      y: 74,
      width: 146,
      height: 540,
      rotation: 13,
      opacity: 0.88,
      fill: "#10b6d7",
      strokeWidth: 0,
    }),
    makeShapeLayer({
      name: "Yellow pointer",
      shape: "triangle",
      x: 1018,
      y: 472,
      width: 190,
      height: 136,
      rotation: -16,
      opacity: 0.92,
      fill: "#ffd166",
      strokeColor: "#111827",
      strokeWidth: 6,
    }),
    makeTextLayer({
      name: "Main title",
      x: 78,
      y: 82,
      width: 760,
      height: 230,
      rotation: -3,
      text: "LIVE TONIGHT",
      fontSize: 104,
      fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
      fontWeight: "900",
      color: "#ffffff",
      strokeColor: "#101828",
      strokeWidth: 10,
      lineHeight: 0.92,
    }),
    makeTextLayer({
      name: "Subtitle",
      x: 91,
      y: 532,
      width: 720,
      height: 72,
      rotation: -2,
      text: "CSV + HTML THUMBNAILS",
      fontSize: 44,
      fontFamily: "Arial Black, Arial, sans-serif",
      fontWeight: "800",
      color: "#fff4c7",
      strokeColor: "#101828",
      strokeWidth: 5,
    }),
    makeTextLayer({
      name: "Corner tag",
      x: 890,
      y: 568,
      width: 280,
      height: 96,
      rotation: 8,
      text: "Twitch / NicoNico / YouTube",
      fontSize: 34,
      fontFamily: "Arial, sans-serif",
      fontWeight: "800",
      color: "#111827",
      strokeColor: "#ffffff",
      strokeWidth: 6,
      align: "center",
      lineHeight: 1.04,
    }),
  ];
}

