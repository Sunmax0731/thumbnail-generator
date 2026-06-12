import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  FolderOpen,
  GripHorizontal,
  ImagePlus,
  Layers,
  LayoutTemplate,
  Radio,
  Save,
  Scissors,
  Video,
  Trash2,
  Youtube,
} from "lucide-react";
import { LayerPanel, type LayerPanelProps } from "./LayerPanel";
import {
  buildCreativeTemplate,
  createDefaultCreativeDraft,
  type CreativeGeneratorKind,
  type CreativeGeneratorRequest,
} from "../lib/creativeGenerator";
import type { FontOption } from "../lib/fonts";
import type { Language, Translator } from "../lib/i18n";
import { readGeneratorSettings, writeGeneratorSettings } from "../lib/generatorSettings";
import {
  addDays,
  buildScheduleTemplate,
  type ScheduleBuilderRequest,
} from "../lib/scheduleBuilder";
import { normalizeColor, type PaletteColor, type SavedColorPalette } from "../lib/colorPalette";
import type { SavedTemplate } from "../lib/templates";
import type { ImageAsset, OutputSettings, TextLayer } from "../lib/types";
import { renderThumbnailToCanvas } from "../lib/renderCanvas";

type LeftPanelSection = "templates" | "layers" | "assets";
export type QuickLayerKind = "headline" | "subtitle" | "badge" | "divider";

