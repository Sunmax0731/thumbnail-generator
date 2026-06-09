import type { ExportFormat, OutputPreset, OutputSettings } from "./types";

export const outputPresets: OutputPreset[] = [
  { id: "youtube-720", label: "YouTube 16:9 1280x720", width: 1280, height: 720 },
  { id: "full-hd", label: "Full HD 16:9 1920x1080", width: 1920, height: 1080 },
  { id: "twitch-720", label: "Twitch 16:9 1280x720", width: 1280, height: 720 },
  { id: "square", label: "Square 1080x1080", width: 1080, height: 1080 },
  { id: "portrait", label: "Shorts 1080x1920", width: 1080, height: 1920 },
  { id: "custom", label: "Custom", width: 1280, height: 720 },
];

export const defaultOutputSettings: OutputSettings = {
  presetId: "youtube-720",
  width: 1280,
  height: 720,
  format: "png",
  quality: 1,
  background: "#111827",
};

export function resolvePreset(id: string): OutputPreset {
  return outputPresets.find((preset) => preset.id === id) ?? outputPresets[0];
}

export function applyPreset(settings: OutputSettings, presetId: string): OutputSettings {
  const preset = resolvePreset(presetId);
  if (preset.id === "custom") {
    return { ...settings, presetId };
  }

  return {
    ...settings,
    presetId,
    width: preset.width,
    height: preset.height,
  };
}

export function mimeForFormat(format: ExportFormat): string {
  if (format === "jpeg") return "image/jpeg";
  if (format === "webp") return "image/webp";
  return "image/png";
}

export function extensionForFormat(format: ExportFormat): string {
  return format === "jpeg" ? "jpg" : format;
}
