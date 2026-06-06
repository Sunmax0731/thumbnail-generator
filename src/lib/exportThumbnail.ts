import { extensionForFormat, mimeForFormat } from "./presets";
import { renderThumbnailToCanvas } from "./renderCanvas";
import type { ImageAsset, OutputSettings, ThumbnailLayer } from "./types";

export async function exportThumbnailDataUrl(
  layers: ThumbnailLayer[],
  assets: ImageAsset[],
  settings: OutputSettings,
): Promise<string> {
  await waitForDocumentFonts();
  const canvas = document.createElement("canvas");
  await renderThumbnailToCanvas(canvas, layers, assets, settings, { drawSelection: false });
  return canvas.toDataURL(mimeForFormat(settings.format), settings.quality);
}

export async function downloadThumbnail(
  layers: ThumbnailLayer[],
  assets: ImageAsset[],
  settings: OutputSettings,
): Promise<string> {
  const dataUrl = await exportThumbnailDataUrl(layers, assets, settings);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `thumbnail-${settings.width}x${settings.height}-${timestamp}.${extensionForFormat(settings.format)}`;
  link.href = dataUrl;
  link.download = filename;
  link.click();
  return filename;
}

async function waitForDocumentFonts(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;
  await document.fonts.ready;
}