interface LeftPanelProps {
  assets: ImageAsset[];
  selectedAssetKey: string;
  layerPanelProps: Omit<LayerPanelProps, "t">;
  templateName: string;
  templates: SavedTemplate[];
  fontOptions: FontOption[];
  settings: OutputSettings;
  language: Language;
  paletteColors: PaletteColor[];
  savedColorPalettes: SavedColorPalette[];
  onImageFiles: (files: FileList | null) => void;
  onSelectAsset: (key: string) => void;
  onAddImageAssetLayer: (key: string) => void;
  onDeleteAsset: (key: string) => void;
  onGenerateScheduleTemplate: (request: ScheduleBuilderRequest) => void;
  onGenerateCreativeTemplate: (request: CreativeGeneratorRequest) => void;
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
  fontOptions,
  settings,
  language,
  paletteColors,
  savedColorPalettes,
  onImageFiles,
  onSelectAsset,
  onAddImageAssetLayer,
  onDeleteAsset,
  onGenerateScheduleTemplate,
  onGenerateCreativeTemplate,
  onTemplateNameChange,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  onOpenImageLab,
  t,
}: LeftPanelProps) {
  const [activeSection, setActiveSection] = useState<LeftPanelSection>("templates");
  const [browserTemplateListHeight, setBrowserTemplateListHeight] = useState(220);
  const [templateApplyCandidate, setTemplateApplyCandidate] = useState<{ id: string; name: string } | null>(null);
  const [templateDeleteCandidate, setTemplateDeleteCandidate] = useState<{ id: string; name: string } | null>(null);
  const [isScheduleBuilderOpen, setIsScheduleBuilderOpen] = useState(false);
  const [activeCreativeBuilder, setActiveCreativeBuilder] = useState<CreativeGeneratorKind | null>(null);
  const [scheduleDraft, setScheduleDraft] = useState<ScheduleBuilderRequest>(() =>
    readGeneratorSettings("schedule", createDefaultScheduleDraft()),
  );
  const [creativeDrafts, setCreativeDrafts] = useState<Record<CreativeGeneratorKind, CreativeGeneratorRequest>>(() => ({
    "youtube-waiting": readGeneratorSettings("creative.youtube-waiting", createDefaultCreativeDraft("youtube-waiting")),
    "video-thumbnail": readGeneratorSettings("creative.video-thumbnail", createDefaultCreativeDraft("video-thumbnail")),
    "stream-waiting": readGeneratorSettings("creative.stream-waiting", createDefaultCreativeDraft("stream-waiting")),
  }));

  const updateCreativeDraft = (kind: CreativeGeneratorKind, draft: CreativeGeneratorRequest) => {
    setCreativeDrafts((current) => ({ ...current, [kind]: draft }));
  };

  const saveScheduleDraft = () => writeGeneratorSettings("schedule", scheduleDraft);
  const saveCreativeDraft = (kind: CreativeGeneratorKind, draft = creativeDrafts[kind]) =>
    writeGeneratorSettings(`creative.${kind}`, draft);

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
          <section className="panel-section generator-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("generator.sectionTitle")}</h2>
              <span className="section-count">4</span>
            </div>
            <div className="generator-entry-grid">
              <button type="button" className="generator-entry-button" onClick={() => setIsScheduleBuilderOpen(true)}>
                <CalendarDays size={17} />
                <span>
                  <strong>{t("scheduleBuilder.open")}</strong>
                  <small>{t("scheduleBuilder.entryCopy")}</small>
                </span>
              </button>
              <button type="button" className="generator-entry-button" onClick={() => setActiveCreativeBuilder("youtube-waiting")}>
                <Youtube size={17} />
                <span>
                  <strong>{t("generator.youtubeWaiting.open")}</strong>
                  <small>{t("generator.youtubeWaiting.copy")}</small>
                </span>
              </button>
              <button type="button" className="generator-entry-button" onClick={() => setActiveCreativeBuilder("video-thumbnail")}>
                <Video size={17} />
                <span>
                  <strong>{t("generator.videoThumbnail.open")}</strong>
                  <small>{t("generator.videoThumbnail.copy")}</small>
                </span>
              </button>
              <button type="button" className="generator-entry-button" onClick={() => setActiveCreativeBuilder("stream-waiting")}>
                <Radio size={17} />
                <span>
                  <strong>{t("generator.streamWaiting.open")}</strong>
                  <small>{t("generator.streamWaiting.copy")}</small>
                </span>
              </button>
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
            <div className="template-list" aria-label={t("left.savedTemplates")} style={{ height: browserTemplateListHeight }}>
              {templates.length === 0 ? (
                <p className="empty-note">{t("left.noTemplates")}</p>
              ) : (
                templates.map((template) => (
                  <div className="template-row" key={template.id}>
                    <button
                      type="button"
                      className="template-load"
                      onClick={() => setTemplateApplyCandidate({ id: template.id, name: template.name })}
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
            onLoadTemplate(templateApplyCandidate.id);
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
          fontOptions={fontOptions}
          settings={settings}
          language={language}
          paletteColors={paletteColors}
          savedColorPalettes={savedColorPalettes}
          onDraftChange={setScheduleDraft}
          onSaveSettings={saveScheduleDraft}
          onCancel={() => setIsScheduleBuilderOpen(false)}
          onConfirm={() => {
            saveScheduleDraft();
            onGenerateScheduleTemplate(scheduleDraft);
            setIsScheduleBuilderOpen(false);
          }}
          t={t}
        />
      ) : null}
      {activeCreativeBuilder ? (
        <CreativeBuilderDialog
          draft={creativeDrafts[activeCreativeBuilder]}
          fontOptions={fontOptions}
          settings={settings}
          paletteColors={paletteColors}
          savedColorPalettes={savedColorPalettes}
          onDraftChange={(draft) => updateCreativeDraft(activeCreativeBuilder, draft)}
          onSaveSettings={() => saveCreativeDraft(activeCreativeBuilder)}
          onCancel={() => setActiveCreativeBuilder(null)}
          onConfirm={() => {
            saveCreativeDraft(activeCreativeBuilder);
            onGenerateCreativeTemplate(creativeDrafts[activeCreativeBuilder]);
            setActiveCreativeBuilder(null);
          }}
          t={t}
        />
      ) : null}
    </aside>
  );
}

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
    weekdayLanguage: "en",
    dateFormat: "month-day",
    title: "",
    fontFamily: "'Noto Sans JP', 'Yu Gothic', 'Meiryo', Arial, sans-serif",
    fontWeight: "800",
    fontSize: 56,
    titleFontSize: 56,
    weekdayFontSize: 22,
    dateFontSize: 30,
    eventFontSize: 18,
    gridStyle: "cards",
    backgroundColor: "#f7fafc",
    surfaceColor: "#ffffff",
    accentColor: "#10b6d7",
    textColor: "#152033",
    cornerRadius: 8,
    strokeWidth: 3,
  actionCountMode: "uniform",
  actionsPerDay: 3,
  dailyActionCounts: [3, 3, 3, 3, 3, 3, 3],
  showAdjacentDays: false,
  groupLayers: true,
  weekendColorMode: "default",
  showBadge: true,
  };
}

