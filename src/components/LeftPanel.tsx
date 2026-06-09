import { useMemo, useState } from "react";
import {
  FolderOpen,
  GripHorizontal,
  ImagePlus,
  Layers,
  LayoutTemplate,
  Save,
  Scissors,
  Trash2,
} from "lucide-react";
import { LayerPanel, type LayerPanelProps } from "./LayerPanel";
import type { DefaultTemplateDefinition } from "../lib/defaultTemplates";
import type { Translator } from "../lib/i18n";
import type { SavedTemplate } from "../lib/templates";
import type { ImageAsset } from "../lib/types";

type LeftPanelSection = "templates" | "layers" | "assets";
type TemplateFilter = "all" | DefaultTemplateDefinition["category"];
export type QuickLayerKind = "headline" | "subtitle" | "badge" | "divider";

interface LeftPanelProps {
  assets: ImageAsset[];
  selectedAssetKey: string;
  layerPanelProps: Omit<LayerPanelProps, "t">;
  templateName: string;
  templates: SavedTemplate[];
  defaultTemplates: DefaultTemplateDefinition[];
  onImageFiles: (files: FileList | null) => void;
  onSelectAsset: (key: string) => void;
  onAddImageAssetLayer: (key: string) => void;
  onDeleteAsset: (key: string) => void;
  onLoadDefaultTemplate: (id: string) => void;
  onTemplateNameChange: (value: string) => void;
  onSaveTemplate: () => void;
  onLoadTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
  onOpenImageLab: (assetKey?: string) => void;
  t: Translator;
}

