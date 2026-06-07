import { Download, ExternalLink, FileDown, ImageDown, Monitor, SquareStack } from "lucide-react";
import { languageOptions, type Language, type Translator } from "../lib/i18n";
import { outputPresets } from "../lib/presets";
import type { ExportFormat, OutputSettings } from "../lib/types";

interface TopToolbarProps {
  settings: OutputSettings;
  language: Language;
  isExporting: boolean;
  onSettingsChange: (next: Partial<OutputSettings>) => void;
  onPresetChange: (presetId: string) => void;
  onLanguageChange: (language: Language) => void;
  onExport: (format?: ExportFormat) => void;
  t: Translator;
}

export function TopToolbar({
  settings,
  language,
  isExporting,
  onSettingsChange,
  onPresetChange,
  onLanguageChange,
  onExport,
  t,
}: TopToolbarProps) {
  return (
    <header className="top-toolbar">
      <div className="brand-block" aria-label="App name">
        <div className="brand-mark">
          <SquareStack size={19} strokeWidth={2.4} />
        </div>
        <div>
          <h1>{t("app.title")}</h1>
          <p>{t("app.subtitle")}</p>
          <a className="brand-issue-link" href="https://github.com/Sunmax0731/thumbnail-generator/issues" target="_blank" rel="noreferrer">
            <ExternalLink size={12} /> {t("app.reportIssue")}
          </a>
        </div>
      </div>

      <div className="toolbar-controls" aria-label={t("toolbar.outputSettings")}>
        <label className="field language-field">
          <span>{t("language.label")}</span>
          <select value={language} onChange={(event) => onLanguageChange(event.target.value as Language)}>
            {languageOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {t(option.labelKey)}
              </option>
            ))}
          </select>
        </label>
        <label className="field compact-field">
          <span>
            <Monitor size={14} /> {t("toolbar.preset")}
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
          <span>{t("toolbar.width")}</span>
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
          <span>{t("toolbar.height")}</span>
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
          <span>{t("toolbar.format")}</span>
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
          <span>{t("toolbar.quality")}</span>
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

      <div className="export-actions" aria-label={t("toolbar.exportActions")}>
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
          <Download size={17} /> {t("toolbar.export")}
        </button>
      </div>
    </header>
  );
}
