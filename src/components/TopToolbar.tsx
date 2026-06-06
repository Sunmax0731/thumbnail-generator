import { Download, FileDown, ImageDown, Monitor, SquareStack } from "lucide-react";
import { outputPresets } from "../lib/presets";
import type { ExportFormat, OutputSettings } from "../lib/types";

interface TopToolbarProps {
  settings: OutputSettings;
  isExporting: boolean;
  onSettingsChange: (next: Partial<OutputSettings>) => void;
  onPresetChange: (presetId: string) => void;
  onExport: (format?: ExportFormat) => void;
}

export function TopToolbar({
  settings,
  isExporting,
  onSettingsChange,
  onPresetChange,
  onExport,
}: TopToolbarProps) {
  return (
    <header className="top-toolbar">
      <div className="brand-block" aria-label="App name">
        <div className="brand-mark">
          <SquareStack size={19} strokeWidth={2.4} />
        </div>
        <div>
          <h1>Thumbnail Generator</h1>
          <p>CSV / HTML layout canvas</p>
        </div>
      </div>

      <div className="toolbar-controls" aria-label="Output settings">
        <label className="field compact-field">
          <span>
            <Monitor size={14} /> Preset
          </span>
          <select value={settings.presetId} onChange={(event) => onPresetChange(event.target.value)}>
            {outputPresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field size-field">
          <span>W</span>
          <input
            type="number"
            min={320}
            max={4096}
            step={16}
            value={settings.width}
            onChange={(event) =>
              onSettingsChange({ presetId: "custom", width: Number.parseInt(event.target.value, 10) || 1280 })
            }
          />
          <input
            type="range"
            min={320}
            max={4096}
            step={16}
            value={settings.width}
            onChange={(event) =>
              onSettingsChange({ presetId: "custom", width: Number.parseInt(event.target.value, 10) || 1280 })
            }
          />
        </label>
        <label className="field size-field">
          <span>H</span>
          <input
            type="number"
            min={320}
            max={4096}
            step={16}
            value={settings.height}
            onChange={(event) =>
              onSettingsChange({ presetId: "custom", height: Number.parseInt(event.target.value, 10) || 720 })
            }
          />
          <input
            type="range"
            min={320}
            max={4096}
            step={16}
            value={settings.height}
            onChange={(event) =>
              onSettingsChange({ presetId: "custom", height: Number.parseInt(event.target.value, 10) || 720 })
            }
          />
        </label>
        <label className="field format-field">
          <span>Format</span>
          <select
            value={settings.format}
            onChange={(event) => onSettingsChange({ format: event.target.value as ExportFormat })}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>
        </label>
        <label className="field quality-field">
          <span>Quality</span>
          <input
            type="range"
            min={0.5}
            max={1}
            step={0.01}
            value={settings.quality}
            onChange={(event) => onSettingsChange({ quality: Number.parseFloat(event.target.value) })}
          />
        </label>
      </div>

      <div className="export-actions" aria-label="Export actions">
        <button className="secondary-button icon-text" type="button" onClick={() => onExport("png")} disabled={isExporting}>
          <ImageDown size={16} /> PNG
        </button>
        <button className="secondary-button icon-text" type="button" onClick={() => onExport("jpeg")} disabled={isExporting}>
          <FileDown size={16} /> JPG
        </button>
        <button className="secondary-button icon-text" type="button" onClick={() => onExport("webp")} disabled={isExporting}>
          <FileDown size={16} /> WebP
        </button>
        <button className="primary-button icon-text" type="button" onClick={() => onExport()} disabled={isExporting}>
          <Download size={17} /> Export
        </button>
      </div>
    </header>
  );
}