export function LeftPanel({
  assets,
  selectedAssetKey,
  layerPanelProps,
  templateName,
  templates,
  defaultTemplates,
  onImageFiles,
  onSelectAsset,
  onAddImageAssetLayer,
  onDeleteAsset,
  onLoadDefaultTemplate,
  onTemplateNameChange,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  onOpenImageLab,
  t,
}: LeftPanelProps) {
  const [activeSection, setActiveSection] = useState<LeftPanelSection>("templates");
  const [templateFilter, setTemplateFilter] = useState<TemplateFilter>("all");
  const [defaultTemplateListHeight, setDefaultTemplateListHeight] = useState(260);
  const [browserTemplateListHeight, setBrowserTemplateListHeight] = useState(220);
  const [templateApplyCandidate, setTemplateApplyCandidate] = useState<{ id: string; name: string; kind: "default" | "browser" } | null>(null);
  const filteredDefaultTemplates = useMemo(
    () =>
      templateFilter === "all"
        ? defaultTemplates
        : defaultTemplates.filter((template) => template.category === templateFilter),
    [defaultTemplates, templateFilter],
  );

  return (
    <aside className="side-panel left-panel" aria-label={t("left.aria")}>
      <div className="panel-tabs source-tabs" role="tablist" aria-label={t("left.tabs")}>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "templates"}
          className={activeSection === "templates" ? "selected" : ""}
          onClick={() => setActiveSection("templates")}
        >
          <Save size={15} /> {t("left.templates")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "layers"}
          className={activeSection === "layers" ? "selected" : ""}
          onClick={() => setActiveSection("layers")}
        >
          <Layers size={15} /> {t("inspector.layers")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "assets"}
          className={activeSection === "assets" ? "selected" : ""}
          onClick={() => setActiveSection("assets")}
        >
          <ImagePlus size={15} /> {t("left.assets")}
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
                onChange={(event) => {
                  onImageFiles(event.currentTarget.files);
                  event.currentTarget.value = "";
                }}
              />
            </label>
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
                  <button
                    type="button"
                    className="mini-icon-button danger"
                    title={t("left.deleteAsset", { name: asset.name })}
                    onClick={() => onDeleteAsset(asset.key)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {activeSection === "layers" ? <LayerPanel {...layerPanelProps} t={t} /> : null}

      {activeSection === "templates" ? (
        <>
          <section className="panel-section default-template-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("left.defaultTemplates")}</h2>
              <span className="section-count">{filteredDefaultTemplates.length}</span>
            </div>
            <div className="template-filter-tabs" role="tablist" aria-label={t("left.templateFilters")}>
              {templateFilterOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={templateFilter === option.id ? "selected" : ""}
                  onClick={() => setTemplateFilter(option.id)}
                >
                  {t(option.labelKey)}
                </button>
              ))}
            </div>
            <div className="default-template-list" aria-label={t("left.defaultTemplates")} style={{ height: defaultTemplateListHeight }}>
              {filteredDefaultTemplates.map((template) => (
                <button
                  type="button"
                  className="template-preset-row"
                  key={template.id}
                  onClick={() => setTemplateApplyCandidate({ id: template.id, name: template.name, kind: "default" })}
                >
                  <span className="template-mini-preview" aria-hidden="true">
                    {template.previewColors.map((color) => (
                      <span key={color} style={{ background: color }} />
                    ))}
                  </span>
                  <span className="template-copy">
                    <strong>{template.name}</strong>
                    <small>{template.description}</small>
                  </span>
                  <em>{template.settings.width}x{template.settings.height}</em>
                </button>
              ))}
            </div>
            <TemplateResizeHandle
              label={t("left.resizeDefaultTemplates")}
              onResize={(delta) => setDefaultTemplateListHeight((height) => clampTemplateListHeight(height + delta))}
            />
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
            <div className="template-list" aria-label={t("left.savedTemplates")} style={{ height: browserTemplateListHeight }}>
              {templates.length === 0 ? (
                <p className="empty-note">{t("left.noTemplates")}</p>
              ) : (
                templates.map((template) => (
                  <div className="template-row" key={template.id}>
                    <button
                      type="button"
                      className="template-load"
                      onClick={() => setTemplateApplyCandidate({ id: template.id, name: template.name, kind: "browser" })}
                    >
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
            <TemplateResizeHandle
              label={t("left.resizeBrowserTemplates")}
              onResize={(delta) => setBrowserTemplateListHeight((height) => clampTemplateListHeight(height + delta))}
            />
          </section>

        </>
      ) : null}

      {templateApplyCandidate ? (
        <ApplyTemplateDialog
          name={templateApplyCandidate.name}
          onCancel={() => setTemplateApplyCandidate(null)}
          onConfirm={() => {
            if (templateApplyCandidate.kind === "default") onLoadDefaultTemplate(templateApplyCandidate.id);
            else onLoadTemplate(templateApplyCandidate.id);
            setTemplateApplyCandidate(null);
          }}
          t={t}
        />
      ) : null}
    </aside>
  );
}

const templateFilterOptions: { id: TemplateFilter; labelKey: Parameters<Translator>[0] }[] = [
  { id: "all", labelKey: "left.filter.all" },
  { id: "youtube", labelKey: "left.filter.youtube" },
  { id: "shorts", labelKey: "left.filter.shorts" },
  { id: "stream", labelKey: "left.filter.stream" },
  { id: "cutout", labelKey: "left.filter.cutout" },
  { id: "schedule", labelKey: "left.filter.schedule" },
  { id: "motion", labelKey: "left.filter.motion" },
];

function TemplateResizeHandle({ label, onResize }: { label: string; onResize: (deltaY: number) => void }) {
  return (
    <div
      className="panel-resize-handle"
      role="separator"
      aria-label={label}
      aria-orientation="horizontal"
      tabIndex={0}
      onPointerDown={(event) => {
        event.preventDefault();
        let lastY = event.clientY;
        const handlePointerMove = (moveEvent: PointerEvent) => {
          onResize(moveEvent.clientY - lastY);
          lastY = moveEvent.clientY;
        };
        const handlePointerUp = () => {
          window.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener("pointerup", handlePointerUp);
        };
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          onResize(24);
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          onResize(-24);
        }
      }}
    >
      <GripHorizontal size={16} />
    </div>
  );
}

function clampTemplateListHeight(value: number): number {
  return Math.min(720, Math.max(120, Math.round(value)));
}

function ApplyTemplateDialog({
  name,
  onCancel,
  onConfirm,
  t,
}: {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
  t: Translator;
}) {
  return (
    <div className="modal-backdrop confirm-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="apply-template-title">
        <div className="modal-title-block">
          <h2 id="apply-template-title">{t("left.applyTemplateQuestion")}</h2>
        </div>
        <p>{t("left.applyTemplateCopy", { name })}</p>
        <div className="confirm-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            {t("inspector.cancel")}
          </button>
          <button type="button" className="primary-button" onClick={onConfirm}>
            {t("left.applyTemplate")}
          </button>
        </div>
      </section>
    </div>
  );
}
