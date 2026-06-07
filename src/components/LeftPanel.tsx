import { useState } from "react";
import {
  Code2,
  FileText,
  FolderOpen,
  GripHorizontal,
  ImagePlus,
  LayoutTemplate,
  RefreshCw,
  Save,
  Scissors,
  Shapes,
  Trash2,
  Type,
} from "lucide-react";
import type { DefaultTemplateDefinition } from "../lib/defaultTemplates";
import type { Translator } from "../lib/i18n";
import type { SavedTemplate } from "../lib/templates";
import type { ImageAsset } from "../lib/types";

type LeftPanelSection = "assets" | "layouts" | "templates";
export type QuickLayerKind = "headline" | "subtitle" | "badge" | "divider";

interface LeftPanelProps {
  csvText: string;
  htmlText: string;
  assets: ImageAsset[];
  selectedAssetKey: string;
  templateName: string;
  templates: SavedTemplate[];
  defaultTemplates: DefaultTemplateDefinition[];
  autoSaveEnabled: boolean;
  savedEditStateUpdatedAt: string | null;
  onCsvTextChange: (value: string) => void;
  onHtmlTextChange: (value: string) => void;
  onApplyCsv: () => void;
  onApplyHtml: () => void;
  onImageFiles: (files: FileList | null) => void;
  onSelectAsset: (key: string) => void;
  onAddImageAssetLayer: (key: string) => void;
  onAddText: () => void;
  onAddShape: () => void;
  onAddLineLayer: () => void;
  onAddQuickLayer: (kind: QuickLayerKind) => void;
  onResetTemplate: () => void;
  onLoadDefaultTemplate: (id: string) => void;
  onTemplateNameChange: (value: string) => void;
  onSyncLayoutText: () => void;
  onSaveTemplate: () => void;
  onLoadTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
  onAutoSaveChange: (enabled: boolean) => void;
  onSaveEditState: () => void;
  onRestoreEditState: () => void;
  onOpenImageLab: (assetKey?: string) => void;
  t: Translator;
}

