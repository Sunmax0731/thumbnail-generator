import { ExternalLink, Monitor, SquareStack } from "lucide-react";
import { languageOptions, type Language, type Translator } from "../lib/i18n";
import { outputPresets } from "../lib/presets";
import type { OutputSettings } from "../lib/types";

interface TopToolbarProps {
  settings: OutputSettings;
  language: Language;
  onSettingsChange: (next: Partial<OutputSettings>) => void;
  onPresetChange: (presetId: string) => void;
  onLanguageChange: (language: Language) => void;
  t: Translator;
}

export function TopToolbar({
  settings,
  language,
  onSettingsChange,
  onPresetChange,
  onLanguageChange,
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
      </div>
    </header>
  );
}
