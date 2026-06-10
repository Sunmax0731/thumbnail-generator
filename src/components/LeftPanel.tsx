import { useMemo, useState } from "react";
import {
  CalendarDays,
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
import type { ScheduleBuilderRequest } from "../lib/scheduleBuilder";
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
  onGenerateScheduleTemplate: (request: ScheduleBuilderRequest) => void;
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
  onGenerateScheduleTemplate,
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
  const [templateDeleteCandidate, setTemplateDeleteCandidate] = useState<{ id: string; name: string } | null>(null);
  const [isScheduleBuilderOpen, setIsScheduleBuilderOpen] = useState(false);
  const [scheduleDraft, setScheduleDraft] = useState<ScheduleBuilderRequest>(() => createDefaultScheduleDraft());
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
            <div className="schedule-builder-entry">
              <button type="button" className="secondary-button icon-text wide-button" onClick={() => setIsScheduleBuilderOpen(true)}>
                <CalendarDays size={16} /> {t("scheduleBuilder.open")}
              </button>
              <p>{t("scheduleBuilder.entryCopy")}</p>
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
                      onClick={() => setTemplateDeleteCandidate({ id: template.id, name: template.name })}
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
        <ConfirmTemplateDialog
          title={t("left.applyTemplateQuestion")}
          copy={t("left.applyTemplateCopy", { name: templateApplyCandidate.name })}
          confirmLabel={t("left.applyTemplate")}
          confirmClassName="primary-button"
          onCancel={() => setTemplateApplyCandidate(null)}
          onConfirm={() => {
            if (templateApplyCandidate.kind === "default") onLoadDefaultTemplate(templateApplyCandidate.id);
            else onLoadTemplate(templateApplyCandidate.id);
            setTemplateApplyCandidate(null);
          }}
          t={t}
        />
      ) : null}
      {templateDeleteCandidate ? (
        <ConfirmTemplateDialog
          title={t("left.deleteTemplateQuestion")}
          copy={t("left.deleteTemplateCopy", { name: templateDeleteCandidate.name })}
          confirmLabel={t("inspector.delete")}
          confirmClassName="primary-button danger-button"
          onCancel={() => setTemplateDeleteCandidate(null)}
          onConfirm={() => {
            onDeleteTemplate(templateDeleteCandidate.id);
            setTemplateDeleteCandidate(null);
          }}
          t={t}
        />
      ) : null}
      {isScheduleBuilderOpen ? (
        <ScheduleBuilderDialog
          draft={scheduleDraft}
          onDraftChange={setScheduleDraft}
          onCancel={() => setIsScheduleBuilderOpen(false)}
          onConfirm={() => {
            onGenerateScheduleTemplate(scheduleDraft);
            setIsScheduleBuilderOpen(false);
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

function createDefaultScheduleDraft(): ScheduleBuilderRequest {
  const now = new Date();
  return {
    kind: "month",
    orientation: "landscape",
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    weekStartsOn: "sunday",
    title: "",
    fontFamily: "Noto Sans JP, Arial, sans-serif",
    fontWeight: "800",
    gridStyle: "cards",
    backgroundColor: "#f7fafc",
    surfaceColor: "#ffffff",
    accentColor: "#10b6d7",
    textColor: "#152033",
    cornerRadius: 8,
    strokeWidth: 3,
    showAdjacentDays: false,
  };
}

function ScheduleBuilderDialog({
  draft,
  onDraftChange,
  onCancel,
  onConfirm,
  t,
}: {
  draft: ScheduleBuilderRequest;
  onDraftChange: (draft: ScheduleBuilderRequest) => void;
  onCancel: () => void;
  onConfirm: () => void;
  t: Translator;
}) {
  const setDraft = <Key extends keyof ScheduleBuilderRequest>(key: Key, value: ScheduleBuilderRequest[Key]) => {
    onDraftChange({ ...draft, [key]: value });
  };
  const setNumber = (key: "year" | "month" | "day" | "cornerRadius" | "strokeWidth", value: string) => {
    setDraft(key, Number.parseInt(value, 10) || 0);
  };

  return (
    <div className="modal-backdrop confirm-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="schedule-builder-dialog" role="dialog" aria-modal="true" aria-labelledby="schedule-builder-title">
        <div className="modal-header">
          <div className="modal-title-block">
            <h2 id="schedule-builder-title">{t("scheduleBuilder.title")}</h2>
            <p>{t("scheduleBuilder.betaNotice")}</p>
          </div>
          <button type="button" className="secondary-button modal-close" onClick={onCancel}>
            {t("inspector.cancel")}
          </button>
        </div>

        <div className="schedule-builder-grid">
          <section className="panel-section">
            <div className="section-heading">
              <CalendarDays size={16} />
              <h2>{t("scheduleBuilder.dateSection")}</h2>
            </div>
            <div className="field-grid two">
              <label className="field">
                <span>{t("scheduleBuilder.kind")}</span>
                <select value={draft.kind} onChange={(event) => setDraft("kind", event.currentTarget.value as ScheduleBuilderRequest["kind"])}>
                  <option value="month">{t("scheduleBuilder.kind.month")}</option>
                  <option value="week">{t("scheduleBuilder.kind.week")}</option>
                </select>
              </label>
              <label className="field">
                <span>{t("scheduleBuilder.orientation")}</span>
                <select
                  value={draft.orientation}
                  onChange={(event) => setDraft("orientation", event.currentTarget.value as ScheduleBuilderRequest["orientation"])}
                >
                  <option value="landscape">{t("scheduleBuilder.orientation.landscape")}</option>
                  <option value="portrait">{t("scheduleBuilder.orientation.portrait")}</option>
                  <option value="current">{t("scheduleBuilder.orientation.current")}</option>
                </select>
              </label>
            </div>
            <div className="field-grid three">
              <label className="field">
                <span>{t("scheduleBuilder.year")}</span>
                <input type="number" min={1970} max={2100} value={draft.year} onChange={(event) => setNumber("year", event.currentTarget.value)} />
              </label>
              <label className="field">
                <span>{t("scheduleBuilder.month")}</span>
                <input type="number" min={1} max={12} value={draft.month} onChange={(event) => setNumber("month", event.currentTarget.value)} />
              </label>
              <label className={`field ${draft.kind === "month" ? "field-disabled" : ""}`}>
                <span>{t("scheduleBuilder.day")}</span>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={draft.day}
                  disabled={draft.kind === "month"}
                  onChange={(event) => setNumber("day", event.currentTarget.value)}
                />
              </label>
            </div>
            <label className="field">
              <span>{t("scheduleBuilder.weekStartsOn")}</span>
              <select value={draft.weekStartsOn} onChange={(event) => setDraft("weekStartsOn", event.currentTarget.value as ScheduleBuilderRequest["weekStartsOn"])}>
                <option value="sunday">{t("scheduleBuilder.weekStartsOn.sunday")}</option>
                <option value="monday">{t("scheduleBuilder.weekStartsOn.monday")}</option>
              </select>
            </label>
            <label className="field checkbox-field">
              <input type="checkbox" checked={draft.showAdjacentDays} onChange={(event) => setDraft("showAdjacentDays", event.currentTarget.checked)} />
              <span>{t("scheduleBuilder.showAdjacentDays")}</span>
            </label>
          </section>

          <section className="panel-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("scheduleBuilder.styleSection")}</h2>
            </div>
            <label className="field">
              <span>{t("scheduleBuilder.titleLabel")}</span>
              <input type="text" value={draft.title} placeholder={t("scheduleBuilder.titlePlaceholder")} onChange={(event) => setDraft("title", event.currentTarget.value)} />
            </label>
            <div className="field-grid two">
              <label className="field">
                <span>{t("scheduleBuilder.fontFamily")}</span>
                <select value={draft.fontFamily} onChange={(event) => setDraft("fontFamily", event.currentTarget.value)}>
                  <option value="Noto Sans JP, Arial, sans-serif">Noto Sans JP</option>
                  <option value="Arial Black, Arial, sans-serif">Arial Black</option>
                  <option value="Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif">Impact</option>
                  <option value="Montserrat, Arial, sans-serif">Montserrat</option>
                  <option value="M PLUS Rounded 1c, Arial, sans-serif">M PLUS Rounded</option>
                </select>
              </label>
              <label className="field">
                <span>{t("scheduleBuilder.fontWeight")}</span>
                <select value={draft.fontWeight} onChange={(event) => setDraft("fontWeight", event.currentTarget.value)}>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                </select>
              </label>
            </div>
            <div className="field-grid two">
              <label className="field">
                <span>{t("scheduleBuilder.gridStyle")}</span>
                <select value={draft.gridStyle} onChange={(event) => setDraft("gridStyle", event.currentTarget.value as ScheduleBuilderRequest["gridStyle"])}>
                  <option value="cards">{t("scheduleBuilder.gridStyle.cards")}</option>
                  <option value="lines">{t("scheduleBuilder.gridStyle.lines")}</option>
                </select>
              </label>
              <label className="field">
                <span>{t("scheduleBuilder.cornerRadius")}</span>
                <input type="number" min={0} max={32} value={draft.cornerRadius} onChange={(event) => setNumber("cornerRadius", event.currentTarget.value)} />
              </label>
            </div>
            <label className="field">
              <span>{t("scheduleBuilder.strokeWidth")}</span>
              <input type="number" min={0} max={12} value={draft.strokeWidth} onChange={(event) => setNumber("strokeWidth", event.currentTarget.value)} />
            </label>
          </section>

          <section className="panel-section schedule-color-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("scheduleBuilder.colorSection")}</h2>
            </div>
            <ColorInput label={t("scheduleBuilder.backgroundColor")} value={draft.backgroundColor} onChange={(value) => setDraft("backgroundColor", value)} />
            <ColorInput label={t("scheduleBuilder.surfaceColor")} value={draft.surfaceColor} onChange={(value) => setDraft("surfaceColor", value)} />
            <ColorInput label={t("scheduleBuilder.accentColor")} value={draft.accentColor} onChange={(value) => setDraft("accentColor", value)} />
            <ColorInput label={t("scheduleBuilder.textColor")} value={draft.textColor} onChange={(value) => setDraft("textColor", value)} />
          </section>
        </div>

        <div className="confirm-actions schedule-builder-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            {t("inspector.cancel")}
          </button>
          <button type="button" className="primary-button" onClick={onConfirm}>
            {t("scheduleBuilder.generate")}
          </button>
        </div>
      </section>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field schedule-color-field">
      <span>{label}</span>
      <input type="color" value={value} onChange={(event) => onChange(event.currentTarget.value)} />
      <input type="text" value={value} onChange={(event) => onChange(event.currentTarget.value)} />
    </label>
  );
}

function ConfirmTemplateDialog({
  title,
  copy,
  confirmLabel,
  confirmClassName,
  onCancel,
  onConfirm,
  t,
}: {
  title: string;
  copy: string;
  confirmLabel: string;
  confirmClassName: string;
  onCancel: () => void;
  onConfirm: () => void;
  t: Translator;
}) {
  return (
    <div className="modal-backdrop confirm-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="template-confirm-title">
        <div className="modal-title-block">
          <h2 id="template-confirm-title">{title}</h2>
        </div>
        <p>{copy}</p>
        <div className="confirm-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            {t("inspector.cancel")}
          </button>
          <button type="button" className={confirmClassName} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
