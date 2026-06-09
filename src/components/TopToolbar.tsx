import { ExternalLink, Moon, SquareStack } from "lucide-react";
import { languageOptions, type Language, type Translator } from "../lib/i18n";
import type { ThemeMode } from "../lib/theme";

interface TopToolbarProps {
  language: Language;
  themeMode: ThemeMode;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: ThemeMode) => void;
  t: Translator;
}

export function TopToolbar({
  language,
  themeMode,
  onLanguageChange,
  onThemeChange,
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

      <div aria-hidden="true" />
      <div className="window-controls" aria-label={t("toolbar.windowSettings")}>
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