export function LeftPanel({
  csvText,
  htmlText,
  assets,
  selectedAssetKey,
  templateName,
  templates,
  defaultTemplates,
  autoSaveEnabled,
  savedEditStateUpdatedAt,
  onCsvTextChange,
  onHtmlTextChange,
  onApplyCsv,
  onApplyHtml,
  onImageFiles,
  onSelectAsset,
  onAddImageAssetLayer,
  onAddText,
  onAddShape,
  onAddLineLayer,
  onAddQuickLayer,
  onResetTemplate,
  onLoadDefaultTemplate,
  onTemplateNameChange,
  onSyncLayoutText,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  onAutoSaveChange,
  onSaveEditState,
  onRestoreEditState,
  onOpenImageLab,
  t,
}: LeftPanelProps) {
  const [activeSection, setActiveSection] = useState<LeftPanelSection>("assets");

  return (
    <aside className="side-panel left-panel" aria-label={t("left.aria")}>
      <div className="panel-tabs source-tabs" role="tablist" aria-label={t("left.tabs")}>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "assets"}
          className={activeSection === "assets" ? "selected" : ""}
          onClick={() => setActiveSection("assets")}
        >
          <ImagePlus size={15} /> {t("left.assets")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "layouts"}
          className={activeSection === "layouts" ? "selected" : ""}
          onClick={() => setActiveSection("layouts")}
        >
          <Code2 size={15} /> {t("left.layouts")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "templates"}
          className={activeSection === "templates" ? "selected" : ""}
          onClick={() => setActiveSection("templates")}
        >
          <Save size={15} /> {t("left.templates")}
        </button>
      </div>

      {activeSection === "assets" ? (
        <>
          <section className="panel-section">
            <div className="section-heading">
              <ImagePlus size={16} />
              <h2>{t("left.images")}</h2>
              <span className="section-count">{assets.length}</span>
            </div>
            <label className="file-drop">
              <ImagePlus size={19} />
              <span>{t("left.importImages")}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => onImageFiles(event.currentTarget.files)}
              />
            </label>
            <button type="button" className="secondary-button icon-text wide-button" onClick={() => onOpenImageLab(selectedAssetKey)}>
              <Scissors size={16} /> {t("left.openImageLab")}
            </button>
            <div className="asset-list" aria-label={t("left.assetsList")}>
              {assets.map((asset) => (
                <div className={`asset-row ${asset.key === selectedAssetKey ? "selected" : ""}`} key={asset.key}>
                  <button type="button" className="asset-select" onClick={() => onSelectAsset(asset.key)}>
                    <img src={asset.src} alt="" />
                    <span>{asset.name}</span>
                  </button>
                  <button
                    type="button"
                    className="mini-icon-button"
                    title={t("left.addAssetLayer")}
                    onClick={() => onAddImageAssetLayer(asset.key)}
                  >
                    <ImagePlus size={14} />
                  </button>
                  <button
                    type="button"
                    className="mini-icon-button"
                    title={t("left.openAssetInImageLab")}
                    onClick={() => {
                      onSelectAsset(asset.key);
                      onOpenImageLab(asset.key);
                    }}
                  >
                    <Scissors size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="panel-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("left.quickLayers")}</h2>
            </div>
            <div className="button-grid">
              <button type="button" className="secondary-button icon-text" onClick={onAddText}>
                <Type size={16} /> {t("left.text")}
              </button>
              <button type="button" className="secondary-button icon-text" onClick={onAddShape}>
                <Shapes size={16} /> {t("left.shape")}
              </button>
              <button type="button" className="secondary-button icon-text" onClick={onAddLineLayer}>
                <GripHorizontal size={16} /> {t("left.line")}
              </button>
              <button type="button" className="secondary-button icon-text" onClick={() => onAddQuickLayer("headline")}>
                <Type size={16} /> {t("left.headline")}
              </button>
              <button type="button" className="secondary-button icon-text" onClick={() => onAddQuickLayer("subtitle")}>
                <Type size={16} /> {t("left.subtitle")}
              </button>
              <button type="button" className="secondary-button icon-text" onClick={() => onAddQuickLayer("badge")}>
                <Shapes size={16} /> {t("left.badge")}
              </button>
              <button type="button" className="secondary-button icon-text" onClick={() => onAddQuickLayer("divider")}>
                <Shapes size={16} /> {t("left.divider")}
              </button>
            </div>
            <button type="button" className="ghost-button wide-button" onClick={onResetTemplate}>
              {t("left.restoreSample")}
            </button>
          </section>
        </>
      ) : null}

      {activeSection === "layouts" ? (
        <>
          <section className="panel-section">
            <div className="section-heading">
              <RefreshCw size={16} />
              <h2>{t("left.generatedLayout")}</h2>
            </div>
            <button type="button" className="secondary-button icon-text wide-button" onClick={onSyncLayoutText}>
              <RefreshCw size={16} /> {t("left.generateLayout")}
            </button>
          </section>

          <section className="panel-section grow-section">
            <div className="section-heading">
              <FileText size={16} />
              <h2>{t("left.csvLayout")}</h2>
            </div>
            <textarea
              className="layout-textarea"
              spellCheck={false}
              value={csvText}
              onChange={(event) => onCsvTextChange(event.target.value)}
              aria-label={t("left.csvEditor")}
            />
            <button type="button" className="secondary-button icon-text wide-button" onClick={onApplyCsv}>
              <FileText size={16} /> {t("left.applyCsv")}
            </button>
          </section>

          <section className="panel-section grow-section">
            <div className="section-heading">
              <Code2 size={16} />
              <h2>{t("left.htmlLayout")}</h2>
            </div>
            <textarea
              className="layout-textarea"
              spellCheck={false}
              value={htmlText}
              onChange={(event) => onHtmlTextChange(event.target.value)}
              aria-label={t("left.htmlEditor")}
            />
            <button type="button" className="secondary-button icon-text wide-button" onClick={onApplyHtml}>
              <Code2 size={16} /> {t("left.applyHtml")}
            </button>
          </section>
        </>
      ) : null}

      {activeSection === "templates" ? (
        <>
          <section className="panel-section edit-state-section">
            <div className="section-heading">
              <Save size={16} />
              <h2>{t("left.editState")}</h2>
            </div>
            <label className="checkbox-row autosave-row">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(event) => onAutoSaveChange(event.currentTarget.checked)}
              />
              <span>{t("left.autoSaveEditState")}</span>
            </label>
            <div className="button-grid">
              <button type="button" className="secondary-button icon-text" onClick={onSaveEditState}>
                <Save size={16} /> {t("left.saveEditState")}
              </button>
              <button type="button" className="secondary-button icon-text" onClick={onRestoreEditState}>
                <FolderOpen size={16} /> {t("left.restoreEditState")}
              </button>
            </div>
            <p className="edit-state-meta">
              {savedEditStateUpdatedAt
                ? t("left.savedEditStateAt", { time: formatSavedAt(savedEditStateUpdatedAt) })
                : t("left.noSavedEditState")}
            </p>
          </section>

          <section className="panel-section default-template-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("left.defaultTemplates")}</h2>
              <span className="section-count">{defaultTemplates.length}</span>
            </div>
            <div className="default-template-list" aria-label={t("left.defaultTemplates")}>
              {defaultTemplates.map((template) => (
                <button
                  type="button"
                  className="template-preset-row"
                  key={template.id}
                  onClick={() => onLoadDefaultTemplate(template.id)}
                >
                  <span>{template.name}</span>
                  <small>{template.description}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="panel-section template-section">
            <div className="section-heading">
              <Save size={16} />
              <h2>{t("left.browserTemplates")}</h2>
              <span className="section-count">{templates.length}</span>
            </div>
            <label className="field">
              <span>{t("left.templateName")}</span>
              <input
                type="text"
                value={templateName}
                onChange={(event) => onTemplateNameChange(event.currentTarget.value)}
              />
            </label>
            <button type="button" className="primary-button icon-text wide-button" onClick={onSaveTemplate}>
              <Save size={16} /> {t("left.saveTemplate")}
            </button>
            <div className="template-list" aria-label={t("left.savedTemplates")}>
              {templates.length === 0 ? (
                <p className="empty-note">{t("left.noTemplates")}</p>
              ) : (
                templates.map((template) => (
                  <div className="template-row" key={template.id}>
                    <button type="button" className="template-load" onClick={() => onLoadTemplate(template.id)}>
                      <FolderOpen size={15} />
                      <span>{template.name}</span>
                    </button>
                    <button
                      type="button"
                      className="icon-button danger"
                      title={t("left.deleteTemplate", { name: template.name })}
                      onClick={() => onDeleteTemplate(template.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      ) : null}
    </aside>
  );
}

function formatSavedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}