function ScheduleBuilderDialog({
  draft,
  fontOptions,
  settings,
  language,
  paletteColors,
  savedColorPalettes,
  onDraftChange,
  onSaveSettings,
  onCancel,
  onConfirm,
  t,
}: {
  draft: ScheduleBuilderRequest;
  fontOptions: FontOption[];
  settings: OutputSettings;
  language: Language;
  paletteColors: PaletteColor[];
  savedColorPalettes: SavedColorPalette[];
  onDraftChange: (draft: ScheduleBuilderRequest) => void;
  onSaveSettings: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  t: Translator;
}) {
  type ScheduleColorTarget = "backgroundColor" | "surfaceColor" | "accentColor" | "textColor";
  const [activeColorTarget, setActiveColorTarget] = useState<ScheduleColorTarget | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const updateDraft = (next: ScheduleBuilderRequest) => {
    onDraftChange(next);
    setSettingsSaved(false);
  };
  const setDraft = <Key extends keyof ScheduleBuilderRequest>(key: Key, value: ScheduleBuilderRequest[Key]) => {
    updateDraft({ ...draft, [key]: value });
  };
  const isMonthSchedule = draft.kind === "month";
  const isWeekSchedule = draft.kind === "week";

  const colorTargets = [
    { key: "backgroundColor" as const, label: t("scheduleBuilder.backgroundColor"), value: draft.backgroundColor },
    { key: "surfaceColor" as const, label: t("scheduleBuilder.surfaceColor"), value: draft.surfaceColor },
    { key: "accentColor" as const, label: t("scheduleBuilder.accentColor"), value: draft.accentColor },
    { key: "textColor" as const, label: t("scheduleBuilder.textColor"), value: draft.textColor },
  ];

  const activeTargetMeta = activeColorTarget ? colorTargets.find((target) => target.key === activeColorTarget) : null;

  const updateMonthValue = (value: string) => {
    const [year, month] = value.split("-").map((part) => Number.parseInt(part, 10));
    if (Number.isFinite(year) && Number.isFinite(month)) updateDraft({ ...draft, year, month });
  };
  const updateDateValue = (value: string) => {
    const [year, month, day] = value.split("-").map((part) => Number.parseInt(part, 10));
    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) updateDraft({ ...draft, year, month, day });
  };
  const updateDailyActionCount = (index: number, value: string) => {
    const nextCounts = normalizeDailyCounts(draft).map((count, countIndex) =>
      countIndex === index ? Number.parseInt(value, 10) || 0 : count,
    );
    updateDraft({ ...draft, dailyActionCounts: nextCounts });
  };
  const previewTemplate = useMemo(() => buildScheduleTemplate(draft, settings, language), [draft, language, settings]);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    renderThumbnailToCanvas(canvas, previewTemplate.layers, [], previewTemplate.settings, { drawSelection: false }).catch(() => {});
  }, [previewTemplate]);

  const previewTitle = useMemo(() => {
    const titleLayer = previewTemplate.layers.find(
      (layer): layer is TextLayer =>
        layer.type === "text" && layer.name === "Schedule title",
    );
    return titleLayer?.text ?? "";
  }, [previewTemplate]);
  const previewAspectRatio = `${previewTemplate.settings.width} / ${previewTemplate.settings.height}`;

  return (
    <div className="modal-backdrop confirm-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="schedule-builder-dialog" role="dialog" aria-modal="true" aria-labelledby="schedule-builder-title">
        <div className="modal-header">
          <div className="modal-title-block">
            <h2 id="schedule-builder-title">{t("scheduleBuilder.title")}</h2>
            <p>{t("scheduleBuilder.betaNotice")}</p>
          </div>
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
            <div className="field-grid two">
              <label className="field">
                <span>{draft.kind === "month" ? t("scheduleBuilder.monthPicker") : t("scheduleBuilder.datePicker")}</span>
                <input
                  type={draft.kind === "month" ? "month" : "date"}
                  value={draft.kind === "month" ? formatMonthInputValue(draft) : formatDateInputValue(draft)}
                  onChange={(event) => (draft.kind === "month" ? updateMonthValue(event.currentTarget.value) : updateDateValue(event.currentTarget.value))}
                />
              </label>
              <label className="field">
                <span>{t("scheduleBuilder.weekdayLanguage")}</span>
                <select
                  value={draft.weekdayLanguage}
                  onChange={(event) => setDraft("weekdayLanguage", event.currentTarget.value as ScheduleBuilderRequest["weekdayLanguage"])}
                >
                  <option value="en">{t("scheduleBuilder.weekdayLanguage.en")}</option>
                  <option value="ja">{t("scheduleBuilder.weekdayLanguage.ja")}</option>
                </select>
              </label>
            </div>
            <div className="field-grid two">
              <label className="field">
                <span>{t("scheduleBuilder.weekStartsOn")}</span>
                <select value={draft.weekStartsOn} onChange={(event) => setDraft("weekStartsOn", event.currentTarget.value as ScheduleBuilderRequest["weekStartsOn"])}>
                  <option value="sunday">{t("scheduleBuilder.weekStartsOn.sunday")}</option>
                  <option value="monday">{t("scheduleBuilder.weekStartsOn.monday")}</option>
                </select>
              </label>
              <label className="field">
                <span>{t("scheduleBuilder.dateFormat")}</span>
                <select value={draft.dateFormat} onChange={(event) => setDraft("dateFormat", event.currentTarget.value as ScheduleBuilderRequest["dateFormat"])}>
                  <option value="day">{t("scheduleBuilder.dateFormat.day")}</option>
                  <option value="month-day">{t("scheduleBuilder.dateFormat.monthDay")}</option>
                </select>
              </label>
            </div>
            <label className="field">
              <span>{t("scheduleBuilder.weekendColorMode")}</span>
              <select
                value={draft.weekendColorMode}
                onChange={(event) => setDraft("weekendColorMode", event.currentTarget.value as ScheduleBuilderRequest["weekendColorMode"])}
              >
                <option value="default">{t("scheduleBuilder.weekendColorMode.default")}</option>
                <option value="grayscale">{t("scheduleBuilder.weekendColorMode.grayscale")}</option>
                <option value="sundaySaturday">{t("scheduleBuilder.weekendColorMode.sundaySaturday")}</option>
              </select>
            </label>
            <label className={`field checkbox-field ${isWeekSchedule ? "field-disabled" : ""}`}>
              <input
                type="checkbox"
                checked={isWeekSchedule ? false : draft.showAdjacentDays}
                disabled={isWeekSchedule}
                onChange={(event) => setDraft("showAdjacentDays", event.currentTarget.checked)}
              />
              <span>{t("scheduleBuilder.showAdjacentDays")}</span>
            </label>
            <label className={`field checkbox-field ${draft.kind === "week" ? "field-disabled" : ""}`}>
              <input
                type="checkbox"
                checked={draft.kind === "week" ? false : draft.showBadge}
                disabled={draft.kind === "week"}
                onChange={(event) => setDraft("showBadge", event.currentTarget.checked)}
              />
              <span>{t("scheduleBuilder.showBadge")}</span>
            </label>
            <label className="field checkbox-field">
              <input type="checkbox" checked={draft.groupLayers} onChange={(event) => setDraft("groupLayers", event.currentTarget.checked)} />
              <span>{t("scheduleBuilder.groupLayers")}</span>
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
            <div className="field-grid schedule-font-row">
              <label className="field schedule-font-family-field">
                <span>{t("scheduleBuilder.fontFamily")}</span>
                <select value={draft.fontFamily} onChange={(event) => setDraft("fontFamily", event.currentTarget.value)}>
                  {!fontOptions.some((option) => option.value === draft.fontFamily) ? (
                    <option value={draft.fontFamily}>{draft.fontFamily}</option>
                  ) : null}
                  {fontOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field schedule-font-weight-field">
                <span>{t("scheduleBuilder.fontWeight")}</span>
                <select value={draft.fontWeight} onChange={(event) => setDraft("fontWeight", event.currentTarget.value)}>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                </select>
              </label>
            </div>
            <div className="field-grid two">
              <ScheduleSlider
                label={t("scheduleBuilder.titleFontSize")}
                value={draft.titleFontSize}
                min={24}
                max={140}
                onChange={(value) => setDraft("titleFontSize", value)}
              />
              <ScheduleSlider
                label={t("scheduleBuilder.weekdayFontSize")}
                value={draft.weekdayFontSize}
                min={10}
                max={72}
                onChange={(value) => setDraft("weekdayFontSize", value)}
              />
            </div>
            <div className="field-grid two">
              <ScheduleSlider
                label={t("scheduleBuilder.dateFontSize")}
                value={draft.dateFontSize}
                min={10}
                max={96}
                onChange={(value) => setDraft("dateFontSize", value)}
              />
              <ScheduleSlider
                label={t("scheduleBuilder.eventFontSize")}
                value={draft.eventFontSize}
                min={10}
                max={72}
                onChange={(value) => setDraft("eventFontSize", value)}
              />
            </div>
            <label className="field schedule-grid-style-field">
              <span>{t("scheduleBuilder.gridStyle")}</span>
              <select value={draft.gridStyle} onChange={(event) => setDraft("gridStyle", event.currentTarget.value as ScheduleBuilderRequest["gridStyle"])}>
                <option value="cards">{t("scheduleBuilder.gridStyle.cards")}</option>
                <option value="lines">{t("scheduleBuilder.gridStyle.lines")}</option>
              </select>
            </label>
            <div className="field-grid two">
              <ScheduleSlider
                label={t("scheduleBuilder.cornerRadius")}
                value={draft.cornerRadius}
                min={0}
                max={32}
                onChange={(value) => setDraft("cornerRadius", value)}
              />
              <ScheduleSlider
                label={t("scheduleBuilder.strokeWidth")}
                value={draft.strokeWidth}
                min={0}
                max={12}
                onChange={(value) => setDraft("strokeWidth", value)}
              />
            </div>
            <div className="field-grid schedule-action-count-row">
              <label className={`field schedule-action-mode-field ${isMonthSchedule ? "field-disabled" : ""}`}>
                <span>{t("scheduleBuilder.actionCountMode")}</span>
                <select
                  value={draft.actionCountMode}
                  disabled={isMonthSchedule}
                  onChange={(event) => setDraft("actionCountMode", event.currentTarget.value as ScheduleBuilderRequest["actionCountMode"])}
                >
                  <option value="uniform">{t("scheduleBuilder.actionCountMode.uniform")}</option>
                  <option value="individual">{t("scheduleBuilder.actionCountMode.individual")}</option>
                </select>
              </label>
              <ScheduleSlider
                label={t("scheduleBuilder.actionsPerDay")}
                value={draft.actionsPerDay}
                min={0}
                max={6}
                onChange={(value) => setDraft("actionsPerDay", value)}
              />
            </div>
            {draft.kind === "week" && draft.actionCountMode === "individual" ? (
              <div className="daily-action-grid" aria-label={t("scheduleBuilder.dailyActionCounts")}>
                {getPreviewWeekDates(draft).map((date, index) => (
                  <label className="field" key={`${date.month}-${date.day}-${index}`}>
                    <span>{`${getWeekdayLabel(draft, date.weekday)} ${formatPreviewDate(date, draft.dateFormat)}`}</span>
                    <input
                      type="range"
                      min={0}
                      max={6}
                      value={normalizeDailyCounts(draft)[index]}
                      onChange={(event) => updateDailyActionCount(index, event.currentTarget.value)}
                    />
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={normalizeDailyCounts(draft)[index]}
                      onChange={(event) => updateDailyActionCount(index, event.currentTarget.value)}
                    />
                  </label>
                ))}
              </div>
            ) : null}
          </section>

          <section className="panel-section schedule-color-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("scheduleBuilder.colorSection")}</h2>
            </div>
            <div className="schedule-color-target-grid">
              {colorTargets.map((target) => (
                <button
                  className={`schedule-color-target-button ${activeColorTarget === target.key ? "selected" : ""}`}
                  type="button"
                  key={target.key}
                  onClick={() => setActiveColorTarget(target.key)}
                >
                  <span>{target.label}</span>
                  <div className="schedule-color-target-button-row">
                    <span className="schedule-color-preview" style={{ background: normalizeColor(target.value) ?? target.value }} aria-hidden="true" />
                  </div>
                </button>
              ))}
            </div>
            {activeTargetMeta ? (
              <ScheduleColorPickerModal
                targetLabel={activeTargetMeta.label}
                value={activeTargetMeta.value}
                paletteColors={paletteColors}
                savedColorPalettes={savedColorPalettes}
                onApply={(value) => {
                  if (!activeColorTarget) return;
                  setDraft(activeColorTarget, value);
                  setActiveColorTarget(null);
                }}
                onClose={() => setActiveColorTarget(null)}
                t={t}
              />
            ) : null}
          </section>
          <section className="panel-section schedule-preview-section">
            <div className="section-heading">
              <CalendarDays size={16} />
              <h2>{t("scheduleBuilder.previewSection")}</h2>
            </div>
            <div className="schedule-preview-canvas-shell" style={{ aspectRatio: previewAspectRatio }}>
              <canvas ref={previewCanvasRef} className="schedule-preview-canvas" aria-label={previewTitle} />
            </div>
          </section>
        </div>

        <div className="confirm-actions schedule-builder-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            {t("inspector.cancel")}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              onSaveSettings();
              setSettingsSaved(true);
            }}
          >
            {settingsSaved ? t("generator.settingsSaved") : t("generator.saveSettings")}
          </button>
          <button type="button" className="primary-button" onClick={onConfirm}>
            {t("scheduleBuilder.generate")}
          </button>
          </div>
      </section>
    </div>
  );
}

