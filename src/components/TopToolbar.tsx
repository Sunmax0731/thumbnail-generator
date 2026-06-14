import { BookOpen, Download, ExternalLink, FolderOpen, Moon, Save, SquareStack, Tags, Trash2, Upload } from "lucide-react";
import { languageOptions, type Language, type Translator } from "../lib/i18n";
import type { ThemeMode } from "../lib/theme";

interface TopToolbarProps {
  language: Language;
  themeMode: ThemeMode;
  autoSaveEnabled: boolean;
  savedEditStateUpdatedAt: string | null;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: ThemeMode) => void;
  onAutoSaveChange: (enabled: boolean) => void;
  onSaveEditState: () => void;
  onRestoreEditState: () => void;
  onExportEditState: () => void;
  onImportEditState: (file: File | null) => void;
  onDeleteEditState: () => void;
  onOpenTagSettings: () => void;
  onOpenManual: () => void;
  t: Translator;
}

export function TopToolbar({
  language,
  themeMode,
  autoSaveEnabled,
  savedEditStateUpdatedAt,
  onLanguageChange,
  onThemeChange,
  onAutoSaveChange,
  onSaveEditState,
  onRestoreEditState,
  onExportEditState,
  onImportEditState,
  onDeleteEditState,
  onOpenTagSettings,
  onOpenManual,
  t,
}: TopToolbarProps) {
  const savedStateLabel = savedEditStateUpdatedAt
    ? t("left.savedEditStateAt", { time: formatSavedAt(savedEditStateUpdatedAt) })
    : t("left.noSavedEditState");
  return (
    <header className="top-toolbar">
      <div className="brand-block" aria-label="App name">
        <div className="brand-mark">
          <SquareStack size={19} strokeWidth={2.4} />
        </div>
        <div>
          <h1>{t("app.title")}</h1>
          <div className="brand-links">
            <a className="brand-issue-link" href="https://github.com/Sunmax0731/thumbnail-generator/issues" target="_blank" rel="noreferrer">
              <ExternalLink size={12} /> {t("app.reportIssue")}
            </a>
            <button type="button" className="brand-manual-button" onClick={onOpenManual}>
              <BookOpen size={12} /> {t("manual.open")}
            </button>
          </div>
        </div>
      </div>

      <div aria-hidden="true" />
      <div className="window-controls" aria-label={t("toolbar.windowSettings")}>
        <div className="top-edit-state-actions" aria-label={t("left.editState")}>
          <button type="button" className="icon-button" title={t("left.saveEditState")} onClick={onSaveEditState}>
            <Save size={16} />
          </button>
          <button type="button" className="icon-button" title={`${t("left.restoreEditState")} - ${savedStateLabel}`} onClick={onRestoreEditState}>
            <FolderOpen size={16} />
          </button>
          <button type="button" className="icon-button" title={t("left.exportState")} onClick={onExportEditState}>
            <Download size={16} />
          </button>
          <label className="icon-button file-action" title={t("left.importState")}>
            <Upload size={16} />
            <input type="file" accept="application/json,.json" onChange={(event) => onImportEditState(event.currentTarget.files?.[0] ?? null)} />
          </label>
          <button type="button" className="icon-button danger-icon" title={t("left.deleteEditState")} onClick={onDeleteEditState}>
            <Trash2 size={16} />
          </button>
          <label className="checkbox-row autosave-row top-autosave-row">
            <input
              type="checkbox"
              checked={autoSaveEnabled}
              onChange={(event) => onAutoSaveChange(event.currentTarget.checked)}
            />
            <span>{t("left.autoSaveEditState")}</span>
          </label>
        </div>
        <button type="button" className="icon-button" title={t("tags.open")} onClick={onOpenTagSettings}>
          <Tags size={16} />
        </button>
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
        <label className="field theme-field">
          <span>
            <Moon size={14} /> {t("theme.label")}
          </span>
          <select value={themeMode} onChange={(event) => onThemeChange(event.target.value as ThemeMode)}>
            <option value="system">{t("theme.system")}</option>
            <option value="light">{t("theme.light")}</option>
            <option value="dark">{t("theme.dark")}</option>
          </select>
        </label>
      </div>
    </header>
  );
}

function formatSavedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}
