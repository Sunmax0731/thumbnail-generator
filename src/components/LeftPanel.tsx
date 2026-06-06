import { useState } from "react";
import { Code2, FileText, FolderOpen, ImagePlus, LayoutTemplate, RefreshCw, Save, Scissors, Shapes, Trash2, Type } from "lucide-react";
import type { SavedTemplate } from "../lib/templates";
import type { ImageAsset } from "../lib/types";

type LeftPanelSection = "assets" | "layouts" | "templates";

interface LeftPanelProps {
  csvText: string;
  htmlText: string;
  assets: ImageAsset[];
  templateName: string;
  templates: SavedTemplate[];
  onCsvTextChange: (value: string) => void;
  onHtmlTextChange: (value: string) => void;
  onApplyCsv: () => void;
  onApplyHtml: () => void;
  onImageFiles: (files: FileList | null) => void;
  onAddText: () => void;
  onAddShape: () => void;
  onResetTemplate: () => void;
  onTemplateNameChange: (value: string) => void;
  onSyncLayoutText: () => void;
  onSaveTemplate: () => void;
  onLoadTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
  onOpenImageLab: () => void;
}

export function LeftPanel({
  csvText,
  htmlText,
  assets,
  templateName,
  templates,
  onCsvTextChange,
  onHtmlTextChange,
  onApplyCsv,
  onApplyHtml,
  onImageFiles,
  onAddText,
  onAddShape,
  onResetTemplate,
  onTemplateNameChange,
  onSyncLayoutText,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  onOpenImageLab,
}: LeftPanelProps) {
  const [activeSection, setActiveSection] = useState<LeftPanelSection>("assets");

  return (
    <aside className="side-panel left-panel" aria-label="Imports and layout sources">
      <div className="panel-tabs source-tabs" role="tablist" aria-label="Source sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "assets"}
          className={activeSection === "assets" ? "selected" : ""}
          onClick={() => setActiveSection("assets")}
        >
          <ImagePlus size={15} /> Assets
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "layouts"}
          className={activeSection === "layouts" ? "selected" : ""}
          onClick={() => setActiveSection("layouts")}
        >
          <Code2 size={15} /> Layouts
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "templates"}
          className={activeSection === "templates" ? "selected" : ""}
          onClick={() => setActiveSection("templates")}
        >
          <Save size={15} /> Templates
        </button>
      </div>

      {activeSection === "assets" ? (
        <>
          <section className="panel-section">
            <div className="section-heading">
              <ImagePlus size={16} />
              <h2>Images</h2>
              <span className="section-count">{assets.length}</span>
            </div>
            <label className="file-drop">
              <ImagePlus size={19} />
              <span>Import image files</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => onImageFiles(event.currentTarget.files)}
              />
            </label>
            <button type="button" className="secondary-button icon-text wide-button" onClick={onOpenImageLab}>
              <Scissors size={16} /> Open Image Lab
            </button>
            <div className="asset-list" aria-label="Imported assets">
              {assets.map((asset) => (
                <div className="asset-row" key={asset.key}>
                  <img src={asset.src} alt="" />
                  <span>{asset.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>Quick layers</h2>
            </div>
            <div className="button-grid">
              <button type="button" className="secondary-button icon-text" onClick={onAddText}>
                <Type size={16} /> Text
              </button>
              <button type="button" className="secondary-button icon-text" onClick={onAddShape}>
                <Shapes size={16} /> Shape
              </button>
            </div>
            <button type="button" className="ghost-button wide-button" onClick={onResetTemplate}>
              Restore sample template
            </button>
          </section>
        </>
      ) : null}

      {activeSection === "layouts" ? (
        <>
          <section className="panel-section">
            <div className="section-heading">
              <RefreshCw size={16} />
              <h2>Generated layout</h2>
            </div>
            <button type="button" className="secondary-button icon-text wide-button" onClick={onSyncLayoutText}>
              <RefreshCw size={16} /> Generate current CSV / HTML
            </button>
          </section>

          <section className="panel-section grow-section">
            <div className="section-heading">
              <FileText size={16} />
              <h2>CSV layout</h2>
            </div>
            <textarea
              className="layout-textarea"
              spellCheck={false}
              value={csvText}
              onChange={(event) => onCsvTextChange(event.target.value)}
              aria-label="CSV layout editor"
            />
            <button type="button" className="secondary-button icon-text wide-button" onClick={onApplyCsv}>
              <FileText size={16} /> Apply CSV
            </button>
          </section>

          <section className="panel-section grow-section">
            <div className="section-heading">
              <Code2 size={16} />
              <h2>HTML layout</h2>
            </div>
            <textarea
              className="layout-textarea"
              spellCheck={false}
              value={htmlText}
              onChange={(event) => onHtmlTextChange(event.target.value)}
              aria-label="HTML layout editor"
            />
            <button type="button" className="secondary-button icon-text wide-button" onClick={onApplyHtml}>
              <Code2 size={16} /> Apply HTML
            </button>
          </section>
        </>
      ) : null}

      {activeSection === "templates" ? (
        <section className="panel-section template-section">
          <div className="section-heading">
            <Save size={16} />
            <h2>Browser templates</h2>
            <span className="section-count">{templates.length}</span>
          </div>
          <label className="field">
            <span>Template name</span>
            <input
              type="text"
              value={templateName}
              onChange={(event) => onTemplateNameChange(event.currentTarget.value)}
            />
          </label>
          <button type="button" className="primary-button icon-text wide-button" onClick={onSaveTemplate}>
            <Save size={16} /> Save template
          </button>
          <div className="template-list" aria-label="Saved templates">
            {templates.length === 0 ? (
              <p className="empty-note">No saved templates yet.</p>
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
                    title={`Delete ${template.name}`}
                    onClick={() => onDeleteTemplate(template.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      ) : null}
    </aside>
  );
}
