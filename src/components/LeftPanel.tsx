import { Code2, FileText, FolderOpen, ImagePlus, LayoutTemplate, RefreshCw, Save, Shapes, Trash2, Type } from "lucide-react";
import type { SavedTemplate } from "../lib/templates";
import type { ImageAsset } from "../lib/types";

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
}: LeftPanelProps) {
  return (
    <aside className="side-panel left-panel" aria-label="Imports and layout sources">
      <section className="panel-section">
        <div className="section-heading">
          <ImagePlus size={16} />
          <h2>Images</h2>
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

      <section className="panel-section template-section">
        <div className="section-heading">
          <Save size={16} />
          <h2>Browser templates</h2>
        </div>
        <label className="field">
          <span>Template name</span>
          <input
            type="text"
            value={templateName}
            onChange={(event) => onTemplateNameChange(event.currentTarget.value)}
          />
        </label>
        <div className="button-grid">
          <button type="button" className="secondary-button icon-text" onClick={onSyncLayoutText}>
            <RefreshCw size={16} /> Generate
          </button>
          <button type="button" className="primary-button icon-text" onClick={onSaveTemplate}>
            <Save size={16} /> Save
          </button>
        </div>
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
    </aside>
  );
}