function ScheduleColorPickerModal({
  targetLabel,
  value,
  paletteColors,
  savedColorPalettes,
  onApply,
  onClose,
  t,
}: {
  targetLabel: string;
  value: string;
  paletteColors: PaletteColor[];
  savedColorPalettes: SavedColorPalette[];
  onApply: (value: string) => void;
  onClose: () => void;
  t: Translator;
}) {
  const [draftValue, setDraftValue] = useState(value);

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  const commitDraft = () => {
    const normalized = normalizeColor(draftValue);
    if (normalized) {
      onApply(normalized);
      return;
    }
    setDraftValue(value);
  };

  return (
    <div className="modal-backdrop confirm-backdrop schedule-color-picker-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="schedule-color-picker-modal" role="dialog" aria-modal="true" aria-label={targetLabel} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-block">
            <h2>{`${t("scheduleBuilder.colorSection")} / ${targetLabel}`}</h2>
          </div>
          <button type="button" className="ghost-button schedule-color-picker-close" onClick={() => onClose()}>
            ✕
          </button>
        </div>
        <label className="field">
          <span>HEX</span>
          <div className="schedule-color-input-row">
            <span className="schedule-color-preview" style={{ background: normalizeColor(draftValue) ?? draftValue }} aria-hidden="true" />
            <input
              type="text"
              value={draftValue}
              onChange={(event) => setDraftValue(event.currentTarget.value)}
              onBlur={commitDraft}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitDraft();
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  setDraftValue(value);
                  onClose();
                }
              }}
            />
          </div>
        </label>
        <div className="schedule-color-list-group">
          <p className="schedule-color-list-title">{t("inspector.registeredColors")}</p>
          {paletteColors.length === 0 ? (
            <p className="schedule-empty-message">{t("scheduleBuilder.noRegisteredColors")}</p>
          ) : (
            <div className="schedule-color-swatch-grid">
              {paletteColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={`schedule-color-swatch ${normalizeColor(value) === color.value ? "selected" : ""}`}
                  style={{ background: color.value }}
                  title={`${color.name}: ${color.value}`}
                  onClick={() => onApply(color.value)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="schedule-color-list-group">
          <p className="schedule-color-list-title">{t("inspector.savedPalettes")}</p>
          {savedColorPalettes.length === 0 ? (
            <p className="schedule-empty-message">{t("scheduleBuilder.noSavedPalettes")}</p>
          ) : (
            <div className="schedule-saved-palette-list">
              {savedColorPalettes.map((palette) => (
                <div className="schedule-saved-palette-row" key={palette.id}>
                  <div className="schedule-saved-palette-header">
                    <span>{palette.name}</span>
                    <small>{palette.mode}</small>
                  </div>
                  <div className="schedule-saved-palette-swatches">
                    {palette.colors.map((paletteColor) => (
                      <button
                        key={`${palette.id}-${paletteColor}`}
                        type="button"
                        className={`schedule-saved-palette-swatch ${normalizeColor(value) === paletteColor ? "selected" : ""}`}
                        style={{ background: paletteColor }}
                        title={paletteColor}
                        onClick={() => onApply(paletteColor)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </section>
    </div>
  );
}

function CreativeBuilderDialog({
  draft,
  fontOptions,
  settings,
  paletteColors,
  savedColorPalettes,
  onDraftChange,
  onSaveSettings,
  onCancel,
  onConfirm,
  t,
}: {
  draft: CreativeGeneratorRequest;
  fontOptions: FontOption[];
  settings: OutputSettings;
  paletteColors: PaletteColor[];
  savedColorPalettes: SavedColorPalette[];
  onDraftChange: (draft: CreativeGeneratorRequest) => void;
  onSaveSettings: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  t: Translator;
}) {
  type CreativeColorTarget = "backgroundColor" | "surfaceColor" | "accentColor" | "secondaryColor" | "textColor";
  const [activeColorTarget, setActiveColorTarget] = useState<CreativeColorTarget | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const previewTemplate = useMemo(() => buildCreativeTemplate(draft, settings), [draft, settings]);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const setDraft = <Key extends keyof CreativeGeneratorRequest>(key: Key, value: CreativeGeneratorRequest[Key]) => {
    onDraftChange({ ...draft, [key]: value });
    setSettingsSaved(false);
  };

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    renderThumbnailToCanvas(canvas, previewTemplate.layers, [], previewTemplate.settings, { drawSelection: false }).catch(() => {});
  }, [previewTemplate]);

  const title = getCreativeDialogTitle(draft.kind, t);
  const colorTargets = [
    { key: "backgroundColor" as const, label: t("scheduleBuilder.backgroundColor"), value: draft.backgroundColor },
    { key: "surfaceColor" as const, label: t("scheduleBuilder.surfaceColor"), value: draft.surfaceColor },
    { key: "accentColor" as const, label: t("scheduleBuilder.accentColor"), value: draft.accentColor },
    { key: "secondaryColor" as const, label: t("generator.secondaryColor"), value: draft.secondaryColor },
    { key: "textColor" as const, label: t("scheduleBuilder.textColor"), value: draft.textColor },
  ];
  const activeTargetMeta = activeColorTarget ? colorTargets.find((target) => target.key === activeColorTarget) : null;

  return (
    <div className="modal-backdrop confirm-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="schedule-builder-dialog creative-builder-dialog" role="dialog" aria-modal="true" aria-labelledby="creative-builder-title">
        <div className="modal-header">
          <div className="modal-title-block">
            <h2 id="creative-builder-title">{title}</h2>
            <p>{t("generator.betaNotice")}</p>
          </div>
        </div>

        <div className="schedule-builder-grid creative-builder-grid">
          <section className="panel-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("generator.contentSection")}</h2>
            </div>
            {draft.kind === "video-thumbnail" ? (
              <label className="field">
                <span>{t("generator.videoVariant")}</span>
                <select value={draft.variant} onChange={(event) => setDraft("variant", event.currentTarget.value as CreativeGeneratorRequest["variant"])}>
                  <option value="standard">{t("generator.videoVariant.standard")}</option>
                  <option value="vertical">{t("generator.videoVariant.vertical")}</option>
                  <option value="cutout">{t("generator.videoVariant.cutout")}</option>
                </select>
              </label>
            ) : null}
            <label className="field">
              <span>{t("scheduleBuilder.titleLabel")}</span>
              <input value={draft.title} onChange={(event) => setDraft("title", event.currentTarget.value)} />
            </label>
            <label className="field">
              <span>{t("generator.subtitle")}</span>
              <input value={draft.subtitle} onChange={(event) => setDraft("subtitle", event.currentTarget.value)} />
            </label>
            <label className="field">
              <span>{t("generator.label")}</span>
              <input value={draft.label} onChange={(event) => setDraft("label", event.currentTarget.value)} />
            </label>
            <label className="field">
              <span>{t("generator.tone")}</span>
              <select value={draft.tone} onChange={(event) => setDraft("tone", event.currentTarget.value as CreativeGeneratorRequest["tone"])}>
                <option value="bold">{t("generator.tone.bold")}</option>
                <option value="clean">{t("generator.tone.clean")}</option>
                <option value="neon">{t("generator.tone.neon")}</option>
              </select>
            </label>
            <label className="field checkbox-field">
              <input type="checkbox" checked={draft.includeImageSlot} onChange={(event) => setDraft("includeImageSlot", event.currentTarget.checked)} />
              <span>{t("generator.includeImageSlot")}</span>
            </label>
            <label className="field checkbox-field">
              <input type="checkbox" checked={draft.groupLayers} onChange={(event) => setDraft("groupLayers", event.currentTarget.checked)} />
              <span>{t("scheduleBuilder.groupLayers")}</span>
            </label>
            <label className="field checkbox-field">
              <input type="checkbox" checked={draft.animated} onChange={(event) => setDraft("animated", event.currentTarget.checked)} />
              <span>{t("generator.animated")}</span>
            </label>
          </section>

          <section className="panel-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("scheduleBuilder.styleSection")}</h2>
            </div>
            <div className="field-grid schedule-font-row">
              <label className="field schedule-font-family-field">
                <span>{t("scheduleBuilder.fontFamily")}</span>
                <select value={draft.fontFamily} onChange={(event) => setDraft("fontFamily", event.currentTarget.value)}>
                  {!fontOptions.some((option) => option.value === draft.fontFamily) ? (
                    <option value={draft.fontFamily}>{draft.fontFamily}</option>
                  ) : null}
                  {fontOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field schedule-font-weight-field">
                <span>{t("scheduleBuilder.fontWeight")}</span>
                <select value={draft.fontWeight} onChange={(event) => setDraft("fontWeight", event.currentTarget.value)}>
                  <option value="600">600</option>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                </select>
              </label>
            </div>
            <div className="field-grid two">
              <ScheduleSlider
                label={t("scheduleBuilder.titleFontSize")}
                value={draft.titleFontSize}
                min={24}
                max={180}
                onChange={(value) => setDraft("titleFontSize", value)}
              />
              <ScheduleSlider
                label={t("scheduleBuilder.eventFontSize")}
                value={draft.subtitleFontSize}
                min={12}
                max={96}
                onChange={(value) => setDraft("subtitleFontSize", value)}
              />
            </div>
          </section>

          <section className="panel-section schedule-color-section">
            <div className="section-heading">
              <LayoutTemplate size={16} />
              <h2>{t("scheduleBuilder.colorSection")}</h2>
            </div>
            <div className="schedule-color-target-grid">
              {colorTargets.map((target) => (
                <button
                  className={`schedule-color-target-button ${activeColorTarget === target.key ? "selected" : ""}`}
                  type="button"
                  key={target.key}
                  onClick={() => setActiveColorTarget(target.key)}
                >
                  <span>{target.label}</span>
                  <div className="schedule-color-target-button-row">
                    <span className="schedule-color-preview" style={{ background: normalizeColor(target.value) ?? target.value }} aria-hidden="true" />
                  </div>
                </button>
              ))}
            </div>
            {activeTargetMeta ? (
              <ScheduleColorPickerModal
                targetLabel={activeTargetMeta.label}
                value={activeTargetMeta.value}
                paletteColors={paletteColors}
                savedColorPalettes={savedColorPalettes}
                onApply={(value) => {
                  if (!activeColorTarget) return;
                  setDraft(activeColorTarget, value);
                  setActiveColorTarget(null);
                }}
                onClose={() => setActiveColorTarget(null)}
                t={t}
              />
            ) : null}
          </section>

          <section className="panel-section schedule-preview-section">
            <div className="section-heading">
              <Video size={16} />
              <h2>{t("scheduleBuilder.previewSection")}</h2>
            </div>
            <div className="schedule-preview-canvas-shell" style={{ aspectRatio: `${previewTemplate.settings.width} / ${previewTemplate.settings.height}` }}>
              <canvas ref={previewCanvasRef} className="schedule-preview-canvas" aria-label={title} />
            </div>
          </section>
        </div>

        <div className="confirm-actions schedule-builder-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            {t("inspector.cancel")}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              onSaveSettings();
              setSettingsSaved(true);
            }}
          >
            {settingsSaved ? t("generator.settingsSaved") : t("generator.saveSettings")}
          </button>
          <button type="button" className="primary-button" onClick={onConfirm}>
            {t("scheduleBuilder.generate")}
          </button>
        </div>
      </section>
    </div>
  );
}

function getCreativeDialogTitle(kind: CreativeGeneratorKind, t: Translator): string {
  if (kind === "youtube-waiting") return t("generator.youtubeWaiting.title");
  if (kind === "stream-waiting") return t("generator.streamWaiting.title");
  return t("generator.videoThumbnail.title");
}

function ScheduleSlider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const handleChange = (raw: string) => onChange(Number.parseInt(raw, 10) || min);
  return (
    <label className="field schedule-slider-field">
      <span>{label}</span>
      <input type="range" min={min} max={max} value={value} onChange={(event) => handleChange(event.currentTarget.value)} />
      <input type="number" min={min} max={max} value={value} onChange={(event) => handleChange(event.currentTarget.value)} />
    </label>
  );
}

function formatMonthInputValue(draft: ScheduleBuilderRequest): string {
  return `${draft.year}-${pad2(draft.month)}`;
}

function formatDateInputValue(draft: ScheduleBuilderRequest): string {
  return `${draft.year}-${pad2(draft.month)}-${pad2(draft.day)}`;
}

function getPreviewWeekDates(draft: ScheduleBuilderRequest) {
  return Array.from({ length: 7 }, (_, index) => addDays(draft.year, draft.month, draft.day, index));
}


function getWeekdayLabel(draft: ScheduleBuilderRequest, weekday: number): string {
  return draft.weekdayLanguage === "ja"
    ? ["日", "月", "火", "水", "木", "金", "土"][weekday]
    : ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][weekday];
}

function formatPreviewDate(date: { month: number; day: number }, format: ScheduleBuilderRequest["dateFormat"]): string {
  return format === "month-day" ? `${date.month}/${date.day}` : String(date.day);
}

function normalizeDailyCounts(draft: ScheduleBuilderRequest): number[] {
  return Array.from({ length: 7 }, (_, index) => clampPreviewCount(draft.dailyActionCounts?.[index] ?? draft.actionsPerDay));
}

function clampPreviewCount(value: number): number {
  return Math.min(6, Math.max(0, Math.round(value || 0)));
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
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
